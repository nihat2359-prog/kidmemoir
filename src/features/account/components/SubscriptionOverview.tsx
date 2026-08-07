import {
  Bot,
  Check,
  Database,
  Image,
  Mic,
  Sparkles,
  Video,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import type { AccountSubscription } from "@/features/account/types/account.types";
import { CheckoutButton } from "@/features/billing/components/CheckoutButton";
import type { AppLocale } from "@/i18n/routing";

export async function SubscriptionOverview({
  billingError,
  billingStatus,
  data,
  locale,
  reason,
}: {
  billingError: string | null;
  billingStatus: string | null;
  data: AccountSubscription;
  locale: AppLocale;
  reason: "childLimit" | null;
}) {
  const t = await getTranslations({
    locale,
    namespace: "account.subscription",
  });
  const number = new Intl.NumberFormat(locale);
  const storage = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    style: "unit",
    unit: "megabyte",
  }).format(data.usage.mediaBytes / 1048576);
  const usage = [
    { icon: Bot, key: "ai", value: number.format(data.usage.aiTokens) },
    { icon: Database, key: "storage", value: storage },
    { icon: Image, key: "photos", value: number.format(data.usage.photos) },
    { icon: Video, key: "videos", value: number.format(data.usage.videos) },
    { icon: Mic, key: "audio", value: number.format(data.usage.audio) },
  ];
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const formatDate = (value: string | null) =>
    value ? date.format(new Date(value)) : t("details.unavailable");
  const details = [
    { key: "renewal", value: formatDate(data.renewsAt) },
    { key: "lastPayment", value: formatDate(data.lastPaymentAt) },
    { key: "nextPayment", value: formatDate(data.nextPaymentAt) },
    { key: "premiumStarted", value: formatDate(data.premiumStartedAt) },
  ];
  return (
    <div className="space-y-8">
      {billingError ? (
        <Alert variant="danger">
          <AlertTitle>{t("billingError.title")}</AlertTitle>
          <AlertDescription>{t("billingError.description")}</AlertDescription>
        </Alert>
      ) : null}
      {billingStatus ? (
        <Alert variant="success">
          <AlertTitle>{t("billingStatus.title")}</AlertTitle>
          <AlertDescription>{t("billingStatus.description")}</AlertDescription>
        </Alert>
      ) : null}
      {reason === "childLimit" && data.plan === "free" ? (
        <Alert variant="info">
          <Sparkles aria-hidden />
          <AlertTitle>{t("upsell.childLimit.title")}</AlertTitle>
          <AlertDescription>
            {t("upsell.childLimit.description")}
          </AlertDescription>
        </Alert>
      ) : null}
      <section className="from-primary/12 via-card/75 to-ai/10 rounded-[2rem] border bg-gradient-to-br p-6 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{t("currentPlan")}</p>
            <h2 className="mt-1 text-3xl font-semibold capitalize">
              {t(`plans.${data.plan}`)}
            </h2>
          </div>
          <Badge variant={data.plan === "premium" ? "premium" : "primary"}>
            {t(`status.${data.status}`)}
          </Badge>
        </div>
      </section>
      <section className="bg-card/75 rounded-[2rem] border p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold">{t("details.title")}</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {details.map(({ key, value }) => (
            <div className="bg-muted/45 rounded-2xl p-4" key={key}>
              <dt className="text-muted-foreground text-sm">
                {t(`details.${key}`)}
              </dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {data.providerSubscriptionId ? (
            <>
              <Button asChild>
                <a href={`/api/billing/portal?locale=${locale}&target=payment`}>
                  {t("actions.updateCard")}
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`/api/billing/portal?locale=${locale}&target=portal`}>
                  {t("actions.manage")}
                </a>
              </Button>
            </>
          ) : (
            <CheckoutButton label={t("actions.upgrade")} locale={locale} />
          )}
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {usage.map(({ icon: Icon, key, value }) => (
          <article
            className="bg-card/75 rounded-2xl border p-5 shadow-sm"
            key={key}
          >
            <Icon aria-hidden className="text-primary size-5" />
            <p className="mt-4 text-2xl font-semibold">{value}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t(`usage.${key}`)}
            </p>
          </article>
        ))}
      </section>
      <section className="bg-card/75 rounded-[2rem] border p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <Sparkles aria-hidden className="text-primary size-6" />
          <h2 className="text-2xl font-semibold">{t("premium.title")}</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {["ai", "storage", "media", "reports"].map((key) => (
            <p className="flex items-center gap-3" key={key}>
              <span className="bg-success/12 text-success grid size-7 place-items-center rounded-full">
                <Check aria-hidden className="size-4" />
              </span>
              {t(`premium.features.${key}`)}
            </p>
          ))}
        </div>
        {data.plan === "premium" ? null : (
          <CheckoutButton
            className="mt-7"
            label={t("premium.upgrade")}
            locale={locale}
          />
        )}
      </section>
    </div>
  );
}
