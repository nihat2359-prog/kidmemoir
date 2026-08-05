import {
  Baby,
  Camera,
  FileText,
  Footprints,
  Medal,
  Mic2,
  Play,
  School,
  Speech,
  Cake,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

export function Timeline() {
  const t = useTranslations("landing.timelineSection");
  const events = [
    [Baby, FileText, "event1"],
    [Footprints, Play, "event2"],
    [Speech, Mic2, "event3"],
    [Cake, Camera, "event4"],
    [School, Camera, "event5"],
    [Medal, Play, "event6"],
    [Camera, Camera, "event7"],
  ] as const;
  return (
    <section className="py-20 lg:py-28" id="timeline">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            description={t("description")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </Reveal>
        <Reveal className="mt-14" delay={0.08}>
          <Card className="border-border/55 bg-card/60 overflow-hidden rounded-xl shadow-lg backdrop-blur-2xl">
            <div className="border-border/60 flex items-center justify-between border-b p-5">
              <div>
                <p className="font-semibold">{t("profile")}</p>
                <p className="text-muted-foreground text-xs">{t("range")}</p>
              </div>
              <Badge variant="timeline">{t("previewLabel")}</Badge>
            </div>
            <ol className="before:bg-border relative grid gap-4 p-5 before:absolute before:top-5 before:bottom-5 before:left-9 before:w-px md:grid-cols-2 md:p-8 md:before:left-1/2 lg:grid-cols-3 lg:before:top-1/2 lg:before:right-8 lg:before:bottom-auto lg:before:left-8 lg:before:h-px lg:before:w-auto">
              {events.map(([Icon, Media, key], index) => (
                <li
                  className={
                    index === 0 || index === 3
                      ? "relative md:col-span-2 lg:col-span-1"
                      : "relative"
                  }
                  key={key}
                >
                  <Reveal delay={index * 0.04}>
                    <article className="group border-border/55 bg-background/75 hover:border-timeline/35 relative ml-8 min-h-36 rounded-xl border p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md md:ml-0">
                      <span className="bg-timeline text-timeline-foreground ring-background absolute top-5 -left-10 grid size-5 place-items-center rounded-full ring-4 md:-left-2.5 lg:top-auto lg:-left-2.5">
                        <span className="size-1.5 rounded-full bg-current" />
                      </span>
                      <div className="flex items-start justify-between">
                        <span className="bg-timeline/10 text-timeline grid size-10 place-items-center rounded-lg">
                          <Icon aria-hidden className="size-5" />
                        </span>
                        <Media
                          aria-hidden
                          className="text-muted-foreground size-4"
                        />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">
                        {t(`${key}Title`)}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {t(`${key}Meta`)}
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}
