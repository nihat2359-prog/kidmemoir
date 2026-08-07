import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/features/programmatic-seo/components/SeoPageTemplate";
import { SeoStructuredData } from "@/features/programmatic-seo/components/SeoStructuredData";
import {
  getPublishedSeoPage,
  getRelatedSeoPages,
  hasCompleteTranslations,
} from "@/features/programmatic-seo/services/contentRepository";
import { isSupportedSeoCategory } from "@/features/programmatic-seo/services/domainRepository";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildMetadata, buildPrivateMetadata } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 3600;

type Props = Readonly<{
  params: Promise<{ category: string; locale: string; slug?: string[] }>;
}>;

export function generateStaticParams() {
  return [];
}

async function resolvePage({ params }: Props) {
  const { category, locale, slug = [] } = await params;
  if (
    !hasLocale(routing.locales, locale) ||
    !(await isSupportedSeoCategory(category)) ||
    slug.length === 0 ||
    slug.length > 8
  ) {
    return null;
  }
  const page = await getPublishedSeoPage(locale as AppLocale, category, slug);
  return page ? { locale: locale as AppLocale, page } : null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolved = await resolvePage(props);
  if (!resolved) return buildPrivateMetadata();
  const index = await hasCompleteTranslations(resolved.page.id);
  return buildMetadata({
    description: resolved.page.seoDescription,
    index,
    keywords: resolved.page.semanticTerms,
    locale: resolved.locale,
    path: `/${resolved.page.category}/${resolved.page.slugPath.join("/")}`,
    title: resolved.page.seoTitle,
    type:
      resolved.page.schemaType === "article" ||
      resolved.page.schemaType === "guide"
        ? "article"
        : "website",
  });
}

export default async function ProgrammaticSeoPage(props: Props) {
  const resolved = await resolvePage(props);
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
