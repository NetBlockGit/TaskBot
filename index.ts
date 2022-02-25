import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from "discord.js";
import pino from "pino"

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

client.on("messageCreate", async (message) => {

  const channel = client.channels.cache.get(message.channelId) as TextChannel;
  if (!message.author.bot) channel.send("oh bhai")
  console.log(message);
});


