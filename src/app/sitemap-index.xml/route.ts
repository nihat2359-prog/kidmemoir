import { getSitemapDescriptors } from "@/lib/seo";
import { SEO_CONFIG } from "@/lib/seo/config";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const descriptors = await getSitemapDescriptors();
  const entries = descriptors
    .map(
      ({ id }) =>
        `<sitemap><loc>${escapeXml(`${SEO_CONFIG.siteUrl}/sitemap/${id}.xml`)}</loc></sitemap>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`,
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
