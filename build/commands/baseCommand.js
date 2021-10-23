"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const client_1 = require("../client");
class BaseCommand {
    constructor() {
        this.notPlaying = 'Not playing on this server';
    }
    getSubscription(interaction) {
        if (!interaction.guildId)
            return;
        return client_1.subscriptions.get(interaction.guildId);
    }
}
exports.BaseCommand = BaseCommand;
