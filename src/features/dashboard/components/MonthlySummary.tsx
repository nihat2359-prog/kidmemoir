import { Camera, ImageIcon, Mic, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";
import type { AppLocale } from "@/i18n/routing";

const metrics = [
  { icon: ImageIcon, key: "memories", value: "memories" },
  { icon: Camera, key: "photos", value: "photos" },
  { icon: Video, key: "videos", value: "videos" },
  { icon: Mic, key: "audio", value: "audio" },
] as const;

export async function MonthlySummary({
  locale,
  summary,
}: {
  locale: AppLocale;
  summary: DashboardSummary;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.summary" });
  return (
    <DashboardCard className="h-full" label={t("ariaLabel")}>
      <div className="mb-8">
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
          {t("title")}
        </h2>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
        {metrics.map(({ icon: Icon, key, value }) => (
          <div
            className="border-border/50 border-b pb-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            key={key}
          >
            <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
              <span className="bg-muted grid size-8 place-items-center rounded-xl">
                <Icon aria-hidden className="size-3.5" />
              </span>
              {t(key)}
            </dt>
            <dd className="mt-4 text-4xl leading-none font-semibold tracking-[-0.05em] tabular-nums sm:text-5xl">
              {new Intl.NumberFormat(locale).format(summary[value])}
            </dd>
          </div>
        ))}
      </dl>
    </DashboardCard>
  );
}
