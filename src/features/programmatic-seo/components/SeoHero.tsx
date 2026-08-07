import Image from "next/image";
import type { SeoPage } from "@/features/programmatic-seo/types/content";

export function SeoHero({
  page,
  readingTimeLabel,
}: {
  page: SeoPage;
  readingTimeLabel: string;
}) {
  return (
    <header className="bg-card/80 relative overflow-hidden rounded-[2rem] border p-6 shadow-sm sm:p-10 lg:p-14">
      <div
        aria-hidden
        className="from-primary/12 to-ai/10 absolute inset-0 bg-gradient-to-br via-transparent"
      />
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.72fr)] lg:items-center">
        <div>
          {page.hero.eyebrow ? (
            <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
              {page.hero.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
            {page.hero.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            {page.hero.description}
          </p>
          <p className="text-muted-foreground mt-6 text-sm">
            {readingTimeLabel}
          </p>
        </div>
        {page.hero.image ? (
          <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border">
            <Image
              alt={page.hero.image.alt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 38vw"
              src={page.hero.image.url}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
