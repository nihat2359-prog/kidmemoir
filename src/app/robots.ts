import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: "https://www.kidmemoir.com/sitemap.xml",
  };
}
