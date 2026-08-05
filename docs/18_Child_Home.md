# KidMemoir
# 18_Child_Home.md

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

Child Home ekranı uygulamanın ana ekranıdır.

Kullanıcı giriş yaptıktan sonra varsayılan olarak bu ekran açılır.

Bu ekran seçili çocuğun dijital yaşam merkezidir.

---

# 2. Başarı Kriteri

Kullanıcı

ilk 10 saniye içerisinde;

- Çocuğun güncel durumunu görebilmeli
- Son olayları görebilmeli
- Yeni Event ekleyebilmeli
- AI özetine ulaşabilmelidir.

---

# 3. Genel Yapı

Child Home aşağıdaki bölümlerden oluşacaktır.

Hero

↓

AI Insight

↓

Quick Actions

↓

Recent Events

↓

Timeline Preview

↓

Health Snapshot

↓

Growth Snapshot

↓

School Snapshot

↓

Recent Media

---

# 4. Desktop Experience

Desktop görünümünde iki sütunlu yapı kullanılacaktır.

------------------------------------------------------------

Sidebar

↓

Hero

↓

AI Insight

↓

Recent Events

↓

Timeline Preview

↓

Media

------------------------------------------------------------

Sağ Panel

Health

Growth

School

Upcoming Reminders

------------------------------------------------------------

---

# 5. Mobile Experience

Mobil görünüm tek kolon olacaktır.

Hero

↓

AI Insight

↓

Quick Actions

↓

Recent Events

↓

Timeline

↓

Media

↓

Health

↓

Growth

↓

School

---

# 6. Sayfa Yapısı

Header

↓

Hero

↓

AI Insight

↓

Quick Actions

↓

Recent Events

↓

Timeline Preview

↓

Health

↓

Growth

↓

School

↓

Media

---

# 7. Hero

Hero alanı ekranın en üstünde bulunacaktır.

Gösterilecek Bilgiler

- Profil Fotoğrafı
- Ad
- Yaş
- Son Güncelleme
- Kısa Durum Mesajı

---

# 8. Kısa Durum Mesajı

Sistem tarafından oluşturulur.

Örnek

Bugün yeni bir kayıt eklenmedi.

veya

Son kayıt 2 saat önce eklendi.

---

# 9. AI Insight

Her zaman Hero bölümünün altında gösterilecektir.

İçerik

- Kısa analiz
- Referans sayısı
- Detaylı Analize Git

Maksimum

3 satır gösterilecektir.

---

# 10. Quick Actions

Kart veya ikon yapısında gösterilecektir.

İşlemler

- Yeni Event
- Fotoğraf Ekle
- Ses Kaydı
- Belge Ekle
- AI'ya Sor

---

# 11. Recent Events

Son eklenen Event'ler gösterilecektir.

Her kartta

- Event İkonu
- Başlık
- Tarih
- Kategori
- Medya Sayısı

bulunacaktır.

Varsayılan

Son 5 kayıt gösterilir.

---

# 12. Timeline Preview

Son zaman çizelgesi gösterilecektir.

Buton

Tüm Timeline'ı Gör

---

# 13. Health Snapshot

Gösterilecek Bilgiler

- Son Doktor Kontrolü
- Son Aşı
- Yaklaşan Kontrol
- Aktif Hatırlatma Sayısı

---

# 14. Growth Snapshot

Gösterilecek Bilgiler

- Boy
- Kilo
- Son Ölçüm Tarihi

Veri bulunmuyorsa kart gösterilmeye devam eder.

İçerikte kayıt oluşturma çağrısı bulunur.

---

# 15. School Snapshot

Gösterilecek Bilgiler

- Son Öğretmen Görüşmesi
- Son Karne
- Son Okul Event'i

---

# 16. Recent Media

Son eklenen

Fotoğraf

Video

Ses

Belgeler

küçük kartlar halinde gösterilecektir.

Varsayılan

Son 8 medya gösterilir.

---

# 17. Wireframe

Desktop

------------------------------------------------------------

Header

------------------------------------------------------------

Hero

------------------------------------------------------------

AI Insight

------------------------------------------------------------

Quick Actions

------------------------------------------------------------

Recent Events

------------------------------------------------------------

Timeline Preview

------------------------------------------------------------

Media

------------------------------------------------------------

Health | Growth | School

------------------------------------------------------------

---

Mobile

Header

↓

Hero

↓

AI Insight

↓

Quick Actions

↓

Recent Events

↓

Timeline

↓

Media

↓

Health

↓

Growth

↓

School

---

# 18. Component Listesi

Header

Child Hero

AI Insight Card

Quick Action Button

Event Card

Timeline Card

Health Card

Growth Card

School Card

Media Card

Avatar

Badge

Toast

Dialog

Loading Overlay

---

# 19. İş Kuralları

Sadece aktif çocuk gösterilecektir.

Çocuk değiştirildiğinde bütün içerik yeniden yüklenir.

Sayfa yenilenmeden veri güncellenmelidir.

---

# 20. Validasyon

Child bulunmalıdır.

Arşivlenmiş çocuk açılamaz.

Silinmiş kayıtlar gösterilmez.

---

# 21. Loading

Hero Skeleton

AI Skeleton

Event Skeleton

Media Skeleton

Kart bazlı Skeleton kullanılacaktır.

---

# 22. Empty State

Henüz Event bulunmuyor.

↓

İlk Event'i Oluştur.

---

Henüz Medya bulunmuyor.

↓

İlk Fotoğrafı Ekleyin.

---

Henüz AI analizi bulunmuyor.

↓

İlk Analizi Oluşturun.

---

# 23. Error State

Veriler yüklenemedi.

↓

Tekrar Dene.

---

İnternet Bağlantısı Yok.

↓

Bağlantınızı kontrol edin.

---

Beklenmeyen Hata.

↓

Lütfen tekrar deneyin.

---

# 24. Analytics

Child Home Viewed

Quick Action Clicked

AI Card Clicked

Event Clicked

Timeline Clicked

Media Clicked

Health Card Clicked

Growth Card Clicked

School Card Clicked

---

# 25. API Gereksinimleri

GET

/children/{id}

GET

/children/{id}/summary

GET

/events/recent

GET

/timeline/preview

GET

/media/recent

GET

/ai/latest

GET

/health/summary

GET

/growth/summary

GET

/school/summary

---

# 26. Güvenlik

Sadece yetkili kullanıcı erişebilir.

Aktif çocuk kontrolü yapılmalıdır.

Tüm istekler JWT ile doğrulanmalıdır.

---

# 27. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim uygulanacaktır.

İş kuralları değişmeyecektir.

---

# 28. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 29. Performans

İlk içerik gösterimi

<2 saniye

Kartlar paralel yüklenmelidir.

Görseller lazy load edilmelidir.

İlk ekranda yalnızca görünen içerikler yüklenmelidir.

---

# 30. WOW Factor

Hero alanında premium çocuk profili

Canlı AI Insight kartı

Akıcı kart animasyonları

Modern ve nefes alan tasarım

Zengin Event kartları

Gerçek zamanlı his veren dinamik içerik

---

# 31. Future

Özelleştirilebilir Child Home

Sürükle bırak kart düzeni

Widget sistemi

AI tarafından önerilen hızlı işlemler

Akıllı günlük özet

---

# Onay Durumu

✅ Final