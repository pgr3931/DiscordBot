"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSong = exports.getSongUrl = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const client_1 = require("../client");
const subscription_1 = require("./subscription");
const track_1 = require("./track");
const yt_search_1 = __importDefault(require("yt-search"));
const getSongUrl = async (title) => {
    const result = await (0, yt_search_1.default)(title);
    return result.videos?.[0]?.url;
};
exports.getSongUrl = getSongUrl;
const playSong = async (interaction, url) => {
    if (!interaction.guildId)
        return;
    let subscription = client_1.subscriptions.get(interaction.guildId);
    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
        if (interaction.member instanceof discord_js_1.GuildMember && interaction.member.voice.channel) {
            const channel = interaction.member.voice.channel;
            subscription = new subscription_1.MusicSubscription((0, voice_1.joinVoiceChannel)({
                channelId: channel.id,
                guildId: channel.guild.id,
                //@ts-ignore
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            }));
            subscription.voiceConnection.on('error', console.warn);
            client_1.subscriptions.set(interaction.guildId, subscription);
        }
    }
    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
        await interaction.followUp("You need to be in a a voice channel to play music");
        return;
    }
    // Make sure the connection is ready before processing the user's request
    try {
        await (0, voice_1.entersState)(subscription.voiceConnection, voice_1.VoiceConnectionStatus.Ready, 20e3);
    }
    catch (error) {
        console.warn(error);
        await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later');
        return;
    }
    try {
        // Attempt to create a Track from the user's video URL
        const track = await track_1.Track.from(url, {
            onStart() {
                interaction.followUp({ content: `Now playing: **${track.title}**`, ephemeral: true }).catch(console.warn);
            },
            onFinish() { },
            onError(error) {
                console.warn(error);
                interaction.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn);
            },
        });
        // Enqueue the track and reply a success message to the user
        subscription.enqueue(track);
        await interaction.followUp(`Enqueued **${track.title}**`);
    }
    catch (error) {
        console.warn(error);
        await interaction.reply('Failed to play track, please try again later!');
    }
};
exports.playSong = playSong;
