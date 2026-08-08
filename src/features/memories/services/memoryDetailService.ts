import "server-only";
import type { User } from "@supabase/supabase-js";
import {
  getMemoryConnections,
  getMemoryInsight,
} from "@/features/ai/services/intelligenceService";
import { createClient } from "@/lib/supabase/server";

export async function getMemoryDetail(user: User, eventId: string) {
  const supabase = await createClient();
  const event = await supabase
    .from("events")
    .select(
      "id,child_id,category_id,title,description,occurred_at,location,importance,mood,is_favorite",
    )
    .eq("id", eventId)
    .is("archived_at", null)
    .maybeSingle();
  if (event.error)
    throw new Error("MEMORY_DETAIL_FAILED", { cause: event.error });
  if (!event.data) return null;
  const child = await supabase
    .from("children")
    .select("first_name,last_name")
    .eq("id", event.data.child_id)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (child.error)
    throw new Error("MEMORY_DETAIL_OWNER_FAILED", { cause: child.error });
  if (!child.data) return null;
  const [category, media] = await Promise.all([
    supabase
      .from("event_categories")
      .select("name")
      .eq("id", event.data.category_id)
      .maybeSingle(),
    supabase
      .from("event_media")
      .select("id,media_type,storage_path,file_name,mime_type")
      .eq("event_id", eventId)
      .is("archived_at", null)
      .order("created_at"),
  ]);
  if (category.error || media.error)
    throw new Error("MEMORY_DETAIL_RELATIONS_FAILED", {
      cause: category.error ?? media.error,
    });
  const paths = (media.data ?? []).map(({ storage_path }) => storage_path);
  const signed = paths.length
    ? await supabase.storage.from("event-media").createSignedUrls(paths, 3600)
    : { data: [], error: null };
  if (signed.error) console.error("Memory detail media URL unavailable");
  const [insightResult, connectionsResult] = await Promise.allSettled([
    getMemoryInsight(user, event.data.child_id, eventId),
    getMemoryConnections(user, event.data.child_id, eventId),
  ]);
  if (insightResult.status === "rejected")
    console.error("Memory detail insight unavailable");
  if (connectionsResult.status === "rejected")
    console.error("Memory detail connections unavailable");
  const insight =
    insightResult.status === "fulfilled" ? insightResult.value : null;
  const connections =
    connectionsResult.status === "fulfilled" ? connectionsResult.value : [];
  const urls = new Map(
    (signed.data ?? []).map((item, index) => [paths[index], item.signedUrl]),
  );
  return {
    category: category.data?.name ?? "",
    childId: event.data.child_id,
    childName: [child.data.first_name, child.data.last_name]
      .filter(Boolean)
      .join(" "),
    connections,
    description: event.data.description,
    id: event.data.id,
    importance: event.data.importance,
    insight,
    isFavorite: event.data.is_favorite,
    location: event.data.location,
    media: (media.data ?? [])
      .map((item) => ({
        fileName: item.file_name,
        id: item.id,
        mediaType: item.media_type,
        mimeType: item.mime_type,
        url: urls.get(item.storage_path) ?? "",
      }))
      .filter(({ url }) => Boolean(url)),
    mood: event.data.mood,
    occurredAt: event.data.occurred_at,
    title: event.data.title,
  };
}
