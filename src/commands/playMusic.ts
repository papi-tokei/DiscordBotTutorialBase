import {
  CommandInteraction,
  Client,
  ApplicationCommandOptionType,
  ChannelType,
} from "discord.js";
import ytdl from "ytdl-core";
import dotenv from "dotenv";
import { Command, MusicType, Song } from "../types";
import { checkMusicUrl, playMusicFunction, leaveVoiceChannel } from "../utils";

dotenv.config();

const PlayMusic: Command = {
  name: "play_music",
  description: "指定したURLの音楽を再生します",
  options: [
    {
      name: "channel",
      description: "音声チャンネルを選択してください",
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildVoice],
    },
    {
      name: "url",
      description: "再生する音楽のURLを選択してください。(YouTubeのみ対応)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  async execute(client: Client, interaction: CommandInteraction) {
    if (interaction.guildId === null) return;
    const musicUrl = interaction.options.get("url")?.value as string;
    if (!musicUrl) {
      await interaction.editReply("正しい値を入力してください");
      return;
    }

    // URLがYouTubeの動画URLであるかチェックする
    const resultCheckUrl = checkMusicUrl(musicUrl);
    const errorMessage = "正しいURLを指定してください。";
    if (resultCheckUrl === MusicType.YouTubePlaylist) {
      await interaction.editReply(
        errorMessage + "(プレイリストは対応していません)"
      );
      return;
    } else if (resultCheckUrl !== MusicType.YouTubeVideo) {
      await interaction.editReply(errorMessage);
      return;
    }

    const song: Song = {
      title: "",
      url: "",
      lengthSeconds: 0,
      songType: MusicType.YouTubeVideo,
    };
    try {
      // YouTubeのURLから楽曲情報を取得する
      const youtubeSongInfo = await ytdl.getInfo(musicUrl);
      song.title = youtubeSongInfo.videoDetails.title;
      song.url = youtubeSongInfo.videoDetails.video_url;
      song.lengthSeconds = Number(youtubeSongInfo.videoDetails.lengthSeconds);
    } catch (err) {
      console.error(err);
      await interaction.editReply(
        "楽曲情報の取得に失敗しました。この楽曲はすでに削除されたか、年齢制限が付与されている可能性があります。"
      );
      return;
    }

    // 音楽を再生する
    const isError = await playMusicFunction(interaction, song);
    if (isError) {
      // ボイスチャンネルから退出する
      await leaveVoiceChannel(interaction);
      return;
    }
  },
};

export default PlayMusic;
