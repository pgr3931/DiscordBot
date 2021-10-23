import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Track } from "../logic/track";
import { BaseCommand } from "./baseCommand";

@Discord()
class QueueCommand extends BaseCommand {
    @Slash("queue", { description: "Shows the next 5 songs in the queue" })
    @Slash("q", { description: "Shows the next 5 songs in the queue" })
    queue(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
			const current =
				subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
					? `Nothing is currently playing`
					: `Now Playing: **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`;

			const queue = subscription.queue
				.slice(0, 5)
				.map((track, index) => `#${index + 1} ${track.title}`)
				.join('\n');

			interaction.reply(`${current}\n\n${queue}`);
		} else {
			interaction.reply(this.notPlaying);
		}
    }
}