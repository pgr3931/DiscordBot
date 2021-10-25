import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getSongUrl, playSong } from "../logic/play";
import { BaseCommand } from "./baseCommand";

@Discord()
class PlayCommand extends BaseCommand {
    private readonly siteUrl = /^https:\/\/www\.youtube\.com\/watch\?v=.+/;
    private readonly videoUrl = /^https:\/\/youtu\.be\/.+/;

    @Slash("play", { description: "Plays a song based on a Youtube URL or video title" })
    async play(@SlashOption("song", { required: true }) song: string, interaction: CommandInteraction) {
        await interaction.deferReply();

        let url: string | undefined = undefined;
        if (this.siteUrl.test(song)) {
            url = song.includes('&') ? song.split('&')[0] : song;
        }
        if (!url && this.videoUrl.test(song)) {
            url = song.includes('?') ? song.split('?')[0] : song;
        }
        if (!url) {
            url = await getSongUrl(song);
        }

        if (url) {
            playSong(interaction, url);
            return;
        }

        interaction.followUp({ content: "Couldn't find any results matching that title or url" })
    }
}