import { z } from "zod";

export type ForgotPasswordValidationMessages = Readonly<{
  emailInvalid: string;
  emailRequired: string;
}>;

export function createForgotPasswordSchema(
  messages: ForgotPasswordValidationMessages,
) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
