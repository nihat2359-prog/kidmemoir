import Image from "next/image";
import { Mic, Video } from "lucide-react";
import type { TimelineMedia } from "@/features/timeline/types/timeline.types";

export function TimelineMediaPreview({
  label,
  media,
}: {
  label: string;
  media: readonly TimelineMedia[];
}) {
  const photo = media.find((item) => item.mediaType === "photo");
  const video = media.find((item) => item.mediaType === "video");
  const audio = media.find((item) => item.mediaType === "audio");
  if (photo)
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
        <Image
          alt={label}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
          fill
          sizes="(min-width: 1024px) 48vw, 100vw"
          src={photo.url}
          unoptimized
        />
      </div>
    );
  if (video)
    return (
      <div className="relative overflow-hidden rounded-[1.5rem] bg-black">
        <video
          aria-label={label}
          className="aspect-video w-full object-cover"
          muted
          playsInline
          preload="metadata"
          src={video.url}
        />
        <span
          aria-hidden
          className="bg-background/80 absolute inset-0 m-auto grid size-14 place-items-center rounded-full shadow-lg backdrop-blur"
        >
          <Video className="size-6" />
        </span>
      </div>
    );
  if (audio)
    return (
      <div className="from-primary/10 to-ai/10 rounded-[1.5rem] bg-gradient-to-br p-5">
        <div
          aria-hidden
          className="flex h-20 items-center justify-center gap-1"
        >
          {Array.from({ length: 24 }, (_, index) => (
            <span
              className="bg-primary/55 w-1 rounded-full"
              key={index}
              style={{ height: `${20 + ((index * 17) % 56)}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-medium">
          <Mic aria-hidden className="size-4" />
          {label}
        </div>
      </div>
    );
  return null;
}
