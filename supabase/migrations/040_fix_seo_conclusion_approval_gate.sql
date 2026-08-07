-- Conclusion is stored in the canonical draft payload, not as a draft section row.
-- Keep the editorial gate strict for authored sections while avoiding a false
-- rejection for structural blocks persisted elsewhere in the content model.
create or replace function public.validate_seo_draft_workflow()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  rules public.seo_template_rules;
  faq_count integer;
  related_count integer;
  available_related_count integer;
  required_related_count integer;
  cta_count integer;
  missing_required_section boolean;
  has_passing_assessment boolean;
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status and not (
    (old.status = 'draft' and new.status in ('needs_review','archived'))
    or (old.status = 'needs_review' and new.status in ('draft','approved','archived'))
    or (old.status = 'approved' and new.status in ('needs_review','published','archived'))
    or (old.status = 'published' and new.status = 'archived')
    or (old.status = 'archived' and new.status = 'draft')
  ) then
    raise exception 'Invalid SEO editorial workflow transition';
  end if;
  if new.status not in ('approved','published') then return new; end if;

  select * into rules
  from public.seo_template_rules
  where template_id = new.template_id;
  select count(*) into faq_count
  from public.seo_draft_faq_items where draft_id = new.id;
  select count(*) into related_count
  from public.seo_draft_related_topics where draft_id = new.id;
  select count(*) into cta_count
  from public.seo_draft_ctas where draft_id = new.id;
  select count(*) into available_related_count
  from public.seo_topics source
  join public.seo_topics candidate
    on candidate.cluster_id = source.cluster_id
    and candidate.locale = source.locale
    and candidate.id <> source.id
    and candidate.status in ('draft','published')
  where source.id = new.topic_id;
  required_related_count := least(rules.minimum_internal_links, available_related_count);

  select exists (
    select 1
    from public.seo_template_sections ts
    join public.seo_section_definitions definition
      on definition.id = ts.section_definition_id
    left join public.seo_draft_sections ds
      on ds.draft_id = new.id
      and ds.section_definition_id = ts.section_definition_id
    where ts.template_id = new.template_id
      and ts.is_required
      and definition.slug not in (
        'hero','quick-summary','parent-tips','faq','related-topics','cta','conclusion'
      )
      and ds.id is null
  ) into missing_required_section;
  select exists (
    select 1 from public.seo_quality_assessments a
    where a.draft_id = new.id
      and a.draft_content_hash = new.content_hash
      and a.passed
  ) into has_passing_assessment;

  if rules.template_id is null or new.word_count < rules.minimum_words
    or faq_count not between rules.minimum_faq_items and rules.maximum_faq_items
    or related_count < required_related_count
    or related_count > rules.maximum_internal_links
    or cta_count = 0 or missing_required_section
    or new.quality_score < 80 or not has_passing_assessment
    or new.title is null or new.seo_title is null or new.seo_description is null
    or new.content_hash is null
    or new.reviewed_by is null or new.reviewed_at is null then
    raise exception 'SEO draft does not satisfy the editorial publishing gate';
  end if;
  if new.status = 'approved' and new.approved_at is null then
    new.approved_at := now();
  end if;
  return new;
end;
$$;

comment on function public.validate_seo_draft_workflow() is
  'Enforces editorial quality while treating canonical payload blocks as structural content.';
