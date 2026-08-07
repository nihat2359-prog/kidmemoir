import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { calculateAiCost } from "@/features/ai/config/aiConfig";
import type { AiJob, OpenAiUsage } from "@/features/ai/types/ai.types";
import type { Database, Json } from "@/types/database.types";

export async function claimAiJobs(
  supabase: SupabaseClient<Database>,
  batchSize: number,
): Promise<AiJob[]> {
  await supabase.rpc("enqueue_due_ai_stories", {});
  const result = await supabase.rpc("claim_ai_jobs", { batch_size: batchSize });
  if (result.error)
    throw new Error("AI_JOB_CLAIM_FAILED", { cause: result.error });
  return (result.data ?? []) as AiJob[];
}

export async function hasAiEntitlement(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const result = await supabase.rpc("user_has_ai_entitlement", {
    target_user_id: userId,
  });
  if (result.error)
    throw new Error("AI_ENTITLEMENT_FAILED", { cause: result.error });
  return result.data;
}

export async function canRunAiJob(
  supabase: SupabaseClient<Database>,
  job: AiJob,
): Promise<boolean> {
  const result = await supabase.rpc("can_run_ai_job", {
    target_job_id: job.id,
    target_kind: job.kind,
    target_user_id: job.user_id,
  });
  if (result.error)
    throw new Error("AI_LICENSE_CHECK_FAILED", { cause: result.error });
  return result.data;
}

export async function findCachedArtifact(
  supabase: SupabaseClient<Database>,
  job: AiJob,
) {
  const result = await supabase
    .from("ai_artifacts")
    .select("id")
    .eq("child_id", job.child_id)
    .eq("kind", job.kind)
    .eq("prompt_version", job.prompt_version)
    .eq("input_hash", job.input_hash)
    .maybeSingle();
  if (result.error)
    throw new Error("AI_CACHE_LOOKUP_FAILED", { cause: result.error });
  return result.data;
}

export async function loadMemoryContext(
  supabase: SupabaseClient<Database>,
  job: AiJob,
) {
  if (!job.event_id) throw new Error("AI_EVENT_REQUIRED");
  const [eventResult, tagsResult, settingsResult, recentQuotesResult] =
    await Promise.all([
      supabase
        .from("events")
        .select("id,title,description,occurred_at,location,mood,importance")
        .eq("id", job.event_id)
        .eq("child_id", job.child_id)
        .is("archived_at", null)
        .maybeSingle(),
      supabase.from("event_tags").select("tag").eq("event_id", job.event_id),
      supabase
        .from("user_settings")
        .select("language")
        .eq("user_id", job.user_id)
        .maybeSingle(),
      supabase
        .from("ai_analysis")
        .select("memory_quote")
        .eq("child_id", job.child_id)
        .not("memory_quote", "is", null)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
  if (
    eventResult.error ||
    tagsResult.error ||
    settingsResult.error ||
    recentQuotesResult.error
  )
    throw new Error("AI_MEMORY_CONTEXT_FAILED", {
      cause:
        eventResult.error ??
        tagsResult.error ??
        settingsResult.error ??
        recentQuotesResult.error,
    });
  if (!eventResult.data) throw new Error("AI_EVENT_NOT_FOUND");
  return {
    ...eventResult.data,
    avoidQuotes: (recentQuotesResult.data ?? []).flatMap(({ memory_quote }) =>
      memory_quote ? [memory_quote] : [],
    ),
    language: settingsResult.data?.language === "tr" ? "tr" : "en",
    tags: (tagsResult.data ?? []).map(({ tag }) => tag),
  };
}

export async function loadStoryContext(
  supabase: SupabaseClient<Database>,
  job: AiJob,
) {
  if (!job.period_start || !job.period_end)
    throw new Error("AI_PERIOD_REQUIRED");
  if (job.kind === "year_book") {
    const monthly = await supabase
      .from("ai_artifacts")
      .select("id,content,period_start,source_event_ids")
      .eq("child_id", job.child_id)
      .eq("kind", "monthly_story")
      .gte("period_start", job.period_start)
      .lte("period_end", job.period_end)
      .order("period_start", { ascending: true })
      .limit(12);
    if (monthly.error)
      throw new Error("AI_YEAR_CONTEXT_FAILED", { cause: monthly.error });
    return (monthly.data ?? []).map((artifact) => ({
      categories: [],
      emotion: null,
      eventId: artifact.source_event_ids[0] ?? artifact.id,
      occurredAt: artifact.period_start,
      summary:
        artifact.content &&
        typeof artifact.content === "object" &&
        !Array.isArray(artifact.content) &&
        typeof artifact.content.story === "string"
          ? artifact.content.story
          : "",
      title: artifact.period_start,
    }));
  }
  const periodEnd = `${job.period_end}T23:59:59.999Z`;
  const events = await supabase
    .from("events")
    .select("id,occurred_at")
    .eq("child_id", job.child_id)
    .is("archived_at", null)
    .gte("occurred_at", `${job.period_start}T00:00:00.000Z`)
    .lte("occurred_at", periodEnd)
    .order("occurred_at", { ascending: true })
    .limit(1000);
  if (events.error)
    throw new Error("AI_STORY_EVENTS_FAILED", { cause: events.error });
  const eventIds = (events.data ?? []).map(({ id }) => id);
  if (!eventIds.length) return [];
  const result = await supabase
    .from("ai_analysis")
    .select("event_id,short_title,summary,emotion,development_categories")
    .in("event_id", eventIds);
  if (result.error)
    throw new Error("AI_STORY_CONTEXT_FAILED", { cause: result.error });
  const occurredAt = new Map(
    (events.data ?? []).map((event) => [event.id, event.occurred_at]),
  );
  return (result.data ?? []).map((item) => ({
    categories: item.development_categories,
    emotion: item.emotion,
    eventId: item.event_id,
    occurredAt: occurredAt.get(item.event_id),
    summary: item.summary,
    title: item.short_title,
  }));
}

export async function saveArtifact(
  supabase: SupabaseClient<Database>,
  job: AiJob,
  model: string,
  content: Json,
  sourceEventIds: string[],
) {
  const result = await supabase
    .from("ai_artifacts")
    .upsert(
      {
        child_id: job.child_id,
        content,
        event_id: job.event_id,
        input_hash: job.input_hash,
        kind: job.kind,
        model,
        period_end: job.period_end,
        period_start: job.period_start,
        prompt_version: job.prompt_version,
        source_event_ids: sourceEventIds,
        user_id: job.user_id,
      },
      { onConflict: "child_id,kind,prompt_version,input_hash" },
    )
    .select("id")
    .single();
  if (result.error)
    throw new Error("AI_ARTIFACT_SAVE_FAILED", { cause: result.error });
  return result.data.id;
}

export async function saveMemoryInsight(
  supabase: SupabaseClient<Database>,
  job: AiJob,
  model: string,
  content: Json,
) {
  if (!job.event_id) throw new Error("AI_EVENT_REQUIRED");
  const result = await supabase.rpc("save_memory_ai_insight", {
    target_child_id: job.child_id,
    target_content: content,
    target_event_id: job.event_id,
    target_input_hash: job.input_hash,
    target_model: model,
    target_prompt_version: job.prompt_version,
    target_user_id: job.user_id,
  });
  if (result.error)
    throw new Error("AI_INSIGHT_SAVE_FAILED", { cause: result.error });
  return result.data;
}

export async function saveUsage(
  supabase: SupabaseClient<Database>,
  job: AiJob,
  input: {
    artifactId?: string;
    cacheHit?: boolean;
    durationMs: number;
    embedding?: boolean;
    errorCode?: string;
    model: string;
    operation: string;
    success: boolean;
    usage: OpenAiUsage;
  },
) {
  const estimatedCost = calculateAiCost({
    embedding: input.embedding,
    inputTokens: input.usage.inputTokens,
    outputTokens: input.usage.outputTokens,
  });
  const result = await supabase.from("ai_usage").insert({
    artifact_id: input.artifactId ?? null,
    cache_hit: input.cacheHit ?? false,
    child_id: job.child_id,
    completion_tokens: input.usage.outputTokens,
    duration_ms: input.durationMs,
    error_code: input.errorCode ?? null,
    estimated_cost: estimatedCost,
    event_id: job.event_id,
    input_hash: job.input_hash,
    model: input.model,
    operation: input.operation,
    prompt_tokens: input.usage.inputTokens,
    prompt_version: job.prompt_version,
    success: input.success,
    total_tokens: input.usage.totalTokens,
    user_id: job.user_id,
  });
  if (result.error)
    throw new Error("AI_USAGE_SAVE_FAILED", { cause: result.error });
}

export async function completeJob(
  supabase: SupabaseClient<Database>,
  jobId: string,
  status: "completed" | "skipped",
) {
  const result = await supabase
    .from("ai_jobs")
    .update({
      completed_at: new Date().toISOString(),
      error_code: null,
      status,
    })
    .eq("id", jobId);
  if (result.error)
    throw new Error("AI_JOB_COMPLETE_FAILED", { cause: result.error });
}

export async function failJob(
  supabase: SupabaseClient<Database>,
  job: AiJob,
  errorCode: string,
) {
  const finalAttempt = job.attempts >= job.max_attempts;
  const result = await supabase
    .from("ai_jobs")
    .update({
      available_at: new Date(
        Date.now() + 2 ** job.attempts * 60_000,
      ).toISOString(),
      error_code: errorCode.slice(0, 120),
      locked_at: null,
      status: finalAttempt ? "failed" : "pending",
    })
    .eq("id", job.id);
  if (result.error)
    throw new Error("AI_JOB_FAILURE_SAVE_FAILED", { cause: result.error });
}
