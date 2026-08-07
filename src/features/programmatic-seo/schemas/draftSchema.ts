import { z } from "zod";
import {
  CONTENT_SECTION_TYPES,
  QUALITY_RULES,
} from "@/features/programmatic-seo/types/contentFactory";

const mediaRecommendationSchema = z.object({
  altTextGuidance: z.string().max(240).nullable(),
  brief: z.string().min(20).max(1000),
  type: z.enum(["photo", "video", "infographic", "illustration", "table"]),
});

export const seoDraftSchema = z.object({
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  faq: z
    .array(
      z.object({
        answer: z.string().min(40).max(2000),
        question: z.string().min(10).max(240),
      }),
    )
    .min(5)
    .max(10),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  sections: z.array(
    z.object({
      body: z.union([z.array(z.unknown()), z.record(z.unknown())]),
      mediaRecommendations: z.array(mediaRecommendationSchema).max(20),
      position: z.number().int().min(1).max(50),
      type: z.enum(CONTENT_SECTION_TYPES),
      wordCount: z.number().int().nonnegative(),
    }),
  ),
  seoDescription: z.string().min(70).max(170),
  seoTitle: z.string().min(20).max(70),
  title: z.string().min(2).max(180),
  wordCount: z.number().int().nonnegative(),
});

export const qualityResultSchema = z.object({
  findings: z.array(z.string().min(1).max(500)),
  passed: z.boolean(),
  rule: z.enum(QUALITY_RULES),
  score: z.number().int().min(0).max(100),
});
