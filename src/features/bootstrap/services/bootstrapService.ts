import "server-only";

import packageJson from "../../../../package.json";
import type {
  BootstrapContext,
  BootstrapDestination,
} from "@/features/bootstrap/types/bootstrap.types";
import { createDeviceIdentity } from "@/features/bootstrap/utils/device";
import { createClient } from "@/lib/supabase/server";

const PROFILE_DEFAULT_NAME = "KidMemoir";
const PROFILE_DEFAULT_SURNAME = "User";

function getMetadataName(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().slice(0, 100);
  return normalized || fallback;
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
  const firstName = getMetadataName(
    user.user_metadata.first_name,
    PROFILE_DEFAULT_NAME,
  );
  const lastName = getMetadataName(
    user.user_metadata.last_name,
    PROFILE_DEFAULT_SURNAME,
  );

  const profileResult = await supabase.from("profiles").upsert(
    {
      first_name: firstName,
      id: user.id,
      language: locale,
      last_name: lastName,
      subscription_plan: "free",
      subscription_status: "active",
      theme: "system",
      timezone: "Europe/Istanbul",
    },
    { ignoreDuplicates: true, onConflict: "id" },
  );
  assertSuccessful(profileResult, "profile ensure");

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
        theme: "system",
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
