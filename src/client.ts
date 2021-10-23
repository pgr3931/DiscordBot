import { Intents, Snowflake } from "discord.js";
import { Client } from 'discordx';
import path from "path";
import { MusicSubscription } from "./logic/subscription";
require('dotenv').config();

export const subscriptions = new Map<Snowflake, MusicSubscription>();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    classes: [
        path.join(__dirname, "commands", "**/*.{ts,js}")
    ],
    botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
    silent: true
});

client.on('ready', async () => {
    await client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
    });
    await client.initApplicationPermissions();

    console.log("Bot started");
});

client.on("interactionCreate", (interaction) => {
    client.executeInteraction(interaction);
});

client.on('error', console.warn);

client.login(process.env.BOT_TOKEN ?? '');