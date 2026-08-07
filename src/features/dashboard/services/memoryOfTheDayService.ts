import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemoryOfTheDay } from "@/features/dashboard/types/dashboard.types";
import type { Database, Json } from "@/types/database.types";

const CARD_TYPES = new Set<MemoryOfTheDay["type"]>([
  "anniversary",
  "development",
  "emotional",
  "family",
  "favorite",
  "first",
  "milestone",
  "photo",
  "recommended",
  "smile",
]);

function record(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export async function getMemoryOfTheDay(
  supabase: SupabaseClient<Database>,
  childId: string,
): Promise<MemoryOfTheDay | null> {
  const result = await supabase.rpc("get_memory_of_the_day", {
    target_child_id: childId,
  });
  if (result.error)
    throw new Error("Dashboard memory of the day failed", {
      cause: result.error,
    });
  if (!result.data) return null;
  const value = record(result.data);
  if (
    typeof value.eventId !== "string" ||
    typeof value.title !== "string" ||
    typeof value.occurredAt !== "string" ||
    typeof value.type !== "string" ||
    !CARD_TYPES.has(value.type as MemoryOfTheDay["type"])
  )
    return null;

  const media = await supabase
    .from("event_media")
    .select("storage_path,thumbnail_path")
    .eq("event_id", value.eventId)
    .eq("media_type", "photo")
    .is("archived_at", null)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (media.error)
    throw new Error("Dashboard memory media failed", { cause: media.error });
  const path = media.data?.thumbnail_path ?? media.data?.storage_path ?? null;
  const signed = path
    ? await supabase.storage.from("event-media").createSignedUrl(path, 3600)
    : { data: null, error: null };

  return {
    description: typeof value.description === "string" ? value.description : "",
    eventId: value.eventId,
    mediaUrl: signed.data?.signedUrl ?? null,
    occurredAt: value.occurredAt,
    quote: typeof value.memoryQuote === "string" ? value.memoryQuote : "",
    title: value.title,
    type: value.type as MemoryOfTheDay["type"],
    yearsAgo: typeof value.yearsAgo === "number" ? value.yearsAgo : 0,
  };
}
