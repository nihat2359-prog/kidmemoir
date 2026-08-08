import { getTranslations } from "next-intl/server";
import { Camera, CloudSun, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getGreetingPeriod } from "@/features/dashboard/utils/date";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function Greeting({
  childName,
  firstName,
  locale,
}: {
  childName: string;
  firstName: string;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.greeting" });
  const period = getGreetingPeriod();
  const promptIndex = (new Date().getUTCDate() % 3) + 1;
  const PeriodIcon =
    period === "morning" ? Sun : period === "afternoon" ? CloudSun : Moon;
  return (
    <header className="max-w-3xl">
      <p className="text-primary inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase shadow-sm backdrop-blur-md sm:text-sm dark:border-white/10 dark:bg-white/5">
        <PeriodIcon aria-hidden className="size-4" />
        {t(period)}
      </p>
      <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,5.25rem)] leading-[0.94] font-semibold tracking-[-0.06em] text-balance">
        {t("title", { name: firstName })}
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
        {t(`prompts.${promptIndex}`, { name: childName })}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild className="shadow-primary/15 min-h-12 px-6 shadow-lg">
          <Link href="/memories/new">
            <Plus aria-hidden className="size-4" />
            {t("primaryAction")}
          </Link>
        </Button>
        <Button
          asChild
          className="min-h-12 border-white/55 bg-white/40 px-6 backdrop-blur-md hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          variant="outline"
        >
          <Link href="/memories/new">
            <Camera aria-hidden className="size-4" />
            {t("secondaryAction")}
          </Link>
        </Button>
      </div>
    </header>
  );
}
