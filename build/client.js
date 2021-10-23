"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const discord_js_1 = require("discord.js");
const discordx_1 = require("discordx");
const path_1 = __importDefault(require("path"));
require('dotenv').config();
exports.subscriptions = new Map();
const client = new discordx_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES],
    classes: [
        path_1.default.join(__dirname, "commands", "**/*.{ts,js}")
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
