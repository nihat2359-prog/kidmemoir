import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import { getMemoryConnections, getMemoryInsight } from "@/features/ai";
import { runMemoryInsightForEvent } from "@/features/ai/services/aiWorker";
import { EditMemoryExperience } from "@/features/memories/components/EditMemoryExperience";
import { getCreateMemoryContext } from "@/features/memories/services/createMemoryService";
import { getEditableMemory } from "@/features/memories/services/editMemoryService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { reportException } from "@/lib/monitoring";

type Props = { params: Promise<{ eventId: string; locale: string }> };
export const maxDuration = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "memories.edit.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function EditMemoryPage({ params }: Props) {
  const { eventId, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/memories/${eventId}/edit`);
  const context = await getCreateMemoryContext(user);
  if (!context) redirect(`/${locale}/onboarding`);
  const memory = await getEditableMemory(user, eventId, context.child.id);
  if (!memory) notFound();

  // AI enrichment is optional presentation data. Resume the idempotent job
  // after the response so provider latency or configuration can never block
  // the core memory editing experience.
  after(async () => {
    try {
      await runMemoryInsightForEvent(eventId);
    } catch (error) {
      reportException(error, {
        eventId,
        operation: "memory_insight_on_edit",
      });
    }
  });

  const [connectionsResult, insightResult] = await Promise.allSettled([
    getMemoryConnections(user, context.child.id, eventId),
    getMemoryInsight(user, context.child.id, eventId),
  ]);
  if (connectionsResult.status === "rejected")
    reportException(connectionsResult.reason, {
      eventId,
      operation: "memory_connections_on_edit",
    });
  if (insightResult.status === "rejected")
    reportException(insightResult.reason, {
      eventId,
      operation: "memory_insight_read_on_edit",
    });
  const connections =
    connectionsResult.status === "fulfilled" ? connectionsResult.value : [];
  const insight =
    insightResult.status === "fulfilled" ? insightResult.value : null;
  return (
    <EditMemoryExperience
      context={context}
      connections={connections}
      eventId={eventId}
      existingMedia={memory.media}
      initialValues={memory.initialValues}
      insight={insight}
      locale={locale as AppLocale}
    />
  );
}
