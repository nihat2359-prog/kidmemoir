# KidMemoir
# 25_Settings.md

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

Settings ekranının amacı kullanıcının hesap, uygulama ve gizlilik ayarlarını tek bir merkezden yönetmesini sağlamaktır.

---

# 2. Başarı Kriteri

Kullanıcı

istediği ayarı

30 saniyeden kısa sürede

bulup değiştirebilmelidir.

---

# 3. Genel Yapı

Settings aşağıdaki bölümlerden oluşacaktır.

Profil

↓

Hesap

↓

Bildirimler

↓

Gizlilik

↓

Güvenlik

↓

Çocuklar

↓

Depolama

↓

Dil

↓

Tema

↓

Destek

↓

Hakkında

---

# 4. Desktop Experience

Desktop görünüm iki sütunlu olacaktır.

------------------------------------------------------------

Sol Panel

Ayar Menüsü

------------------------------------------------------------

Sağ Panel

Seçilen Ayarın İçeriği

------------------------------------------------------------

---

# 5. Mobile Experience

Mobil görünüm liste yapısında olacaktır.

Her ayar ayrı sayfa olarak açılacaktır.

---

# 6. Sayfa Yapısı

Header

↓

Profil

↓

Hesap

↓

Bildirimler

↓

Gizlilik

↓

Güvenlik

↓

Çocuklar

↓

Depolama

↓

Dil

↓

Tema

↓

Destek

↓

Hakkında

---

# 7. Profil

Gösterilecek Bilgiler

Profil Fotoğrafı

Ad Soyad

Email

Üyelik Tarihi

Premium Durumu

---

İşlemler

Profili Düzenle

Fotoğrafı Değiştir

---

# 8. Hesap

Email Değiştir

Şifre Değiştir

Hesabı Dondur

Hesabı Sil

---

# 9. Bildirimler

Push Bildirimleri

Email Bildirimleri

Hatırlatmalar

AI Bildirimleri

Haftalık Özet

Aylık Özet

---

# 10. Gizlilik

Verilerimi Dışa Aktar

Verilerimi İndir

Verilerimi Sil

KVKK Bilgilendirmesi

Gizlilik Politikası

---

# 11. Güvenlik

Aktif Oturumlar

Son Girişler

Şifre Değiştir

İki Adımlı Doğrulama

Cihaz Yönetimi

---

# 12. Çocuklar

Çocuk Listesi

Yeni Çocuk Ekle

Varsayılan Çocuk

Çocuk Arşivle

---

# 13. Depolama

Kullanılan Alan

Toplam Alan

Fotoğraflar

Videolar

Belgeler

Temizleme Önerileri

---

# 14. Dil

Türkçe

English

Deutsch

Français

Español

---

# 15. Tema

Sistem

Açık

Koyu

---

# 16. Destek

Yardım Merkezi

İletişim

SSS

Geri Bildirim Gönder

Hata Bildir

---

# 17. Hakkında

Versiyon

Lisanslar

Kullanım Koşulları

Gizlilik Politikası

Açık Kaynak Lisansları

---

# 18. Wireframe

Desktop

------------------------------------------------------------

Settings Menu

|

Content

------------------------------------------------------------

---

Mobile

Settings List

↓

Detail Screen

---

# 19. Component Listesi

Settings Menu

Profile Card

Avatar Upload

Switch

Input

Dropdown

Progress Bar

Storage Card

Button

Toast

Dialog

Loading Overlay

---

# 20. İş Kuralları

Email değişikliği doğrulama gerektirir.

Hesap silme işlemi onay gerektirir.

Dil değişikliği anında uygulanır.

Tema değişikliği anında uygulanır.

---

# 21. Validasyon

Email doğrulanmalıdır.

Şifre güvenlik kurallarına uymalıdır.

Silme işlemleri tekrar onay istemelidir.

---

# 22. Başarılı İşlem

Ayar kaydedilir.

Kullanıcı bilgilendirilir.

Gerekirse oturum yenilenir.

---

# 23. Başarısız İşlem

Yetkisiz işlem.

Sunucu hatası.

İnternet bağlantısı yok.

Beklenmeyen hata.

---

# 24. Loading

Sayfa bazlı Skeleton

Profil Skeleton

Storage Skeleton

---

# 25. Empty State

Henüz eklenmiş çocuk bulunmuyor.

↓

Yeni çocuk ekleyin.

---

Depolama kullanılmıyor.

↓

İlk medya dosyanızı yükleyin.

---

# 26. Error State

Ayar Kaydedilemedi

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

# 27. Analytics

Settings Viewed

Profile Updated

Password Changed

Email Changed

Notification Changed

Theme Changed

Language Changed

Delete Account Started

---

# 28. API Gereksinimleri

GET

/settings

PATCH

/settings

PATCH

/profile

PATCH

/account/password

PATCH

/account/email

DELETE

/account

GET

/storage

---

# 29. Güvenlik

Kritik işlemler tekrar kimlik doğrulaması gerektirebilir.

JWT doğrulaması zorunludur.

Audit Log tutulacaktır.

Hesap silme işlemleri geri alınamaz.

---

# 30. Responsive

Desktop

Tablet

Mobile

Her cihaz için ayrı yerleşim hazırlanacaktır.

---

# 31. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 32. Performans

Ayar değişiklikleri tam sayfa yenilemeden uygulanmalıdır.

Tema değişimi anlık olmalıdır.

Dil değişimi yeniden yükleme gerektirmeden uygulanmalıdır.

---

# 33. WOW Factor

Premium ayar ekranı

Akıcı geçişler

Modern kart yapısı

Gerçek zamanlı değişiklikler

Minimal ve temiz kullanıcı deneyimi

---

# 34. Future

Aile üyeleri yönetimi

Ortak ebeveyn erişimi

Akıllı depolama yönetimi

API anahtarları

Geliştirici ayarları

---

# Onay Durumu

✅ Final