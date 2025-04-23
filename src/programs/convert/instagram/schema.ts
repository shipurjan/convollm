import z from "zod";

export class InstagramSchema {
  static Reaction = z.object({
    reaction: z.string(),
    actor: z.string(),
  });

  static ShareContent = z.object({
    link: z.string(),
    share_text: z.string().optional(),
    original_content_owner: z.string().optional(),
  });

  static Photo = z.object({
    uri: z.string(),
    creation_timestamp: z.number().optional(),
  });

  static InputMessage = z.object({
    sender_name: z.string(),
    timestamp_ms: z.number(),
    content: z.string().optional(),
    photos: z.array(this.Photo).optional(),
    share: this.ShareContent.optional(),
    reactions: z.array(this.Reaction).optional(),
    is_geoblocked_for_viewer: z.boolean().optional(),
    is_unsent_image_by_messenger_kid_parent: z.boolean().optional(),
  });

  static Participant = z.object({
    name: z.string(),
  });

  static InputData = z.object({
    participants: z.array(this.Participant),
    messages: z.array(this.InputMessage),
    title: z.string(),
    is_still_participant: z.boolean().optional(),
    thread_path: z.string().optional(),
    magic_words: z.array(z.string()).optional(),
  });

  static OutputMessage = z.object({
    id: z.string(),
    role: z.string(),
    name: z.string(),
    content: z.string(),
    date: z.string(),
    reaction: z.string().optional(),
    mediaType: z.string().optional(),
    mediaUri: z.string().optional(),
    shareLink: z.string().optional(),
    shareText: z.string().optional(),
  });

  static OutputData = z.array(this.OutputMessage);
}
