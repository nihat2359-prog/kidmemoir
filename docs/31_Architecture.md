# KidMemoir
# 31_Architecture.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** System Architecture

Bağımlılıklar

- 08_Tech_Stack.md
- 09_Domain_Model.md
- 29_Database.md
- 30_API_Standards.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasının teknik mimarisini tanımlar.

Buradaki kurallar tüm geliştirme süreci boyunca değişmez referans olarak kullanılacaktır.

---

# 2. Mimari Prensipleri

KidMemoir aşağıdaki prensiplere göre geliştirilecektir.

- Clean Architecture
- Feature Based Structure
- Server First
- Mobile First
- Component Driven UI
- API First
- Security First
- AI Native
- Accessibility First

---

# 3. Genel Mimari

```

Browser

↓

Next.js App Router

↓

Server Components

↓

Server Actions

↓

Supabase

↓

PostgreSQL

↓

Storage

↓

Edge Functions

↓

OpenAI

```

---

# 4. Frontend Katmanı

Framework

Next.js

Router

App Router

Rendering

Server Components

Client Components

yalnızca gerektiğinde kullanılacaktır.

---

# 5. Server Components

Varsayılan yapı olacaktır.

Avantajları

- Daha hızlı
- Daha güvenli
- Daha az Javascript
- Daha iyi SEO

---

# 6. Client Components

Sadece aşağıdaki durumlarda kullanılacaktır.

Form

Modal

Dropdown

Editor

AI Chat

Animation

Drag Drop

Upload

---

# 7. Server Actions

Bütün veri değiştiren işlemler

Server Action

üzerinden yapılacaktır.

Örnek

Create Event

↓

Update Event

↓

Delete Event

↓

Create Child

↓

Update Profile

---

# 8. Authentication

Supabase Auth kullanılacaktır.

Desteklenecek yöntemler

Email

Google

Apple

Magic Link (Future)

---

# 9. Authorization

JWT

+

Row Level Security

birlikte kullanılacaktır.

Frontend hiçbir zaman yetki kontrolüne güvenmeyecektir.

---

# 10. Database

Supabase PostgreSQL kullanılacaktır.

Tüm ilişkiler Foreign Key ile kurulacaktır.

Soft Delete uygulanacaktır.

---

# 11. Storage

Storage klasörleri

avatars

↓

events

↓

documents

↓

exports

Dosyalar Public olmayacaktır.

Signed URL kullanılacaktır.

---

# 12. AI Architecture

AI doğrudan veritabanına erişmeyecektir.

Akış

User

↓

Prompt

↓

Context Builder

↓

OpenAI

↓

Response

↓

Save History

↓

Frontend

---

# 13. Context Builder

AI'ya gönderilecek veri

önce filtrelenecektir.

Kurallar

- Seçili çocuk
- Kullanıcının erişim yetkisi
- Silinmemiş kayıtlar
- Tarih filtresi
- Token limiti

---

# 14. AI Güvenliği

AI

Asla

şunları yapmayacaktır.

- Tıbbi teşhis
- Psikolojik teşhis
- Kesin hüküm
- Gerçek olmayan bilgi üretme

Her cevap referans gösterecektir.

---

# 15. Event Pipeline

Yeni Event

↓

Validation

↓

Database

↓

Media Upload

↓

AI Queue

↓

Notification

↓

Timeline Update

↓

Child Home Refresh

---

# 16. Upload Pipeline

Dosya Seç

↓

Validation

↓

Compression

↓

Storage

↓

Thumbnail

↓

Database

↓

Return URL

---

# 17. Report Pipeline

Report Request

↓

Data Collection

↓

AI Summary

↓

PDF Generation

↓

Download

---

# 18. Notification Pipeline

Trigger

↓

Notification Table

↓

Push

↓

Email (Future)

↓

In App Notification

---

# 19. Cache

React Cache

Next Cache

Supabase Cache

Browser Cache

katmanlı kullanılacaktır.

---

# 20. Error Handling

Frontend

↓

Server Action

↓

Database

↓

Logger

↓

Monitoring

Her hata takip edilecektir.

---

# 21. Logging

Loglanacak işlemler

Login

Logout

Create Child

Create Event

Delete Event

Subscription

AI

Report

---

# 22. Monitoring

Takip edilecek metrikler

Response Time

AI Duration

Upload Time

API Errors

Storage Errors

Database Errors

---

# 23. Security

HTTPS

JWT

RLS

Rate Limit

XSS Protection

SQL Injection Protection

CSP

CSRF

Audit Log

zorunludur.

---

# 24. Backup

Database

Günlük

Storage

Haftalık

Point In Time Recovery

aktif olacaktır.

---

# 25. Deployment

Platform

Vercel

Database

Supabase

Storage

Supabase Storage

DNS

Cloudflare

---

# 26. Environment

Development

↓

Preview

↓

Production

Üç ayrı ortam bulunacaktır.

---

# 27. Scalability

Yapı

10 kullanıcı için de

1 milyon kullanıcı için de

aynı mimari ile çalışabilecek şekilde tasarlanacaktır.

---

# 28. Future

Queue System

Realtime Collaboration

Offline Mode

Edge AI

Background Jobs

Multi Region

---

# 29. Mimari Kuralları

Kod hiçbir zaman

Business Logic

ile

UI kodunu karıştırmayacaktır.

Her Feature bağımsız geliştirilebilir olacaktır.

Tek bir Component başka Feature'a bağımlı olmayacaktır.

---

# 30. Sonuç

KidMemoir

Modern

Server First

AI Native

ölçeklenebilir

güvenli

bakımı kolay

uzun yıllar geliştirilebilir

bir mimari üzerine kurulacaktır.

---

# Onay Durumu

✅ Final