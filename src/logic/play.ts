import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { CommandInteraction, GuildMember } from 'discord.js';
import { subscriptions } from '../client';
import { MusicSubscription } from './subscription';
import { Track } from './track';
import ytsearch from 'yt-search';

export const getSongUrl = async (title: string) => {
    const result = await ytsearch(title);
    return result.videos?.[0]?.url;
}

export const playSong = async (interaction: CommandInteraction, url: string) => {
    if (!interaction.guildId) return;
    let subscription = subscriptions.get(interaction.guildId);

    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
        if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
            const channel = interaction.member.voice.channel;
            subscription = new MusicSubscription(
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    //@ts-ignore
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                }),
                () => {
                    subscriptions.delete(interaction.guildId!);
                    interaction.followUp("That's it folks");
                }
            );
            subscription.voiceConnection.on('error', console.warn);
            subscriptions.set(interaction.guildId, subscription);
        }
    }

    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
        await interaction.followUp("You need to be in a a voice channel to play music");
        return;
    }

    // Make sure the connection is ready before processing the user's request
    try {
        await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
    } catch (error) {
        console.warn(error);
        await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later');
        return;
    }

    try {
        // Attempt to create a Track from the user's video URL
        const track = await Track.from(url, {
            onStart() {
                interaction.followUp(`Now playing: **${track.title}**`).catch(console.warn);
            },
            onFinish() { },
            onError(error) {
                console.warn(error);
                interaction.followUp(`Error: ${error.message}`).catch(console.warn);
            },
        });
        // Enqueue the track and reply a success message to the user
        subscription.enqueue(track);
        await interaction.followUp(`Enqueued **${track.title}**`);
    } catch (error) {
        console.warn(error);
        await interaction.followUp(`Failed to play track. Error: ${error.message}`);
    }
}