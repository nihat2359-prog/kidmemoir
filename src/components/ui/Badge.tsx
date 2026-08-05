import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        primary: "bg-primary/12 text-primary",
        success: "bg-success/12 text-success",
        warning: "bg-warning/16 text-warning-foreground",
        danger: "bg-danger/12 text-danger",
        info: "bg-info/12 text-info",
        premium: "bg-warning/16 text-warning-foreground",
        ai: "bg-ai/12 text-ai",
        journal: "bg-journal/12 text-journal",
        timeline: "bg-timeline/12 text-timeline",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
