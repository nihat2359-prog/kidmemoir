import { getTranslations } from "next-intl/server";
import { ActivePageTitle } from "@/features/app-shell/components/ActivePageTitle";
import { ChildSwitcher } from "@/features/app-shell/components/ChildSwitcher";
import { HeaderPreferenceMenus } from "@/features/app-shell/components/HeaderPreferenceMenus";
import { NotificationMenu } from "@/features/app-shell/components/NotificationMenu";
import { UserMenu } from "@/features/app-shell/components/UserMenu";
import type { AppShellData } from "@/features/app-shell/types/appShell.types";
import { AuthLogo } from "@/features/auth/components/layout";

export async function TopHeader({ data }: { data: AppShellData }) {
  const t = await getTranslations({
    locale: data.locale,
    namespace: "applicationShell.header",
  });
  return (
    <header className="border-border/60 bg-background/82 supports-[backdrop-filter]:bg-background/68 sticky top-0 z-30 border-b shadow-[0_8px_30px_-24px_hsl(var(--foreground)/0.3)] backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:h-17 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AuthLogo className="[&>span:last-child]:hidden lg:[&>span:last-child]:inline" />
          <span aria-hidden className="bg-border hidden h-6 w-px lg:block" />
          <ChildSwitcher items={data.children} />
        </div>
        <h1 className="hidden text-sm font-semibold tracking-tight md:block">
          <span className="sr-only">{t("pageTitleLabel")}: </span>
          <ActivePageTitle />
        </h1>
        <div className="flex items-center justify-end gap-0.5">
          <NotificationMenu />
          <HeaderPreferenceMenus />
          <UserMenu data={data} />
        </div>
      </div>
    </header>
  );
}
