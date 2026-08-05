create table public.events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  category_id uuid not null references public.event_categories (id) on delete restrict,
  sub_category_id uuid,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (description is null or char_length(description) <= 20000),
  occurred_at timestamptz not null,
  location text check (location is null or char_length(location) <= 300),
  importance text check (importance is null or importance in ('low', 'normal', 'high', 'critical')),
  mood text check (mood is null or mood in ('happy', 'sad', 'fear', 'excitement', 'proud', 'disappointed', 'neutral')),
  is_favorite boolean not null default false,
  ai_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  source text not null default 'manual' check (
    source in ('manual', 'ai', 'import', 'voice', 'ocr')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint events_sub_category_matches_category foreign key (sub_category_id, category_id)
    references public.event_sub_categories (id, category_id) on delete restrict,
  constraint events_archive_after_creation check (archived_at is null or archived_at >= created_at)
);

comment on table public.events is 'A meaningful event in a child life history.';
