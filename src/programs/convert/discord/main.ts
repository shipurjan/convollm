import { readJsonFile } from "@/lib/utils/readJsonFile";
import path from "node:path";
import { z } from "zod";
import fs from "fs/promises";
import { DiscordSchema } from "./schema";

interface IOptions {
  input: string;
  output?: string;
}

export async function convertDiscord({ input, output }: IOptions) {
  const { inputPath, outputPath } = resolveInputOutputPaths(input, output);

  // Read the JSON file contents
  const jsonData = await readJsonFile(inputPath);

  if (jsonData === null) {
    throw new Error(`Failed to read or parse JSON file at ${inputPath}`);
  }

  // Parse and validate the input data
  const parsedData = DiscordSchema.InputData.parse(jsonData);

  // Transform the data
  const transformedData = transformDiscordData(parsedData);

  // Write the transformed data to the output file
  await fs.writeFile(outputPath, JSON.stringify(transformedData, null, 2));

  console.log(
    `Successfully converted Discord data from ${inputPath} to ${outputPath}`,
  );
}

function transformDiscordData(
  data: z.infer<typeof DiscordSchema.InputData>,
): z.infer<typeof DiscordSchema.OutputData> {
  // Map to track unique users and their roles
  const userRoles = new Map<string, string>();
  let nextSpeakerNumber = 1;

  const messages = data.messages.map((message, index) => {
    // Create a padded message number for the ID
    const msgNumber = String(index + 1).padStart(6, "0");
    const messageId = `msg-${msgNumber}`;

    // Assign roles consistently based on user ID
    if (!userRoles.has(message.author.id)) {
      userRoles.set(message.author.id, `speaker${nextSpeakerNumber}`);
      nextSpeakerNumber++;
    }

    const role = userRoles.get(message.author.id)!;

    // Extract reaction if present
    const reaction =
      message.reactions.length > 0
        ? message.reactions[0].emoji.code || message.reactions[0].emoji.name
        : undefined;

    // Extract embed title if present
    const embed =
      message.embeds.length > 0 ? message.embeds[0].title : undefined;

    const timestamp = new Date(message.timestamp);
    const formattedDate =
      timestamp.getDate().toString().padStart(2, "0") +
      "-" +
      timestamp.toLocaleString("en-US", { month: "short" }) +
      "-" +
      timestamp.getFullYear() +
      " " +
      timestamp.getHours().toString().padStart(2, "0") +
      ":" +
      timestamp.getMinutes().toString().padStart(2, "0");

    // Basic message object
    const outputMessage: z.infer<typeof DiscordSchema.OutputMessage> = {
      id: messageId,
      date: formattedDate,
      role,
      name: message.author.name,
      content: message.content,
    };

    // Add optional fields if they exist
    if (reaction) outputMessage.reaction = reaction;
    if (embed) outputMessage.embed = embed;

    return outputMessage;
  });

  // Second pass to resolve references (repliedTo)
  const messagesWithRefs = messages.map((outputMessage, index) => {
    const message = data.messages[index];

    if (message.reference) {
      const referencedMessageIndex = data.messages.findIndex(
        (m) => m.id === message.reference?.messageId,
      );

      if (referencedMessageIndex !== -1) {
        const refMsgNumber = String(referencedMessageIndex + 1).padStart(
          6,
          "0",
        );
        outputMessage.repliedTo = `msg-${refMsgNumber}`;
      }
    }

    return outputMessage;
  });

  return messagesWithRefs;
}

function validateJsonPath(
  filePath: string,
  fileType: "Input" | "Output",
): void {
  if (!filePath.toLowerCase().endsWith(".json")) {
    throw new Error(
      `${fileType} file must be a JSON file (with .json extension)`,
    );
  }
}

function resolveInputOutputPaths(
  input: string,
  output?: string,
): { inputPath: string; outputPath: string } {
  const inputPath = path.resolve(input);
  validateJsonPath(inputPath, "Input");

  const outputPath = output
    ? path.resolve(output)
    : path.join(
        path.dirname(input),
        path.basename(input, ".json") + ".out.json",
      );
  validateJsonPath(outputPath, "Output");

  return { inputPath, outputPath };
}
