# KidMemoir
# 12_Login.md

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

Login ekranının amacı mevcut kullanıcıların güvenli, hızlı ve sorunsuz şekilde hesaplarına giriş yapmasını sağlamaktır.

Bu ekran kullanıcıya ilk güven hissini veren uygulama ekranıdır.

---

# 2. Başarı Kriteri

Kullanıcı;

30 saniyeden kısa sürede

başarılı şekilde giriş yapabilmelidir.

---

# 3. Desktop Experience

Desktop görünümü iki sütundan oluşacaktır.

-------------------------------------------------------

| Sol Alan | Sağ Alan |

-------------------------------------------------------

Sol Alan

- Logo
- Başlık
- Açıklama
- Giriş Formu
- Sosyal Giriş
- Linkler

Sağ Alan

Tam ekran premium görsel

veya

gerçek uygulama ekranları

veya

çocuk zaman çizelgesi illustrasyonu

---

# 4. Mobile Experience

Mobilde tek kolon kullanılacaktır.

Sıralama

Logo

↓

Başlık

↓

Form

↓

Google

↓

Apple

↓

Register

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

Email

↓

Password

↓

Remember Me

↓

Forgot Password

↓

Continue Button

↓

Google Login

↓

Apple Login

↓

Register Link

↓

Privacy

↓

Terms

---

# 6. Başlık

Tekrar Hoş Geldiniz

---

# 7. Alt Başlık

Çocuğunuzun dijital yaşam hafızasına güvenle giriş yapın.

---

# 8. Logo

KidMemoir logosu.

Tıklanınca Landing sayfasına gider.

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

Placeholder

••••••••

Sağ tarafta

Şifreyi Göster

ikonu bulunacaktır.

Autocomplete

current-password

---

# 11. Remember Me

Checkbox

Varsayılan

Kapalı

---

# 12. Forgot Password

Şifremi Unuttum

Tıklanınca

Forgot Password ekranına gider.

---

# 13. Continue Button

Tam genişlik

Primary Button

Yüklenme durumunu destekler.

---

# 14. Google Login

Google ile Devam Et

İlk sürümde pasif bırakılabilir.

---

# 15. Apple Login

Apple ile Devam Et

İlk sürümde pasif bırakılabilir.

---

# 16. Register

Hesabınız yok mu?

Ücretsiz Hesap Oluştur

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

Email

Password

Remember Me

Forgot Password

Continue

-----------------------

Google

Apple

-----------------------

Register

Privacy

------------------------------------------------------------

Sağ tarafta

Premium görsel

------------------------------------------------------------

---

Mobile

Logo

↓

Başlık

↓

Alt Başlık

↓

Email

↓

Password

↓

Remember Me

↓

Forgot Password

↓

Continue

↓

Google

↓

Apple

↓

Register

↓

Footer

---

# 19. Component Listesi

Logo

Typography

Input

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

Email doğrulanmış olmalıdır.

Başarılı girişte

Child Home ekranına yönlendirilir.

Kullanıcının birden fazla çocuğu varsa

son aktif çocuk açılır.

İlk kez giriş yapıyorsa

Onboarding başlatılır.

---

# 21. Validasyon

Email boş olamaz.

Email formatı kontrol edilir.

Şifre boş olamaz.

Minimum uzunluk kontrol edilir.

Sunucu doğrulaması yapılır.

---

# 22. Başarılı Giriş

Access Token alınır.

Refresh Token alınır.

Session oluşturulur.

Son giriş tarihi güncellenir.

Child bilgileri yüklenir.

---

# 23. Başarısız Giriş

Yanlış email

Yanlış şifre

Doğrulanmamış email

Pasif hesap

Sunucu hatası

İnternet bağlantısı yok

Her durum için ayrı kullanıcı mesajı gösterilir.

---

# 24. Loading

Continue butonu Loading durumuna geçer.

Inputlar pasif olur.

Çift tıklama engellenir.

---

# 25. Empty State

Bulunmaz.

---

# 26. Error State

Yanlış bilgiler

↓

Email veya şifre hatalı.

---

Doğrulanmamış hesap

↓

Email adresinizi doğrulayın.

---

İnternet Yok

↓

Bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 27. Analytics

Login Viewed

Login Started

Login Success

Login Failed

Forgot Password Clicked

Register Clicked

Google Login Clicked

Apple Login Clicked

---

# 28. API Gereksinimleri

POST

/auth/login

POST

/auth/refresh

GET

/user/profile

GET

/children

---

# 29. Güvenlik

HTTPS zorunludur.

JWT kullanılacaktır.

Şifre loglanmayacaktır.

Rate Limit uygulanacaktır.

Brute Force koruması olacaktır.

Session güvenliği sağlanacaktır.

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

Tab sırası doğru olmalıdır.

---

# 32. Performans

İlk açılış

< 2 saniye

Giriş isteği

< 2 saniye

Token yenileme

Arka planda yapılacaktır.

---

# 33. WOW Factor

İki sütunlu premium tasarım

Gerçek uygulama önizlemesi

Yumuşak animasyonlar

Odaklandıkça canlanan inputlar

Akıcı sayfa geçişleri

Premium tipografi

Minimal fakat güçlü görünüm

---

# 34. Future

Google Login

Apple Login

Magic Link

Passkey

2FA

Biyometrik Giriş

Çoklu Oturum Yönetimi

---

# Onay Durumu

✅ Final