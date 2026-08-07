alter table public.subscriptions
  add column if not exists provider_customer_id text,
  add column if not exists provider_order_id text,
  add column if not exists provider_product_id text,
  add column if not exists provider_variant_id text,
  add column if not exists renews_at timestamptz,
  add column if not exists last_payment_at timestamptz,
  add column if not exists premium_started_at timestamptz;

alter table public.subscriptions
  drop constraint if exists subscriptions_status_check;

alter table public.subscriptions
  add constraint subscriptions_status_check check (
    status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'expired')
  );

alter table public.profiles
  drop constraint if exists profiles_subscription_status_check;

alter table public.profiles
  add constraint profiles_subscription_status_check check (
    subscription_status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'expired')
  );

create index if not exists subscriptions_provider_customer_idx
  on public.subscriptions (provider, provider_customer_id)
  where provider_customer_id is not null;

create index if not exists subscriptions_provider_order_idx
  on public.subscriptions (provider, provider_order_id)
  where provider_order_id is not null;

comment on column public.subscriptions.provider_customer_id is
  'External Lemon customer identifier.';
comment on column public.subscriptions.provider_order_id is
  'Most recent Lemon order identifier.';
comment on column public.subscriptions.renews_at is
  'Next billing or renewal timestamp reported by Lemon.';
comment on column public.subscriptions.last_payment_at is
  'Timestamp of the most recent successful Lemon payment.';
comment on column public.subscriptions.premium_started_at is
  'Timestamp when Premium access first became active.';
