"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/auth";
import { userHasPermission } from "@/features/auth/utils/authorization";
import {
  createOrReuseHeroGuide,
  publishHeroGuide,
  reviewHeroGuide,
  updateHeroGuideDraft,
} from "./repository";

const generateSchema = z.object({
  locale: z.enum(["tr", "en"]),
  searchIntent: z.enum([
    "informational",
    "commercial",
    "navigational",
    "transactional",
    "comparison",
    "inspirational",
    "educational",
  ]),
  template: z.enum([
    "guide",
    "checklist",
    "faq",
    "comparison",
    "ideas",
    "knowledge",
    "tool",
    "timeline",
    "templates",
    "landing",
  ]),
  tier: z.coerce.number().int().min(1).max(3),
  topicId: z.string().uuid(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !userHasPermission(user, "admin:write"))
    throw new Error("FORBIDDEN");
  return user;
}

export async function generateHeroGuideAction(formData: FormData) {
  await requireAdmin();
  const input = generateSchema.parse(Object.fromEntries(formData));
  const result = await createOrReuseHeroGuide({
    ...input,
    tier: input.tier as 1 | 2 | 3,
  });
  redirect(
    `/${input.locale}/admin/hero-guides/${result.draftId}${result.cached ? "?cached=true" : ""}`,
  );
}

export async function reviewHeroGuideAction(formData: FormData) {
  const user = await requireAdmin();
  const draftId = z.string().uuid().parse(formData.get("draftId"));
  const action = z.enum(["approve", "reject"]).parse(formData.get("action"));
  const locale = z.enum(["tr", "en"]).parse(formData.get("locale"));
  await reviewHeroGuide(draftId, user.id, action);
  redirect(`/${locale}/admin/hero-guides/${draftId}`);
}

export async function publishHeroGuideAction(formData: FormData) {
  await requireAdmin();
  const draftId = z.string().uuid().parse(formData.get("draftId"));
  const locale = z.enum(["tr", "en"]).parse(formData.get("locale"));
  await publishHeroGuide(draftId);
  redirect(`/${locale}/admin/hero-guides/${draftId}`);
}

export async function updateHeroGuideAction(formData: FormData) {
  await requireAdmin();
  const draftId = z.string().uuid().parse(formData.get("draftId"));
  const locale = z.enum(["tr", "en"]).parse(formData.get("locale"));
  const raw = z.string().min(2).parse(formData.get("draftJson"));
  await updateHeroGuideDraft(draftId, JSON.parse(raw) as unknown);
  redirect(`/${locale}/admin/hero-guides/${draftId}`);
}
