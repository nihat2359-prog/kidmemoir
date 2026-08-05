# KidMemoir
# 16_Onboarding.md

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

---

# 1. Amaç

Onboarding ekranının amacı kullanıcıya uygulamayı tanıtmak, temel beklentileri oluşturmak ve ilk çocuğunu ekleme sürecine hazırlamaktır.

Onboarding mümkün olduğunca kısa tutulacaktır.

---

# 2. Başarı Kriteri

Kullanıcı

2 dakika içerisinde

ilk çocuğunu oluşturmaya hazır hale gelmelidir.

---

# 3. Genel Akış

Email Doğrulandı

↓

Hoş Geldiniz

↓

KidMemoir Nedir?

↓

AI Nasıl Çalışır?

↓

Gizlilik

↓

İlk Çocuğunu Ekle

---

# 4. Sayfa Yapısı

Onboarding tam ekran deneyim olarak tasarlanacaktır.

Header veya Sidebar bulunmayacaktır.

Yalnızca ilerleme göstergesi gösterilecektir.

---

# 5. Desktop Experience

Desktop görünümü iki sütundan oluşacaktır.

-------------------------------------------------------

| Sol Alan | Sağ Alan |

-------------------------------------------------------

Sol Alan

İçerik

Başlık

Açıklama

İleri

Geri

---

Sağ Alan

Tam ekran premium illüstrasyon

veya

Gerçek uygulama animasyonları

---

# 6. Mobile Experience

Tek kolon kullanılacaktır.

İllüstrasyon

↓

Başlık

↓

Açıklama

↓

İleri

↓

Geri

---

# 7. İlerleme Göstergesi

Üst bölümde gösterilecektir.

Örnek

● ○ ○ ○

veya

1 / 4

---

# 8. Adım 1

Başlık

KidMemoir'a Hoş Geldiniz

Açıklama

Bugün attığınız küçük adımlar, yıllar sonra en değerli anılarınız olacak.

Buton

Devam Et

---

# 9. Adım 2

Başlık

Her Önemli Anı Kaydedin

Açıklama

İlk adım, doktor kontrolü, okul etkinliği veya küçük bir gülümseme...

Hepsi gelecekte çok değerli olacak.

Görsel

Event örnekleri

---

# 10. Adım 3

Başlık

Yapay Zekâ Sizin İçin Hatırlasın

Açıklama

KidMemoir, kayıtlarınızı analiz ederek gelişimi anlamanıza yardımcı olur.

AI hiçbir zaman tıbbi teşhis koymaz.

---

# 11. Adım 4

Başlık

Verileriniz Güvende

Açıklama

Tüm verileriniz güvenli şekilde saklanır.

Verileriniz AI eğitimi amacıyla kullanılmaz.

Kontrol her zaman sizdedir.

---

# 12. Son Adım

Başlık

Hazırsınız.

Şimdi ilk çocuğunuzu ekleyelim.

Primary Button

İlk Çocuğumu Ekle

---

# 13. Wireframe

Desktop

------------------------------------------------------------

İlerleme

------------------------------------------------------------

İllüstrasyon

Başlık

Açıklama

------------------------------------------------------------

Geri

İleri

------------------------------------------------------------

---

Mobile

İlerleme

↓

İllüstrasyon

↓

Başlık

↓

Açıklama

↓

Geri

↓

İleri

---

# 14. Component Listesi

Progress Indicator

Illustration

Typography

Primary Button

Secondary Button

Card

Container

Transition Animation

---

# 15. İş Kuralları

Onboarding yalnızca ilk girişte gösterilir.

Tamamlandı bilgisi kullanıcı profiline kaydedilir.

Kullanıcı isterse daha sonra Yardım bölümünden tekrar görüntüleyebilir.

---

# 16. Kullanıcı Hareketleri

İleri

↓

Sonraki adım

---

Geri

↓

Önceki adım

---

İlk Çocuğumu Ekle

↓

Create First Child ekranına gider.

---

# 17. Validasyon

Zorunlu veri girişi bulunmaz.

Kullanıcı tüm adımları geçebilir.

---

# 18. Loading

Bulunmaz.

Sayfa geçişleri animasyonlu olacaktır.

---

# 19. Empty State

Bulunmaz.

---

# 20. Error State

Beklenmeyen hata oluşursa

Onboarding yeniden başlatılır.

---

# 21. Analytics

Onboarding Started

Step Viewed

Step Completed

Step Skipped

Onboarding Completed

Create First Child Clicked

---

# 22. API Gereksinimleri

PATCH

/users/onboarding-completed

GET

/users/profile

---

# 23. Güvenlik

Onboarding yalnızca giriş yapmış kullanıcılar tarafından görüntülenebilir.

Tamamlandı bilgisi değiştirilemez.

---

# 24. Responsive

Desktop

Tablet

Mobile

Üçü için ayrı yerleşim hazırlanacaktır.

---

# 25. Accessibility

Keyboard Navigation

ARIA

Screen Reader

Focus Ring

Yüksek Kontrast

---

# 26. Performans

Adımlar arasında tam sayfa yüklenmesi yapılmayacaktır.

Geçişler istemci tarafında gerçekleşecektir.

Animasyon süresi

200-300 ms

---

# 27. WOW Factor

Tam ekran premium deneyim

Akıcı geçiş animasyonları

Gerçek uygulama ekranlarının önizlemeleri

Sade ve güven veren anlatım

Yormayan kullanıcı akışı

---

# 28. Future

Video onboarding

Etkileşimli ürün turu

AI rehberli onboarding

Çoklu dil desteği

Özelleştirilebilir onboarding akışı

---

# Onay Durumu

✅ Final