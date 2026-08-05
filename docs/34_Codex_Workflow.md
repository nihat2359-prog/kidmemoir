# KidMemoir

# 34_Codex_Workflow.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** AI Development Workflow

Bağımlılıklar

* 31_Architecture.md
* 32_Development_Guide.md
* 33_Roadmap.md

---

# 1. Amaç

Bu doküman, KidMemoir projesinin AI destekli geliştirme sürecini tanımlar.

Bu kurallar ChatGPT, Codex ve gelecekte kullanılacak diğer AI kod üreticileri için geçerlidir.

Amaç;

* Kod kalitesini korumak
* Büyük değişiklikleri önlemek
* Dosya yapısını bozmamak
* Tutarlı geliştirme yapmak
* AI'ın proje bütünlüğünü korumasını sağlamaktır.

---

# 2. Temel Kural

**Bir oturum = Bir görev**

AI hiçbir zaman aynı anda birden fazla büyük özelliği geliştirmeye çalışmamalıdır.

---

# 3. Geliştirme Sırası

Her zaman aşağıdaki sıraya uyulacaktır.

1. Dokümanı oku.
2. İlgili mevcut kodu analiz et.
3. Eksik yapıları belirle.
4. Planı oluştur.
5. Kodu üret.
6. Derleme hatalarını düzelt.
7. Responsive kontrolü yap.
8. Kodu teslim et.

---

# 4. Doküman Önceliği

Bir çelişki olması durumunda öncelik sırası aşağıdaki gibidir.

1. Product Rules
2. Screen PRD
3. Architecture
4. Development Guide
5. Roadmap

---

# 5. Tek Görev Prensibi

AI aynı oturumda aşağıdakilerden yalnızca birini yapmalıdır.

* Yeni ekran
* Yeni component
* Yeni API
* Yeni migration
* Refactor
* Bug Fix

Karışık görev yapılmayacaktır.

---

# 6. Ekran Geliştirme Sırası

Her ekran aşağıdaki sırayla geliştirilmelidir.

1. Route
2. Layout
3. Component yapısı
4. Form
5. API bağlantısı
6. Validation
7. Loading
8. Empty State
9. Error State
10. Responsive
11. Accessibility
12. Analytics

---

# 7. Feature Geliştirme Sırası

Yeni bir özellik eklenirken aşağıdaki sıra izlenmelidir.

* Database
* Types
* Validation
* Server Action
* API
* UI
* Test
* Analytics

---

# 8. Büyük Görevler Bölünmelidir

Aşağıdaki gibi büyük görevler verilmemelidir.

❌ Child Home ekranını yap.

Yerine;

* Hero
* AI Card
* Quick Actions
* Recent Events
* Health Card
* Growth Card
* Media Card

ayrı ayrı geliştirilmelidir.

---

# 9. Prompt Formatı

Her geliştirme isteği aşağıdaki yapıda verilmelidir.

Amaç

↓

İlgili Doküman

↓

Kısıtlar

↓

Beklenen Çıktı

---

# 10. Örnek Prompt

Amaç

Create Child ekranını oluştur.

Doküman

17_Create_First_Child.md

Kurallar

* Başka dosya değiştirme.
* Design System kullan.
* Responsive yap.
* Server Actions kullan.
* TypeScript Strict.

Beklenen Sonuç

Çalışan ekran.

---

# 11. Kod Yazma Kuralları

AI;

* Gereksiz kod üretmeyecek.
* Kullanılmayan dosya oluşturmayacak.
* Kullanılmayan paket eklemeyecek.
* Aynı kodu tekrar etmeyecek.

---

# 12. Kod Değiştirme Kuralları

Var olan çalışan kod korunmalıdır.

Sadece gerekli satırlar değiştirilmelidir.

Geniş kapsamlı refactor yapılmamalıdır.

---

# 13. Refactor Kuralları

Refactor yalnızca kullanıcı istediğinde yapılacaktır.

Refactor sırasında davranış değişmemelidir.

---

# 14. Tasarım Kuralları

Design System dışına çıkılmayacaktır.

Yeni renk eklenmeyecektir.

Yeni spacing tanımlanmayacaktır.

Yeni component varyantı oluşturulmayacaktır.

---

# 15. Responsive Kontrolü

Her geliştirme sonunda aşağıdaki cihazlar kontrol edilmelidir.

* Mobile
* Tablet
* Desktop

---

# 16. Accessibility Kontrolü

Her ekran aşağıdakileri desteklemelidir.

* Keyboard Navigation
* Focus
* ARIA
* Screen Reader

---

# 17. Performans Kontrolü

Her geliştirme sonunda aşağıdakiler değerlendirilmelidir.

* Gereksiz render var mı?
* Gereksiz client component var mı?
* Gereksiz fetch var mı?
* Lazy Load kullanılmalı mı?

---

# 18. Kod Kalitesi Kontrolü

Teslimden önce;

* TypeScript hatası
* ESLint hatası
* Import fazlalığı
* Kullanılmayan değişken
* any kullanımı

kontrol edilmelidir.

---

# 19. Güvenlik Kontrolü

Her geliştirmede;

* Yetki kontrolü
* Input doğrulama
* Server Action güvenliği
* RLS uyumu

kontrol edilmelidir.

---

# 20. Test Kontrolü

Her yeni özellikte aşağıdakiler düşünülmelidir.

* Başarılı senaryo
* Boş veri
* Hatalı veri
* Yetkisiz kullanıcı
* Ağ hatası

---

# 21. Commit Kuralları

Her tamamlanan görev sonunda commit atılmalıdır.

Örnekler

* Project Skeleton
* Design System
* Authentication
* Create Child
* Child Home Hero
* Timeline Filters
* AI Chat
* Reports

---

# 22. Yapılmaması Gerekenler

* Aynı anda 5 ekran geliştirmek
* Büyük refactor yapmak
* Tasarım sistemini değiştirmek
* Dokümanları yok saymak
* Kullanılmayan kod üretmek
* Gereksiz bağımlılık eklemek

---

# 23. AI Davranış Kuralları

AI emin olmadığı konularda tahmin yürütmemelidir.

Önce mevcut kodu incelemeli, ardından değişiklik önermelidir.

Çalışan yapıyı bozacak değişikliklerden kaçınmalıdır.

---

# 24. Geliştirme Döngüsü

Dokümanı Oku

↓

Planla

↓

Kodla

↓

Kontrol Et

↓

Düzelt

↓

Commit

↓

Sonraki Görev

---

# 25. Tamamlanma Kriteri

Bir görev tamamlanmış sayılabilmesi için;

* Derlenmelidir.
* Çalışmalıdır.
* Responsive olmalıdır.
* Loading State bulunmalıdır.
* Empty State bulunmalıdır.
* Error State bulunmalıdır.
* TypeScript hatası olmamalıdır.
* ESLint hatası olmamalıdır.
* Dokümanla uyumlu olmalıdır.

---

# 26. Sonuç

KidMemoir küçük ve kontrollü adımlarla geliştirilecektir.

Her geliştirme oturumu yalnızca tek bir hedefe odaklanacak, proje mimarisi korunacak ve tüm kararlar mevcut dokümantasyona bağlı kalacaktır.

Bu yaklaşım projenin uzun yıllar boyunca sürdürülebilir, okunabilir ve kolay geliştirilebilir kalmasını sağlayacaktır.

---

# Onay Durumu

✅ Final
