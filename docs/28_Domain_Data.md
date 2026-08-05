# KidMemoir
# 28_Domain_Data.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Domain Data Model

Bağımlılıklar

- 09_Domain_Model.md
- 10_Event_Catalog.md
- 18_Child_Home.md
- 19_New_Event.md
- 20_Event_Detail.md
- 21_Timeline.md
- 22_AI.md
- 23_Files.md
- 24_Reports.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasının iş nesnelerini ve bu nesneler arasındaki ilişkileri tanımlar.

Bu doküman veritabanı değildir.

---

# 2. Domain Yapısı

User

↓

Child

↓

Event

↓

Media

↓

AI Analysis

↓

Report

↓

Notification

---

# 3. User

## Açıklama

Sistemi kullanan ebeveyndir.

## Alanlar

Id

FirstName

LastName

Email

EmailVerified

Avatar

Language

Theme

SubscriptionPlan

SubscriptionStatus

CreatedAt

UpdatedAt

ArchivedAt

---

# 4. Child

## Açıklama

Sistemin merkezindeki ana varlıktır.

## Alanlar

Id

UserId

FirstName

LastName

BirthDate

Gender

Avatar

BloodType

Notes

CreatedAt

UpdatedAt

ArchivedAt

---

# 5. Event

## Açıklama

Çocuğun hayatında yaşanan her önemli olayı temsil eder.

## Alanlar

Id

ChildId

CategoryId

SubCategoryId

Title

Description

OccurredAt

Location

Importance

Mood

IsFavorite

IsArchived

AIEnabled

CreatedAt

UpdatedAt

---

# 6. Event Tag

## Açıklama

Bir Event'e ait etiketleri temsil eder.

## Alanlar

Id

EventId

Tag

CreatedAt

---

# 7. Event Media

## Açıklama

Event'e bağlı medya kayıtlarını temsil eder.

## Alanlar

Id

EventId

MediaType

StoragePath

ThumbnailPath

FileName

MimeType

FileSize

Duration

Width

Height

CreatedAt

---

# 8. Event Attachment

## Açıklama

Belge dosyalarını temsil eder.

## Alanlar

Id

EventId

DocumentName

StoragePath

MimeType

FileSize

CreatedAt

---

# 9. AI Conversation

## Açıklama

AI sohbetlerini temsil eder.

## Alanlar

Id

ChildId

Title

CreatedAt

UpdatedAt

---

# 10. AI Message

## Açıklama

AI konuşmalarındaki mesajları temsil eder.

## Alanlar

Id

ConversationId

Role

Message

PromptTokens

CompletionTokens

Model

CreatedAt

---

# 11. AI Analysis

## Açıklama

AI tarafından oluşturulan Event analizlerini temsil eder.

## Alanlar

Id

ChildId

EventId

Summary

Analysis

Recommendations

ConfidenceScore

Model

CreatedAt

---

# 12. Reminder

## Açıklama

Hatırlatma kayıtlarını temsil eder.

## Alanlar

Id

ChildId

EventId

Title

Description

ReminderDate

RepeatType

Status

CreatedAt

---

# 13. Notification

## Açıklama

Kullanıcı bildirimlerini temsil eder.

## Alanlar

Id

UserId

ChildId

Type

Title

Body

ReferenceType

ReferenceId

IsRead

CreatedAt

---

# 14. Report

## Açıklama

Oluşturulan rapor isteklerini temsil eder.

## Alanlar

Id

ChildId

ReportType

StartDate

EndDate

GeneratedBy

CreatedAt

---

# 15. Subscription

## Açıklama

Abonelik bilgilerini temsil eder.

## Alanlar

Id

UserId

Plan

Status

StartDate

EndDate

Provider

ProviderSubscriptionId

CreatedAt

---

# 16. Audit Log

## Açıklama

Kritik işlemleri kayıt altına alır.

## Alanlar

Id

UserId

Action

Entity

EntityId

IPAddress

UserAgent

CreatedAt

---

# 17. İlişkiler

User

1

↓

N

Child

---

Child

1

↓

N

Event

---

Event

1

↓

N

Event Media

---

Event

1

↓

N

Event Tag

---

Child

1

↓

N

Reminder

---

Child

1

↓

N

AI Conversation

---

AI Conversation

1

↓

N

AI Message

---

Child

1

↓

N

AI Analysis

---

User

1

↓

N

Notification

---

User

1

↓

1

Subscription

---

# 18. Silme Kuralları

User

Soft Delete

---

Child

Soft Delete

---

Event

Soft Delete

---

Media

Soft Delete

---

Notification

Hard Delete

---

Audit Log

Silinmez

---

# 19. Arşiv Kuralları

Child arşivlenebilir.

Event arşivlenebilir.

Media arşivlenebilir.

Arşivlenen kayıtlar varsayılan listelerde gösterilmez.

---

# 20. Kimlik Kuralları

Bütün kayıtlar UUID kullanacaktır.

Sıralama alanı olarak CreatedAt kullanılacaktır.

---

# 21. Zaman Kuralları

Tüm tarih alanları UTC olarak saklanacaktır.

Kullanıcıya yerel saat dilimine göre gösterilecektir.

---

# 22. Dosya Kuralları

Dosyalar Storage üzerinde saklanacaktır.

Veritabanında yalnızca metadata tutulacaktır.

Önizleme görselleri ayrı oluşturulacaktır.

---

# 23. AI Kuralları

AI yalnızca yetkili kullanıcının seçili çocuğuna ait verileri kullanabilir.

Silinmiş veya erişim izni olmayan kayıtlar AI analizlerine dahil edilmez.

---

# 24. Domain Kuralları

Her Event yalnızca bir çocuğa aittir.

Her Media mutlaka bir Event'e bağlıdır.

Her AI Analysis en az bir Event referansı içerir.

Her Notification bir kullanıcıya aittir.

Her Report belirli bir tarih aralığı için oluşturulur.

---

# 25. Onay Durumu

✅ Final