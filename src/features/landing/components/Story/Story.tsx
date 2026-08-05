import {
  ArrowDown,
  Brain,
  Camera,
  Clock3,
  Heart,
  Images,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

const problems = [
  [Images, "problemPhotos"],
  [Camera, "problemVideos"],
  [Clock3, "problemMemories"],
] as const;
const steps = [
  [PlusCircle, "step1Title", "step1Description"],
  [Heart, "step2Title", "step2Description"],
  [Brain, "step3Title", "step3Description"],
  [Sparkles, "step4Title", "step4Description"],
] as const;

export function Story() {
  const story = useTranslations("landing.story");
  const how = useTranslations("landing.howItWorks");
  return (
    <>
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              description={story("description")}
              eyebrow={story("eyebrow")}
              title={story("title")}
            />
          </Reveal>
          <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[0.85fr_0.15fr_1fr] lg:gap-6">
            <div className="space-y-3">
              {problems.map(([Icon, key], index) => (
                <Reveal delay={index * 0.05} key={key}>
                  <Card className="border-border/50 bg-card/55 flex items-center gap-4 p-5 backdrop-blur-xl">
                    <span className="bg-muted text-muted-foreground grid size-11 shrink-0 place-items-center rounded-lg">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <p className="text-lg font-medium text-pretty">
                      {story(key)}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <ArrowDown
                aria-hidden
                className="text-primary size-6 lg:-rotate-90"
              />
            </div>
            <Reveal delay={0.12}>
              <Card className="border-primary/20 from-primary/10 via-card/75 to-ai/10 relative flex h-full min-h-72 flex-col justify-end overflow-hidden bg-gradient-to-br p-7 shadow-md backdrop-blur-xl md:p-9">
                <div className="bg-primary/15 absolute -top-20 -right-20 size-56 rounded-full blur-3xl" />
                <span className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-lg shadow-md">
                  <Sparkles aria-hidden className="size-5" />
                </span>
                <p className="text-primary mt-8 text-sm font-semibold">
                  {story("turningPoint")}
                </p>
                <h3 className="mt-3 text-2xl leading-tight font-semibold text-balance md:text-3xl">
                  {story("solutionTitle")}
                </h3>
                <p className="text-muted-foreground mt-4 max-w-xl leading-7">
                  {story("solutionDescription")}
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-secondary/40 py-20 lg:py-28" id="how-it-works">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              description={how("description")}
              eyebrow={how("eyebrow")}
              title={how("title")}
            />
          </Reveal>
          <ol className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div
              aria-hidden
              className="from-primary/20 via-ai/25 to-timeline/20 absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r lg:block"
            />
            {steps.map(([Icon, title, description], index) => (
              <li className="relative" key={title}>
                <Reveal delay={index * 0.06}>
                  <Card className="group border-border/55 bg-card/65 hover:border-primary/30 h-full p-6 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="bg-background text-primary relative z-10 grid size-12 place-items-center rounded-full border shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <p className="text-primary mt-7 text-xs font-semibold tracking-wide uppercase">
                      {how("stepLabel", { number: index + 1 })}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{how(title)}</h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {how(description)}
                    </p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
