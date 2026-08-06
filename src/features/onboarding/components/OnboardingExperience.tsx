import {
  ArrowRight,
  BrainCircuit,
  Camera,
  Heart,
  Images,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { AuthLogo } from "@/features/auth/components/layout";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const benefits = [
  { icon: ShieldCheck, key: "secure" },
  { icon: Images, key: "together" },
  { icon: BrainCircuit, key: "insights" },
  { icon: Heart, key: "rediscover" },
] as const;

type OnboardingExperienceProps = Readonly<{
  locale: AppLocale;
}>;

export async function OnboardingExperience({
  locale,
}: OnboardingExperienceProps) {
  const t = await getTranslations({ locale, namespace: "onboarding" });

  return (
    <main className="bg-background relative isolate min-h-svh overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/12 absolute -top-48 -left-40 size-[32rem] rounded-full blur-3xl" />
        <div className="bg-ai/10 absolute top-1/3 -right-48 size-[34rem] rounded-full blur-3xl" />
        <div className="landing-background-grid absolute inset-0 opacity-30 dark:opacity-15" />
        <div className="landing-background-noise absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" />
      </div>

      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex items-center justify-between gap-6">
          <AuthLogo />
          <div
            aria-label={t("progress.ariaLabel")}
            className="flex items-center gap-3"
            role="progressbar"
            aria-valuemax={2}
            aria-valuemin={1}
            aria-valuenow={1}
          >
            <span className="text-muted-foreground hidden text-xs font-medium sm:inline">
              {t("progress.label")}
            </span>
            <span className="bg-border h-1.5 w-20 overflow-hidden rounded-full sm:w-28">
              <span className="bg-primary block h-full w-1/2 rounded-full" />
            </span>
          </div>
        </header>

        <section
          aria-labelledby="onboarding-title"
          className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:gap-16 lg:py-16"
        >
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-primary text-sm font-semibold tracking-wide">
              {t("eyebrow")}
            </p>
            <h1
              className="mt-4 text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl"
              id="onboarding-title"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8 lg:mx-0">
              {t("description")}
            </p>

            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2 lg:mx-0">
              {benefits.map(({ icon: Icon, key }) => {
                return (
                  <li
                    className="border-border/70 bg-background/60 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 shadow-sm backdrop-blur-sm"
                    key={key}
                  >
                    <Icon
                      aria-hidden
                      className="text-primary mt-0.5 size-4 shrink-0"
                    />
                    <span>{t(`benefits.${key}`)}</span>
                  </li>
                );
              })}
            </ul>

            <Button
              asChild
              className="mt-8 h-12 w-full rounded-xl shadow-md sm:w-auto sm:min-w-48"
              icon={<ArrowRight aria-hidden />}
              iconPosition="end"
              size="lg"
            >
              <Link href="/children/new">{t("primaryAction")}</Link>
            </Button>
          </div>

          <div
            aria-label={t("illustration.ariaLabel")}
            className="relative mx-auto w-full max-w-2xl"
            role="img"
          >
            <div className="from-primary/12 via-ai/8 to-timeline/12 absolute inset-[8%] rounded-full bg-gradient-to-br blur-3xl" />
            <div className="border-border/70 bg-background/65 relative mx-auto aspect-[5/4] max-w-xl overflow-hidden rounded-3xl border p-5 shadow-lg backdrop-blur-xl sm:p-8">
              <div className="border-border/70 bg-card/85 absolute inset-x-[12%] top-[12%] rounded-2xl border p-5 shadow-md sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="from-primary to-ai text-primary-foreground grid size-11 place-items-center rounded-xl bg-gradient-to-br shadow-sm">
                    <Heart aria-hidden className="size-5" fill="currentColor" />
                  </span>
                  <div>
                    <p className="font-semibold">
                      {t("illustration.memoryTitle")}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {t("illustration.memoryMeta")}
                    </p>
                  </div>
                </div>
                <div className="bg-muted mt-5 h-2 rounded-full" />
                <div className="bg-muted mt-2 h-2 w-3/4 rounded-full" />
              </div>

              <div className="border-border/70 bg-card/90 absolute bottom-[13%] left-[8%] w-[45%] rounded-2xl border p-4 shadow-md">
                <Camera aria-hidden className="text-primary size-5" />
                <p className="mt-5 text-sm font-semibold">
                  {t("illustration.photoTitle")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t("illustration.photoMeta")}
                </p>
              </div>

              <div className="border-border/70 bg-card/90 absolute right-[7%] bottom-[9%] w-[39%] rounded-2xl border p-4 shadow-md">
                <Sparkles aria-hidden className="text-ai size-5" />
                <p className="mt-5 text-sm font-semibold">
                  {t("illustration.aiTitle")}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-5">
                  {t("illustration.aiText")}
                </p>
              </div>

              <span className="bg-background border-border absolute top-[8%] right-[5%] grid size-11 place-items-center rounded-full border shadow-sm">
                <Sparkles aria-hidden className="text-primary size-4" />
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
