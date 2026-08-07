import "server-only";

import { z } from "zod";

const aiEnvironmentSchema = z.object({
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

export function calculateAiCost({
  embedding = false,
  inputTokens,
  outputTokens,
}: {
  embedding?: boolean;
  inputTokens: number;
  outputTokens: number;
}): number {
  const config = getAiEnvironment();
  const inputRate = embedding
    ? config.OPENAI_EMBEDDING_COST_PER_MILLION
    : config.OPENAI_INPUT_COST_PER_MILLION;
  const outputRate = embedding ? 0 : config.OPENAI_OUTPUT_COST_PER_MILLION;

  if (inputRate === 0 && outputRate === 0) return 0;
  return (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000;
}

export const AI_LIMITS = {
  maxContextRecords: 10,
  // Structured insight JSON plus GPT-5 reasoning tokens share this budget.
  memoryInsight: 512,
  monthlyStory: 300,
  weeklyStory: 200,
  yearBook: 800,
} as const;
