import { CircleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function DashboardError({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "dashboard.error" });
  return (
    <main className="bg-background grid min-h-svh place-items-center px-4">
      <section
        aria-labelledby="dashboard-error"
        className="border-border bg-card w-full max-w-lg rounded-3xl border p-8 text-center shadow-md"
      >
        <span className="bg-danger/10 text-danger mx-auto grid size-12 place-items-center rounded-xl">
          <CircleAlert aria-hidden className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold" id="dashboard-error">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {t("description")}
        </p>
        <Button asChild className="mt-6" fullWidth>
          <Link href="/dashboard">{t("retry")}</Link>
        </Button>
      </section>
    </main>
  );
}
