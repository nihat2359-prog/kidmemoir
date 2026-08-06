import type { ReactNode } from "react";
import { BottomNavigation } from "@/features/app-shell/components/BottomNavigation";
import { ThemePreferenceSync } from "@/features/app-shell/components/ThemePreferenceSync";
import { TopHeader } from "@/features/app-shell/components/TopHeader";
import type { AppShellData } from "@/features/app-shell/types/appShell.types";

export function AppShell({
  children,
  data,
}: {
  children: ReactNode;
  data: AppShellData;
}) {
  return (
    <div className="bg-background relative isolate min-h-svh">
      <ThemePreferenceSync theme={data.theme} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/8 absolute -top-64 -left-52 size-[34rem] rounded-full blur-3xl" />
        <div className="bg-ai/6 absolute top-1/3 -right-56 size-[38rem] rounded-full blur-3xl" />
        <div className="landing-background-grid absolute inset-0 opacity-15 dark:opacity-8" />
      </div>
      <TopHeader data={data} />
      <div
        className="min-h-[calc(100svh-4rem)] pb-20 lg:pb-0 [&>main>div]:pt-6 [&>main>div>nav:first-child]:hidden"
        id="application-content"
      >
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
