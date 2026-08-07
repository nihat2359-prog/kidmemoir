import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getMemoryConnections } from "@/features/ai";
import { EditMemoryExperience } from "@/features/memories/components/EditMemoryExperience";
import { getCreateMemoryContext } from "@/features/memories/services/createMemoryService";
import { getEditableMemory } from "@/features/memories/services/editMemoryService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type Props = { params: Promise<{ eventId: string; locale: string }> };
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
  const [memory, connections] = await Promise.all([
    getEditableMemory(user, eventId, context.child.id),
    getMemoryConnections(user, context.child.id, eventId),
  ]);
  if (!memory) notFound();
  return (
    <EditMemoryExperience
      context={context}
      connections={connections}
      eventId={eventId}
      existingMedia={memory.media}
      initialValues={memory.initialValues}
      locale={locale as AppLocale}
    />
  );
}
