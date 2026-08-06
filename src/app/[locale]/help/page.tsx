import type { Metadata } from "next";
import { CircleHelp, LifeBuoy } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  HelpCenterExplorer,
  type HelpCategory,
  type HelpQuestion,
} from "@/features/information/components/HelpCenterExplorer";
import { InformationPage } from "@/features/information/components/InformationPage";
import { informationMetadata } from "@/features/information/utils/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;
const categoryKeys: HelpCategory["key"][] = [
  "usage",
  "account",
  "memories",
  "media",
  "premium",
  "ai",
];
const questionKeys = [
  "createMemory",
  "addChild",
  "changePassword",
  "mediaLimits",
  "privacy",
  "premium",
  "ai",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "information.help.metadata",
  });
  return informationMetadata({
    description: t("description"),
    locale,
    path: "help",
    title: t("title"),
  });
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "information.help" });
  const categories: HelpCategory[] = categoryKeys.map((key) => ({
    description: t(`categories.items.${key}.description`),
    key,
    title: t(`categories.items.${key}.title`),
  }));
  const questions: HelpQuestion[] = questionKeys.map((key) => ({
    answer: t(`faq.items.${key}.answer`),
    category: t.raw(`faq.items.${key}.category`) as HelpCategory["key"],
    id: key,
    question: t(`faq.items.${key}.question`),
  }));
  return (
    <InformationPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={CircleHelp}
      title={t("title")}
    >
      <HelpCenterExplorer
        categories={categories}
        labels={{
          categories: t("categories.title"),
          empty: t("search.empty"),
          faq: t("faq.title"),
          search: t("search.placeholder"),
          searchLabel: t("search.label"),
          soon: t("categories.soon"),
        }}
        questions={questions}
      />
      <section className="from-primary/12 via-card to-ai/10 mb-10 flex flex-col items-start justify-between gap-6 rounded-[2rem] border bg-gradient-to-br p-7 shadow-sm sm:flex-row sm:items-center sm:p-9">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("unresolved.title")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl leading-7">
            {t("unresolved.description")}
          </p>
        </div>
        <Button asChild icon={<LifeBuoy aria-hidden />} size="lg">
          <Link href="/support">{t("unresolved.action")}</Link>
        </Button>
      </section>
    </InformationPage>
  );
}
