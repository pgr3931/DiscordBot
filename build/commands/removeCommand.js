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
const baseCommand_1 = require("./baseCommand");
let RemoveCommand = class RemoveCommand extends baseCommand_1.BaseCommand {
    remove(index, interaction) {
        if (index < 1) {
            interaction.reply({ content: 'Thought you could break the bot, huh?', ephemeral: true });
            return;
        }
        const subscription = this.getSubscription(interaction);
        if (subscription) {
            const removedTrack = subscription.remove(index - 1)[0];
            interaction.reply(`Removed **${removedTrack.title}**`);
        }
        else {
            interaction.reply(this.notPlaying);
        }
    }
};
__decorate([
    (0, discordx_1.Slash)("remove", { description: "Removes a song from the queue. Use /queue to find the index of the song you want to remove" }),
    __param(0, (0, discordx_1.SlashOption)("index", { required: true, type: 'INTEGER' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, discord_js_1.CommandInteraction]),
    __metadata("design:returntype", void 0)
], RemoveCommand.prototype, "remove", null);
RemoveCommand = __decorate([
    (0, discordx_1.Discord)()
], RemoveCommand);
