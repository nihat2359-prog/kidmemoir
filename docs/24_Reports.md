# KidMemoir
# 24_Reports.md

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

Reports ekranının amacı çocuğun gelişimini belirli zaman aralıklarında özetlemek, anlamlandırmak ve dışa aktarılabilir raporlar oluşturmaktır.

---

# 2. Başarı Kriteri

Kullanıcı

30 saniye içerisinde

istediği raporu oluşturabilmelidir.

---

# 3. Genel Akış

Reports Aç

↓

Rapor Türü Seç

↓

Tarih Aralığı Seç

↓

AI Analizi

↓

Rapor Oluştur

↓

PDF / Yazdır / Paylaş

---

# 4. Desktop Experience

Desktop görünümü üç bölümden oluşacaktır.

------------------------------------------------------------

Sol Panel

Rapor Türleri

------------------------------------------------------------

Orta Alan

Rapor Önizleme

------------------------------------------------------------

Sağ Panel

Filtreler

AI Özeti

İşlemler

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Rapor Türü

↓

Filtreler

↓

Önizleme

↓

İşlemler

---

# 6. Sayfa Yapısı

Header

↓

Rapor Türleri

↓

Filtreler

↓

Önizleme

↓

AI Özeti

↓

İşlemler

---

# 7. Rapor Türleri

Hazır raporlar

- Günlük Özet
- Haftalık Özet
- Aylık Özet
- Yıllık Özet
- Sağlık Raporu
- Okul Raporu
- Gelişim Raporu
- Davranış Raporu
- Özel Tarih Aralığı

---

# 8. Filtreler

Çocuk

Tarih Aralığı

Kategori

Alt Kategori

Etiket

Medya İçerenler

Favoriler

---

# 9. Önizleme

Rapor oluşturulmadan önce önizleme gösterilecektir.

İçerik

Kapak

↓

Özet

↓

İstatistikler

↓

Timeline

↓

AI Analizi

↓

Önemli Event'ler

↓

Sonuç

---

# 10. AI Özeti

Raporun kısa özeti gösterilecektir.

İçerik

- Genel Değerlendirme
- Dikkat Çeken Değişiklikler
- Güçlü Yönler
- Öneriler

---

# 11. İstatistikler

Toplam Event

Toplam Medya

En Aktif Kategori

En Yoğun Ay

En Çok Kullanılan Etiket

---

# 12. İşlemler

PDF İndir

Yazdır

Paylaş

Tekrar Oluştur

---

# 13. Wireframe

Desktop

------------------------------------------------------------

Rapor Türleri

|

Önizleme

|

Filtreler

------------------------------------------------------------

AI Özeti

------------------------------------------------------------

İşlemler

------------------------------------------------------------

---

Mobile

Rapor Türü

↓

Filtreler

↓

Önizleme

↓

AI

↓

İşlemler

---

# 14. Component Listesi

Report Card

Filter Panel

Date Range Picker

Statistic Card

AI Insight Card

Timeline Summary

PDF Button

Share Button

Print Button

Toast

Dialog

Loading Overlay

---

# 15. İş Kuralları

Rapor yalnızca seçili çocuğa ait verilerden oluşturulur.

Rapor oluşturulduğunda sistemde saklanmaz.

Her oluşturma işlemi güncel veriler ile yeniden hesaplanır.

---

# 16. Validasyon

Geçerli tarih aralığı seçilmelidir.

Rapor oluşturmak için en az bir Event bulunmalıdır.

---

# 17. Başarılı İşlem

Rapor oluşturulur.

Önizleme hazırlanır.

PDF indirilebilir.

Paylaşılabilir.

---

# 18. Başarısız İşlem

Yetersiz veri.

AI oluşturulamadı.

Sunucu hatası.

İnternet bağlantısı yok.

---

# 19. Loading

Report Skeleton

Statistic Skeleton

AI Skeleton

PDF Generation Loader

---

# 20. Empty State

Seçilen tarih aralığında yeterli kayıt bulunmuyor.

↓

Farklı bir tarih aralığı seçin.

---

# 21. Error State

Rapor Oluşturulamadı

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

Reports Viewed

Report Generated

PDF Downloaded

Printed

Shared

Filter Applied

AI Summary Viewed

---

# 23. API Gereksinimleri

POST

/reports/generate

POST

/reports/pdf

POST

/reports/share

GET

/reports/preview

---

# 24. Güvenlik

Yalnızca yetkili kullanıcı rapor oluşturabilir.

Paylaşım bağlantıları süreli olmalıdır.

PDF içerisinde yalnızca yetkili veriler bulunmalıdır.

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

Rapor oluşturma

<10 saniye

PDF oluşturma arka planda yapılabilir.

Önizleme kademeli olarak yüklenmelidir.

---

# 28. WOW Factor

Premium rapor tasarımı

AI destekli profesyonel özet

Yüksek kaliteli PDF çıktısı

Modern istatistik kartları

Akıcı önizleme deneyimi

---

# 29. Future

Karşılaştırmalı raporlar

İki tarih aralığını karşılaştırma

Doktor paylaşım paketi

Okul paylaşım paketi

Otomatik aylık rapor

Otomatik yıllık gelişim kitabı

---

# Onay Durumu

✅ Final