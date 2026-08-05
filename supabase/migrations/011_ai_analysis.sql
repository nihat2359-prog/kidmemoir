create table public.ai_analysis (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  summary text not null check (char_length(btrim(summary)) between 1 and 10000),
  analysis text not null check (char_length(btrim(analysis)) between 1 and 30000),
  recommendations text check (recommendations is null or char_length(recommendations) <= 20000),
  confidence_score numeric(5, 4) check (
    confidence_score is null or confidence_score between 0 and 1
  ),
  model text not null check (char_length(btrim(model)) between 1 and 100),
  created_at timestamptz not null default now()
);

comment on table public.ai_analysis is 'AI interpretation of a specific child event.';
