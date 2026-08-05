# KidMemoir
# 08_Tech_Stack.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Technology Stack

Bağımlılıklar

- 00_Vision.md
- 01_Product_Rules.md
- 05_Design_System.md
- 06_UI_Standards.md
- 07_Experience_Principles.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasında kullanılacak tüm teknolojileri tanımlar.

Teknoloji seçimi;

popüler olduğu için değil,

ürünün uzun yıllar geliştirilebilir olması amacıyla yapılmıştır.

---

# 2. Genel Mimari

KidMemoir modern web teknolojileri üzerine kurulacaktır.

Temel yaklaşım;

Server First

AI First

Component First

Responsive First

şeklindedir.

---

# 3. Frontend

Framework

Next.js

Sürüm

Güncel LTS

Router

App Router

Dil

TypeScript

UI

React

CSS

Tailwind CSS

Sebep

Yüksek performans

SEO

SSR

Server Components

Kolay ölçeklenebilirlik

---

# 4. Backend

Backend platformu

Supabase

Sebep

Authentication

Database

Storage

Realtime

Edge Functions

RLS

tek platformda sunmaktadır.

Backend mümkün olduğunca Supabase servisleri üzerinden geliştirilecektir.

---

# 5. Veritabanı

Motor

PostgreSQL

Sağlayıcı

Supabase

Sebep

Güçlü ilişki yapısı

JSON desteği

Performans

Full Text Search

RLS desteği

---

# 6. Authentication

Servis

Supabase Auth

İlk sürüm

Email + Şifre

Gelecek sürümler

Google

Apple

Magic Link

---

# 7. Dosya Depolama

Servis

Supabase Storage

Desteklenen Dosyalar

Fotoğraf

Video

Ses

PDF

Belgeler

Dosyalar bucket mantığıyla yönetilecektir.

---

# 8. AI

AI sağlayıcısı

OpenAI

Model

Geliştirme sırasında performans ve maliyet açısından en uygun güncel model kullanılacaktır.

AI kodu sağlayıcıdan bağımsız geliştirilecektir.

İleride farklı modellere geçiş mümkün olacaktır.

---

# 9. State Yönetimi

Global State

Zustand

Server State

TanStack Query

Sebep

Basitlik

Performans

Kolay bakım

---

# 10. Form Yönetimi

React Hook Form

Validasyon

Zod

---

# 11. Stil Yönetimi

Tailwind CSS

CSS Variables

Design Tokens

Component Variants

Kod içerisinde rastgele CSS yazılmayacaktır.

---

# 12. Component Yapısı

Atomic Design

Katmanlar

UI

Shared

Features

Layout

Pages

---

# 13. Animasyon

Framer Motion

Animasyonlar

150-300 ms

Animasyonlar kullanıcı deneyimini desteklemek amacıyla kullanılacaktır.

---

# 14. Grafikler

Recharts

Sebep

Basit

Modern

Responsive

---

# 15. İkonlar

Lucide Icons

Tek ikon kütüphanesi kullanılacaktır.

---

# 16. Tema

Light Theme

Dark Theme

İlk sürümde desteklenecektir.

---

# 17. Responsive

Desktop

Tablet

Mobile

Aynı özellikler

Farklı kullanıcı deneyimi

---

# 18. Güvenlik

Supabase Row Level Security

JWT

HTTPS

Rate Limiting

CSRF Koruması

XSS Koruması

Input Validation

zorunludur.

---

# 19. Loglama

Application Logs

Error Logs

AI Logs

Audit Logs

ayrı tutulacaktır.

---

# 20. Monitoring

Vercel Analytics

Supabase Logs

Runtime Monitoring

Error Tracking

Performans takibi

---

# 21. Cache

Browser Cache

React Query Cache

Server Cache

AI Response Cache (gerektiğinde)

---

# 22. Dosya Yapısı

app/

components/

features/

hooks/

lib/

services/

types/

utils/

styles/

public/

docs/

---

# 23. Kod Standartları

Strict TypeScript

ESLint

Prettier

Reusable Components

No Duplicate Code

Clean Architecture

SOLID prensipleri

---

# 24. Deployment

Platform

Vercel

Backend

Supabase

Deployment

GitHub üzerinden otomatik yapılacaktır.

---

# 25. Gelecek

İleride değiştirilebilecek katmanlar

AI Sağlayıcısı

Storage

Mail Servisi

Monitoring

Ödeme Sistemi

Bu değişiklikler uygulamanın geri kalanını etkilemeyecek şekilde soyutlanacaktır.

---

# Sonuç

KidMemoir;

modern,

ölçeklenebilir,

bakımı kolay,

AI destekli,

uzun yıllar geliştirilebilir

bir teknoloji mimarisi üzerine kurulacaktır.

---

# Onay Durumu

✅ Final