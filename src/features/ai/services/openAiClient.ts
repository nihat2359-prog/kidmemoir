import "server-only";

import { z } from "zod";
import { getAiEnvironment } from "@/features/ai/config/aiConfig";
import type { OpenAiResult } from "@/features/ai/types/ai.types";

const responseSchema = z.object({
  model: z.string(),
  output: z.array(
    z.object({
      content: z.array(
        z.object({
          text: z.string().optional(),
          type: z.string(),
        }),
      ),
    }),
  ),
  usage: z
    .object({
      input_tokens: z.number().int().nonnegative().default(0),
      output_tokens: z.number().int().nonnegative().default(0),
      total_tokens: z.number().int().nonnegative().default(0),
    })
    .optional(),
});

const embeddingSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })).min(1),
  model: z.string(),
  usage: z
    .object({ prompt_tokens: z.number().int().nonnegative().default(0) })
    .optional(),
});

async function openAiRequest(
  path: string,
  body: unknown,
  idempotencyKey: string,
): Promise<unknown> {
  const { OPENAI_API_KEY } = getAiEnvironment();
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    body: JSON.stringify(body),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    method: "POST",
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`OPENAI_${response.status}`);
  return response.json();
}

export async function createStructuredResponse<T>({
  input,
  instructions,
  idempotencyKey,
  maxOutputTokens,
  name,
  outputSchema,
  parse,
  safetyIdentifier,
}: {
  input: unknown;
  instructions: string;
  idempotencyKey: string;
  maxOutputTokens: number;
  name: string;
  outputSchema: Record<string, unknown>;
  parse: (value: unknown) => T;
  safetyIdentifier: string;
}): Promise<OpenAiResult<T>> {
  const { OPENAI_MODEL } = getAiEnvironment();
  const startedAt = performance.now();
  const raw = await openAiRequest(
    "responses",
    {
      input: JSON.stringify(input),
      instructions,
      max_output_tokens: maxOutputTokens,
      model: OPENAI_MODEL,
      safety_identifier: safetyIdentifier,
      store: false,
      text: {
        format: {
          name,
          schema: outputSchema,
          strict: true,
          type: "json_schema",
        },
        verbosity: "low",
      },
    },
    idempotencyKey,
  );
  const response = responseSchema.parse(raw);
  const text = response.output
    .flatMap((item) => item.content)
    .find((content) => typeof content.text === "string")?.text;
  if (!text) throw new Error("OPENAI_EMPTY_OUTPUT");
  const usage = response.usage;
  return {
    durationMs: Math.round(performance.now() - startedAt),
    model: response.model,
    output: parse(JSON.parse(text) as unknown),
    usage: {
      inputTokens: usage?.input_tokens ?? 0,
      outputTokens: usage?.output_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
    },
  };
}

export async function createEmbedding(
  input: string,
  idempotencyKey: string,
): Promise<
  Readonly<{
    durationMs: number;
    embedding: number[];
    model: string;
    tokens: number;
  }>
> {
  const { OPENAI_EMBEDDING_MODEL } = getAiEnvironment();
  const startedAt = performance.now();
  const raw = await openAiRequest(
    "embeddings",
    {
      dimensions: 1536,
      encoding_format: "float",
      input,
      model: OPENAI_EMBEDDING_MODEL,
    },
    idempotencyKey,
  );
  const response = embeddingSchema.parse(raw);
  return {
    durationMs: Math.round(performance.now() - startedAt),
    embedding: response.data[0]!.embedding,
    model: response.model,
    tokens: response.usage?.prompt_tokens ?? 0,
  };
}
