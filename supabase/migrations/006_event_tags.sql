create table public.event_tags (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  tag text not null check (char_length(btrim(tag)) between 1 and 50),
  created_at timestamptz not null default now(),
  constraint event_tags_event_tag_unique unique (event_id, tag)
);

comment on table public.event_tags is 'Searchable tags assigned to an event.';
