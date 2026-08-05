# KidMemoir
# 13_Register.md

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

Register ekranının amacı yeni kullanıcıların mümkün olan en kısa sürede güvenli şekilde hesap oluşturmasını sağlamaktır.

Kayıt işlemi kullanıcıyı yormamalıdır.

---

# 2. Başarı Kriteri

Kullanıcı

60 saniyeden kısa sürede

hesabını oluşturabilmelidir.

---

# 3. Desktop Experience

İki kolonlu yapı kullanılacaktır.

-------------------------------------------------------

| Sol Alan | Sağ Alan |

-------------------------------------------------------

Sol Alan

Logo

Başlık

Alt Başlık

Register Formu

Sözleşmeler

Login Linki

---

Sağ Alan

Premium ürün görselleri

AI

Timeline

Event

Child Home

ekranlarından oluşan otomatik değişen görseller

---

# 4. Mobile Experience

Tek kolon kullanılacaktır.

Logo

↓

Başlık

↓

Form

↓

Create Account

↓

Login Linki

↓

Footer

---

# 5. Sayfa Yapısı

Logo

↓

Başlık

↓

Alt Başlık

↓

Full Name

↓

Email

↓

Password

↓

Confirm Password

↓

Privacy Checkbox

↓

Create Account

↓

Google Register

↓

Apple Register

↓

Login Link

↓

Footer

---

# 6. Başlık

KidMemoir'a Hoş Geldiniz

---

# 7. Alt Başlık

Çocuğunuzun yaşam hikâyesini bugünden oluşturmaya başlayın.

---

# 8. Full Name

Tip

Text

Placeholder

Ad Soyad

Autocomplete

name

---

# 9. Email

Tip

Email

Placeholder

ornek@email.com

Autocomplete

email

---

# 10. Password

Tip

Password

Minimum

8 karakter

Destek

Büyük Harf

Küçük Harf

Rakam

Özel Karakter

Şifre Gücü Göstergesi bulunacaktır.

---

# 11. Confirm Password

Şifre tekrar girilecektir.

Gerçek zamanlı doğrulama yapılacaktır.

---

# 12. Privacy Checkbox

Metin

Gizlilik Politikası ve Kullanım Koşullarını kabul ediyorum.

Devam etmek için zorunludur.

---

# 13. Create Account

Primary Button

Tam genişlik

Loading destekler.

---

# 14. Google Register

Google ile Devam Et

İlk sürümde pasif bırakılabilir.

---

# 15. Apple Register

Apple ile Devam Et

İlk sürümde pasif bırakılabilir.

---

# 16. Login Link

Zaten hesabınız var mı?

Giriş Yap

---

# 17. Footer

Privacy Policy

Terms of Service

Cookie Policy

---

# 18. Wireframe

Desktop

------------------------------------------------------------

Logo

Başlık

Alt Başlık

Ad Soyad

Email

Şifre

Şifre Tekrar

□ Gizlilik Politikası

Create Account

-----------------------------

Google

Apple

-----------------------------

Login

------------------------------------------------------------

Sağ tarafta

Ürün görselleri

------------------------------------------------------------

---

Mobile

Logo

↓

Başlık

↓

Ad Soyad

↓

Email

↓

Şifre

↓

Şifre Tekrar

↓

Checkbox

↓

Create Account

↓

Google

↓

Apple

↓

Login

↓

Footer

---

# 19. Component Listesi

Logo

Typography

Input

Password Strength

Checkbox

Primary Button

Secondary Button

Divider

Social Button

Toast

Dialog

Loading Overlay

---

# 20. İş Kuralları

Email benzersiz olmalıdır.

Kayıt başarılı olduğunda

Verify Email ekranına yönlendirilir.

Henüz oturum açılmaz.

Email doğrulaması zorunludur.

---

# 21. Validasyon

Ad Soyad boş olamaz.

Email boş olamaz.

Email formatı doğrulanır.

Şifre minimum 8 karakter olmalıdır.

Şifreler aynı olmalıdır.

Checkbox işaretlenmelidir.

---

# 22. Başarılı Kayıt

Hesap oluşturulur.

Email doğrulama bağlantısı gönderilir.

Analytics kaydı oluşturulur.

Verify Email ekranına yönlendirilir.

---

# 23. Başarısız Kayıt

Email kullanımda.

Geçersiz email.

Zayıf şifre.

Sunucu hatası.

İnternet bağlantısı yok.

Her hata için kullanıcı dostu mesaj gösterilir.

---

# 24. Loading

Buton Loading durumuna geçer.

Form pasif olur.

Çift gönderim engellenir.

---

# 25. Empty State

Bulunmaz.

---

# 26. Error State

Email Kullanılıyor

↓

Bu email adresi ile daha önce hesap oluşturulmuş.

---

Geçersiz Şifre

↓

Daha güçlü bir şifre belirleyin.

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

Register Viewed

Register Started

Register Success

Register Failed

Google Register Clicked

Apple Register Clicked

Login Clicked

---

# 28. API Gereksinimleri

POST

/auth/register

POST

/auth/send-verification

---

# 29. Güvenlik

HTTPS zorunludur.

Şifre hash olarak saklanacaktır.

Rate Limit uygulanacaktır.

Bot koruması uygulanacaktır.

Spam kayıtları engellenecektir.

---

# 30. Responsive

Desktop

Tablet

Mobile

Üçü için ayrı yerleşim hazırlanacaktır.

---

# 31. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

Tab sırası doğru olacaktır.

---

# 32. Performans

Sayfa Açılışı

<2 saniye

Kayıt İşlemi

<3 saniye

---

# 33. WOW Factor

Premium kayıt ekranı

Gerçek uygulama önizlemeleri

Canlı şifre gücü göstergesi

Yumuşak geçiş animasyonları

Minimal ve güven veren tasarım

---

# 34. Future

Google Register

Apple Register

Magic Link

Passkey

Telefon Doğrulama

Davet Kodu

Referral Sistemi

---

# Onay Durumu

✅ Final