create table public.seo_clusters (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'guides', 'milestones', 'activities', 'memory-ideas', 'photo-ideas',
    'checklists', 'templates', 'questions', 'compare', 'tools', 'knowledge'
  )),
  locale text not null check (locale in ('tr', 'en')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 2 and 160),
  description text not null check (char_length(btrim(description)) between 20 and 500),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, category, slug)
);

create table public.seo_topics (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.seo_clusters (id) on delete cascade,
  parent_id uuid references public.seo_topics (id) on delete cascade,
  locale text not null check (locale in ('tr', 'en')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 2 and 160),
  description text not null check (char_length(btrim(description)) between 20 and 500),
  depth smallint not null default 1 check (depth between 1 and 3),
  semantic_terms text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seo_topics_parent_not_self check (parent_id is null or parent_id <> id),
  unique nulls not distinct (cluster_id, parent_id, locale, slug)
);

create table public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.seo_clusters (id) on delete restrict,
  topic_id uuid not null references public.seo_topics (id) on delete restrict,
  parent_page_id uuid references public.seo_pages (id) on delete set null,
  translation_key uuid not null default gen_random_uuid(),
  category text not null check (category in (
    'guides', 'milestones', 'activities', 'memory-ideas', 'photo-ideas',
    'checklists', 'templates', 'questions', 'compare', 'tools', 'knowledge'
  )),
  locale text not null check (locale in ('tr', 'en')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  slug_path text[] not null check (cardinality(slug_path) between 1 and 8),
  path_key text generated always as (array_to_string(slug_path, '/')) stored,
  title text not null check (char_length(btrim(title)) between 2 and 180),
  seo_title text not null check (char_length(btrim(seo_title)) between 20 and 70),
  seo_description text not null check (char_length(btrim(seo_description)) between 70 and 170),
  excerpt text not null check (char_length(btrim(excerpt)) between 40 and 600),
  hero jsonb not null check (jsonb_typeof(hero) = 'object'),
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  faq jsonb not null default '[]'::jsonb check (jsonb_typeof(faq) = 'array'),
  howto jsonb check (howto is null or jsonb_typeof(howto) = 'object'),
  cta jsonb not null check (jsonb_typeof(cta) = 'object'),
  difficulty text check (difficulty is null or difficulty in ('beginner', 'intermediate', 'advanced')),
  reading_time smallint not null check (reading_time between 1 and 120),
  search_intent text not null check (search_intent in ('informational', 'commercial', 'navigational', 'transactional')),
  search_volume integer check (search_volume is null or search_volume >= 0),
  parent_stage text,
  child_age_min smallint check (child_age_min is null or child_age_min between 0 and 216),
  child_age_max smallint check (child_age_max is null or child_age_max between 0 and 216),
  schema_type text not null check (schema_type in ('faq', 'howto', 'article', 'webpage', 'checklist', 'guide')),
  semantic_terms text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  content_source text not null default 'editorial' check (content_source in ('editorial', 'ai-assisted', 'imported')),
  generation_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(generation_metadata) = 'object'),
  content_hash text check (content_hash is null or content_hash ~ '^[a-f0-9]{64}$'),
  content_word_count integer not null default 0 check (content_word_count >= 0),
  quality_score smallint not null default 0 check (quality_score between 0 and 100),
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seo_pages_age_order check (
    child_age_min is null or child_age_max is null or child_age_min <= child_age_max
  ),
  constraint seo_pages_slug_path_leaf check (slug_path[cardinality(slug_path)] = slug),
  constraint seo_pages_parent_not_self check (parent_page_id is null or parent_page_id <> id),
  constraint seo_pages_publish_quality check (
    status <> 'published' or (
      published_at is not null and content_word_count >= 600 and quality_score >= 80
    )
  ),
  unique (locale, category, path_key)
);

create table public.seo_page_relations (
  source_page_id uuid not null references public.seo_pages (id) on delete cascade,
  target_page_id uuid not null references public.seo_pages (id) on delete cascade,
  relation_type text not null check (relation_type in ('related', 'prerequisite', 'next', 'faq', 'milestone', 'checklist', 'memory-idea')),
  weight numeric(5, 4) not null default 0.5 check (weight between 0 and 1),
  created_at timestamptz not null default now(),
  primary key (source_page_id, target_page_id, relation_type),
  constraint seo_page_relations_not_self check (source_page_id <> target_page_id)
);

create table public.seo_topic_relations (
  source_topic_id uuid not null references public.seo_topics (id) on delete cascade,
  target_topic_id uuid not null references public.seo_topics (id) on delete cascade,
  weight numeric(5, 4) not null default 0.5 check (weight between 0 and 1),
  created_at timestamptz not null default now(),
  primary key (source_topic_id, target_topic_id),
  constraint seo_topic_relations_not_self check (source_topic_id <> target_topic_id)
);

create unique index seo_pages_published_title_unique_idx
on public.seo_pages (locale, lower(seo_title)) where status = 'published';
create unique index seo_pages_published_description_unique_idx
on public.seo_pages (locale, lower(seo_description)) where status = 'published';
create index seo_pages_public_lookup_idx
on public.seo_pages (locale, category, path_key) where status = 'published';
create index seo_pages_topic_related_idx
on public.seo_pages (topic_id, quality_score desc, search_volume desc nulls last)
where status = 'published';
create index seo_pages_cluster_related_idx
on public.seo_pages (cluster_id, quality_score desc, updated_at desc)
where status = 'published';
create index seo_pages_semantic_terms_idx on public.seo_pages using gin (semantic_terms);
create index seo_pages_translation_idx
on public.seo_pages (translation_key, locale) where status = 'published';
create index seo_page_relations_source_idx
on public.seo_page_relations (source_page_id, weight desc);

alter table public.seo_clusters enable row level security;
alter table public.seo_topics enable row level security;
alter table public.seo_pages enable row level security;
alter table public.seo_page_relations enable row level security;
alter table public.seo_topic_relations enable row level security;

alter table public.seo_clusters force row level security;
alter table public.seo_topics force row level security;
alter table public.seo_pages force row level security;
alter table public.seo_page_relations force row level security;
alter table public.seo_topic_relations force row level security;

create policy "seo_clusters_read_public" on public.seo_clusters
for select to anon, authenticated using (status = 'published');
create policy "seo_topics_read_public" on public.seo_topics
for select to anon, authenticated using (status = 'published');
create policy "seo_pages_read_published" on public.seo_pages
for select to anon, authenticated using (status = 'published' and published_at <= now());
create policy "seo_page_relations_read_published" on public.seo_page_relations
for select to anon, authenticated using (
  exists (select 1 from public.seo_pages p where p.id = source_page_id and p.status = 'published' and p.published_at <= now())
  and exists (select 1 from public.seo_pages p where p.id = target_page_id and p.status = 'published' and p.published_at <= now())
);
create policy "seo_topic_relations_read_public" on public.seo_topic_relations
for select to anon, authenticated using (true);

revoke all on public.seo_clusters, public.seo_topics, public.seo_pages,
  public.seo_page_relations, public.seo_topic_relations from anon, authenticated;
grant select on public.seo_clusters, public.seo_topics,
  public.seo_page_relations, public.seo_topic_relations to anon, authenticated;
grant select (
  id, cluster_id, topic_id, translation_key, category, locale, slug, slug_path,
  path_key, title, seo_title, seo_description, excerpt, hero, content, faq,
  howto, cta, difficulty, reading_time, search_intent, parent_stage,
  child_age_min, child_age_max, schema_type, semantic_terms, status,
  content_word_count, quality_score, published_at, updated_at
) on public.seo_pages to anon, authenticated;

create trigger seo_clusters_set_updated_at before update on public.seo_clusters
for each row execute function public.set_updated_at();
create trigger seo_topics_set_updated_at before update on public.seo_topics
for each row execute function public.set_updated_at();
create trigger seo_pages_set_updated_at before update on public.seo_pages
for each row execute function public.set_updated_at();

create function public.validate_seo_topic_hierarchy()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_topic public.seo_topics;
  cluster_record public.seo_clusters;
begin
  select * into cluster_record from public.seo_clusters where id = new.cluster_id;
  if cluster_record.id is null or cluster_record.locale <> new.locale then
    raise exception 'SEO topic locale must match its cluster';
  end if;
  if new.parent_id is null then
    if new.depth <> 1 then raise exception 'Root SEO topic depth must be 1'; end if;
  else
    select * into parent_topic from public.seo_topics where id = new.parent_id;
    if parent_topic.id is null
      or parent_topic.cluster_id <> new.cluster_id
      or parent_topic.locale <> new.locale
      or new.depth <> parent_topic.depth + 1 then
      raise exception 'Invalid SEO topic hierarchy';
    end if;
  end if;
  return new;
end;
$$;

create function public.validate_seo_page_taxonomy()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  cluster_record public.seo_clusters;
  topic_record public.seo_topics;
begin
  select * into cluster_record from public.seo_clusters where id = new.cluster_id;
  select * into topic_record from public.seo_topics where id = new.topic_id;
  if cluster_record.id is null
    or cluster_record.locale <> new.locale
    or cluster_record.category <> new.category
    or topic_record.id is null
    or topic_record.cluster_id <> new.cluster_id
    or topic_record.locale <> new.locale then
    raise exception 'SEO page taxonomy does not match locale and category';
  end if;
  return new;
end;
$$;

create function public.validate_published_seo_page()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  locale_count integer;
  path_count integer;
  related_count integer;
  taxonomy_ready boolean;
begin
  if new.status <> 'published' then return null; end if;
  select count(distinct locale), count(distinct category || '/' || path_key)
  into locale_count, path_count
  from public.seo_pages
  where translation_key = new.translation_key
    and status = 'published'
    and published_at <= now();
  if locale_count < 2 or path_count <> 1 then
    raise exception 'Published SEO pages require complete locale coverage';
  end if;

  select exists (
    select 1
    from public.seo_clusters c
    join public.seo_topics t on t.id = new.topic_id and t.cluster_id = c.id
    where c.id = new.cluster_id
      and c.status = 'published'
      and t.status = 'published'
  ) into taxonomy_ready;
  if not taxonomy_ready then
    raise exception 'Published SEO pages require published taxonomy';
  end if;

  select count(distinct candidate_id) into related_count
  from (
    select p.id as candidate_id
    from public.seo_pages p
    where p.cluster_id = new.cluster_id
      and p.locale = new.locale
      and p.status = 'published'
      and p.published_at <= now()
      and p.id <> new.id
    union
    select r.target_page_id
    from public.seo_page_relations r
    join public.seo_pages p on p.id = r.target_page_id
    where r.source_page_id = new.id
      and p.cluster_id = new.cluster_id
      and p.locale = new.locale
      and p.status = 'published'
      and p.published_at <= now()
  ) related;
  if related_count < 5 then
    raise exception 'Published SEO pages require at least five cluster links';
  end if;
  return null;
end;
$$;

create trigger seo_topics_validate_hierarchy
before insert or update of cluster_id, parent_id, locale, depth on public.seo_topics
for each row execute function public.validate_seo_topic_hierarchy();

create trigger seo_pages_validate_taxonomy
before insert or update of cluster_id, topic_id, category, locale on public.seo_pages
for each row execute function public.validate_seo_page_taxonomy();

create constraint trigger seo_pages_validate_publication
after insert or update on public.seo_pages
deferrable initially deferred
for each row execute function public.validate_published_seo_page();

comment on table public.seo_pages is 'Localized, quality-gated programmatic SEO pages rendered by the shared content engine.';
comment on table public.seo_page_relations is 'Curated semantic links constrained to the page topic graph.';
