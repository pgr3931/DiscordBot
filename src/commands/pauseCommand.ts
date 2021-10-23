import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class PauseCommand extends BaseCommand {
    @Slash("pause", { description: "Pauses the currently playing song" })
    pause(interaction: CommandInteraction) {
       const subscription = this.getSubscription(interaction);

        if (subscription) {
            subscription.audioPlayer.pause();
            interaction.reply('Paused');
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}