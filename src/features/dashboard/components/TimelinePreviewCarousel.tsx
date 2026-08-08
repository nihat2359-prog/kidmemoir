"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Ellipsis,
  FileText,
  Heart,
  ImageIcon,
  Mic,
  Video,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type TimelineItem = Readonly<{
  date: string;
  description: string | null;
  hasAudio: boolean;
  hasVideo: boolean;
  id: string;
  openLabel: string;
  photoUrl: string | null;
  title: string;
}>;

const accents = [
  {
    border: "border-l-primary",
    dot: "bg-primary text-primary-foreground",
    pill: "bg-primary/10 text-primary",
  },
  {
    border: "border-l-ai",
    dot: "bg-ai text-white",
    pill: "bg-ai/10 text-ai",
  },
  {
    border: "border-l-timeline",
    dot: "bg-timeline text-white",
    pill: "bg-timeline/10 text-timeline",
  },
  {
    border: "border-l-success",
    dot: "bg-success text-white",
    pill: "bg-success/10 text-success",
  },
  {
    border: "border-l-warning",
    dot: "bg-warning text-white",
    pill: "bg-warning/10 text-warning",
  },
] as const;

export function TimelinePreviewCarousel({
  items,
  labels,
}: {
  items: readonly TimelineItem[];
  labels: Readonly<{
    audio: string;
    memory: string;
    next: string;
    photo: string;
    previous: string;
    video: string;
  }>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.min(
      Math.max(activeIndex + direction, 0),
      items.length - 1,
    );
    setActiveIndex(nextIndex);
    const target = track.children.item(nextIndex) as HTMLElement | null;
    target?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <div>
      <div
        className="relative -mx-5 snap-x snap-mandatory scroll-px-5 [scrollbar-width:none] overflow-x-auto overscroll-x-contain px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          const scroller = event.currentTarget;
          const cardWidth =
            (trackRef.current?.firstElementChild as HTMLElement | null)
              ?.offsetWidth ?? 1;
          setActiveIndex(
            Math.min(
              Math.round(scroller.scrollLeft / (cardWidth + 20)),
              items.length - 1,
            ),
          );
        }}
        onWheel={(event) => {
          const scroller = event.currentTarget;
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
          if (scroller.scrollWidth <= scroller.clientWidth) return;
          event.preventDefault();
          scroller.scrollBy({ left: event.deltaY, behavior: "auto" });
        }}
        ref={scrollerRef}
      >
        <ol className="relative flex w-max gap-5 pt-16 pb-2" ref={trackRef}>
          <svg
            aria-hidden
            className="pointer-events-none absolute top-4 left-0 h-12 w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 1000 48"
          >
            <path
              className="timeline-preview-path stroke-primary/70 motion-reduce:[animation:none]"
              d="M30 20 C95 8 135 40 205 22 S320 8 390 24 S505 40 575 21 S690 7 760 24 S875 40 970 18"
              fill="none"
              pathLength="1"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>

          {items.map((memory, index) => {
            const accent = accents[index % accents.length] ?? accents[0]!;
            const media = memory.photoUrl
              ? { icon: ImageIcon, label: labels.photo }
              : memory.hasVideo
                ? { icon: Video, label: labels.video }
                : memory.hasAudio
                  ? { icon: Mic, label: labels.audio }
                  : { icon: FileText, label: labels.memory };
            const MediaIcon = media.icon;

            return (
              <li
                className="group motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 relative w-[17rem] shrink-0 snap-start pt-7 motion-safe:duration-300 sm:w-[18rem]"
                key={memory.id}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span
                  className={cn(
                    "ring-card absolute top-[-3rem] left-1/2 z-10 grid size-11 -translate-x-1/2 place-items-center rounded-full border border-white/55 text-sm font-bold shadow-[0_6px_22px_-7px_currentColor] ring-4 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none dark:border-white/15",
                    accent.dot,
                  )}
                >
                  {index + 1}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[-0.3rem] left-1/2 h-8 -translate-x-1/2 border-l border-dashed opacity-70",
                    accent.border,
                  )}
                />

                <article
                  className={cn(
                    "from-card/98 to-muted/45 group dark:from-card/95 dark:to-muted/25 relative flex flex-col overflow-hidden rounded-[1.6rem] border border-l-2 bg-gradient-to-b shadow-[0_12px_35px_-22px_rgba(15,23,42,0.42)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1.5 hover:shadow-[0_24px_52px_-25px_rgba(15,23,42,0.52)] motion-reduce:transform-none motion-reduce:transition-none",
                    accent.border,
                  )}
                >
                  <Link
                    aria-label={memory.openLabel}
                    className="focus-visible:ring-ring absolute inset-0 z-10 rounded-[1.6rem] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                    href={`/memories/${memory.id}`}
                  />
                  {memory.photoUrl ? (
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <Image
                        alt=""
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                        fill
                        loading="lazy"
                        sizes="288px"
                        src={memory.photoUrl}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent" />
                    </div>
                  ) : memory.hasVideo ? (
                    <div className="from-timeline/20 via-primary/10 to-ai/20 relative h-40 shrink-0 overflow-hidden bg-gradient-to-br">
                      <div className="absolute inset-4 grid grid-cols-3 gap-2 opacity-45 blur-[0.5px]">
                        <span className="bg-background/55 rounded-xl" />
                        <span className="bg-background/35 rounded-xl" />
                        <span className="bg-background/50 rounded-xl" />
                      </div>
                      <span className="bg-background/85 text-primary absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full border shadow-lg backdrop-blur-md">
                        <Video aria-hidden className="size-5" />
                      </span>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent" />
                    </div>
                  ) : memory.hasAudio ? (
                    <div className="from-success/14 via-card/60 to-primary/10 relative flex h-32 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br px-7">
                      <div
                        aria-hidden
                        className="flex h-12 w-full items-center justify-center gap-1"
                      >
                        {[18, 30, 22, 42, 34, 48, 25, 38, 46, 28, 36, 20].map(
                          (height, barIndex) => (
                            <span
                              className="from-success to-primary w-1.5 rounded-full bg-gradient-to-t opacity-75"
                              key={`${memory.id}-${barIndex}`}
                              style={{ height }}
                            />
                          ),
                        )}
                      </div>
                      <span className="bg-background/85 text-success absolute grid size-10 place-items-center rounded-full border shadow-md backdrop-blur-md">
                        <Mic aria-hidden className="size-4" />
                      </span>
                    </div>
                  ) : (
                    <div className="from-primary/9 via-card/80 to-ai/8 relative h-24 shrink-0 overflow-hidden bg-gradient-to-br">
                      <div
                        aria-hidden
                        className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_30%,currentColor_0,transparent_1px)] [background-size:13px_13px] opacity-40"
                      />
                      <div className="absolute inset-x-7 top-7 space-y-2 opacity-45">
                        <span className="bg-primary/45 block h-1.5 w-3/4 rounded-full" />
                        <span className="bg-muted-foreground/35 block h-1.5 w-full rounded-full" />
                        <span className="bg-muted-foreground/25 block h-1.5 w-2/3 rounded-full" />
                      </div>
                    </div>
                  )}
                  <div className="flex min-h-0 flex-1 flex-col p-5 pb-4">
                    <h3 className="line-clamp-2 text-xl leading-7 font-bold tracking-[-0.03em]">
                      {memory.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2.5">
                      <span
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 rounded-full border border-white/45 px-2.5 text-[0.7rem] font-semibold shadow-sm backdrop-blur-md dark:border-white/10",
                          accent.pill,
                        )}
                      >
                        <MediaIcon aria-hidden className="size-3.5" />
                        {media.label}
                      </span>
                      <span className="text-muted-foreground/75 flex items-center gap-1.5 text-xs">
                        <CalendarDays aria-hidden className="size-3.5" />
                        {memory.date}
                      </span>
                    </div>
                    {memory.description ? (
                      <p className="text-muted-foreground mt-4 line-clamp-2 bg-gradient-to-b bg-clip-text text-sm leading-6">
                        {memory.description}
                      </p>
                    ) : null}
                    <div
                      aria-hidden
                      className="mt-3 flex justify-end gap-2 opacity-25 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
                    >
                      <span className="bg-background/70 grid size-8 place-items-center rounded-full border shadow-sm backdrop-blur-sm">
                        <Heart className="size-3.5" />
                      </span>
                      <span className="bg-background/70 grid size-8 place-items-center rounded-full border shadow-sm backdrop-blur-sm">
                        <Ellipsis className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          aria-label={labels.previous}
          className="border-border/70 bg-background/80 text-foreground hover:border-primary/35 hover:text-primary focus-visible:ring-ring grid size-11 place-items-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35"
          disabled={activeIndex === 0}
          onClick={() => move(-1)}
          type="button"
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>
        <div aria-hidden className="flex items-center gap-3">
          {items.map((item, index) => (
            <span
              className={cn(
                "size-2.5 rounded-full transition-[width,background-color]",
                index === activeIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/20",
              )}
              key={item.id}
            />
          ))}
        </div>
        <button
          aria-label={labels.next}
          className="border-border/70 bg-background/80 text-foreground hover:border-primary/35 hover:text-primary focus-visible:ring-ring grid size-11 place-items-center rounded-full border shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35"
          disabled={activeIndex === items.length - 1}
          onClick={() => move(1)}
          type="button"
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
