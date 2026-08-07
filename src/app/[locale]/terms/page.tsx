import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { InformationPage } from "@/features/information/components/InformationPage";
import {
  LegalDocument,
  type LegalSection,
} from "@/features/information/components/LegalDocument";
import { informationMetadata } from "@/features/information/utils/metadata";
import { routing } from "@/i18n/routing";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;
const sectionKeys = [
  "service",
  "accounts",
  "responsibilities",
  "prohibited",
  "content",
  "intellectualProperty",
  "premium",
  "availability",
  "disclaimer",
  "termination",
  "changes",
  "contact",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "information.terms.metadata",
  });
  return informationMetadata({
    description: t("description"),
    locale,
    path: "terms",
    title: t("title"),
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "information.terms" });
  const sections: LegalSection[] = sectionKeys.map((key) => ({
    body: [
      t(`sections.${key}.body1`),
      ...(t.has(`sections.${key}.body2`) ? [t(`sections.${key}.body2`)] : []),
    ],
    id: key,
    points: t.has(`sections.${key}.points`)
      ? (t.raw(`sections.${key}.points`) as string[])
      : undefined,
    title: t(`sections.${key}.title`),
  }));
  return (
    <InformationPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={FileText}
      seoPath="/terms"
      title={t("title")}
    >
      <LegalDocument
        contactEmail="hello@kidmemoir.com"
        contactLabel={t("contactAction")}
        contentsLabel={t("contents")}
        lastUpdated={t("lastUpdatedValue")}
        lastUpdatedLabel={t("lastUpdated")}
        sections={sections}
      />
    </InformationPage>
  );
}
