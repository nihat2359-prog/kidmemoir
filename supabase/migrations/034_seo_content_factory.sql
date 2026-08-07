alter table public.seo_cta_targets drop constraint seo_cta_targets_slug_check;
alter table public.seo_cta_targets add constraint seo_cta_targets_slug_check
check (slug in ('register','timeline','premium','memory-book','dashboard','ai-features','newsletter'));
insert into public.seo_cta_targets (slug, destination_path)
values ('newsletter', '/#newsletter') on conflict (slug) do nothing;

create table public.seo_section_definitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in (
    'hero','introduction','quick-summary','timeline','parent-tips','memory-ideas',
    'photo-ideas','questions-to-ask','checklist','common-mistakes','faq',
    'related-topics','cta','conclusion'
  )),
  supports_media text[] not null default '{}' check (
    supports_media <@ array['photo','video','infographic','illustration','table']::text[]
  ),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.seo_section_definitions (slug, supports_media) values
  ('hero', array['photo','illustration']),
  ('introduction', array['photo','illustration']),
  ('quick-summary', array['infographic','table']),
  ('timeline', array['photo','video','infographic']),
  ('parent-tips', array['illustration','infographic']),
  ('memory-ideas', array['photo','video','illustration']),
  ('photo-ideas', array['photo','illustration']),
  ('questions-to-ask', array['illustration']),
  ('checklist', array['infographic','table']),
  ('common-mistakes', array['illustration','table']),
  ('faq', '{}'::text[]),
  ('related-topics', array['photo']),
  ('cta', array['illustration']),
  ('conclusion', array['photo','illustration']);

create table public.seo_template_rules (
  template_id uuid primary key references public.seo_templates (id) on delete cascade,
  minimum_words integer not null check (minimum_words between 600 and 10000),
  recommended_words integer not null check (recommended_words >= minimum_words),
  maximum_words integer not null check (maximum_words >= recommended_words),
  minimum_faq_items smallint not null default 5 check (minimum_faq_items between 5 and 10),
  maximum_faq_items smallint not null default 10 check (maximum_faq_items between minimum_faq_items and 10),
  minimum_internal_links smallint not null default 5 check (minimum_internal_links between 5 and 10),
  maximum_internal_links smallint not null default 10 check (maximum_internal_links between minimum_internal_links and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.seo_template_rules (template_id, minimum_words, recommended_words, maximum_words)
select id,
  case slug
    when 'guide' then 1600 when 'checklist' then 900 when 'faq' then 1000
    when 'comparison' then 1800 when 'ideas' then 1400 when 'knowledge' then 1800
    when 'tool' then 800 when 'timeline' then 1200 when 'templates' then 800 else 700
  end,
  case slug
    when 'guide' then 2200 when 'checklist' then 1300 when 'faq' then 1400
    when 'comparison' then 2400 when 'ideas' then 1900 when 'knowledge' then 2400
    when 'tool' then 1200 when 'timeline' then 1700 when 'templates' then 1200 else 1000
  end,
  case slug
    when 'guide' then 3500 when 'checklist' then 2200 when 'faq' then 2200
    when 'comparison' then 3800 when 'ideas' then 3000 when 'knowledge' then 3800
    when 'tool' then 2000 when 'timeline' then 2800 when 'templates' then 2200 else 1800
  end
from public.seo_templates
on conflict (template_id) do nothing;

create table public.seo_template_sections (
  template_id uuid not null references public.seo_templates (id) on delete cascade,
  section_definition_id uuid not null references public.seo_section_definitions (id) on delete restrict,
  position smallint not null check (position between 1 and 50),
  is_required boolean not null default true,
  primary key (template_id, section_definition_id),
  unique (template_id, position)
);

insert into public.seo_template_sections (template_id, section_definition_id, position, is_required)
select t.id, s.id, ordered.position, ordered.required
from public.seo_templates t
cross join (values
  ('hero',1,true), ('introduction',2,true), ('quick-summary',3,true),
  ('timeline',4,false), ('parent-tips',5,true), ('memory-ideas',6,false),
  ('photo-ideas',7,false), ('questions-to-ask',8,false), ('checklist',9,false),
  ('common-mistakes',10,false), ('faq',11,true), ('related-topics',12,true),
  ('cta',13,true), ('conclusion',14,true)
) as ordered(slug, position, required)
join public.seo_section_definitions s on s.slug = ordered.slug
on conflict do nothing;

create table public.seo_content_drafts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.seo_topics (id) on delete restrict,
  template_id uuid not null references public.seo_templates (id) on delete restrict,
  locale text not null check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  version integer not null default 1 check (version > 0),
  status text not null default 'draft' check (status in ('draft','needs_review','approved','published','archived')),
  title text check (title is null or char_length(btrim(title)) between 2 and 180),
  seo_title text check (seo_title is null or char_length(btrim(seo_title)) between 20 and 70),
  seo_description text check (seo_description is null or char_length(btrim(seo_description)) between 70 and 170),
  outline jsonb not null default '[]'::jsonb check (jsonb_typeof(outline) = 'array'),
  primary_keyword text,
  secondary_keywords text[] not null default '{}',
  content_hash text check (content_hash is null or content_hash ~ '^[a-f0-9]{64}$'),
  word_count integer not null default 0 check (word_count >= 0),
  quality_score smallint not null default 0 check (quality_score between 0 and 100),
  freshness_score smallint not null default 100 check (freshness_score between 0 and 100),
  prompt_version text,
  model text,
  generated_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  reviewer_notes text,
  approved_at timestamptz,
  published_page_id uuid references public.seo_pages (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, locale, version),
  constraint seo_content_drafts_generation_metadata check (
    generated_at is null or (prompt_version is not null and model is not null)
  ),
  constraint seo_content_drafts_review_metadata check (
    reviewed_at is null or reviewed_by is not null
  ),
  constraint seo_content_drafts_publish_reference check (
    status <> 'published' or published_page_id is not null
  )
);
create unique index seo_content_drafts_active_title_idx
on public.seo_content_drafts (locale, lower(seo_title))
where status in ('approved','published');
create unique index seo_content_drafts_active_description_idx
on public.seo_content_drafts (locale, lower(seo_description))
where status in ('approved','published');
create index seo_content_drafts_editor_queue_idx
on public.seo_content_drafts (status, quality_score desc, updated_at desc);
create index seo_content_drafts_topic_idx
on public.seo_content_drafts (topic_id, locale, version desc);

create table public.seo_draft_sections (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  section_definition_id uuid not null references public.seo_section_definitions (id) on delete restrict,
  position smallint not null check (position between 1 and 50),
  heading text,
  body jsonb not null default '[]'::jsonb check (jsonb_typeof(body) in ('array','object')),
  word_count integer not null default 0 check (word_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_id, section_definition_id),
  unique (draft_id, position)
);

create table public.seo_fact_references (
  id uuid primary key default gen_random_uuid(),
  draft_section_id uuid not null references public.seo_draft_sections (id) on delete cascade,
  claim_key text not null check (claim_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  reference_status text not null default 'placeholder' check (reference_status in ('placeholder','verified','rejected')),
  source_url text,
  source_title text,
  publisher text,
  published_at timestamptz,
  verified_by uuid references auth.users (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_section_id, claim_key),
  constraint seo_fact_references_verified_data check (
    reference_status <> 'verified' or (
      source_url is not null and source_title is not null
      and verified_by is not null and verified_at is not null
    )
  )
);

create table public.seo_media_recommendations (
  id uuid primary key default gen_random_uuid(),
  draft_section_id uuid not null references public.seo_draft_sections (id) on delete cascade,
  media_type text not null check (media_type in ('photo','video','infographic','illustration','table')),
  brief text not null check (char_length(btrim(brief)) between 20 and 1000),
  alt_text_guidance text,
  position smallint not null default 1 check (position between 1 and 20),
  status text not null default 'suggested' check (status in ('suggested','approved','rejected','fulfilled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_section_id, media_type, position)
);

create table public.seo_draft_faq_items (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  position smallint not null check (position between 1 and 10),
  question text not null check (char_length(btrim(question)) between 10 and 240),
  answer text not null check (char_length(btrim(answer)) between 40 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_id, position),
  unique (draft_id, question)
);

create table public.seo_draft_related_topics (
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  target_topic_id uuid not null references public.seo_topics (id) on delete cascade,
  content_type text not null check (content_type in ('guide','checklist','faq','milestone','template','memory-idea','photo-idea')),
  semantic_score numeric(5,4) not null check (semantic_score between 0 and 1),
  position smallint not null check (position between 1 and 10),
  primary key (draft_id, target_topic_id, content_type),
  unique (draft_id, position)
);

create table public.seo_draft_ctas (
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  cta_target_id uuid not null references public.seo_cta_targets (id) on delete restrict,
  position text not null check (position in ('inline','conclusion','sticky')),
  priority smallint not null default 1 check (priority between 1 and 3),
  primary key (draft_id, cta_target_id, position)
);

create table public.seo_quality_rules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in (
    'search-intent-match','title-quality','description-quality','heading-structure',
    'keyword-coverage','internal-links','external-reference-placeholder','readability',
    'helpful-content','eeat','duplicate-risk','thin-content','cannibalization',
    'natural-language','originality'
  )),
  weight smallint not null check (weight between 1 and 100),
  is_required boolean not null default true,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.seo_quality_rules (slug, weight) values
  ('search-intent-match',8), ('title-quality',6), ('description-quality',5),
  ('heading-structure',6), ('keyword-coverage',7), ('internal-links',7),
  ('external-reference-placeholder',5), ('readability',7), ('helpful-content',10),
  ('eeat',9), ('duplicate-risk',6), ('thin-content',7), ('cannibalization',5),
  ('natural-language',6), ('originality',6);

create table public.seo_quality_assessments (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  draft_content_hash text not null check (draft_content_hash ~ '^[a-f0-9]{64}$'),
  score smallint not null default 0 check (score between 0 and 100),
  passed boolean not null default false,
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (draft_id, draft_content_hash)
);

create table public.seo_quality_results (
  assessment_id uuid not null references public.seo_quality_assessments (id) on delete cascade,
  rule_id uuid not null references public.seo_quality_rules (id) on delete restrict,
  score smallint not null check (score between 0 and 100),
  passed boolean not null,
  findings jsonb not null default '[]'::jsonb check (jsonb_typeof(findings) = 'array'),
  primary key (assessment_id, rule_id)
);

create function public.finalize_seo_quality_assessment(target_assessment_id uuid)
returns smallint
language plpgsql
set search_path = ''
as $$
declare
  calculated_score smallint;
  required_failure boolean;
  target_draft_id uuid;
begin
  select round(sum(r.score * q.weight)::numeric / nullif(sum(q.weight), 0))::smallint,
    coalesce(bool_or(q.is_required and not r.passed), false), a.draft_id
  into calculated_score, required_failure, target_draft_id
  from public.seo_quality_assessments a
  join public.seo_quality_results r on r.assessment_id = a.id
  join public.seo_quality_rules q on q.id = r.rule_id and q.status = 'active'
  where a.id = target_assessment_id
  group by a.draft_id;

  if calculated_score is null then
    raise exception 'Quality assessment has no active rule results';
  end if;

  update public.seo_quality_assessments
  set score = calculated_score, passed = calculated_score >= 80 and not required_failure,
      evaluated_at = now()
  where id = target_assessment_id;
  update public.seo_content_drafts set quality_score = calculated_score
  where id = target_draft_id;
  return calculated_score;
end;
$$;

create function public.validate_seo_draft_workflow()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  rules public.seo_template_rules;
  faq_count integer;
  related_count integer;
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
  select * into rules from public.seo_template_rules where template_id = new.template_id;
  select count(*) into faq_count from public.seo_draft_faq_items where draft_id = new.id;
  select count(*) into related_count from public.seo_draft_related_topics where draft_id = new.id;
  select count(*) into cta_count from public.seo_draft_ctas where draft_id = new.id;
  select exists (
    select 1 from public.seo_template_sections ts
    left join public.seo_draft_sections ds
      on ds.draft_id = new.id and ds.section_definition_id = ts.section_definition_id
    where ts.template_id = new.template_id and ts.is_required and ds.id is null
  ) into missing_required_section;
  select exists (
    select 1 from public.seo_quality_assessments a
    where a.draft_id = new.id and a.draft_content_hash = new.content_hash and a.passed
  ) into has_passing_assessment;
  if rules.template_id is null or new.word_count < rules.minimum_words
    or faq_count not between rules.minimum_faq_items and rules.maximum_faq_items
    or related_count not between rules.minimum_internal_links and rules.maximum_internal_links
    or cta_count = 0 or missing_required_section
    or new.quality_score < 80 or not has_passing_assessment
    or new.title is null or new.seo_title is null or new.seo_description is null
    or new.content_hash is null
    or new.reviewed_by is null or new.reviewed_at is null then
    raise exception 'SEO draft does not satisfy the editorial publishing gate';
  end if;
  if new.status = 'approved' and new.approved_at is null then new.approved_at := now(); end if;
  return new;
end;
$$;
create trigger seo_content_drafts_workflow_gate
before insert or update on public.seo_content_drafts
for each row execute function public.validate_seo_draft_workflow();

create table public.seo_draft_workflow_events (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  from_status text,
  to_status text not null check (to_status in ('draft','needs_review','approved','published','archived')),
  actor_id uuid references auth.users (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
create index seo_draft_workflow_events_idx
on public.seo_draft_workflow_events (draft_id, created_at desc);

create function public.record_seo_draft_workflow_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or old.status is distinct from new.status then
    insert into public.seo_draft_workflow_events (draft_id, from_status, to_status)
    values (new.id, case when tg_op = 'INSERT' then null else old.status end, new.status);
  end if;
  return new;
end;
$$;
create trigger seo_content_drafts_record_workflow
after insert or update of status on public.seo_content_drafts
for each row execute function public.record_seo_draft_workflow_event();

create table public.seo_content_metrics_daily (
  draft_id uuid not null references public.seo_content_drafts (id) on delete cascade,
  metric_date date not null,
  impressions bigint not null default 0 check (impressions >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  ctr numeric(7,4) not null default 0 check (ctr between 0 and 100),
  average_position numeric(8,3) check (average_position is null or average_position >= 0),
  conversions bigint not null default 0 check (conversions >= 0),
  premium_conversions bigint not null default 0 check (premium_conversions >= 0),
  revenue numeric(14,2) not null default 0 check (revenue >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (draft_id, metric_date),
  constraint seo_content_metrics_clicks check (clicks <= impressions),
  constraint seo_content_metrics_conversions check (premium_conversions <= conversions)
);
create index seo_content_metrics_date_idx
on public.seo_content_metrics_daily (metric_date desc, draft_id);

alter table public.seo_section_definitions enable row level security;
alter table public.seo_template_rules enable row level security;
alter table public.seo_template_sections enable row level security;
alter table public.seo_content_drafts enable row level security;
alter table public.seo_draft_sections enable row level security;
alter table public.seo_fact_references enable row level security;
alter table public.seo_media_recommendations enable row level security;
alter table public.seo_draft_faq_items enable row level security;
alter table public.seo_draft_related_topics enable row level security;
alter table public.seo_draft_ctas enable row level security;
alter table public.seo_quality_rules enable row level security;
alter table public.seo_quality_assessments enable row level security;
alter table public.seo_quality_results enable row level security;
alter table public.seo_draft_workflow_events enable row level security;
alter table public.seo_content_metrics_daily enable row level security;

alter table public.seo_section_definitions force row level security;
alter table public.seo_template_rules force row level security;
alter table public.seo_template_sections force row level security;
alter table public.seo_content_drafts force row level security;
alter table public.seo_draft_sections force row level security;
alter table public.seo_fact_references force row level security;
alter table public.seo_media_recommendations force row level security;
alter table public.seo_draft_faq_items force row level security;
alter table public.seo_draft_related_topics force row level security;
alter table public.seo_draft_ctas force row level security;
alter table public.seo_quality_rules force row level security;
alter table public.seo_quality_assessments force row level security;
alter table public.seo_quality_results force row level security;
alter table public.seo_draft_workflow_events force row level security;
alter table public.seo_content_metrics_daily force row level security;

revoke all on public.seo_section_definitions, public.seo_template_rules,
  public.seo_template_sections, public.seo_content_drafts, public.seo_draft_sections,
  public.seo_fact_references, public.seo_media_recommendations,
  public.seo_draft_faq_items, public.seo_draft_related_topics, public.seo_draft_ctas,
  public.seo_quality_rules, public.seo_quality_assessments, public.seo_quality_results,
  public.seo_draft_workflow_events, public.seo_content_metrics_daily from anon, authenticated;

create trigger seo_section_definitions_set_updated_at before update on public.seo_section_definitions
for each row execute function public.set_updated_at();
create trigger seo_template_rules_set_updated_at before update on public.seo_template_rules
for each row execute function public.set_updated_at();
create trigger seo_content_drafts_set_updated_at before update on public.seo_content_drafts
for each row execute function public.set_updated_at();
create trigger seo_draft_sections_set_updated_at before update on public.seo_draft_sections
for each row execute function public.set_updated_at();
create trigger seo_fact_references_set_updated_at before update on public.seo_fact_references
for each row execute function public.set_updated_at();
create trigger seo_media_recommendations_set_updated_at before update on public.seo_media_recommendations
for each row execute function public.set_updated_at();
create trigger seo_draft_faq_items_set_updated_at before update on public.seo_draft_faq_items
for each row execute function public.set_updated_at();
create trigger seo_quality_rules_set_updated_at before update on public.seo_quality_rules
for each row execute function public.set_updated_at();
create trigger seo_content_metrics_set_updated_at before update on public.seo_content_metrics_daily
for each row execute function public.set_updated_at();

comment on table public.seo_content_drafts is 'Non-public editorial SEO drafts; never exposed to indexing before approval and publication.';
comment on function public.validate_seo_draft_workflow() is 'Enforces human review, quality, length, FAQ and internal-link gates before approval or publication.';
