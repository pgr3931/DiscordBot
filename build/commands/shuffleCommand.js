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
const baseCommand_1 = require("./baseCommand");
let ShuffleCommand = class ShuffleCommand extends baseCommand_1.BaseCommand {
    resume(interaction) {
        const subscription = this.getSubscription(interaction);
        if (subscription) {
            if (subscription.queue.length === 0) {
                interaction.reply("Can't really shuffle an empty queue, can I?");
            }
            else if (subscription.queue.length === 1) {
                interaction.reply('The queue only has one song, so no shuffling');
            }
            else if (subscription.queue.length > 1) {
                subscription.shuffle();
                interaction.reply('Queue shuffled');
            }
        }
        else {
            interaction.reply(this.notPlaying);
        }
    }
};
__decorate([
    (0, discordx_1.Slash)("shuffle", { description: "Shuffles the queue" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", void 0)
], ShuffleCommand.prototype, "resume", null);
ShuffleCommand = __decorate([
    (0, discordx_1.Discord)()
], ShuffleCommand);
