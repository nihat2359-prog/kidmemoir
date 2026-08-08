"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ReminderInput } from "@/features/reminders/types";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  childId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().trim().max(5000),
  id: z.string().uuid().optional(),
  repeatType: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  title: z.string().trim().min(1).max(200),
});
async function context(childId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const child = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  return !child.error && child.data ? supabase : null;
}
export async function saveReminder(input: ReminderInput) {
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { error: "validation" as const, success: false as const };
  const supabase = await context(parsed.data.childId);
  if (!supabase)
    return { error: "unauthorized" as const, success: false as const };
  const date = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(date.getTime()))
    return { error: "validation" as const, success: false as const };
  const reminderAt = date.toISOString();
  const values = {
    child_id: parsed.data.childId,
    description: parsed.data.description || null,
    reminder_at: reminderAt,
    repeat_type: parsed.data.repeatType,
    title: parsed.data.title,
  };
  const result = parsed.data.id
    ? await supabase
        .from("reminders")
        .update(values)
        .eq("id", parsed.data.id)
        .eq("child_id", parsed.data.childId)
    : await supabase
        .from("reminders")
        .insert({ ...values, status: "scheduled" });
  if (result.error)
    return { error: "database" as const, success: false as const };
  revalidatePath("/[locale]/(app)/reminders", "page");
  revalidatePath("/[locale]/(app)/dashboard", "page");
  return { created: !parsed.data.id, success: true as const };
}
export async function deleteReminder(id: string, childId: string) {
  if (!z.string().uuid().safeParse(id).success)
    return { success: false as const };
  const supabase = await context(childId);
  if (!supabase) return { success: false as const };
  const result = await supabase
    .from("reminders")
    .delete()
    .eq("id", id)
    .eq("child_id", childId);
  if (result.error) return { success: false as const };
  revalidatePath("/[locale]/(app)/reminders", "page");
  revalidatePath("/[locale]/(app)/dashboard", "page");
  return { success: true as const };
}
export async function setReminderActive(
  id: string,
  childId: string,
  active: boolean,
) {
  if (!z.string().uuid().safeParse(id).success)
    return { success: false as const };
  const supabase = await context(childId);
  if (!supabase) return { success: false as const };
  const result = await supabase
    .from("reminders")
    .update({ status: active ? "scheduled" : "cancelled" })
    .eq("id", id)
    .eq("child_id", childId);
  if (result.error) return { success: false as const };
  revalidatePath("/[locale]/(app)/reminders", "page");
  revalidatePath("/[locale]/(app)/dashboard", "page");
  return { success: true as const };
}
