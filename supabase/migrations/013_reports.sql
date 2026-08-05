create table public.reports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  report_type text not null check (char_length(btrim(report_type)) between 1 and 100),
  start_date date not null,
  end_date date not null,
  generated_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint reports_valid_date_range check (end_date >= start_date),
  constraint reports_archive_after_creation check (archived_at is null or archived_at >= created_at)
);

comment on table public.reports is 'Generated report requests for a bounded child date range.';
