import "server-only";
import type { User } from "@supabase/supabase-js";
import { getAccountPlan } from "@/features/account/services/accountService";
import { getMemoryConnections } from "@/features/ai/services/intelligenceService";
import { getMemoryOfTheDay } from "@/features/dashboard/services/memoryOfTheDayService";
import { createClient } from "@/lib/supabase/server";

export async function getAiPageData(user: User) {
  const supabase = await createClient();
  const children = await supabase
    .from("children")
    .select("id,first_name,last_name")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("is_default", { ascending: false })
    .order("created_at");
  if (children.error)
    throw new Error("AI_PAGE_CHILDREN_FAILED", { cause: children.error });
  const child = children.data?.[0] ?? null;
  if (!child) return null;
  const insights = await supabase
    .from("ai_analysis")
    .select(
      "id,event_id,short_title,summary,memory_quote,emotion,importance_score,created_at",
    )
    .eq("child_id", child.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (insights.error)
    throw new Error("AI_PAGE_INSIGHTS_FAILED", { cause: insights.error });
  const eventIds = (insights.data ?? [])
    .map(({ event_id }) => event_id)
    .filter((id): id is string => Boolean(id));
  const events = eventIds.length
    ? await supabase
        .from("events")
        .select("id,title,occurred_at")
        .in("id", eventIds)
        .is("archived_at", null)
    : { data: [], error: null };
  if (events.error)
    throw new Error("AI_PAGE_EVENTS_FAILED", { cause: events.error });
  const byId = new Map((events.data ?? []).map((event) => [event.id, event]));
  const latestEventId = eventIds[0] ?? null;
  const [memory, connections, plan] = await Promise.all([
    getMemoryOfTheDay(supabase, child.id),
    latestEventId
      ? getMemoryConnections(user, child.id, latestEventId)
      : Promise.resolve([]),
    getAccountPlan(user),
  ]);
  return {
    child: {
      id: child.id,
      name: [child.first_name, child.last_name].filter(Boolean).join(" "),
    },
    connections,
    insights: (insights.data ?? []).flatMap((row) => {
      const event = row.event_id ? byId.get(row.event_id) : undefined;
      return event
        ? [
            {
              createdAt: row.created_at,
              emotion: row.emotion,
              eventId: event.id,
              id: row.id,
              importance: row.importance_score,
              occurredAt: event.occurred_at,
              quote: row.memory_quote,
              summary: row.summary,
              title: row.short_title || event.title,
            },
          ]
        : [];
    }),
    isPremium: plan === "premium",
    memoryOfTheDay: memory,
  };
}
