import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import pino from "pino"
import { getConnection, getManager } from "typeorm";
import { Task } from "../entity/Task";

export function BotStart() {


  const logger = pino({
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  });
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });

  let token = process.env.TOKEN;
  if (!token) {
    console.log("Discord TOKEN not set as environment variable.");
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Enter TOKEN: ", (inp) => {
      console.log(`Recieved: ${inp}`);
      logger.info("Logging in...");
      client.login(inp);
      readline.close();
    });
  } else {
    client.login(token);
  }

  client.once("ready", () => {
    logger.info(`Logged in as ${client.user.tag}!`);
  });

  client.on("warn", (m) => logger.warn(m));

  client.on("error", (m) => logger.error(m));

  enum EnumGetting {
    Content,
    EndDate,
    Nothing
  }
  const task = new Task();

  let getting: EnumGetting;


  client.on("messageCreate", async (message) => {
    if (message.author.bot) return

    if (getting == EnumGetting.Content) {
      task.content = message.content
      message.reply("Enter End Date");
      getting = EnumGetting.EndDate;
      return
    }

    if (getting == EnumGetting.EndDate) {
      task.dueDate = new Date(message.content)
      getManager().save(task)
      message.reply("Done thank you");
      getting = EnumGetting.Nothing;
      return
    }
    if (message.content == ".add") {
      message.reply("Enter content");
      getting = EnumGetting.Content;
    }

    if (message.content == ".get") {
      getManager().find(Task).then(e => {
        message.reply(JSON.stringify(e));
      })
    }
  });



}
