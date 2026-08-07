import type { MetadataRoute } from "next";
import { createSitemap, getSitemapRouteDescriptors } from "@/lib/seo";

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
