create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  conversation_id uuid references public.ai_conversations (id) on delete set null,
  model text not null check (char_length(btrim(model)) between 1 and 100),
  prompt_tokens integer not null default 0 check (prompt_tokens >= 0),
  completion_tokens integer not null default 0 check (completion_tokens >= 0),
  total_tokens integer not null default 0 check (
    total_tokens >= 0 and total_tokens = prompt_tokens + completion_tokens
  ),
  estimated_cost numeric(14, 6) not null default 0 check (estimated_cost >= 0),
  created_at timestamptz not null default now()
);

comment on table public.ai_usage is 'Immutable AI token usage and estimated cost ledger.';
