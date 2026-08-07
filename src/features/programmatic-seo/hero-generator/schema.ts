import { z } from "zod";
import type { GeneratedHeroGuide } from "./types";

const text = z.string().trim().min(2);
const paragraph = z.string().trim().min(40);

export const generatedHeroGuideSchema = z.object({
  checklist: z.array(text).min(8).max(20),
  commonMistakes: z
    .array(z.object({ correction: text, mistake: text }))
    .min(5)
    .max(10),
  comparison: z.object({
    columns: z.array(text).min(2).max(4),
    rows: z.array(z.array(text).min(2).max(4)).min(4).max(12),
  }),
  conclusion: z.array(paragraph).min(2).max(4),
  cta: z.object({
    description: z.string().trim().min(20).max(500),
    label: text,
    target: z.enum([
      "register",
      "premium",
      "timeline",
      "memory-book",
      "ai-features",
    ]),
    title: text,
  }),
  externalReferencePlaceholders: z
    .array(z.object({ claim: text, sectionId: text }))
    .min(3)
    .max(12),
  faq: z
    .array(z.object({ answer: paragraph, question: text }))
    .min(5)
    .max(10),
  featuredSnippet: z.string().trim().min(40).max(420),
  hero: z.object({
    description: paragraph.max(500),
    eyebrow: text,
    title: text,
  }),
  introduction: z.array(paragraph).min(2).max(5),
  internalLinks: z
    .array(z.object({ anchor: text, topicId: z.string().uuid() }))
    .min(5)
    .max(10),
  letters: z.array(text).min(4).max(12),
  memoryIdeas: z.array(text).min(6).max(16),
  metaDescription: z.string().trim().min(70).max(160),
  metaTitle: z.string().trim().min(20).max(65),
  photoIdeas: z.array(text).min(6).max(16),
  questions: z.array(text).min(8).max(20),
  quickAnswer: z.string().trim().min(50).max(500),
  sections: z
    .array(
      z.object({
        body: z.array(paragraph).min(2).max(8),
        heading: text,
        id: z.string().regex(/^[a-z0-9-]+$/),
        type: z.enum([
          "introduction",
          "quick-summary",
          "timeline",
          "parent-tips",
          "memory-ideas",
          "photo-ideas",
          "questions-to-ask",
          "checklist",
          "common-mistakes",
          "conclusion",
        ]),
      }),
    )
    .min(10)
    .max(20),
  seoTitle: z.string().trim().min(20).max(70),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  timeline: z
    .array(z.object({ description: text, label: text }))
    .min(6)
    .max(24),
  videoIdeas: z.array(text).min(4).max(12),
});

export const heroGuideJsonSchema = {
  additionalProperties: false,
  properties: {
    checklist: {
      items: { type: "string" },
      minItems: 8,
      maxItems: 20,
      type: "array",
    },
    commonMistakes: {
      items: {
        additionalProperties: false,
        properties: {
          correction: { type: "string" },
          mistake: { type: "string" },
        },
        required: ["mistake", "correction"],
        type: "object",
      },
      minItems: 5,
      maxItems: 10,
      type: "array",
    },
    comparison: {
      additionalProperties: false,
      properties: {
        columns: { items: { type: "string" }, type: "array" },
        rows: {
          items: { items: { type: "string" }, type: "array" },
          type: "array",
        },
      },
      required: ["columns", "rows"],
      type: "object",
    },
    conclusion: { items: { type: "string" }, type: "array" },
    cta: {
      additionalProperties: false,
      properties: {
        description: { type: "string" },
        label: { type: "string" },
        target: {
          enum: [
            "register",
            "premium",
            "timeline",
            "memory-book",
            "ai-features",
          ],
          type: "string",
        },
        title: { type: "string" },
      },
      required: ["title", "description", "label", "target"],
      type: "object",
    },
    externalReferencePlaceholders: {
      items: {
        additionalProperties: false,
        properties: {
          claim: { type: "string" },
          sectionId: { type: "string" },
        },
        required: ["sectionId", "claim"],
        type: "object",
      },
      type: "array",
    },
    faq: {
      items: {
        additionalProperties: false,
        properties: {
          answer: { type: "string" },
          question: { type: "string" },
        },
        required: ["question", "answer"],
        type: "object",
      },
      type: "array",
    },
    featuredSnippet: { type: "string" },
    hero: {
      additionalProperties: false,
      properties: {
        description: { type: "string" },
        eyebrow: { type: "string" },
        title: { type: "string" },
      },
      required: ["eyebrow", "title", "description"],
      type: "object",
    },
    introduction: { items: { type: "string" }, type: "array" },
    internalLinks: {
      items: {
        additionalProperties: false,
        properties: { anchor: { type: "string" }, topicId: { type: "string" } },
        required: ["topicId", "anchor"],
        type: "object",
      },
      minItems: 5,
      maxItems: 10,
      type: "array",
    },
    letters: { items: { type: "string" }, type: "array" },
    memoryIdeas: { items: { type: "string" }, type: "array" },
    metaDescription: { type: "string" },
    metaTitle: { type: "string" },
    photoIdeas: { items: { type: "string" }, type: "array" },
    questions: { items: { type: "string" }, type: "array" },
    quickAnswer: { type: "string" },
    sections: {
      items: {
        additionalProperties: false,
        properties: {
          body: { items: { type: "string" }, type: "array" },
          heading: { type: "string" },
          id: { type: "string" },
          type: {
            enum: [
              "introduction",
              "quick-summary",
              "timeline",
              "parent-tips",
              "memory-ideas",
              "photo-ideas",
              "questions-to-ask",
              "checklist",
              "common-mistakes",
              "conclusion",
            ],
            type: "string",
          },
        },
        required: ["id", "type", "heading", "body"],
        type: "object",
      },
      type: "array",
    },
    seoTitle: { type: "string" },
    slug: { type: "string" },
    timeline: {
      items: {
        additionalProperties: false,
        properties: {
          description: { type: "string" },
          label: { type: "string" },
        },
        required: ["label", "description"],
        type: "object",
      },
      type: "array",
    },
    videoIdeas: { items: { type: "string" }, type: "array" },
  },
  required: [
    "seoTitle",
    "metaTitle",
    "metaDescription",
    "slug",
    "hero",
    "quickAnswer",
    "featuredSnippet",
    "introduction",
    "internalLinks",
    "sections",
    "checklist",
    "timeline",
    "memoryIdeas",
    "photoIdeas",
    "videoIdeas",
    "letters",
    "questions",
    "faq",
    "comparison",
    "commonMistakes",
    "conclusion",
    "cta",
    "externalReferencePlaceholders",
  ],
  type: "object",
} as const;

export function parseGeneratedHeroGuide(value: unknown): GeneratedHeroGuide {
  return generatedHeroGuideSchema.parse(value);
}

const repairPatchSchema = z.object({
  externalReferencePlaceholders:
    generatedHeroGuideSchema.shape.externalReferencePlaceholders.nullable(),
  faq: generatedHeroGuideSchema.shape.faq.nullable(),
  introduction: generatedHeroGuideSchema.shape.introduction.nullable(),
  letters: generatedHeroGuideSchema.shape.letters.nullable(),
  memoryIdeas: generatedHeroGuideSchema.shape.memoryIdeas.nullable(),
  metaDescription: generatedHeroGuideSchema.shape.metaDescription.nullable(),
  metaTitle: generatedHeroGuideSchema.shape.metaTitle.nullable(),
  photoIdeas: generatedHeroGuideSchema.shape.photoIdeas.nullable(),
  questions: generatedHeroGuideSchema.shape.questions.nullable(),
  sectionRepairs: z
    .array(generatedHeroGuideSchema.shape.sections.element)
    .nullable(),
  seoTitle: generatedHeroGuideSchema.shape.seoTitle.nullable(),
  timeline: generatedHeroGuideSchema.shape.timeline.nullable(),
});

const nullable = (schema: Record<string, unknown>) => ({
  anyOf: [schema, { type: "null" }],
});

export const heroGuideRepairJsonSchema = {
  additionalProperties: false,
  properties: {
    externalReferencePlaceholders: nullable({
      items: heroGuideJsonSchema.properties.externalReferencePlaceholders.items,
      minItems: 3,
      maxItems: 12,
      type: "array",
    }),
    faq: nullable({
      items: heroGuideJsonSchema.properties.faq.items,
      minItems: 5,
      maxItems: 10,
      type: "array",
    }),
    introduction: nullable({
      items: { type: "string" },
      minItems: 2,
      maxItems: 5,
      type: "array",
    }),
    letters: nullable({
      items: { type: "string" },
      minItems: 4,
      maxItems: 12,
      type: "array",
    }),
    memoryIdeas: nullable({
      items: { type: "string" },
      minItems: 6,
      maxItems: 16,
      type: "array",
    }),
    metaDescription: nullable({ type: "string" }),
    metaTitle: nullable({ type: "string" }),
    photoIdeas: nullable({
      items: { type: "string" },
      minItems: 6,
      maxItems: 16,
      type: "array",
    }),
    questions: nullable({
      items: { type: "string" },
      minItems: 8,
      maxItems: 20,
      type: "array",
    }),
    sectionRepairs: nullable({
      items: heroGuideJsonSchema.properties.sections.items,
      minItems: 1,
      maxItems: 20,
      type: "array",
    }),
    seoTitle: nullable({ type: "string" }),
    timeline: nullable({
      items: heroGuideJsonSchema.properties.timeline.items,
      minItems: 6,
      maxItems: 24,
      type: "array",
    }),
  },
  required: [
    "externalReferencePlaceholders",
    "faq",
    "introduction",
    "letters",
    "memoryIdeas",
    "metaDescription",
    "metaTitle",
    "photoIdeas",
    "questions",
    "sectionRepairs",
    "seoTitle",
    "timeline",
  ],
  type: "object",
} as const;

export type HeroGuideRepairPatch = z.infer<typeof repairPatchSchema>;

export function parseHeroGuideRepairPatch(
  value: unknown,
): HeroGuideRepairPatch {
  return repairPatchSchema.parse(value);
}
