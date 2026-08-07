create extension if not exists vector with schema extensions;

alter table public.ai_analysis
  add column if not exists short_title text,
  add column if not exists emotion text,
  add column if not exists keywords text[] not null default '{}',
  add column if not exists development_categories text[] not null default '{}',
  add column if not exists input_hash text,
  add column if not exists prompt_version text not null default 'memory-insight-v1',
  add column if not exists updated_at timestamptz not null default now();

alter table public.ai_analysis
  add constraint ai_analysis_short_title_length
    check (short_title is null or char_length(btrim(short_title)) between 1 and 120),
  add constraint ai_analysis_emotion_value
    check (emotion is null or emotion in ('joy', 'pride', 'love', 'calm', 'sadness', 'fear', 'surprise', 'neutral')),
  add constraint ai_analysis_input_hash_format
    check (input_hash is null or input_hash ~ '^[a-f0-9]{64}$');

create unique index ai_analysis_input_hash_unique_idx
on public.ai_analysis (input_hash)
where input_hash is not null;

create table public.ai_artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  kind text not null check (kind in (
    'memory_insight', 'weekly_story', 'monthly_story', 'year_book',
    'development_insight', 'dashboard_insight', 'memory_highlight'
  )),
  period_start date,
  period_end date,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  source_event_ids uuid[] not null default '{}',
  input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
  prompt_version text not null check (char_length(btrim(prompt_version)) between 1 and 80),
  model text not null check (char_length(btrim(model)) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_artifacts_period_order check (
    period_start is null or period_end is null or period_start <= period_end
  )
);

comment on table public.ai_artifacts is 'Immutable, versioned and hash-addressed AI outputs reused across KidMemoir experiences.';

create unique index ai_artifacts_cache_unique_idx
on public.ai_artifacts (child_id, kind, prompt_version, input_hash);
create index ai_artifacts_child_kind_created_idx
on public.ai_artifacts (child_id, kind, created_at desc);
create index ai_artifacts_event_idx on public.ai_artifacts (event_id) where event_id is not null;
create index ai_artifacts_period_idx
on public.ai_artifacts (child_id, kind, period_start desc, period_end desc);

create table public.ai_event_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  event_id uuid not null unique references public.events (id) on delete cascade,
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  model text not null check (char_length(btrim(model)) between 1 and 100),
  embedding extensions.vector(1536) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_event_embeddings_child_idx on public.ai_event_embeddings (child_id, event_id);
create index ai_event_embeddings_vector_idx on public.ai_event_embeddings
using hnsw (embedding extensions.vector_cosine_ops);

create table public.ai_query_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  query_hash text not null check (query_hash ~ '^[a-f0-9]{64}$'),
  model text not null check (char_length(btrim(model)) between 1 and 100),
  embedding extensions.vector(1536) not null,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  unique (user_id, child_id, query_hash, model)
);

create index ai_query_embeddings_expiry_idx on public.ai_query_embeddings (expires_at);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  kind text not null check (kind in ('memory_insight', 'weekly_story', 'monthly_story', 'year_book')),
  period_start date,
  period_end date,
  input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
  prompt_version text not null check (char_length(btrim(prompt_version)) between 1 and 80),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'skipped')),
  attempts smallint not null default 0 check (attempts between 0 and 5),
  max_attempts smallint not null default 3 check (max_attempts between 1 and 5),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  completed_at timestamptz,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, kind, prompt_version, input_hash)
);

comment on table public.ai_jobs is 'Durable idempotent background queue for AI artifacts.';

create index ai_jobs_claim_idx on public.ai_jobs (status, available_at, created_at)
where status in ('pending', 'processing');
create index ai_jobs_child_kind_idx on public.ai_jobs (child_id, kind, created_at desc);

alter table public.ai_usage
  add column if not exists event_id uuid references public.events (id) on delete set null,
  add column if not exists artifact_id uuid references public.ai_artifacts (id) on delete set null,
  add column if not exists operation text not null default 'legacy',
  add column if not exists prompt_version text,
  add column if not exists input_hash text,
  add column if not exists duration_ms integer check (duration_ms is null or duration_ms >= 0),
  add column if not exists success boolean not null default true,
  add column if not exists error_code text;

create index ai_usage_operation_created_idx on public.ai_usage (operation, created_at desc);
create index ai_usage_input_hash_idx on public.ai_usage (input_hash) where input_hash is not null;

alter table public.ai_artifacts enable row level security;
alter table public.ai_event_embeddings enable row level security;
alter table public.ai_query_embeddings enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.ai_artifacts force row level security;
alter table public.ai_event_embeddings force row level security;
alter table public.ai_query_embeddings force row level security;
alter table public.ai_jobs force row level security;

create policy "ai_artifacts_select_own"
on public.ai_artifacts for select to authenticated
using (user_id = (select auth.uid()));

create policy "ai_event_embeddings_select_own"
on public.ai_event_embeddings for select to authenticated
using (user_id = (select auth.uid()));

revoke all on public.ai_jobs from anon, authenticated;
revoke insert, update, delete on public.ai_artifacts from anon, authenticated;
revoke insert, update, delete on public.ai_event_embeddings from anon, authenticated;
revoke all on public.ai_query_embeddings from anon, authenticated;

create trigger ai_analysis_set_updated_at
before update on public.ai_analysis
for each row execute function public.set_updated_at();

create trigger ai_artifacts_set_updated_at
before update on public.ai_artifacts
for each row execute function public.set_updated_at();

create trigger ai_event_embeddings_set_updated_at
before update on public.ai_event_embeddings
for each row execute function public.set_updated_at();

create trigger ai_jobs_set_updated_at
before update on public.ai_jobs
for each row execute function public.set_updated_at();

create trigger ai_artifacts_validate_event_child
before insert or update of child_id, event_id on public.ai_artifacts
for each row execute function public.validate_event_child_reference();

create trigger ai_event_embeddings_validate_event_child
before insert or update of child_id, event_id on public.ai_event_embeddings
for each row execute function public.validate_event_child_reference();

create trigger ai_jobs_validate_event_child
before insert or update of child_id, event_id on public.ai_jobs
for each row execute function public.validate_event_child_reference();

create or replace function public.user_has_ai_entitlement(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = target_user_id
      and s.plan = 'premium'
      and (
        s.status in ('active', 'trialing', 'past_due')
        or (s.status = 'canceled' and s.current_period_end > now())
      )
  );
$$;

revoke all on function public.user_has_ai_entitlement(uuid) from public, anon, authenticated;
grant execute on function public.user_has_ai_entitlement(uuid) to service_role;

create or replace function public.enqueue_memory_ai_job()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  owner_id uuid;
  source_hash text;
begin
  select c.user_id into owner_id from public.children c where c.id = new.child_id;
  if owner_id is null
    or not public.user_has_ai_entitlement(owner_id)
    or exists (
      select 1 from public.user_settings us
      where us.user_id = owner_id and us.ai_enabled = false
    ) then
    return new;
  end if;

  source_hash := encode(digest(
    concat_ws('|', new.id::text, new.title, coalesce(new.description, ''), new.occurred_at::text),
    'sha256'
  ), 'hex');

  insert into public.ai_jobs (user_id, child_id, event_id, kind, input_hash, prompt_version)
  values (owner_id, new.child_id, new.id, 'memory_insight', source_hash, 'memory-insight-v1')
  on conflict do nothing;
  return new;
end;
$$;

revoke all on function public.enqueue_memory_ai_job() from public, anon, authenticated;

create trigger events_enqueue_memory_ai
after insert on public.events
for each row execute function public.enqueue_memory_ai_job();

create or replace function public.enqueue_due_ai_stories(reference_time timestamptz default now())
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  inserted_count integer := 0;
begin
  if auth.role() <> 'service_role' then
    raise exception 'insufficient_privilege';
  end if;

  insert into public.ai_jobs (
    user_id, child_id, event_id, kind, input_hash, prompt_version, available_at
  )
  select
    c.user_id,
    e.child_id,
    e.id,
    'memory_insight',
    encode(digest(
      concat_ws('|', e.id::text, e.title, coalesce(e.description, ''), e.occurred_at::text),
      'sha256'
    ), 'hex'),
    'memory-insight-v1',
    reference_time
  from public.events e
  join public.children c on c.id = e.child_id and c.archived_at is null
  join public.user_settings us on us.user_id = c.user_id and us.ai_enabled = true
  where e.archived_at is null
    and public.user_has_ai_entitlement(c.user_id)
    and not exists (
      select 1 from public.ai_analysis aa where aa.event_id = e.id
    )
  on conflict do nothing;

  with eligible as (
    select c.id child_id, c.user_id
    from public.children c
    join public.user_settings us on us.user_id = c.user_id and us.ai_enabled = true
    where c.archived_at is null and public.user_has_ai_entitlement(c.user_id)
  ), periods as (
    select *, 'weekly_story'::text kind,
      date_trunc('week', reference_time - interval '1 week')::date period_start,
      (date_trunc('week', reference_time)::date - 1) period_end,
      'weekly-story-v1'::text prompt_version
    from eligible
    union all
    select *, 'monthly_story',
      date_trunc('month', reference_time - interval '1 month')::date,
      (date_trunc('month', reference_time)::date - 1),
      'monthly-story-v1'
    from eligible
    union all
    select *, 'year_book',
      date_trunc('year', reference_time - interval '1 year')::date,
      (date_trunc('year', reference_time)::date - 1),
      'year-book-v1'
    from eligible
  )
  insert into public.ai_jobs (
    user_id, child_id, kind, period_start, period_end,
    input_hash, prompt_version, available_at
  )
  select user_id, child_id, kind,
    period_start, period_end,
    encode(digest(concat_ws('|', child_id::text, kind, period_start::text, period_end::text), 'sha256'), 'hex'),
    prompt_version,
    reference_time + case
      when kind = 'year_book' then interval '1 hour'
      when kind = 'monthly_story' then interval '10 minutes'
      else interval '0 minutes'
    end
  from periods
  on conflict do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.enqueue_due_ai_stories(timestamptz) from public, anon, authenticated;
grant execute on function public.enqueue_due_ai_stories(timestamptz) to service_role;

create or replace function public.claim_ai_jobs(batch_size integer default 5)
returns setof public.ai_jobs
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'insufficient_privilege';
  end if;
  return query
  with candidates as (
    select id
    from public.ai_jobs
    where (
      status = 'pending'
      or (status = 'processing' and locked_at < now() - interval '10 minutes')
    )
      and available_at <= now()
      and attempts < max_attempts
    order by available_at, created_at
    for update skip locked
    limit greatest(1, least(batch_size, 20))
  )
  update public.ai_jobs j
  set status = 'processing', locked_at = now(), attempts = attempts + 1, updated_at = now()
  from candidates c
  where j.id = c.id
  returning j.*;
end;
$$;

revoke all on function public.claim_ai_jobs(integer) from public, anon, authenticated;
grant execute on function public.claim_ai_jobs(integer) to service_role;

create or replace function public.match_memory_embeddings(
  target_child_id uuid,
  query_embedding extensions.vector(1536),
  match_count integer default 10,
  excluded_event_id uuid default null
)
returns table (event_id uuid, similarity double precision)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select e.event_id, 1 - (e.embedding <=> query_embedding) similarity
  from public.ai_event_embeddings e
  where e.child_id = target_child_id
    and e.user_id = (select auth.uid())
    and (excluded_event_id is null or e.event_id <> excluded_event_id)
  order by e.embedding <=> query_embedding
  limit greatest(1, least(match_count, 50));
$$;

grant execute on function public.match_memory_embeddings(uuid, extensions.vector, integer, uuid) to authenticated;

create or replace function public.get_smart_dashboard_intelligence(target_child_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with allowed as (
    select c.id
    from public.children c
    where c.id = target_child_id
      and c.user_id = (select auth.uid())
      and c.archived_at is null
  ), latest as (
    select e.id, e.title, e.occurred_at
    from public.events e join allowed a on a.id = e.child_id
    where e.archived_at is null
    order by e.created_at desc limit 1
  ), notable as (
    select e.id, coalesce(aa.short_title, e.title) title, aa.summary, e.occurred_at
    from public.ai_analysis aa
    join public.events e on e.id = aa.event_id
    join allowed a on a.id = e.child_id
    where e.archived_at is null
    order by e.importance = 'critical' desc, e.importance = 'high' desc, aa.created_at desc
    limit 1
  ), emotional as (
    select e.id, coalesce(aa.short_title, e.title) title, aa.summary, e.occurred_at
    from public.ai_analysis aa
    join public.events e on e.id = aa.event_id
    join allowed a on a.id = e.child_id
    where e.archived_at is null and aa.emotion in ('love', 'joy', 'pride')
    order by e.is_favorite desc, aa.created_at desc limit 1
  ), favorites as (
    select count(*)::integer count
    from public.events e join allowed a on a.id = e.child_id
    where e.archived_at is null and e.is_favorite = true
  ), latest_story as (
    select a.created_at, a.content ->> 'story' story
    from public.ai_artifacts a join allowed al on al.id = a.child_id
    where a.kind in ('weekly_story', 'monthly_story')
    order by a.period_end desc nulls last, a.created_at desc limit 1
  ), activities as (
    select coalesce(jsonb_agg(name order by total desc), '[]'::jsonb) names
    from (
      select ec.name, count(*) total
      from public.events e
      join allowed a on a.id = e.child_id
      join public.event_categories ec on ec.id = e.category_id
      where e.archived_at is null and e.occurred_at >= now() - interval '30 days'
      group by ec.name order by total desc limit 3
    ) ranked
  )
  select jsonb_build_object(
    'latestMemory', (select to_jsonb(latest) from latest),
    'notable', (select to_jsonb(notable) from notable),
    'emotionalMemory', (select to_jsonb(emotional) from emotional),
    'latestStory', (select to_jsonb(latest_story) from latest_story),
    'favoriteCount', coalesce((select count from favorites), 0),
    'recentActivities', coalesce((select names from activities), '[]'::jsonb)
  );
$$;

grant execute on function public.get_smart_dashboard_intelligence(uuid) to authenticated;

create or replace function public.save_memory_ai_insight(
  target_user_id uuid,
  target_child_id uuid,
  target_event_id uuid,
  target_input_hash text,
  target_prompt_version text,
  target_model text,
  target_content jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  artifact_id uuid;
begin
  if auth.role() <> 'service_role' then
    raise exception 'insufficient_privilege';
  end if;
  insert into public.ai_analysis (
    child_id, event_id, short_title, summary, analysis, recommendations,
    confidence_score, emotion, keywords, development_categories,
    input_hash, prompt_version, model
  ) values (
    target_child_id,
    target_event_id,
    target_content ->> 'shortTitle',
    target_content ->> 'summary',
    jsonb_build_object(
      'emotion', target_content ->> 'emotion',
      'keywords', target_content -> 'keywords',
      'developmentCategories', target_content -> 'developmentCategories'
    )::text,
    null,
    null,
    target_content ->> 'emotion',
    array(select jsonb_array_elements_text(target_content -> 'keywords')),
    array(select jsonb_array_elements_text(target_content -> 'developmentCategories')),
    target_input_hash,
    target_prompt_version,
    target_model
  ) on conflict (input_hash) where input_hash is not null do nothing;

  insert into public.ai_artifacts (
    user_id, child_id, event_id, kind, content, source_event_ids,
    input_hash, prompt_version, model
  ) values (
    target_user_id, target_child_id, target_event_id, 'memory_insight',
    target_content, array[target_event_id], target_input_hash,
    target_prompt_version, target_model
  )
  on conflict (child_id, kind, prompt_version, input_hash)
  do update set updated_at = public.ai_artifacts.updated_at
  returning id into artifact_id;

  return artifact_id;
end;
$$;

revoke all on function public.save_memory_ai_insight(uuid, uuid, uuid, text, text, text, jsonb)
from public, anon, authenticated;
grant execute on function public.save_memory_ai_insight(uuid, uuid, uuid, text, text, text, jsonb)
to service_role;
