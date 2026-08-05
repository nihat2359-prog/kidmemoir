# KidMemoir
# 32_Development_Guide.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Development Guide

Bağımlılıklar

- 05_Design_System.md
- 06_UI_Standards.md
- 08_Tech_Stack.md
- 30_API_Standards.md
- 31_Architecture.md

---

# 1. Amaç

Bu doküman KidMemoir geliştirme standartlarını tanımlar.

Bu projede yazılacak bütün kodlar bu kurallara uymak zorundadır.

Bu kurallar yalnızca insanlar için değil, Codex ve diğer AI kod üreticileri için de referans niteliğindedir.

---

# 2. Genel Prensipler

KidMemoir geliştirilirken aşağıdaki prensipler uygulanacaktır.

- Basit kod yaz.
- Gereksiz soyutlama yapma.
- Erken optimizasyon yapma.
- Tek sorumluluk ilkesini uygula.
- Kod tekrarından kaçın.
- Okunabilirliği performansın önüne koy.
- Önce güvenlik.
- Önce kullanıcı deneyimi.
- Önce erişilebilirlik.

---

# 3. Teknoloji Standartları

Frontend

- Next.js (App Router)

Dil

- TypeScript (strict mode)

Veritabanı

- PostgreSQL (Supabase)

Authentication

- Supabase Auth

Storage

- Supabase Storage

Yapay Zeka

- OpenAI API

Stil

- Tailwind CSS

UI

- shadcn/ui

İkonlar

- Lucide Icons

Animasyon

- Framer Motion

Form

- React Hook Form

Validasyon

- Zod

---

# 4. Klasör Yapısı

```text
src/

app/

components/

features/

lib/

hooks/

services/

actions/

types/

utils/

styles/

public/
```

Her özellik (`Feature`) kendi klasörü içerisinde yaşamalıdır.

---

# 5. Feature Yapısı

Örnek

```text
features/

events/

components/

actions/

hooks/

schemas/

types/

utils/

services/

```

Feature'lar birbirine bağımlı olmamalıdır.

---

# 6. Component Kuralları

Bir component yalnızca tek bir iş yapmalıdır.

Bir component mümkün olduğunca 300 satırı geçmemelidir.

Büyük componentler daha küçük parçalara bölünmelidir.

---

# 7. Sayfa Kuralları

Her ekran

- tek sorumluluğa sahip olmalıdır.
- Server Component olarak başlamalıdır.

Client Component yalnızca gerçekten gerekiyorsa kullanılmalıdır.

---

# 8. Server Component Politikası

Varsayılan

Server Component

Client kullanılacak durumlar

- Modal
- Form
- Animation
- Upload
- AI Chat
- Drag Drop
- Video Player

---

# 9. Server Action Politikası

Bütün veri değiştiren işlemler

Server Action

üzerinden yapılacaktır.

Örnek

- Create Child
- Update Child
- Create Event
- Delete Event
- Update Profile
- Change Password

---

# 10. State Yönetimi

Öncelik sırası

1. URL State

2. Server State

3. Local State

4. Global State

Global state yalnızca gerçekten gerekiyorsa kullanılacaktır.

---

# 11. Veri Alma Kuralları

Server Components veri yükler.

Client Components yalnızca kullanıcı etkileşimi yapar.

Gereksiz fetch işlemleri yapılmaz.

---

# 12. Form Standartları

Tüm formlar

React Hook Form

+

Zod

kullanacaktır.

Client tarafında doğrulama yapılacaktır.

Sunucu tarafında tekrar doğrulama yapılacaktır.

---

# 13. Hata Yönetimi

Her işlem aşağıdaki durumları desteklemelidir.

- Loading
- Success
- Empty
- Error

Hiçbir ekran yalnızca "Happy Path" için yazılmayacaktır.

---

# 14. Toast Standartları

Başarılı işlem

Yeşil

Bilgi

Mavi

Uyarı

Sarı

Hata

Kırmızı

---

# 15. Dialog Standartları

Silme

Arşivleme

Çıkış

Abonelik İptali

geri alınamaz işlemler dialog ile onaylanmalıdır.

---

# 16. Loading Standartları

Spinner mümkün olduğunca kullanılmayacaktır.

Skeleton kullanılacaktır.

---

# 17. Empty State

Her ekran Empty State tasarımına sahip olacaktır.

Boş ekran gösterilmeyecektir.

Her Empty State kullanıcıyı bir sonraki adıma yönlendirecektir.

---

# 18. Responsive Kuralları

Desktop

Tablet

Mobile

üçü ayrı tasarlanacaktır.

Mobil görünüm masaüstünün küçültülmüş hali olmayacaktır.

---

# 19. Mobil Önceliği

Tüm ekranlar önce mobil deneyim düşünülerek tasarlanacaktır.

Daha sonra tablet ve masaüstüne genişletilecektir.

---

# 20. Tasarım Kuralları

Kart tabanlı tasarım kullanılacaktır.

Bol boşluk kullanılacaktır.

Büyük tipografi tercih edilecektir.

Premium görünüm korunacaktır.

---

# 21. Animasyon Kuralları

Animasyonlar

200-300 ms

arasında olacaktır.

Animasyonlar kullanıcıyı bekletmeyecektir.

---

# 22. Renk Kuralları

Renkler yalnızca

Design System

üzerinden kullanılacaktır.

HEX değerleri doğrudan kullanılmayacaktır.

---

# 23. Icon Kuralları

Yalnızca

Lucide Icons

kullanılacaktır.

Farklı icon paketleri kullanılmayacaktır.

---

# 24. Dosya İsimlendirme

Component

PascalCase

```
ChildCard.tsx
```

Hook

camelCase

```
useTimeline.ts
```

Server Action

camelCase

```
createEvent.ts
```

---

# 25. Kod Standartları

any kullanılmayacaktır.

unknown tercih edilir.

Type oluşturulacaktır.

Magic Number kullanılmayacaktır.

Magic String kullanılmayacaktır.

---

# 26. Güvenlik

JWT doğrulanacaktır.

RLS aktif olacaktır.

Input sanitize edilecektir.

HTML render edilmeyecektir.

Dosya yüklemeleri doğrulanacaktır.

---

# 27. Performans

Lazy Loading

Code Splitting

Image Optimization

Server Components

Parallel Fetch

öncelikli olacaktır.

---

# 28. AI Standartları

AI hiçbir zaman doğrudan veritabanına erişmeyecektir.

Context Builder kullanılacaktır.

Her cevap referans içerecektir.

AI teşhis koymayacaktır.

---

# 29. Kod İnceleme Kuralları

Merge edilmeden önce aşağıdaki maddeler kontrol edilmelidir.

- TypeScript hatası yok.
- ESLint hatası yok.
- Responsive tamam.
- Accessibility tamam.
- Loading var.
- Empty State var.
- Error State var.
- Analytics eklendi.
- API güvenliği tamam.

---

# 30. Sonuç

KidMemoir;

- okunabilir,
- sürdürülebilir,
- ölçeklenebilir,
- güvenli,
- premium kullanıcı deneyimine sahip

bir ürün olarak geliştirilecektir.

Bu doküman proje boyunca tüm geliştirme kararlarında referans alınacaktır.

---

# Onay Durumu

✅ Final