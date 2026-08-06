import { hasLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function MemoryEntryPage({
  params,
}: {
  params: Promise<{ eventId: string; locale: string }>;
}) {
  const { eventId, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  redirect(`/${locale}/memories/${eventId}/edit`);
}
