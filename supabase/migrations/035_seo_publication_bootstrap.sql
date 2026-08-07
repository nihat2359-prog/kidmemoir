-- Allows a new localized topic cluster to publish its first authoritative page.
-- hreflang is emitted only for translations that actually exist; additional
-- locale variants and cluster links remain independently quality-gated.

create or replace function public.validate_published_seo_page()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  available_related_count integer;
  required_related_count integer;
  related_count integer;
  taxonomy_ready boolean;
begin
  if new.status <> 'published' then return null; end if;

  select exists (
    select 1
    from public.seo_clusters c
    join public.seo_topics t on t.id = new.topic_id and t.cluster_id = c.id
    where c.id = new.cluster_id
      and c.status = 'published'
      and t.status = 'published'
  ) into taxonomy_ready;
  if not taxonomy_ready then
    raise exception 'Published SEO pages require published taxonomy';
  end if;

  select count(*) into available_related_count
  from public.seo_pages p
  where p.cluster_id = new.cluster_id
    and p.locale = new.locale
    and p.status = 'published'
    and p.published_at <= now()
    and p.id <> new.id;
  required_related_count := least(5, available_related_count);

  select count(distinct candidate_id) into related_count
  from (
    select p.id as candidate_id
    from public.seo_pages p
    where p.cluster_id = new.cluster_id
      and p.locale = new.locale
      and p.status = 'published'
      and p.published_at <= now()
      and p.id <> new.id
    union
    select r.target_page_id
    from public.seo_page_relations r
    join public.seo_pages p on p.id = r.target_page_id
    where r.source_page_id = new.id
      and p.cluster_id = new.cluster_id
      and p.locale = new.locale
      and p.status = 'published'
      and p.published_at <= now()
  ) related;
  if related_count < required_related_count then
    raise exception 'Published SEO pages do not satisfy available cluster link coverage';
  end if;
  return null;
end;
$$;

comment on function public.validate_published_seo_page() is
'Quality gate for localized SEO publication; supports safe first-page cluster bootstrap and scales to five related pages.';
