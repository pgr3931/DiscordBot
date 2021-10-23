import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { subscriptions } from "../client";
import { BaseCommand } from "./baseCommand";

@Discord()
class LeaveCommand extends BaseCommand {
    @Slash("leave", { description: "Makes Jürgen leave the channel" })
    @Slash("l", { description: "Makes Jürgen leave the channel" })
    @Slash("disconnect", { description: "Makes Jürgen leave the channel" })
    leave(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
			subscription.voiceConnection.destroy();
			subscriptions.delete(interaction.guildId!);
			interaction.reply('Bye');
		} else {
			interaction.reply(this.notPlaying);
		}
    }
}