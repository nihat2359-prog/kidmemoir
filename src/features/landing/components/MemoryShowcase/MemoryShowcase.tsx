import {
  BellRing,
  Bot,
  Camera,
  FileBadge,
  FileText,
  Mic2,
  Palette,
  Play,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

export function MemoryShowcase() {
  const t = useTranslations("landing.memoryShowcase");
  const items = [
    [Camera, "photo", "md:row-span-2", "from-journal/25"],
    [Play, "video", "", "from-primary/15"],
    [Mic2, "audio", "", "from-ai/20"],
    [Palette, "drawing", "md:row-span-2", "from-warning/15"],
    [FileText, "document", "", "from-info/15"],
    [FileBadge, "certificate", "md:row-span-2", "from-success/15"],
    [Bot, "aiSummary", "md:col-span-2", "from-ai/15"],
    [BellRing, "reminder", "", "from-warning/15"],
  ] as const;
  return (
    <section className="bg-secondary/40 py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            description={t("description")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </Reveal>
        <div className="mt-14 grid auto-rows-[10rem] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, key, span, tone], index) => (
            <Reveal className={span} delay={(index % 4) * 0.04} key={key}>
              <Card
                className={`group border-border/55 bg-card/60 relative h-full min-h-[10rem] overflow-hidden bg-gradient-to-br ${tone} to-card/60 hover:border-primary/30 p-6 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="bg-background/70 text-primary grid size-10 place-items-center rounded-lg border">
                  <Icon aria-hidden className="size-4" />
                </div>
                <div className="absolute right-6 bottom-6 left-6">
                  <h3 className="text-lg font-semibold text-balance">
                    {t(key)}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {t(`${key}Meta`)}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
