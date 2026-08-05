import { Check, Crown, Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";

const plans = [
  {
    key: "free",
    Icon: Heart,
    features: ["oneChild", "memory", "timeline", "storage", "limitedAi"],
    premium: false,
  },
  {
    key: "premium",
    Icon: Crown,
    features: [
      "multipleChildren",
      "memory",
      "timeline",
      "storage",
      "advancedAi",
    ],
    premium: true,
  },
] as const;

export function Pricing() {
  const t = useTranslations("landing.pricing");

  return (
    <section className="relative py-24 lg:py-32" id="pricing">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            description={t("description")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-5 lg:grid-cols-2">
          {plans.map(({ Icon, features, key, premium }, index) => (
            <Reveal delay={index * 0.06} key={key}>
              <Card
                className={`group relative h-full overflow-hidden rounded-xl p-6 backdrop-blur-2xl transition-[transform,border-color,box-shadow] duration-300 motion-reduce:transform-none md:p-8 ${
                  premium
                    ? "border-primary/35 bg-card/75 hover:border-primary/55 shadow-lg hover:-translate-y-1 hover:shadow-xl"
                    : "border-border/55 bg-card/55 hover:border-primary/25 hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {premium ? (
                  <div className="bg-primary/12 absolute -top-24 -right-20 size-64 rounded-full blur-3xl" />
                ) : null}

                <div className="relative flex items-start justify-between gap-4">
                  <span className="bg-background/70 text-primary grid size-12 place-items-center rounded-lg border shadow-sm">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  {premium ? (
                    <Badge variant="premium">
                      <Sparkles aria-hidden className="mr-1 size-3" />
                      {t("recommended")}
                    </Badge>
                  ) : null}
                </div>

                <div className="relative mt-7">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="text-muted-foreground mt-2 min-h-12 text-sm leading-6">
                    {t(`${key}.description`)}
                  </p>
                  <div className="mt-7 flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-tight md:text-5xl">
                      {t(`${key}.price`)}
                    </span>
                    <span className="text-muted-foreground pb-1 text-sm">
                      {t(`${key}.period`)}
                    </span>
                  </div>
                </div>

                <div className="relative my-8 grid gap-3" role="list">
                  {features.map((feature) => (
                    <div
                      className="bg-background/45 flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm"
                      key={feature}
                      role="listitem"
                    >
                      <span className="bg-success/12 text-success grid size-6 shrink-0 place-items-center rounded-full">
                        <Check aria-hidden className="size-3.5" />
                      </span>
                      {t(`features.${feature}`)}
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className={premium ? "shadow-md" : undefined}
                  fullWidth
                  size="lg"
                  variant={premium ? "primary" : "outline"}
                >
                  <Link href="/register">{t(`${key}.button`)}</Link>
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-6 max-w-5xl" delay={0.1}>
          <div className="border-border/50 bg-background/45 grid gap-4 rounded-xl border p-5 backdrop-blur-xl md:grid-cols-3 md:p-6">
            {(["privacy", "cancel", "export"] as const).map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full">
                  <Check aria-hidden className="size-4" />
                </span>
                <span className="text-sm font-medium">
                  {t(`assurances.${item}`)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
