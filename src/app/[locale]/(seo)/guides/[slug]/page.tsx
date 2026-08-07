import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/features/programmatic-seo/components/SeoPageTemplate";
import { SeoStructuredData } from "@/features/programmatic-seo/components/SeoStructuredData";
import {
  getPublishedGuide,
  getPublishedSeoAlternatePaths,
  getRelatedSeoPages,
} from "@/features/programmatic-seo/services/contentRepository";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildMetadata, buildPrivateMetadata } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export function generateStaticParams() {
  return [];
}

async function resolveGuide({ params }: Props) {
  const { locale, slug } = await params;
  if (
    !hasLocale(routing.locales, locale) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)
  ) {
    return null;
  }
  const page = await getPublishedGuide(locale as AppLocale, slug);
  return page ? { locale: locale as AppLocale, page } : null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolved = await resolveGuide(props);
  if (!resolved) return buildPrivateMetadata();
  const alternatePaths = await getPublishedSeoAlternatePaths(resolved.page.id);
  return buildMetadata({
    alternatePaths,
    description: resolved.page.seoDescription,
    index: true,
    keywords: resolved.page.semanticTerms,
    locale: resolved.locale,
    path: `/guides/${resolved.page.slug}`,
    title: resolved.page.seoTitle,
    type: "article",
  });
}

export default async function PublishedGuidePage(props: Props) {
  const resolved = await resolveGuide(props);
  if (!resolved) notFound();
  setRequestLocale(resolved.locale);
  const [relatedPages, t] = await Promise.all([
    getRelatedSeoPages(resolved.page),
    getTranslations({
      locale: resolved.locale,
      namespace: "programmaticSeo",
    }),
  ]);
  return (
    <>
      <SeoStructuredData page={resolved.page} />
      <SeoPageTemplate
        labels={{
          faq: t("sections.faq"),
          quickAnswer: t("sections.quickAnswer"),
          readingTime: t("readingTime", {
            minutes: resolved.page.readingTime,
          }),
          related: t("sections.related"),
        }}
        page={resolved.page}
        relatedPages={relatedPages}
      />
    </>
  );
}
