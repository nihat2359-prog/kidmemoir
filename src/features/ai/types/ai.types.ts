export const AI_JOB_KINDS = [
  "memory_insight",
  "weekly_story",
  "monthly_story",
  "year_book",
] as const;

export type AiJobKind = (typeof AI_JOB_KINDS)[number];

export type AiJob = Readonly<{
  attempts: number;
  child_id: string;
  event_id: string | null;
  id: string;
  input_hash: string;
  kind: AiJobKind;
  max_attempts: number;
  period_end: string | null;
  period_start: string | null;
  prompt_version: string;
  user_id: string;
}>;

export type MemoryInsight = Readonly<{
  developmentCategories: string[];
  emotion:
    | "calm"
    | "curiosity"
    | "excitement"
    | "fear"
    | "joy"
    | "love"
    | "neutral"
    | "pride"
    | "sadness"
    | "surprise";
  keywords: string[];
  memoryQuote: string;
  importance: number;
  shortTitle: string;
  summary: string;
}>;

export type StoryArtifact = Readonly<{
  highlights: string[];
  story: string;
  themes: string[];
}>;

export type OpenAiUsage = Readonly<{
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}>;

export type OpenAiResult<T> = Readonly<{
  durationMs: number;
  model: string;
  output: T;
  usage: OpenAiUsage;
}>;

export type SmartDashboardInsight = Readonly<{
  emotionalMemory: Readonly<{
    id: string;
    occurredAt: string;
    summary: string;
    quote: string;
    title: string;
  }> | null;
  favoriteCount: number;
  latestMemory: Readonly<{
    id: string;
    occurredAt: string;
    title: string;
  }> | null;
  latestStory: Readonly<{ createdAt: string; story: string }> | null;
  notable: Readonly<{
    id: string;
    occurredAt: string;
    summary: string;
    quote: string;
    title: string;
  }> | null;
  recentActivities: string[];
}>;
