-- Public Guide URLs use /{locale}/guides/{slug}; keep that route unique.
create unique index if not exists seo_pages_published_guide_slug_unique_idx
on public.seo_pages (locale, slug)
where status = 'published' and schema_type = 'guide';

