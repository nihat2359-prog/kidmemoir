create table public.event_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 100),
  icon text not null check (char_length(btrim(icon)) between 1 and 100),
  color text not null check (char_length(btrim(color)) between 1 and 50),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.event_categories is 'System-managed top-level event catalog.';
