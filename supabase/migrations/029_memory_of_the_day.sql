alter table public.ai_artifacts
  drop constraint if exists ai_artifacts_kind_check;

alter table public.ai_artifacts
  add constraint ai_artifacts_kind_check check (kind in (
    'memory_insight', 'weekly_story', 'monthly_story', 'year_book',
    'development_insight', 'dashboard_insight', 'memory_highlight',
    'memory_of_day'
  ));

create or replace function public.get_memory_of_the_day(
  target_child_id uuid,
  target_date date default (timezone('Europe/Istanbul', now()))::date
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  actor_id uuid := auth.uid();
  cache_hash text;
  cached_content jsonb;
  selected_record record;
begin
  if target_date <> (timezone('Europe/Istanbul', now()))::date then
    raise exception 'invalid_memory_date' using errcode = '22023';
  end if;

  if actor_id is null or not exists (
    select 1
    from public.children c
    where c.id = target_child_id
      and c.user_id = actor_id
      and c.archived_at is null
  ) then
    raise exception 'insufficient_privilege' using errcode = '42501';
  end if;

  cache_hash := encode(digest(
    concat_ws('|', target_child_id::text, target_date::text, 'memory-of-day-v1'),
    'sha256'
  ), 'hex');

  select a.content into cached_content
  from public.ai_artifacts a
  where a.child_id = target_child_id
    and a.kind = 'memory_of_day'
    and a.input_hash = cache_hash
    and a.prompt_version = 'memory-of-day-v1'
  limit 1;

  if cached_content is not null then
    return cached_content;
  end if;

  with recent as (
    select unnest(a.source_event_ids) event_id
    from public.ai_artifacts a
    where a.child_id = target_child_id
      and a.kind = 'memory_of_day'
      and a.period_start >= target_date - 7
      and a.period_start < target_date
  ), candidates as (
    select
      e.id,
      e.title,
      e.description,
      e.occurred_at,
      e.importance,
      e.is_favorite,
      aa.summary,
      aa.emotion,
      aa.development_categories,
      aa.keywords,
      exists (
        select 1 from public.event_media em
        where em.event_id = e.id
          and em.media_type = 'photo'
          and em.archived_at is null
      ) has_photo,
      extract(year from target_date)::integer - extract(year from e.occurred_at)::integer years_ago,
      (
        case when extract(month from e.occurred_at) = extract(month from target_date)
          and extract(day from e.occurred_at) = extract(day from target_date)
          and extract(year from e.occurred_at) < extract(year from target_date) then 120 else 0 end
        + case when coalesce(aa.development_categories, '{}') @> array['firsts']::text[] then 100 else 0 end
        + case e.importance when 'critical' then 90 when 'high' then 75 when 'medium' then 30 else 0 end
        + case when e.is_favorite then 70 else 0 end
        + case when aa.emotion in ('love', 'pride', 'joy') then 55 else 0 end
        + case when exists (
            select 1 from public.event_media em
            where em.event_id = e.id and em.media_type = 'photo' and em.archived_at is null
          ) then 35 else 0 end
        + case when coalesce(cardinality(aa.development_categories), 0) > 0 then 25 else 0 end
        - case when exists (select 1 from recent r where r.event_id = e.id) then 1000 else 0 end
      ) score
    from public.events e
    left join lateral (
      select analysis.summary, analysis.emotion, analysis.development_categories, analysis.keywords
      from public.ai_analysis analysis
      where analysis.event_id = e.id
      order by analysis.created_at desc
      limit 1
    ) aa on true
    where e.child_id = target_child_id
      and e.archived_at is null
      and e.occurred_at < (target_date + 1)::timestamptz
  )
  select *,
    case
      when extract(month from occurred_at) = extract(month from target_date)
        and extract(day from occurred_at) = extract(day from target_date)
        and years_ago > 0 then 'anniversary'
      when coalesce(development_categories, '{}') @> array['firsts']::text[] then 'first'
      when importance in ('critical', 'high') then 'milestone'
      when is_favorite then 'favorite'
      when emotion in ('love', 'pride') then 'emotional'
      when has_photo then 'photo'
      when emotion = 'joy' then 'smile'
      when coalesce(keywords, '{}') && array['family', 'aile']::text[] then 'family'
      when coalesce(cardinality(development_categories), 0) > 0 then 'development'
      else 'recommended'
    end card_type
  into selected_record
  from candidates
  order by score desc,
    encode(digest(id::text || target_date::text, 'sha256'), 'hex')
  limit 1;

  if selected_record.id is null then
    return null;
  end if;

  cached_content := jsonb_build_object(
    'date', target_date,
    'eventId', selected_record.id,
    'type', selected_record.card_type,
    'title', selected_record.title,
    'description', coalesce(selected_record.summary, selected_record.description, ''),
    'occurredAt', selected_record.occurred_at,
    'yearsAgo', greatest(selected_record.years_ago, 0)
  );

  insert into public.ai_artifacts (
    user_id, child_id, event_id, kind, period_start, period_end, content,
    source_event_ids, input_hash, prompt_version, model
  ) values (
    actor_id, target_child_id, selected_record.id, 'memory_of_day', target_date,
    target_date, cached_content, array[selected_record.id], cache_hash,
    'memory-of-day-v1', 'rule-engine-v1'
  ) on conflict (child_id, kind, prompt_version, input_hash) do nothing;

  select a.content into cached_content
  from public.ai_artifacts a
  where a.child_id = target_child_id
    and a.kind = 'memory_of_day'
    and a.input_hash = cache_hash
    and a.prompt_version = 'memory-of-day-v1'
  limit 1;

  return cached_content;
end;
$$;

revoke all on function public.get_memory_of_the_day(uuid, date) from public, anon;
grant execute on function public.get_memory_of_the_day(uuid, date) to authenticated;
