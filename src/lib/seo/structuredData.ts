import { localizedUrl, SEO_CONFIG } from "@/lib/seo/config";
import type { AppLocale } from "@/i18n/routing";

export type JsonLd = Readonly<Record<string, unknown>>;

const context = "https://schema.org";

export function organizationSchema(): JsonLd {
  return {
    "@context": context,
    "@id": SEO_CONFIG.organizationId,
    "@type": "Organization",
    logo: `${SEO_CONFIG.siteUrl}/kidmemoir.svg`,
    name: SEO_CONFIG.brand,
    url: SEO_CONFIG.siteUrl,
  };
}

export function websiteSchema(locale: AppLocale): JsonLd {
  return {
    "@context": context,
    "@id": SEO_CONFIG.websiteId,
    "@type": "WebSite",
    inLanguage: locale,
    name: SEO_CONFIG.brand,
    publisher: { "@id": SEO_CONFIG.organizationId },
    url: localizedUrl(locale),
  };
}

export function softwareApplicationSchema({
  description,
  locale,
}: {
  description: string;
  locale: AppLocale;
}): JsonLd {
  return {
    "@context": context,
    "@type": "SoftwareApplication",
    applicationCategory: "LifestyleApplication",
    description,
    inLanguage: locale,
    name: SEO_CONFIG.brand,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    operatingSystem: "Web",
    publisher: { "@id": SEO_CONFIG.organizationId },
  };
}

export function breadcrumbSchema(
  items: readonly { name: string; url: string }[],
): JsonLd {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: item.url,
      name: item.name,
      position: index + 1,
    })),
  };
}

export function webpageSchema(input: {
  description: string;
  locale: AppLocale;
  name: string;
  path?: string;
}): JsonLd {
  return {
    "@context": context,
    "@type": "WebPage",
    description: input.description,
    inLanguage: input.locale,
    isPartOf: { "@id": SEO_CONFIG.websiteId },
    name: input.name,
    url: localizedUrl(input.locale, input.path),
  };
}

type ArticleInput = Readonly<{
  author: string;
  dateModified?: string;
  datePublished: string;
  description: string;
  headline: string;
  image?: string;
  url: string;
}>;

type FaqInput = readonly Readonly<{ answer: string; question: string }>[];
type HowToInput = Readonly<{
  description: string;
  name: string;
  steps: readonly string[];
  totalTime?: string;
}>;
type ImageInput = Readonly<{
  caption?: string;
  contentUrl: string;
  height?: number;
  width?: number;
}>;
type VideoInput = Readonly<{
  contentUrl?: string;
  description: string;
  embedUrl?: string;
  name: string;
  thumbnailUrl: string;
  uploadDate: string;
}>;

export const schemaBuilders = {
  article: (value: ArticleInput): JsonLd => ({
    "@context": context,
    "@type": "Article",
    ...value,
    author: { "@type": "Person", name: value.author },
    publisher: { "@id": SEO_CONFIG.organizationId },
  }),
  faqPage: (questions: FaqInput): JsonLd => ({
    "@context": context,
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer", text: item.answer },
      name: item.question,
    })),
  }),
  howTo: (value: HowToInput): JsonLd => {
    const { steps, ...howTo } = value;
    return {
      "@context": context,
      "@type": "HowTo",
      ...howTo,
      step: steps.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text,
      })),
    };
  },
  imageObject: (value: ImageInput): JsonLd => ({
    "@context": context,
    "@type": "ImageObject",
    ...value,
  }),
  person: (value: Readonly<{ name: string; url?: string }>): JsonLd => ({
    "@context": context,
    "@type": "Person",
    ...value,
  }),
  review: (
    value: Readonly<{
      author: string;
      itemName: string;
      rating: number;
      reviewBody: string;
    }>,
  ): JsonLd => ({
    "@context": context,
    "@type": "Review",
    author: { "@type": "Person", name: value.author },
    itemReviewed: { "@type": "SoftwareApplication", name: value.itemName },
    reviewBody: value.reviewBody,
    reviewRating: { "@type": "Rating", ratingValue: value.rating },
  }),
  videoObject: (value: VideoInput): JsonLd => ({
    "@context": context,
    "@type": "VideoObject",
    ...value,
  }),
} as const;
