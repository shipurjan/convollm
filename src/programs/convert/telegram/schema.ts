import z from "zod";

export class TelegramSchema {
  static ReactionPerson = z.object({
    from: z.string(),
    from_id: z.string().optional(),
    date: z.string(),
  });

  static Reaction = z.object({
    type: z.string(),
    count: z.number(),
    emoji: z.string(),
    recent: z.array(this.ReactionPerson),
  });

  static TextEntity = z.object({
    type: z.string(),
    text: z.string(),
  });

  static InputMessage = z.object({
    id: z.number(),
    type: z.string(),
    date: z.string(),
    date_unixtime: z.string(),
    from: z.string().optional(), // May be missing in service messages
    from_id: z.string().optional(), // May be missing in service messages
    text: z.union([
      z.string(),
      z.array(z.string()), // Some messages have text as an array of formatted segments
    ]),
    text_entities: z.array(this.TextEntity).optional(), // May be missing if text is an array
    // Edited message fields
    edited: z.string().optional(),
    edited_unixtime: z.string().optional(),
    // Photo fields
    photo: z.string().optional(),
    photo_file_size: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    // Reactions
    reactions: z.array(this.Reaction).optional(),
    // Reply references
    reply_to_message_id: z.number().optional(),
    // Other optional fields
    file: z.string().optional(),
    thumbnail: z.string().optional(),
    media_type: z.string().optional(),
    sticker_emoji: z.string().optional(),
    forwarded_from: z.string().optional(),
    action: z.string().optional(), // For service messages like "joined group"
    actor: z.string().optional(), // For service messages
    actor_id: z.string().optional(), // For service messages
  });

  static InputData = z.object({
    name: z.string(),
    type: z.string(),
    id: z.number(),
    messages: z.array(this.InputMessage),
  });

  static OutputMessage = z.object({
    id: z.string(),
    role: z.string(),
    name: z.string(),
    content: z.string(),
    reaction: z.string().optional(),
    embed: z.string().optional(),
    repliedTo: z.string().optional(),
    // Additional fields that could be useful for Telegram messages
    mediaPath: z.string().optional(),
    mediaType: z.string().optional(),
  });

  static OutputData = z.array(this.OutputMessage);
}

export default TelegramSchema;
