import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

type LoadingStateProps = {
  className?: string;
  count?: number;
  label?: string;
};

export function LoadingState({
  className,
  count = 3,
  label = "Loading content",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("grid gap-4", className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="bg-card rounded-lg border p-6">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
