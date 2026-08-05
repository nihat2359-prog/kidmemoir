import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthHeaderProps = Readonly<{
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}>;

export function AuthHeader({
  className,
  description,
  eyebrow,
  title,
}: AuthHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {eyebrow ? (
        <p className="text-primary mb-3 text-sm font-medium">{eyebrow}</p>
      ) : null}
      <h1
        className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        tabIndex={-1}
      >
        {title}
      </h1>
      {description ? (
        <p className="text-muted-foreground mt-3 text-sm leading-6 text-pretty sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
