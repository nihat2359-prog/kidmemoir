import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between md:pb-8",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-primary mb-2 text-sm font-medium">{eyebrow}</div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        {description && (
          <div className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
            {description}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
