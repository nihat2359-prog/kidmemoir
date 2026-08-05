create table public.event_sub_categories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.event_categories (id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  icon text not null check (char_length(btrim(icon)) between 1 and 100),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint event_sub_categories_category_name_unique unique (category_id, name),
  constraint event_sub_categories_category_pair_unique unique (id, category_id)
);

comment on table public.event_sub_categories is 'System-managed event types grouped by category.';
