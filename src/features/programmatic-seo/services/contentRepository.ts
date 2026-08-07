import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { getClientEnvironment } from "@/lib/env/client";
import type { AppLocale } from "@/i18n/routing";
import type { Database } from "@/types/database.types";
import type { SeoCategorySlug } from "@/features/programmatic-seo/constants/categories";
import { assertSeoQuality } from "@/features/programmatic-seo/schemas/contentSchema";
import type {
  RelatedSeoPage,
  SeoPage,
} from "@/features/programmatic-seo/types/content";

const PUBLIC_REVALIDATE_SECONDS = 3600;
const RELATED_MINIMUM = 5;
const RELATED_MAXIMUM = 10;

function publicClient() {
  const environment = getClientEnvironment();
  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function isUnavailableTable(error: { code?: string } | null): boolean {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

const pageColumns =
  "id,cluster_id,topic_id,category,locale,slug,slug_path,path_key,title,seo_title,seo_description,excerpt,hero,content,faq,howto,cta,difficulty,reading_time,search_intent,parent_stage,child_age_min,child_age_max,schema_type,semantic_terms,content_word_count,quality_score,updated_at,published_at,translation_key" as const;

async function mapPage(
  record: Record<string, unknown>,
): Promise<SeoPage | null> {
  const parsed = assertSeoQuality({ ...record, search_volume: null });
  const supabase = publicClient();
  const [cluster, topic] = await Promise.all([
    supabase
      .from("seo_clusters")
      .select("title")
      .eq("id", parsed.cluster_id)
      .single(),
    supabase
      .from("seo_topics")
      .select("title")
      .eq("id", parsed.topic_id)
      .single(),
  ]);
  if (cluster.error || topic.error) return null;
  return {
    category: parsed.category,
    childAgeMax: parsed.child_age_max,
    childAgeMin: parsed.child_age_min,
    clusterId: parsed.cluster_id,
    clusterTitle: cluster.data.title,
    content: parsed.content,
    contentWordCount: parsed.content_word_count,
    cta: parsed.cta,
    difficulty: parsed.difficulty,
    excerpt: parsed.excerpt,
    faq: parsed.faq,
    hero: parsed.hero,
    howto: parsed.howto,
    id: parsed.id,
    locale: parsed.locale,
    parentStage: parsed.parent_stage,
    publishedAt: parsed.published_at,
    qualityScore: parsed.quality_score,
    readingTime: parsed.reading_time,
    schemaType: parsed.schema_type,
    searchIntent: parsed.search_intent,
    searchVolume: parsed.search_volume,
    semanticTerms: parsed.semantic_terms,
    seoDescription: parsed.seo_description,
    seoTitle: parsed.seo_title,
    slug: parsed.slug,
    slugPath: parsed.slug_path,
    title: parsed.title,
    topicId: parsed.topic_id,
    topicTitle: topic.data.title,
    updatedAt: parsed.updated_at,
  };
}

const getCachedPage = unstable_cache(
  async (locale: AppLocale, category: SeoCategorySlug, pathKey: string) => {
    const result = await publicClient()
      .from("seo_pages")
      .select(pageColumns)
      .eq("locale", locale)
      .eq("category", category)
      .eq("path_key", pathKey)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (isUnavailableTable(result.error)) return null;
    if (result.error || !result.data) return null;
    try {
      return await mapPage(result.data as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },
  ["programmatic-seo-page-v1"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["programmatic-seo"] },
);

export function getPublishedSeoPage(
  locale: AppLocale,
  category: SeoCategorySlug,
  slugPath: readonly string[],
) {
  return getCachedPage(locale, category, slugPath.join("/"));
}

function toRelated(
  row: Pick<
    Database["public"]["Tables"]["seo_pages"]["Row"],
    "category" | "excerpt" | "id" | "slug_path" | "title"
  >,
  relationType: string,
): RelatedSeoPage {
  return {
    category: row.category,
    excerpt: row.excerpt,
    id: row.id,
    relationType,
    slugPath: row.slug_path,
    title: row.title,
  };
}

async function loadRelatedSeoPages(
  pageId: string,
  clusterId: string,
  locale: AppLocale,
): Promise<readonly RelatedSeoPage[]> {
  const supabase = publicClient();
  const relations = await supabase
    .from("seo_page_relations")
    .select("target_page_id,relation_type,weight")
    .eq("source_page_id", pageId)
    .order("weight", { ascending: false })
    .limit(RELATED_MAXIMUM);
  const relationById = new Map(
    (relations.data ?? []).map((item) => [item.target_page_id, item]),
  );
  const explicitIds = [...relationById.keys()];
  const explicit = explicitIds.length
    ? await supabase
        .from("seo_pages")
        .select("id,category,slug_path,title,excerpt")
        .in("id", explicitIds)
        .eq("cluster_id", clusterId)
        .eq("locale", locale)
        .eq("status", "published")
    : { data: [], error: null };
  const related = (explicit.data ?? [])
    .sort(
      (left, right) =>
        explicitIds.indexOf(left.id) - explicitIds.indexOf(right.id),
    )
    .map((row) =>
      toRelated(row, relationById.get(row.id)?.relation_type ?? "related"),
    );

  if (related.length >= RELATED_MINIMUM)
    return related.slice(0, RELATED_MAXIMUM);
  const excluded = [pageId, ...related.map(({ id }) => id)];
  const fallback = await supabase
    .from("seo_pages")
    .select("id,category,slug_path,title,excerpt")
    .eq("cluster_id", clusterId)
    .eq("locale", locale)
    .eq("status", "published")
    .not("id", "in", `(${excluded.join(",")})`)
    .order("quality_score", { ascending: false })
    .limit(RELATED_MAXIMUM - related.length);
  return [
    ...related,
    ...(fallback.data ?? []).map((row) => toRelated(row, "cluster")),
  ].slice(0, RELATED_MAXIMUM);
}

const getCachedRelatedSeoPages = unstable_cache(
  loadRelatedSeoPages,
  ["programmatic-seo-related-v1"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["programmatic-seo"] },
);

export function getRelatedSeoPages(page: SeoPage) {
  return getCachedRelatedSeoPages(page.id, page.clusterId, page.locale);
}

const getCachedTranslationCoverage = unstable_cache(
  async (pageId: string) => {
    const source = await publicClient()
      .from("seo_pages")
      .select("translation_key")
      .eq("id", pageId)
      .single();
    if (source.error) return false;
    const translations = await publicClient()
      .from("seo_pages")
      .select("locale")
      .eq("translation_key", source.data.translation_key)
      .eq("status", "published");
    if (translations.error) return false;
    return (
      new Set((translations.data ?? []).map(({ locale }) => locale)).size >= 2
    );
  },
  ["programmatic-seo-translations-v1"],
  {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: ["programmatic-seo"],
  },
);

export function hasCompleteTranslations(pageId: string): Promise<boolean> {
  return getCachedTranslationCoverage(pageId);
}
