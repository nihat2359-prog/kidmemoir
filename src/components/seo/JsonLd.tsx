import type { JsonLd } from "@/lib/seo/structuredData";

export function JsonLdScript({ data }: { data: JsonLd | readonly JsonLd[] }) {
  const graph = Array.isArray(data) ? data : [data];
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
