"use client";

import { Bell, BellRing } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function NotificationMenu() {
  const t = useTranslations("applicationShell.notifications");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={t("openLabel")} size="sm" variant="icon">
          <Bell aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(22rem,calc(100vw-2rem))] p-2"
      >
        <DropdownMenuLabel className="text-foreground px-3 py-2 text-sm font-semibold">
          {t("title")}
        </DropdownMenuLabel>
        <div className="bg-muted/45 flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
          <span className="bg-background text-muted-foreground grid size-11 place-items-center rounded-full shadow-sm">
            <BellRing aria-hidden className="size-5" />
          </span>
          <p className="mt-4 text-sm font-semibold">{t("emptyTitle")}</p>
          <p className="text-muted-foreground mt-1 max-w-56 text-xs leading-5">
            {t("emptyDescription")}
          </p>
          <Button asChild className="mt-4" size="sm" variant="outline">
            <Link href="/memories/new">{t("emptyAction")}</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
