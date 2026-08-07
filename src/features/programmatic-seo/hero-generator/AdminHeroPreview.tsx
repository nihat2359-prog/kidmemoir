import {
  publishHeroGuideAction,
  reviewHeroGuideAction,
  updateHeroGuideAction,
} from "./actions";
import { getTranslations } from "next-intl/server";
import type { HeroGuideGeneration } from "./types";

type Props = Readonly<{
  draftId: string;
  generation: HeroGuideGeneration;
  locale: "tr" | "en";
  qualityScore: number;
  status: string;
  wordCount: number;
}>;

export async function AdminHeroPreview({
  draftId,
  generation,
  locale,
  qualityScore,
  status,
  wordCount,
}: Props) {
  const t = await getTranslations("heroGenerator");
  const guide = generation.generated;
  const statusLabel = t(
    `statuses.${status as "draft" | "needs_review" | "approved" | "published" | "archived"}`,
  );
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-border/70 bg-card/80 sticky top-20 z-20 mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm backdrop-blur-xl">
        <div>
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            {statusLabel} · {wordCount} {t("words")} ·{" "}
            {generation.analytics.totalTokens} {t("tokens")} · $
            {generation.analytics.estimatedCost.toFixed(4)} ·{" "}
            {(generation.analytics.durationMs / 1000).toFixed(1)}s
          </p>
          <h1 className="font-semibold">{guide.metaTitle}</h1>
          <p className="text-sm text-emerald-600">
            {t("quality")} {qualityScore}/100
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["draft", "needs_review"].includes(status) && (
            <form action={reviewHeroGuideAction}>
              <input name="draftId" type="hidden" value={draftId} />
              <input name="locale" type="hidden" value={locale} />
              <button
                className="border-border rounded-xl border px-4 py-2 text-sm"
                name="action"
                value="reject"
              >
                {t("reject")}
              </button>
              <button
                className="bg-primary text-primary-foreground ml-2 rounded-xl px-4 py-2 text-sm"
                name="action"
                value="approve"
              >
                {t("approve")}
              </button>
            </form>
          )}
          {status === "approved" && (
            <form action={publishHeroGuideAction}>
              <input name="draftId" type="hidden" value={draftId} />
              <input name="locale" type="hidden" value={locale} />
              <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                {t("publish")}
              </button>
            </form>
          )}
        </div>
      </header>
      <article className="border-border/60 bg-card overflow-hidden rounded-[2rem] border shadow-sm">
        <section className="from-primary/15 via-background to-accent/10 bg-gradient-to-br px-6 py-16 text-center sm:px-12">
          <p className="text-primary text-sm font-semibold">
            {guide.hero.eyebrow}
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {guide.hero.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
            {guide.hero.description}
          </p>
        </section>
        <div className="mx-auto max-w-3xl space-y-14 px-6 py-14 sm:px-10">
          <aside className="bg-muted/60 rounded-2xl p-6">
            <h3 className="font-semibold">{t("quickAnswer")}</h3>
            <p className="mt-3 leading-7">{guide.quickAnswer}</p>
          </aside>
          {guide.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {section.heading}
              </h2>
              <div className="text-muted-foreground mt-5 space-y-4 leading-8">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <section>
            <h2 className="text-3xl font-semibold">{t("faq")}</h2>
            <div className="mt-6 space-y-5">
              {guide.faq.map((item) => (
                <details
                  className="border-border rounded-xl border p-4"
                  key={item.question}
                >
                  <summary className="cursor-pointer font-medium">
                    {item.question}
                  </summary>
                  <p className="text-muted-foreground mt-3 leading-7">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
          <aside className="bg-primary text-primary-foreground rounded-3xl p-8">
            <h2 className="text-2xl font-semibold">{guide.cta.title}</h2>
            <p className="mt-3 opacity-85">{guide.cta.description}</p>
            <span className="mt-6 inline-flex rounded-xl bg-white/15 px-4 py-2 font-semibold">
              {guide.cta.label}
            </span>
          </aside>
        </div>
      </article>
      {["draft", "needs_review"].includes(status) && (
        <details className="border-border bg-card mt-8 rounded-2xl border p-5">
          <summary className="cursor-pointer font-semibold">
            {t("editDraft")}
          </summary>
          <form action={updateHeroGuideAction} className="mt-5 grid gap-4">
            <input name="draftId" type="hidden" value={draftId} />
            <input name="locale" type="hidden" value={locale} />
            <label className="grid gap-2 text-sm font-medium">
              {t("structuredContent")}
              <textarea
                className="border-input bg-background min-h-[32rem] rounded-xl border p-4 font-mono text-xs leading-6"
                defaultValue={JSON.stringify(guide, null, 2)}
                name="draftJson"
                spellCheck={false}
              />
            </label>
            <button className="bg-primary text-primary-foreground justify-self-start rounded-xl px-5 py-3 font-semibold">
              {t("save")}
            </button>
          </form>
        </details>
      )}
    </main>
  );
}
