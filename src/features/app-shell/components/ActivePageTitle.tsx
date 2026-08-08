"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

const titleKeys = {
  ai: "ai",
  children: "children",
  dashboard: "dashboard",
  events: "memories",
  memories: "memories",
  profile: "profile",
  reminders: "reminders",
  reports: "reports",
  settings: "settings",
  subscription: "subscription",
  timeline: "timeline",
} as const;

export function ActivePageTitle() {
  const pathname = usePathname();
  const t = useTranslations("applicationShell.pageTitles");
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const key = titleKeys[segment as keyof typeof titleKeys] ?? "dashboard";
  return <span>{t(key)}</span>;
}
