import { z } from "zod";

export type LoginValidationMessages = Readonly<{
  emailInvalid: string;
  emailRequired: string;
  passwordMinLength: string;
  passwordRequired: string;
}>;

export function createLoginSchema(messages: LoginValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMinLength),
    rememberMe: z.boolean(),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
