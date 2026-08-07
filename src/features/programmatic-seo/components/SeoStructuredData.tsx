import { JsonLdScript } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { breadcrumbSchema, schemaBuilders, webpageSchema } from "@/lib/seo";
import { localizedUrl } from "@/lib/seo/config";
import type { JsonLd } from "@/lib/seo/structuredData";
import type { SeoPage } from "@/features/programmatic-seo/types/content";

function pagePath(page: SeoPage): string {
  return `/${page.category}/${page.slugPath.join("/")}`;
}

function contentSchema(page: SeoPage, locale: AppLocale): JsonLd | null {
  const path = pagePath(page);
  if (page.schemaType === "faq" && page.faq.length) {
    return schemaBuilders.faqPage(page.faq);
  }
  if (
    (page.schemaType === "howto" || page.schemaType === "checklist") &&
    page.howto
  ) {
    return schemaBuilders.howTo({
      description: page.howto.description,
      name: page.howto.name,
      steps: page.howto.steps.map(({ text }) => text),
      totalTime: page.howto.totalTime,
    });
  }
  if (page.schemaType === "article" || page.schemaType === "guide") {
    return schemaBuilders.article({
      author: "KidMemoir",
      dateModified: page.updatedAt,
      datePublished: page.publishedAt,
      description: page.seoDescription,
      headline: page.seoTitle,
      image: page.hero.image?.url,
      url: localizedUrl(locale, path),
    });
  }
  return null;
}

export function SeoStructuredData({ page }: { page: SeoPage }) {
  const locale = page.locale;
  const path = pagePath(page);
  const specific = contentSchema(page, locale);
  return (
    <JsonLdScript
      data={[
        webpageSchema({
          description: page.seoDescription,
          locale,
          name: page.seoTitle,
          path,
        }),
        breadcrumbSchema([
          { name: "KidMemoir", url: localizedUrl(locale) },
          { name: page.title, url: localizedUrl(locale, path) },
        ]),
        ...(specific ? [specific] : []),
        ...(page.faq.length && page.schemaType !== "faq"
          ? [schemaBuilders.faqPage(page.faq)]
          : []),
      ]}
    />
  );
}
