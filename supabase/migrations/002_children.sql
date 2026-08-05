create table public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 100),
  last_name text check (last_name is null or char_length(btrim(last_name)) between 1 and 100),
  birth_date date not null check (birth_date <= current_date),
  birth_height numeric(5, 2) check (birth_height is null or birth_height > 0),
  birth_weight numeric(5, 2) check (birth_weight is null or birth_weight > 0),
  birth_place text check (birth_place is null or char_length(btrim(birth_place)) between 1 and 300),
  gender text not null check (gender in ('female', 'male', 'other', 'prefer_not_to_say')),
  avatar text,
  blood_type text check (
    blood_type is null
    or blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  ),
  notes text check (notes is null or char_length(notes) <= 10000),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint children_archive_after_creation check (archived_at is null or archived_at >= created_at)
);

comment on table public.children is 'Children available to the authenticated parent.';
