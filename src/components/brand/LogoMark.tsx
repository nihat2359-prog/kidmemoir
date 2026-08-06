import type { ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoMarkProps = Readonly<
  Omit<ComponentProps<typeof Image>, "alt" | "height" | "src" | "width"> & {
    label?: string;
  }
>;

export function LogoMark({ className, label, ...props }: LogoMarkProps) {
  return (
    <Image
      alt={label ?? ""}
      className={cn("shrink-0 object-contain", className)}
      height={392}
      priority
      src="/kidmemoir.svg"
      width={346}
      {...props}
    />
  );
}
