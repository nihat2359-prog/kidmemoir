"use client";

import { Check, LockKeyhole, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { CheckoutButton } from "@/features/billing/components/CheckoutButton";
import type { AppLocale } from "@/i18n/routing";

export type AiPremiumFeature =
  | "connections"
  | "development"
  | "history"
  | "monthly"
  | "search"
  | "trends"
  | "weekly"
  | "yearly";

export function AiUpgradeSheet({
  feature,
  locale,
  triggerLabel,
}: {
  feature: AiPremiumFeature;
  locale: AppLocale;
  triggerLabel?: string;
}) {
  const t = useTranslations("billing.aiUpgrade");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="md" type="button" variant="outline">
          <LockKeyhole aria-hidden className="size-4" />
          {triggerLabel ?? t("open")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-2xl rounded-t-[2rem]">
        <div className="overflow-y-auto px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerHeader className="items-center px-6 pt-5 text-center sm:px-10 sm:text-center">
            <span className="from-primary/18 to-ai/15 text-primary grid size-14 place-items-center rounded-2xl bg-gradient-to-br">
              <Sparkles aria-hidden className="size-6" />
            </span>
            <p className="text-primary mt-3 text-xs font-semibold tracking-wider uppercase">
              {t("badge")}
            </p>
            <DrawerTitle className="text-2xl sm:text-3xl">
              {t(`features.${feature}.title`)}
            </DrawerTitle>
            <DrawerDescription className="max-w-lg text-base">
              {t(`features.${feature}.description`)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-6 rounded-2xl border p-5 sm:mx-10">
            <p className="text-3xl font-semibold">{t("price")}</p>
            <p className="text-muted-foreground mt-1 text-sm">{t("billing")}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                ["stories", "search", "connections", "development"] as const
              ).map((benefit) => (
                <li className="flex items-center gap-2 text-sm" key={benefit}>
                  <Check aria-hidden className="text-success size-4" />
                  {t(`benefits.${benefit}`)}
                </li>
              ))}
            </ul>
          </div>
          <DrawerFooter className="px-6 sm:px-10">
            <CheckoutButton fullWidth label={t("upgrade")} locale={locale} />
            <DrawerClose asChild>
              <Button fullWidth type="button" variant="ghost">
                {t("later")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
