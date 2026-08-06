import { ArrowLeft, CalendarHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export function TimelineHero({
  avatarLabel,
  avatarUrl,
  backLabel,
  childName,
  description,
  eyebrow,
  title,
}: {
  avatarLabel: string;
  avatarUrl: string | null;
  backLabel: string;
  childName: string;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="from-primary/13 via-card/75 to-timeline/10 relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br p-7 shadow-lg sm:p-10 lg:p-14 dark:border-white/10">
      <Button
        asChild
        className="relative z-20 mb-8 rounded-full"
        icon={<ArrowLeft aria-hidden />}
        variant="outline"
      >
        <Link href="/dashboard">{backLabel}</Link>
      </Button>
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
            <Sparkles aria-hidden className="size-4" />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95] font-semibold tracking-[-0.065em] text-balance">
            {title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            {description}
          </p>
        </div>
        <div className="bg-background/65 flex w-fit items-center gap-3 rounded-3xl border p-3 pr-5 shadow-sm backdrop-blur-xl">
          {avatarUrl ? (
            <span
              aria-label={avatarLabel}
              className="size-12 rounded-2xl bg-cover bg-center"
              role="img"
              style={{
                backgroundImage: `url(${JSON.stringify(avatarUrl).slice(1, -1)})`,
              }}
            />
          ) : (
            <span
              aria-hidden
              className="from-primary to-timeline text-primary-foreground grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-lg font-semibold"
            >
              {childName.charAt(0)}
            </span>
          )}
          <div>
            <p className="text-muted-foreground text-xs">{eyebrow}</p>
            <p className="font-semibold">{childName}</p>
          </div>
        </div>
      </div>
      <CalendarHeart
        aria-hidden
        className="text-primary/5 absolute -right-12 -bottom-20 size-72 rotate-[-8deg]"
      />
    </header>
  );
}
