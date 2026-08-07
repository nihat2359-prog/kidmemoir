import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getClientEnvironment } from "@/lib/env/client";
import { routing, type AppLocale } from "@/i18n/routing";
import type { SitemapEntry, SitemapSource } from "@/lib/seo/sitemap";
import type { Database } from "@/types/database.types";

function client() {
  const environment = getClientEnvironment();
  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function unavailable(code: string | undefined): boolean {
  return code === "42P01" || code === "PGRST205";
}

export const programmaticSitemapSource: SitemapSource = {
  count: async () => {
    try {
      const result = await client()
        .from("seo_pages")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .lte("published_at", new Date().toISOString());
      if (unavailable(result.error?.code)) return 0;
      return result.error ? 0 : (result.count ?? 0);
    } catch {
      return 0;
    }
  },
  id: "programmatic",
  load: async (offset, limit): Promise<readonly SitemapEntry[]> => {
    try {
      const result = await client()
        .from("seo_pages")
        .select(
          "category,path_key,locale,schema_type,updated_at,translation_key,hero",
        )
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("id")
        .range(offset, offset + limit - 1);
      if (result.error || !result.data?.length) return [];
      const translationKeys = [
        ...new Set(result.data.map(({ translation_key }) => translation_key)),
      ];
      const translations = await client()
        .from("seo_pages")
        .select("translation_key,locale,category,path_key,schema_type")
        .in("translation_key", translationKeys)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString());
      if (translations.error) return [];
      const alternatePaths = new Map<
        string,
        Partial<Record<AppLocale, string>>
      >();
      for (const translation of translations.data ?? []) {
        if (!routing.locales.includes(translation.locale as AppLocale))
          continue;
        const paths = alternatePaths.get(translation.translation_key) ?? {};
        paths[translation.locale as AppLocale] =
          translation.schema_type === "guide"
            ? `/guides/${translation.path_key}`
            : `/${translation.category}/${translation.path_key}`;
        alternatePaths.set(translation.translation_key, paths);
      }
      return result.data.map((page) => {
        const hero =
          page.hero &&
          typeof page.hero === "object" &&
          !Array.isArray(page.hero)
            ? page.hero
            : null;
        const image = hero?.image;
        const imageUrl =
          image && typeof image === "object" && !Array.isArray(image)
            ? image.url
            : undefined;
        return {
          alternatePaths: alternatePaths.get(page.translation_key),
          changeFrequency: "monthly",
          images: typeof imageUrl === "string" ? [imageUrl] : undefined,
          lastModified: page.updated_at,
          locales: routing.locales.includes(page.locale as AppLocale)
            ? [page.locale as AppLocale]
            : [],
          path:
            page.schema_type === "guide"
              ? `/guides/${page.path_key}`
              : `/${page.category}/${page.path_key}`,
          priority: 0.7,
        };
      });
    } catch {
      return [];
    }
  },
  reservedShards: 5,
};
