import { readJsonFile } from "@/lib/utils/readJsonFile";
import path from "node:path";
import { z } from "zod";
import fs from "fs/promises";
import { TelegramSchema } from "./schema";

interface IOptions {
  input: string;
  output?: string;
  mediaFolder?: string; // Optional path to the media folder
}

export async function convertTelegram({
  input,
  output,
  mediaFolder,
}: IOptions) {
  const { inputPath, outputPath } = resolveInputOutputPaths(input, output);

  try {
    // Read the JSON file contents
    const jsonData = await readJsonFile(inputPath);

    if (jsonData === null) {
      throw new Error(`Failed to read or parse JSON file at ${inputPath}`);
    }

    // Log some basic info about the chat
    console.log(`Chat name: ${jsonData.name}`);
    console.log(`Total messages: ${jsonData.messages?.length || 0}`);

    // Transform the data with our permissive approach
    const transformedData = transformTelegramData(jsonData, mediaFolder);

    // Write the transformed data to the output file
    await fs.writeFile(outputPath, JSON.stringify(transformedData, null, 2));

    console.log(
      `Successfully converted Telegram data from ${inputPath} to ${outputPath}`,
    );

    return transformedData;
  } catch (error) {
    console.error("Error converting Telegram data:", error.message);
    throw error;
  }
}

/**
 * Transform Telegram data to our standardized format
 */
function transformTelegramData(
  rawData: any,
  mediaFolder?: string,
): z.infer<typeof TelegramSchema.OutputData> {
  // Map to track unique users and their roles
  const userRoles = new Map<string, string>();
  let nextSpeakerNumber = 1; // Start at 1 for the first real user

  const messages = rawData.messages.map((message: any, index: number) => {
    // Create a padded message number for the ID
    const msgNumber = String(index + 1).padStart(6, "0");
    const messageId = `msg-${msgNumber}`;

    // Handle service messages or messages without a sender
    const fromId =
      message.from_id || message.actor_id || `service_${message.id}`;
    const fromName = message.from || message.actor || "System";

    // Assign roles consistently based on user ID
    if (!userRoles.has(fromId)) {
      userRoles.set(fromId, `speaker${nextSpeakerNumber}`);
      nextSpeakerNumber++;
    }

    const role = userRoles.get(fromId) || `system`;

    // Extract message content - handle different formats of the text field
    let content = "";

    if (typeof message.text === "string") {
      // Simple string text
      content = message.text;
    } else if (Array.isArray(message.text)) {
      // Array of text segments
      content = message.text
        .map((item: any) => {
          if (typeof item === "string") {
            return item;
          } else if (item && typeof item === "object") {
            // Handle text objects with different possible structures
            if (item.text) return item.text;
            if (item.type && item.type === "text_link" && item.text)
              return item.text;
            return JSON.stringify(item);
          }
          return String(item || "");
        })
        .join("");
    } else if (
      message.text === undefined ||
      message.text === null ||
      message.text === ""
    ) {
      // Handle cases with no text (like photos only)
      if (message.action) {
        content = `[${message.action}]`;
      } else if (message.photo) {
        content = "[Photo]";
      } else if (message.file) {
        content = `[File: ${message.file}]`;
      } else {
        content = "[No text]";
      }
    } else if (message.text && typeof message.text === "object") {
      // Handle case where text is a single object
      if (message.text.text) {
        content = message.text.text;
      } else {
        // Fallback for any other structure
        try {
          content = JSON.stringify(message.text);
        } catch (e) {
          content = "[Complex text content]";
        }
      }
    }

    // Basic message object
    const outputMessage: z.infer<typeof TelegramSchema.OutputMessage> = {
      id: messageId,
      role,
      name: fromName,
      content,
    };

    // Handle reactions if present
    if (message.reactions && message.reactions.length > 0) {
      // Get the first reaction's emoji
      outputMessage.reaction = message.reactions[0].emoji;
    } else if (message.sticker_emoji) {
      outputMessage.reaction = message.sticker_emoji;
    }

    // Handle media if present
    if (message.photo && mediaFolder) {
      outputMessage.mediaPath = path.join(mediaFolder, message.photo);
      outputMessage.mediaType = "photo";
    } else if (message.file && mediaFolder) {
      outputMessage.mediaPath = path.join(mediaFolder, message.file);
      // Determine media type based on file extension or the media_type field if available
      outputMessage.mediaType =
        message.media_type || path.extname(message.file).replace(".", "");
    }

    return outputMessage;
  });

  // Second pass to resolve references (repliedTo)
  const messagesWithRefs = messages.map((outputMessage: any, index: number) => {
    const message = rawData.messages[index];

    if (message && message.reply_to_message_id) {
      // Find the original message being replied to
      const referencedMessageIndex = rawData.messages.findIndex(
        (m: any) => m.id === message.reply_to_message_id,
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
