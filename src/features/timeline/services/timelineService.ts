import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getOnThisDayMemories } from "@/features/on-this-day";
import type {
  TimelineCursor,
  TimelineFiltersValue,
  TimelineItem,
  TimelineMedia,
  TimelinePageResult,
  TimelineScreenData,
} from "@/features/timeline/types/timeline.types";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 12;
type Client = SupabaseClient<Database>;
type TimelineEventRow = Pick<
  Database["public"]["Tables"]["events"]["Row"],
  "category_id" | "description" | "id" | "is_favorite" | "occurred_at" | "title"
>;

function safeSearch(value: string) {
  return value
    .replace(/[%,()._]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getTimelinePage(
  supabase: Client,
  childId: string,
  filters: TimelineFiltersValue,
  cursor: TimelineCursor | null,
): Promise<TimelinePageResult> {
  const mediaFiltered =
    filters.type === "photo" ||
    filters.type === "video" ||
    filters.type === "audio";
  const baseSelection =
    "id,title,description,category_id,occurred_at,is_favorite";
  const selection: string = mediaFiltered
    ? `${baseSelection},event_media!inner()`
    : filters.type === "written"
      ? `${baseSelection},event_media()`
      : baseSelection;
  let query = supabase
    .from("events")
    .select(selection)
    .eq("child_id", childId)
    .is("archived_at", null);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.favorite) query = query.eq("is_favorite", true);
  if (filters.from)
    query = query.gte("occurred_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to)
    query = query.lte("occurred_at", `${filters.to}T23:59:59.999Z`);
  const search = safeSearch(filters.query);
  if (search)
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (mediaFiltered) {
    query = query
      .eq("event_media.media_type", filters.type)
      .is("event_media.archived_at", null);
  }
  if (filters.type === "written")
    query = query.is("event_media.archived_at", null).is("event_media", null);
  if (cursor)
    query = query.or(
      `occurred_at.lt.${cursor.occurredAt},and(occurred_at.eq.${cursor.occurredAt},id.lt.${cursor.id})`,
    );
  const result = await query
    .order("occurred_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);
  if (result.error)
    throw new Error("Timeline events could not be loaded", {
      cause: result.error,
    });
  const eventRows = result.data as unknown as TimelineEventRow[];
  const rows = eventRows.slice(0, PAGE_SIZE);
  const eventIds = rows.map((event) => event.id);
  const mediaResult = eventIds.length
    ? await supabase
        .from("event_media")
        .select("event_id,media_type,storage_path,thumbnail_path")
        .in("event_id", eventIds)
        .is("archived_at", null)
        .order("created_at")
    : { data: [], error: null };
  if (mediaResult.error)
    throw new Error("Timeline media could not be loaded", {
      cause: mediaResult.error,
    });
  const mediaPaths = (mediaResult.data ?? []).map(
    (media) => media.thumbnail_path || media.storage_path,
  );
  const signed = mediaPaths.length
    ? await supabase.storage
        .from("event-media")
        .createSignedUrls(mediaPaths, 3600)
    : { data: [], error: null };
  if (signed.error)
    console.error("Timeline signed media URLs failed", signed.error);
  const urlByPath = new Map(
    (signed.data ?? []).map((item, index) => [
      mediaPaths[index],
      item.signedUrl,
    ]),
  );
  const items: TimelineItem[] = rows.map((event) => ({
    categoryId: event.category_id,
    description: event.description,
    id: event.id,
    isFavorite: event.is_favorite,
    media: (mediaResult.data ?? [])
      .filter(
        (media) =>
          media.event_id === event.id &&
          ["photo", "video", "audio"].includes(media.media_type),
      )
      .map<TimelineMedia>((media) => ({
        mediaType: media.media_type as TimelineMedia["mediaType"],
        url: urlByPath.get(media.thumbnail_path || media.storage_path) ?? "",
      }))
      .filter((media) => Boolean(media.url)),
    occurredAt: event.occurred_at,
    title: event.title,
  }));
  const lastRaw = eventRows[Math.min(PAGE_SIZE, eventRows.length) - 1];
  return {
    items,
    nextCursor:
      eventRows.length > PAGE_SIZE && lastRaw
        ? { id: lastRaw.id, occurredAt: lastRaw.occurred_at }
        : null,
  };
}

export async function getTimelineScreenData(
  user: User,
  filters: TimelineFiltersValue,
): Promise<TimelineScreenData | null> {
  const supabase = await createClient();
  const [child, categories] = await Promise.all([
    supabase
      .from("children")
      .select("id,first_name,last_name,birth_date,avatar")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("is_default", { ascending: false })
      .order("created_at")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("event_categories")
      .select("id,name")
      .eq("is_active", true)
      .order("sort_order"),
  ]);
  if (child.error || categories.error)
    throw new Error("Timeline context could not be loaded", {
      cause: child.error ?? categories.error,
    });
  if (!child.data) return null;
  const [page, avatar, onThisDay] = await Promise.all([
    getTimelinePage(supabase, child.data.id, filters, null),
    child.data.avatar
      ? supabase.storage
          .from("avatars")
          .createSignedUrl(child.data.avatar, 3600)
      : Promise.resolve({ data: null, error: null }),
    getOnThisDayMemories(supabase, child.data.id, child.data.birth_date),
  ]);
  return {
    categories: categories.data ?? [],
    child: {
      avatarUrl: avatar.data?.signedUrl ?? null,
      firstName: child.data.first_name,
      id: child.data.id,
      lastName: child.data.last_name,
    },
    onThisDay,
    page,
  };
}
