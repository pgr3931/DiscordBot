import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class ShuffleCommand extends BaseCommand {
    @Slash("shuffle", { description: "Shuffles the queue" })
    resume(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
            if (subscription.queue.length === 0) {
                interaction.reply("Can't really shuffle an empty queue, can I?");
            }else if (subscription.queue.length === 1) {
                interaction.reply('The queue only has one song, so no shuffling');
            }  else if (subscription.queue.length > 1) {
                subscription.shuffle();
                interaction.reply('Queue shuffled');
            }
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}