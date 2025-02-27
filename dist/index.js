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

// src/lib/utils/readFile.ts
var import_promises = __toESM(require("fs/promises"));
async function readFile(filePath) {
  try {
    return import_promises.default.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

// src/lib/utils/readJsonFile.ts
async function readJsonFile(filePath) {
  try {
    const content = await readFile(filePath);
    return content ? JSON.parse(content) : null;
  } catch {
    throw new Error("Error reading JSON file");
  }
}

// src/programs/convert/discord/main.ts
var import_node_path = __toESM(require("path"));
var import_promises2 = __toESM(require("fs/promises"));

// src/programs/convert/discord/schema.ts
var import_zod = __toESM(require("zod"));
var _DiscordSchema = class _DiscordSchema {
};
_DiscordSchema.Emoji = import_zod.default.object({
  id: import_zod.default.string().nullable(),
  name: import_zod.default.string().nullable(),
  code: import_zod.default.string().optional(),
  isAnimated: import_zod.default.boolean().optional(),
  imageUrl: import_zod.default.string().nullable().optional()
});
_DiscordSchema.Reaction = import_zod.default.object({
  emoji: _DiscordSchema.Emoji,
  count: import_zod.default.number().optional()
});
_DiscordSchema.Embed = import_zod.default.object({
  title: import_zod.default.string().optional(),
  url: import_zod.default.string().optional(),
  timestamp: import_zod.default.string().nullable().optional(),
  description: import_zod.default.string().nullable().optional(),
  color: import_zod.default.string().nullable().optional()
}).passthrough();
_DiscordSchema.Reference = import_zod.default.object({
  messageId: import_zod.default.string(),
  channelId: import_zod.default.string(),
  guildId: import_zod.default.string().nullable()
});
_DiscordSchema.Author = import_zod.default.object({
  id: import_zod.default.string(),
  name: import_zod.default.string(),
  discriminator: import_zod.default.string(),
  nickname: import_zod.default.string().nullable(),
  color: import_zod.default.string().nullable(),
  isBot: import_zod.default.boolean(),
  roles: import_zod.default.array(import_zod.default.unknown()),
  avatarUrl: import_zod.default.string().nullable()
});
_DiscordSchema.InputMessage = import_zod.default.object({
  id: import_zod.default.string(),
  type: import_zod.default.string(),
  timestamp: import_zod.default.string(),
  timestampEdited: import_zod.default.string().nullable(),
  callEndedTimestamp: import_zod.default.string().nullable(),
  isPinned: import_zod.default.boolean(),
  content: import_zod.default.string(),
  author: _DiscordSchema.Author,
  attachments: import_zod.default.array(import_zod.default.unknown()),
  embeds: import_zod.default.array(_DiscordSchema.Embed),
  stickers: import_zod.default.array(import_zod.default.unknown()),
  reactions: import_zod.default.array(_DiscordSchema.Reaction),
  mentions: import_zod.default.array(import_zod.default.unknown()),
  inlineEmojis: import_zod.default.array(import_zod.default.unknown()),
  reference: _DiscordSchema.Reference.optional()
});
_DiscordSchema.InputData = import_zod.default.object({
  guild: import_zod.default.object({
    id: import_zod.default.string(),
    name: import_zod.default.string(),
    iconUrl: import_zod.default.string()
  }),
  channel: import_zod.default.object({
    id: import_zod.default.string(),
    type: import_zod.default.string(),
    categoryId: import_zod.default.string().nullable(),
    category: import_zod.default.unknown().nullable(),
    name: import_zod.default.string(),
    topic: import_zod.default.string().nullable()
  }),
  dateRange: import_zod.default.object({
    after: import_zod.default.string().nullable(),
    before: import_zod.default.string().nullable()
  }),
  exportedAt: import_zod.default.string(),
  messages: import_zod.default.array(_DiscordSchema.InputMessage),
  messageCount: import_zod.default.number()
});
_DiscordSchema.OutputMessage = import_zod.default.object({
  id: import_zod.default.string(),
  role: import_zod.default.string(),
  name: import_zod.default.string(),
  content: import_zod.default.string(),
  reaction: import_zod.default.string().optional(),
  embed: import_zod.default.string().optional(),
  repliedTo: import_zod.default.string().optional()
});
_DiscordSchema.OutputData = import_zod.default.array(_DiscordSchema.OutputMessage);
var DiscordSchema = _DiscordSchema;

// src/programs/convert/discord/main.ts
async function convertDiscord({ input, output }) {
  const { inputPath, outputPath } = resolveInputOutputPaths(input, output);
  const jsonData = await readJsonFile(inputPath);
  if (jsonData === null) {
    throw new Error(`Failed to read or parse JSON file at ${inputPath}`);
  }
  const parsedData = DiscordSchema.InputData.parse(jsonData);
  const transformedData = transformDiscordData(parsedData);
  await import_promises2.default.writeFile(outputPath, JSON.stringify(transformedData, null, 2));
  console.log(
    `Successfully converted Discord data from ${inputPath} to ${outputPath}`
  );
}
function transformDiscordData(data) {
  const userRoles = /* @__PURE__ */ new Map();
  let nextSpeakerNumber = 1;
  const messages = data.messages.map((message, index) => {
    const msgNumber = String(index + 1).padStart(6, "0");
    const messageId = `msg-${msgNumber}`;
    if (!userRoles.has(message.author.id)) {
      userRoles.set(message.author.id, `speaker${nextSpeakerNumber}`);
      nextSpeakerNumber++;
    }
    const role = userRoles.get(message.author.id);
    const reaction = message.reactions.length > 0 ? message.reactions[0].emoji.code || message.reactions[0].emoji.name : void 0;
    const embed = message.embeds.length > 0 ? message.embeds[0].title : void 0;
    const outputMessage = {
      id: messageId,
      role,
      name: message.author.name,
      content: message.content
    };
    if (reaction) outputMessage.reaction = reaction;
    if (embed) outputMessage.embed = embed;
    return outputMessage;
  });
  const messagesWithRefs = messages.map((outputMessage, index) => {
    const message = data.messages[index];
    if (message.reference) {
      const referencedMessageIndex = data.messages.findIndex(
        (m) => m.id === message.reference?.messageId
      );
      if (referencedMessageIndex !== -1) {
        const refMsgNumber = String(referencedMessageIndex + 1).padStart(
          6,
          "0"
        );
        outputMessage.repliedTo = `msg-${refMsgNumber}`;
      }
    }
    return outputMessage;
  });
  return messagesWithRefs;
}
function validateJsonPath(filePath, fileType) {
  if (!filePath.toLowerCase().endsWith(".json")) {
    throw new Error(
      `${fileType} file must be a JSON file (with .json extension)`
    );
  }
}
function resolveInputOutputPaths(input, output) {
  const inputPath = import_node_path.default.resolve(input);
  validateJsonPath(inputPath, "Input");
  const outputPath = output ? import_node_path.default.resolve(output) : import_node_path.default.join(
    import_node_path.default.dirname(input),
    import_node_path.default.basename(input, ".json") + ".out.json"
  );
  validateJsonPath(outputPath, "Output");
  return { inputPath, outputPath };
}

// src/index.ts
var program = new import_commander.Command();
program.name("convollm").description("Convert chat conversations to LLM-friendly JSON format").version(version);
var convert = program.command("convert").description("Convert chat logs from many chat sources to JSON");
convert.command("discord").requiredOption(
  "-i, --input <path>",
  "Input file path to the .json file exported with DiscordChatExporter"
).option("-o, --output <path>", "Output file path").action(convertDiscord);
program.parse();
