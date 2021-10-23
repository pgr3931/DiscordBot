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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordx_1 = require("discordx");
const play_1 = require("../logic/play");
const baseCommand_1 = require("./baseCommand");
let PlayCommand = class PlayCommand extends baseCommand_1.BaseCommand {
    async play(song, interaction) {
        await interaction.deferReply();
        let url = /^https:\/\/www\.youtube\.com\/watch\?v=.+/.test(song) ? song.includes('&') ? song.split('&')[0] : song : undefined;
        if (!url) {
            url = await (0, play_1.getSongUrl)(song);
        }
        if (url) {
            (0, play_1.playSong)(interaction, url);
            return;
        }
        interaction.followUp({ content: "Couldn't find any results matching that title" });
    }
};
__decorate([
    (0, discordx_1.Slash)("play", { description: "Plays a song based on a Youtube URL or video title" }),
    __param(0, (0, discordx_1.SlashOption)("song", { required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], PlayCommand.prototype, "play", null);
PlayCommand = __decorate([
    (0, discordx_1.Discord)()
], PlayCommand);
