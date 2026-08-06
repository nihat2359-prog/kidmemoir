import type { LucideIcon } from "lucide-react";

export function DashboardEmptyState({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="from-muted/45 via-background/35 to-primary/5 relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed bg-gradient-to-br px-6 py-12 text-center">
      <span className="bg-background text-primary grid size-14 place-items-center rounded-2xl border shadow-sm">
        <Icon aria-hidden className="size-6" />
      </span>
      <h3 className="mt-5 text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6 text-pretty">
        {description}
      </p>
      <div
        aria-hidden
        className="bg-primary/8 absolute -right-12 -bottom-16 size-40 rounded-full blur-3xl"
      />
    </div>
  );
}
