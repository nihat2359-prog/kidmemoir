import "server-only";

import { z } from "zod";

const aiEnvironmentSchema = z.object({
  CRON_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith("sk-").min(20),
  OPENAI_EMBEDDING_COST_PER_MILLION: z.coerce.number().nonnegative(),
  OPENAI_EMBEDDING_MODEL: z.string().min(1),
  OPENAI_INPUT_COST_PER_MILLION: z.coerce.number().nonnegative(),
  OPENAI_MODEL: z.string().min(1),
  OPENAI_OUTPUT_COST_PER_MILLION: z.coerce.number().nonnegative(),
});

export type AiEnvironment = z.infer<typeof aiEnvironmentSchema>;

let environment: AiEnvironment | undefined;

export function getAiEnvironment(): AiEnvironment {
  environment ??= aiEnvironmentSchema.parse(process.env);
  return environment;
}

export const AI_LIMITS = {
  maxContextRecords: 10,
  memoryInsight: 180,
  monthlyStory: 300,
  weeklyStory: 200,
  yearBook: 800,
} as const;
