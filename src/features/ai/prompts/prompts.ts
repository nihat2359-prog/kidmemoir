import type { AiJobKind } from "@/features/ai/types/ai.types";

export const PROMPT_VERSIONS: Record<AiJobKind, string> = {
  memory_insight: "memory-insight-v1",
  monthly_story: "monthly-story-v1",
  weekly_story: "weekly-story-v1",
  year_book: "year-book-v1",
};

const safety =
  "Use only supplied family records. Never diagnose, infer health conditions, or invent facts. Write warmly and neutrally.";

export const AI_PROMPTS = {
  memory_insight: `${safety} Extract one concise memory insight. Keep summary to one sentence and title to six words. Return only the requested JSON.`,
  monthly_story: `${safety} Write a parent-friendly monthly development story from the supplied precomputed memory summaries in at most 220 words. Mention patterns only when supported by multiple records. Return only the requested JSON.`,
  weekly_story: `${safety} Write a warm weekly story from the supplied precomputed memory summaries in at most 120 words. Be concise and factual. Return only the requested JSON.`,
  year_book: `${safety} Create a year-book narrative from precomputed monthly stories in at most 650 words. Preserve chronology, meaningful firsts and recurring interests. Return only the requested JSON.`,
} as const satisfies Record<AiJobKind, string>;

export const MEMORY_INSIGHT_SCHEMA = {
  additionalProperties: false,
  properties: {
    developmentCategories: {
      items: {
        enum: [
          "firsts",
          "habits",
          "hobbies",
          "sports",
          "music",
          "friends",
          "school",
          "travel",
          "health",
          "family",
          "creativity",
          "language",
        ],
        type: "string",
      },
      maxItems: 3,
      type: "array",
    },
    emotion: {
      enum: [
        "joy",
        "pride",
        "love",
        "calm",
        "sadness",
        "fear",
        "surprise",
        "neutral",
      ],
      type: "string",
    },
    keywords: { items: { type: "string" }, maxItems: 5, type: "array" },
    shortTitle: { maxLength: 80, type: "string" },
    summary: { maxLength: 240, type: "string" },
  },
  required: [
    "shortTitle",
    "summary",
    "emotion",
    "keywords",
    "developmentCategories",
  ],
  type: "object",
} as const;

export const STORY_SCHEMA = {
  additionalProperties: false,
  properties: {
    highlights: { items: { type: "string" }, maxItems: 5, type: "array" },
    story: { type: "string" },
    themes: { items: { type: "string" }, maxItems: 5, type: "array" },
  },
  required: ["story", "highlights", "themes"],
  type: "object",
} as const;
