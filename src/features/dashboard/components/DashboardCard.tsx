import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "border-border/55 bg-card/72 rounded-[2rem] border p-6 shadow-sm backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 motion-reduce:transition-none sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
