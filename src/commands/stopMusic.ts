import { CommandInteraction, Client } from "discord.js";
import { Command } from "../types";
import { leaveVoiceChannel } from "../utils";

export const StopMusic: Command = {
  name: "stop_music",
  description: "楽曲再生を止める(Botがボイスチャンネルから退出する)",
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ) {
    if (interaction.guildId === null) return;
    await leaveVoiceChannel(interaction);
    await interaction.editReply(`ボイスチャンネルから退出しました`);
  },
};

export default StopMusic;
