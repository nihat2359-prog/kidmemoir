create unique index children_one_default_per_user_idx
on public.children (user_id)
where is_default = true and archived_at is null;

create index children_user_created_idx
on public.children (user_id, created_at desc, id desc)
where archived_at is null;

create index children_birth_date_idx on public.children (birth_date);
create index event_sub_categories_category_idx on public.event_sub_categories (category_id, sort_order);

create index events_child_occurred_idx
on public.events (child_id, occurred_at desc, id desc)
where archived_at is null;

create index events_category_idx on public.events (category_id);
create index events_sub_category_idx on public.events (sub_category_id) where sub_category_id is not null;
create index events_favorite_idx on public.events (child_id, occurred_at desc) where is_favorite = true and archived_at is null;
create index events_search_idx on public.events using gin (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
);

create index event_tags_event_idx on public.event_tags (event_id);
create index event_tags_tag_idx on public.event_tags (tag);
create index event_media_event_idx on public.event_media (event_id, created_at desc) where archived_at is null;
create index event_media_type_idx on public.event_media (media_type) where archived_at is null;

create index reminders_child_scheduled_idx
on public.reminders (child_id, reminder_at, id)
where status = 'scheduled';

create index reminders_event_idx on public.reminders (event_id) where event_id is not null;
create index reminders_due_idx on public.reminders (reminder_at, id) where status = 'scheduled';

create index ai_conversations_child_idx on public.ai_conversations (child_id, updated_at desc, id desc);
create index ai_messages_conversation_idx on public.ai_messages (conversation_id, created_at, id);
create index ai_analysis_child_idx on public.ai_analysis (child_id, created_at desc, id desc);
create index ai_analysis_event_idx on public.ai_analysis (event_id, created_at desc);

create index notifications_user_unread_idx
on public.notifications (user_id, created_at desc, id desc)
where is_read = false;

create index notifications_child_idx on public.notifications (child_id) where child_id is not null;
create index reports_child_start_idx on public.reports (child_id, start_date desc, id desc) where archived_at is null;
create index reports_generated_by_idx on public.reports (generated_by);
create index subscriptions_status_idx on public.subscriptions (status);
create index user_devices_user_seen_idx on public.user_devices (user_id, last_seen_at desc, id desc);
create unique index user_devices_push_token_unique_idx
on public.user_devices (push_token)
where push_token is not null;

create index ai_usage_user_created_idx on public.ai_usage (user_id, created_at desc, id desc);
create index ai_usage_child_created_idx
on public.ai_usage (child_id, created_at desc)
where child_id is not null;
create index ai_usage_conversation_idx
on public.ai_usage (conversation_id, created_at desc)
where conversation_id is not null;
create index ai_usage_user_model_created_idx on public.ai_usage (user_id, model, created_at desc);
create index audit_logs_user_created_idx on public.audit_logs (user_id, created_at desc, id desc);
create index audit_logs_entity_idx on public.audit_logs (entity, entity_id, created_at desc);
create index audit_logs_metadata_idx on public.audit_logs using gin (metadata);
