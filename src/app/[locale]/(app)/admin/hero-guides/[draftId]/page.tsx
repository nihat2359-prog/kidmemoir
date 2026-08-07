import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  AdminHeroPreview,
  getHeroGuideDraft,
} from "@/features/programmatic-seo/hero-generator";
import { userHasPermission } from "@/features/auth/utils/authorization";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HeroGuidePreviewPage({
  params,
}: Readonly<{ params: Promise<{ draftId: string; locale: string }> }>) {
  const { draftId, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!userHasPermission(user, "admin:write")) notFound();
  const draft = await getHeroGuideDraft(draftId);
  if (!draft) notFound();
  return (
    <AdminHeroPreview
      draftId={draft.id}
      generation={draft.generation}
      locale={locale as "tr" | "en"}
      qualityScore={draft.quality_score}
      status={draft.status}
      wordCount={draft.word_count}
    />
  );
}
