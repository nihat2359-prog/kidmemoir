import type { OnThisDayMemory } from "@/features/on-this-day/types/onThisDay.types";

export type TimelineMediaType = "photo" | "video" | "audio";
export type TimelineTypeFilter = TimelineMediaType | "written" | "all";

export type TimelineFiltersValue = Readonly<{
  categoryId: string;
  favorite: boolean;
  from: string;
  query: string;
  to: string;
  type: TimelineTypeFilter;
}>;

export type TimelineCursor = Readonly<{ id: string; occurredAt: string }>;

export type TimelineMedia = Readonly<{
  mediaType: TimelineMediaType;
  url: string;
}>;

export type TimelineItem = Readonly<{
  categoryId: string;
  description: string | null;
  id: string;
  isFavorite: boolean;
  media: readonly TimelineMedia[];
  occurredAt: string;
  title: string;
}>;

export type TimelinePageResult = Readonly<{
  items: readonly TimelineItem[];
  nextCursor: TimelineCursor | null;
}>;

export type TimelineCategory = Readonly<{ id: string; name: string }>;

export type TimelineScreenData = Readonly<{
  ai: Readonly<{
    highlights: readonly Readonly<{
      id: string;
      occurredAt: string;
      title: string;
    }>[];
    isPremium: boolean;
  }>;
  categories: readonly TimelineCategory[];
  child: Readonly<{
    avatarUrl: string | null;
    firstName: string;
    id: string;
    lastName: string | null;
  }>;
  onThisDay: readonly OnThisDayMemory[];
  page: TimelinePageResult;
}>;
