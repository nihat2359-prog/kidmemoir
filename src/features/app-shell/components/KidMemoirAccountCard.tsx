import { Baby, Clock3, Crown } from "lucide-react";
import type { AppShellData } from "@/features/app-shell/types/appShell.types";
import { Avatar } from "@/features/app-shell/components/Avatar";

type AccountCardProps = Readonly<{
  data: AppShellData;
  labels: Readonly<{
    activeChildren: string;
    avatar: string;
    lastLogin: string;
    plan: string;
  }>;
  lastLogin: string | null;
}>;

export function KidMemoirAccountCard({
  data,
  labels,
  lastLogin,
}: AccountCardProps) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ");
  return (
    <div className="from-primary/13 via-surface/95 to-ai/11 relative overflow-hidden rounded-[1.25rem] border border-white/55 bg-gradient-to-br p-4 shadow-md dark:border-white/10">
      <div
        aria-hidden
        className="bg-primary/10 absolute -top-10 -right-10 size-28 rounded-full blur-2xl"
      />
      <div className="relative flex items-center gap-4">
        <Avatar
          className="ring-background/65 size-14 text-base shadow-lg ring-4"
          imageUrl={data.profileAvatarUrl}
          label={labels.avatar}
          name={name}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold tracking-[-0.02em]">
            {name}
          </p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {data.email}
          </p>
          <span className="bg-primary/10 text-primary border-primary/10 mt-2.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm">
            <Crown aria-hidden className="size-3" />
            {labels.plan}
          </span>
        </div>
      </div>
      <div className="text-muted-foreground bg-background/35 relative mt-3 grid gap-1.5 rounded-xl border border-white/45 p-2.5 text-[0.68rem] sm:grid-cols-2 dark:border-white/10">
        <span className="flex items-center gap-2">
          <Baby aria-hidden className="size-3.5" />
          {labels.activeChildren}
        </span>
        {lastLogin && (
          <span className="flex items-center gap-2 sm:justify-end">
            <Clock3 aria-hidden className="size-3.5" />
            <span className="sr-only">{labels.lastLogin}</span>
            {lastLogin}
          </span>
        )}
      </div>
    </div>
  );
}
