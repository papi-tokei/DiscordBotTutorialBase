import { Client } from "discord.js";
import { getCommandList } from "../commands";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    const commands = await getCommandList();
    await client.application.commands.set(commands);
    console.log(`${client.user.username} is online`);
  });
};
