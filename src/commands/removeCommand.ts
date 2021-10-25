import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { BaseCommand } from "./baseCommand";

@Discord()
class RemoveCommand extends BaseCommand {
    @Slash("remove", { description: "Removes a song from the queue. Use /queue to find the index of the song you want to remove" })
    remove(@SlashOption("index", { required: true, type: 'INTEGER' }) index: number, interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
            if (index < 1 || subscription.queue.length < index) {
                interaction.reply({ content: 'Thought you could break the bot, huh?', ephemeral: true });
                return;
            }
            const removedTrack = subscription.remove(index - 1)[0];
            interaction.reply(`Removed **${removedTrack.title}**`);
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}