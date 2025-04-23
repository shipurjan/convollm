import { readJsonFile } from "@/lib/utils/readJsonFile";
import { z } from "zod";
import fs from "fs/promises";
import { InstagramSchema } from "./schema";
import { resolveInputOutputPaths } from "@/lib/utils/resolveInputOutputPaths";

export interface IConvertInstagramOptions {
  input: string;
  output?: string;
}

export async function convertInstagram({
  input,
  output,
}: IConvertInstagramOptions) {
  const { inputPath, outputPath } = resolveInputOutputPaths(input, output);

  // Read the JSON file contents
  const jsonData = await readJsonFile(inputPath);

  if (!jsonData) {
    throw new Error(`Failed to read or parse JSON file at ${inputPath}`);
  }

  // Log some basic info about the chat
  console.log(`Chat title: ${jsonData.title}`);

  // Transform the data (including filtering reaction messages)
  const transformedData = transformInstagramData(jsonData);

  // Log only the meaningful count
  console.log(`Total messages: ${transformedData.length}`);

  // Write the transformed data to the output file
  await fs.writeFile(outputPath, JSON.stringify(transformedData, null, 2));

  console.log(
    `Successfully converted Instagram data from ${inputPath} to ${outputPath}`,
  );
}

/**
 * Checks if a message content appears to be a reaction notification
 * Works across different languages by looking for patterns
 */
function isReactionNotification(content: string): boolean {
  if (!content) return false;

  // Check for common reaction notification patterns in various languages
  // Polish: "Zareagował(a) 👍 na Twoją wiadomość:"
  // English: "Reacted 👍 to your message:"
  // Spanish: "Reaccionó 👍 a tu mensaje:"
  // etc.

  // Pattern 1: Contains an emoji and other reaction-notification structural elements
  const hasEmojiPattern =
    /^[^]+\s+[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]\s+[^]+$/u;

  // Pattern 2: Contains words commonly used for reactions in many languages
  const reactionWords = [
    "zareagowa", // Polish
    "react", // English
    "reaccion", // Spanish
    "polubiono", // Polish "liked"
    "liked", // English
    "gust", // Spanish "liked"
  ];

  // Check for reaction words
  const hasReactionWord = reactionWords.some((word) =>
    content.toLowerCase().includes(word.toLowerCase()),
  );

  // If matches both patterns, it's likely a reaction notification
  return hasEmojiPattern.test(content) && hasReactionWord;
}

/**
 * Transform Instagram data to our standardized format
 */
export function transformInstagramData(
  rawData: any,
): z.infer<typeof InstagramSchema.OutputData> {
  // Map to track unique users and their roles
  const userRoles = new Map<string, string>();
  let nextSpeakerNumber = 1;

  // First, filter out reaction notification messages
  const filteredRawMessages = rawData.messages.filter((message: any) => {
    // Keep messages that don't have content (like photos)
    if (!message.content) return true;

    // Filter out reaction notification messages
    return !isReactionNotification(message.content);
  });

  // Process messages in reverse order (newest to oldest) since Instagram exports are in that order
  const reversedMessages = [...filteredRawMessages].reverse();

  // Map the messages to our output format
  const messages = reversedMessages.map((message: any, index: number) => {
    // Create a padded message number for the ID
    const msgNumber = String(index + 1).padStart(6, "0");
    const messageId = `msg-${msgNumber}`;

    // Assign roles consistently based on user name (using exact original string)
    if (!userRoles.has(message.sender_name)) {
      userRoles.set(message.sender_name, `speaker${nextSpeakerNumber}`);
      nextSpeakerNumber++;
    }

    const role = userRoles.get(message.sender_name)!;

    // Format the date
    const date = new Date(message.timestamp_ms);
    const formattedDate =
      date.getDate().toString().padStart(2, "0") +
      "-" +
      date.toLocaleString("en-US", { month: "short" }) +
      "-" +
      date.getFullYear() +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");

    // For content, handle different message types but preserve original strings
    let content = message.content || "";

    // For photos (no content)
    if (!content && message.photos) {
      content = "[Photo]";
    }

    // For shares (no content)
    if (!content && message.share) {
      content = `[Shared: ${message.share.link}]`;
    }

    // Basic message object
    const outputMessage: z.infer<typeof InstagramSchema.OutputMessage> = {
      id: messageId,
      date: formattedDate,
      role,
      name: message.sender_name,
      content,
    };

    // Add reaction if present
    if (message.reactions && message.reactions.length > 0) {
      outputMessage.reaction = message.reactions[0].reaction;
    }

    // Add media info if present
    if (message.photos && message.photos.length > 0) {
      outputMessage.mediaType = "photo";
      outputMessage.mediaUri = message.photos[0].uri;
    }

    // Add share info if present
    if (message.share) {
      outputMessage.shareLink = message.share.link;
      if (message.share.share_text) {
        outputMessage.shareText = message.share.share_text;
      }
    }

    return outputMessage;
  });

  return messages;
}
