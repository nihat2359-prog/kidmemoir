"use client";

import { Camera, Heart, Mic, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MemoryEntryType } from "@/features/memories/types/createMemory.types";
import { cn } from "@/lib/utils";

const types = [
  { icon: Heart, value: "memory" },
  { icon: Camera, value: "photo" },
  { icon: Video, value: "video" },
  { icon: Mic, value: "audio" },
] as const;

export function MemoryTypeSelector({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: MemoryEntryType) => void;
  value: MemoryEntryType;
}) {
  const t = useTranslations("memories.create.types");
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup">
      {types.map(({ icon: Icon, value: option }) => {
        const selected = value === option;
        return (
          <button
            aria-checked={selected}
            className={cn(
              "focus-visible:ring-ring group relative min-h-36 overflow-hidden rounded-[1.75rem] border p-5 text-left shadow-sm transition-[border-color,box-shadow,transform] duration-300 outline-none hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
              selected
                ? "border-primary/40 from-primary/14 to-ai/8 bg-gradient-to-br"
                : "bg-background/60 hover:border-primary/20",
            )}
            disabled={disabled}
            key={option}
            onClick={() => onChange(option)}
            role="radio"
            type="button"
          >
            <span
              className={cn(
                "grid size-12 place-items-center rounded-2xl transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:text-primary",
              )}
            >
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="mt-6 block font-semibold">{t(option)}</span>
            {selected && (
              <span
                aria-hidden
                className="bg-primary/10 absolute -right-10 -bottom-12 size-32 rounded-full blur-2xl"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
