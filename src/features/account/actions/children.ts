"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();
const updateSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  firstName: z.string().trim().min(1).max(100),
  gender: z.enum(["female", "male", "other", "prefer_not_to_say"]),
  lastName: z.string().trim().max(100),
});
export async function updateChild(childId: string, input: unknown) {
  if (!idSchema.safeParse(childId).success)
    return { error: "validation" as const, success: false as const };
  const parsed = updateSchema.safeParse(input);
  if (
    !parsed.success ||
    parsed.data.birthDate > new Date().toISOString().slice(0, 10)
  )
    return { error: "validation" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const result = await supabase
    .from("children")
    .update({
      birth_date: parsed.data.birthDate,
      first_name: parsed.data.firstName,
      gender: parsed.data.gender,
      last_name: parsed.data.lastName || null,
    })
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null);
  if (result.error)
    return { error: "database" as const, success: false as const };
  revalidatePath("/", "layout");
  return { success: true as const };
}
export async function makeDefaultChild(childId: string) {
  if (!idSchema.safeParse(childId).success) return { success: false as const };
  const user = await getCurrentUser();
  if (!user) return { success: false as const };
  const supabase = await createClient();
  const owned = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (!owned.data) return { success: false as const };
  const clear = await supabase
    .from("children")
    .update({ is_default: false })
    .eq("user_id", user.id)
    .is("archived_at", null);
  if (clear.error) return { success: false as const };
  const set = await supabase
    .from("children")
    .update({ is_default: true })
    .eq("id", childId)
    .eq("user_id", user.id);
  if (set.error) return { success: false as const };
  revalidatePath("/", "layout");
  return { success: true as const };
}
export async function archiveChild(childId: string) {
  if (!idSchema.safeParse(childId).success)
    return { error: "invalid" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const children = await supabase
    .from("children")
    .select("id,is_default")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("created_at");
  if (children.error || children.data.length <= 1)
    return { error: "lastChild" as const, success: false as const };
  const target = children.data.find(({ id }) => id === childId);
  if (!target)
    return { error: "unauthorized" as const, success: false as const };
  const archived = await supabase
    .from("children")
    .update({ archived_at: new Date().toISOString(), is_default: false })
    .eq("id", childId)
    .eq("user_id", user.id);
  if (archived.error)
    return { error: "database" as const, success: false as const };
  if (target.is_default)
    await supabase
      .from("children")
      .update({ is_default: true })
      .eq("id", children.data.find(({ id }) => id !== childId)?.id ?? "")
      .eq("user_id", user.id);
  revalidatePath("/", "layout");
  return { success: true as const };
}
