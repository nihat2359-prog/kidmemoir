import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import type { FactoryTemplate } from "@/features/programmatic-seo/types/contentFactory";
import { SeoQualityGateError } from "@/features/programmatic-seo/hero-generator/qualityGateError";
import { generateContent } from "./service";

const batchInputSchema = z.object({
  locale: z.enum(["tr", "en"]),
  template: z.enum([
    "guide",
    "checklist",
    "timeline",
    "faq",
    "knowledge",
    "comparison",
    "ideas",
    "tool",
    "templates",
    "landing",
  ]),
  topics: z.array(z.string().trim().min(2).max(180)).min(1).max(100),
});

export type GenerateBatchInput = Readonly<{
  locale: "tr" | "en";
  template: FactoryTemplate;
  topics: readonly string[];
}>;

export type BatchContentResult = Readonly<{
  durationMs: number;
  error: string | null;
  quality: number | null;
  status: "draft" | "failed" | "rejected";
  token: number | null;
  topic: string;
}>;

export type BatchGenerationResult = Readonly<{
  completedAt: string;
  items: readonly BatchContentResult[];
  locale: "tr" | "en";
  summary: Readonly<{
    averageDurationMs: number;
    failed: number;
    rejected: number;
    successful: number;
    total: number;
    totalTokens: number;
  }>;
  template: FactoryTemplate;
}>;

const CONTENT_ROOT = resolve(process.cwd(), "content");
const DRAFT_DIRECTORY = resolve(CONTENT_ROOT, "drafts");
const JSON_DIRECTORY = resolve(CONTENT_ROOT, "json");

function safeSlug(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return slug || "content";
}

async function writeAtomic(path: string, contents: string): Promise<void> {
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, contents, "utf8");
  await rename(temporaryPath, path);
}

function qualityFromError(error: unknown): number | null {
  if (error instanceof SeoQualityGateError) return error.qualityScore;
  if (!(error instanceof Error)) return null;
  const match = /^SEO_QUALITY_GATE_(\d+)$/u.exec(error.message);
  return match?.[1] ? Number(match[1]) : null;
}

function publicError(error: unknown): string {
  if (!(error instanceof Error)) return "CONTENT_GENERATION_FAILED";
  if (error.message.startsWith("SEO_QUALITY_GATE_"))
    return "QUALITY_SCORE_BELOW_THRESHOLD";
  return error.message.startsWith("SEO_")
    ? error.message
    : "CONTENT_GENERATION_FAILED";
}

function renderSummary(result: BatchGenerationResult): string {
  const { summary } = result;
  const rows = result.items
    .map(
      (item) =>
        `| ${item.topic.replaceAll("|", "\\|")} | ${item.status} | ${item.quality ?? "—"} | ${item.token ?? "—"} | ${item.durationMs} ms |`,
    )
    .join("\n");
  return `# Batch Content Summary

- Locale: ${result.locale}
- Template: ${result.template}
- Completed: ${result.completedAt}
- Total: ${summary.total}
- Successful: ${summary.successful}
- Rejected: ${summary.rejected}
- Failed: ${summary.failed}
- Total tokens: ${summary.totalTokens}
- Average duration: ${summary.averageDurationMs} ms

| Topic | Status | Quality | Tokens | Duration |
| --- | --- | ---: | ---: | ---: |
${rows}
`;
}

/** Generates Content Factory drafts sequentially and exports accepted results. */
export async function generateBatch(
  rawInput: GenerateBatchInput,
): Promise<BatchGenerationResult> {
  const input = batchInputSchema.parse(rawInput);
  await Promise.all([
    mkdir(DRAFT_DIRECTORY, { recursive: true }),
    mkdir(JSON_DIRECTORY, { recursive: true }),
  ]);

  const items: BatchContentResult[] = [];
  for (const topic of input.topics) {
    const startedAt = performance.now();
    try {
      const result = await generateContent({
        locale: input.locale,
        template: input.template,
        topic,
      });
      const durationMs = Math.round(performance.now() - startedAt);
      const filename = `${safeSlug(result.seo.slug)}.${input.locale}`;
      await Promise.all([
        writeAtomic(
          resolve(DRAFT_DIRECTORY, `${filename}.md`),
          result.markdown,
        ),
        writeAtomic(
          resolve(JSON_DIRECTORY, `${filename}.json`),
          `${JSON.stringify(result, null, 2)}\n`,
        ),
      ]);
      items.push({
        durationMs,
        error: null,
        quality: result.quality.score,
        status: result.quality.score >= 85 ? "draft" : "rejected",
        token: result.usage.totalTokens,
        topic,
      });
    } catch (error) {
      const quality = qualityFromError(error);
      const rejected = error instanceof SeoQualityGateError;
      items.push({
        durationMs: Math.round(performance.now() - startedAt),
        error: publicError(error),
        quality,
        status:
          rejected || (quality !== null && quality < 85)
            ? "rejected"
            : "failed",
        token: rejected ? error.analytics.totalTokens : null,
        topic,
      });
    }
  }

  const durationTotal = items.reduce((sum, item) => sum + item.durationMs, 0);
  const completedAt = new Date().toISOString();
  const result: BatchGenerationResult = {
    completedAt,
    items,
    locale: input.locale,
    summary: {
      averageDurationMs: Math.round(durationTotal / items.length),
      failed: items.filter((item) => item.status === "failed").length,
      rejected: items.filter((item) => item.status === "rejected").length,
      successful: items.filter((item) => item.status === "draft").length,
      total: items.length,
      totalTokens: items.reduce((sum, item) => sum + (item.token ?? 0), 0),
    },
    template: input.template,
  };

  await Promise.all([
    writeAtomic(
      resolve(DRAFT_DIRECTORY, `batch-summary.${input.locale}.md`),
      renderSummary(result),
    ),
    writeAtomic(
      resolve(JSON_DIRECTORY, `batch-summary.${input.locale}.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    ),
  ]);
  return result;
}
