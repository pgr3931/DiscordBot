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
const baseCommand_1 = require("./baseCommand");
let NowPlayingCommand = class NowPlayingCommand extends baseCommand_1.BaseCommand {
    nowplaying(interaction) {
        const subscription = this.getSubscription(interaction);
        if (subscription) {
            interaction.reply(subscription.audioPlayer.state.status === voice_1.AudioPlayerStatus.Idle
                ? `Nothing is currently playing`
                : `Now Playing: **${subscription.audioPlayer.state.resource.metadata.title}**`);
        }
        else {
            interaction.reply(this.notPlaying);
        }
    }
};
__decorate([
    (0, discordx_1.Slash)("nowplaying", { description: "Shows the title of the currently playing song" }),
    (0, discordx_1.Slash)("np", { description: "Shows the title of the currently playing song" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", void 0)
], NowPlayingCommand.prototype, "nowplaying", null);
NowPlayingCommand = __decorate([
    (0, discordx_1.Discord)()
], NowPlayingCommand);
