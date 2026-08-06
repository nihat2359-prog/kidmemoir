import type { Metadata } from "next";
import { LifeBuoy, Mail, MessageCircleQuestion } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { InformationPage } from "@/features/information/components/InformationPage";
import { SupportForm } from "@/features/information/components/SupportForm";
import { informationMetadata } from "@/features/information/utils/metadata";
import { routing } from "@/i18n/routing";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;
const topicKeys = ["account", "memory", "media", "billing"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "information.support.metadata",
  });
  return {
    ...informationMetadata({
      description: t("description"),
      locale,
      path: "support",
      title: t("title"),
    }),
    robots: { follow: true, index: false },
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "information.support" });
  return (
    <InformationPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={LifeBuoy}
      title={t("title")}
    >
      <div className="grid gap-6 pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] lg:items-start">
        <section className="bg-card/80 rounded-[2rem] border p-5 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">{t("formTitle")}</h2>
          <p className="text-muted-foreground mt-2 mb-7 leading-7">
            {t("formDescription")}
          </p>
          <SupportForm locale={locale} />
        </section>
        <div className="space-y-6">
          <section className="from-primary/12 via-card to-ai/8 rounded-[2rem] border bg-gradient-to-br p-6 shadow-sm sm:p-8">
            <Mail aria-hidden className="text-primary size-6" />
            <h2 className="mt-5 text-xl font-semibold">{t("email.title")}</h2>
            <p className="text-muted-foreground mt-2 leading-7">
              {t("email.description")}
            </p>
            <a
              className="text-primary mt-4 inline-block font-semibold hover:underline"
              href="mailto:hello@kidmemoir.com"
            >
              hello@kidmemoir.com
            </a>
          </section>
          <section className="bg-card/75 rounded-[2rem] border p-6 shadow-sm sm:p-8">
            <MessageCircleQuestion
              aria-hidden
              className="text-primary size-6"
            />
            <h2 className="mt-5 text-xl font-semibold">{t("topics.title")}</h2>
            <ul className="mt-5 space-y-3">
              {topicKeys.map((key) => (
                <li
                  className="text-muted-foreground flex gap-3 text-sm leading-6"
                  key={key}
                >
                  <span
                    aria-hidden
                    className="bg-primary mt-2.5 size-1.5 shrink-0 rounded-full"
                  />
                  {t(`topics.items.${key}`)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </InformationPage>
  );
}
