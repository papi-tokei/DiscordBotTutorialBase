import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import ready from "./listeners/ready";
import messageCreator from "./listeners/messageCreate";
import interactionCreate from "./listeners/interactionCreate";

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
interactionCreate(client);

client.login(token);
