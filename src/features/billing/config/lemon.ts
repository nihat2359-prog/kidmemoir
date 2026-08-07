import "server-only";

import { z } from "zod";

const lemonEnvironmentSchema = z.object({
  LEMON_API_KEY: z.string().min(1),
  LEMON_PRODUCT_ID: z.string().regex(/^\d+$/),
  LEMON_STORE_ID: z.string().regex(/^\d+$/),
  LEMON_VARIANT_ID: z.string().regex(/^\d+$/),
  LEMON_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type LemonConfiguration = z.infer<typeof lemonEnvironmentSchema>;

export function getLemonConfiguration():
  { configured: false } | { configured: true; value: LemonConfiguration } {
  const result = lemonEnvironmentSchema.safeParse(process.env);
  return result.success
    ? { configured: true, value: result.data }
    : { configured: false };
}

export function requireLemonConfiguration(): LemonConfiguration {
  const result = lemonEnvironmentSchema.safeParse(process.env);
  if (!result.success) throw new Error("Billing configuration is unavailable");
  return result.data;
}
