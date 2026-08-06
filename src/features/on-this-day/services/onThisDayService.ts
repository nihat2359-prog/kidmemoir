import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  OnThisDayMediaType,
  OnThisDayMemory,
} from "@/features/on-this-day/types/onThisDay.types";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;
type RawMemory = Readonly<{
  description: string | null;
  event_media: Array<{
    archived_at: string | null;
    media_type: string;
    storage_path: string;
    thumbnail_path: string | null;
  }>;
  id: string;
  occurred_at: string;
  title: string;
}>;

function todayParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Istanbul",
    year: "numeric",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { day: value("day"), month: value("month"), year: value("year") };
}

function dayRange(year: number, month: number, day: number): string | null {
  const start = new Date(Date.UTC(year, month - 1, day));
  if (
    start.getUTCFullYear() !== year ||
    start.getUTCMonth() !== month - 1 ||
    start.getUTCDate() !== day
  )
    return null;
  const end = new Date(Date.UTC(year, month - 1, day + 1));
  return `and(occurred_at.gte.${start.toISOString()},occurred_at.lt.${end.toISOString()})`;
}

export async function getOnThisDayMemories(
  supabase: Client,
  childId: string,
  birthDate: string,
): Promise<readonly OnThisDayMemory[]> {
  const today = todayParts();
  const firstYear = Number(birthDate.slice(0, 4));
  if (
    !Number.isInteger(firstYear) ||
    firstYear < 1900 ||
    firstYear >= today.year
  )
    return [];
  const ranges = Array.from({ length: today.year - firstYear }, (_, index) =>
    dayRange(firstYear + index, today.month, today.day),
  ).filter((range): range is string => Boolean(range));
  if (!ranges.length) return [];
  const result = await supabase
    .from("events")
    .select(
      "id,title,description,occurred_at,event_media(media_type,storage_path,thumbnail_path,archived_at)",
    )
    .eq("child_id", childId)
    .is("archived_at", null)
    .or(ranges.join(","))
    .order("occurred_at", { ascending: true });
  if (result.error) {
    console.error("On this day memories could not be loaded", result.error);
    return [];
  }

  const rows = result.data as unknown as RawMemory[];
  const previews = rows.map((memory) => {
    const activeMedia = memory.event_media.filter(
      (media) =>
        !media.archived_at &&
        ["photo", "video", "audio"].includes(media.media_type),
    );
    return (
      activeMedia.find((media) => media.media_type === "photo") ??
      activeMedia.find((media) => media.media_type === "video") ??
      activeMedia.find((media) => media.media_type === "audio") ??
      null
    );
  });
  const paths = previews
    .filter((media): media is NonNullable<typeof media> => Boolean(media))
    .map((media) =>
      media.media_type === "photo"
        ? (media.thumbnail_path ?? media.storage_path)
        : media.storage_path,
    );
  const signed = paths.length
    ? await supabase.storage
        .from("event-media")
        .createSignedUrls([...new Set(paths)], 3600)
    : { data: [], error: null };
  if (signed.error)
    console.error("On this day media URLs could not be created", signed.error);
  const uniquePaths = [...new Set(paths)];
  const urlByPath = new Map(
    (signed.data ?? []).map((item, index) => [
      uniquePaths[index],
      item.signedUrl,
    ]),
  );

  return rows.map((memory, index) => {
    const preview = previews[index];
    const path = preview
      ? preview.media_type === "photo"
        ? (preview.thumbnail_path ?? preview.storage_path)
        : preview.storage_path
      : null;
    const occurredYear = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
      }).format(new Date(memory.occurred_at)),
    );
    return {
      description: memory.description,
      id: memory.id,
      media:
        preview && path && urlByPath.get(path)
          ? {
              type: preview.media_type as OnThisDayMediaType,
              url: urlByPath.get(path) ?? "",
            }
          : null,
      occurredAt: memory.occurred_at,
      title: memory.title,
      yearsAgo: today.year - occurredYear,
    };
  });
}
