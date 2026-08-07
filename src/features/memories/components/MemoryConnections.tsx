import { Link2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function MemoryConnections({
  connections,
  locale,
}: {
  connections: ReadonlyArray<{
    id: string;
    occurred_at: string;
    reason: "context" | "development" | "emotion";
    similarity: number;
    title: string;
  }>;
  locale: AppLocale;
}) {
  if (!connections.length) return null;
  const t = await getTranslations({
    locale,
    namespace: "memories.connections",
  });
  return (
    <section aria-labelledby="memory-connections-title" className="mt-12">
      <div className="flex items-center gap-3">
        <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
          <Link2 aria-hidden className="size-5" />
        </span>
        <div>
          <h2 id="memory-connections-title" className="font-semibold">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection) => (
          <Link
            className="bg-card/70 hover:border-primary/40 focus-visible:ring-ring rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
            href={`/memories/${connection.id}`}
            key={connection.id}
          >
            <p className="font-semibold">{connection.title}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(connection.occurred_at),
              )}
            </p>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {t(`reasons.${connection.reason}`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
