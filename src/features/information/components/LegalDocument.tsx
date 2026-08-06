import { Mail } from "lucide-react";

export type LegalSection = Readonly<{
  body: readonly string[];
  id: string;
  points?: readonly string[];
  title: string;
}>;

export function LegalDocument({
  contactEmail,
  contactLabel,
  contentsLabel,
  lastUpdated,
  lastUpdatedLabel,
  sections,
}: {
  contactEmail?: string;
  contactLabel?: string;
  contentsLabel: string;
  lastUpdated: string;
  lastUpdatedLabel: string;
  sections: readonly LegalSection[];
}) {
  return (
    <div className="grid gap-8 pb-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
      <aside className="bg-card/75 rounded-3xl border p-5 shadow-sm lg:sticky lg:top-24">
        <p className="text-sm font-semibold">{contentsLabel}</p>
        <nav aria-label={contentsLabel} className="mt-4">
          <ol className="space-y-1.5">
            {sections.map(({ id, title }, index) => (
              <li key={id}>
                <a
                  className="text-muted-foreground hover:bg-primary/8 hover:text-primary focus-visible:ring-ring flex rounded-xl px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2"
                  href={`#${id}`}
                >
                  <span aria-hidden className="mr-2 opacity-60">
                    {index + 1}.
                  </span>
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <article className="bg-card/80 rounded-[2rem] border px-5 py-8 shadow-sm sm:px-10 sm:py-12 lg:px-14">
        <p className="text-muted-foreground text-sm">
          <span className="font-medium">{lastUpdatedLabel}:</span> {lastUpdated}
        </p>
        <div className="mt-10 space-y-14">
          {sections.map(({ body, id, points, title }) => (
            <section className="scroll-mt-28" id={id} key={id}>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {title}
              </h2>
              <div className="text-muted-foreground mt-5 space-y-4 text-[0.98rem] leading-8">
                {body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {points?.length ? (
                  <ul className="space-y-3 pl-1">
                    {points.map((point) => (
                      <li className="flex gap-3" key={point}>
                        <span
                          aria-hidden
                          className="bg-primary mt-3 size-1.5 shrink-0 rounded-full"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
        {contactEmail && contactLabel ? (
          <a
            className="bg-primary/8 text-primary hover:bg-primary/12 focus-visible:ring-ring mt-12 inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-medium outline-none focus-visible:ring-2"
            href={`mailto:${contactEmail}`}
          >
            <Mail aria-hidden className="size-4" />
            {contactLabel}
          </a>
        ) : null}
      </article>
    </div>
  );
}
