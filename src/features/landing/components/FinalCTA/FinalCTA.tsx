import {
  Apple,
  ArrowRight,
  Heart,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { Link } from "@/i18n/navigation";

export function FinalCTA() {
  const t = useTranslations("landing.finalCta");

  return (
    <section className="relative py-12 md:py-20 lg:py-28">
      <Container>
        <Reveal>
          <div className="relative isolate flex min-h-[36rem] items-center overflow-hidden rounded-xl bg-[oklch(0.16_0.02_265)] px-6 py-20 text-center text-white shadow-xl md:px-12 lg:min-h-[42rem]">
            <div className="bg-primary/35 absolute -top-48 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full blur-3xl" />
            <div className="bg-ai/20 absolute -bottom-56 -left-32 -z-10 size-[32rem] rounded-full blur-3xl" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.18),transparent_42%)]" />
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="mx-auto max-w-4xl">
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-white/15 bg-white/10 shadow-lg backdrop-blur-xl">
                <Heart aria-hidden className="size-6" fill="currentColor" />
              </span>
              <p className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-white/70">
                <Sparkles aria-hidden className="size-4" />
                {t("eyebrow")}
              </p>
              <Typography
                className="mx-auto mt-5 max-w-4xl text-4xl text-balance text-white sm:text-5xl lg:text-6xl"
                variant="h2"
              >
                {t("title")}
              </Typography>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-pretty text-white/70 md:text-lg">
                {t("description")}
              </p>

              <div className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  className="w-full bg-white text-black shadow-lg hover:bg-white/90 sm:w-auto"
                  size="lg"
                >
                  <Link href="/register">
                    {t("primaryButton")}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  size="lg"
                  variant="outline"
                >
                  <Link href="/login">{t("secondaryButton")}</Link>
                </Button>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-white/55">
                <ShieldCheck aria-hidden className="size-3.5" />
                {t("assurance")}
              </p>

              <div
                aria-label={t("storesAriaLabel")}
                className="mx-auto mt-10 grid max-w-md gap-3 sm:grid-cols-2"
              >
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-xl">
                  <Apple aria-hidden className="size-6" />
                  <span>
                    <span className="block text-[0.65rem] tracking-wider text-white/50 uppercase">
                      {t("comingSoon")}
                    </span>
                    <span className="text-sm font-semibold">
                      {t("appStore")}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur-xl">
                  <Play aria-hidden className="size-6" fill="currentColor" />
                  <span>
                    <span className="block text-[0.65rem] tracking-wider text-white/50 uppercase">
                      {t("comingSoon")}
                    </span>
                    <span className="text-sm font-semibold">
                      {t("googlePlay")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
