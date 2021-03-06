import { AudioResource, createAudioResource, StreamType } from '@discordjs/voice';
import { downloadFromVideo, getVideoInfo } from "youtube-scrapper";

/**
 * This is the data required to create a Track object
 */
export interface TrackData {
    url: string;
    title: string;
    onStart: (title: string) => void;
    onFinish: (title: string) => void;
    onError: (error: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
export class Track implements TrackData {
    public readonly url: string;
    public readonly title: string;
    public readonly onStart: (title: string) => void;
    public readonly onFinish: (title: string) => void;
    public readonly onError: (error: Error) => void;

    private constructor({ url, title, onStart, onFinish, onError }: TrackData) {
        this.url = url;
        this.title = title;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }

    /**
     * Creates an AudioResource from this Track.
     */
    public async createAudioResource(): Promise<AudioResource<Track>> {
        const video = await getVideoInfo(this.url);
        const format = video.formats.find(f => f.hasAudio && f.mimeType.includes('audio')) ?? video.formats.find(f => f.hasAudio);
        const stream = downloadFromVideo(video, format, { chunkMode: { chunkSize: undefined }, })
        return createAudioResource(stream, { inputType: StreamType.Arbitrary, metadata: this });
    }

    /**
     * Creates a Track from a video URL and lifecycle callback methods.
     *
     * @param url The URL of the video
     * @param methods Lifecycle callbacks
     * @returns The created Track
     */
    public static async from(url: string, methods: Pick<Track, 'onStart' | 'onFinish' | 'onError'>): Promise<Track> {
        const info = await getVideoInfo(url);

        // The methods are wrapped so that we can ensure that they are only called once.
        const wrappedMethods = {
            onStart() {
                wrappedMethods.onStart = noop;
                methods.onStart(info.details.title);
            },
            onFinish() {
                wrappedMethods.onFinish = noop;
                methods.onFinish(info.details.title);
            },
            onError(error: Error) {
                wrappedMethods.onError = noop;
                methods.onError(error);
            },
        };

        return new Track({
            title: info.details.title,
            url,
            ...wrappedMethods,
        });
    }
}