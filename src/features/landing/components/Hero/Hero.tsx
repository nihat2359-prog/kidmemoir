import { ArrowRight, BadgeCheck, PlayCircle, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/features/landing/components/Hero/HeroVisual";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/features/landing/components/shared/Reveal";

export function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16 lg:pt-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 xl:gap-16">
          <Reveal className="relative z-10">
            <div className="border-border/60 bg-surface/55 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-sm backdrop-blur-xl">
              <BadgeCheck aria-hidden className="text-primary size-4" />
              {t("eyebrow")}
            </div>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-balance">
              <span className="block">{t("titleBefore")}</span>
              <span className="from-primary via-ai to-timeline bg-gradient-to-r bg-clip-text text-transparent">
                {t("titleAccent")}
              </span>{" "}
              <span>{t("titleAfter")}</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty md:text-xl">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="group rounded-lg shadow-md sm:w-auto"
                fullWidth
                size="lg"
              >
                <Link href="/register">
                  {t("primaryButton")}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                asChild
                className="bg-background/45 rounded-lg backdrop-blur sm:w-auto"
                fullWidth
                size="lg"
                variant="outline"
              >
                <a href="#how-it-works">
                  <PlayCircle aria-hidden />
                  {t("secondaryButton")}
                </a>
              </Button>
            </div>
            <div className="mt-7 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:gap-6">
              <p className="text-muted-foreground flex items-center gap-2">
                <BadgeCheck aria-hidden className="text-success size-4" />
                {t("trustBadge")}
              </p>
              <div className="bg-foreground/8 hidden h-8 w-px sm:block" />
              <p className="flex items-center gap-3">
                <span className="bg-foreground text-background grid size-9 place-items-center rounded-md">
                  <Smartphone aria-hidden className="size-4" />
                </span>
                <span>
                  <span className="text-muted-foreground block text-xs">
                    {t("storesLabel")}
                  </span>
                  <span className="font-medium">{t("stores")}</span>
                </span>
              </p>
            </div>
          </Reveal>
          <Reveal className="lg:-mr-8 xl:-mr-12" delay={0.08}>
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
