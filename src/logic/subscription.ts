import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	entersState,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus
} from '@discordjs/voice';
import { promisify } from 'util';
import { Track } from './track';

const wait = promisify(setTimeout);

/**
 * A MusicSubscription exists for each active VoiceConnection. Each subscription has its own audio player and queue,
 * and it also attaches logic to the audio player and voice connection for error handling and reconnection logic.
 */
export class MusicSubscription {
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;
	public queue: Track[];
	public queueLock = false;
	public readyLock = false;
	public onDone: Function;

	public constructor(voiceConnection: VoiceConnection, onDone: Function) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.queue = [];
		this.onDone = onDone;

		this.voiceConnection.on('stateChange', async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					/*
						If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						but there is a chance the connection will recover itself if the reason of the disconnect was due to
						switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						the voice connection.
					*/
					try {
						await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
						// Probably moved voice channel
					} catch {
						this.voiceConnection.destroy();
						// Probably removed from voice channel
					}
				} else if (this.voiceConnection.rejoinAttempts < 5) {
					/*
						The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					*/
					await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
					this.voiceConnection.rejoin();
				} else {
					/*
						The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					*/
					this.voiceConnection.destroy();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				/*
					Once destroyed, stop the subscription
				*/
				this.stop();
			} else if (
				!this.readyLock &&
				(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
			) {
				/*
					In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
					before destroying the voice connection. This stops the voice connection permanently existing in one of these
					states.
				*/
				this.readyLock = true;
				try {
					await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		// Configure audio player
		this.audioPlayer.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				// If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
				(oldState.resource as AudioResource<Track>).metadata.onFinish((oldState.resource as AudioResource<Track>).metadata.title);
				void this.processQueue();
			} else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
				(newState.resource as AudioResource<Track>).metadata.onStart((newState.resource as AudioResource<Track>).metadata.title);
			}
		});

		this.audioPlayer.on('error', (error) => (error.resource as AudioResource<Track>).metadata.onError(error));

		voiceConnection.subscribe(this.audioPlayer);
	}

	/**
	 * Adds a new Track to the queue.
	 *
	 * @param track The track to add to the queue
	 */
	public enqueue(track: Track) {
		this.queue.push(track);
		void this.processQueue();
	}

	/**
	 * Removes a track from the queue
	 *
	 * @param track The track index to remove
	 */
	public remove(index: number) {
		return this.queue.splice(index, 1);
	}

	/**
	 * Shuffles the queue
	 */
	public shuffle() {
		for (let i = this.queue.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this.queue[i];
			this.queue[i] = this.queue[j];
			this.queue[j] = temp;
		}
	}

	/**
	 * Stops audio playback and empties the queue
	 */
	public stop() {
		this.clear();
		this.audioPlayer.stop(true);
	}

	/**
	 * Empties the queue
	 */
	public clear() {
		this.queueLock = true;
		this.queue = [];
	}

	/**
	 * Attempts to play a Track from the queue
	 */
	private async processQueue(): Promise<void> {
		// If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			if (this.queue.length === 0) {
				this.voiceConnection.destroy();
				this.onDone();
			}
			return;
		}
		// Lock the queue to guarantee safe access
		this.queueLock = true;

		// Take the first item from the queue. This is guaranteed to exist due to the non-empty check above.
		const nextTrack = this.queue.shift()!;
		try {
			// Attempt to convert the Track into an AudioResource (i.e. start streaming the video)
			const resource = await nextTrack.createAudioResource();
			this.audioPlayer.play(resource);
			this.queueLock = false;
		} catch (error) {
			// If an error occurred, try the next item of the queue instead
			nextTrack.onError(error as Error);
			this.queueLock = false;
			return this.processQueue();
		}
	}
}