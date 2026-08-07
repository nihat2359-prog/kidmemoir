create table public.seo_domains (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  authority_score smallint not null default 50 check (authority_score between 0 and 100),
  is_primary_authority boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seo_domain_localizations (
  domain_id uuid not null references public.seo_domains (id) on delete cascade,
  locale text not null check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  description text not null check (char_length(btrim(description)) between 20 and 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (domain_id, locale)
);

insert into public.seo_domains (slug, authority_score, is_primary_authority)
select slug, authority_score, authority_score >= 85
from (values
  ('memory-ideas', 100), ('milestones', 98), ('photo-ideas', 82),
  ('video-ideas', 72), ('letters-to-child', 84), ('journaling', 92),
  ('keepsakes', 78), ('time-capsule', 80), ('birthday', 76),
  ('pregnancy', 70), ('newborn', 88), ('baby', 94), ('toddler', 82),
  ('preschool', 72), ('school', 76), ('teen', 68),
  ('family-traditions', 86), ('activities', 74), ('learning', 72),
  ('education', 68), ('travel', 72), ('health', 60), ('sleep', 58),
  ('food', 58), ('emotions', 74), ('growth', 90), ('celebrations', 72),
  ('checklists', 75), ('templates', 78), ('questions', 70), ('quotes', 62),
  ('digital-memory', 96), ('memory-book', 100), ('family-history', 88)
) as domains(slug, authority_score);

insert into public.seo_domain_localizations (domain_id, locale, name, description)
select d.id, labels.locale, labels.name,
  case labels.locale
    when 'tr' then labels.name || ' bilgi alanı için içerik planlama ve konu otoritesi kataloğu.'
    else 'Content planning and topical authority catalog for the ' || labels.name || ' knowledge domain.'
  end
from public.seo_domains d
join (values
  ('memory-ideas','en','Memory Ideas'),('memory-ideas','tr','Anı Fikirleri'),
  ('milestones','en','Milestones'),('milestones','tr','Gelişim Dönüm Noktaları'),
  ('photo-ideas','en','Photo Ideas'),('photo-ideas','tr','Fotoğraf Fikirleri'),
  ('video-ideas','en','Video Ideas'),('video-ideas','tr','Video Fikirleri'),
  ('letters-to-child','en','Letters To Child'),('letters-to-child','tr','Çocuğa Mektuplar'),
  ('journaling','en','Journaling'),('journaling','tr','Günlük Tutma'),
  ('keepsakes','en','Keepsakes'),('keepsakes','tr','Hatıra Eşyaları'),
  ('time-capsule','en','Time Capsule'),('time-capsule','tr','Zaman Kapsülü'),
  ('birthday','en','Birthday'),('birthday','tr','Doğum Günü'),
  ('pregnancy','en','Pregnancy'),('pregnancy','tr','Hamilelik'),
  ('newborn','en','Newborn'),('newborn','tr','Yenidoğan'),
  ('baby','en','Baby'),('baby','tr','Bebeklik'),
  ('toddler','en','Toddler'),('toddler','tr','Yürüme Çağı'),
  ('preschool','en','Preschool'),('preschool','tr','Okul Öncesi'),
  ('school','en','School'),('school','tr','Okul'),
  ('teen','en','Teen'),('teen','tr','Ergenlik'),
  ('family-traditions','en','Family Traditions'),('family-traditions','tr','Aile Gelenekleri'),
  ('activities','en','Activities'),('activities','tr','Aktiviteler'),
  ('learning','en','Learning'),('learning','tr','Öğrenme'),
  ('education','en','Education'),('education','tr','Eğitim'),
  ('travel','en','Travel'),('travel','tr','Seyahat'),
  ('health','en','Health'),('health','tr','Sağlık'),
  ('sleep','en','Sleep'),('sleep','tr','Uyku'),
  ('food','en','Food'),('food','tr','Beslenme'),
  ('emotions','en','Emotions'),('emotions','tr','Duygular'),
  ('growth','en','Growth'),('growth','tr','Büyüme'),
  ('celebrations','en','Celebrations'),('celebrations','tr','Kutlamalar'),
  ('checklists','en','Checklists'),('checklists','tr','Kontrol Listeleri'),
  ('templates','en','Templates'),('templates','tr','Şablonlar'),
  ('questions','en','Questions'),('questions','tr','Sorular'),
  ('quotes','en','Quotes'),('quotes','tr','Sözler'),
  ('digital-memory','en','Digital Memory'),('digital-memory','tr','Dijital Anı'),
  ('memory-book','en','Memory Book'),('memory-book','tr','Anı Kitabı'),
  ('family-history','en','Family History'),('family-history','tr','Aile Tarihi')
) as labels(slug, locale, name) on labels.slug = d.slug;

alter table public.seo_clusters drop constraint seo_clusters_category_check;
alter table public.seo_clusters drop constraint seo_clusters_locale_check;
alter table public.seo_topics drop constraint seo_topics_locale_check;
alter table public.seo_pages drop constraint seo_pages_category_check;
alter table public.seo_pages drop constraint seo_pages_locale_check;
alter table public.seo_pages drop constraint seo_pages_search_intent_check;

alter table public.seo_clusters
  add constraint seo_clusters_category_slug check (category ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  add constraint seo_clusters_locale_format check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  add column domain_id uuid references public.seo_domains (id) on delete restrict;
alter table public.seo_topics
  add constraint seo_topics_locale_format check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$');
alter table public.seo_pages
  add constraint seo_pages_category_slug check (category ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  add constraint seo_pages_locale_format check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  add constraint seo_pages_search_intent_value check (search_intent in (
    'informational', 'commercial', 'transactional', 'navigational',
    'comparison', 'inspirational', 'educational'
  ));

update public.seo_clusters c
set domain_id = (
  select d.id from public.seo_domains d
  where d.slug = case
    when c.category in ('memory-ideas','milestones','photo-ideas','checklists','templates','questions') then c.category
    when c.category = 'activities' then 'activities'
    when c.category = 'knowledge' then 'family-history'
    else 'digital-memory'
  end
);
alter table public.seo_clusters alter column domain_id set not null;
create index seo_clusters_domain_idx on public.seo_clusters (domain_id, locale, status);

create table public.seo_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in (
    'guide', 'checklist', 'faq', 'comparison', 'timeline', 'ideas',
    'templates', 'knowledge', 'tool', 'landing'
  )),
  schema_type text not null check (schema_type in ('faq','howto','article','webpage','checklist','guide')),
  required_blocks text[] not null default '{}',
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.seo_templates (slug, schema_type, required_blocks) values
  ('guide','guide',array['hero','quick-summary','parent-tips','faq','related-pages','cta']),
  ('checklist','checklist',array['hero','quick-summary','howto','faq','related-pages','cta']),
  ('faq','faq',array['hero','quick-summary','faq','related-pages','cta']),
  ('comparison','article',array['hero','quick-summary','parent-tips','faq','related-pages','cta']),
  ('timeline','howto',array['hero','quick-summary','timeline','faq','related-pages','cta']),
  ('ideas','article',array['hero','quick-summary','memory-ideas','photo-ideas','faq','related-pages','cta']),
  ('templates','webpage',array['hero','quick-summary','howto','related-pages','cta']),
  ('knowledge','article',array['hero','quick-summary','parent-tips','faq','related-pages','cta']),
  ('tool','webpage',array['hero','quick-summary','howto','faq','related-pages','cta']),
  ('landing','webpage',array['hero','quick-summary','related-pages','cta']);

create table public.seo_cta_targets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('register','timeline','premium','memory-book','dashboard','ai-features')),
  destination_path text not null check (destination_path like '/%'),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.seo_cta_targets (slug, destination_path) values
  ('register','/register'), ('timeline','/timeline'), ('premium','/pricing'),
  ('memory-book','/pricing'), ('dashboard','/dashboard'), ('ai-features','/#kidmemoir-ai');

create table public.seo_authority_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  authority_weight smallint not null check (authority_weight between 1 and 100),
  authority_tier smallint not null check (authority_tier between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.seo_authority_topics (slug, authority_weight, authority_tier) values
  ('baby-memories',100,1), ('child-memory-journal',100,1),
  ('family-memory',98,1), ('milestones',98,1), ('memory-book',100,1),
  ('digital-baby-book',96,1), ('child-timeline',96,1),
  ('baby-journal',95,1), ('first-moments',94,1), ('memory-ideas',98,1);

create table public.seo_topic_intelligence (
  topic_id uuid primary key references public.seo_topics (id) on delete cascade,
  domain_id uuid not null references public.seo_domains (id) on delete restrict,
  template_id uuid not null references public.seo_templates (id) on delete restrict,
  search_intent text not null check (search_intent in (
    'informational','commercial','transactional','navigational',
    'comparison','inspirational','educational'
  )),
  seo_value smallint not null check (seo_value between 0 and 100),
  evergreen_score smallint not null check (evergreen_score between 0 and 100),
  premium_conversion_score smallint not null check (premium_conversion_score between 0 and 100),
  parent_value_score smallint not null check (parent_value_score between 0 and 100),
  competition_score smallint not null check (competition_score between 0 and 100),
  internal_link_score smallint not null check (internal_link_score between 0 and 100),
  authority_contribution_score smallint not null check (authority_contribution_score between 0 and 100),
  priority_score smallint not null default 0 check (priority_score between 0 and 100),
  content_tier smallint not null default 3 check (content_tier between 1 and 3),
  intent_quality_score smallint not null default 0 check (intent_quality_score between 0 and 100),
  internal_link_quality_score smallint not null default 0 check (internal_link_quality_score between 0 and 100),
  conversion_quality_score smallint not null default 0 check (conversion_quality_score between 0 and 100),
  information_value_score smallint not null default 0 check (information_value_score between 0 and 100),
  uniqueness_score smallint not null default 0 check (uniqueness_score between 0 and 100),
  quality_score smallint not null default 0 check (quality_score between 0 and 100),
  freshness_score smallint not null default 100 check (freshness_score between 0 and 100),
  ai_prompt_id text,
  prompt_version text,
  content_status text not null default 'draft' check (content_status in (
    'draft','brief-ready','generation-ready','in-review','approved',
    'published','refresh-required','archived'
  )),
  human_reviewed boolean not null default false,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seo_topic_intelligence_review_state check (
    not human_reviewed or reviewed_at is not null
  )
);

create function public.score_seo_topic_intelligence()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.priority_score := round(
    new.seo_value * 0.20 + new.evergreen_score * 0.15
    + new.premium_conversion_score * 0.15 + new.parent_value_score * 0.20
    + (100 - new.competition_score) * 0.10 + new.internal_link_score * 0.10
    + new.authority_contribution_score * 0.10
  );
  new.content_tier := case when new.priority_score >= 80 then 1
    when new.priority_score >= 60 then 2 else 3 end;
  new.quality_score := round((
    new.intent_quality_score + new.internal_link_quality_score
    + new.conversion_quality_score + new.information_value_score
    + new.uniqueness_score + new.authority_contribution_score
  ) / 6.0);
  return new;
end;
$$;

create trigger seo_topic_intelligence_score
before insert or update on public.seo_topic_intelligence
for each row execute function public.score_seo_topic_intelligence();

create table public.seo_topic_authority_map (
  topic_id uuid not null references public.seo_topics (id) on delete cascade,
  authority_topic_id uuid not null references public.seo_authority_topics (id) on delete cascade,
  relevance_score smallint not null check (relevance_score between 1 and 100),
  primary key (topic_id, authority_topic_id)
);

create table public.seo_topic_conversion_map (
  topic_id uuid not null references public.seo_topics (id) on delete cascade,
  cta_target_id uuid not null references public.seo_cta_targets (id) on delete restrict,
  priority smallint not null default 1 check (priority between 1 and 3),
  primary key (topic_id, cta_target_id)
);

create table public.seo_keyword_targets (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'),
  keyword text not null check (char_length(btrim(keyword)) between 2 and 180),
  normalized_keyword text not null check (char_length(btrim(normalized_keyword)) between 2 and 180),
  search_intent text not null check (search_intent in (
    'informational','commercial','transactional','navigational',
    'comparison','inspirational','educational'
  )),
  created_at timestamptz not null default now(),
  unique (locale, normalized_keyword)
);

create table public.seo_topic_keywords (
  topic_id uuid not null references public.seo_topics (id) on delete cascade,
  keyword_id uuid not null references public.seo_keyword_targets (id) on delete cascade,
  role text not null check (role in ('primary','secondary','supporting')),
  created_at timestamptz not null default now(),
  primary key (topic_id, keyword_id)
);
create unique index seo_topic_primary_keyword_unique_idx
on public.seo_topic_keywords (topic_id) where role = 'primary';
create unique index seo_keyword_canonical_topic_unique_idx
on public.seo_topic_keywords (keyword_id) where role = 'primary';

alter table public.seo_topic_relations
  add column relation_type text not null default 'related' check (relation_type in (
    'related','faq','memory-idea','activity','checklist','template'
  )),
  add column semantic_score numeric(5,4) not null default 0.5 check (semantic_score between 0 and 1);

create function public.validate_seo_topic_relation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  source_topic public.seo_topics;
  target_topic public.seo_topics;
begin
  select * into source_topic from public.seo_topics where id = new.source_topic_id;
  select * into target_topic from public.seo_topics where id = new.target_topic_id;
  if source_topic.cluster_id <> target_topic.cluster_id
    or source_topic.locale <> target_topic.locale then
    raise exception 'SEO topic relations must remain inside the localized cluster';
  end if;
  return new;
end;
$$;

create trigger seo_topic_relations_validate_cluster
before insert or update on public.seo_topic_relations
for each row execute function public.validate_seo_topic_relation();

create table public.seo_topic_metrics_daily (
  topic_id uuid not null references public.seo_topics (id) on delete cascade,
  metric_date date not null,
  impressions bigint not null default 0 check (impressions >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  ctr numeric(7,4) not null default 0 check (ctr between 0 and 100),
  average_position numeric(8,3) check (average_position is null or average_position >= 0),
  organic_visits bigint not null default 0 check (organic_visits >= 0),
  conversions bigint not null default 0 check (conversions >= 0),
  premium_conversions bigint not null default 0 check (premium_conversions >= 0),
  revenue_attribution numeric(14,2) not null default 0 check (revenue_attribution >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (topic_id, metric_date),
  constraint seo_topic_metrics_clicks check (clicks <= impressions),
  constraint seo_topic_metrics_conversion_order check (premium_conversions <= conversions)
);
create index seo_topic_metrics_date_idx on public.seo_topic_metrics_daily (metric_date desc, topic_id);

insert into public.seo_clusters (
  category, locale, slug, title, description, status, domain_id
)
select d.slug, l.locale, d.slug, l.name, l.description, 'draft', d.id
from public.seo_domains d
join public.seo_domain_localizations l on l.domain_id = d.id
on conflict (locale, category, slug) do nothing;

insert into public.seo_topics (
  cluster_id, locale, slug, title, description, depth, semantic_terms, status
)
select c.id, c.locale, d.slug, l.name, l.description, 1, array[d.slug], 'draft'
from public.seo_clusters c
join public.seo_domains d on d.id = c.domain_id and d.slug = c.category
join public.seo_domain_localizations l on l.domain_id = d.id and l.locale = c.locale
on conflict (cluster_id, parent_id, locale, slug) do nothing;

insert into public.seo_topic_intelligence (
  topic_id, domain_id, template_id, search_intent, seo_value, evergreen_score,
  premium_conversion_score, parent_value_score, competition_score,
  internal_link_score, authority_contribution_score, intent_quality_score,
  internal_link_quality_score, conversion_quality_score,
  information_value_score, uniqueness_score
)
select t.id, d.id, st.id,
  case
    when d.slug in ('memory-ideas','photo-ideas','video-ideas','letters-to-child','quotes','celebrations') then 'inspirational'
    when d.slug in ('milestones','growth','learning','education','emotions','health','sleep','food') then 'educational'
    when d.slug in ('templates','memory-book','digital-memory','keepsakes') then 'commercial'
    else 'informational'
  end,
  d.authority_score, 90,
  case when d.slug in ('memory-book','digital-memory','templates','journaling') then 90 else 65 end,
  85, 55, 70, d.authority_score, 90, 70, 75, 85, 90
from public.seo_topics t
join public.seo_clusters c on c.id = t.cluster_id
join public.seo_domains d on d.id = c.domain_id
join public.seo_templates st on st.slug = case
  when d.slug in ('checklists') then 'checklist'
  when d.slug in ('templates') then 'templates'
  when d.slug in ('questions') then 'faq'
  when d.slug in ('memory-ideas','photo-ideas','video-ideas','activities','quotes') then 'ideas'
  else 'knowledge'
end
on conflict (topic_id) do nothing;

insert into public.seo_topic_conversion_map (topic_id, cta_target_id, priority)
select t.id, cta.id, 1
from public.seo_topics t
join public.seo_clusters c on c.id = t.cluster_id
join public.seo_domains d on d.id = c.domain_id
join public.seo_cta_targets cta on cta.slug = case
  when d.slug in ('memory-book','keepsakes','templates') then 'memory-book'
  when d.slug in ('digital-memory','journaling','milestones','growth') then 'timeline'
  when d.slug in ('activities','photo-ideas','video-ideas','memory-ideas') then 'register'
  else 'premium'
end
on conflict do nothing;

insert into public.seo_topic_authority_map (topic_id, authority_topic_id, relevance_score)
select t.id, a.id, greatest(60, d.authority_score)
from public.seo_topics t
join public.seo_clusters c on c.id = t.cluster_id
join public.seo_domains d on d.id = c.domain_id
join public.seo_authority_topics a on a.slug = case
  when d.slug = 'milestones' then 'milestones'
  when d.slug = 'memory-book' then 'memory-book'
  when d.slug = 'memory-ideas' then 'memory-ideas'
  when d.slug in ('baby','newborn','pregnancy') then 'baby-memories'
  when d.slug = 'digital-memory' then 'digital-baby-book'
  when d.slug in ('journaling','letters-to-child') then 'child-memory-journal'
  else 'family-memory'
end
on conflict do nothing;

alter table public.seo_domains enable row level security;
alter table public.seo_domain_localizations enable row level security;
alter table public.seo_templates enable row level security;
alter table public.seo_cta_targets enable row level security;
alter table public.seo_authority_topics enable row level security;
alter table public.seo_topic_intelligence enable row level security;
alter table public.seo_topic_authority_map enable row level security;
alter table public.seo_topic_conversion_map enable row level security;
alter table public.seo_keyword_targets enable row level security;
alter table public.seo_topic_keywords enable row level security;
alter table public.seo_topic_metrics_daily enable row level security;

alter table public.seo_domains force row level security;
alter table public.seo_domain_localizations force row level security;
alter table public.seo_templates force row level security;
alter table public.seo_cta_targets force row level security;
alter table public.seo_authority_topics force row level security;
alter table public.seo_topic_intelligence force row level security;
alter table public.seo_topic_authority_map force row level security;
alter table public.seo_topic_conversion_map force row level security;
alter table public.seo_keyword_targets force row level security;
alter table public.seo_topic_keywords force row level security;
alter table public.seo_topic_metrics_daily force row level security;

create policy "seo_domains_read_active" on public.seo_domains
for select to anon, authenticated using (status = 'active');
create policy "seo_domain_localizations_read_active" on public.seo_domain_localizations
for select to anon, authenticated using (
  exists (select 1 from public.seo_domains d where d.id = domain_id and d.status = 'active')
);
create policy "seo_templates_read_active" on public.seo_templates
for select to anon, authenticated using (status = 'active');
create policy "seo_cta_targets_read_active" on public.seo_cta_targets
for select to anon, authenticated using (status = 'active');

revoke all on public.seo_domains, public.seo_domain_localizations,
  public.seo_templates, public.seo_cta_targets, public.seo_authority_topics,
  public.seo_topic_intelligence, public.seo_topic_authority_map,
  public.seo_topic_conversion_map, public.seo_keyword_targets,
  public.seo_topic_keywords, public.seo_topic_metrics_daily from anon, authenticated;
grant select on public.seo_domains, public.seo_domain_localizations,
  public.seo_templates, public.seo_cta_targets to anon, authenticated;

create trigger seo_domains_set_updated_at before update on public.seo_domains
for each row execute function public.set_updated_at();
create trigger seo_domain_localizations_set_updated_at before update on public.seo_domain_localizations
for each row execute function public.set_updated_at();
create trigger seo_templates_set_updated_at before update on public.seo_templates
for each row execute function public.set_updated_at();
create trigger seo_cta_targets_set_updated_at before update on public.seo_cta_targets
for each row execute function public.set_updated_at();
create trigger seo_authority_topics_set_updated_at before update on public.seo_authority_topics
for each row execute function public.set_updated_at();
create trigger seo_topic_intelligence_set_updated_at before update on public.seo_topic_intelligence
for each row execute function public.set_updated_at();
create trigger seo_topic_metrics_set_updated_at before update on public.seo_topic_metrics_daily
for each row execute function public.set_updated_at();

comment on table public.seo_topic_intelligence is 'Search intent, priority, tier, quality, freshness and future AI workflow state for every SEO topic.';
comment on table public.seo_topic_metrics_daily is 'Daily organic acquisition and revenue attribution facts by SEO topic.';
