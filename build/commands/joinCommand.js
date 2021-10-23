"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const discordx_1 = require("discordx");
const client_1 = require("../client");
const play_1 = require("../logic/play");
const subscription_1 = require("../logic/subscription");
const baseCommand_1 = require("./baseCommand");
let JoinCommand = class JoinCommand extends baseCommand_1.BaseCommand {
    async join(interaction) {
        await interaction.deferReply();
        let subscription = this.getSubscription(interaction);
        let nowPlaying, queue;
        if (subscription && subscription.audioPlayer.state.status !== voice_1.AudioPlayerStatus.Idle) {
            nowPlaying = subscription.audioPlayer.state.resource.metadata.url;
            queue = subscription.queue;
        }
        subscription?.voiceConnection.destroy();
        client_1.subscriptions.delete(interaction.guildId);
        if (nowPlaying) {
            await (0, play_1.playSong)(interaction, nowPlaying);
        }
        else {
            if (!interaction.guildId)
                return;
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
        if (queue) {
            queue.forEach(async (q) => {
                await (0, play_1.playSong)(interaction, q.url);
            });
        }
        interaction.followUp('Hi');
    }
};
__decorate([
    (0, discordx_1.Slash)("join", { description: "Makes Jürgen join the channel" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], JoinCommand.prototype, "join", null);
JoinCommand = __decorate([
    (0, discordx_1.Discord)()
], JoinCommand);
