create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.audit_archival()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  actor_id uuid;
  record_id uuid;
begin
  if old.archived_at is not distinct from new.archived_at then
    return new;
  end if;

  actor_id := auth.uid();
  record_id := (to_jsonb(new) ->> 'id')::uuid;

  insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
  values (
    actor_id,
    case when new.archived_at is null then 'restore' else 'archive' end,
    tg_table_name,
    record_id,
    jsonb_build_object(
      'previous_archived_at', old.archived_at,
      'archived_at', new.archived_at
    )
  );

  return new;
end;
$$;

create or replace function public.audit_subscription_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if old.plan is not distinct from new.plan
    and old.status is not distinct from new.status then
    return new;
  end if;

  insert into public.audit_logs (user_id, action, entity, entity_id, metadata)
  values (
    coalesce(auth.uid(), new.user_id),
    'subscription_change',
    'subscriptions',
    new.id,
    jsonb_build_object(
      'previous_plan', old.plan,
      'plan', new.plan,
      'previous_status', old.status,
      'status', new.status
    )
  );

  return new;
end;
$$;

create or replace function public.validate_event_child_reference()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  referenced_child_id uuid;
begin
  if new.event_id is null then
    return new;
  end if;

  select events.child_id
  into referenced_child_id
  from public.events
  where events.id = new.event_id;

  if referenced_child_id is distinct from new.child_id then
    raise exception using
      errcode = '23514',
      message = format('%s event_id must reference an event owned by child_id', tg_table_name);
  end if;

  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;
revoke all on function public.audit_archival() from public;
revoke all on function public.audit_subscription_change() from public;
revoke all on function public.validate_event_child_reference() from public;
