create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  language text not null default 'tr' check (char_length(btrim(language)) between 2 and 35),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  timezone text not null default 'Europe/Istanbul' check (char_length(btrim(timezone)) between 1 and 100),
  date_format text not null default 'DD.MM.YYYY' check (char_length(btrim(date_format)) between 1 and 32),
  time_format text not null default '24h' check (time_format in ('12h', '24h')),
  push_notifications boolean not null default true,
  email_notifications boolean not null default true,
  reminder_notifications boolean not null default true,
  ai_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_settings is 'Per-user locale, theme, notification, and AI preferences.';
