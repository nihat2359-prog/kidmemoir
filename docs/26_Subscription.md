# KidMemoir
# 26_Subscription.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Screen PRD

Bağımlılıklar

- 00_Vision.md
- 01_Product_Rules.md
- 02_User_Journey.md
- 03_Information_Architecture.md
- 04_Navigation.md
- 05_Design_System.md
- 06_UI_Standards.md
- 07_Experience_Principles.md
- 08_Tech_Stack.md

---

# 1. Amaç

Subscription ekranının amacı kullanıcının mevcut planını görüntülemesini, Premium planı satın almasını ve aboneliğini yönetmesini sağlamaktır.

---

# 2. Başarı Kriteri

Kullanıcı

60 saniyeden kısa sürede

planları karşılaştırabilmeli ve abonelik işlemini başlatabilmelidir.

---

# 3. Genel Yapı

Mevcut Plan

↓

Plan Karşılaştırması

↓

Premium Özellikleri

↓

Sık Sorulan Sorular

↓

Satın Al

---

# 4. Desktop Experience

Desktop görünümü iki sütundan oluşacaktır.

------------------------------------------------------------

Sol Alan

Mevcut Plan

Plan Kartları

------------------------------------------------------------

Sağ Alan

Premium Özellikleri

SSS

Satın Alma

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Mevcut Plan

↓

Plan Kartları

↓

Premium Özellikleri

↓

SSS

↓

Satın Al

---

# 6. Sayfa Yapısı

Header

↓

Mevcut Plan

↓

Plan Kartları

↓

Özellik Karşılaştırması

↓

Premium Avantajları

↓

SSS

↓

Satın Al

---

# 7. Mevcut Plan

Gösterilecek Bilgiler

Plan Adı

Durum

Yenileme Tarihi

AI Kullanımı

Çocuk Sayısı

Depolama Kullanımı

---

# 8. Planlar

Free

Premium Monthly

Premium Yearly

Varsayılan olarak yıllık plan önerilecektir.

---

# 9. Free Plan

Özellikler

- 1 Çocuk
- Tüm Event Özellikleri
- Tüm Timeline Özellikleri
- Tüm Raporlar
- AI Günlük Kullanım Limiti
- Temel Depolama Alanı

---

# 10. Premium Plan

Özellikler

- Sınırsız Çocuk
- Sınırsız AI Kullanımı
- Gelişmiş AI Analizleri
- Daha Fazla Depolama Alanı
- Öncelikli Yeni Özellikler
- Premium Destek

---

# 11. Özellik Karşılaştırması

Tablo halinde gösterilecektir.

Satırlar

Çocuk Sayısı

AI Kullanımı

Depolama

Raporlar

Hatırlatmalar

Medya

Destek

---

# 12. Premium Avantajları

Kartlar halinde gösterilecektir.

- Sınırsız AI
- Çoklu Çocuk Yönetimi
- Daha Büyük Depolama
- Gelişmiş Analizler
- Öncelikli Destek
- Yeni Özelliklere Erken Erişim

---

# 13. Satın Al

Primary Button

Premium'a Geç

Yıllık plan seçiliyse tasarruf bilgisi gösterilir.

---

# 14. Abonelik Yönetimi

Gösterilecek İşlemler

Planı Görüntüle

Fatura Geçmişi

Aboneliği İptal Et

Ödeme Yöntemini Güncelle

---

# 15. Sık Sorulan Sorular

Minimum 8 soru.

Örnek

Premium'u istediğim zaman iptal edebilir miyim?

AI limiti nasıl çalışıyor?

Verilerim silinir mi?

Yıllık plan avantajı nedir?

---

# 16. Wireframe

Desktop

------------------------------------------------------------

Mevcut Plan

------------------------------------------------------------

Plan Kartları

------------------------------------------------------------

Karşılaştırma

|

Premium Avantajları

------------------------------------------------------------

SSS

------------------------------------------------------------

Satın Al

------------------------------------------------------------

---

Mobile

Mevcut Plan

↓

Plan Kartları

↓

Karşılaştırma

↓

Avantajlar

↓

SSS

↓

Satın Al

---

# 17. Component Listesi

Plan Card

Comparison Table

Feature Card

Badge

FAQ Accordion

Primary Button

Secondary Button

Toast

Dialog

Loading Overlay

---

# 18. İş Kuralları

Free kullanıcı Premium plan satın alabilir.

Premium kullanıcı planını değiştirebilir.

Abonelik iptal edilirse dönem sonuna kadar Premium devam eder.

---

# 19. Validasyon

Geçerli plan seçilmelidir.

Satın alma işlemi doğrulanmalıdır.

Ödeme sonucu doğrulanmalıdır.

---

# 20. Başarılı İşlem

Abonelik aktif edilir.

Plan güncellenir.

Limitler güncellenir.

Kullanıcı bilgilendirilir.

---

# 21. Başarısız İşlem

Ödeme başarısız.

Kart reddedildi.

İnternet bağlantısı yok.

Sunucu hatası.

---

# 22. Loading

Plan Skeleton

Comparison Skeleton

Payment Loading

---

# 23. Empty State

Aktif abonelik bulunmuyor.

↓

Free Plan kullanılmaktadır.

---

# 24. Error State

Ödeme Başarısız

↓

Lütfen tekrar deneyin.

---

Bağlantı Hatası

↓

İnternet bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 25. Analytics

Subscription Viewed

Plan Selected

Upgrade Started

Upgrade Success

Upgrade Failed

Cancel Started

FAQ Expanded

---

# 26. API Gereksinimleri

GET

/subscription

GET

/subscription/plans

POST

/subscription/checkout

PATCH

/subscription

DELETE

/subscription

GET

/subscription/invoices

---

# 27. Güvenlik

Ödeme işlemleri güvenli ödeme sağlayıcısı üzerinden yapılacaktır.

Kart bilgileri KidMemoir sunucularında saklanmayacaktır.

JWT doğrulaması zorunludur.

---

# 28. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim hazırlanacaktır.

---

# 29. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 30. Performans

Plan bilgileri

<2 saniye

Ödeme ekranına geçiş

<2 saniye

---

# 31. WOW Factor

Premium plan kartları

Şık özellik karşılaştırması

Tasarruf göstergesi

Akıcı satın alma deneyimi

Minimal ve güven veren tasarım

---

# 32. Future

Aile Paketi

Hediye Abonelik

Öğrenci İndirimi

Kurumsal Plan

Yaşam Boyu Lisans

---

# Onay Durumu

✅ Final