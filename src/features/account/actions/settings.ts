"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  aiEnabled: z.boolean(),
  dateFormat: z.enum(["DD.MM.YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  emailNotifications: z.boolean(),
  language: z.enum(routing.locales),
  pushNotifications: z.boolean(),
  reminderNotifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
  timeFormat: z.enum(["12h", "24h"]),
  timezone: z.string().trim().min(1).max(100),
});
export async function updateAccountSettings(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { error: "validation" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const v = parsed.data;
  const [settings, profile] = await Promise.all([
    supabase
      .from("user_settings")
      .update({
        ai_enabled: v.aiEnabled,
        date_format: v.dateFormat,
        email_notifications: v.emailNotifications,
        language: v.language,
        push_notifications: v.pushNotifications,
        reminder_notifications: v.reminderNotifications,
        theme: v.theme,
        time_format: v.timeFormat,
        timezone: v.timezone,
      })
      .eq("user_id", user.id),
    supabase
      .from("profiles")
      .update({ language: v.language, theme: v.theme, timezone: v.timezone })
      .eq("id", user.id),
  ]);
  if (settings.error || profile.error)
    return { error: "database" as const, success: false as const };
  revalidatePath("/", "layout");
  return { success: true as const };
}
