"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { updateThemePreference } from "@/features/app-shell/actions/preferences";
import type { AppTheme } from "@/features/app-shell/types/appShell.types";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/DropdownMenu";

const themes = [
  { icon: Sun, value: "light" },
  { icon: Moon, value: "dark" },
  { icon: Laptop, value: "system" },
] as const;

export function ThemeSwitcher() {
  const t = useTranslations("applicationShell.theme");
  const { setTheme, theme = "system" } = useTheme();

  async function selectTheme(value: string) {
    const previous = theme as AppTheme;
    setTheme(value);
    try {
      await updateThemePreference(value);
    } catch {
      setTheme(previous);
    }
  }

  return (
    <DropdownMenuRadioGroup onValueChange={selectTheme} value={theme}>
      {themes.map(({ icon: Icon, value }) => (
        <DropdownMenuRadioItem key={value} value={value}>
          <Icon aria-hidden className="size-4" />
          {t(value)}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
