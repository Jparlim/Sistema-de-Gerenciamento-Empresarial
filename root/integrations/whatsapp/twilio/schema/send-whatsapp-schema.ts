import { z } from "zod";

export const twilioWhatsappSchema = z.object({
  ExternalUserId: z.string(),
  SmsMessageSid: z.string(),
  NumMedia: z.string(),
  ProfileName: z.string(),
  MessageType: z.string(),
  SmsSid: z.string(),
  WaId: z.string(),
  SmsStatus: z.string(),
  Body: z.string(),
  To: z.string(),
  NumSegments: z.string(),
  ReferralNumMedia: z.string(),
  MessageSid: z.string(),
  AccountSid: z.string(),
  ChannelMetadata: z.string({}),
  From: z.string(),
  ApiVersion: z.string(),
});

export type SendWhatsappType = z.infer<typeof twilioWhatsappSchema>;
