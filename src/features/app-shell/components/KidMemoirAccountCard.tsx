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
    <div className="from-primary/9 via-surface to-ai/8 relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-sm">
      <div
        aria-hidden
        className="bg-primary/10 absolute -top-10 -right-10 size-28 rounded-full blur-2xl"
      />
      <div className="relative flex items-center gap-3">
        <Avatar
          className="size-14 text-base shadow-md"
          imageUrl={data.profileAvatarUrl}
          label={labels.avatar}
          name={name}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold tracking-tight">{name}</p>
          <p className="text-muted-foreground truncate text-xs">{data.email}</p>
          <span className="bg-primary/10 text-primary mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
            <Crown aria-hidden className="size-3" />
            {labels.plan}
          </span>
        </div>
      </div>
      <div className="text-muted-foreground relative mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <span className="flex items-center gap-1.5">
          <Baby aria-hidden className="size-3.5" />
          {labels.activeChildren}
        </span>
        {lastLogin && (
          <span className="flex items-center gap-1.5 sm:justify-end">
            <Clock3 aria-hidden className="size-3.5" />
            <span className="sr-only">{labels.lastLogin}</span>
            {lastLogin}
          </span>
        )}
      </div>
    </div>
  );
}
