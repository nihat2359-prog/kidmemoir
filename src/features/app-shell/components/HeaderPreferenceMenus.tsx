"use client";

import { Languages, MonitorCog } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { LanguageSwitcher } from "@/features/app-shell/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/features/app-shell/components/ThemeSwitcher";

export function HeaderPreferenceMenus() {
  const t = useTranslations("applicationShell");
  return (
    <div className="hidden items-center sm:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={t("language.openLabel")} size="sm" variant="icon">
            <Languages aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>{t("menu.language")}</DropdownMenuLabel>
          <LanguageSwitcher />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={t("theme.openLabel")} size="sm" variant="icon">
            <MonitorCog aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>{t("menu.theme")}</DropdownMenuLabel>
          <ThemeSwitcher />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
