import { Client } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
client.login(token);
