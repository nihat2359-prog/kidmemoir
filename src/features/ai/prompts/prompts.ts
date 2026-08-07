import type { AiJobKind } from "@/features/ai/types/ai.types";

export const PROMPT_VERSIONS: Record<AiJobKind, string> = {
  memory_insight: "memory-insight-v2",
  monthly_story: "monthly-story-v2",
  weekly_story: "weekly-story-v2",
  year_book: "year-book-v2",
};

const safety =
  "Use only supplied family records. Never describe unseen media, diagnose, infer health or psychology, predict, or invent facts.";

export const AI_PROMPTS = {
  memory_insight: `${safety} Write idiomatic Turkish when input language is tr; otherwise write natural English. Use a warm, honest parent voice without poetry, clichés, exaggeration, generic praise, or ChatGPT-like phrasing. Create a title of at most six words, a factual 2-3 sentence summary, and one memorable but grounded sentence as memoryQuote. Avoid phrases listed in avoidQuotes. Score importance from 1 to 100 using only recorded significance. Return only the requested JSON.`,
  monthly_story: `${safety} Write in the language used by the supplied summaries. Create a natural parent-journal story from precomputed memory summaries in at most 220 words. Do not write a list or report. Mention development patterns only when supported by multiple records. Avoid repetitive praise and translated-sounding phrasing. Return only the requested JSON.`,
  weekly_story: `${safety} Write in the language used by the supplied summaries. Create a warm, factual parent-journal entry from precomputed summaries in at most 150 words. Do not write a list or report. Avoid clichés and repetitive praise. Return only the requested JSON.`,
  year_book: `${safety} Create the strongest natural year-book narrative from precomputed monthly stories only, in at most 650 words. Preserve chronology, meaningful firsts and recurring interests without rereading or inventing source events. Avoid lists, reports, clichés and repetitive praise. Return only the requested JSON.`,
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
        "curiosity",
        "excitement",
        "sadness",
        "fear",
        "surprise",
        "neutral",
      ],
      type: "string",
    },
    keywords: { items: { type: "string" }, maxItems: 5, type: "array" },
    memoryQuote: { maxLength: 240, type: "string" },
    importance: { maximum: 100, minimum: 1, type: "integer" },
    shortTitle: { maxLength: 80, type: "string" },
    summary: { maxLength: 480, type: "string" },
  },
  required: [
    "shortTitle",
    "summary",
    "emotion",
    "keywords",
    "memoryQuote",
    "importance",
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
