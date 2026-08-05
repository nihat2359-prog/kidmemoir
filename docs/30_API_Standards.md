# KidMemoir
# 30_API_Standards.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** API Standards

Bağımlılıklar

- 08_Tech_Stack.md
- 28_Domain_Data.md
- 29_Database.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasında kullanılacak tüm API standartlarını tanımlar.

Bütün servisler bu kurallara uymak zorundadır.

---

# 2. API Mimarisi

Frontend

↓

Next.js Server Actions

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

---

# 3. API Prensipleri

- REST benzeri kaynak yapısı kullanılacaktır.
- JSON veri formatı kullanılacaktır.
- UTF-8 kullanılacaktır.
- HTTPS zorunludur.
- Stateless yapı kullanılacaktır.

---

# 4. Authentication

Authentication

Supabase Auth

Authorization

JWT

Bearer Token

```
Authorization

Bearer {token}
```

---

# 5. Response Yapısı

Başarılı cevap

```json
{
  "success": true,
  "data": {},
  "message": null
}
```

---

Başarısız cevap

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# 6. HTTP Status Kodları

200

OK

---

201

Created

---

204

No Content

---

400

Bad Request

---

401

Unauthorized

---

403

Forbidden

---

404

Not Found

---

409

Conflict

---

422

Validation Error

---

429

Too Many Requests

---

500

Internal Server Error

---

# 7. Pagination

Cursor Pagination kullanılacaktır.

Örnek

```
GET

/events?cursor=abc123&limit=20
```

---

Response

```
{
   "items": [],
   "nextCursor": ""
}
```

---

# 8. Filtering

Örnek

```
GET

/events

?category=health

&favorite=true

&from=2026-01-01

&to=2026-12-31
```

---

# 9. Sorting

```
sort=occurred_at

order=desc
```

Varsayılan

```
occurred_at desc
```

---

# 10. Searching

```
search=doctor
```

Full Text Search kullanılacaktır.

---

# 11. Validation

Bütün giriş verileri doğrulanacaktır.

Frontend

↓

Zod

Backend

↓

Zod

Database

↓

Constraint

---

# 12. Rate Limit

Login

5 istek

1 dakika

---

AI

30 istek

1 saat

---

Report

20 istek

1 saat

---

Search

120 istek

1 dakika

---

# 13. Error Formatı

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

---

# 14. Dosya Yükleme

Multipart Upload kullanılacaktır.

Maksimum Boyutlar

Fotoğraf

20 MB

---

Video

250 MB

---

Ses

50 MB

---

PDF

25 MB

---

# 15. AI API

İstek

↓

Prompt

↓

Context

↓

Child Events

↓

OpenAI

↓

Response

↓

Save History

↓

Return

---

# 16. Cache

GET

Cache

---

POST

No Cache

---

PATCH

Invalidate Cache

---

DELETE

Invalidate Cache

---

# 17. Retry Politikası

Network Error

3 tekrar

---

429

Exponential Backoff

---

500

2 tekrar

---

# 18. Timeout

GET

15 saniye

---

POST

30 saniye

---

AI

90 saniye

---

Upload

300 saniye

---

# 19. Logging

API Request

API Response

Error

Duration

User

Device

---

# 20. Audit Log

Email değişikliği

Şifre değişikliği

Child silme

Event silme

Subscription değişikliği

---

# 21. API Versiyonlama

```
/api/v1/
```

Yeni sürümler

```
/api/v2/
```

---

# 22. Güvenlik

HTTPS

JWT

RLS

CSRF

XSS

SQL Injection Koruması

Input Validation

Output Encoding

Rate Limit

---

# 23. Performans

Response Compression

HTTP/2

Connection Keep Alive

Lazy Loading

Parallel Requests

---

# 24. Monitoring

API Duration

Error Rate

Success Rate

AI Duration

Upload Duration

---

# 25. Analytics

Her kritik işlem event olarak loglanacaktır.

Örnek

Login

Logout

Create Child

Create Event

AI Chat

Generate Report

Upgrade Plan

---

# 26. Naming Standards

Endpoint

```
/children
```

---

Tekil

```
/children/{id}
```

---

Alt Kaynak

```
/children/{id}/events
```

---

# 27. Tarih Formatı

ISO 8601

Örnek

```
2026-08-05T14:30:00Z
```

---

# 28. UUID

Bütün Primary Key alanları UUID olacaktır.

Auto Increment kullanılmayacaktır.

---

# 29. Deprecation

Eski endpoint'ler en az 6 ay desteklenecektir.

---

# 30. Dokümantasyon

OpenAPI

Swagger

Postman Collection

otomatik üretilecektir.

---

# 31. Onay Durumu

✅ Final