# KidMemoir
# 23_Files.md

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

Files ekranının amacı seçili çocuğa ait tüm medya ve belgeleri tek bir yerde yönetmektir.

Bu ekran yalnızca dosya listesi değildir.

Dosyalar, bağlı oldukları Event ile birlikte anlam kazanır.

---

# 2. Başarı Kriteri

Kullanıcı

10 saniye içerisinde

aradığı medya veya belgeyi bulabilmelidir.

---

# 3. Genel Akış

Files Aç

↓

Filtrele

↓

Dosya Aç

↓

Bağlı Event'i Gör

↓

İndir / Paylaş

---

# 4. Desktop Experience

Desktop görünümü üç bölümden oluşacaktır.

------------------------------------------------------------

Sol Panel

Dosya Türleri

Filtreler

------------------------------------------------------------

Orta Alan

Dosya Galerisi

------------------------------------------------------------

Sağ Panel

Dosya Bilgileri

Bağlı Event

İşlemler

------------------------------------------------------------

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Dosya Türü

↓

Galeri

↓

Dosya Bilgileri

↓

İşlemler

---

# 6. Sayfa Yapısı

Header

↓

Dosya Türleri

↓

Arama

↓

Filtreler

↓

Galeri

↓

Dosya Detayı

---

# 7. Dosya Türleri

Sekmeler

Tümü

Fotoğraflar

Videolar

Ses Kayıtları

Belgeler

---

# 8. Arama

Dosya adı

Event başlığı

Etiket

Kategori

üzerinde arama yapılabilir.

---

# 9. Filtreler

Tarih Aralığı

Kategori

Etiket

Favoriler

Yalnızca AI Analizli

---

# 10. Galeri

Fotoğraflar

Grid görünümünde gösterilir.

Videolar

Kapak görseli ile gösterilir.

Belgeler

Belge kartı olarak gösterilir.

Ses kayıtları

Ses oynatıcı kartı olarak gösterilir.

---

# 11. Dosya Detayı

Gösterilecek Bilgiler

Dosya Adı

Tür

Boyut

Yüklenme Tarihi

Bağlı Event

Dosya Boyutu

---

# 12. Bağlı Event

Her dosya bağlı olduğu Event ile birlikte gösterilecektir.

Buton

Event'i Aç

---

# 13. İşlemler

İndir

Paylaş

Favorilere Ekle

Dosyayı Değiştir

Dosyayı Sil

---

# 14. Wireframe

Desktop

------------------------------------------------------------

Dosya Türleri

|

Galeri

|

Detay

------------------------------------------------------------

---

Mobile

Dosya Türü

↓

Galeri

↓

Detay

↓

İşlemler

---

# 15. Component Listesi

Media Grid

Photo Card

Video Card

Audio Card

Document Card

Media Viewer

Audio Player

Video Player

Search Box

Filter Panel

Action Menu

Toast

Dialog

Loading Overlay

---

# 16. İş Kuralları

Dosya bağımsız oluşturulamaz.

Her dosya bir Event'e bağlı olmalıdır.

Event silinirse medya arşivlenir.

Favori dosyalar filtrelenebilir.

---

# 17. Validasyon

Dosya mevcut olmalıdır.

Kullanıcının erişim yetkisi olmalıdır.

Desteklenmeyen dosya açılamaz.

---

# 18. Başarılı İşlem

Dosya görüntülenir.

İndirilebilir.

İlgili Event açılabilir.

---

# 19. Başarısız İşlem

Dosya bulunamadı.

Dosya bozuk.

Yetkisiz erişim.

İnternet bağlantısı yok.

---

# 20. Loading

Galeri Skeleton

Detay Skeleton

Media Preview Skeleton

Infinite Scroll Loader

---

# 21. Empty State

Henüz dosya bulunmuyor.

↓

İlk Event'inize medya ekleyin.

---

Filtre sonucu bulunamadı.

↓

Filtreleri temizleyin.

---

# 22. Error State

Dosya Yüklenemedi

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

# 23. Analytics

Files Viewed

Photo Opened

Video Opened

Document Opened

Audio Played

Download Clicked

Share Clicked

Event Opened

---

# 24. API Gereksinimleri

GET

/files

GET

/files/{id}

GET

/files/search

DELETE

/files/{id}

GET

/events/{id}

---

# 25. Güvenlik

Yalnızca yetkili kullanıcı dosyalara erişebilir.

Dosya bağlantıları süreli (signed URL) olmalıdır.

Doğrudan Storage bağlantıları istemciye verilmemelidir.

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

Galeri sanal listeleme (virtualization) kullanmalıdır.

Görseller Lazy Load edilmelidir.

Önizlemeler optimize edilmiş küçük boyutlu sürümlerden yüklenmelidir.

---

# 29. WOW Factor

Premium medya galerisi

Tam ekran fotoğraf deneyimi

Akıcı video oynatma

Modern belge kartları

Hızlı dosya filtreleme

Event ile güçlü ilişkilendirme

---

# 30. Future

Yüz tanıma

Benzer fotoğraf gruplama

AI ile fotoğraf açıklaması oluşturma

Toplu indirme

Toplu paylaşım

Yüzlerce medya için akıllı arşivleme

---

# Onay Durumu

✅ Final