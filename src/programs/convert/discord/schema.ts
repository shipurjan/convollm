import z from "zod";

export class DiscordSchema {
  static Emoji = z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    code: z.string().optional(),
    isAnimated: z.boolean().optional(),
    imageUrl: z.string().nullable().optional(),
  });

  static Reaction = z.object({
    emoji: this.Emoji,
    count: z.number().optional(),
  });

  static Embed = z
    .object({
      title: z.string().optional(),
      url: z.string().optional(),
      timestamp: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
    })
    .passthrough();

  static Reference = z.object({
    messageId: z.string(),
    channelId: z.string(),
    guildId: z.string().nullable(),
  });

  static Author = z.object({
    id: z.string(),
    name: z.string(),
    discriminator: z.string(),
    nickname: z.string().nullable(),
    color: z.string().nullable(),
    isBot: z.boolean(),
    roles: z.array(z.unknown()),
    avatarUrl: z.string().nullable(),
  });

  static InputMessage = z.object({
    id: z.string(),
    type: z.string(),
    timestamp: z.string(),
    timestampEdited: z.string().nullable(),
    callEndedTimestamp: z.string().nullable(),
    isPinned: z.boolean(),
    content: z.string(),
    author: this.Author,
    attachments: z.array(z.unknown()),
    embeds: z.array(this.Embed),
    stickers: z.array(z.unknown()),
    reactions: z.array(this.Reaction),
    mentions: z.array(z.unknown()),
    inlineEmojis: z.array(z.unknown()),
    reference: this.Reference.optional(),
  });

  static InputData = z.object({
    guild: z.object({
      id: z.string(),
      name: z.string(),
      iconUrl: z.string(),
    }),
    channel: z.object({
      id: z.string(),
      type: z.string(),
      categoryId: z.string().nullable(),
      category: z.unknown().nullable(),
      name: z.string(),
      topic: z.string().nullable(),
    }),
    dateRange: z.object({
      after: z.string().nullable(),
      before: z.string().nullable(),
    }),
    exportedAt: z.string(),
    messages: z.array(this.InputMessage),
    messageCount: z.number(),
  });

  static OutputMessage = z.object({
    id: z.string(),
    role: z.string(),
    name: z.string(),
    content: z.string(),
    date: z.string(), // Added date field
    reaction: z.string().optional(),
    embed: z.string().optional(),
    repliedTo: z.string().optional(),
  });

  static OutputData = z.array(this.OutputMessage);
}
