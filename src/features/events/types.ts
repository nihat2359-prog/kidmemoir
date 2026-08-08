export type EventFilters = Readonly<{
  childId: string;
  favorite: boolean;
  from: string;
  importance: "all" | "low" | "normal" | "high" | "critical";
  page: number;
  query: string;
  to: string;
  type: "all" | "photo" | "video" | "audio" | "written";
}>;

export type EventListItem = Readonly<{
  category: string;
  childId: string;
  childName: string;
  description: string | null;
  id: string;
  importance: string | null;
  isFavorite: boolean;
  media: readonly Readonly<{
    mediaType: "photo" | "video" | "audio";
    url: string;
  }>[];
  occurredAt: string;
  title: string;
}>;

export type EventsData = Readonly<{
  categories: readonly Readonly<{ id: string; name: string }>[];
  children: readonly Readonly<{ id: string; name: string }>[];
  hasNext: boolean;
  items: readonly EventListItem[];
  total: number;
}>;
