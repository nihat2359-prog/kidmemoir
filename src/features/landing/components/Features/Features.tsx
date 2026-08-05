import {
  BellRing,
  Bot,
  CalendarDays,
  FileText,
  Images,
  Mic2,
  Play,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

export function Features() {
  const t = useTranslations("landing.features");
  const cards = [
    {
      icon: CalendarDays,
      key: "timeline",
      span: "md:col-span-2 lg:col-span-7",
      preview: (
        <div className="mt-7 grid gap-2">
          <span className="bg-timeline/15 rounded-lg p-3 text-sm font-medium">
            {t("timelinePreview1")}
          </span>
          <span className="bg-ai/10 ml-8 rounded-lg p-3 text-sm font-medium">
            {t("timelinePreview2")}
          </span>
        </div>
      ),
    },
    {
      icon: Images,
      key: "photos",
      span: "lg:col-span-5",
      preview: (
        <div aria-hidden className="mt-7 grid grid-cols-3 gap-2">
          <span className="from-journal/35 h-20 rounded-lg bg-gradient-to-br to-transparent" />
          <span className="from-timeline/30 h-20 rounded-lg bg-gradient-to-br to-transparent" />
          <span className="from-ai/25 h-20 rounded-lg bg-gradient-to-br to-transparent" />
        </div>
      ),
    },
    {
      icon: Play,
      key: "videos",
      span: "lg:col-span-4",
      preview: (
        <span className="bg-primary text-primary-foreground mt-8 grid size-12 place-items-center rounded-full">
          <Play aria-hidden className="ml-0.5 size-4" fill="currentColor" />
        </span>
      ),
    },
    {
      icon: Mic2,
      key: "audio",
      span: "lg:col-span-4",
      preview: (
        <div aria-hidden className="mt-8 flex h-10 items-center gap-1">
          {[3, 7, 4, 9, 5, 8, 3, 6, 4, 7].map((h, i) => (
            <span
              className="bg-ai/60 w-1 rounded-full"
              key={i}
              style={{ height: `${h * 4}px` }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: FileText,
      key: "documents",
      span: "lg:col-span-4",
      preview: (
        <div aria-hidden className="bg-muted mt-7 space-y-2 rounded-lg p-4">
          <span className="bg-foreground/10 block h-2 w-2/3 rounded-full" />
          <span className="bg-foreground/10 block h-2 rounded-full" />
        </div>
      ),
    },
    {
      icon: BellRing,
      key: "reminders",
      span: "lg:col-span-5",
      preview: (
        <p className="bg-warning/10 mt-7 rounded-lg p-3 text-sm font-medium">
          {t("reminderPreview")}
        </p>
      ),
    },
    {
      icon: Bot,
      key: "ai",
      span: "md:col-span-2 lg:col-span-7",
      preview: (
        <p className="border-ai/20 bg-ai/8 mt-7 rounded-lg border p-4 text-sm leading-6">
          {t("aiPreview")}
        </p>
      ),
    },
    {
      icon: Search,
      key: "search",
      span: "md:col-span-2 lg:col-span-12",
      preview: (
        <div className="bg-background/70 mt-7 flex items-center gap-3 rounded-full border px-4 py-3 text-sm">
          <Search aria-hidden className="text-muted-foreground size-4" />
          {t("searchPreview")}
        </div>
      ),
    },
  ] as const;
  return (
    <section className="py-20 lg:py-28" id="features">
      <Container>
        <Reveal>
          <SectionHeading
            description={t("description")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {cards.map(({ icon: Icon, key, span, preview }, index) => (
            <Reveal className={span} delay={(index % 4) * 0.04} key={key}>
              <Card className="group border-border/55 bg-card/60 hover:border-primary/30 relative h-full min-h-64 overflow-hidden p-6 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="bg-primary/10 text-primary grid size-11 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">
                  {t(`${key}Title`)}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
                  {t(`${key}Description`)}
                </p>
                {preview}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
