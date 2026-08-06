"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { updateLanguagePreference } from "@/features/app-shell/actions/preferences";
import { DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("applicationShell.language");

  function changeLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    void updateLanguagePreference(nextLocale).catch(() => undefined);
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <>
      {(["tr", "en"] as const).map((value) => (
        <DropdownMenuItem key={value} onSelect={() => changeLocale(value)}>
          <span className="w-5 text-center text-xs font-semibold uppercase">
            {value}
          </span>
          {t(value)}
          {locale === value && <Check aria-hidden className="ml-auto size-4" />}
        </DropdownMenuItem>
      ))}
    </>
  );
}
