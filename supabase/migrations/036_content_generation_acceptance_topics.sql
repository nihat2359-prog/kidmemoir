-- Canonical acceptance topics for the Content Generation Engine.
-- Extends the existing Knowledge Graph; no content is published by this seed.

with topic_seed(domain_slug, locale, slug, title, description, semantic_terms) as (
  values
    ('memory-book','en','baby-memory-book','Baby Memory Book','A complete planning topic for preserving a baby''s early story.',array['baby memory book','baby journal','keepsake']),
    ('memory-book','tr','baby-memory-book','Bebek Anı Kitabı','Bir bebeğin ilk yıllarını güvenle saklamaya yönelik kapsamlı planlama konusu.',array['bebek anı kitabı','bebek günlüğü','hatıra']),
    ('memory-book','en','digital-baby-book','Digital Baby Book','A digital-first baby memory book topic covering media, privacy, backup, and continuity.',array['digital baby book','baby memories','digital keepsake']),
    ('memory-book','tr','digital-baby-book','Dijital Bebek Anı Kitabı','Medya, gizlilik, yedekleme ve sürekliliği kapsayan dijital bebek anı kitabı konusu.',array['dijital bebek anı kitabı','bebek anıları','dijital hatıra']),
    ('milestones','en','first-steps','First Steps','A child milestone topic for recording and preserving first independent steps.',array['first steps','walking milestone','baby milestone']),
    ('milestones','tr','first-steps','İlk Adımlar','Çocuğun ilk bağımsız adımlarını kaydetmeye ve saklamaya yönelik gelişim konusu.',array['ilk adımlar','yürüme dönüm noktası','bebek gelişimi']),
    ('letters-to-child','en','letter-to-my-daughter','Letter To My Daughter','A thoughtful framework for writing an honest, age-appropriate letter to a daughter.',array['letter to my daughter','letter to child','family letter']),
    ('letters-to-child','tr','letter-to-my-daughter','Kızıma Mektup','Bir kıza samimi ve yaşına uygun bir mektup yazmaya yönelik düşünceli çerçeve.',array['kızıma mektup','çocuğa mektup','aile mektubu'])
)
insert into public.seo_topics (
  cluster_id, parent_id, locale, slug, title, description, depth,
  semantic_terms, status
)
select c.id, parent.id, seed.locale, seed.slug, seed.title, seed.description, 2,
  seed.semantic_terms, 'draft'
from topic_seed seed
join public.seo_clusters c
  on c.category = seed.domain_slug and c.locale = seed.locale
join public.seo_topics parent
  on parent.cluster_id = c.id and parent.locale = seed.locale
  and parent.parent_id is null
on conflict (cluster_id, parent_id, locale, slug) do update
set title = excluded.title,
    description = excluded.description,
    semantic_terms = excluded.semantic_terms;

insert into public.seo_topic_intelligence (
  topic_id, domain_id, template_id, search_intent, seo_value,
  evergreen_score, premium_conversion_score, parent_value_score,
  competition_score, internal_link_score, authority_contribution_score,
  intent_quality_score, internal_link_quality_score,
  conversion_quality_score, information_value_score, uniqueness_score,
  ai_prompt_id, prompt_version, content_status
)
select t.id, d.id, template.id,
  case when t.slug in ('baby-memory-book','digital-baby-book')
    then 'commercial' else 'informational' end,
  92, 95, 85, 95, 60, 88, 94, 95, 90, 88, 95, 92,
  'content-generation', 'content-generation-v2', 'generation-ready'
from public.seo_topics t
join public.seo_clusters c on c.id = t.cluster_id
join public.seo_domains d on d.id = c.domain_id
join public.seo_templates template on template.slug = 'guide'
where t.slug in (
  'baby-memory-book','digital-baby-book','first-steps','letter-to-my-daughter'
)
on conflict (topic_id) do update
set ai_prompt_id = excluded.ai_prompt_id,
    prompt_version = excluded.prompt_version,
    content_status = excluded.content_status;

insert into public.seo_topic_relations (
  source_topic_id, target_topic_id, weight, relation_type, semantic_score
)
select source.id, target.id, 0.9, 'related', 0.9
from public.seo_topics source
join public.seo_topics target
  on target.cluster_id = source.cluster_id
  and target.locale = source.locale
  and target.id <> source.id
where source.slug in (
  'baby-memory-book','digital-baby-book','first-steps','letter-to-my-daughter'
)
on conflict (source_topic_id, target_topic_id) do update
set weight = excluded.weight,
    relation_type = excluded.relation_type,
    semantic_score = excluded.semantic_score;
