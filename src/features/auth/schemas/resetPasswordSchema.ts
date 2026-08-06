import { z } from "zod";

export type ResetPasswordValidationMessages = Readonly<{
  confirmPasswordRequired: string;
  passwordLowercase: string;
  passwordMinLength: string;
  passwordNumber: string;
  passwordRequired: string;
  passwordUppercase: string;
  passwordsMismatch: string;
}>;

export function createResetPasswordSchema(
  messages: ResetPasswordValidationMessages,
) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMinLength)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[0-9]/, messages.passwordNumber),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
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

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
