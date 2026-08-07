import "server-only";

import type { User } from "@supabase/supabase-js";
import { getAiEnvironment } from "@/features/ai/config/aiConfig";
import { createEmbedding } from "@/features/ai/services/openAiClient";
import type { SmartDashboardInsight } from "@/features/ai/types/ai.types";
import { contentHash } from "@/features/ai/utils/hash";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

function asRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function nullableCard(value: Json | undefined) {
  const card = asRecord(value ?? null);
  return typeof card.id === "string" &&
    typeof card.title === "string" &&
    typeof card.occurred_at === "string"
    ? {
        id: card.id,
        occurredAt: card.occurred_at,
        summary: typeof card.summary === "string" ? card.summary : "",
        quote: typeof card.memory_quote === "string" ? card.memory_quote : "",
        title: card.title,
      }
    : null;
}

export async function getSmartDashboardIntelligence(
  childId: string,
): Promise<SmartDashboardInsight> {
  const supabase = await createClient();
  const result = await supabase.rpc("get_smart_dashboard_intelligence", {
    target_child_id: childId,
  });
  if (result.error)
    throw new Error("AI_DASHBOARD_QUERY_FAILED", { cause: result.error });
  const data = asRecord(result.data);
  const latest = asRecord(data.latestMemory ?? null);
  const story = asRecord(data.latestStory ?? null);
  return {
    emotionalMemory: nullableCard(data.emotionalMemory),
    favoriteCount:
      typeof data.favoriteCount === "number" ? data.favoriteCount : 0,
    latestMemory:
      typeof latest.id === "string" &&
      typeof latest.title === "string" &&
      typeof latest.occurred_at === "string"
        ? { id: latest.id, occurredAt: latest.occurred_at, title: latest.title }
        : null,
    latestStory:
      typeof story.created_at === "string" && typeof story.story === "string"
        ? { createdAt: story.created_at, story: story.story }
        : null,
    notable: nullableCard(data.notable),
    recentActivities: Array.isArray(data.recentActivities)
      ? data.recentActivities.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
  };
}

async function verifyChildOwnership(user: User, childId: string) {
  const supabase = await createClient();
  const result = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (result.error || !result.data) throw new Error("AI_CHILD_FORBIDDEN");
  return supabase;
}

async function hasPremiumAi(userId: string) {
  const result = await createAdminClient().rpc("user_has_ai_entitlement", {
    target_user_id: userId,
  });
  if (result.error)
    throw new Error("AI_ENTITLEMENT_FAILED", { cause: result.error });
  return result.data;
}

async function queryEmbedding(user: User, childId: string, query: string) {
  const normalized = query
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .slice(0, 500);
  if (!normalized) return null;
  const hash = contentHash(normalized);
  const admin = createAdminClient();
  const model = getAiEnvironment().OPENAI_EMBEDDING_MODEL;
  const cached = await admin
    .from("ai_query_embeddings")
    .select("embedding")
    .eq("user_id", user.id)
    .eq("child_id", childId)
    .eq("query_hash", hash)
    .eq("model", model)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (cached.error)
    throw new Error("AI_QUERY_CACHE_FAILED", { cause: cached.error });
  if (cached.data) return cached.data.embedding;

  const startedAt = performance.now();
  let created: Awaited<ReturnType<typeof createEmbedding>>;
  try {
    created = await createEmbedding(normalized, hash);
  } catch (error) {
    await admin.from("ai_usage").insert({
      child_id: childId,
      completion_tokens: 0,
      duration_ms: Math.round(performance.now() - startedAt),
      error_code:
        error instanceof Error
          ? error.message.slice(0, 120)
          : "AI_QUERY_EMBEDDING_FAILED",
      estimated_cost: 0,
      input_hash: hash,
      model,
      operation: "semantic_query_embedding",
      prompt_tokens: 0,
      success: false,
      total_tokens: 0,
      user_id: user.id,
    });
    throw error;
  }
  const saved = await admin.from("ai_query_embeddings").upsert(
    {
      child_id: childId,
      embedding: created.embedding,
      model: created.model,
      query_hash: hash,
      user_id: user.id,
    },
    { onConflict: "user_id,child_id,query_hash,model" },
  );
  if (saved.error)
    throw new Error("AI_QUERY_CACHE_SAVE_FAILED", { cause: saved.error });
  const estimatedCost =
    (created.tokens * getAiEnvironment().OPENAI_EMBEDDING_COST_PER_MILLION) /
    1_000_000;
  const usage = await admin.from("ai_usage").insert({
    child_id: childId,
    completion_tokens: 0,
    duration_ms: created.durationMs,
    estimated_cost: estimatedCost,
    input_hash: hash,
    model: created.model,
    operation: "semantic_query_embedding",
    prompt_tokens: created.tokens,
    success: true,
    total_tokens: created.tokens,
    user_id: user.id,
  });
  if (usage.error)
    throw new Error("AI_QUERY_USAGE_SAVE_FAILED", { cause: usage.error });
  return created.embedding;
}

export async function semanticMemorySearch(
  user: User,
  childId: string,
  query: string,
) {
  const supabase = await verifyChildOwnership(user, childId);
  if (!(await hasPremiumAi(user.id))) throw new Error("AI_PREMIUM_REQUIRED");
  const embedding = await queryEmbedding(user, childId, query);
  if (!embedding) return [];
  const matches = await supabase.rpc("match_memory_embeddings", {
    match_count: 10,
    query_embedding: embedding,
    target_child_id: childId,
  });
  if (matches.error)
    throw new Error("AI_SEMANTIC_SEARCH_FAILED", { cause: matches.error });
  const ids = (matches.data ?? []).map(({ event_id }) => event_id);
  if (!ids.length) return [];
  const events = await supabase
    .from("events")
    .select("id,title,description,occurred_at")
    .in("id", ids)
    .is("archived_at", null);
  if (events.error)
    throw new Error("AI_SEARCH_EVENTS_FAILED", { cause: events.error });
  const byId = new Map((events.data ?? []).map((event) => [event.id, event]));
  return (matches.data ?? []).flatMap((match) => {
    const event = byId.get(match.event_id);
    return event ? [{ ...event, similarity: match.similarity }] : [];
  });
}

export async function getMemoryConnections(
  user: User,
  childId: string,
  eventId: string,
) {
  const supabase = await verifyChildOwnership(user, childId);
  if (!(await hasPremiumAi(user.id))) return [];
  const [source, sourceInsight] = await Promise.all([
    supabase
      .from("ai_event_embeddings")
      .select("embedding")
      .eq("child_id", childId)
      .eq("event_id", eventId)
      .maybeSingle(),
    supabase
      .from("ai_analysis")
      .select("emotion,development_categories")
      .eq("child_id", childId)
      .eq("event_id", eventId)
      .maybeSingle(),
  ]);
  if (source.error || sourceInsight.error)
    throw new Error("AI_CONNECTION_SOURCE_FAILED", {
      cause: source.error ?? sourceInsight.error,
    });
  if (!source.data) return [];
  const matches = await supabase.rpc("match_memory_embeddings", {
    excluded_event_id: eventId,
    match_count: 5,
    query_embedding: source.data.embedding,
    target_child_id: childId,
  });
  if (matches.error)
    throw new Error("AI_CONNECTIONS_FAILED", { cause: matches.error });
  const ids = (matches.data ?? []).map(({ event_id }) => event_id);
  if (!ids.length) return [];
  const [events, insights] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,occurred_at")
      .in("id", ids)
      .is("archived_at", null),
    supabase
      .from("ai_analysis")
      .select("event_id,emotion,development_categories")
      .in("event_id", ids),
  ]);
  if (events.error || insights.error)
    throw new Error("AI_CONNECTION_EVENTS_FAILED", {
      cause: events.error ?? insights.error,
    });
  const byId = new Map((events.data ?? []).map((event) => [event.id, event]));
  const insightByEvent = new Map(
    (insights.data ?? []).map((insight) => [insight.event_id, insight]),
  );
  return (matches.data ?? []).flatMap((match) => {
    const event = byId.get(match.event_id);
    const insight = insightByEvent.get(match.event_id);
    const sharedDevelopment = insight?.development_categories.some((category) =>
      sourceInsight.data?.development_categories.includes(category),
    );
    const sameEmotion = Boolean(
      insight?.emotion && insight.emotion === sourceInsight.data?.emotion,
    );
    return event
      ? [
          {
            ...event,
            reason: sharedDevelopment
              ? ("development" as const)
              : sameEmotion
                ? ("emotion" as const)
                : ("context" as const),
            similarity: match.similarity,
          },
        ]
      : [];
  });
}

export async function getMemoryInsight(
  user: User,
  childId: string,
  eventId: string,
) {
  const supabase = await verifyChildOwnership(user, childId);
  const result = await supabase
    .from("ai_analysis")
    .select(
      "short_title,summary,memory_quote,importance_score,emotion,keywords",
    )
    .eq("child_id", childId)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (result.error)
    throw new Error("AI_MEMORY_INSIGHT_FAILED", { cause: result.error });
  return result.data;
}

export async function getDevelopmentTrends(user: User, childId: string) {
  const supabase = await verifyChildOwnership(user, childId);
  if (!(await hasPremiumAi(user.id))) return [];
  const result = await supabase
    .from("ai_analysis")
    .select("development_categories")
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (result.error)
    throw new Error("AI_DEVELOPMENT_TRENDS_FAILED", { cause: result.error });
  const counts = new Map<string, number>();
  for (const row of result.data ?? [])
    for (const category of row.development_categories)
      counts.set(category, (counts.get(category) ?? 0) + 1);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

export async function getMemoryHighlights(user: User, childId: string) {
  const supabase = await verifyChildOwnership(user, childId);
  const [explicit, firsts] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,occurred_at,importance,is_favorite")
      .eq("child_id", childId)
      .is("archived_at", null)
      .or("is_favorite.eq.true,importance.in.(high,critical)")
      .order("occurred_at", { ascending: false })
      .limit(20),
    supabase
      .from("ai_analysis")
      .select("event_id")
      .eq("child_id", childId)
      .contains("development_categories", ["firsts"])
      .limit(20),
  ]);
  if (explicit.error || firsts.error)
    throw new Error("AI_HIGHLIGHTS_FAILED", {
      cause: explicit.error ?? firsts.error,
    });
  const explicitRows = explicit.data ?? [];
  const knownIds = new Set(explicitRows.map(({ id }) => id));
  const firstIds = (firsts.data ?? [])
    .map(({ event_id }) => event_id)
    .filter((id) => !knownIds.has(id));
  if (!firstIds.length) return explicitRows;
  const firstEvents = await supabase
    .from("events")
    .select("id,title,occurred_at,importance,is_favorite")
    .in("id", firstIds)
    .is("archived_at", null);
  if (firstEvents.error)
    throw new Error("AI_FIRST_HIGHLIGHTS_FAILED", { cause: firstEvents.error });
  return [...explicitRows, ...(firstEvents.data ?? [])]
    .sort(
      (left, right) =>
        new Date(right.occurred_at).getTime() -
        new Date(left.occurred_at).getTime(),
    )
    .slice(0, 20);
}

export function yearsSince(occurredAt: string, reference = new Date()): number {
  const occurred = new Date(occurredAt);
  const years = reference.getUTCFullYear() - occurred.getUTCFullYear();
  return occurred.getUTCMonth() === reference.getUTCMonth() &&
    occurred.getUTCDate() === reference.getUTCDate()
    ? Math.max(0, years)
    : 0;
}
