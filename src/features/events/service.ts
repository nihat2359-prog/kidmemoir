import "server-only";

import type { User } from "@supabase/supabase-js";
import type {
  EventFilters,
  EventListItem,
  EventsData,
} from "@/features/events/types";
import { createClient } from "@/lib/supabase/server";

export const EVENTS_PAGE_SIZE = 12;

function searchTerm(value: string) {
  return value
    .replace(/[%,()._]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export async function getEventsData(
  user: User,
  filters: EventFilters,
): Promise<EventsData> {
  const supabase = await createClient();
  const [childrenResult, categoriesResult] = await Promise.all([
    supabase
      .from("children")
      .select("id,first_name,last_name")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("is_default", { ascending: false })
      .order("created_at"),
    supabase
      .from("event_categories")
      .select("id,name")
      .eq("is_active", true)
      .order("sort_order"),
  ]);
  if (childrenResult.error || categoriesResult.error)
    throw new Error("EVENTS_CONTEXT_FAILED", {
      cause: childrenResult.error ?? categoriesResult.error,
    });
  const children = childrenResult.data ?? [];
  if (children.length === 0)
    return {
      categories: categoriesResult.data ?? [],
      children: [],
      hasNext: false,
      items: [],
      total: 0,
    };
  const allowedIds = new Set(children.map(({ id }) => id));
  const childId =
    filters.childId && allowedIds.has(filters.childId) ? filters.childId : "";
  const mediaFilter = ["photo", "video", "audio"].includes(filters.type);
  const base =
    "id,child_id,category_id,title,description,occurred_at,importance,is_favorite,event_categories(name)";
  const select = mediaFilter
    ? `${base},event_media!inner()`
    : filters.type === "written"
      ? `${base},event_media()`
      : base;
  let query = supabase
    .from("events")
    .select(select, { count: "exact" })
    .in("child_id", childId ? [childId] : [...allowedIds])
    .is("archived_at", null);
  if (filters.favorite) query = query.eq("is_favorite", true);
  if (filters.importance !== "all")
    query = query.eq("importance", filters.importance);
  if (filters.from)
    query = query.gte("occurred_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to)
    query = query.lte("occurred_at", `${filters.to}T23:59:59.999Z`);
  const term = searchTerm(filters.query);
  if (term)
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  if (mediaFilter)
    query = query
      .eq("event_media.media_type", filters.type)
      .is("event_media.archived_at", null);
  if (filters.type === "written") query = query.is("event_media", null);
  const from = (filters.page - 1) * EVENTS_PAGE_SIZE;
  const result = await query
    .order("occurred_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + EVENTS_PAGE_SIZE - 1);
  if (result.error)
    throw new Error("EVENTS_LOAD_FAILED", { cause: result.error });
  const rows = result.data as unknown as Array<{
    id: string;
    child_id: string;
    category_id: string;
    title: string;
    description: string | null;
    occurred_at: string;
    importance: string | null;
    is_favorite: boolean;
    event_categories: { name: string } | null;
  }>;
  const ids = rows.map(({ id }) => id);
  const media = ids.length
    ? await supabase
        .from("event_media")
        .select("event_id,media_type,storage_path,thumbnail_path")
        .in("event_id", ids)
        .is("archived_at", null)
        .order("created_at")
    : { data: [], error: null };
  if (media.error)
    throw new Error("EVENTS_MEDIA_FAILED", { cause: media.error });
  const paths = (media.data ?? []).map(
    (item) => item.thumbnail_path || item.storage_path,
  );
  const signed = paths.length
    ? await supabase.storage.from("event-media").createSignedUrls(paths, 3600)
    : { data: [], error: null };
  const urls = new Map(
    (signed.data ?? []).map((item, index) => [paths[index], item.signedUrl]),
  );
  const childNames = new Map(
    children.map((child) => [
      child.id,
      [child.first_name, child.last_name].filter(Boolean).join(" "),
    ]),
  );
  const items: EventListItem[] = rows.map((row) => ({
    category: row.event_categories?.name ?? "",
    childId: row.child_id,
    childName: childNames.get(row.child_id) ?? "",
    description: row.description,
    id: row.id,
    importance: row.importance,
    isFavorite: row.is_favorite,
    media: (media.data ?? [])
      .filter(
        (item) =>
          item.event_id === row.id &&
          ["photo", "video", "audio"].includes(item.media_type),
      )
      .map((item) => ({
        mediaType: item.media_type as "photo" | "video" | "audio",
        url: urls.get(item.thumbnail_path || item.storage_path) ?? "",
      }))
      .filter(({ url }) => Boolean(url)),
    occurredAt: row.occurred_at,
    title: row.title,
  }));
  return {
    categories: categoriesResult.data ?? [],
    children: children.map((child) => ({
      id: child.id,
      name: childNames.get(child.id) ?? "",
    })),
    hasNext: from + items.length < (result.count ?? 0),
    items,
    total: result.count ?? 0,
  };
}
