import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Grid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-grid", className)} {...props} />;
}
