"use server";

import { getTranslations } from "next-intl/server";
import {
  createMemorySchema,
  type CreateMemoryInput,
} from "@/features/memories/schemas/createMemorySchema";
import type { AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateMemoryAction(
  eventId: string,
  input: unknown,
  locale: AppLocale,
  childId: string,
) {
  const t = await getTranslations({
    locale,
    namespace: "memories.create.validation",
  });
  const parsed = createMemorySchema({
    categoryRequired: t("categoryRequired"),
    descriptionMax: t("descriptionMax"),
    importanceInvalid: t("importanceInvalid"),
    locationMax: t("locationMax"),
    moodInvalid: t("moodInvalid"),
    occurredAtFuture: t("occurredAtFuture"),
    occurredAtRequired: t("occurredAtRequired"),
    reminderDateRequired: t("reminderDateRequired"),
    reminderFuture: t("reminderFuture"),
    reminderNoteMax: t("reminderNoteMax"),
    repeatTypeInvalid: t("repeatTypeInvalid"),
    tagsInvalid: t("tagsInvalid"),
    titleMax: t("titleMax"),
    titleRequired: t("titleRequired"),
    typeRequired: t("typeRequired"),
  }).safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const fieldErrors = Object.fromEntries(
      Object.entries(errors)
        .filter((entry): entry is [string, string[]] => Boolean(entry[1]?.[0]))
        .map(([field, messages]) => [field, messages[0]]),
    ) as Partial<Record<keyof CreateMemoryInput, string>>;
    return {
      error: "validation" as const,
      fieldErrors,
      success: false as const,
    };
  }
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const owned = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (owned.error || !owned.data)
    return { error: "unauthorized" as const, success: false as const };
  const values = parsed.data;
  const update = await supabase
    .from("events")
    .update({
      ai_enabled: values.aiEnabled,
      category_id: values.categoryId,
      description: values.description ?? null,
      importance: values.importance ?? null,
      location: values.location ?? null,
      mood: values.mood ?? null,
      occurred_at: `${values.occurredAt}T12:00:00.000Z`,
      sub_category_id: values.subCategoryId || null,
      title: values.title,
    })
    .eq("id", eventId)
    .eq("child_id", childId);
  if (update.error) {
    console.error("Memory update failed", update.error);
    return { error: "database" as const, success: false as const };
  }
  const tags = [
    ...new Set(
      values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
  const cleanup = await Promise.all([
    supabase.from("event_tags").delete().eq("event_id", eventId),
    supabase.from("reminders").delete().eq("event_id", eventId),
  ]);
  if (cleanup.some(({ error }) => error))
    return { error: "database" as const, success: false as const };
  const supplemental = await Promise.all([
    tags.length
      ? supabase
          .from("event_tags")
          .insert(tags.map((tag) => ({ event_id: eventId, tag })))
      : Promise.resolve({ error: null }),
    values.reminderEnabled
      ? supabase.from("reminders").insert({
          child_id: childId,
          description: values.reminderNote ?? null,
          event_id: eventId,
          reminder_at: `${values.reminderAt}T09:00:00.000Z`,
          repeat_type: values.repeatType,
          status: "scheduled",
          title: values.title,
        })
      : Promise.resolve({ error: null }),
  ]);
  if (supplemental.some(({ error }) => error)) {
    console.error("Memory supplemental update failed");
    return { error: "database" as const, success: false as const };
  }
  return { success: true as const };
}
