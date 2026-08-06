"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteMemoryAction(eventId: string, childId: string) {
  const input = z
    .object({ eventId: z.string().uuid(), childId: z.string().uuid() })
    .safeParse({ eventId, childId });
  if (!input.success)
    return { error: "invalid" as const, success: false as const };

  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const [child, event] = await Promise.all([
    supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("user_id", user.id)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("child_id", childId)
      .is("archived_at", null)
      .maybeSingle(),
  ]);
  if (child.error || event.error || !child.data || !event.data)
    return { error: "unauthorized" as const, success: false as const };

  const archivedAt = new Date().toISOString();
  const related = await Promise.all([
    supabase
      .from("event_media")
      .update({ archived_at: archivedAt })
      .eq("event_id", eventId)
      .is("archived_at", null),
    supabase
      .from("reminders")
      .update({ status: "cancelled" })
      .eq("event_id", eventId)
      .eq("status", "scheduled"),
  ]);
  if (related.some(({ error }) => error)) {
    console.error(
      "Memory relation archive failed",
      related.map(({ error }) => error).filter(Boolean),
    );
    return { error: "database" as const, success: false as const };
  }

  const archived = await supabase
    .from("events")
    .update({ archived_at: archivedAt })
    .eq("id", eventId)
    .eq("child_id", childId);
  if (archived.error) {
    console.error("Memory archive failed", archived.error);
    await supabase
      .from("event_media")
      .update({ archived_at: null })
      .eq("event_id", eventId)
      .eq("archived_at", archivedAt);
    return { error: "database" as const, success: false as const };
  }
  return { success: true as const };
}
