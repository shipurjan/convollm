"use strict";

// src/index.ts
var import_commander = require("commander");

// package.json
var version = "0.0.1";

// src/index.ts
var program = new import_commander.Command();
program.name("chat-cli").description("Convert chat conversations to LLM-friendly JSON format").version(version);
program.command("convert").description("Convert chat logs to JSON").requiredOption("-i, --input <path>", "Input file or directory").option("-o, --output <path>", "Output file path").option("-p, --platform <platform>", "Chat platform (discord, telegram, etc)").action((options) => {
  console.log("Converting chat:", options.input);
});
program.parse();
