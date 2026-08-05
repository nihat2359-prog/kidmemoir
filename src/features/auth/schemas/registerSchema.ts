import { z } from "zod";

export type RegisterValidationMessages = Readonly<{
  confirmPasswordRequired: string;
  emailInvalid: string;
  emailRequired: string;
  firstNameMaxLength: string;
  firstNameMinLength: string;
  firstNameRequired: string;
  lastNameMaxLength: string;
  lastNameMinLength: string;
  lastNameRequired: string;
  passwordLowercase: string;
  passwordMinLength: string;
  passwordNumber: string;
  passwordRequired: string;
  passwordUppercase: string;
  passwordsMismatch: string;
  privacyRequired: string;
  termsRequired: string;
}>;

export function createRegisterSchema(messages: RegisterValidationMessages) {
  return z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, messages.firstNameRequired)
        .min(2, messages.firstNameMinLength)
        .max(100, messages.firstNameMaxLength),
      lastName: z
        .string()
        .trim()
        .min(1, messages.lastNameRequired)
        .min(2, messages.lastNameMinLength)
        .max(100, messages.lastNameMaxLength),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMinLength)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[0-9]/, messages.passwordNumber),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
      terms: z.boolean().refine(Boolean, messages.termsRequired),
      privacy: z.boolean().refine(Boolean, messages.privacyRequired),
    })
    .superRefine(({ confirmPassword, password }, context) => {
      if (confirmPassword && confirmPassword !== password) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.passwordsMismatch,
          path: ["confirmPassword"],
        });
      }
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
