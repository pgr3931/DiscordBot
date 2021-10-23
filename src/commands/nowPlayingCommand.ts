import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Track } from "../logic/track";
import { BaseCommand } from "./baseCommand";

@Discord()
class NowPlayingCommand extends BaseCommand {
    @Slash("nowplaying", { description: "Shows the title of the currently playing song" })
    @Slash("np", { description: "Shows the title of the currently playing song" })
    nowplaying(interaction: CommandInteraction) {
        const subscription = this.getSubscription(interaction);

        if (subscription) {
            interaction.reply(
                subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
                    ? `Nothing is currently playing`
                    : `Now Playing: **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`
            );
        } else {
            interaction.reply(this.notPlaying);
        }
    }
}