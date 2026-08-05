import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  loading?: boolean;
  status?: "default" | "error" | "success";
};

export function Input({
  className,
  disabled,
  loading = false,
  status = "default",
  type = "text",
  ...props
}: InputProps) {
  return (
    <span className="relative block w-full">
      <input
        type={type}
        aria-busy={loading || undefined}
        aria-invalid={status === "error" || undefined}
        disabled={disabled || loading}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 read-only:bg-muted flex min-h-11 w-full rounded-md border px-3 py-2 text-base shadow-sm transition-[border-color,box-shadow] duration-(--duration-normal) outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          loading && "pr-10",
          status === "error" &&
            "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
          status === "success" &&
            "border-success focus-visible:border-success focus-visible:ring-success/20",
          className,
        )}
        {...props}
      />
      {loading && (
        <LoaderCircle
          aria-hidden
          className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin"
        />
      )}
    </span>
  );
}
