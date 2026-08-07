-- A guide may contain multiple editorial sections of the same semantic type.
-- Position remains unique within a draft and preserves deterministic ordering.
alter table public.seo_draft_sections
drop constraint if exists seo_draft_sections_draft_id_section_definition_id_key;

create index if not exists seo_draft_sections_definition_idx
on public.seo_draft_sections (draft_id, section_definition_id, position);

