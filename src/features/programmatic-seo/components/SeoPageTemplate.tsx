import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/features/landing/components/shared/Brand";
import { Link } from "@/i18n/navigation";
import { RelatedSeoContent } from "@/features/programmatic-seo/components/RelatedSeoContent";
import { SeoContentBlocks } from "@/features/programmatic-seo/components/SeoContentBlocks";
import { SeoFaq } from "@/features/programmatic-seo/components/SeoFaq";
import { SeoHero } from "@/features/programmatic-seo/components/SeoHero";
import type {
  RelatedSeoPage,
  SeoPage,
} from "@/features/programmatic-seo/types/content";

export function SeoPageTemplate({
  labels,
  page,
  relatedPages,
}: {
  labels: Readonly<{ faq: string; related: string; readingTime: string }>;
  page: SeoPage;
  relatedPages: readonly RelatedSeoPage[];
}) {
  return (
    <main className="bg-background min-h-svh pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label={page.clusterTitle}
          className="flex items-center py-5 sm:py-7"
        >
          <Link href="/">
            <Brand />
          </Link>
        </nav>
        <SeoHero page={page} readingTimeLabel={labels.readingTime} />
        <article className="mx-auto mt-10 grid max-w-5xl gap-8 sm:mt-14">
          <SeoContentBlocks sections={page.content} />
          <SeoFaq items={page.faq} title={labels.faq} />
          <RelatedSeoContent pages={relatedPages} title={labels.related} />
          <section className="from-primary/15 via-card to-ai/10 rounded-[2rem] border bg-gradient-to-br p-7 text-center shadow-sm sm:p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {page.cta.title}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl leading-7">
              {page.cta.description}
            </p>
            <Button
              asChild
              className="mt-7"
              icon={<ArrowRight aria-hidden />}
              size="lg"
            >
              <Link href={page.cta.href}>{page.cta.label}</Link>
            </Button>
          </section>
        </article>
      </div>
    </main>
  );
}
