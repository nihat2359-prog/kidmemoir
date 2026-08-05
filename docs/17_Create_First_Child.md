# KidMemoir
# 17_Create_First_Child.md

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

Bu ekranın amacı kullanıcının ilk çocuğunu sisteme eklemesini sağlamaktır.

Bu ekran ürünün gerçek kullanımının başladığı ilk ekrandır.

Oluşturulan bilgiler daha sonra güncellenebilir.

Kullanıcıdan yalnızca gerçekten gerekli bilgiler istenir.

---

# 2. Başarı Kriteri

Kullanıcı

90 saniyeden kısa sürede

ilk çocuğunu oluşturabilmelidir.

---

# 3. Genel Akış

Onboarding Tamamlandı

↓

Çocuk Bilgileri

↓

Fotoğraf (Opsiyonel)

↓

Doğum Bilgileri

↓

Kaydet

↓

Child Home

---

# 4. Desktop Experience

İki kolonlu yapı kullanılacaktır.

-------------------------------------------------------

| Sol Alan | Sağ Alan |

-------------------------------------------------------

Sol Alan

Başlık

Açıklama

Form

Kaydet

---

Sağ Alan

Canlı önizleme

Çocuğun profil kartı

İlk Event örnekleri

---

# 5. Mobile Experience

Tek kolon kullanılacaktır.

Başlık

↓

Profil Fotoğrafı

↓

Form

↓

Kaydet

---

# 6. Sayfa Yapısı

İlerleme

↓

Başlık

↓

Açıklama

↓

Profil Fotoğrafı

↓

Ad

↓

Soyad

↓

Doğum Tarihi

↓

Cinsiyet

↓

Kaydet

---

# 7. Başlık

İlk Çocuğunuzu Ekleyin

---

# 8. Açıklama

Sadece birkaç bilgi girin.

Diğer tüm bilgileri daha sonra istediğiniz zaman düzenleyebilirsiniz.

---

# 9. Profil Fotoğrafı

Opsiyoneldir.

Fotoğraf

Sürükle Bırak

Dosya Seç

Kamera

desteklenir.

Fotoğraf eklenmezse

otomatik avatar oluşturulur.

---

# 10. Ad

Zorunlu

Maksimum

100 karakter

---

# 11. Soyad

Opsiyonel

Maksimum

100 karakter

---

# 12. Doğum Tarihi

Zorunlu

Date Picker kullanılacaktır.

Gelecek tarih seçilemez.

---

# 13. Cinsiyet

Opsiyonel

Seçenekler

Kız

Erkek

Belirtmek İstemiyorum

---

# 14. Kaydet

Primary Button

Tam genişlik

Loading destekler.

---

# 15. Wireframe

Desktop

------------------------------------------------------------

İlerleme

Başlık

Açıklama

Fotoğraf

Ad

Soyad

Doğum Tarihi

Cinsiyet

Kaydet

------------------------------------------------------------

Sağ tarafta

Canlı Profil Kartı

------------------------------------------------------------

---

Mobile

İlerleme

↓

Başlık

↓

Fotoğraf

↓

Ad

↓

Soyad

↓

Doğum Tarihi

↓

Cinsiyet

↓

Kaydet

---

# 16. Component Listesi

Progress Indicator

Avatar Upload

Input

Date Picker

Select

Primary Button

Card

Toast

Dialog

Loading Overlay

---

# 17. İş Kuralları

İlk çocuk oluşturulmadan uygulama kullanılmaya başlanamaz.

Çocuk oluşturulduktan sonra

varsayılan aktif çocuk olarak seçilir.

İlk Child Home ekranı açılır.

---

# 18. Validasyon

Ad boş olamaz.

Doğum tarihi boş olamaz.

Gelecek tarih seçilemez.

Fotoğraf dosya tipi doğrulanır.

Maksimum dosya boyutu kontrol edilir.

---

# 19. Başarılı İşlem

Child oluşturulur.

Varsayılan aktif çocuk atanır.

İlk Event önerileri hazırlanır.

Child Home ekranına yönlendirilir.

---

# 20. Başarısız İşlem

Sunucu hatası

Dosya yükleme hatası

İnternet bağlantısı yok

Beklenmeyen hata

---

# 21. Loading

Kaydet butonu Loading olur.

Form pasif hale gelir.

Dosya yüklenme ilerlemesi gösterilir.

---

# 22. Empty State

Profil fotoğrafı bulunmazsa

otomatik avatar gösterilir.

---

# 23. Error State

Geçersiz Dosya

↓

Lütfen JPG, PNG veya WEBP formatında bir görsel seçin.

---

Dosya Çok Büyük

↓

Maksimum dosya boyutu aşıldı.

---

Bağlantı Hatası

↓

İnternet bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 24. Analytics

Create Child Viewed

Avatar Uploaded

Create Child Started

Create Child Success

Create Child Failed

---

# 25. API Gereksinimleri

POST

/children

POST

/storage/avatar

GET

/children/{id}

---

# 26. Güvenlik

Yalnızca giriş yapmış kullanıcılar erişebilir.

Yüklenen dosyalar virüs kontrolünden geçirilmelidir.

Dosya uzantısı ve MIME tipi doğrulanmalıdır.

HTTPS zorunludur.

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

Sayfa Açılışı

<2 saniye

Fotoğraf Yükleme

İlerleme göstergesi ile yapılacaktır.

Child oluşturma

<2 saniye

---

# 30. WOW Factor

Canlı profil kartı önizlemesi

Fotoğraf eklendiğinde anlık avatar güncellemesi

Yumuşak yükleme animasyonları

Premium form tasarımı

İlk kayıt hissini güçlendiren başarılı tamamlama deneyimi

---

# 31. Future

Birden fazla çocuk ekleme sihirbazı

Toplu çocuk aktarımı

Doğum belgesinden otomatik bilgi okuma

AI destekli profil oluşturma önerileri

---

# Onay Durumu

✅ Final