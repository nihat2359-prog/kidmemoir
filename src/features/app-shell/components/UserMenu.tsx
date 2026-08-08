"use client";

import {
  Baby,
  CircleHelp,
  CreditCard,
  FileText,
  Languages,
  LifeBuoy,
  LockKeyhole,
  LogOut,
  Palette,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/features/app-shell/components/Avatar";
import { KidMemoirAccountCard } from "@/features/app-shell/components/KidMemoirAccountCard";
import { LanguageSwitcher } from "@/features/app-shell/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/features/app-shell/components/ThemeSwitcher";
import type { AppShellData } from "@/features/app-shell/types/appShell.types";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Link, useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

const menuItems = [
  { href: "/profile", icon: UserRound, key: "profile" },
  { href: "/children", icon: Baby, key: "children" },
  { href: "/subscription", icon: CreditCard, key: "subscription" },
  { href: "/settings", icon: Settings, key: "settings" },
  { href: "/help", icon: CircleHelp, key: "help" },
  { href: "/privacy", icon: LockKeyhole, key: "privacy" },
  { href: "/terms", icon: FileText, key: "terms" },
  { href: "/support", icon: LifeBuoy, key: "support" },
] as const;

export function UserMenu({ data }: { data: AppShellData }) {
  const t = useTranslations("applicationShell");
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const lastLogin = data.lastSignInAt
    ? new Intl.DateTimeFormat(data.locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(data.lastSignInAt))
    : null;

  async function logout() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      analytics.track("logout");
      analytics.identify(null);
      router.replace("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={t("account.openLabel")}
          className="from-primary/12 to-ai/12 ml-1 size-11 rounded-full border border-white/45 bg-gradient-to-br p-0 shadow-sm transition-[transform,box-shadow] duration-200 hover:scale-[1.03] hover:shadow-md focus-visible:ring-2 dark:border-white/10"
          variant="ghost"
        >
          <Avatar
            className="ring-background size-9.5 text-xs ring-2"
            imageUrl={data.profileAvatarUrl}
            label={t("account.avatarLabel", { name })}
            name={name}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="bg-popover/95 w-[min(24rem,calc(100vw-1.25rem))] overflow-visible rounded-[1.5rem] border-white/55 p-2.5 shadow-[0_28px_90px_-32px_rgba(15,23,42,0.48)] backdrop-blur-2xl dark:border-white/10"
      >
        <KidMemoirAccountCard
          data={data}
          labels={{
            activeChildren: t("account.activeChildren", {
              count: data.children.length,
            }),
            avatar: t("account.avatarLabel", { name }),
            lastLogin: t("account.lastLogin"),
            plan: t(`account.plans.${data.plan}`),
          }}
          lastLogin={lastLogin}
        />
        <div className="mt-2 space-y-1">
          <div className="grid grid-cols-2 gap-1">
            {menuItems.slice(0, 4).map(({ href, icon: Icon, key }) => (
              <DropdownMenuItem
                asChild
                className="group min-h-10 min-w-0 rounded-xl px-2"
                key={key}
              >
                <Link href={href}>
                  <span className="bg-muted/65 text-muted-foreground group-focus:bg-primary/12 group-focus:text-primary grid size-7 shrink-0 place-items-center rounded-lg transition-colors">
                    <Icon aria-hidden className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">
                    {t(`menu.${key}`)}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="group min-h-10 min-w-0 gap-2 rounded-xl px-2 text-xs">
                <span className="bg-muted/65 text-muted-foreground group-focus:bg-primary/12 group-focus:text-primary grid size-7 shrink-0 place-items-center rounded-lg transition-colors">
                  <Languages aria-hidden className="size-3.5" />
                </span>
                <span className="min-w-0 truncate font-medium">
                  {t("menu.language")}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48 rounded-xl p-2 shadow-xl">
                <LanguageSwitcher />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="group min-h-10 min-w-0 gap-2 rounded-xl px-2 text-xs">
                <span className="bg-muted/65 text-muted-foreground group-focus:bg-primary/12 group-focus:text-primary grid size-7 shrink-0 place-items-center rounded-lg transition-colors">
                  <Palette aria-hidden className="size-3.5" />
                </span>
                <span className="min-w-0 truncate font-medium">
                  {t("menu.theme")}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48 rounded-xl p-2 shadow-xl">
                <ThemeSwitcher />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </div>
          <DropdownMenuSeparator className="my-1.5" />
          <div className="grid grid-cols-2 gap-1">
            {menuItems.slice(4).map(({ href, icon: Icon, key }) => (
              <DropdownMenuItem
                asChild
                className="group min-h-10 min-w-0 rounded-xl px-2"
                key={key}
              >
                <Link href={href}>
                  <span className="bg-muted/65 text-muted-foreground group-focus:bg-primary/12 group-focus:text-primary grid size-7 shrink-0 place-items-center rounded-lg transition-colors">
                    <Icon aria-hidden className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">
                    {t(`menu.${key}`)}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            className="text-danger focus:bg-danger/10 focus:text-danger min-h-10 gap-2 rounded-xl px-2 text-xs font-medium"
            disabled={isSigningOut}
            onSelect={logout}
          >
            <span className="bg-danger/10 grid size-7 place-items-center rounded-lg">
              <LogOut
                aria-hidden
                className={isSigningOut ? "size-3.5 animate-pulse" : "size-3.5"}
              />
            </span>
            {isSigningOut ? t("menu.signingOut") : t("menu.logout")}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
