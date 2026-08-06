import { z } from "zod";
import { routing } from "@/i18n/routing";

export const supportSubjects = [
  "account",
  "memory",
  "media",
  "premium",
  "privacy",
  "technical",
] as const;

export const MAX_SUPPORT_ATTACHMENT_SIZE = 5 * 1024 * 1024;
export const SUPPORT_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
] as const;

export const supportRequestSchema = z.object({
  email: z.string().trim().min(1).email().max(254),
  locale: z.enum(routing.locales),
  message: z.string().trim().min(20).max(5000),
  subject: z.enum(supportSubjects),
  website: z.string().max(0),
});

export type SupportSubject = (typeof supportSubjects)[number];
