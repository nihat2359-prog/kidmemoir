import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import type { SeoFaqItem } from "@/features/programmatic-seo/types/content";

export function SeoFaq({
  items,
  title,
}: {
  items: readonly SeoFaqItem[];
  title: string;
}) {
  if (!items.length) return null;
  return (
    <section
      aria-labelledby="seo-faq-title"
      className="bg-card/65 rounded-[1.75rem] border p-6 sm:p-9"
    >
      <h2
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
        id="seo-faq-title"
      >
        {title}
      </h2>
      <Accordion className="mt-6" collapsible type="single">
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground leading-7">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
