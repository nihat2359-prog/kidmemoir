# KidMemoir
# 06_UI_Standards.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** UI Standards

Bağımlılıklar

- 05_Design_System.md

---

# 1. Amaç

Bu doküman KidMemoir'ın teknik kullanıcı arayüzü standartlarını tanımlar.

Amaç;

• bütün ekranlarda aynı component yapısını kullanmak

• tekrar eden kodları azaltmak

• tasarım tutarlılığı sağlamak

• AI destekli geliştirmeyi kolaylaştırmaktır.

---

# 2. Frontend Teknolojisi

Framework

Next.js

Dil

TypeScript

UI

React

CSS

Tailwind CSS

Component Yapısı

Atomic Design

İkonlar

Lucide Icons

Animasyon

Framer Motion

Form

React Hook Form

Validasyon

Zod

State

Zustand

Server State

TanStack Query

Tablo

TanStack Table

Grafikler

Recharts

Dosya Yükleme

UploadThing veya benzeri

---

# 3. Breakpoint Sistemi

Mobile

0-767px

Tablet

768-1023px

Desktop

1024px+

Large Desktop

1440px+

---

# 4. Renk Tokenları

Primary

Secondary

Background

Surface

Border

Text

Muted

Success

Warning

Danger

Info

AI

Timeline

Journal

Renk kodları Theme dosyasında tutulacaktır.

Kod içerisinde HEX kullanılmayacaktır.

---

# 5. Typography

Font

Inter

Alternatif

Geist

Yedek

system-ui

---

H1

H2

H3

H4

Body Large

Body

Caption

Small

Label

Kod içerisinde font-size kullanılmayacaktır.

Typography componentleri kullanılacaktır.

---

# 6. Spacing

8px Grid

4

8

12

16

24

32

40

48

64

80

96

Kod içerisinde rastgele margin verilmez.

---

# 7. Border Radius

xs

sm

md

lg

xl

full

Standart Theme üzerinden gelir.

---

# 8. Shadow

shadow-sm

shadow-md

shadow-lg

Custom shadow kullanılmaz.

---

# 9. Z-Index

Dropdown

Dialog

Drawer

Toast

Tooltip

Loading

Modal

Bütün z-index değerleri tek dosyada tanımlanacaktır.

---

# 10. Button Component

Props

variant

size

loading

disabled

icon

iconPosition

fullWidth

onClick

type

Button Variant

Primary

Secondary

Ghost

Danger

Success

Outline

Link

Icon

FAB

---

# 11. Input Component

Desteklenen Türler

Text

Number

Email

Password

Search

Date

Time

Textarea

Phone

Autocomplete

Input Mask

Validation

Loading

Disabled

Readonly

Error

Success

---

# 12. Card Component

Card

ChildCard

JournalCard

TimelineCard

AIInsightCard

ReportCard

MediaCard

EmptyCard

SkeletonCard

---

# 13. Modal

Modal

Drawer

Bottom Sheet (Mobile)

Dialog

Confirmation

Alert

---

# 14. Navigation Component

Desktop Sidebar

Top Header

Bottom Navigation

Breadcrumb

Tabs

Pagination

---

# 15. Feedback Component

Toast

Snackbar

Alert

Inline Message

Progress

Loading

Skeleton

---

# 16. Avatar

User Avatar

Child Avatar

Group Avatar

Default Avatar

---

# 17. Badge

Success

Warning

Error

Premium

AI

Journal

Timeline

---

# 18. Tag

Etiket sistemi bütün uygulamada ortak olacaktır.

Örnek

School

Sleep

Health

Emotion

Behavior

Achievement

---

# 19. Empty State

Her modülün Empty State componenti olacaktır.

Örnek

No Journal

No Reports

No AI

No Photos

---

# 20. Loading

Skeleton

önceliklidir.

Spinner yalnızca kısa işlemlerde kullanılacaktır.

---

# 21. Animasyon

Framer Motion kullanılacaktır.

Animasyonlar

150-300ms

arasında olmalıdır.

Sayfa geçişleri hızlı olmalıdır.

---

# 22. Responsive

Desktop

Tablet

Mobile

componentleri gerektiğinde farklı render edilebilir.

Tek component zorunlu değildir.

---

# 23. Dosya Yapısı

components/

ui/

layout/

journal/

children/

timeline/

reports/

ai/

shared/

Her component kendi klasöründe bulunacaktır.

---

# 24. Kod Standartları

Componentler mümkün olduğunca stateless olacaktır.

Props ile yönetilecektir.

Tekrar eden JSX oluşturulmayacaktır.

---

# 25. Accessibility

ARIA

Keyboard

Screen Reader

Focus

Contrast

zorunludur.

---

# 26. Dark Mode

Light

Dark

ilk sürümde desteklenecektir.

---

# 27. Sonuç

KidMemoir'ın kullanıcı arayüzü;

modern,

performanslı,

yeniden kullanılabilir,

AI tarafından kolay geliştirilebilir,

uzun yıllar sürdürülebilir

bir component mimarisi üzerine kurulacaktır.

---

# Görsel Standartlar

Her ekran;

en az bir Hero Card içermelidir.

Her ekran;

farklı kart boyutları kullanmalıdır.

Tek tip kart diziliminden kaçınılacaktır.

Gradient yalnızca vurgu amacıyla kullanılacaktır.

Glass efektleri yalnızca AI veya özel kartlarda kullanılabilir.

Hover animasyonları zorunludur.

Micro Interaction bütün componentlerde bulunacaktır.


# Onay Durumu

✅ Final