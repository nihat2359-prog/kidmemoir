import { z } from "zod";

export type CreateMemoryValidationMessages = Readonly<{
  categoryRequired: string;
  descriptionMax: string;
  importanceInvalid: string;
  locationMax: string;
  moodInvalid: string;
  occurredAtFuture: string;
  occurredAtRequired: string;
  reminderDateRequired: string;
  reminderFuture: string;
  reminderNoteMax: string;
  repeatTypeInvalid: string;
  tagsInvalid: string;
  titleMax: string;
  titleRequired: string;
  typeRequired: string;
}>;

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .transform((value) => value || undefined);

export function createMemorySchema(messages: CreateMemoryValidationMessages) {
  return z
    .object({
      aiEnabled: z.boolean(),
      categoryId: z.string().uuid(messages.categoryRequired),
      description: optionalText(20000, messages.descriptionMax),
      entryType: z.enum(["memory", "photo", "video", "audio"], {
        message: messages.typeRequired,
      }),
      importance: z
        .enum(["low", "normal", "high", "critical"], {
          message: messages.importanceInvalid,
        })
        .optional(),
      location: optionalText(300, messages.locationMax),
      mood: z
        .enum(
          [
            "happy",
            "sad",
            "fear",
            "excitement",
            "proud",
            "disappointed",
            "neutral",
          ],
          { message: messages.moodInvalid },
        )
        .optional(),
      occurredAt: z
        .string()
        .min(1, messages.occurredAtRequired)
        .refine(
          (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
          messages.occurredAtRequired,
        )
        .refine(
          (value) => value <= new Date().toISOString().slice(0, 10),
          messages.occurredAtFuture,
        ),
      reminderAt: z.string(),
      reminderEnabled: z.boolean(),
      reminderNote: optionalText(5000, messages.reminderNoteMax),
      repeatType: z.enum(["none", "daily", "weekly", "monthly", "yearly"], {
        message: messages.repeatTypeInvalid,
      }),
      subCategoryId: z.string(),
      tags: z.string().refine(
        (value) =>
          value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .every((tag) => tag.length <= 50),
        messages.tagsInvalid,
      ),
      title: z
        .string()
        .trim()
        .min(1, messages.titleRequired)
        .max(200, messages.titleMax),
    })
    .superRefine((value, context) => {
      if (!value.reminderEnabled) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value.reminderAt)) {
        context.addIssue({
          code: "custom",
          message: messages.reminderDateRequired,
          path: ["reminderAt"],
        });
      } else if (value.reminderAt <= new Date().toISOString().slice(0, 10)) {
        context.addIssue({
          code: "custom",
          message: messages.reminderFuture,
          path: ["reminderAt"],
        });
      }
    });
}

export type CreateMemoryInput = z.input<ReturnType<typeof createMemorySchema>>;
export type CreateMemoryValues = z.output<
  ReturnType<typeof createMemorySchema>
>;
