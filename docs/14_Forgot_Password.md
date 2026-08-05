# KidMemoir
# 14_Forgot_Password.md

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

Forgot Password ekranının amacı kullanıcının hesabına güvenli şekilde yeniden erişebilmesini sağlamaktır.

Şifre sıfırlama süreci basit, hızlı ve güven verici olmalıdır.

---

# 2. Başarı Kriteri

Kullanıcı 30 saniye içerisinde şifre sıfırlama bağlantısını talep edebilmelidir.

---

# 3. Desktop Experience

İki kolonlu yapı kullanılacaktır.

-------------------------------------------------------

| Sol Alan | Sağ Alan |

-------------------------------------------------------

Sol Alan

- Logo
- Başlık
- Açıklama
- Email Formu
- Continue Butonu
- Login Linki

Sağ Alan

Güven hissi oluşturan premium görsel.

---

# 4. Mobile Experience

Tek kolon kullanılacaktır.

Logo

↓

Başlık

↓

Açıklama

↓

Email

↓

Continue

↓

Login

↓

Footer

---

# 5. Sayfa Yapısı

Logo

↓

Başlık

↓

Açıklama

↓

Email

↓

Continue

↓

Back to Login

↓

Footer

---

# 6. Başlık

Şifrenizi mi Unuttunuz?

---

# 7. Açıklama

Hesabınıza ait email adresini girin.

Size güvenli bir şifre sıfırlama bağlantısı göndereceğiz.

---

# 8. Email

Tip

Email

Placeholder

ornek@email.com

Autocomplete

email

---

# 9. Continue

Primary Button

Tam genişlik

Loading destekler.

---

# 10. Login Linki

Giriş ekranına dön.

---

# 11. Footer

Privacy Policy

Terms of Service

Cookie Policy

---

# 12. Wireframe

Desktop

------------------------------------------------------------

Logo

Başlık

Açıklama

Email

Continue

Login

------------------------------------------------------------

Premium Görsel

------------------------------------------------------------

---

Mobile

Logo

↓

Başlık

↓

Açıklama

↓

Email

↓

Continue

↓

Login

↓

Footer

---

# 13. Component Listesi

Logo

Typography

Input

Primary Button

Toast

Dialog

Loading Overlay

---

# 14. İş Kuralları

Email sistemde kayıtlı ise

şifre sıfırlama bağlantısı gönderilir.

Email kayıtlı değilse

güvenlik nedeniyle aynı başarı mesajı gösterilir.

Kullanıcıya

"Email adresiniz kayıtlıysa bağlantı gönderildi."

mesajı gösterilecektir.

---

# 15. Validasyon

Email boş olamaz.

Email formatı doğrulanmalıdır.

---

# 16. Başarılı İşlem

Reset token oluşturulur.

Email gönderilir.

İşlem loglanır.

Başarı ekranı gösterilir.

---

# 17. Başarısız İşlem

Sunucu hatası

Email gönderim hatası

İnternet bağlantısı yok

---

# 18. Success State

Başlık

Email Gönderildi

Açıklama

Email adresiniz kayıtlıysa birkaç dakika içinde şifre sıfırlama bağlantısı alacaksınız.

Buton

Login'a Dön

---

# 19. Loading

Continue butonu Loading durumuna geçer.

Input pasif olur.

---

# 20. Empty State

Bulunmaz.

---

# 21. Error State

İnternet Bağlantısı Yok

↓

Bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 22. Analytics

Forgot Password Viewed

Forgot Password Started

Forgot Password Success

Forgot Password Failed

Login Clicked

---

# 23. API Gereksinimleri

POST

/auth/forgot-password

---

# 24. Güvenlik

Rate Limit uygulanacaktır.

Reset token tek kullanımlık olacaktır.

Token süreli olacaktır.

HTTPS zorunludur.

Email adresi sistemde kayıtlı olsun veya olmasın aynı cevap döndürülmelidir.

---

# 25. Responsive

Desktop

Tablet

Mobile

Üçü için ayrı yerleşim hazırlanacaktır.

---

# 26. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 27. Performans

Sayfa Açılışı

<2 saniye

İstek Süresi

<2 saniye

---

# 28. WOW Factor

Premium ve güven veren tasarım

Başarılı işlem sonrası sade bilgilendirme ekranı

Yumuşak animasyonlar

Akıcı geçişler

Minimal kullanıcı deneyimi

---

# 29. Future

Magic Link

SMS ile şifre sıfırlama

Passkey desteği

Çok adımlı doğrulama

---

# Onay Durumu

✅ Final