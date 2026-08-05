import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = ComponentProps<"textarea"> & {
  status?: "default" | "error" | "success";
};

export function Textarea({
  className,
  status = "default",
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={status === "error" || undefined}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 read-only:bg-muted flex min-h-28 w-full resize-y rounded-md border px-3 py-2 text-base shadow-sm transition-[border-color,box-shadow] duration-(--duration-normal) outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        status === "error" &&
          "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
        status === "success" &&
          "border-success focus-visible:border-success focus-visible:ring-success/20",
        className,
      )}
      {...props}
    />
  );
}
