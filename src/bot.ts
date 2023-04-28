import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import messageCreator from "./listeners/messageCreate";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log("Bot is starting...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

ready(client);
messageCreator(client);

client.login(token);
