import { Command } from "commander";
import { version } from "~/package.json";
import { convertDiscord } from "@/programs/convert/discord/main";
import { convertTelegram } from "./programs/convert/telegram/main";

const program = new Command();

program
  .name("convollm")
  .description("Convert chat conversations to LLM-friendly JSON format")
  .version(version);

const convert = program
  .command("convert")
  .description("Convert chat logs from many chat sources to JSON");

convert
  .command("discord")
  .requiredOption(
    "-i, --input <path>",
    "Input file path to the .json file exported with DiscordChatExporter",
  )
  .option("-o, --output <path>", "Output file path")
  .action(convertDiscord);

convert
  .command("telegram")
  .requiredOption(
    "-i, --input <path>",
    "Input file path to the .json file exported with Telegram Desktop",
  )
  .option("-o, --output <path>", "Output file path")
  .action(convertTelegram);

program.parse();
