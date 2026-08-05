create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  event_id uuid references public.events (id) on delete set null,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (description is null or char_length(description) <= 5000),
  reminder_at timestamptz not null,
  repeat_type text not null default 'none' check (
    repeat_type in ('none', 'daily', 'weekly', 'monthly', 'yearly', 'custom')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reminders is 'Scheduled reminders associated with a child and optionally an event.';
