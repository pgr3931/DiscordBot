import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Track } from "../logic/track";
import { BaseCommand } from "./baseCommand";

@Discord()
class ShuffleCommand extends BaseCommand {
    @Slash("shuffle", { description: "Shuffles the queue" })
    resume(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
            if (subscription.queue.length === 0) {
                interaction.reply("Can't really shuffle an empty queue, can I?");
            } else if (subscription.queue.length === 1) {
                interaction.reply('The queue only has one song, so no shuffling');
            } else if (subscription.queue.length > 1) {
                subscription.shuffle();
                const current =
                    subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
                        ? `Nothing is currently playing`
                        : `Now Playing: **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`;

                const queue = subscription.queue
                    .slice(0, 5)
                    .map((track, index) => `#${index + 1} ${track.title}`)
                    .join('\n');

                interaction.reply(`Queue shuffled\n\n${current}\n\n${queue}`);
            }
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}