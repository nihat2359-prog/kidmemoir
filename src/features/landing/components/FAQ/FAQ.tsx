import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

const faqKeys = [
  "privacy",
  "ai",
  "training",
  "free",
  "media",
  "export",
] as const;

export function FAQ() {
  const t = useTranslations("landing.faq");

  return (
    <section className="relative py-24 lg:py-32" id="faq">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                description={t("description")}
                eyebrow={t("eyebrow")}
                title={t("title")}
              />
              <div className="text-muted-foreground mt-7 flex items-center gap-3 text-sm">
                <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full">
                  <MessageCircleQuestion aria-hidden className="size-4" />
                </span>
                {t("support")}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Accordion
              aria-label={t("ariaLabel")}
              className="space-y-3"
              collapsible
              type="single"
            >
              {faqKeys.map((key, index) => (
                <AccordionItem
                  className="border-border/55 bg-card/55 data-[state=open]:border-primary/25 data-[state=open]:bg-card/75 overflow-hidden rounded-xl border px-5 shadow-sm backdrop-blur-xl transition-[background-color,border-color,box-shadow] data-[state=open]:shadow-md md:px-6"
                  key={key}
                  value={`faq-${index}`}
                >
                  <AccordionTrigger className="gap-4 py-5 text-base font-semibold md:text-lg">
                    <span className="flex items-center gap-3">
                      <HelpCircle
                        aria-hidden
                        className="text-primary size-5 shrink-0"
                      />
                      {t(`${key}.question`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pr-8 pb-6 pl-8 text-sm md:text-base">
                    {t(`${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
