import { z } from "zod";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const heroSchema = z.object({
  description: z.string().min(40).max(500),
  eyebrow: z.string().min(2).max(80).optional(),
  image: z
    .object({
      alt: z.string().min(2).max(180),
      height: z.number().int().positive(),
      url: z.string().url(),
      width: z.number().int().positive(),
    })
    .optional(),
  title: z.string().min(2).max(180),
});
const faqSchema = z.array(
  z.object({
    answer: z.string().min(40).max(2000),
    question: z.string().min(10).max(240),
  }),
);
const howToSchema = z
  .object({
    description: z.string().min(40).max(600),
    name: z.string().min(2).max(180),
    steps: z
      .array(
        z.object({
          text: z.string().min(20).max(1200),
          title: z.string().min(2).max(160).optional(),
        }),
      )
      .min(2)
      .max(20),
    totalTime: z
      .string()
      .regex(/^P(T(?=\d)[0-9HMS]+|\d+D)$/)
      .optional(),
  })
  .nullable();
const sectionSchema = z.object({
  body: z.array(z.string().min(40).max(3000)).max(12).optional(),
  id: slugSchema,
  items: z
    .array(
      z.object({
        description: z.string().min(20).max(1200),
        title: z.string().min(2).max(160).optional(),
      }),
    )
    .max(20)
    .optional(),
  title: z.string().min(2).max(180),
  type: z.enum([
    "quick-summary",
    "timeline",
    "parent-tips",
    "memory-ideas",
    "photo-ideas",
    "newsletter",
  ]),
});

export function countSeoWords(value: unknown): number {
  if (typeof value === "string") {
    return value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  }
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countSeoWords(item), 0);
  }
  if (value && typeof value === "object") {
    return Object.values(value).reduce(
      (total, item) => total + countSeoWords(item),
      0,
    );
  }
  return 0;
}

export const seoPageRecordSchema = z
  .object({
    category: slugSchema,
    child_age_max: z.number().int().min(0).max(216).nullable(),
    child_age_min: z.number().int().min(0).max(216).nullable(),
    cluster_id: z.string().uuid(),
    content: z.array(sectionSchema).min(3).max(20),
    content_word_count: z.number().int().min(600),
    cta: z.object({
      description: z.string().min(20).max(500),
      href: z.string().startsWith("/"),
      label: z.string().min(2).max(80),
      title: z.string().min(2).max(180),
    }),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).nullable(),
    excerpt: z.string().min(40).max(600),
    faq: faqSchema,
    hero: heroSchema,
    howto: howToSchema,
    id: z.string().uuid(),
    locale: z.enum(["tr", "en"]),
    parent_stage: z.string().nullable(),
    path_key: z.string(),
    published_at: z.string().datetime({ offset: true }),
    quality_score: z.number().int().min(80).max(100),
    reading_time: z.number().int().min(1).max(120),
    schema_type: z.enum([
      "faq",
      "howto",
      "article",
      "webpage",
      "checklist",
      "guide",
    ]),
    search_intent: z.enum([
      "informational",
      "commercial",
      "navigational",
      "transactional",
      "comparison",
      "inspirational",
      "educational",
    ]),
    search_volume: z.number().int().nonnegative().nullable(),
    semantic_terms: z.array(z.string()),
    seo_description: z.string().min(70).max(170),
    seo_title: z.string().min(20).max(70),
    slug: slugSchema,
    slug_path: z.array(slugSchema).min(1).max(8),
    title: z.string().min(2).max(180),
    topic_id: z.string().uuid(),
    updated_at: z.string().datetime({ offset: true }),
  })
  .superRefine((page, context) => {
    const actualWordCount = countSeoWords({
      content: page.content,
      excerpt: page.excerpt,
      faq: page.faq,
      hero: page.hero,
      howto: page.howto,
    });
    if (actualWordCount < 600 || page.content_word_count !== actualWordCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Published content must contain and report at least 600 words.",
        path: ["content_word_count"],
      });
    }
    if (page.schema_type === "faq" && page.faq.length < 3) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "FAQ pages require at least three complete questions.",
        path: ["faq"],
      });
    }
    if (["howto", "checklist"].includes(page.schema_type) && !page.howto) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "HowTo and checklist pages require structured steps.",
        path: ["howto"],
      });
    }
  });

export function assertSeoQuality(input: unknown) {
  return seoPageRecordSchema.parse(input);
}
