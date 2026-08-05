import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 rounded-md border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-surface text-surface-foreground",
        success:
          "border-success/30 bg-success/8 text-foreground [&>svg]:text-success",
        warning:
          "border-warning/40 bg-warning/10 text-foreground [&>svg]:text-warning",
        info: "border-info/30 bg-info/8 text-foreground [&>svg]:text-info",
        danger:
          "border-danger/30 bg-danger/8 text-foreground [&>svg]:text-danger",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("col-start-2 leading-none font-medium", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-muted-foreground col-start-2 mt-1 leading-6",
        className,
      )}
      {...props}
    />
  );
}

export { alertVariants };
