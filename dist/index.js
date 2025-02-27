"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");

// package.json
var version = "0.0.1";

// src/convert/discord/main.ts
var import_node_path = __toESM(require("path"));
function convertDiscord(options) {
  const input = import_node_path.default.resolve(options.input);
  const output = options.output ? import_node_path.default.resolve(options.output) : import_node_path.default.dirname(input);
  console.log({ input, output });
}

// src/index.ts
var program = new import_commander.Command();
program.name("convollm").description("Convert chat conversations to LLM-friendly JSON format").version(version);
var convert = program.command("convert").description("Convert chat logs from many chat sources to JSON");
convert.command("discord").requiredOption("-i, --input <path>", "Input file or directory").option("-o, --output <path>", "Output file path").action(convertDiscord);
program.parse();
