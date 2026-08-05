import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AuthCard({ className, ...props }: ComponentProps<"section">) {
  const t = useTranslations("auth.layout");

  return (
    <section
      aria-label={t("cardAriaLabel")}
      className={cn(
        "border-border/55 bg-card/72 relative w-full overflow-hidden rounded-xl border p-6 shadow-lg backdrop-blur-2xl sm:p-8 lg:p-10",
        className,
      )}
      {...props}
    />
  );
}
