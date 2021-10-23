import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class SkipCommand extends BaseCommand{
    @Slash("skip", { description: "Skips the currently playing song" })
    skip(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
            // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
            // listener defined in subscription.ts, transitions into the Idle state mean the next track from the queue
            // will be loaded and played.
            subscription.audioPlayer.stop();
            interaction.reply('Skipped');
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}