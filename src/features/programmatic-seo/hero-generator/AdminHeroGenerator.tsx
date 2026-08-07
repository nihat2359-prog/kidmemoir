import { generateHeroGuideAction } from "./actions";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = Readonly<{
  drafts: readonly Readonly<{
    id: string;
    quality_score: number;
    status: string;
    title: string | null;
    updated_at: string;
  }>[];
  locale: "tr" | "en";
  templates: readonly Readonly<{ id: string; slug: string }>[];
  topics: readonly Readonly<{ id: string; title: string }>[];
}>;

export async function AdminHeroGenerator({
  drafts,
  locale,
  templates,
  topics,
}: Props) {
  const t = await getTranslations("heroGenerator");
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <p className="text-primary text-sm font-semibold">{t("eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-7">
          {t("description")}
        </p>
      </header>
      <form
        action={generateHeroGuideAction}
        className="border-border/70 bg-card/80 grid gap-6 rounded-3xl border p-6 shadow-sm backdrop-blur-xl md:grid-cols-2"
      >
        <input name="locale" type="hidden" value={locale} />
        <label className="grid gap-2 text-sm font-medium">
          {t("topic")}
          <select
            className="border-input bg-background h-11 rounded-xl border px-3"
            name="topicId"
            required
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("template")}
          <select
            className="border-input bg-background h-11 rounded-xl border px-3"
            name="template"
            defaultValue="guide"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.slug}>
                {template.slug}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("tier")}
          <select
            className="border-input bg-background h-11 rounded-xl border px-3"
            name="tier"
            defaultValue="1"
          >
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("searchIntent")}
          <select
            className="border-input bg-background h-11 rounded-xl border px-3"
            name="searchIntent"
            defaultValue="informational"
          >
            <option value="informational">{t("intents.informational")}</option>
            <option value="commercial">{t("intents.commercial")}</option>
            <option value="comparison">{t("intents.comparison")}</option>
            <option value="inspirational">{t("intents.inspirational")}</option>
            <option value="educational">{t("intents.educational")}</option>
            <option value="transactional">{t("intents.transactional")}</option>
            <option value="navigational">{t("intents.navigational")}</option>
          </select>
        </label>
        <button
          className="bg-primary text-primary-foreground focus-visible:ring-ring col-span-full min-h-12 rounded-xl px-6 font-semibold shadow-sm transition hover:brightness-105 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
          disabled={!topics.length || !templates.length}
          type="submit"
        >
          {t("generate")}
        </button>
      </form>
      <section className="mt-10" aria-labelledby="hero-guide-drafts">
        <h2 className="text-2xl font-semibold" id="hero-guide-drafts">
          {t("drafts")}
        </h2>
        <div className="mt-5 grid gap-3">
          {drafts.map((draft) => (
            <Link
              className="border-border bg-card hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-2xl border p-5 transition focus-visible:ring-2 focus-visible:outline-none"
              href={`/admin/hero-guides/${draft.id}`}
              key={draft.id}
            >
              <span>
                <span className="block font-semibold">
                  {draft.title ?? t("untitled")}
                </span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {t(
                    `statuses.${draft.status as "draft" | "needs_review" | "approved" | "published"}`,
                  )}
                </span>
              </span>
              <span className="text-sm font-semibold">
                {draft.quality_score}/100
              </span>
            </Link>
          ))}
          {!drafts.length ? (
            <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-sm">
              {t("noDrafts")}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
