import { Client, Message } from "discord.js";

export default (client: Client): void => {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("!じゃんけん")) {
      jankenFunction(message);
    }
  });
};

function jankenFunction(message: Message): void {
  const splitStringList = message.content.split(new RegExp(" |　", "g"));
  if (splitStringList.length !== 2) {
    message.channel.send("入力文字形式が正しくありません。");
  } else {
    if (/グー|チョキ|パー|ぐー|ちょき|ぱー/.test(splitStringList[1]) === true) {
      const random = Math.floor(Math.random() * 3);
      if (random === 0) {
        message.channel.send("グー");
      } else if (random === 1) {
        message.channel.send("チョキ");
      } else {
        message.channel.send("パー");
      }
    } else {
      message.channel.send("グー、チョキ、パーのどれかを入力してください");
    }
  }
}
