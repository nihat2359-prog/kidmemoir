import "server-only";

import type { User } from "@supabase/supabase-js";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { getMonthBounds } from "@/features/dashboard/utils/date";
import { getOnThisDayMemories } from "@/features/on-this-day";
import { createClient } from "@/lib/supabase/server";

function assertQuery(error: { message: string } | null, operation: string) {
  if (error) throw new Error(`Dashboard ${operation} failed`, { cause: error });
}

export async function getDashboardData(user: User): Promise<DashboardData> {
  const supabase = await createClient();
  const [profileResult, childResult] = await Promise.all([
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
  ]);

  assertQuery(profileResult.error, "profile lookup");
  assertQuery(childResult.error, "child lookup");

  const profileFirstName =
    profileResult.data?.first_name ||
    (typeof user.user_metadata.first_name === "string"
      ? user.user_metadata.first_name
      : (user.email?.split("@")[0] ?? ""));
  const child = childResult.data;

  if (!child) {
    return {
      child: null,
      insight: null,
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
    insightResult,
    monthlyEventsResult,
    avatarResult,
    onThisDay,
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
      .from("ai_analysis")
      .select("summary,created_at")
      .eq("child_id", child.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
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
  ]);

  assertQuery(eventsResult.error, "recent memories");
  assertQuery(remindersResult.error, "upcoming reminders");
  assertQuery(insightResult.error, "AI insight");
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
    child: {
      avatarUrl: avatarResult.data?.signedUrl ?? null,
      birthDate: child.birth_date,
      firstName: child.first_name,
      id: child.id,
      lastName: child.last_name,
    },
    insight: insightResult.data
      ? {
          createdAt: insightResult.data.created_at,
          summary: insightResult.data.summary,
        }
      : null,
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
