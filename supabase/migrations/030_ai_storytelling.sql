alter table public.ai_analysis
  add column if not exists memory_quote text,
  add column if not exists importance_score smallint;

alter table public.ai_analysis
  drop constraint if exists ai_analysis_emotion_value,
  add constraint ai_analysis_emotion_value check (
    emotion is null or emotion in (
      'joy', 'pride', 'love', 'calm', 'sadness', 'fear', 'surprise',
      'neutral', 'excitement', 'curiosity'
    )
  ),
  add constraint ai_analysis_memory_quote_length check (
    memory_quote is null or char_length(btrim(memory_quote)) between 1 and 240
  ),
  add constraint ai_analysis_importance_score_range check (
    importance_score is null or importance_score between 1 and 100
  );

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
    child_id, event_id, short_title, summary, memory_quote, importance_score,
    analysis, recommendations, confidence_score, emotion, keywords,
    development_categories, input_hash, prompt_version, model
  ) values (
    target_child_id,
    target_event_id,
    target_content ->> 'shortTitle',
    target_content ->> 'summary',
    target_content ->> 'memoryQuote',
    (target_content ->> 'importance')::smallint,
    jsonb_build_object(
      'emotion', target_content ->> 'emotion',
      'keywords', target_content -> 'keywords',
      'developmentCategories', target_content -> 'developmentCategories',
      'memoryQuote', target_content ->> 'memoryQuote',
      'importance', (target_content ->> 'importance')::smallint
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
    or not public.can_run_ai_job(owner_id, 'memory_insight')
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
  values (owner_id, new.child_id, new.id, 'memory_insight', source_hash, 'memory-insight-v2')
  on conflict do nothing;
  return new;
end;
$$;

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

  with eligible as (
    select c.id child_id, c.user_id
    from public.children c
    join public.user_settings us on us.user_id = c.user_id and us.ai_enabled = true
    where c.archived_at is null and public.user_has_ai_entitlement(c.user_id)
  ), periods as (
    select *, 'weekly_story'::text kind,
      date_trunc('week', reference_time - interval '1 week')::date period_start,
      (date_trunc('week', reference_time)::date - 1) period_end,
      'weekly-story-v2'::text prompt_version
    from eligible
    union all
    select *, 'monthly_story',
      date_trunc('month', reference_time - interval '1 month')::date,
      (date_trunc('month', reference_time)::date - 1),
      'monthly-story-v2'
    from eligible
    union all
    select *, 'year_book',
      date_trunc('year', reference_time - interval '1 year')::date,
      (date_trunc('year', reference_time)::date - 1),
      'year-book-v2'
    from eligible
  )
  insert into public.ai_jobs (
    user_id, child_id, kind, period_start, period_end,
    input_hash, prompt_version, available_at
  )
  select p.user_id, p.child_id, p.kind, p.period_start, p.period_end,
    encode(digest(concat_ws('|', p.child_id::text, p.kind, p.period_start::text, p.period_end::text), 'sha256'), 'hex'),
    p.prompt_version,
    reference_time + case
      when p.kind = 'year_book' then interval '1 hour'
      when p.kind = 'monthly_story' then interval '10 minutes'
      else interval '0 minutes'
    end
  from periods p
  where not exists (
    select 1 from public.ai_artifacts a
    where a.child_id = p.child_id
      and a.kind = p.kind
      and a.period_start = p.period_start
      and a.period_end = p.period_end
  )
  on conflict do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

update public.ai_jobs old_job
set status = 'skipped', completed_at = now(), error_code = 'superseded_prompt_version'
where old_job.status = 'pending'
  and old_job.prompt_version in (
    'memory-insight-v1', 'weekly-story-v1', 'monthly-story-v1', 'year-book-v1'
  )
  and exists (
    select 1 from public.ai_jobs new_job
    where new_job.child_id = old_job.child_id
      and new_job.kind = old_job.kind
      and new_job.input_hash = old_job.input_hash
      and new_job.prompt_version = replace(old_job.prompt_version, '-v1', '-v2')
  );

update public.ai_jobs
set prompt_version = case kind
  when 'memory_insight' then 'memory-insight-v2'
  when 'weekly_story' then 'weekly-story-v2'
  when 'monthly_story' then 'monthly-story-v2'
  when 'year_book' then 'year-book-v2'
end
where status = 'pending'
  and prompt_version in (
    'memory-insight-v1', 'weekly-story-v1', 'monthly-story-v1', 'year-book-v1'
  );

create or replace function public.enqueue_ai_history(target_child_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  actor_id uuid := auth.uid();
  inserted_count integer := 0;
  restored_count integer := 0;
begin
  if actor_id is null or not public.user_has_ai_entitlement(actor_id) then
    raise exception 'premium_required' using errcode = '42501';
  end if;

  update public.ai_jobs j
  set status = 'pending', attempts = 0, available_at = now(), locked_at = null,
    completed_at = null, error_code = null, prompt_version = 'memory-insight-v2', updated_at = now()
  from public.children c
  where j.child_id = c.id and c.user_id = actor_id
    and j.kind = 'memory_insight' and j.status = 'skipped'
    and (target_child_id is null or j.child_id = target_child_id)
    and not exists (select 1 from public.ai_analysis aa where aa.event_id = j.event_id)
    and not exists (
      select 1 from public.ai_jobs newer
      where newer.child_id = j.child_id and newer.kind = j.kind
        and newer.input_hash = j.input_hash and newer.prompt_version = 'memory-insight-v2'
    );
  get diagnostics restored_count = row_count;

  insert into public.ai_jobs (
    user_id, child_id, event_id, kind, input_hash, prompt_version, available_at
  )
  select actor_id, e.child_id, e.id, 'memory_insight',
    encode(digest(concat_ws('|', e.id::text, e.title, coalesce(e.description, ''), e.occurred_at::text), 'sha256'), 'hex'),
    'memory-insight-v2', now()
  from public.events e join public.children c on c.id = e.child_id
  where c.user_id = actor_id and c.archived_at is null and e.archived_at is null
    and (target_child_id is null or e.child_id = target_child_id)
    and not exists (select 1 from public.ai_analysis aa where aa.event_id = e.id)
  on conflict do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count + restored_count;
end;
$$;

alter function public.get_memory_of_the_day(uuid, date)
  rename to get_memory_of_the_day_base;

revoke all on function public.get_memory_of_the_day_base(uuid, date)
from public, anon, authenticated;

create or replace function public.get_memory_of_the_day(
  target_child_id uuid,
  target_date date default (timezone('Europe/Istanbul', now()))::date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  quote_text text;
begin
  result := public.get_memory_of_the_day_base(target_child_id, target_date);
  if result is null then return null; end if;
  if coalesce(result ->> 'memoryQuote', '') <> '' then return result; end if;

  select aa.memory_quote into quote_text
  from public.ai_analysis aa
  where aa.event_id = (result ->> 'eventId')::uuid
  order by aa.created_at desc
  limit 1;

  result := result || jsonb_build_object('memoryQuote', coalesce(quote_text, ''));

  update public.ai_artifacts a
  set content = result
  where a.child_id = target_child_id
    and a.kind = 'memory_of_day'
    and a.period_start = target_date;

  return result;
end;
$$;

revoke all on function public.get_memory_of_the_day(uuid, date) from public, anon;
grant execute on function public.get_memory_of_the_day(uuid, date) to authenticated;

create or replace function public.get_smart_dashboard_intelligence(target_child_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with allowed as (
    select c.id from public.children c
    where c.id = target_child_id and c.user_id = (select auth.uid()) and c.archived_at is null
  ), latest as (
    select e.id, e.title, e.occurred_at from public.events e join allowed a on a.id = e.child_id
    where e.archived_at is null order by e.created_at desc limit 1
  ), notable as (
    select e.id, coalesce(aa.short_title, e.title) title, aa.summary, aa.memory_quote, e.occurred_at
    from public.ai_analysis aa join public.events e on e.id = aa.event_id join allowed a on a.id = e.child_id
    where e.archived_at is null
    order by aa.importance_score desc nulls last, e.importance = 'critical' desc, e.importance = 'high' desc, aa.created_at desc limit 1
  ), emotional as (
    select e.id, coalesce(aa.short_title, e.title) title, aa.summary, aa.memory_quote, e.occurred_at
    from public.ai_analysis aa join public.events e on e.id = aa.event_id join allowed a on a.id = e.child_id
    where e.archived_at is null and aa.emotion in ('love', 'joy', 'pride')
    order by e.is_favorite desc, aa.importance_score desc nulls last, aa.created_at desc limit 1
  ), favorites as (
    select count(*)::integer count from public.events e join allowed a on a.id = e.child_id
    where e.archived_at is null and e.is_favorite = true
  ), latest_story as (
    select a.created_at, a.content ->> 'story' story from public.ai_artifacts a join allowed al on al.id = a.child_id
    where a.kind in ('weekly_story', 'monthly_story') order by a.period_end desc nulls last, a.created_at desc limit 1
  ), activities as (
    select coalesce(jsonb_agg(name order by total desc), '[]'::jsonb) names from (
      select ec.name, count(*) total from public.events e join allowed a on a.id = e.child_id
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
