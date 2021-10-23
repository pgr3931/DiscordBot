import { CommandInteraction } from "discord.js";
import { subscriptions } from "../client";

export class BaseCommand{
    notPlaying = 'Not playing on this server';

    getSubscription(interaction: CommandInteraction){
        if (!interaction.guildId) return;
        return subscriptions.get(interaction.guildId);
    }
}