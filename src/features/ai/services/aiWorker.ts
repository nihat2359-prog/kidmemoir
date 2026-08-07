import "server-only";

import { z } from "zod";
import { AI_LIMITS, getAiEnvironment } from "@/features/ai/config/aiConfig";
import { deriveRuleBasedMemoryInsight } from "@/features/ai/rules/memoryInsightRules";
import {
  AI_PROMPTS,
  MEMORY_INSIGHT_SCHEMA,
  STORY_SCHEMA,
} from "@/features/ai/prompts/prompts";
import {
  canRunAiJob,
  claimAiJobById,
  claimMemoryInsightJob,
  claimPendingMemoryInsight,
  completeJob,
  failJob,
  findCachedArtifact,
  hasAiEntitlement,
  loadMemoryContext,
  loadStoryContext,
  saveArtifact,
  saveMemoryInsight,
  saveUsage,
} from "@/features/ai/services/aiRepository";
import {
  createEmbedding,
  createStructuredResponse,
} from "@/features/ai/services/openAiClient";
import type {
  AiJob,
  MemoryInsight,
  StoryArtifact,
} from "@/features/ai/types/ai.types";
import { contentHash } from "@/features/ai/utils/hash";
import { reportException } from "@/lib/monitoring";
import { createAdminClient } from "@/lib/supabase/admin";

const memoryInsightSchema = z.object({
  developmentCategories: z.array(z.string()).max(3),
  emotion: z.enum([
    "joy",
    "pride",
    "love",
    "calm",
    "curiosity",
    "excitement",
    "sadness",
    "fear",
    "surprise",
    "neutral",
  ]),
  keywords: z.array(z.string().min(1).max(40)).max(5),
  memoryQuote: z.string().min(1).max(240),
  importance: z.number().int().min(1).max(100),
  shortTitle: z.string().min(1).max(80),
  summary: z.string().min(1).max(480),
});

const storyArtifactSchema = z.object({
  highlights: z.array(z.string().min(1)).max(5),
  story: z.string().min(1),
  themes: z.array(z.string().min(1)).max(5),
});

function safeIdentifier(userId: string) {
  return contentHash({ userId }).slice(0, 64);
}

function embeddingText(memory: Awaited<ReturnType<typeof loadMemoryContext>>) {
  return [
    memory.title,
    memory.description,
    memory.location,
    memory.mood,
    memory.importance,
    memory.tags.join(" "),
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);
}

async function ensureMemoryEmbedding(
  job: AiJob,
  memory?: Awaited<ReturnType<typeof loadMemoryContext>>,
) {
  if (!job.event_id) throw new Error("AI_EVENT_REQUIRED");
  const supabase = createAdminClient();
  const existing = await supabase
    .from("ai_event_embeddings")
    .select("id")
    .eq("event_id", job.event_id)
    .maybeSingle();
  if (existing.error)
    throw new Error("AI_EMBEDDING_LOOKUP_FAILED", { cause: existing.error });
  if (existing.data) return;
  const source = embeddingText(
    memory ?? (await loadMemoryContext(supabase, job)),
  );
  const embedding = await createEmbedding(
    source,
    contentHash({ inputHash: job.input_hash, operation: "memory_embedding" }),
  );
  const embeddingResult = await supabase.from("ai_event_embeddings").upsert(
    {
      child_id: job.child_id,
      content_hash: contentHash(source),
      embedding: embedding.embedding,
      event_id: job.event_id,
      model: embedding.model,
      user_id: job.user_id,
    },
    { onConflict: "event_id" },
  );
  if (embeddingResult.error)
    throw new Error("AI_EMBEDDING_SAVE_FAILED", {
      cause: embeddingResult.error,
    });
  await saveUsage(supabase, job, {
    durationMs: embedding.durationMs,
    embedding: true,
    model: embedding.model,
    operation: "memory_embedding",
    success: true,
    usage: {
      inputTokens: embedding.tokens,
      outputTokens: 0,
      totalTokens: embedding.tokens,
    },
  });
}

async function processMemoryInsight(job: AiJob, includeEmbedding: boolean) {
  const supabase = createAdminClient();
  const memory = await loadMemoryContext(supabase, job);
  const ruleBased = deriveRuleBasedMemoryInsight(memory);
  if (ruleBased) {
    await saveMemoryInsight(supabase, job, "rule-engine-v1", ruleBased);
    if (includeEmbedding) await ensureMemoryEmbedding(job, memory);
    return;
  }
  const result = await createStructuredResponse<MemoryInsight>({
    input: memory,
    idempotencyKey: contentHash({
      inputHash: job.input_hash,
      promptVersion: job.prompt_version,
    }),
    instructions: AI_PROMPTS.memory_insight,
    maxOutputTokens: AI_LIMITS.memoryInsight,
    name: "memory_insight",
    outputSchema: MEMORY_INSIGHT_SCHEMA,
    parse: (value) => memoryInsightSchema.parse(value),
    safetyIdentifier: safeIdentifier(job.user_id),
  });
  const artifactId = await saveMemoryInsight(
    supabase,
    job,
    result.model,
    result.output,
  );

  await saveUsage(supabase, job, {
    artifactId,
    durationMs: result.durationMs,
    model: result.model,
    operation: job.kind,
    success: true,
    usage: result.usage,
  });

  if (includeEmbedding) await ensureMemoryEmbedding(job, memory);
}

async function processStory(job: AiJob) {
  const supabase = createAdminClient();
  const context = await loadStoryContext(supabase, job);
  if (!context.length) {
    await completeJob(supabase, job.id, "skipped");
    return;
  }
  const selected = context.slice(-AI_LIMITS.maxContextRecords);
  const maxOutputTokens =
    job.kind === "weekly_story"
      ? AI_LIMITS.weeklyStory
      : job.kind === "monthly_story"
        ? AI_LIMITS.monthlyStory
        : AI_LIMITS.yearBook;
  const result = await createStructuredResponse<StoryArtifact>({
    input: selected,
    idempotencyKey: contentHash({
      inputHash: job.input_hash,
      promptVersion: job.prompt_version,
    }),
    instructions: AI_PROMPTS[job.kind],
    maxOutputTokens,
    name: job.kind,
    outputSchema: STORY_SCHEMA,
    parse: (value) => storyArtifactSchema.parse(value),
    safetyIdentifier: safeIdentifier(job.user_id),
  });
  const artifactId = await saveArtifact(
    supabase,
    job,
    result.model,
    result.output,
    selected.map(({ eventId }) => eventId),
  );
  await saveUsage(supabase, job, {
    artifactId,
    durationMs: result.durationMs,
    model: result.model,
    operation: job.kind,
    success: true,
    usage: result.usage,
  });
}

async function processJob(job: AiJob) {
  const supabase = createAdminClient();
  const premium = await hasAiEntitlement(supabase, job.user_id);
  const cached = await findCachedArtifact(supabase, job);
  if (cached) {
    if (premium && job.kind === "memory_insight")
      await ensureMemoryEmbedding(job);
    await saveUsage(supabase, job, {
      artifactId: cached.id,
      cacheHit: true,
      durationMs: 0,
      model: "cache",
      operation: job.kind,
      success: true,
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    });
    await completeJob(supabase, job.id, "completed");
    return;
  }
  if (!(await canRunAiJob(supabase, job))) {
    await completeJob(supabase, job.id, "skipped");
    return;
  }
  if (job.kind === "memory_insight") await processMemoryInsight(job, premium);
  else await processStory(job);
  await completeJob(supabase, job.id, "completed");
}

async function executeClaimedJob(job: AiJob) {
  getAiEnvironment();
  try {
    await processJob(job);
    return { id: job.id, success: true } as const;
  } catch (error) {
    const code = error instanceof Error ? error.message : "AI_JOB_UNKNOWN";
    reportException(error, { jobId: job.id, kind: job.kind });
    await saveUsage(createAdminClient(), job, {
      durationMs: 0,
      errorCode: code,
      model: getAiEnvironment().OPENAI_MODEL,
      operation: job.kind,
      success: false,
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    }).catch((usageError: unknown) =>
      reportException(usageError, {
        jobId: job.id,
        operation: "ai_usage_failure",
      }),
    );
    await failJob(createAdminClient(), job, code);
    return { id: job.id, success: false } as const;
  }
}

export async function runMemoryInsightForEvent(eventId: string) {
  const job = await claimMemoryInsightJob(createAdminClient(), eventId);
  return job ? executeClaimedJob(job) : null;
}

export async function runAiJobById(jobId: string) {
  const job = await claimAiJobById(createAdminClient(), jobId);
  return job ? executeClaimedJob(job) : null;
}

export async function runPendingMemoryInsightForChild(childId: string) {
  const job = await claimPendingMemoryInsight(createAdminClient(), childId);
  return job ? executeClaimedJob(job) : null;
}
