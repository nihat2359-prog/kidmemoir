import "server-only";

import packageJson from "../../../../package.json";
import type {
  BootstrapContext,
  BootstrapDestination,
} from "@/features/bootstrap/types/bootstrap.types";
import { createDeviceIdentity } from "@/features/bootstrap/utils/device";
import { createClient } from "@/lib/supabase/server";

const LEGACY_PROFILE_DEFAULT_NAME = "KidMemoir";
const LEGACY_PROFILE_DEFAULT_SURNAME = "User";

function normalizeName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().slice(0, 100);
  return normalized || null;
}

function resolveProfileName(
  metadata: Record<string, unknown>,
  locale: BootstrapContext["locale"],
) {
  const fullName =
    normalizeName(metadata.full_name) ?? normalizeName(metadata.name);
  const fullNameParts = fullName?.split(/\s+/) ?? [];
  const firstName =
    normalizeName(metadata.first_name) ??
    normalizeName(metadata.given_name) ??
    fullNameParts.shift() ??
    (locale === "tr" ? "Yeni" : "New");
  const lastName =
    normalizeName(metadata.last_name) ??
    normalizeName(metadata.family_name) ??
    normalizeName(fullNameParts.join(" ")) ??
    (locale === "tr" ? "Üye" : "Member");

  return { firstName, lastName };
}

function assertSuccessful(
  result: Readonly<{ error: { message: string } | null }>,
  operation: string,
) {
  if (result.error) {
    throw new Error(`Bootstrap ${operation} failed`, { cause: result.error });
  }
}

export async function ensureApplicationBootstrap({
  acceptLanguage,
  locale,
  user,
  userAgent,
}: BootstrapContext): Promise<BootstrapDestination> {
  const supabase = await createClient();
  const { firstName, lastName } = resolveProfileName(
    user.user_metadata,
    locale,
  );
  const existingProfile = await supabase
    .from("profiles")
    .select("first_name,last_name")
    .eq("id", user.id)
    .maybeSingle();
  assertSuccessful(existingProfile, "profile lookup");

  if (!existingProfile.data) {
    const profileResult = await supabase.from("profiles").insert({
      first_name: firstName,
      id: user.id,
      language: locale,
      last_name: lastName,
      subscription_plan: "free",
      subscription_status: "active",
      theme: "dark",
      timezone: "Europe/Istanbul",
    });
    assertSuccessful(profileResult, "profile ensure");
  } else if (
    existingProfile.data.first_name === LEGACY_PROFILE_DEFAULT_NAME &&
    existingProfile.data.last_name === LEGACY_PROFILE_DEFAULT_SURNAME
  ) {
    const profileResult = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", user.id);
    assertSuccessful(profileResult, "legacy profile repair");
  }

  const device = createDeviceIdentity({
    acceptLanguage,
    userAgent,
    userId: user.id,
  });
  const now = new Date().toISOString();

  const [settingsResult, deviceResult, childrenResult] = await Promise.all([
    supabase.from("user_settings").upsert(
      {
        ai_enabled: true,
        date_format: "DD.MM.YYYY",
        email_notifications: true,
        language: locale,
        push_notifications: true,
        reminder_notifications: true,
        theme: "dark",
        time_format: "24h",
        timezone: "Europe/Istanbul",
        user_id: user.id,
      },
      { ignoreDuplicates: true, onConflict: "user_id" },
    ),
    supabase.from("user_devices").upsert(
      {
        app_version: packageJson.version,
        device_id: device.deviceId,
        device_name: device.deviceName,
        is_current: true,
        last_seen_at: now,
        operating_system: device.operatingSystem,
        platform: "web",
        user_id: user.id,
      },
      { onConflict: "user_id,device_id" },
    ),
    supabase
      .from("children")
      .select("id")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .limit(1),
  ]);

  assertSuccessful(settingsResult, "settings ensure");
  assertSuccessful(deviceResult, "device ensure");
  assertSuccessful(childrenResult, "children lookup");

  return childrenResult.data?.length ? "/dashboard" : "/onboarding";
}
