import "server-only";

import { z } from "zod";

const lemonEnvironmentSchema = z.object({
  LEMON_API_KEY: z.string().min(1),
  LEMON_SIGNING_SECRET: z.string().min(1),
  LEMON_STORE_ID: z.string().regex(/^\d+$/),
  LEMON_VARIANT_ID: z.string().regex(/^\d+$/),
  LEMON_WEBHOOK_SECRET: z.string().min(1),
});

export type LemonConfiguration = z.infer<typeof lemonEnvironmentSchema>;

export function getLemonConfiguration():
  { configured: false } | { configured: true; value: LemonConfiguration } {
  const result = lemonEnvironmentSchema.safeParse(process.env);
  return result.success
    ? { configured: true, value: result.data }
    : { configured: false };
}
