import type { MetadataRoute } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { localizedUrl, PUBLIC_SEO_PATHS } from "@/lib/seo/config";
import { programmaticSitemapSource } from "@/features/programmatic-seo/services/sitemapSource";

export const SITEMAP_URL_LIMIT = 45_000;

export type SitemapEntry = Readonly<{
  alternatePaths?: Partial<Record<AppLocale, string>>;
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  images?: readonly string[];
  lastModified?: Date | string;
  locales?: readonly AppLocale[];
  priority?: number;
  videos?: MetadataRoute.Sitemap[number]["videos"];
}>;

export type SitemapSource = Readonly<{
  id: "pages" | "blog" | "knowledge-base" | "programmatic";
  count: () => Promise<number>;
  load: (offset: number, limit: number) => Promise<readonly SitemapEntry[]>;
  reservedShards?: number;
}>;

const staticEntries: readonly SitemapEntry[] = PUBLIC_SEO_PATHS.map((path) => ({
  changeFrequency: path ? "monthly" : "weekly",
  path,
  priority: path ? 0.7 : 1,
}));

const staticPages: SitemapSource = {
  count: async () => staticEntries.length,
  id: "pages",
  load: async (offset, limit) => staticEntries.slice(offset, offset + limit),
};

// Blog, knowledge-base and programmatic modules add paged providers here.
export const sitemapSources: readonly SitemapSource[] = [
  staticPages,
  programmaticSitemapSource,
];

export type SitemapDescriptor = Readonly<{
  id: string;
  page: number;
  sourceId: SitemapSource["id"];
}>;

const entriesPerShard = Math.floor(SITEMAP_URL_LIMIT / routing.locales.length);

function alternates(
  path: string,
  alternatePaths?: Partial<Record<AppLocale, string>>,
) {
  const locales = alternatePaths
    ? routing.locales.filter((locale) => alternatePaths[locale])
    : routing.locales;
  const defaultLocale = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : locales[0];
  return Object.fromEntries([
    ...locales.map((locale) => [
      locale,
      localizedUrl(locale, alternatePaths?.[locale] ?? path),
    ]),
    ...(defaultLocale
      ? [
          [
            "x-default",
            localizedUrl(
              defaultLocale,
              alternatePaths?.[defaultLocale] ?? path,
            ),
          ],
        ]
      : []),
  ]);
}

export async function getSitemapDescriptors(): Promise<
  readonly SitemapDescriptor[]
> {
  return createDescriptors(false);
}

export async function getSitemapRouteDescriptors(): Promise<
  readonly SitemapDescriptor[]
> {
  return createDescriptors(true);
}

async function createDescriptors(
  includeReserved: boolean,
): Promise<readonly SitemapDescriptor[]> {
  const counts = await Promise.all(
    sitemapSources.map(async (source) => ({
      count: await source.count(),
      source,
    })),
  );
  return counts.flatMap(({ count, source }) => {
    const activeShards = Math.ceil(count / entriesPerShard);
    const shardCount = includeReserved
      ? Math.max(activeShards, source.reservedShards ?? 0)
      : activeShards;
    return Array.from({ length: shardCount }, (_, page) => ({
      id: `${source.id}-${page}`,
      page,
      sourceId: source.id,
    }));
  });
}

export async function createSitemap(
  descriptorId: string,
): Promise<MetadataRoute.Sitemap> {
  const descriptors = await getSitemapRouteDescriptors();
  const descriptor = descriptors.find(({ id }) => id === descriptorId);
  if (!descriptor) return [];
  const source = sitemapSources.find(({ id }) => id === descriptor.sourceId);
  if (!source) return [];
  const entries = await source.load(
    descriptor.page * entriesPerShard,
    entriesPerShard,
  );
  return entries.flatMap((entry) =>
    (entry.locales ?? routing.locales).map((locale: AppLocale) => ({
      alternates: {
        languages: alternates(entry.path, entry.alternatePaths),
      },
      changeFrequency: entry.changeFrequency,
      images: entry.images ? [...entry.images] : undefined,
      lastModified: entry.lastModified,
      priority: entry.priority,
      url: localizedUrl(locale, entry.path),
      videos: entry.videos,
    })),
  );
}
