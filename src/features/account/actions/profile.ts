"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  language: z.enum(routing.locales),
  lastName: z.string().trim().min(1).max(100),
  theme: z.enum(["light", "dark", "system"]),
  timezone: z.string().trim().min(1).max(100),
});

export async function updateAccountProfile(input: unknown) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success)
    return { error: "validation" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const supabase = await createClient();
  const values = parsed.data;
  const [profile, settings, metadata] = await Promise.all([
    supabase
      .from("profiles")
      .update({
        first_name: values.firstName,
        language: values.language,
        last_name: values.lastName,
        theme: values.theme,
        timezone: values.timezone,
      })
      .eq("id", user.id),
    supabase
      .from("user_settings")
      .update({
        language: values.language,
        theme: values.theme,
        timezone: values.timezone,
      })
      .eq("user_id", user.id),
    supabase.auth.updateUser({
      data: { first_name: values.firstName, last_name: values.lastName },
    }),
  ]);
  if (profile.error || settings.error || metadata.error) {
    console.error(
      "Account profile update failed",
      profile.error ?? settings.error ?? metadata.error,
    );
    return { error: "database" as const, success: false as const };
  }
  revalidatePath("/", "layout");
  return { success: true as const };
}

const avatarGrantSchema = z.object({
  mimeType: z.literal("image/jpeg"),
  size: z
    .number()
    .int()
    .positive()
    .max(5 * 1024 * 1024),
});
export async function createProfileAvatarGrant(input: unknown) {
  const parsed = avatarGrantSchema.safeParse(input);
  if (!parsed.success) return { success: false as const };
  const user = await getCurrentUser();
  if (!user) return { success: false as const };
  const supabase = await createClient();
  const path = `${user.id}/profile/${crypto.randomUUID()}.jpg`;
  const grant = await supabase.storage
    .from("avatars")
    .createSignedUploadUrl(path);
  return grant.error
    ? { success: false as const }
    : { path, signedUrl: grant.data.signedUrl, success: true as const };
}

export async function finalizeProfileAvatar(path: string, size: number) {
  const user = await getCurrentUser();
  if (!user) return { success: false as const };
  const prefix = `${user.id}/profile/`;
  if (
    !path.startsWith(prefix) ||
    !/^[0-9a-f-]{36}\.jpg$/i.test(path.slice(prefix.length))
  )
    return { success: false as const };
  const supabase = await createClient();
  const info = await supabase.storage.from("avatars").info(path);
  if (
    info.error ||
    info.data.size !== size ||
    info.data.contentType !== "image/jpeg"
  )
    return { success: false as const };
  const current = await supabase
    .from("profiles")
    .select("avatar")
    .eq("id", user.id)
    .single();
  const updated = await supabase
    .from("profiles")
    .update({ avatar: path })
    .eq("id", user.id);
  if (updated.error) {
    await supabase.storage.from("avatars").remove([path]);
    return { success: false as const };
  }
  if (current.data?.avatar)
    await supabase.storage.from("avatars").remove([current.data.avatar]);
  revalidatePath("/", "layout");
  return { success: true as const };
}
