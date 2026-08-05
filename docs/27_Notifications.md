# KidMemoir
# 27_Notifications.md

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
- 09_Domain_Model.md
- 10_Event_Catalog.md

---

# 1. Amaç

Notifications ekranının amacı kullanıcıya ait tüm bildirimleri tek merkezden görüntülemek, yönetmek ve ilgili içeriklere hızlı erişim sağlamaktır.

---

# 2. Başarı Kriteri

Kullanıcı

10 saniye içerisinde

bildirimlerini inceleyebilmeli ve ilgili ekrana ulaşabilmelidir.

---

# 3. Genel Yapı

Okunmamış Bildirimler

↓

Bugün

↓

Bu Hafta

↓

Daha Eski

↓

Arşiv

---

# 4. Desktop Experience

Desktop görünümü iki sütundan oluşacaktır.

------------------------------------------------------------

Sol Panel

Bildirim Filtreleri

------------------------------------------------------------

Sağ Panel

Bildirim Listesi

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Filtre

↓

Bildirimler

↓

Detay

---

# 6. Sayfa Yapısı

Header

↓

Filtreler

↓

Okunmamış

↓

Bildirim Listesi

↓

İşlemler

---

# 7. Bildirim Türleri

AI

Hatırlatma

Sağlık

Okul

Sistem

Premium

Güvenlik

---

# 8. Bildirim Kartı

Her kartta aşağıdaki bilgiler bulunacaktır.

İkon

Başlık

Kısa Açıklama

Tarih

Saat

Okundu Durumu

---

# 9. Filtreler

Tümü

Okunmamış

AI

Hatırlatmalar

Sistem

Premium

---

# 10. İşlemler

Bildirimi Aç

Okundu İşaretle

Okunmadı İşaretle

Sil

Tümünü Okundu Yap

---

# 11. Bildirim Detayı

Başlık

Açıklama

Oluşturulma Tarihi

İlgili Çocuk

İlgili Event

İlgili Sayfaya Git

---

# 12. Gruplama

Bugün

Dün

Bu Hafta

Bu Ay

Daha Eski

---

# 13. Wireframe

Desktop

------------------------------------------------------------

Filtreler

|

Bildirim Listesi

------------------------------------------------------------

---

Mobile

Filtre

↓

Bildirimler

↓

Detay

---

# 14. Component Listesi

Notification Card

Badge

Filter Tabs

Action Menu

Primary Button

Secondary Button

Toast

Dialog

Loading Overlay

---

# 15. İş Kuralları

Bildirime tıklandığında okundu olarak işaretlenir.

Silinen bildirim geri getirilemez.

Sistem bildirimleri silinemez.

---

# 16. Validasyon

Bildirim mevcut olmalıdır.

Kullanıcının erişim yetkisi olmalıdır.

---

# 17. Başarılı İşlem

Bildirim durumu güncellenir.

Sayaç anında güncellenir.

İlgili ekrana yönlendirme yapılır.

---

# 18. Başarısız İşlem

Bildirim bulunamadı.

Yetkisiz erişim.

Sunucu hatası.

İnternet bağlantısı yok.

---

# 19. Loading

Notification Skeleton

Filter Skeleton

Infinite Scroll Loader

---

# 20. Empty State

Henüz bildiriminiz bulunmuyor.

↓

Yeni bildirimler burada görünecek.

---

# 21. Error State

Bildirimler Yüklenemedi

↓

Tekrar Dene.

---

Bağlantı Hatası

↓

İnternet bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 22. Analytics

Notifications Viewed

Notification Opened

Notification Deleted

Notification Marked Read

Notification Marked Unread

Filter Applied

---

# 23. API Gereksinimleri

GET

/notifications

PATCH

/notifications/{id}/read

PATCH

/notifications/{id}/unread

PATCH

/notifications/read-all

DELETE

/notifications/{id}

---

# 24. Güvenlik

Yalnızca yetkili kullanıcı kendi bildirimlerini görebilir.

Tüm istekler JWT ile doğrulanacaktır.

---

# 25. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim hazırlanacaktır.

---

# 26. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 27. Performans

İlk yükleme

<2 saniye

Bildirimler sayfalama ile yüklenmelidir.

Gerçek zamanlı yeni bildirim desteği bulunmalıdır.

---

# 28. WOW Factor

Canlı bildirim sayacı

Akıcı kart animasyonları

Gerçek zamanlı bildirim güncellemeleri

Modern ve sade liste tasarımı

---

# 29. Future

Push geçmişi

Bildirim zamanlama

Bildirim kategorilerini özelleştirme

AI önceliklendirme

Akıllı bildirim sessize alma

---

# Onay Durumu

✅ Final