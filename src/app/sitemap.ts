import type { MetadataRoute } from "next";
import { createSitemap, getSitemapRouteDescriptors } from "@/lib/seo";

// Programmatic entries are published independently of application deploys.
// Rebuild sitemap shards periodically so production reads the current remote
// database even when publishing is initiated from a local admin session.
export const revalidate = 3600;

export async function generateSitemaps() {
  const descriptors = await getSitemapRouteDescriptors();
  return descriptors.map(({ id }) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  return createSitemap(await id);
}
