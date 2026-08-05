import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  action?: ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function ErrorState({
  action,
  className,
  description,
  title,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-label={title}
      className={cn(
        "border-danger/30 bg-danger/5 flex min-h-64 flex-col items-center justify-center rounded-lg border p-6 text-center md:p-8",
        className,
      )}
    >
      <div className="bg-danger/10 text-danger mb-4 grid size-12 place-content-center rounded-full">
        <CircleAlert aria-hidden className="size-6" />
      </div>
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
