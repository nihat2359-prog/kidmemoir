import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { MemoryDetailExperience } from "@/features/memories/components/MemoryDetailExperience";
import { getMemoryDetail } from "@/features/memories/services/memoryDetailService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function MemoryEntryPage({
  params,
}: {
  params: Promise<{ eventId: string; locale: string }>;
}) {
  const { eventId, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/memories/${eventId}`);
  const detail = await getMemoryDetail(user, eventId);
  if (!detail) notFound();
  return (
    <MemoryDetailExperience detail={detail} locale={locale as AppLocale} />
  );
}
