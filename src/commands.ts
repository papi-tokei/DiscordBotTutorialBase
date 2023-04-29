import * as fs from "fs";
import * as path from "path";
import { Command } from "./types";

export const getCommandList = async (): Promise<Command[]> => {
  const commands: Command[] = [];
  const dictionaryEntryList = await fs.promises.readdir(
    path.join(__dirname, "./commands"),
    { withFileTypes: true }
  );
  const fileList = dictionaryEntryList
    .filter((dictionaryEntry) => dictionaryEntry.isFile())
    .map((dictionaryEntry) => dictionaryEntry.name);

  for (const file of fileList) {
    const command: Command = (await import(`./commands/${file}`)).default;
    commands.push(command);
  }
  return commands;
};
