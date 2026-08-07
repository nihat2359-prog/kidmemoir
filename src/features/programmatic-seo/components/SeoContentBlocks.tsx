import type { SeoContentSection } from "@/features/programmatic-seo/types/content";

export function SeoContentBlocks({
  sections,
}: {
  sections: readonly SeoContentSection[];
}) {
  return sections.map((section) => (
    <section
      className="bg-card/65 scroll-mt-28 rounded-[1.75rem] border p-6 sm:p-9"
      id={section.id}
      key={section.id}
    >
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {section.title}
      </h2>
      {section.body?.map((paragraph) => (
        <p
          className="text-muted-foreground mt-5 max-w-3xl text-base leading-8"
          key={paragraph}
        >
          {paragraph}
        </p>
      ))}
      {section.items?.length ? (
        <ol className="mt-7 grid gap-4 sm:grid-cols-2">
          {section.items.map((item, index) => (
            <li
              className="bg-muted/55 rounded-2xl p-5"
              key={`${section.id}-${index}`}
            >
              {item.title ? (
                <h3 className="font-semibold">{item.title}</h3>
              ) : null}
              <p className="text-muted-foreground mt-2 leading-7">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  ));
}
