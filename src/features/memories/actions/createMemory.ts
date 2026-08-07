"use server";

import { getTranslations } from "next-intl/server";
import { after } from "next/server";
import { runMemoryInsightForEvent } from "@/features/ai/services/aiWorker";
import { reportException } from "@/lib/monitoring";
import {
  createMemorySchema,
  type CreateMemoryInput,
} from "@/features/memories/schemas/createMemorySchema";
import type { AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type CreateMemoryResult =
  | Readonly<{ eventId: string; success: true }>
  | Readonly<{
      error: "database" | "unauthorized" | "validation";
      fieldErrors?: Partial<Record<keyof CreateMemoryInput, string>>;
      success: false;
    }>;

export async function createMemoryAction(
  input: unknown,
  locale: AppLocale,
  childId: string,
): Promise<CreateMemoryResult> {
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
    return { error: "validation", fieldErrors, success: false };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized", success: false };
  const supabase = await createClient();
  const childResult = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (childResult.error || !childResult.data)
    return { error: "unauthorized", success: false };

  const values = parsed.data;
  const eventResult = await supabase
    .from("events")
    .insert({
      category_id: values.categoryId,
      child_id: childId,
      description: values.description ?? null,
      importance: values.importance ?? null,
      location: values.location ?? null,
      mood: values.mood ?? null,
      occurred_at: `${values.occurredAt}T12:00:00.000Z`,
      sub_category_id: values.subCategoryId || null,
      title: values.title,
    })
    .select("id")
    .single();

  if (eventResult.error) {
    console.error("Memory creation failed", eventResult.error);
    return { error: "database", success: false };
  }

  const tags = [
    ...new Set(
      values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
  const supplementalResults = await Promise.all([
    tags.length
      ? supabase
          .from("event_tags")
          .insert(tags.map((tag) => ({ event_id: eventResult.data.id, tag })))
      : Promise.resolve({ error: null }),
    values.reminderEnabled
      ? supabase.from("reminders").insert({
          child_id: childId,
          description: values.reminderNote ?? null,
          event_id: eventResult.data.id,
          reminder_at: `${values.reminderAt}T09:00:00.000Z`,
          repeat_type: values.repeatType,
          status: "scheduled",
          title: values.title,
        })
      : Promise.resolve({ error: null }),
  ]);

  const supplementalError = supplementalResults.find(
    (result) => result.error,
  )?.error;
  if (supplementalError) {
    console.error(
      "Memory supplemental data creation failed",
      supplementalError,
    );
    const rollbackResults = await Promise.all([
      supabase.from("event_tags").delete().eq("event_id", eventResult.data.id),
      supabase.from("reminders").delete().eq("event_id", eventResult.data.id),
      supabase
        .from("events")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", eventResult.data.id),
    ]);
    rollbackResults.forEach(({ error }) => {
      if (error) console.error("Memory creation rollback failed", error);
    });
    return { error: "database", success: false };
  }

  after(async () => {
    try {
      await runMemoryInsightForEvent(eventResult.data.id);
    } catch (error) {
      reportException(error, {
        eventId: eventResult.data.id,
        operation: "memory_insight_on_create",
      });
    }
  });

  return { eventId: eventResult.data.id, success: true };
}
