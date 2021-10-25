import { AudioPlayerStatus, AudioResource, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";
import { Discord, Slash } from "discordx";
import { subscriptions } from "../client";
import { playSong } from "../logic/play";
import { MusicSubscription } from "../logic/subscription";
import { Track } from "../logic/track";
import { BaseCommand } from "./baseCommand";

@Discord()
class JoinCommand extends BaseCommand {
    @Slash("join", { description: "Makes Jürgen join the channel" })
    async join(interaction: CommandInteraction) {
        await interaction.deferReply();
        let subscription = this.getSubscription(interaction);
        let nowPlaying, queue;

        if (subscription && subscription.audioPlayer.state.status !== AudioPlayerStatus.Idle) {
            nowPlaying = (subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.url;
            queue = subscription.queue;
        }

        subscription?.voiceConnection.destroy();
        subscriptions.delete(interaction.guildId!);

        if (nowPlaying) {
            await playSong(interaction, nowPlaying);
        } else {
            if (!interaction.guildId) return;
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

        if (queue) {
            queue.forEach(async (q) => {
                await playSong(interaction, q.url);
            });
        }

        interaction.followUp('Hi');
    }
}