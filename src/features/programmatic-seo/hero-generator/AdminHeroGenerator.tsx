import { generateHeroGuideAction } from "./actions";
import { getTranslations } from "next-intl/server";

type Props = Readonly<{
  locale: "tr" | "en";
  templates: readonly Readonly<{ id: string; slug: string }>[];
  topics: readonly Readonly<{ id: string; title: string }>[];
}>;

export async function AdminHeroGenerator({ locale, templates, topics }: Props) {
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
    </main>
  );
}
