import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  execute: (client: Client, interaction: CommandInteraction) => Promise<void>;
}

export enum MusicType {
  YouTubeVideo,
  YouTubePlaylist,
}

export const RegexMusicTypeDictionary = {
  YouTubeVideo:
    /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w-]+)(((.*(\?|&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
  YouTubePlaylist:
    /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
};

export interface Song {
  title: string;
  url: string;
  lengthSeconds: number;
  songType: MusicType;
}
