import "server-only";
import type { User } from "@supabase/supabase-js";
import type { ReminderData } from "@/features/reminders/types";
import { createClient } from "@/lib/supabase/server";

export async function getReminderData(user: User): Promise<ReminderData> {
  const supabase = await createClient();
  const children = await supabase
    .from("children")
    .select("id,first_name,last_name")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("is_default", { ascending: false })
    .order("created_at");
  if (children.error)
    throw new Error("REMINDER_CHILDREN_FAILED", { cause: children.error });
  const ids = (children.data ?? []).map(({ id }) => id);
  const reminders = ids.length
    ? await supabase
        .from("reminders")
        .select(
          "id,child_id,event_id,title,description,reminder_at,repeat_type,status",
        )
        .in("child_id", ids)
        .order("reminder_at", { ascending: true })
    : { data: [], error: null };
  if (reminders.error)
    throw new Error("REMINDERS_LOAD_FAILED", { cause: reminders.error });
  const names = new Map(
    (children.data ?? []).map((child) => [
      child.id,
      [child.first_name, child.last_name].filter(Boolean).join(" "),
    ]),
  );
  return {
    children: (children.data ?? []).map((child) => ({
      id: child.id,
      name: names.get(child.id) ?? "",
    })),
    items: (reminders.data ?? []).map((reminder) => ({
      childId: reminder.child_id,
      childName: names.get(reminder.child_id) ?? "",
      description: reminder.description,
      eventId: reminder.event_id,
      id: reminder.id,
      reminderAt: reminder.reminder_at,
      repeatType: reminder.repeat_type ?? "none",
      status: reminder.status as "scheduled" | "completed" | "cancelled",
      title: reminder.title,
    })),
    referenceTime: new Date().toISOString(),
  };
}
