do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'start_date'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'current_period_start'
  ) then
    alter table public.subscriptions rename column start_date to current_period_start;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'end_date'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'current_period_end'
  ) then
    alter table public.subscriptions rename column end_date to current_period_end;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'provider_product_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'product_id'
  ) then
    alter table public.subscriptions rename column provider_product_id to product_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'provider_variant_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'variant_id'
  ) then
    alter table public.subscriptions rename column provider_variant_id to variant_id;
  end if;
end
$$;

alter table public.subscriptions
  drop constraint if exists subscriptions_valid_date_range;

alter table public.subscriptions
  add column if not exists billing_cycle text not null default 'yearly',
  add column if not exists cancelled_at timestamptz,
  add column if not exists next_payment_at timestamptz;

alter table public.subscriptions
  drop constraint if exists subscriptions_valid_period,
  drop constraint if exists subscriptions_billing_cycle_check;

alter table public.subscriptions
  add constraint subscriptions_valid_period check (
    current_period_end is null
    or current_period_end >= current_period_start
  ),
  add constraint subscriptions_billing_cycle_check check (
    billing_cycle in ('monthly', 'yearly')
  );

create table if not exists public.billing_webhook_events (
  event_key text primary key check (event_key ~ '^[a-f0-9]{64}$'),
  event_name text not null check (char_length(event_name) between 1 and 100),
  resource_type text not null check (char_length(resource_type) between 1 and 100),
  resource_id text not null check (char_length(resource_id) between 1 and 255),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'processing' check (status in ('processing', 'completed')),
  claimed_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_checkout_sessions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  provider text not null default 'lemon' check (provider = 'lemon'),
  provider_checkout_id text unique,
  checkout_url text check (checkout_url is null or checkout_url ~ '^https://'),
  state text not null default 'pending' check (state in ('pending', 'ready')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.billing_webhook_events enable row level security;
alter table public.billing_webhook_events force row level security;
alter table public.billing_checkout_sessions enable row level security;
alter table public.billing_checkout_sessions force row level security;

drop trigger if exists billing_checkout_sessions_set_updated_at
  on public.billing_checkout_sessions;

create trigger billing_checkout_sessions_set_updated_at
before update on public.billing_checkout_sessions
for each row execute function public.set_updated_at();

create index if not exists subscriptions_next_payment_idx
  on public.subscriptions (next_payment_at)
  where next_payment_at is not null;

create index if not exists billing_webhook_events_created_idx
  on public.billing_webhook_events (created_at desc);

create index if not exists billing_checkout_sessions_expiry_idx
  on public.billing_checkout_sessions (expires_at);

comment on table public.billing_webhook_events is
  'Server-only idempotency ledger for verified Lemon webhook payloads.';
comment on table public.billing_checkout_sessions is
  'Server-only cache preventing duplicate active Lemon checkouts per user.';
