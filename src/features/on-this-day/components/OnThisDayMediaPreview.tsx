import Image from "next/image";
import { Mic, Play } from "lucide-react";
import type { OnThisDayMemory } from "@/features/on-this-day/types/onThisDay.types";

export function OnThisDayMediaPreview({
  label,
  media,
}: {
  label: string;
  media: NonNullable<OnThisDayMemory["media"]>;
}) {
  if (media.type === "photo")
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
        <Image
          alt={label}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          src={media.url}
        />
      </div>
    );
  if (media.type === "video")
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] bg-black">
        <video
          aria-label={label}
          className="aspect-video w-full object-cover"
          muted
          playsInline
          preload="metadata"
          src={media.url}
        />
        <span
          aria-hidden
          className="bg-background/85 absolute inset-0 m-auto grid size-14 place-items-center rounded-full shadow-lg backdrop-blur"
        >
          <Play className="size-5 translate-x-px" fill="currentColor" />
        </span>
      </div>
    );
  return (
    <div className="from-primary/12 via-background/80 to-ai/10 rounded-[1.75rem] bg-gradient-to-br p-6">
      <div aria-hidden className="flex h-24 items-center justify-center gap-1">
        {Array.from({ length: 28 }, (_, index) => (
          <span
            className="bg-primary/55 w-1 rounded-full"
            key={index}
            style={{ height: `${18 + ((index * 19) % 68)}%` }}
          />
        ))}
      </div>
      <div className="text-primary mt-3 flex items-center gap-2 text-sm font-semibold">
        <Mic aria-hidden className="size-4" />
        {label}
      </div>
    </div>
  );
}
