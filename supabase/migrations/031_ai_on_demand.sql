create or replace function public.request_ai_story(
  target_child_id uuid,
  target_kind text,
  reference_time timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  actor_id uuid := auth.uid();
  story_start date;
  story_end date;
  story_version text;
  source_hash text;
  artifact_id uuid;
  job_id uuid;
begin
  if target_kind not in ('weekly_story', 'monthly_story', 'year_book') then
    raise exception 'invalid_story_kind' using errcode = '22023';
  end if;
  if actor_id is null or not public.user_has_ai_entitlement(actor_id) then
    raise exception 'premium_required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.children c
    where c.id = target_child_id and c.user_id = actor_id and c.archived_at is null
  ) then
    raise exception 'insufficient_privilege' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.user_settings us
    where us.user_id = actor_id and us.ai_enabled = false
  ) then
    return jsonb_build_object('status', 'disabled');
  end if;

  if target_kind = 'weekly_story' then
    story_start := date_trunc('week', reference_time - interval '1 week')::date;
    story_end := date_trunc('week', reference_time)::date - 1;
    story_version := 'weekly-story-v2';
  elsif target_kind = 'monthly_story' then
    story_start := date_trunc('month', reference_time - interval '1 month')::date;
    story_end := date_trunc('month', reference_time)::date - 1;
    story_version := 'monthly-story-v2';
  else
    story_start := date_trunc('year', reference_time - interval '1 year')::date;
    story_end := date_trunc('year', reference_time)::date - 1;
    story_version := 'year-book-v2';
  end if;

  select a.id into artifact_id
  from public.ai_artifacts a
  where a.child_id = target_child_id and a.kind = target_kind
    and a.period_start = story_start and a.period_end = story_end
  order by a.created_at desc limit 1;
  if artifact_id is not null then
    return jsonb_build_object('status', 'cached', 'artifactId', artifact_id);
  end if;

  source_hash := encode(digest(
    concat_ws('|', target_child_id::text, target_kind, story_start::text, story_end::text),
    'sha256'
  ), 'hex');

  insert into public.ai_jobs (
    user_id, child_id, kind, period_start, period_end,
    input_hash, prompt_version, available_at
  ) values (
    actor_id, target_child_id, target_kind, story_start, story_end,
    source_hash, story_version, now()
  )
  on conflict (child_id, kind, prompt_version, input_hash)
  do update set
    status = case when public.ai_jobs.status in ('failed', 'skipped') then 'pending' else public.ai_jobs.status end,
    attempts = case when public.ai_jobs.status in ('failed', 'skipped') then 0 else public.ai_jobs.attempts end,
    available_at = case when public.ai_jobs.status in ('failed', 'skipped') then now() else public.ai_jobs.available_at end,
    error_code = case when public.ai_jobs.status in ('failed', 'skipped') then null else public.ai_jobs.error_code end,
    completed_at = case when public.ai_jobs.status in ('failed', 'skipped') then null else public.ai_jobs.completed_at end
  returning id into job_id;

  return jsonb_build_object('status', 'queued', 'jobId', job_id);
end;
$$;

revoke all on function public.request_ai_story(uuid, text, timestamptz) from public, anon;
grant execute on function public.request_ai_story(uuid, text, timestamptz) to authenticated;
