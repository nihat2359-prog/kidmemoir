import "server-only";

import type { User } from "@supabase/supabase-js";
import { getSmartDashboardIntelligence } from "@/features/ai";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { getMonthBounds } from "@/features/dashboard/utils/date";
import { getOnThisDayMemories } from "@/features/on-this-day";
import { getMemoryOfTheDay } from "@/features/dashboard/services/memoryOfTheDayService";
import { createClient } from "@/lib/supabase/server";

function assertQuery(error: { message: string } | null, operation: string) {
  if (error) throw new Error(`Dashboard ${operation} failed`, { cause: error });
}

export async function getDashboardData(user: User): Promise<DashboardData> {
  const supabase = await createClient();
  const [profileResult, childResult, subscriptionResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("children")
      .select("id,first_name,last_name,birth_date,avatar")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan,status,current_period_end")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  assertQuery(profileResult.error, "profile lookup");
  assertQuery(childResult.error, "child lookup");
  assertQuery(subscriptionResult.error, "subscription lookup");

  const subscription = subscriptionResult.data;
  const aiAvailable = Boolean(
    subscription?.plan === "premium" &&
    (subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due" ||
      (subscription.status === "canceled" &&
        subscription.current_period_end &&
        new Date(subscription.current_period_end).getTime() > Date.now())),
  );

  const profileFirstName =
    profileResult.data?.first_name ||
    (typeof user.user_metadata.first_name === "string"
      ? user.user_metadata.first_name
      : (user.email?.split("@")[0] ?? ""));
  const child = childResult.data;

  if (!child) {
    return {
      aiAvailable,
      child: null,
      insight: null,
      intelligence: null,
      memoryOfTheDay: null,
      onThisDay: [],
      profileFirstName,
      recentMemories: [],
      reminders: [],
      summary: { audio: 0, memories: 0, photos: 0, videos: 0 },
    };
  }

  const now = new Date();
  const month = getMonthBounds(now);
  const [
    eventsResult,
    remindersResult,
    monthlyEventsResult,
    avatarResult,
    onThisDay,
    intelligence,
    memoryOfTheDay,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,description,occurred_at,created_at")
      .eq("child_id", child.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("reminders")
      .select("id,title,description,reminder_at")
      .eq("child_id", child.id)
      .eq("status", "scheduled")
      .gte("reminder_at", now.toISOString())
      .order("reminder_at", { ascending: true })
      .limit(3),
    supabase
      .from("events")
      .select("id", { count: "exact" })
      .eq("child_id", child.id)
      .is("archived_at", null)
      .gte("created_at", month.start)
      .lt("created_at", month.end)
      .range(0, 9999),
    child.avatar
      ? supabase.storage.from("avatars").createSignedUrl(child.avatar, 3600)
      : Promise.resolve({ data: null, error: null }),
    getOnThisDayMemories(supabase, child.id, child.birth_date),
    getSmartDashboardIntelligence(child.id),
    getMemoryOfTheDay(supabase, child.id),
  ]);

  assertQuery(eventsResult.error, "recent memories");
  assertQuery(remindersResult.error, "upcoming reminders");
  assertQuery(monthlyEventsResult.error, "monthly event count");

  const monthlyEventIds = (monthlyEventsResult.data ?? []).map(({ id }) => id);
  const recentEventIds = (eventsResult.data ?? []).map(({ id }) => id);
  const mediaEventIds = [...new Set([...monthlyEventIds, ...recentEventIds])];
  const mediaResult = mediaEventIds.length
    ? await supabase
        .from("event_media")
        .select("event_id,media_type,storage_path")
        .in("event_id", mediaEventIds)
        .is("archived_at", null)
    : { data: [], error: null };
  assertQuery(mediaResult.error, "monthly media count");

  if (avatarResult.error)
    console.error("Dashboard avatar URL creation failed", avatarResult.error);

  const mediaCounts = { audio: 0, photos: 0, videos: 0 };
  (mediaResult.data ?? []).forEach(({ event_id, media_type }) => {
    if (!monthlyEventIds.includes(event_id)) return;
    if (media_type === "photo") mediaCounts.photos += 1;
    if (media_type === "video") mediaCounts.videos += 1;
    if (media_type === "audio") mediaCounts.audio += 1;
  });

  const recentPhotoPaths = (mediaResult.data ?? [])
    .filter(
      (media) =>
        recentEventIds.includes(media.event_id) && media.media_type === "photo",
    )
    .map((media) => media.storage_path);
  const photoUrlsResult = recentPhotoPaths.length
    ? await supabase.storage
        .from("event-media")
        .createSignedUrls(recentPhotoPaths, 3600)
    : { data: [], error: null };
  if (photoUrlsResult.error)
    console.error("Dashboard media preview URLs failed", photoUrlsResult.error);
  const photoUrlByPath = new Map(
    (photoUrlsResult.data ?? []).map((item) => [item.path, item.signedUrl]),
  );

  return {
    aiAvailable,
    child: {
      avatarUrl: avatarResult.data?.signedUrl ?? null,
      birthDate: child.birth_date,
      firstName: child.first_name,
      id: child.id,
      lastName: child.last_name,
    },
    insight:
      aiAvailable && intelligence.latestStory
        ? {
            createdAt: intelligence.latestStory.createdAt,
            quote: null,
            summary: intelligence.latestStory.story,
          }
        : intelligence.notable
          ? {
              createdAt: intelligence.notable.occurredAt,
              quote: intelligence.notable.quote || null,
              summary: intelligence.notable.summary,
            }
          : null,
    intelligence,
    memoryOfTheDay,
    profileFirstName,
    onThisDay,
    recentMemories: (eventsResult.data ?? []).map((event) => ({
      hasAudio: (mediaResult.data ?? []).some(
        (media) => media.event_id === event.id && media.media_type === "audio",
      ),
      hasVideo: (mediaResult.data ?? []).some(
        (media) => media.event_id === event.id && media.media_type === "video",
      ),
      photoUrl:
        (mediaResult.data ?? [])
          .filter(
            (media) =>
              media.event_id === event.id && media.media_type === "photo",
          )
          .map((media) => photoUrlByPath.get(media.storage_path) ?? null)
          .find(Boolean) ?? null,
      createdAt: event.created_at,
      description: event.description,
      id: event.id,
      occurredAt: event.occurred_at,
      title: event.title,
    })),
    reminders: (remindersResult.data ?? []).map((reminder) => ({
      description: reminder.description,
      id: reminder.id,
      reminderAt: reminder.reminder_at,
      title: reminder.title,
    })),
    summary: { ...mediaCounts, memories: monthlyEventsResult.count ?? 0 },
  };
}
