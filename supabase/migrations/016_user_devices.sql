create table public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  device_id text not null check (char_length(btrim(device_id)) between 1 and 255),
  device_name text check (device_name is null or char_length(btrim(device_name)) between 1 and 200),
  platform text not null check (platform in ('web', 'ios', 'android')),
  operating_system text check (operating_system is null or char_length(btrim(operating_system)) between 1 and 200),
  app_version text check (app_version is null or char_length(btrim(app_version)) between 1 and 50),
  push_token text check (push_token is null or char_length(btrim(push_token)) between 1 and 4096),
  last_seen_at timestamptz not null default now(),
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_devices_user_device_unique unique (user_id, device_id)
);

comment on table public.user_devices is 'Registered client devices and push notification endpoints.';
