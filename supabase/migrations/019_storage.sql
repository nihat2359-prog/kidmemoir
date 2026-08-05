insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    false,
    20971520,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'event-media',
    'event-media',
    false,
    262144000,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'video/mp4', 'video/quicktime', 'video/webm',
      'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'
    ]
  ),
  (
    'documents',
    'documents',
    false,
    26214400,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
  ),
  (
    'exports',
    'exports',
    false,
    26214400,
    array['application/pdf', 'application/zip']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
