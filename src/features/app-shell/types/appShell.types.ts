import type { AppLocale } from "@/i18n/routing";

export type AppTheme = "light" | "dark" | "system";

export type ShellChild = Readonly<{
  avatarUrl: string | null;
  firstName: string;
  id: string;
  isDefault: boolean;
  lastName: string | null;
}>;

export type AppShellData = Readonly<{
  children: readonly ShellChild[];
  email: string;
  firstName: string;
  lastName: string;
  lastSignInAt: string | null;
  locale: AppLocale;
  plan: "free" | "premium";
  profileAvatarUrl: string | null;
  theme: AppTheme;
}>;
