"use server";

import { z } from "zod";
import { parseTimelineFilters } from "@/features/timeline/schemas/timelineFilters";
import { getTimelinePage } from "@/features/timeline/services/timelineService";
import type {
  TimelineCursor,
  TimelineFiltersValue,
} from "@/features/timeline/types/timeline.types";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const cursorSchema = z.object({
  id: z.string().uuid(),
  occurredAt: z.string().datetime(),
});

export async function loadTimelinePage(
  filters: TimelineFiltersValue,
  cursor: TimelineCursor,
) {
  const parsedCursor = cursorSchema.safeParse(cursor);
  if (!parsedCursor.success)
    return { error: "invalid" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const safeFilters = parseTimelineFilters({
    category: filters.categoryId,
    favorite: filters.favorite ? "true" : undefined,
    from: filters.from,
    q: filters.query,
    to: filters.to,
    type: filters.type,
  });
  const child = await supabase
    .from("children")
    .select("id")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("is_default", { ascending: false })
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (child.error || !child.data)
    return { error: "unauthorized" as const, success: false as const };
  try {
    return {
      data: await getTimelinePage(
        supabase,
        child.data.id,
        safeFilters,
        parsedCursor.data,
      ),
      success: true as const,
    };
  } catch (error) {
    console.error("Timeline next page failed", error);
    return { error: "database" as const, success: false as const };
  }
}
