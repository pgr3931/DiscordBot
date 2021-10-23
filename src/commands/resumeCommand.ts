import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class ResumeCommand extends BaseCommand {
    @Slash("resume", { description: "Resumes the currently paused song" })
    @Slash("unpause", { description: "Resumes the currently paused song" })
    resume(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
			subscription.audioPlayer.unpause();
			interaction.reply('Resumed');
		} else {
			interaction.reply(this.notPlaying);
		}
    }
}