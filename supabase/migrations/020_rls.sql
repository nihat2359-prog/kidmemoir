alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.event_categories enable row level security;
alter table public.event_sub_categories enable row level security;
alter table public.events enable row level security;
alter table public.event_tags enable row level security;
alter table public.event_media enable row level security;
alter table public.reminders enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_analysis enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_devices enable row level security;
alter table public.ai_usage enable row level security;
alter table public.audit_logs enable row level security;

alter table public.profiles force row level security;
alter table public.children force row level security;
alter table public.event_categories force row level security;
alter table public.event_sub_categories force row level security;
alter table public.events force row level security;
alter table public.event_tags force row level security;
alter table public.event_media force row level security;
alter table public.reminders force row level security;
alter table public.ai_conversations force row level security;
alter table public.ai_messages force row level security;
alter table public.ai_analysis force row level security;
alter table public.notifications force row level security;
alter table public.reports force row level security;
alter table public.subscriptions force row level security;
alter table public.user_settings force row level security;
alter table public.user_devices force row level security;
alter table public.ai_usage force row level security;
alter table public.audit_logs force row level security;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "children_select_own"
on public.children for select to authenticated
using (user_id = (select auth.uid()));

create policy "children_insert_own"
on public.children for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "children_update_own"
on public.children for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "event_categories_read_active"
on public.event_categories for select to anon, authenticated
using (is_active = true);

create policy "event_sub_categories_read_active"
on public.event_sub_categories for select to anon, authenticated
using (
  exists (
    select 1
    from public.event_categories
    where event_categories.id = event_sub_categories.category_id
      and event_categories.is_active = true
  )
);

create policy "events_select_own"
on public.events for select to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = events.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "events_insert_own"
on public.events for insert to authenticated
with check (
  exists (
    select 1 from public.children
    where children.id = events.child_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "events_update_own"
on public.events for update to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = events.child_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.children
    where children.id = events.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "event_tags_select_own"
on public.event_tags for select to authenticated
using (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_tags.event_id
      and children.user_id = (select auth.uid())
  )
);

create policy "event_tags_insert_own"
on public.event_tags for insert to authenticated
with check (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_tags.event_id
      and children.user_id = (select auth.uid())
      and events.archived_at is null
  )
);

create policy "event_tags_update_own"
on public.event_tags for update to authenticated
using (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_tags.event_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_tags.event_id
      and children.user_id = (select auth.uid())
  )
);

create policy "event_tags_delete_own"
on public.event_tags for delete to authenticated
using (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_tags.event_id
      and children.user_id = (select auth.uid())
      and events.archived_at is null
  )
);

create policy "event_media_select_own"
on public.event_media for select to authenticated
using (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_media.event_id
      and children.user_id = (select auth.uid())
  )
);

create policy "event_media_insert_own"
on public.event_media for insert to authenticated
with check (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_media.event_id
      and children.user_id = (select auth.uid())
      and events.archived_at is null
  )
);

create policy "event_media_update_own"
on public.event_media for update to authenticated
using (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_media.event_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.events
    join public.children on children.id = events.child_id
    where events.id = event_media.event_id
      and children.user_id = (select auth.uid())
  )
);

create policy "reminders_select_own"
on public.reminders for select to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = reminders.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "reminders_insert_own"
on public.reminders for insert to authenticated
with check (
  exists (
    select 1 from public.children
    where children.id = reminders.child_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "reminders_update_own"
on public.reminders for update to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = reminders.child_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.children
    where children.id = reminders.child_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "reminders_delete_own"
on public.reminders for delete to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = reminders.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "ai_conversations_select_own"
on public.ai_conversations for select to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = ai_conversations.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "ai_conversations_insert_own"
on public.ai_conversations for insert to authenticated
with check (
  exists (
    select 1 from public.children
    where children.id = ai_conversations.child_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "ai_conversations_update_own"
on public.ai_conversations for update to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = ai_conversations.child_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.children
    where children.id = ai_conversations.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "ai_messages_select_own"
on public.ai_messages for select to authenticated
using (
  exists (
    select 1
    from public.ai_conversations
    join public.children on children.id = ai_conversations.child_id
    where ai_conversations.id = ai_messages.conversation_id
      and children.user_id = (select auth.uid())
  )
);

create policy "ai_messages_insert_own"
on public.ai_messages for insert to authenticated
with check (
  role = 'user'
  and exists (
    select 1
    from public.ai_conversations
    join public.children on children.id = ai_conversations.child_id
    where ai_conversations.id = ai_messages.conversation_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "ai_analysis_select_own"
on public.ai_analysis for select to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = ai_analysis.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "notifications_select_own"
on public.notifications for select to authenticated
using (user_id = (select auth.uid()));

create policy "notifications_update_own"
on public.notifications for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "notifications_delete_own"
on public.notifications for delete to authenticated
using (user_id = (select auth.uid()));

create policy "reports_select_own"
on public.reports for select to authenticated
using (
  exists (
    select 1 from public.children
    where children.id = reports.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "reports_insert_own"
on public.reports for insert to authenticated
with check (
  generated_by = (select auth.uid())
  and exists (
    select 1 from public.children
    where children.id = reports.child_id
      and children.user_id = (select auth.uid())
      and children.archived_at is null
  )
);

create policy "reports_update_own"
on public.reports for update to authenticated
using (
  generated_by = (select auth.uid())
  and exists (
    select 1 from public.children
    where children.id = reports.child_id
      and children.user_id = (select auth.uid())
  )
)
with check (
  generated_by = (select auth.uid())
  and exists (
    select 1 from public.children
    where children.id = reports.child_id
      and children.user_id = (select auth.uid())
  )
);

create policy "subscriptions_select_own"
on public.subscriptions for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_settings_select_own"
on public.user_settings for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_settings_insert_own"
on public.user_settings for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "user_settings_update_own"
on public.user_settings for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "user_devices_select_own"
on public.user_devices for select to authenticated
using (user_id = (select auth.uid()));

create policy "user_devices_insert_own"
on public.user_devices for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "user_devices_update_own"
on public.user_devices for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "user_devices_delete_own"
on public.user_devices for delete to authenticated
using (user_id = (select auth.uid()));

create policy "ai_usage_select_own"
on public.ai_usage for select to authenticated
using (user_id = (select auth.uid()));

create policy "audit_logs_select_own"
on public.audit_logs for select to authenticated
using (user_id = (select auth.uid()));

revoke update on public.notifications from authenticated;
grant update (is_read) on public.notifications to authenticated;

create policy "storage_select_own"
on storage.objects for select to authenticated
using (
  bucket_id in ('avatars', 'event-media', 'documents', 'exports')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('avatars', 'event-media', 'documents', 'exports')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage_update_own"
on storage.objects for update to authenticated
using (
  bucket_id in ('avatars', 'event-media', 'documents', 'exports')
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id in ('avatars', 'event-media', 'documents', 'exports')
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id in ('avatars', 'event-media', 'documents', 'exports')
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
