create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ai_conversations is 'AI conversation history scoped to one child.';
