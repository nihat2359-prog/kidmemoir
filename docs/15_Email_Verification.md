# KidMemoir
# 15_Email_Verification.md

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

Email Verification ekranının amacı kullanıcının email adresini doğrulamasını sağlamak ve hesabın güvenli şekilde aktif edilmesini tamamlamaktır.

---

# 2. Başarı Kriteri

Kullanıcı email doğrulama işlemini sorunsuz tamamlayabilmelidir.

Doğrulama başarılı olduğunda otomatik olarak Onboarding süreci başlatılmalıdır.

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
- Bilgilendirme Kartı
- Emaili Tekrar Gönder
- Email Adresini Değiştir
- Login Linki

Sağ Alan

Premium illüstrasyon

veya

Email doğrulama animasyonu

---

# 4. Mobile Experience

Tek kolon kullanılacaktır.

Logo

↓

Başlık

↓

Açıklama

↓

Bilgilendirme

↓

Emaili Tekrar Gönder

↓

Email Adresini Değiştir

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

Email Bilgisi

↓

Emaili Tekrar Gönder

↓

Email Adresini Değiştir

↓

Login

↓

Footer

---

# 6. Başlık

Email Adresinizi Doğrulayın

---

# 7. Açıklama

Size gönderdiğimiz doğrulama bağlantısına tıklayarak hesabınızı aktif hale getirin.

Email doğrulandıktan sonra otomatik olarak devam edeceksiniz.

---

# 8. Gösterilecek Bilgiler

Email adresi maskelenmiş şekilde gösterilecektir.

Örnek

ni***@gmail.com

---

# 9. Emaili Tekrar Gönder

Secondary Button

İlk 60 saniye pasif olacaktır.

Süre dolunca aktif hale gelir.

---

# 10. Email Adresini Değiştir

Text Button

Register ekranına dönmeden email adresini güncelleme akışı başlatılır.

---

# 11. Login Linki

Farklı bir hesapla giriş yap.

---

# 12. Footer

Privacy Policy

Terms of Service

Cookie Policy

---

# 13. Wireframe

Desktop

------------------------------------------------------------

Logo

Başlık

Açıklama

Email Bilgisi

Emaili Tekrar Gönder

Email Adresini Değiştir

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

Email Bilgisi

↓

Emaili Tekrar Gönder

↓

Email Adresini Değiştir

↓

Login

↓

Footer

---

# 14. Component Listesi

Logo

Typography

Info Card

Primary Button

Secondary Button

Countdown

Toast

Dialog

Loading Overlay

---

# 15. İş Kuralları

Email doğrulama bağlantısı tek kullanımlıktır.

Bağlantının geçerlilik süresi sınırlıdır.

Doğrulama başarılı olduğunda kullanıcı otomatik olarak giriş yapar.

Onboarding süreci başlatılır.

---

# 16. Başarılı İşlem

Email doğrulanır.

Hesap aktif hale gelir.

Oturum oluşturulur.

Onboarding ekranına yönlendirilir.

---

# 17. Başarısız İşlem

Geçersiz bağlantı

Süresi dolmuş bağlantı

Zaten doğrulanmış email

Sunucu hatası

İnternet bağlantısı yok

---

# 18. Success State

Başlık

Email Başarıyla Doğrulandı

Açıklama

Hesabınız başarıyla aktif edildi.

Yönlendiriliyorsunuz...

---

# 19. Loading

Email doğrulama kontrol edilirken Loading gösterilir.

Tekrar gönderme sırasında buton Loading durumuna geçer.

---

# 20. Empty State

Bulunmaz.

---

# 21. Error State

Bağlantının Süresi Dolmuş

↓

Yeni doğrulama emaili gönderin.

---

Geçersiz Bağlantı

↓

Emaili tekrar gönderin.

---

İnternet Bağlantısı Yok

↓

Bağlantınızı kontrol edin.

---

Beklenmeyen Hata

↓

Lütfen tekrar deneyin.

---

# 22. Analytics

Verification Viewed

Verification Success

Verification Failed

Resend Clicked

Login Clicked

Change Email Clicked

---

# 23. API Gereksinimleri

POST

/auth/verify-email

POST

/auth/resend-verification

PATCH

/auth/change-email

---

# 24. Güvenlik

Verification token tek kullanımlıktır.

Token süreli olacaktır.

HTTPS zorunludur.

Rate Limit uygulanacaktır.

Email yeniden gönderme işlemi sınırlandırılacaktır.

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

Doğrulama İşlemi

<2 saniye

---

# 28. WOW Factor

Premium doğrulama ekranı

Gerçek zamanlı geri sayım

Akıcı doğrulama animasyonu

Otomatik yönlendirme

Güven veren kullanıcı deneyimi

---

# 29. Future

SMS doğrulama

Telefon doğrulama

Passkey aktivasyonu

İki aşamalı doğrulama kurulumu

---

# Onay Durumu

✅ Final