import "server-only";

import type { User } from "@supabase/supabase-js";
import type {
  AppShellData,
  AppTheme,
  ShellChild,
} from "@/features/app-shell/types/appShell.types";
import type { AppLocale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

function assertQuery(error: { message: string } | null, operation: string) {
  if (error)
    throw new Error(`Application shell ${operation} failed`, { cause: error });
}

function metadataName(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function isTheme(value: string | undefined): value is AppTheme {
  return value === "light" || value === "dark" || value === "system";
}

export async function getAppShellData(
  user: User,
  locale: AppLocale,
): Promise<AppShellData> {
  const supabase = await createClient();
  const [profileResult, settingsResult, childrenResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,last_name,avatar,subscription_plan")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_settings")
      .select("theme")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("children")
      .select("id,first_name,last_name,avatar,is_default")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true }),
  ]);

  assertQuery(profileResult.error, "profile lookup");
  assertQuery(settingsResult.error, "settings lookup");
  assertQuery(childrenResult.error, "children lookup");

  const profile = profileResult.data;
  const children = childrenResult.data ?? [];
  const storagePaths = [
    profile?.avatar,
    ...children.map(({ avatar }) => avatar),
  ].filter((path): path is string => Boolean(path));
  const signedUrls = new Map<string, string>();

  if (storagePaths.length) {
    const signedResult = await supabase.storage
      .from("avatars")
      .createSignedUrls([...new Set(storagePaths)], 3600);
    if (signedResult.error) {
      console.error(
        "Application shell avatar URL creation failed",
        signedResult.error,
      );
    } else {
      signedResult.data.forEach((item, index) => {
        const path = [...new Set(storagePaths)][index];
        if (path && item.signedUrl) signedUrls.set(path, item.signedUrl);
      });
    }
  }

  const email = user.email ?? "";
  const firstName =
    profile?.first_name ??
    metadataName(user.user_metadata.first_name, email.split("@")[0] ?? "");
  const lastName =
    profile?.last_name ?? metadataName(user.user_metadata.last_name, "");

  return {
    children: children.map<ShellChild>((child) => ({
      avatarUrl: child.avatar ? (signedUrls.get(child.avatar) ?? null) : null,
      firstName: child.first_name,
      id: child.id,
      isDefault: child.is_default,
      lastName: child.last_name,
    })),
    email,
    firstName,
    lastName,
    lastSignInAt: user.last_sign_in_at ?? null,
    locale,
    plan: profile?.subscription_plan === "premium" ? "premium" : "free",
    profileAvatarUrl: profile?.avatar
      ? (signedUrls.get(profile.avatar) ?? null)
      : null,
    theme: isTheme(settingsResult.data?.theme)
      ? settingsResult.data.theme
      : "dark",
  };
}
