import "server-only";

import type { User } from "@supabase/supabase-js";
import type {
  AccountChild,
  AccountProfile,
  AccountSettings,
  AccountSubscription,
} from "@/features/account/types/account.types";
import { normalizeSubscriptionState } from "@/features/billing/utils/subscription";
import { createClient } from "@/lib/supabase/server";

function theme(value: string): "light" | "dark" | "system" {
  return value === "light" || value === "dark" ? value : "system";
}

export async function getAccountProfile(user: User): Promise<AccountProfile> {
  const supabase = await createClient();
  const [profile, settings] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,last_name,avatar,language,theme,timezone")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_settings")
      .select("language,theme,timezone")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  if (profile.error || settings.error || !profile.data)
    throw new Error("Account profile could not be loaded", {
      cause: profile.error ?? settings.error,
    });
  const avatar = profile.data.avatar
    ? await supabase.storage
        .from("avatars")
        .createSignedUrl(profile.data.avatar, 3600)
    : { data: null, error: null };
  return {
    avatarUrl: avatar.data?.signedUrl ?? null,
    email: user.email ?? "",
    firstName: profile.data.first_name,
    language: settings.data?.language ?? profile.data.language,
    lastName: profile.data.last_name,
    theme: theme(settings.data?.theme ?? profile.data.theme),
    timezone: settings.data?.timezone ?? profile.data.timezone,
  };
}

export async function getAccountSettings(user: User): Promise<AccountSettings> {
  const supabase = await createClient();
  const result = await supabase
    .from("user_settings")
    .select(
      "language,theme,timezone,date_format,time_format,push_notifications,email_notifications,reminder_notifications,ai_enabled",
    )
    .eq("user_id", user.id)
    .single();
  if (result.error)
    throw new Error("Account settings could not be loaded", {
      cause: result.error,
    });
  return {
    aiEnabled: result.data.ai_enabled,
    dateFormat: result.data.date_format,
    emailNotifications: result.data.email_notifications,
    language: result.data.language,
    pushNotifications: result.data.push_notifications,
    reminderNotifications: result.data.reminder_notifications,
    theme: theme(result.data.theme),
    timeFormat: result.data.time_format === "12h" ? "12h" : "24h",
    timezone: result.data.timezone,
  };
}

export async function getAccountChildren(
  user: User,
): Promise<readonly AccountChild[]> {
  const supabase = await createClient();
  const result = await supabase
    .from("children")
    .select("id,first_name,last_name,birth_date,avatar,is_default")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("is_default", { ascending: false })
    .order("created_at");
  if (result.error)
    throw new Error("Children could not be loaded", { cause: result.error });
  const childIds = (result.data ?? []).map(({ id }) => id);
  const events = childIds.length
    ? await supabase
        .from("events")
        .select("id,child_id,created_at")
        .in("child_id", childIds)
        .is("archived_at", null)
    : { data: [], error: null };
  if (events.error)
    throw new Error("Child memory summaries could not be loaded", {
      cause: events.error,
    });
  const eventIds = (events.data ?? []).map(({ id }) => id);
  const media = eventIds.length
    ? await supabase
        .from("event_media")
        .select("event_id,media_type")
        .in("event_id", eventIds)
        .is("archived_at", null)
    : { data: [], error: null };
  if (media.error)
    throw new Error("Child media summaries could not be loaded", {
      cause: media.error,
    });
  const summaries = new Map<
    string,
    {
      lastMemoryCreatedAt: string | null;
      memories: number;
      photos: number;
      videos: number;
    }
  >();
  const eventOwners = new Map<string, string>();
  childIds.forEach((id) =>
    summaries.set(id, {
      lastMemoryCreatedAt: null,
      memories: 0,
      photos: 0,
      videos: 0,
    }),
  );
  (events.data ?? []).forEach((event) => {
    eventOwners.set(event.id, event.child_id);
    const summary = summaries.get(event.child_id);
    if (!summary) return;
    summary.memories += 1;
    if (
      !summary.lastMemoryCreatedAt ||
      event.created_at > summary.lastMemoryCreatedAt
    )
      summary.lastMemoryCreatedAt = event.created_at;
  });
  (media.data ?? []).forEach(({ event_id, media_type }) => {
    const childId = eventOwners.get(event_id);
    const summary = childId ? summaries.get(childId) : undefined;
    if (!summary) return;
    if (media_type === "photo") summary.photos += 1;
    if (media_type === "video") summary.videos += 1;
  });
  const paths = (result.data ?? [])
    .map(({ avatar }) => avatar)
    .filter((value): value is string => Boolean(value));
  const signed = paths.length
    ? await supabase.storage.from("avatars").createSignedUrls(paths, 3600)
    : { data: [], error: null };
  const urls = new Map(
    (signed.data ?? []).map((item, index) => [paths[index], item.signedUrl]),
  );
  return (result.data ?? []).map((child) => ({
    avatarUrl: child.avatar ? (urls.get(child.avatar) ?? null) : null,
    birthDate: child.birth_date,
    firstName: child.first_name,
    id: child.id,
    isDefault: child.is_default,
    lastName: child.last_name,
    summary: summaries.get(child.id) ?? {
      lastMemoryCreatedAt: null,
      memories: 0,
      photos: 0,
      videos: 0,
    },
  }));
}

export async function getAccountPlan(user: User): Promise<"free" | "premium"> {
  const supabase = await createClient();
  const [profile, subscription] = await Promise.all([
    supabase
      .from("profiles")
      .select("subscription_plan,subscription_status")
      .eq("id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("plan,status")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  if (profile.error || subscription.error)
    throw new Error("Account plan could not be loaded", {
      cause: profile.error ?? subscription.error,
    });
  const activeStatuses = new Set(["active", "trialing"]);
  const subscriptionIsPremium =
    subscription.data?.plan === "premium" &&
    activeStatuses.has(subscription.data.status);
  const profileIsPremium =
    profile.data.subscription_plan === "premium" &&
    activeStatuses.has(profile.data.subscription_status);
  return subscriptionIsPremium || profileIsPremium ? "premium" : "free";
}

export async function getEditableChild(user: User, childId: string) {
  const supabase = await createClient();
  const result = await supabase
    .from("children")
    .select("id,first_name,last_name,birth_date,gender")
    .eq("id", childId)
    .eq("user_id", user.id)
    .is("archived_at", null)
    .maybeSingle();
  if (result.error)
    throw new Error("Child could not be loaded", { cause: result.error });
  return result.data
    ? {
        birthDate: result.data.birth_date,
        firstName: result.data.first_name,
        gender: result.data.gender as
          "female" | "male" | "other" | "prefer_not_to_say",
        id: result.data.id,
        lastName: result.data.last_name ?? "",
      }
    : null;
}

export async function getAccountSubscription(
  user: User,
): Promise<AccountSubscription> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const [profile, subscription, ai, media] = await Promise.all([
    supabase
      .from("profiles")
      .select("subscription_plan,subscription_status")
      .eq("id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("plan,status")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("ai_usage")
      .select("total_tokens")
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("event_media")
      .select("media_type,file_size")
      .is("archived_at", null),
  ]);
  if (profile.error || subscription.error || ai.error || media.error)
    throw new Error("Subscription data could not be loaded", {
      cause: profile.error ?? subscription.error ?? ai.error ?? media.error,
    });
  const usage = { aiTokens: 0, audio: 0, mediaBytes: 0, photos: 0, videos: 0 };
  (ai.data ?? []).forEach(({ total_tokens }) => {
    usage.aiTokens += total_tokens;
  });
  (media.data ?? []).forEach(({ file_size, media_type }) => {
    usage.mediaBytes += file_size;
    if (media_type === "photo") usage.photos += 1;
    if (media_type === "video") usage.videos += 1;
    if (media_type === "audio") usage.audio += 1;
  });
  const plan = subscription.data?.plan ?? profile.data.subscription_plan;
  const status = subscription.data?.status ?? profile.data.subscription_status;
  return {
    plan: plan === "premium" ? "premium" : "free",
    status: normalizeSubscriptionState({ plan, status }),
    usage,
  };
}
