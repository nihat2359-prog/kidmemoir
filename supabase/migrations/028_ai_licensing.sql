alter table public.ai_usage
  add column if not exists cache_hit boolean not null default false;

create index ai_usage_user_cache_created_idx
on public.ai_usage (user_id, cache_hit, created_at desc);

create or replace function public.can_run_ai_job(
  target_user_id uuid,
  target_kind text,
  target_job_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.user_has_ai_entitlement(target_user_id) then true
    when target_kind = 'memory_insight' and target_job_id is null then (
      (select count(*)
       from public.ai_analysis aa
       join public.children c on c.id = aa.child_id
       where c.user_id = target_user_id) < 20
    )
    when target_kind = 'memory_insight' then (
      (select count(*)
       from public.ai_analysis aa
       join public.children c on c.id = aa.child_id
       where c.user_id = target_user_id)
      +
      (select count(*)
       from public.ai_jobs current_job
       join public.ai_jobs queued_job
         on queued_job.user_id = current_job.user_id
        and queued_job.kind = 'memory_insight'
        and queued_job.status = 'processing'
        and (queued_job.created_at, queued_job.id) <= (current_job.created_at, current_job.id)
       where current_job.id = target_job_id
         and current_job.user_id = target_user_id) <= 20
    )
    else false
  end;
$$;

revoke all on function public.can_run_ai_job(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.can_run_ai_job(uuid, text, uuid) to service_role;

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
  values (owner_id, new.child_id, new.id, 'memory_insight', source_hash, 'memory-insight-v1')
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
  select user_id, child_id, kind, period_start, period_end,
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
  set
    status = 'pending',
    attempts = 0,
    available_at = now(),
    locked_at = null,
    completed_at = null,
    error_code = null,
    updated_at = now()
  from public.children c
  where j.child_id = c.id
    and c.user_id = actor_id
    and j.kind = 'memory_insight'
    and j.status = 'skipped'
    and (target_child_id is null or j.child_id = target_child_id)
    and not exists (
      select 1 from public.ai_analysis aa where aa.event_id = j.event_id
    );
  get diagnostics restored_count = row_count;

  insert into public.ai_jobs (
    user_id, child_id, event_id, kind, input_hash, prompt_version, available_at
  )
  select
    actor_id,
    e.child_id,
    e.id,
    'memory_insight',
    encode(digest(
      concat_ws('|', e.id::text, e.title, coalesce(e.description, ''), e.occurred_at::text),
      'sha256'
    ), 'hex'),
    'memory-insight-v1',
    now()
  from public.events e
  join public.children c on c.id = e.child_id
  where c.user_id = actor_id
    and c.archived_at is null
    and e.archived_at is null
    and (target_child_id is null or e.child_id = target_child_id)
    and not exists (
      select 1 from public.ai_analysis aa where aa.event_id = e.id
    )
  on conflict do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count + restored_count;
end;
$$;

revoke all on function public.enqueue_ai_history(uuid) from public, anon;
grant execute on function public.enqueue_ai_history(uuid) to authenticated;
