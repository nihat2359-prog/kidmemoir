# KidMemoir
# 20_Event_Detail.md

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

Event Detail ekranı oluşturulan bir Event'in tüm detaylarını görüntülemek, düzenlemek ve yönetmek için kullanılır.

Bu ekran Event'in yaşam döngüsünün merkezidir.

---

# 2. Başarı Kriteri

Kullanıcı

10 saniye içerisinde

Event hakkında bütün önemli bilgilere ulaşabilmelidir.

---

# 3. Genel Akış

Event Aç

↓

Detayları Görüntüle

↓

AI Analizi

↓

Medyalar

↓

Düzenle

↓

Paylaş / Dışa Aktar

---

# 4. Desktop Experience

İki sütunlu yapı kullanılacaktır.

------------------------------------------------------------

Sol Alan

Event Bilgileri

AI Insight

------------------------------------------------------------

Sağ Alan

Medyalar

Timeline İlişkisi

Benzer Event'ler

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Başlık

↓

Event Bilgileri

↓

AI Insight

↓

Medya

↓

İlgili Event'ler

↓

İşlemler

---

# 6. Sayfa Yapısı

Header

↓

Event Hero

↓

Detay Bilgileri

↓

AI Insight

↓

Medya

↓

Etiketler

↓

İlgili Event'ler

↓

İşlemler

---

# 7. Event Hero

Gösterilecek Bilgiler

- Event İkonu
- Başlık
- Kategori
- Alt Kategori
- Tarih
- Saat
- Önem Derecesi

---

# 8. Event Bilgileri

Gösterilecek Bilgiler

Başlık

Açıklama

Kategori

Alt Kategori

Tarih

Saat

Etiketler

Konum (Varsa)

---

# 9. AI Insight

AI analiz sonucu kart olarak gösterilecektir.

Kart içerisinde

- Kısa Özet
- Referans Olay Sayısı
- Analiz Tarihi
- Detaylı Analizi Gör

bulunacaktır.

Analiz hazır değilse

Hazırlanıyor

durumu gösterilecektir.

---

# 10. Medya

Desteklenen Türler

Fotoğraf

Video

Ses

PDF

Belgeler

Her medya tam ekran görüntülenebilir.

---

# 11. Etiketler

Etiketler chip yapısında gösterilecektir.

Tıklanan etiket ile filtreleme yapılacaktır.

---

# 12. İlgili Event'ler

Benzer kategori

Benzer tarih

Benzer etiket

AI ilişkisi

olan Event'ler gösterilecektir.

Varsayılan

En fazla 5 Event.

---

# 13. İşlemler

Düzenle

Favorilere Ekle

Arşivle

PDF Olarak Dışa Aktar

Sil

---

# 14. Wireframe

Desktop

------------------------------------------------------------

Hero

------------------------------------------------------------

Bilgiler

|

AI

------------------------------------------------------------

Medyalar

------------------------------------------------------------

İlgili Event'ler

------------------------------------------------------------

İşlemler

------------------------------------------------------------

---

Mobile

Hero

↓

Bilgiler

↓

AI

↓

Medya

↓

İlgili Event'ler

↓

İşlemler

---

# 15. Component Listesi

Hero Card

Event Card

AI Insight Card

Media Gallery

Tag Chip

Related Event Card

Action Menu

Primary Button

Secondary Button

Toast

Dialog

Loading Overlay

---

# 16. İş Kuralları

Silinen Event görüntülenemez.

Arşivlenmiş Event görüntülenebilir.

AI analiz sonucu son oluşturulan analizdir.

Medya silinirse Event silinmez.

---

# 17. Validasyon

Event mevcut olmalıdır.

Kullanıcının erişim yetkisi olmalıdır.

Silme işlemi onay gerektirir.

---

# 18. Düzenleme

Düzenle seçildiğinde

Event Edit ekranı açılır.

Bütün alanlar güncellenebilir.

Kategori değişikliği desteklenir.

---

# 19. Başarılı İşlem

Event güncellenir.

Timeline güncellenir.

Child Home güncellenir.

AI gerekiyorsa yeniden analiz başlatır.

---

# 20. Başarısız İşlem

Yetkisiz erişim

Event bulunamadı

Sunucu hatası

İnternet bağlantısı yok

---

# 21. Loading

Hero Skeleton

AI Skeleton

Media Skeleton

Related Event Skeleton

---

# 22. Empty State

AI analizi henüz hazır değil.

↓

Hazırlanıyor.

---

Medya bulunmuyor.

↓

İlk medyayı ekleyin.

---

İlgili Event bulunmuyor.

↓

Benzer kayıt bulunamadı.

---

# 23. Error State

Event Bulunamadı

↓

Listeye Dön.

---

Bağlantı Hatası

↓

Tekrar Dene.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 24. Analytics

Event Detail Viewed

Edit Clicked

Delete Clicked

Favorite Clicked

Archive Clicked

Export PDF Clicked

Media Opened

AI Insight Opened

Related Event Clicked

---

# 25. API Gereksinimleri

GET

/events/{id}

PATCH

/events/{id}

DELETE

/events/{id}

POST

/events/{id}/favorite

POST

/events/{id}/archive

GET

/events/{id}/related

GET

/events/{id}/ai

---

# 26. Güvenlik

Sadece Event sahibi görüntüleyebilir.

Silme işlemi geri alınamaz.

Tüm istekler JWT ile doğrulanacaktır.

Audit Log oluşturulacaktır.

---

# 27. Responsive

Desktop

Tablet

Mobile

Üçü için ayrı yerleşim hazırlanacaktır.

---

# 28. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 29. Performans

İlk içerik yüklenmesi

<2 saniye

Medya Lazy Load

İlgili Event'ler arka planda yüklenebilir.

---

# 30. WOW Factor

Büyük Hero alanı

Premium AI Insight kartı

Tam ekran medya galerisi

Akıcı kart animasyonları

İlgili Event önerileri

Modern detay sayfası

---

# 31. Future

Versiyon geçmişi

Event karşılaştırma

AI zaman içindeki değişim analizi

Yorum sistemi

Paylaşılabilir bağlantı

---

# Onay Durumu

✅ Final