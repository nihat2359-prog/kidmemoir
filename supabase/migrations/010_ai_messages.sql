create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null check (char_length(btrim(content)) between 1 and 50000),
  prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0),
  completion_tokens integer check (completion_tokens is null or completion_tokens >= 0),
  model text not null check (char_length(btrim(model)) between 1 and 100),
  created_at timestamptz not null default now()
);

comment on table public.ai_messages is 'Messages in a child-scoped AI conversation.';
