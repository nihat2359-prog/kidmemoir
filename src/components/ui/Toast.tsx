"use client";

import type { ComponentProps } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

export function Toaster(props: ComponentProps<typeof Sonner>) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      {...props}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      duration={3000}
      closeButton
      icons={{
        success: <CheckCircle2 aria-hidden className="size-4" />,
        info: <Info aria-hidden className="size-4" />,
        warning: <TriangleAlert aria-hidden className="size-4" />,
        error: <CircleAlert aria-hidden className="size-4" />,
        close: <X aria-hidden className="size-4" />,
      }}
      toastOptions={{
        classNames: {
          toast: "border-border bg-popover text-popover-foreground shadow-lg",
          description: "text-muted-foreground",
          success: "border-success/30",
          info: "border-info/30",
          warning: "border-warning/40",
          error: "border-danger/30",
        },
      }}
    />
  );
}

export { toast };
