import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class ClearCommand extends BaseCommand{
    @Slash("clear", { description: "Clears the queue" })
    clear(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
			subscription.clear();
			interaction.reply('Queue cleared');
		} else {
			interaction.reply(this.notPlaying);
		}
    }
}