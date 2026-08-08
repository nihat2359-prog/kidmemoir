import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { RelatedSeoPage } from "@/features/programmatic-seo/types/content";

export function RelatedSeoContent({
  pages,
  title,
}: {
  pages: readonly RelatedSeoPage[];
  title: string;
}) {
  if (!pages.length) return null;
  return (
    <section aria-labelledby="related-seo-title">
      <h2
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
        id="related-seo-title"
      >
        {title}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <Link
            className="group bg-card/65 focus-visible:ring-ring rounded-[1.5rem] border p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
            data-analytics-destination="related_guide"
            data-analytics-event="guide_internal_link_clicked"
            href={`/${page.category}/${page.slugPath.join("/")}`}
            key={page.id}
          >
            <span className="flex items-start justify-between gap-4">
              <span className="font-semibold">{page.title}</span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
            <span className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-6">
              {page.excerpt}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
