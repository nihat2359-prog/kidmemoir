import { z } from "zod";

export type CreateChildValidationMessages = Readonly<{
  birthDateFuture: string;
  birthDateInvalid: string;
  birthDateRequired: string;
  birthHeightPositive: string;
  birthPlaceMaxLength: string;
  birthWeightPositive: string;
  firstNameMaxLength: string;
  firstNameRequired: string;
  genderRequired: string;
  lastNameMaxLength: string;
  notesMaxLength: string;
}>;

const optionalText = (maxLength: number, message: string) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .transform((value) => value || undefined);

const optionalPositiveNumber = (message: string) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().positive(message).max(999.99, message).optional(),
  );

export function createChildSchema(messages: CreateChildValidationMessages) {
  return z.object({
    birthDate: z
      .string()
      .min(1, messages.birthDateRequired)
      .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: messages.birthDateInvalid,
      })
      .refine((value) => value <= new Date().toISOString().slice(0, 10), {
        message: messages.birthDateFuture,
      }),
    birthHeight: optionalPositiveNumber(messages.birthHeightPositive),
    birthPlace: optionalText(300, messages.birthPlaceMaxLength),
    birthWeight: optionalPositiveNumber(messages.birthWeightPositive),
    firstName: z
      .string()
      .trim()
      .min(1, messages.firstNameRequired)
      .max(100, messages.firstNameMaxLength),
    gender: z.enum(["female", "male", "other", "prefer_not_to_say"], {
      message: messages.genderRequired,
    }),
    lastName: optionalText(100, messages.lastNameMaxLength),
    notes: optionalText(10000, messages.notesMaxLength),
  });
}

export type CreateChildInput = z.input<ReturnType<typeof createChildSchema>>;
export type CreateChildValues = z.output<ReturnType<typeof createChildSchema>>;
