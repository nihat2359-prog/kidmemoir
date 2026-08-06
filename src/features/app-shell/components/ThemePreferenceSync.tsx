"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import type { AppTheme } from "@/features/app-shell/types/appShell.types";

export function ThemePreferenceSync({ theme }: { theme: AppTheme }) {
  const { setTheme } = useTheme();
  useEffect(() => setTheme(theme), [setTheme, theme]);
  return null;
}
