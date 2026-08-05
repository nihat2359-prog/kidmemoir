create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null check (char_length(btrim(action)) between 1 and 100),
  entity text not null check (char_length(btrim(entity)) between 1 and 100),
  entity_id uuid,
  ip_address inet,
  user_agent text check (user_agent is null or char_length(user_agent) <= 1000),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Append-only audit trail for security-sensitive operations.';
