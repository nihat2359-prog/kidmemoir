import type { ButtonHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onRemove?: () => void;
  removeLabel?: string;
  trailingIcon?: ReactNode;
};

export function Chip({
  children,
  className,
  onRemove,
  removeLabel = "Remove",
  trailingIcon,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "bg-background text-foreground inline-flex min-h-8 items-center gap-1 rounded-full border px-3 text-sm",
        className,
      )}
    >
      <button
        type={type}
        className="outline-none focus-visible:underline"
        {...props}
      >
        {children}
      </button>
      {trailingIcon}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full p-0.5 outline-none focus-visible:ring-2"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      )}
    </span>
  );
}
