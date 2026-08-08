import { PencilLine } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CreateMemoryForm } from "@/features/memories/components/CreateMemoryForm";
import { DeleteMemoryButton } from "@/features/memories/components/DeleteMemoryButton";
import { MemoryConnections } from "@/features/memories/components/MemoryConnections";
import { MemoryInsightCard } from "@/features/memories/components/MemoryInsightCard";
import type { CreateMemoryInput } from "@/features/memories/schemas/createMemorySchema";
import type {
  CreateMemoryContext,
  ExistingMemoryMedia,
} from "@/features/memories/types/createMemory.types";
import type { AppLocale } from "@/i18n/routing";

export async function EditMemoryExperience({
  context,
  connections,
  eventId,
  existingMedia,
  initialValues,
  insight,
  locale,
}: {
  context: CreateMemoryContext;
  connections: ReadonlyArray<{
    id: string;
    occurred_at: string;
    reason: "context" | "development" | "emotion";
    similarity: number;
    title: string;
  }>;
  eventId: string;
  existingMedia: ExistingMemoryMedia | null;
  initialValues: CreateMemoryInput;
  insight: Readonly<{
    emotion: string | null;
    importance_score: number | null;
    keywords: string[];
    memory_quote: string | null;
    short_title: string | null;
    summary: string;
  }> | null;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "memories.edit" });
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  now.setUTCDate(now.getUTCDate() + 1);
  return (
    <main className="relative min-h-svh pb-12">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="from-primary/12 via-card/70 to-ai/9 rounded-[2.5rem] border bg-gradient-to-br p-7 shadow-lg sm:p-12">
          <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
            <PencilLine aria-hidden className="size-4" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-7">
            {t("description")}
          </p>
        </header>
        <div className="mt-10 sm:mt-14">
          <CreateMemoryForm
            context={context}
            eventId={eventId}
            existingMedia={existingMedia}
            initialValues={initialValues}
            locale={locale}
            today={today}
            tomorrow={now.toISOString().slice(0, 10)}
          />
          <MemoryInsightCard
            eventId={eventId}
            insight={insight}
            locale={locale}
          />
          <MemoryConnections connections={connections} locale={locale} />
          <section className="border-danger/20 bg-danger/5 mt-12 flex flex-col gap-4 rounded-[2rem] border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="font-semibold">{t("delete.sectionTitle")}</h2>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {t("delete.sectionDescription")}
              </p>
            </div>
            <DeleteMemoryButton childId={context.child.id} eventId={eventId} />
          </section>
        </div>
      </div>
    </main>
  );
}
