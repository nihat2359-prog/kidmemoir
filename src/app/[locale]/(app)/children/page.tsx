import type { Metadata } from "next";
import { Baby, Plus, Sparkles } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AccountPage } from "@/features/account/components/AccountPage";
import { ChildCard } from "@/features/account/components/ChildCard";
import {
  getAccountChildren,
  getAccountPlan,
} from "@/features/account/services/accountService";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "account.children.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function ChildrenPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/children`);
  const [children, plan, t] = await Promise.all([
    getAccountChildren(user),
    getAccountPlan(user),
    getTranslations({ locale, namespace: "account.children" }),
  ]);
  return (
    <AccountPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={Baby}
      title={t("title")}
    >
      <div className="mb-6 flex justify-end">
        <Button
          asChild
          icon={
            plan === "free" && children.length > 0 ? (
              <Sparkles aria-hidden />
            ) : (
              <Plus aria-hidden />
            )
          }
        >
          <Link
            href={
              plan === "free" && children.length > 0
                ? "/subscription?reason=child_limit"
                : "/children/new"
            }
          >
            {plan === "free" && children.length > 0
              ? t("addPremium")
              : t("add")}
          </Link>
        </Button>
      </div>
      {children.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard child={child} key={child.id} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/children/new">{t("emptyAction")}</Link>
            </Button>
          }
          description={t("emptyDescription")}
          icon={<Baby aria-hidden />}
          title={t("emptyTitle")}
        />
      )}
    </AccountPage>
  );
}
