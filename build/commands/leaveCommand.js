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
const discord_js_1 = require("discord.js");
const discordx_1 = require("discordx");
const client_1 = require("../client");
const baseCommand_1 = require("./baseCommand");
let LeaveCommand = class LeaveCommand extends baseCommand_1.BaseCommand {
    leave(interaction) {
        const subscription = this.getSubscription(interaction);
        if (subscription) {
            subscription.voiceConnection.destroy();
            client_1.subscriptions.delete(interaction.guildId);
            interaction.reply('Bye');
        }
        else {
            interaction.reply(this.notPlaying);
        }
    }
};
__decorate([
    (0, discordx_1.Slash)("leave", { description: "Makes Jürgen leave the channel" }),
    (0, discordx_1.Slash)("l", { description: "Makes Jürgen leave the channel" }),
    (0, discordx_1.Slash)("disconnect", { description: "Makes Jürgen leave the channel" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", void 0)
], LeaveCommand.prototype, "leave", null);
LeaveCommand = __decorate([
    (0, discordx_1.Discord)()
], LeaveCommand);
