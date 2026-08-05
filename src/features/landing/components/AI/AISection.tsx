import {
  BellRing,
  Bot,
  Camera,
  FileText,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

export function AISection() {
  const t = useTranslations("landing.aiSection");
  const sources = [
    [Sparkles, "timelineSource"],
    [Camera, "photoSource"],
    [Play, "videoSource"],
    [FileText, "documentSource"],
    [Mic2, "audioSource"],
    [BellRing, "reminderSource"],
  ] as const;
  return (
    <section className="bg-ai/5 py-20 lg:py-28" id="ai">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              description={t("description")}
              eyebrow={t("eyebrow")}
              title={t("title")}
            />
            <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
              <ShieldCheck aria-hidden className="text-success size-4" />
              {t("secure")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="border-ai/20 bg-card/65 relative overflow-hidden rounded-xl shadow-lg backdrop-blur-2xl">
              <div className="bg-ai/10 absolute -top-24 -right-24 size-64 rounded-full blur-3xl" />
              <div className="border-border/60 flex items-center gap-3 border-b p-5">
                <span className="bg-ai text-ai-foreground grid size-10 place-items-center rounded-lg">
                  <Bot aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{t("productName")}</p>
                  <p className="text-muted-foreground text-xs">
                    {t("answerLabel")}
                  </p>
                </div>
                <Badge className="ml-auto" variant="ai">
                  {t("secure")}
                </Badge>
              </div>
              <div className="space-y-5 p-5 md:p-7">
                <div className="bg-primary text-primary-foreground ml-auto max-w-md rounded-xl rounded-br-sm px-5 py-4 text-sm shadow-sm">
                  <span className="mb-2 block text-xs opacity-75">
                    {t("questionLabel")}
                  </span>
                  {t("question")}
                </div>
                <div className="border-ai/20 bg-ai/6 max-w-2xl rounded-xl rounded-tl-sm border p-5">
                  <span className="text-ai mb-3 flex items-center gap-2 text-xs font-semibold">
                    <Sparkles aria-hidden className="size-4" />
                    {t("answerLabel")}
                  </span>
                  <p className="leading-7">{t("answer")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-3 text-xs font-medium">
                    {t("sourcesLabel")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sources.map(([Icon, key]) => (
                      <div
                        className="bg-background/60 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
                        key={key}
                      >
                        <Icon aria-hidden className="text-primary size-3.5" />
                        {t(key)}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground border-t pt-4 text-xs leading-5">
                  {t("disclaimer")}
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
