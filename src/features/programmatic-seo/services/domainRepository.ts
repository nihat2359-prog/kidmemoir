import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import {
  isSeoCategory,
  isSeoCategorySlug,
} from "@/features/programmatic-seo/constants/categories";
import { getClientEnvironment } from "@/lib/env/client";
import type { Database } from "@/types/database.types";

const getCachedDomainStatus = unstable_cache(
  async (slug: string): Promise<boolean> => {
    const environment = getClientEnvironment();
    const client = createClient<Database>(
      environment.NEXT_PUBLIC_SUPABASE_URL,
      environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const result = await client
      .from("seo_domains")
      .select("id")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();
    return !result.error && Boolean(result.data);
  },
  ["seo-domain-status-v1"],
  { revalidate: 3600, tags: ["seo-domains"] },
);

export async function isSupportedSeoCategory(slug: string): Promise<boolean> {
  if (!isSeoCategorySlug(slug)) return false;
  if (isSeoCategory(slug)) return true;
  return getCachedDomainStatus(slug);
}
