import type { SVGAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = SVGAttributes<SVGSVGElement> & { label?: string };

export function Spinner({
  className,
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <LoaderCircle
        aria-hidden
        className={cn("size-5 animate-spin", className)}
        {...props}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
