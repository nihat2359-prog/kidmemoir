import "server-only";

import { createHash } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { countSeoWords } from "@/features/programmatic-seo/schemas/contentSchema";
import type { AppLocale } from "@/i18n/routing";
import type { Json } from "@/types/database.types";
import { generateHeroGuide, getHeroGuideInputHash } from "./generator";
import { evaluateHeroGuide } from "./quality";
import { SeoQualityGateError } from "./qualityGateError";
import { parseGeneratedHeroGuide } from "./schema";
import {
  HERO_GUIDE_PROMPT_VERSION,
  type HeroGuideGeneration,
  type HeroGuideInput,
} from "./types";

const json = (value: unknown) => JSON.parse(JSON.stringify(value)) as Json;
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

export async function listHeroGeneratorOptions(locale: AppLocale) {
  const db = createAdminClient();
  const [topics, templates] = await Promise.all([
    db
      .from("seo_topics")
      .select("id,title,slug,description,locale")
      .eq("locale", locale)
      .in("status", ["draft", "published"])
      .order("title"),
    db
      .from("seo_templates")
      .select("id,slug,schema_type")
      .eq("status", "active")
      .order("slug"),
  ]);
  if (topics.error || templates.error)
    throw new Error("SEO_GENERATOR_OPTIONS_UNAVAILABLE");
  return { templates: templates.data, topics: topics.data };
}

export async function listHeroGuideDrafts(locale: AppLocale) {
  const db = createAdminClient();
  const result = await db
    .from("seo_content_drafts")
    .select("id,title,status,quality_score,updated_at")
    .eq("locale", locale)
    .in("status", ["draft", "needs_review", "approved", "published"])
    .order("updated_at", { ascending: false })
    .limit(100);
  if (result.error) throw new Error("SEO_DRAFT_LIST_UNAVAILABLE");
  return result.data;
}

export async function createOrReuseHeroGuide(input: HeroGuideInput) {
  const db = createAdminClient();
  const template = await db
    .from("seo_templates")
    .select("id,slug")
    .eq("slug", input.template)
    .eq("status", "active")
    .single();
  const topic = await db
    .from("seo_topics")
    .select("id,title,slug,description,cluster_id,locale")
    .eq("id", input.topicId)
    .eq("locale", input.locale)
    .in("status", ["draft", "published"])
    .single();
  if (template.error || topic.error)
    throw new Error("SEO_GENERATOR_INPUT_INVALID");
  const publishedDraft = await db
    .from("seo_content_drafts")
    .select("id")
    .eq("topic_id", input.topicId)
    .eq("locale", input.locale)
    .eq("template_id", template.data.id)
    .eq("status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (publishedDraft.error) throw new Error("SEO_DRAFT_LOOKUP_FAILED");
  if (publishedDraft.data)
    return { cached: true, draftId: publishedDraft.data.id };
  const cluster = await db
    .from("seo_clusters")
    .select("category")
    .eq("id", topic.data.cluster_id)
    .single();
  if (cluster.error) throw new Error("SEO_GENERATOR_INPUT_INVALID");

  const relationsForPrompt = await db
    .from("seo_topic_relations")
    .select("target_topic_id,semantic_score")
    .eq("source_topic_id", input.topicId)
    .order("semantic_score", { ascending: false })
    .limit(10);
  const relatedIds = (relationsForPrompt.data ?? []).map(
    (item) => item.target_topic_id,
  );
  const relatedTopics =
    relatedIds.length >= 5
      ? await db.from("seo_topics").select("id,title").in("id", relatedIds)
      : await db
          .from("seo_topics")
          .select("id,title")
          .eq("locale", input.locale)
          .in("status", ["draft", "published"])
          .neq("id", input.topicId)
          .order("title")
          .limit(30);
  const topicContext = { ...topic.data, category: cluster.data.category };
  const inputHash = getHeroGuideInputHash(
    input,
    topicContext,
    relatedTopics.data ?? [],
  );
  const cached = await db
    .from("seo_content_drafts")
    .select("id")
    .eq("topic_id", input.topicId)
    .eq("locale", input.locale)
    .eq("template_id", template.data.id)
    .eq("prompt_version", HERO_GUIDE_PROMPT_VERSION)
    .contains("outline", [{ inputHash }])
    .in("status", ["draft", "needs_review", "approved", "published"])
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (cached.data) return { cached: true, draftId: cached.data.id };
  const generation = await generateHeroGuide(
    input,
    topicContext,
    relatedTopics.data ?? [],
  );
  const contentHash = hash(generation.generated);
  const [duplicate, cannibalization] = await Promise.all([
    db
      .from("seo_content_drafts")
      .select("id", { count: "exact", head: true })
      .eq("content_hash", contentHash),
    db
      .from("seo_pages")
      .select("id", { count: "exact", head: true })
      .eq("locale", input.locale)
      .eq("slug", generation.generated.slug)
      .eq("status", "published"),
  ]);
  const quality = evaluateHeroGuide(
    generation.generated,
    Boolean(duplicate.count),
    Boolean(cannibalization.count),
    input.template,
  );
  if (!quality.publishable || quality.score < 85)
    throw new SeoQualityGateError(quality.score, generation.analytics);

  const latest = await db
    .from("seo_content_drafts")
    .select("version")
    .eq("topic_id", input.topicId)
    .eq("locale", input.locale)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const inserted = await db
    .from("seo_content_drafts")
    .insert({
      content_hash: contentHash,
      generated_at: new Date().toISOString(),
      locale: input.locale,
      model: generation.analytics.model,
      outline: json([generation]),
      primary_keyword: topic.data.title,
      prompt_version: generation.promptVersion,
      quality_score: quality.score,
      seo_description: generation.generated.metaDescription,
      seo_title: generation.generated.metaTitle,
      status: "draft",
      template_id: template.data.id,
      title: generation.generated.hero.title,
      topic_id: input.topicId,
      version: (latest.data?.version ?? 0) + 1,
      word_count: quality.wordCount,
    })
    .select("id")
    .single();
  if (inserted.error) throw new Error("SEO_DRAFT_CREATE_FAILED");
  try {
    await persistDraftChildren(inserted.data.id, generation, quality.results);
  } catch (error) {
    await db.from("seo_content_drafts").delete().eq("id", inserted.data.id);
    throw error;
  }
  return { cached: false, draftId: inserted.data.id };
}

export async function previewHeroGuide(input: HeroGuideInput) {
  const db = createAdminClient();
  const [template, topic] = await Promise.all([
    db
      .from("seo_templates")
      .select("id")
      .eq("slug", input.template)
      .eq("status", "active")
      .single(),
    db
      .from("seo_topics")
      .select("id,title,slug,description,cluster_id,locale")
      .eq("id", input.topicId)
      .eq("locale", input.locale)
      .in("status", ["draft", "published"])
      .single(),
  ]);
  if (template.error || topic.error)
    throw new Error("SEO_GENERATOR_INPUT_INVALID");
  const cluster = await db
    .from("seo_clusters")
    .select("category")
    .eq("id", topic.data.cluster_id)
    .single();
  if (cluster.error) throw new Error("SEO_GENERATOR_INPUT_INVALID");
  const relations = await db
    .from("seo_topic_relations")
    .select("target_topic_id,semantic_score")
    .eq("source_topic_id", input.topicId)
    .order("semantic_score", { ascending: false })
    .limit(10);
  const relatedIds = (relations.data ?? []).map((item) => item.target_topic_id);
  const relatedTopics =
    relatedIds.length >= 5
      ? await db.from("seo_topics").select("id,title").in("id", relatedIds)
      : await db
          .from("seo_topics")
          .select("id,title")
          .eq("locale", input.locale)
          .in("status", ["draft", "published"])
          .neq("id", input.topicId)
          .order("title")
          .limit(30);
  const topicContext = { ...topic.data, category: cluster.data.category };
  const inputHash = getHeroGuideInputHash(
    input,
    topicContext,
    relatedTopics.data ?? [],
  );
  const cached = await db
    .from("seo_content_drafts")
    .select("id")
    .eq("topic_id", input.topicId)
    .eq("locale", input.locale)
    .eq("template_id", template.data.id)
    .eq("prompt_version", HERO_GUIDE_PROMPT_VERSION)
    .contains("outline", [{ inputHash }])
    .in("status", ["draft", "needs_review", "approved", "published"])
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (cached.data) {
    const draft = await getHeroGuideDraft(cached.data.id);
    if (draft && draft.quality_score >= 85)
      return {
        cached: true,
        createdAt: draft.created_at,
        draftId: draft.id,
        generation: draft.generation,
        qualityScore: draft.quality_score,
      };
  }
  const generation = await generateHeroGuide(
    input,
    topicContext,
    relatedTopics.data ?? [],
  );
  const contentHash = hash(generation.generated);
  const [duplicate, cannibalization] = await Promise.all([
    db
      .from("seo_content_drafts")
      .select("id", { count: "exact", head: true })
      .eq("content_hash", contentHash),
    db
      .from("seo_pages")
      .select("id", { count: "exact", head: true })
      .eq("locale", input.locale)
      .eq("slug", generation.generated.slug)
      .eq("status", "published"),
  ]);
  const quality = evaluateHeroGuide(
    generation.generated,
    Boolean(duplicate.count),
    Boolean(cannibalization.count),
    input.template,
  );
  if (!quality.publishable || quality.score < 85)
    throw new SeoQualityGateError(quality.score, generation.analytics);
  return {
    cached: false,
    createdAt: new Date().toISOString(),
    draftId: null,
    generation,
    qualityScore: quality.score,
  };
}

async function persistDraftChildren(
  draftId: string,
  generation: HeroGuideGeneration,
  qualityResults: ReturnType<typeof evaluateHeroGuide>["results"],
) {
  const db = createAdminClient();
  const definitions = await db
    .from("seo_section_definitions")
    .select("id,slug")
    .eq("status", "active");
  if (definitions.error) throw new Error("SEO_SECTION_DEFINITIONS_UNAVAILABLE");
  const definitionBySlug = new Map(
    definitions.data.map((item) => [item.slug, item.id]),
  );
  const sections = generation.generated.sections
    .map((section, index) => ({
      body: json(section.body),
      draft_id: draftId,
      heading: section.heading,
      position: index + 1,
      section_definition_id: definitionBySlug.get(section.type),
      word_count: section.body.join(" ").split(/\s+/u).length,
    }))
    .filter(
      (
        section,
      ): section is typeof section & { section_definition_id: string } =>
        Boolean(section.section_definition_id),
    );
  const sectionInsert = await db
    .from("seo_draft_sections")
    .insert(sections)
    .select("id,heading");
  if (sectionInsert.error || !sectionInsert.data.length)
    throw new Error("SEO_SECTIONS_CREATE_FAILED");
  const sectionById = new Map(
    sectionInsert.data.map((item) => [
      generation.generated.sections.find(
        (section) => section.heading === item.heading,
      )?.id,
      item.id,
    ]),
  );
  const references = generation.generated.externalReferencePlaceholders.flatMap(
    (reference, index) => {
      const draftSectionId =
        sectionById.get(reference.sectionId) ?? sectionInsert.data[0]?.id;
      return draftSectionId
        ? [
            {
              claim_key: `claim-${index + 1}`,
              draft_section_id: draftSectionId,
            },
          ]
        : [];
    },
  );
  const faq = generation.generated.faq.map((item, index) => ({
    answer: item.answer,
    draft_id: draftId,
    position: index + 1,
    question: item.question,
  }));
  const [faqResult, refResult] = await Promise.all([
    db.from("seo_draft_faq_items").insert(faq),
    db.from("seo_fact_references").insert(references),
  ]);
  if (faqResult.error || refResult.error)
    throw new Error("SEO_DRAFT_CONTENT_CREATE_FAILED");

  if (generation.delivery.internalLinks.length)
    await db.from("seo_draft_related_topics").insert(
      generation.delivery.internalLinks.slice(0, 10).map((link, index) => ({
        content_type: "guide",
        draft_id: draftId,
        position: index + 1,
        semantic_score: 0.8,
        target_topic_id: link.topicId,
      })),
    );
  const cta = await db
    .from("seo_cta_targets")
    .select("id")
    .eq("slug", generation.generated.cta.target)
    .eq("status", "active")
    .maybeSingle();
  if (cta.data)
    await db.from("seo_draft_ctas").insert({
      cta_target_id: cta.data.id,
      draft_id: draftId,
      position: "conclusion",
      priority: 1,
    });

  const assessment = await db
    .from("seo_quality_assessments")
    .insert({
      draft_content_hash: hash(generation.generated),
      draft_id: draftId,
    })
    .select("id")
    .single();
  const rules = await db
    .from("seo_quality_rules")
    .select("id,slug")
    .eq("status", "active");
  if (assessment.error || rules.error)
    throw new Error("SEO_QUALITY_SAVE_FAILED");
  const ruleBySlug = new Map(rules.data.map((rule) => [rule.slug, rule.id]));
  const results = qualityResults.flatMap((item) => {
    const ruleId = ruleBySlug.get(item.rule);
    return ruleId
      ? [
          {
            assessment_id: assessment.data.id,
            findings: json(item.findings),
            passed: item.passed,
            rule_id: ruleId,
            score: item.score,
          },
        ]
      : [];
  });
  const resultInsert = await db.from("seo_quality_results").insert(results);
  if (resultInsert.error) throw new Error("SEO_QUALITY_RESULTS_SAVE_FAILED");
  const finalized = await db.rpc("finalize_seo_quality_assessment", {
    target_assessment_id: assessment.data.id,
  });
  if (finalized.error || (finalized.data ?? 0) < 80)
    throw new Error("SEO_QUALITY_FINALIZE_FAILED");
}

export async function getHeroGuideDraft(draftId: string) {
  const db = createAdminClient();
  const result = await db
    .from("seo_content_drafts")
    .select(
      "id,title,seo_title,seo_description,status,quality_score,word_count,outline,reviewer_notes,created_at,updated_at",
    )
    .eq("id", draftId)
    .single();
  if (result.error) return null;
  const generation = Array.isArray(result.data.outline)
    ? (result.data.outline[0] as unknown as HeroGuideGeneration)
    : null;
  return generation ? { ...result.data, generation } : null;
}

export async function updateHeroGuideDraft(draftId: string, rawGuide: unknown) {
  const db = createAdminClient();
  const current = await getHeroGuideDraft(draftId);
  if (!current || !["draft", "needs_review"].includes(current.status))
    throw new Error("SEO_DRAFT_NOT_EDITABLE");
  const generated = parseGeneratedHeroGuide(rawGuide);
  const contentHash = hash(generated);
  const duplicate = await db
    .from("seo_content_drafts")
    .select("id", { count: "exact", head: true })
    .eq("content_hash", contentHash)
    .neq("id", draftId);
  const cannibalization = await db
    .from("seo_pages")
    .select("id", { count: "exact", head: true })
    .eq("locale", current.generation.input.locale)
    .eq("slug", generated.slug)
    .eq("status", "published");
  const quality = evaluateHeroGuide(
    generated,
    Boolean(duplicate.count),
    Boolean(cannibalization.count),
    current.generation.input.template,
  );
  if (!quality.publishable || quality.score < 85)
    throw new Error(`SEO_QUALITY_GATE_${quality.score}`);
  const generation: HeroGuideGeneration = { ...current.generation, generated };
  await Promise.all([
    db.from("seo_draft_sections").delete().eq("draft_id", draftId),
    db.from("seo_draft_faq_items").delete().eq("draft_id", draftId),
    db.from("seo_draft_related_topics").delete().eq("draft_id", draftId),
    db.from("seo_draft_ctas").delete().eq("draft_id", draftId),
    db.from("seo_quality_assessments").delete().eq("draft_id", draftId),
  ]);
  const updated = await db
    .from("seo_content_drafts")
    .update({
      content_hash: contentHash,
      outline: json([generation]),
      quality_score: quality.score,
      seo_description: generated.metaDescription,
      seo_title: generated.metaTitle,
      status: "draft",
      title: generated.hero.title,
      word_count: quality.wordCount,
    })
    .eq("id", draftId);
  if (updated.error) throw new Error("SEO_DRAFT_UPDATE_FAILED");
  await persistDraftChildren(draftId, generation, quality.results);
}

export async function reviewHeroGuide(
  draftId: string,
  actorId: string,
  action: "approve" | "reject",
) {
  const db = createAdminClient();
  const current = await db
    .from("seo_content_drafts")
    .select("status")
    .eq("id", draftId)
    .single();
  if (current.error) throw new Error("SEO_DRAFT_NOT_FOUND");
  if (action === "approve") {
    const draft = await getHeroGuideDraft(draftId);
    if (!draft) throw new Error("SEO_DRAFT_NOT_FOUND");
    await ensureDraftReviewRelations(
      draftId,
      draft.generation.input.topicId,
      draft.generation.input.locale,
    );
  }
  const now = new Date().toISOString();
  if (action === "reject") {
    const rejected = await db
      .from("seo_content_drafts")
      .update({
        reviewed_at: now,
        reviewed_by: actorId,
        reviewer_notes: "Rejected by editor",
        status: "archived",
      })
      .eq("id", draftId);
    if (rejected.error) throw new Error("SEO_REJECT_FAILED");
    return;
  }
  if (current.data.status === "draft") {
    const review = await db
      .from("seo_content_drafts")
      .update({
        reviewed_at: now,
        reviewed_by: actorId,
        status: "needs_review",
      })
      .eq("id", draftId);
    if (review.error) throw new Error("SEO_REVIEW_FAILED");
  }
  const approved = await db
    .from("seo_content_drafts")
    .update({
      approved_at: now,
      reviewed_at: now,
      reviewed_by: actorId,
      status: "approved",
    })
    .eq("id", draftId);
  if (approved.error) throw new Error("SEO_APPROVE_FAILED");
}

async function ensureDraftReviewRelations(
  draftId: string,
  topicId: string,
  locale: string,
) {
  const db = createAdminClient();
  const existing = await db
    .from("seo_draft_related_topics")
    .select("target_topic_id,position")
    .eq("draft_id", draftId)
    .order("position");
  if (existing.error) throw new Error("SEO_RELATED_TOPICS_LOOKUP_FAILED");
  if (existing.data.length >= 5) return;
  const topic = await db
    .from("seo_topics")
    .select("cluster_id")
    .eq("id", topicId)
    .single();
  if (topic.error) throw new Error("SEO_TOPIC_NOT_FOUND");
  const candidates = await db
    .from("seo_topics")
    .select("id")
    .eq("cluster_id", topic.data.cluster_id)
    .eq("locale", locale)
    .in("status", ["draft", "published"])
    .neq("id", topicId)
    .order("title")
    .limit(10);
  if (candidates.error) throw new Error("SEO_RELATED_TOPICS_LOOKUP_FAILED");
  const existingIds = new Set(
    existing.data.map((item) => item.target_topic_id),
  );
  const additions = candidates.data
    .filter((candidate) => !existingIds.has(candidate.id))
    .slice(0, Math.max(0, 5 - existing.data.length))
    .map((candidate, index) => ({
      content_type: "guide" as const,
      draft_id: draftId,
      position: existing.data.length + index + 1,
      semantic_score: 0.7,
      target_topic_id: candidate.id,
    }));
  if (!additions.length) return;
  const inserted = await db.from("seo_draft_related_topics").insert(additions);
  if (inserted.error) throw new Error("SEO_RELATED_TOPICS_CREATE_FAILED");
}

export async function publishHeroGuide(draftId: string) {
  const db = createAdminClient();
  const draft = await getHeroGuideDraft(draftId);
  if (!draft || draft.status !== "approved" || draft.quality_score < 85)
    throw new Error("SEO_PUBLISH_GATE_FAILED");
  const topic = await db
    .from("seo_topics")
    .select("id,cluster_id,semantic_terms,slug")
    .eq("id", draft.generation.input.topicId)
    .single();
  if (topic.error) throw new Error("SEO_TOPIC_NOT_FOUND");
  const cluster = await db
    .from("seo_clusters")
    .select("category,status")
    .eq("id", topic.data.cluster_id)
    .single();
  if (cluster.error) throw new Error("SEO_CLUSTER_NOT_FOUND");
  const guide = draft.generation.generated;
  const now = new Date().toISOString();
  const translatedPage = await db
    .from("seo_pages")
    .select("translation_key")
    .eq("slug", guide.slug)
    .eq("schema_type", "guide")
    .eq("status", "published")
    .neq("locale", draft.generation.input.locale)
    .limit(1)
    .maybeSingle();
  if (translatedPage.error) throw new Error("SEO_TRANSLATION_LOOKUP_FAILED");
  if (cluster.data.status !== "published") {
    const clusterPublish = await db
      .from("seo_clusters")
      .update({ status: "published" })
      .eq("id", topic.data.cluster_id);
    if (clusterPublish.error) throw new Error("SEO_CLUSTER_PUBLISH_FAILED");
  }
  const topicPublish = await db
    .from("seo_topics")
    .update({ status: "published" })
    .eq("id", topic.data.id);
  if (topicPublish.error) throw new Error("SEO_TOPIC_PUBLISH_FAILED");
  const content = guide.sections.map((section) => ({
    body: section.body,
    id: section.id,
    title: section.heading,
    type: ([
      "quick-summary",
      "timeline",
      "parent-tips",
      "memory-ideas",
      "photo-ideas",
    ].includes(section.type)
      ? section.type
      : "parent-tips") as "quick-summary",
  }));
  const wordCount = countSeoWords({
    content,
    excerpt: guide.quickAnswer,
    faq: guide.faq,
    hero: guide.hero,
    howto: null,
  });
  const page = await db
    .from("seo_pages")
    .insert({
      category: cluster.data.category,
      cluster_id: topic.data.cluster_id,
      content: json(content),
      content_hash: hash(guide),
      content_source: "ai-assisted",
      content_word_count: wordCount,
      cta: json({
        description: guide.cta.description,
        href: `/${draft.generation.input.locale}/${guide.cta.target}`,
        label: guide.cta.label,
        title: guide.cta.title,
      }),
      excerpt: guide.quickAnswer,
      faq: json(guide.faq),
      generation_metadata: json({
        analytics: draft.generation.analytics,
        delivery: draft.generation.delivery,
        featuredSnippet: guide.featuredSnippet,
        inputHash: draft.generation.inputHash,
        promptVersion: draft.generation.promptVersion,
      }),
      hero: json(guide.hero),
      howto: null,
      locale: draft.generation.input.locale,
      path_key: guide.slug,
      published_at: now,
      quality_score: draft.quality_score,
      reading_time: Math.max(1, Math.ceil(wordCount / 220)),
      schema_type: "guide",
      search_intent: draft.generation.input.searchIntent,
      semantic_terms: topic.data.semantic_terms,
      seo_description: guide.metaDescription,
      seo_title: guide.metaTitle,
      slug: guide.slug,
      slug_path: [guide.slug],
      status: "published",
      title: guide.hero.title,
      topic_id: topic.data.id,
      translation_key: translatedPage.data?.translation_key ?? topic.data.id,
      updated_at: now,
    })
    .select("id")
    .single();
  if (page.error) throw new Error("SEO_PAGE_CREATE_FAILED");
  const updated = await db
    .from("seo_content_drafts")
    .update({ published_page_id: page.data.id, status: "published" })
    .eq("id", draftId);
  if (updated.error) {
    await db.from("seo_pages").delete().eq("id", page.data.id);
    throw new Error("SEO_PUBLISH_FAILED");
  }
  revalidateTag("programmatic-seo", "max");
  revalidatePath(`/${draft.generation.input.locale}/guides/${guide.slug}`);
  revalidatePath("/sitemap-index.xml");
  return `/${draft.generation.input.locale}/guides/${guide.slug}`;
}
