import "server-only";

import { createHash } from "node:crypto";
import {
  countSeoWords,
  seoPageRecordSchema,
} from "@/features/programmatic-seo/schemas/contentSchema";

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function prepareSeoContent(input: Record<string, unknown>) {
  const contentWordCount = countSeoWords({
    content: input.content,
    excerpt: input.excerpt,
    faq: input.faq,
    hero: input.hero,
    howto: input.howto,
  });
  const prepared = { ...input, content_word_count: contentWordCount };
  const validation = seoPageRecordSchema.safeParse(prepared);
  return {
    contentHash: createHash("sha256")
      .update(stableJson(prepared))
      .digest("hex"),
    contentWordCount,
    issues: validation.success
      ? []
      : validation.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join("."),
        })),
    publishable: validation.success,
    value: validation.success ? validation.data : null,
  } as const;
}
