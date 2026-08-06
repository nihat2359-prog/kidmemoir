"use client";

import {
  Bot,
  CalendarDays,
  House,
  NotebookTabs,
  Plus,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", icon: House, key: "dashboard", primary: false },
  { href: "/events", icon: NotebookTabs, key: "memories", primary: false },
  { href: "/memories/new", icon: Plus, key: "newMemory", primary: true },
  { href: "/timeline", icon: CalendarDays, key: "timeline", primary: false },
  { href: "/ai", icon: Bot, key: "ai", primary: false },
  { href: "/profile", icon: UserRound, key: "profile", primary: false },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const t = useTranslations("applicationShell.bottomNavigation");
  return (
    <nav
      aria-label={t("ariaLabel")}
      className="border-border/70 bg-background/88 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_36px_-24px_hsl(var(--foreground)/0.35)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-17 max-w-2xl grid-cols-6 px-1">
        {tabs.map(({ href, icon: Icon, key, ...tab }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-visible:ring-ring relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-colors outline-none focus-visible:ring-2",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              href={href}
              key={key}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full transition-[color,background-color,transform]",
                  tab.primary &&
                    "bg-primary text-primary-foreground -mt-5 size-11 shadow-lg",
                  active && !tab.primary && "bg-primary/10",
                )}
              >
                <Icon
                  aria-hidden
                  className={tab.primary ? "size-5" : "size-4.5"}
                />
              </span>
              <span className="max-w-full truncate px-0.5">{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
