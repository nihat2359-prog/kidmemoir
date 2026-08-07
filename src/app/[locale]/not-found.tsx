import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { StatusPage } from "@/components/status/StatusPage";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("statusPages.notFound");
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
      type="notFound"
    />
  );
}
