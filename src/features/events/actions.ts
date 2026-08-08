"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function toggleMemoryFavorite(eventId: string) {
  const parsed = z.string().uuid().safeParse(eventId);
  if (!parsed.success) return { success: false as const };
  const user = await getCurrentUser();
  if (!user) return { success: false as const };
  const supabase = await createClient();
  const event = await supabase
    .from("events")
    .select("id,is_favorite,children!inner(user_id)")
    .eq("id", parsed.data)
    .eq("children.user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (event.error || !event.data) return { success: false as const };
  const next = !event.data.is_favorite;
  const updated = await supabase
    .from("events")
    .update({ is_favorite: next })
    .eq("id", parsed.data);
  if (updated.error) return { success: false as const };
  revalidatePath("/[locale]/(app)/events", "page");
  revalidatePath("/[locale]/(app)/timeline", "page");
  revalidatePath("/[locale]/(app)/dashboard", "page");
  return { favorite: next, success: true as const };
}
