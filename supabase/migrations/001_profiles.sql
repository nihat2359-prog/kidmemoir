create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 100),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 100),
  avatar text,
  language text not null default 'tr' check (language ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  timezone text not null default 'Europe/Istanbul' check (char_length(timezone) between 1 and 100),
  subscription_plan text not null default 'free' check (subscription_plan in ('free', 'premium')),
  subscription_status text not null default 'active' check (
    subscription_status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint profiles_archive_after_creation check (archived_at is null or archived_at >= created_at)
);

comment on table public.profiles is 'Application profile for an authenticated parent.';
