import type { ComponentProps, ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-(--duration-normal) ease-(--ease-standard) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
        link: "min-h-0 text-primary underline-offset-4 hover:underline",
        icon: "size-11 p-0 hover:bg-accent hover:text-accent-foreground",
        fab: "size-14 rounded-full bg-primary p-0 text-primary-foreground shadow-lg hover:bg-primary/90",
      },
      size: {
        sm: "min-h-9 px-3",
        md: "px-4 py-2",
        lg: "min-h-12 px-6 text-base",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
    loading?: boolean;
  };

export function Button({
  asChild = false,
  children,
  className,
  disabled,
  fullWidth,
  icon,
  iconPosition = "start",
  loading = false,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const leadingIcon = loading ? (
    <LoaderCircle aria-hidden className="animate-spin" />
  ) : (
    icon
  );

  return (
    <Component
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled || loading}
      {...props}
    >
      {iconPosition === "start" && leadingIcon}
      <Slottable>{children}</Slottable>
      {iconPosition === "end" && leadingIcon}
    </Component>
  );
}

export { buttonVariants };
