# KidMemoir
# 21_Timeline.md

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

Timeline ekranı çocuğun yaşamındaki tüm Event'leri kronolojik sırayla görselleştirir.

Bu ekran yalnızca listeleme ekranı değildir.

Timeline, çocuğun yaşam hikâyesini anlatır.

---

# 2. Başarı Kriteri

Kullanıcı

15 saniye içerisinde

çocuğun gelişimini yıllar boyunca takip edebilmelidir.

---

# 3. Genel Akış

Timeline Aç

↓

Filtrele

↓

Event İncele

↓

Detaya Git

↓

Yeni Event Oluştur

---

# 4. Desktop Experience

Desktop görünüm üç bölümden oluşacaktır.

------------------------------------------------------------

Sol Panel

Filtreler

------------------------------------------------------------

Orta Alan

Timeline

------------------------------------------------------------

Sağ Panel

AI Özeti

İstatistikler

Takvim

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Filtre

↓

Timeline

↓

AI Özeti

---

# 6. Sayfa Yapısı

Header

↓

Timeline Özeti

↓

Filtreler

↓

Timeline

↓

Yükle

---

# 7. Timeline Özeti

Gösterilecek Bilgiler

- Toplam Event Sayısı
- İlk Kayıt Tarihi
- Son Kayıt Tarihi
- Seçili Dönem

---

# 8. Filtreler

Tarih Aralığı

Kategori

Alt Kategori

Etiket

Favoriler

Medya İçerenler

AI Analizli Olanlar

---

# 9. Timeline

Her Event kart olarak gösterilecektir.

Kart İçeriği

- İkon
- Başlık
- Açıklama
- Tarih
- Saat
- Medya Önizlemesi
- AI Rozeti
- Favori Rozeti

---

# 10. Gruplama

Timeline aşağıdaki gruplamaları destekler.

Gün

Hafta

Ay

Yıl

---

# 11. Takvim Görünümü

Takvim görünümü isteğe bağlı olarak açılabilir.

Event bulunan günler işaretlenir.

---

# 12. AI Özeti

Seçili zaman aralığı için kısa analiz gösterilir.

Örnek

Son 30 günde okul ile ilgili kayıtlar arttı.

---

# 13. Hızlı İşlemler

Yeni Event

Filtreleri Temizle

Bugüne Git

PDF Olarak Dışa Aktar

---

# 14. Wireframe

Desktop

------------------------------------------------------------

Header

------------------------------------------------------------

Özet

------------------------------------------------------------

Filtre

|

Timeline

|

AI

------------------------------------------------------------

---

Mobile

Header

↓

Özet

↓

Filtre

↓

Timeline

↓

AI

---

# 15. Component Listesi

Timeline Card

Timeline Connector

Filter Panel

Date Range Picker

Tag Filter

Statistic Card

AI Insight Card

Calendar

Primary Button

Floating Action Button

Toast

Dialog

Loading Overlay

---

# 16. İş Kuralları

Event'ler tarihe göre sıralanacaktır.

Varsayılan sıralama

En yeni → En eski

Filtreler birlikte çalışmalıdır.

Timeline gerçek zamanlı güncellenmelidir.

---

# 17. Validasyon

Geçerli tarih aralığı seçilmelidir.

Filtre değerleri doğrulanmalıdır.

---

# 18. Başarılı İşlem

Filtre uygulanır.

Timeline yeniden yüklenir.

AI özeti güncellenir.

---

# 19. Başarısız İşlem

Veri yüklenemedi.

Filtre uygulanamadı.

İnternet bağlantısı yok.

---

# 20. Loading

Timeline Skeleton

Filter Skeleton

AI Skeleton

Infinite Scroll Loader

---

# 21. Empty State

Bu tarih aralığında kayıt bulunmuyor.

↓

İlk Event'i Oluştur.

---

Filtre sonucu bulunamadı.

↓

Filtreleri Temizle.

---

# 22. Error State

Bağlantı Hatası

↓

Tekrar Dene.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 23. Analytics

Timeline Viewed

Filter Applied

Event Opened

Export Clicked

Calendar Opened

AI Insight Viewed

---

# 24. API Gereksinimleri

GET

/timeline

GET

/timeline/summary

GET

/timeline/calendar

GET

/timeline/ai-summary

---

# 25. Güvenlik

Sadece yetkili kullanıcı görüntüleyebilir.

Tüm istekler JWT ile doğrulanacaktır.

---

# 26. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim hazırlanacaktır.

---

# 27. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 28. Performans

Infinite Scroll kullanılacaktır.

İlk yükleme

<2 saniye

Kartlar sanal listeleme (virtualization) ile gösterilecektir.

Medya Lazy Load kullanılacaktır.

---

# 29. WOW Factor

Yaşam hikâyesi hissi veren akıcı Timeline

Zengin Event kartları

Premium dikey zaman çizgisi

Yumuşak geçiş animasyonları

Takvim ve Timeline arasında akıcı geçiş

AI destekli dönem özeti

---

# 30. Future

Yatay Timeline görünümü

Harita görünümü

AI tarafından oluşturulan yaşam özeti

Yazdırılabilir zaman çizelgesi

Milestone görünümü

---

# Onay Durumu

✅ Final