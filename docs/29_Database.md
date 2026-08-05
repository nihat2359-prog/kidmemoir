# KidMemoir
# 29_Database.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Database Design

Bağımlılıklar

- 08_Tech_Stack.md
- 09_Domain_Model.md
- 10_Event_Catalog.md
- 28_Domain_Data.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasının PostgreSQL veritabanı tasarımını tanımlar.

Veritabanı Supabase PostgreSQL üzerinde çalışacaktır.

Tüm tablolar Row Level Security (RLS) kullanacaktır.

---

# 2. Genel Yapı

```
auth.users
      │
      ▼
profiles
      │
      ▼
children
      │
      ▼
events
      │
 ┌────┼───────────┐
 ▼    ▼           ▼
event_tags
event_media
event_ai_analysis
```

---

# 3. Ortak Kolonlar

Bütün tablolar aşağıdaki ortak alanları içerir.

| Alan | Tip |
|------|-----|
| id | uuid |
| created_at | timestamptz |
| updated_at | timestamptz |
| archived_at | timestamptz NULL |

---

# 4. profiles

Açıklama

Kullanıcı profili.

Primary Key

id

Foreign Key

id → auth.users.id

Kolonlar

id

first_name

last_name

avatar

language

theme

timezone

subscription_plan

subscription_status

created_at

updated_at

---

# 5. children

Primary Key

id

Foreign Key

user_id

Kolonlar

id

user_id

first_name

last_name

birth_date

gender

avatar

blood_type

notes

is_default

created_at

updated_at

archived_at

İndeksler

user_id

birth_date

---

# 6. event_categories

Kolonlar

id

name

icon

color

sort_order

is_active

created_at

---

# 7. event_sub_categories

Kolonlar

id

category_id

name

icon

sort_order

created_at

İndeksler

category_id

---

# 8. events

Kolonlar

id

child_id

category_id

sub_category_id

title

description

occurred_at

location

importance

mood

is_favorite

ai_enabled

created_at

updated_at

archived_at

İndeksler

child_id

occurred_at DESC

category_id

sub_category_id

is_favorite

---

# 9. event_tags

Kolonlar

id

event_id

tag

created_at

İndeksler

event_id

tag

---

# 10. event_media

Kolonlar

id

event_id

media_type

storage_path

thumbnail_path

file_name

mime_type

file_size

duration

width

height

created_at

İndeksler

event_id

media_type

---

# 11. reminders

Kolonlar

id

child_id

event_id

title

description

reminder_at

repeat_type

status

created_at

İndeksler

child_id

reminder_at

status

---

# 12. ai_conversations

Kolonlar

id

child_id

title

created_at

updated_at

İndeksler

child_id

---

# 13. ai_messages

Kolonlar

id

conversation_id

role

content

prompt_tokens

completion_tokens

model

created_at

İndeksler

conversation_id

created_at

---

# 14. ai_analysis

Kolonlar

id

child_id

event_id

summary

analysis

recommendations

confidence_score

model

created_at

İndeksler

child_id

event_id

---

# 15. reports

Kolonlar

id

child_id

report_type

start_date

end_date

generated_by

created_at

İndeksler

child_id

start_date

---

# 16. notifications

Kolonlar

id

user_id

child_id

type

title

body

reference_type

reference_id

is_read

created_at

İndeksler

user_id

is_read

created_at DESC

---

# 17. subscriptions

Kolonlar

id

user_id

provider

provider_subscription_id

plan

status

start_date

end_date

created_at

İndeksler

user_id

status

---

# 18. audit_logs

Kolonlar

id

user_id

action

entity

entity_id

ip_address

user_agent

metadata jsonb

created_at

İndeksler

user_id

created_at DESC

entity

---

# 19. Storage Buckets

avatars

Çocuk profil fotoğrafları

---

event-media

Fotoğraf

Video

Ses

---

documents

PDF

Belgeler

---

exports

PDF raporları

---

# 20. Foreign Keys

profiles.id

↓

auth.users.id

---

children.user_id

↓

profiles.id

---

events.child_id

↓

children.id

---

event_media.event_id

↓

events.id

---

event_tags.event_id

↓

events.id

---

reminders.child_id

↓

children.id

---

reminders.event_id

↓

events.id

---

notifications.user_id

↓

profiles.id

---

notifications.child_id

↓

children.id

---

ai_conversations.child_id

↓

children.id

---

ai_messages.conversation_id

↓

ai_conversations.id

---

ai_analysis.child_id

↓

children.id

---

ai_analysis.event_id

↓

events.id

---

subscriptions.user_id

↓

profiles.id

---

# 21. Row Level Security

Bütün tablolar RLS kullanacaktır.

Temel kural

```
Kullanıcı yalnızca
kendi çocuklarına ait
verileri görebilir.
```

---

# 22. Soft Delete

Aşağıdaki tablolar Soft Delete kullanacaktır.

profiles

children

events

event_media

reports

---

# 23. Full Text Search

Arama yapılacak alanlar

events.title

events.description

event_tags.tag

---

# 24. JSONB Alanları

metadata

audit_logs

AI cevap metadata

Gelecekte eklenecek dinamik alanlar

---

# 25. Triggerlar

updated_at otomatik güncellenecek.

Soft Delete loglanacak.

Notification oluşturulacak.

Audit Log oluşturulacak.

---

# 26. Performans

Bütün Foreign Key alanları indekslenecektir.

Sayfalama Cursor Pagination ile yapılacaktır.

Büyük medya dosyaları Storage üzerinden sunulacaktır.

---

# 27. Backup

Günlük otomatik yedekleme.

Point in Time Recovery aktif olacaktır.

---

# 28. Migration

Tüm şema değişiklikleri migration dosyaları ile yönetilecektir.

Elle veritabanı değişikliği yapılmayacaktır.

---

# 29. Onay Durumu

✅ Final