create table public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'video', 'audio', 'document')),
  storage_path text not null unique check (
    char_length(btrim(storage_path)) between 1 and 1024
    and storage_path !~ '(^|/)\.\.(/|$)'
  ),
  thumbnail_path text check (
    thumbnail_path is null
    or (
      char_length(btrim(thumbnail_path)) between 1 and 1024
      and thumbnail_path !~ '(^|/)\.\.(/|$)'
    )
  ),
  file_name text not null check (char_length(btrim(file_name)) between 1 and 255),
  mime_type text not null check (char_length(btrim(mime_type)) between 3 and 150),
  file_size bigint not null check (
    file_size > 0
    and file_size <= case media_type
      when 'photo' then 20971520
      when 'video' then 262144000
      when 'audio' then 52428800
      when 'document' then 26214400
    end
  ),
  duration integer check (duration is null or duration >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint event_media_archive_after_creation check (archived_at is null or archived_at >= created_at),
  constraint event_media_dimensions_together check ((width is null) = (height is null)),
  constraint event_media_mime_matches_type check (
    (media_type = 'photo' and mime_type like 'image/%')
    or (media_type = 'video' and mime_type like 'video/%')
    or (media_type = 'audio' and mime_type like 'audio/%')
    or (
      media_type = 'document'
      and mime_type in (
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      )
    )
  )
);

comment on table public.event_media is 'Private media metadata belonging to an event.';
