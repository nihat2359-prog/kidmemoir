import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function AuthFooter({ className, ...props }: ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "text-muted-foreground mt-8 text-center text-sm leading-6",
        className,
      )}
      {...props}
    />
  );
}
