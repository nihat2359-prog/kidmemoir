import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description?: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "bg-surface flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center md:p-8",
        className,
      )}
    >
      {icon && (
        <div className="bg-muted text-muted-foreground mb-4 grid size-12 place-content-center rounded-full">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
