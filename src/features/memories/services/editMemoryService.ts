import "server-only";

import type { User } from "@supabase/supabase-js";
import type { CreateMemoryInput } from "@/features/memories/schemas/createMemorySchema";
import type {
  ExistingMemoryMedia,
  MemoryEntryType,
} from "@/features/memories/types/createMemory.types";
import { createClient } from "@/lib/supabase/server";

export async function getEditableMemory(
  user: User,
  eventId: string,
  childId: string,
): Promise<{
  initialValues: CreateMemoryInput;
  media: ExistingMemoryMedia | null;
} | null> {
  const supabase = await createClient();
  const [event, child] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id,title,description,category_id,sub_category_id,occurred_at,location,mood,importance,ai_enabled",
      )
      .eq("id", eventId)
      .eq("child_id", childId)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("user_id", user.id)
      .is("archived_at", null)
      .maybeSingle(),
  ]);
  if (event.error || child.error)
    throw new Error("Editable memory lookup failed", { cause: event.error });
  if (!event.data || !child.data) return null;
  const [tags, reminder, media] = await Promise.all([
    supabase.from("event_tags").select("tag").eq("event_id", eventId),
    supabase
      .from("reminders")
      .select("reminder_at,repeat_type,description")
      .eq("event_id", eventId)
      .eq("status", "scheduled")
      .order("created_at")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("event_media")
      .select("media_type,storage_path")
      .eq("event_id", eventId)
      .is("archived_at", null)
      .order("created_at")
      .limit(1)
      .maybeSingle(),
  ]);
  if (tags.error || reminder.error || media.error)
    throw new Error("Editable memory relations failed", {
      cause: tags.error ?? reminder.error ?? media.error,
    });
  let existingMedia: ExistingMemoryMedia | null = null;
  if (
    media.data &&
    ["photo", "video", "audio"].includes(media.data.media_type)
  ) {
    const signed = await supabase.storage
      .from("event-media")
      .createSignedUrl(media.data.storage_path, 3600);
    if (!signed.error)
      existingMedia = {
        type: media.data.media_type as ExistingMemoryMedia["type"],
        url: signed.data.signedUrl,
      };
  }
  const entryType: MemoryEntryType = existingMedia?.type ?? "memory";
  return {
    initialValues: {
      aiEnabled: event.data.ai_enabled,
      categoryId: event.data.category_id,
      description: event.data.description ?? "",
      entryType,
      importance:
        (event.data.importance as CreateMemoryInput["importance"]) ?? "normal",
      location: event.data.location ?? "",
      mood: (event.data.mood as CreateMemoryInput["mood"]) ?? "neutral",
      occurredAt: event.data.occurred_at.slice(0, 10),
      reminderAt: reminder.data?.reminder_at.slice(0, 10) ?? "",
      reminderEnabled: Boolean(reminder.data),
      reminderNote: reminder.data?.description ?? "",
      repeatType:
        (reminder.data?.repeat_type as CreateMemoryInput["repeatType"]) ??
        "none",
      subCategoryId: event.data.sub_category_id ?? "",
      tags: (tags.data ?? []).map(({ tag }) => tag).join(", "),
      title: event.data.title,
    },
    media: existingMedia,
  };
}
