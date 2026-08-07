import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");
  if (!isProduction) {
    return { rules: { disallow: "/", userAgent: "*" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/bootstrap",
        "/*/dashboard",
        "/*/children",
        "/*/memories",
        "/*/profile",
        "/*/settings",
        "/*/subscription",
        "/*/timeline",
        "/*/login",
        "/*/register",
        "/*/reset-password",
      ],
    },
    host: SEO_CONFIG.siteUrl,
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap-index.xml`,
  };
}
