export type OnThisDayMediaType = "photo" | "video" | "audio";

export type OnThisDayMemory = Readonly<{
  description: string | null;
  id: string;
  media: Readonly<{
    type: OnThisDayMediaType;
    url: string;
  }> | null;
  occurredAt: string;
  title: string;
  yearsAgo: number;
}>;
