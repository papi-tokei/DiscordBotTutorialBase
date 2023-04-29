import { CommandInteraction } from "discord.js";
import {
  getVoiceConnection,
  VoiceConnection,
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

import { MusicType, RegexMusicTypeDictionary, Song } from "./types";

export function checkMusicUrl(musicUrl: string): MusicType | null {
  if (RegexMusicTypeDictionary.YouTubeVideo.test(musicUrl)) {
    return MusicType.YouTubeVideo;
  } else if (RegexMusicTypeDictionary.YouTubePlaylist.test(musicUrl)) {
    return MusicType.YouTubePlaylist;
  } else {
    return null;
  }
}

export async function joinTargetVoiceChannel(interaction: CommandInteraction) {
  const channelId = interaction.options.get("channel")?.value;
  if (!channelId) {
    await interaction.editReply("正しいボイスチャンネルを指定してください");
    return;
  }
  const channel = await interaction.guild?.channels.fetch(channelId as string);
  if (!channel?.isVoiceBased()) {
    await interaction.editReply("正しいボイスチャンネルを指定してください");
  }

  await joinVoiceChannel({
    channelId: channelId as string,
    guildId: interaction.guildId as string,
    selfDeaf: true,
    selfMute: false,
    adapterCreator: interaction.guild!.voiceAdapterCreator,
  });
}

/**
 *
 * @param interaction
 * @param song
 * @returns isError 関数内でエラーが発生した場合はtrueを返す
 */
export async function playMusicFunction(
  interaction: CommandInteraction,
  song: Song
): Promise<boolean> {
  try {
    let voiceConnection: VoiceConnection | undefined = await getVoiceConnection(
      interaction.guildId!
    );
    if (!voiceConnection) {
      // IF: ボイスチャンネルに接続していない場合は、接続する
      await joinTargetVoiceChannel(interaction);
      voiceConnection = await getVoiceConnection(interaction.guildId!);
    }

    // 音楽を再生する
    const player = createAudioPlayer();
    player.play(createAudioResource(ytdl(song.url, { filter: "audioonly" })));
    voiceConnection?.subscribe(player);

    await interaction.editReply(
      `楽曲タイトル: ${song.title}\n再生時間：${formatTime(song.lengthSeconds)}`
    );
    return false;
  } catch (err) {
    console.error(err);
    await interaction.editReply("楽曲の再生に失敗しました");
    return true;
  }
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export async function leaveVoiceChannel(interaction: CommandInteraction) {
  if (interaction.guildId === null) return;
  const voiceConnection: VoiceConnection | undefined = await getVoiceConnection(
    interaction.guildId
  );
  if (voiceConnection) {
    voiceConnection.destroy();
  }
}
