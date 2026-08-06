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
          className="ml-1 size-10 rounded-full p-0"
          variant="ghost"
        >
          <Avatar
            className="size-9 text-xs"
            imageUrl={data.profileAvatarUrl}
            label={t("account.avatarLabel", { name })}
            name={name}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[min(44rem,calc(100svh-5rem))] w-[min(23rem,calc(100vw-2rem))] overflow-y-auto p-2"
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
        <div className="mt-2">
          {menuItems.slice(0, 4).map(({ href, icon: Icon, key }) => (
            <DropdownMenuItem asChild key={key}>
              <Link href={href}>
                <Icon aria-hidden />
                {t(`menu.${key}`)}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Languages aria-hidden className="size-4" />
              {t("menu.language")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <LanguageSwitcher />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Palette aria-hidden className="size-4" />
              {t("menu.theme")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <ThemeSwitcher />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          {menuItems.slice(4).map(({ href, icon: Icon, key }) => (
            <DropdownMenuItem asChild key={key}>
              <Link href={href}>
                <Icon aria-hidden />
                {t(`menu.${key}`)}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-danger focus:bg-danger/10 focus:text-danger"
            disabled={isSigningOut}
            onSelect={logout}
          >
            <LogOut
              aria-hidden
              className={isSigningOut ? "animate-pulse" : ""}
            />
            {isSigningOut ? t("menu.signingOut") : t("menu.logout")}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
