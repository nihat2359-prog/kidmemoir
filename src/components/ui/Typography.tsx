import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const typographyVariants = {
  h1: "text-4xl font-semibold tracking-tight md:text-5xl",
  h2: "text-3xl font-semibold tracking-tight md:text-4xl",
  h3: "text-2xl font-semibold tracking-tight md:text-3xl",
  h4: "text-xl font-semibold tracking-tight md:text-2xl",
  bodyLarge: "text-lg leading-8",
  body: "text-base leading-7",
  caption: "text-sm leading-5 text-muted-foreground",
  small: "text-xs leading-4 text-muted-foreground",
  label: "text-sm font-medium leading-none",
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  variant?: TypographyVariant;
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  bodyLarge: "p",
  body: "p",
  caption: "p",
  small: "span",
  label: "span",
};

export function Typography({
  as,
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={cn(typographyVariants[variant], className)}
      {...props}
    />
  );
}
