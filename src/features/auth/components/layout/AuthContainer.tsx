import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function AuthContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto grid min-h-svh w-full max-w-[90rem] items-center gap-10 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:px-10 xl:gap-20 xl:px-16",
        className,
      )}
      {...props}
    />
  );
}
