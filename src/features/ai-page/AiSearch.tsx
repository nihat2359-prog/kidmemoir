"use client";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { searchAiMemories } from "@/features/ai-page/actions";
import { Link } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";
type Result = {
  id: string;
  title: string;
  description: string | null;
  occurred_at: string;
  similarity: number;
};
export function AiSearch({
  childId,
  locale,
}: {
  childId: string;
  locale: "tr" | "en";
}) {
  const t = useTranslations("aiPage.search");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"premium" | "failed" | null>(null);
  const [items, setItems] = useState<Result[]>([]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    setLoading(true);
    setError(null);
    const r = await searchAiMemories({ childId, query: q });
    if (r.success) {
      setItems(r.data);
      analytics.track("ai_search_used", { result_count: r.data.length });
    } else setError(r.error === "premium" ? "premium" : "failed");
    setLoading(false);
  }
  return (
    <section className="from-ai/12 via-card to-primary/8 rounded-[2rem] border bg-gradient-to-br p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Sparkles aria-hidden className="text-ai size-5" />
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
      </div>
      <p className="text-muted-foreground mt-2">{t("description")}</p>
      <form className="mt-5 flex gap-3" onSubmit={submit} role="search">
        <Input
          aria-label={t("label")}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          value={q}
        />
        <Button icon={<Search aria-hidden />} loading={loading} type="submit">
          {t("action")}
        </Button>
      </form>
      {error && (
        <p className="text-warning mt-4 text-sm" role="alert">
          {t(`errors.${error}`)}
        </p>
      )}
      {items.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                className="bg-background/65 block rounded-2xl border p-4 transition hover:-translate-y-0.5"
                href={`/memories/${item.id}`}
                onClick={() => analytics.track("ai_insight_opened")}
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-xs">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(item.occurred_at))}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
