create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger children_set_updated_at
before update on public.children
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger event_media_set_updated_at
before update on public.event_media
for each row execute function public.set_updated_at();

create trigger reminders_set_updated_at
before update on public.reminders
for each row execute function public.set_updated_at();

create trigger ai_conversations_set_updated_at
before update on public.ai_conversations
for each row execute function public.set_updated_at();

create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create trigger user_devices_set_updated_at
before update on public.user_devices
for each row execute function public.set_updated_at();

create trigger reminders_validate_event_child
before insert or update of child_id, event_id on public.reminders
for each row execute function public.validate_event_child_reference();

create trigger ai_analysis_validate_event_child
before insert or update of child_id, event_id on public.ai_analysis
for each row execute function public.validate_event_child_reference();

create trigger profiles_audit_archival
after update of archived_at on public.profiles
for each row execute function public.audit_archival();

create trigger children_audit_archival
after update of archived_at on public.children
for each row execute function public.audit_archival();

create trigger events_audit_archival
after update of archived_at on public.events
for each row execute function public.audit_archival();

create trigger event_media_audit_archival
after update of archived_at on public.event_media
for each row execute function public.audit_archival();

create trigger reports_audit_archival
after update of archived_at on public.reports
for each row execute function public.audit_archival();

create trigger subscriptions_audit_change
after update of plan, status on public.subscriptions
for each row execute function public.audit_subscription_change();
