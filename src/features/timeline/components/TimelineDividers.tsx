export function TimelineYearDivider({ year }: { year: string }) {
  return (
    <div className="relative py-8 sm:py-12">
      <span className="text-primary/80 text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
        {year}
      </span>
      <div
        aria-hidden
        className="from-primary/30 ml-5 inline-block h-px w-[min(40vw,22rem)] bg-gradient-to-r to-transparent align-middle"
      />
    </div>
  );
}
export function TimelineDateDivider({ label }: { label: string }) {
  return (
    <h2 className="bg-background/80 sticky top-16 z-10 w-fit rounded-full border px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl">
      {label}
    </h2>
  );
}
