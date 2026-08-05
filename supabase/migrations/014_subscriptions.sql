create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  provider text not null check (char_length(btrim(provider)) between 1 and 50),
  provider_subscription_id text unique check (
    provider_subscription_id is null
    or char_length(btrim(provider_subscription_id)) between 1 and 255
  ),
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'active' check (
    status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')
  ),
  start_date timestamptz not null default now(),
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_valid_date_range check (end_date is null or end_date >= start_date)
);

comment on table public.subscriptions is 'One subscription state per user.';
