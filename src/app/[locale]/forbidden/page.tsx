import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { StatusPage } from "@/components/status/StatusPage";
import { Link } from "@/i18n/navigation";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "statusPages.forbidden",
  });
  return {
    description: t("description"),
    robots: { follow: false, index: false },
    title: t("title"),
  };
}

export default async function ForbiddenPage() {
  const t = await getTranslations("statusPages.forbidden");
  return (
    <StatusPage
      action={
        <Button asChild size="lg">
          <Link href="/">{t("action")}</Link>
        </Button>
      }
      description={t("description")}
      eyebrow={t("eyebrow")}
      title={t("title")}
      type="forbidden"
    />
  );
}
