# KidMemoir
# 19_New_Event.md

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

New Event ekranının amacı ebeveynin çocuğuyla ilgili önemli bir olayı hızlı, kolay ve zengin içerikle kaydedebilmesini sağlamaktır.

Bu ekran uygulamanın en sık kullanılan ekranlarından biridir.

---

# 2. Başarı Kriteri

Kullanıcı

60 saniyeden kısa sürede

bir Event oluşturabilmelidir.

---

# 3. Genel Akış

Event Tipi Seç

↓

Bilgileri Gir

↓

Medya Ekle

↓

AI Analizine Dahil Et

↓

Kaydet

↓

Event Detail

---

# 4. Desktop Experience

Desktop görünüm üç bölümden oluşacaktır.

------------------------------------------------------------

Sol Panel

Event Kategorileri

------------------------------------------------------------

Orta Alan

Event Formu

------------------------------------------------------------

Sağ Panel

Canlı Önizleme

AI Bilgilendirme

İpuçları

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Kategori

↓

Form

↓

Medya

↓

Kaydet

---

# 6. Sayfa Yapısı

Header

↓

Kategori

↓

Alt Kategori

↓

Başlık

↓

Açıklama

↓

Tarih

↓

Saat

↓

Etiketler

↓

Medya

↓

AI Analizi

↓

Kaydet

---

# 7. Event Kategorisi

Zorunludur.

Kategori örnekleri

- Sağlık
- Eğitim
- Gelişim
- Davranış
- Duygu
- Uyku
- Beslenme
- Sosyal
- Başarı
- Hobi
- Genel

---

# 8. Alt Kategori

Kategori seçimine göre dinamik olarak yüklenir.

Örnek

Sağlık

↓

Doktor Ziyareti

↓

Aşı

↓

İlaç

↓

Ateş

---

# 9. Başlık

Zorunlu

Maksimum

150 karakter

Varsayılan olarak seçilen Event tipine göre otomatik önerilebilir.

---

# 10. Açıklama

Opsiyonel

Markdown desteklenmez.

Maksimum

5000 karakter

---

# 11. Tarih

Zorunlu

Varsayılan

Bugün

Gelecek tarih seçilebilir.

---

# 12. Saat

Opsiyonel

---

# 13. Etiketler

Opsiyonel

Serbest etiket eklenebilir.

Önerilen etiketler gösterilebilir.

---

# 14. Medya

Desteklenen Dosyalar

Fotoğraf

Video

Ses

PDF

Belgeler

Çoklu seçim desteklenir.

Sürükle bırak desteklenir.

---

# 15. AI Analizi

Varsayılan

Aktif

Kullanıcı isterse kapatabilir.

AI analiz sonucu kayıt oluşturulduktan sonra hazırlanacaktır.

---

# 16. Canlı Önizleme

Desktop sürümünde Event kartının önizlemesi gösterilecektir.

Kullanıcı yaptığı değişiklikleri anlık olarak görebilecektir.

---

# 17. Wireframe

Desktop

------------------------------------------------------------

Kategori

|

Form

|

Önizleme

------------------------------------------------------------

Başlık

Açıklama

Tarih

Saat

Etiket

Medya

AI

Kaydet

------------------------------------------------------------

---

Mobile

Kategori

↓

Form

↓

Medya

↓

AI

↓

Kaydet

---

# 18. Component Listesi

Category Card

Category Selector

Input

Textarea

Date Picker

Time Picker

Tag Input

Media Upload

Toggle Switch

Preview Card

Primary Button

Toast

Dialog

Loading Overlay

---

# 19. İş Kuralları

Kategori seçilmeden kayıt oluşturulamaz.

Başlık zorunludur.

Tarih zorunludur.

Her Event yalnızca bir kategoriye ait olabilir.

Bir Event birden fazla medya içerebilir.

---

# 20. Validasyon

Kategori seçilmelidir.

Başlık boş olamaz.

Başlık maksimum uzunluğu aşamaz.

Dosya tipi doğrulanmalıdır.

Dosya boyutu sınırları kontrol edilmelidir.

---

# 21. Başarılı İşlem

Event oluşturulur.

Medyalar yüklenir.

AI analiz kuyruğuna eklenir.

Timeline güncellenir.

Child Home güncellenir.

Event Detail ekranına yönlendirilir.

---

# 22. Başarısız İşlem

Sunucu hatası

Dosya yükleme hatası

İnternet bağlantısı yok

Geçersiz veri

---

# 23. Loading

Kaydet butonu Loading durumuna geçer.

Dosya yükleme ilerlemesi gösterilir.

Canlı önizleme güncellenmeye devam eder.

---

# 24. Empty State

Henüz medya eklenmedi.

↓

Fotoğraf veya belge ekleyin.

---

Henüz etiket eklenmedi.

↓

Etiket eklemek isteğe bağlıdır.

---

# 25. Error State

Geçersiz Dosya

↓

Desteklenmeyen dosya formatı.

---

Dosya Çok Büyük

↓

Dosya boyutu sınırı aşıldı.

---

Bağlantı Hatası

↓

İnternet bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 26. Analytics

New Event Viewed

Category Selected

Media Uploaded

Save Clicked

Event Created

Event Failed

AI Enabled

AI Disabled

---

# 27. API Gereksinimleri

GET

/event-categories

GET

/event-subcategories

POST

/events

POST

/media/upload

POST

/ai/analyze-event

---

# 28. Güvenlik

Sadece yetkili kullanıcı Event oluşturabilir.

Dosyalar virüs kontrolünden geçirilmelidir.

Dosya uzantısı ve MIME tipi doğrulanmalıdır.

Tüm işlemler JWT ile doğrulanmalıdır.

---

# 29. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim hazırlanacaktır.

---

# 30. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 31. Performans

Kategori listesi önbellekten yüklenmelidir.

Dosya yükleme paralel yapılmalıdır.

İlk ekran yüklenmesi

<2 saniye

---

# 32. WOW Factor

Kategori seçim kartları

Canlı Event önizlemesi

Akıcı medya yükleme deneyimi

Premium form tasarımı

Anlık geri bildirimler

Yumuşak geçiş animasyonları

---

# 33. Future

Sesle Event oluşturma

AI ile otomatik Event tipi önerisi

Fotoğraftan otomatik açıklama oluşturma

Şablon Event'ler

Çevrimdışı kayıt oluşturma

---

# Onay Durumu

✅ Final