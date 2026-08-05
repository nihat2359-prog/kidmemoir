create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid references public.children (id) on delete cascade,
  type text not null check (type in ('reminder', 'ai', 'system', 'subscription')),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  reference_type text check (reference_type is null or char_length(reference_type) <= 100),
  reference_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint notifications_reference_complete check (
    (reference_type is null and reference_id is null)
    or (reference_type is not null and reference_id is not null)
  )
);

comment on table public.notifications is 'User-facing notifications from system processes.';
