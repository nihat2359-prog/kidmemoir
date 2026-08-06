import { Check, Minus, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const featureKeys = [
  "children",
  "storage",
  "memories",
  "media",
  "timeline",
  "ai",
  "reports",
] as const;

export async function PricingExperience() {
  const t = await getTranslations("billing.pricing");
  return (
    <div className="space-y-16 pb-12">
      <section aria-labelledby="plans-title">
        <h2 className="sr-only" id="plans-title">
          {t("plansTitle")}
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="bg-card/80 rounded-[2rem] border p-7 shadow-sm sm:p-9">
            <p className="text-muted-foreground text-sm font-medium">
              {t("free.eyebrow")}
            </p>
            <h3 className="mt-3 text-3xl font-semibold">{t("free.name")}</h3>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight">
                {t("free.price")}
              </span>
              <span className="text-muted-foreground pb-1">
                {t("free.period")}
              </span>
            </div>
            <p className="text-muted-foreground mt-5 leading-7">
              {t("free.description")}
            </p>
            <Button
              asChild
              className="mt-8"
              fullWidth
              size="lg"
              variant="outline"
            >
              <Link href="/register">{t("free.action")}</Link>
            </Button>
          </article>
          <article className="from-primary/14 via-card to-ai/12 border-primary/25 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-7 shadow-lg sm:p-9">
            <div
              aria-hidden
              className="bg-primary/15 absolute -top-24 -right-24 size-56 rounded-full blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-primary text-sm font-semibold">
                  {t("premium.eyebrow")}
                </p>
                <Badge variant="premium">{t("recommended")}</Badge>
              </div>
              <h3 className="mt-3 text-3xl font-semibold">
                {t("premium.name")}
              </h3>
              <p className="mt-6 text-2xl font-semibold">
                {t("premium.priceLabel")}
              </p>
              <p className="text-muted-foreground mt-5 leading-7">
                {t("premium.description")}
              </p>
              <Button
                className="mt-8"
                disabled
                fullWidth
                icon={<Sparkles aria-hidden />}
                size="lg"
                type="button"
              >
                {t("premium.action")}
              </Button>
              <p className="text-muted-foreground mt-3 text-center text-xs">
                {t("premium.checkoutNote")}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="comparison-title">
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            {t("comparison.eyebrow")}
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            id="comparison-title"
          >
            {t("comparison.title")}
          </h2>
        </div>
        <div className="bg-card/80 mt-8 overflow-x-auto rounded-[2rem] border shadow-sm">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only">{t("comparison.caption")}</caption>
            <thead>
              <tr className="border-b">
                <th className="p-5 text-sm font-semibold sm:p-6" scope="col">
                  {t("comparison.feature")}
                </th>
                <th className="p-5 text-sm font-semibold sm:p-6" scope="col">
                  {t("free.name")}
                </th>
                <th
                  className="text-primary p-5 text-sm font-semibold sm:p-6"
                  scope="col"
                >
                  {t("premium.name")}
                </th>
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key) => (
                <tr className="border-b last:border-0" key={key}>
                  <th className="p-5 text-sm font-medium sm:p-6" scope="row">
                    {t(`features.${key}.label`)}
                  </th>
                  <PlanValue
                    available={
                      t.raw(`features.${key}.freeAvailable`) as boolean
                    }
                    value={t(`features.${key}.free`)}
                  />
                  <PlanValue
                    available={
                      t.raw(`features.${key}.premiumAvailable`) as boolean
                    }
                    premium
                    value={t(`features.${key}.premium`)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PlanValue({
  available,
  premium = false,
  value,
}: {
  available: boolean;
  premium?: boolean;
  value: string;
}) {
  const Icon = available ? Check : Minus;
  return (
    <td className="p-5 sm:p-6">
      <span className="flex items-center gap-2 text-sm">
        <span
          className={
            premium && available
              ? "bg-primary/12 text-primary grid size-6 place-items-center rounded-full"
              : "bg-muted text-muted-foreground grid size-6 place-items-center rounded-full"
          }
        >
          <Icon aria-hidden className="size-3.5" />
        </span>
        {value}
      </span>
    </td>
  );
}
