"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const themeSchema = z.enum(["light", "dark", "system"]);
const localeSchema = z.enum(routing.locales);
const childIdSchema = z.string().uuid();

async function authenticatedClient() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return { supabase: await createClient(), user };
}

export async function updateThemePreference(value: string) {
  const theme = themeSchema.parse(value);
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase
    .from("user_settings")
    .update({ theme })
    .eq("user_id", user.id);
  if (error) throw new Error("THEME_UPDATE_FAILED", { cause: error });
}

export async function updateLanguagePreference(value: string) {
  const language = localeSchema.parse(value);
  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase
    .from("user_settings")
    .update({ language })
    .eq("user_id", user.id);
  if (error) throw new Error("LANGUAGE_UPDATE_FAILED", { cause: error });
}

export async function setDefaultChild(value: string) {
  const childId = childIdSchema.parse(value);
  const { supabase, user } = await authenticatedClient();
  const { data: selected, error: lookupError } = await supabase
    .from("children")
    .select("id")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (lookupError || !selected) throw new Error("CHILD_NOT_AVAILABLE");

  const { data: previous } = await supabase
    .from("children")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .is("archived_at", null)
    .maybeSingle();

  const clearResult = await supabase
    .from("children")
    .update({ is_default: false })
    .eq("user_id", user.id)
    .is("archived_at", null);
  if (clearResult.error)
    throw new Error("CHILD_SWITCH_FAILED", { cause: clearResult.error });

  const selectResult = await supabase
    .from("children")
    .update({ is_default: true })
    .eq("id", childId)
    .eq("user_id", user.id);
  if (selectResult.error) {
    if (previous?.id) {
      await supabase
        .from("children")
        .update({ is_default: true })
        .eq("id", previous.id)
        .eq("user_id", user.id);
    }
    throw new Error("CHILD_SWITCH_FAILED", { cause: selectResult.error });
  }

  revalidatePath("/", "layout");
}
