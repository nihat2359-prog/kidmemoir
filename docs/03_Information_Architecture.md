# KidMemoir
# 03_Information_Architecture.md

**Versiyon:** 1.0  
**Durum:** Final  
**Belge Türü:** Information Architecture  
**Bağımlılık:**

- 00_Vision.md
- 01_Product_Rules.md
- 02_User_Journey.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasının bilgi mimarisini tanımlar.

Amaç;

- bütün modülleri belirlemek,
- ekranların sorumluluklarını ayırmak,
- veri tekrarını önlemek,
- ekranlar arasında standart oluşturmak,
- geliştirme sürecini kolaylaştırmaktır.

---

# 2. Bilgi Mimarisi İlkesi

KidMemoir modül bazlı geliştirilir.

Her modül yalnızca kendi sorumluluğundaki veriyi yönetir.

Bir veri yalnızca tek bir modül tarafından oluşturulur.

Başka modüller bu veriyi yalnızca okuyabilir.

---

# 3. Ana Modüller

KidMemoir aşağıdaki ana modüllerden oluşur.

1. Public Website

2. Authentication

3. Dashboard

4. Children

5. Journal

6. AI

7. Timeline

8. Reports

9. Notifications

10. Account

---

# 4. Public Website

Amaç

Henüz üye olmayan kullanıcıları bilgilendirmek.

Alt Sayfalar

Landing

Features

Pricing

FAQ

Blog

Contact

Privacy Policy

Terms of Service

Cookie Policy

404

Maintenance

---

# 5. Authentication

Amaç

Kullanıcının sisteme güvenli giriş yapmasını sağlamak.

Alt Sayfalar

Login

Register

Forgot Password

Reset Password

Verify Email

Welcome

Create First Child

---

# 6. Dashboard

Amaç

Seçili çocuğun güncel durumunu tek ekranda göstermek.

Dashboard veri oluşturmaz.

Dashboard yalnızca özet gösterir.

Dashboard'ın kullandığı veriler;

Journal

AI

Timeline

Reports

Notifications

modüllerinden gelir.

---

# 7. Children

Amaç

Çocuk bilgilerini yönetmek.

Children modülü aşağıdaki bilgilerin sahibidir.

Kimlik Bilgileri

Doğum Bilgileri

Sağlık Bilgileri

Okul Bilgileri

İlgi Alanları

Kişilik Bilgileri

Ayarlar

---

Children modülü

Journal oluşturmaz.

AI oluşturmaz.

Rapor oluşturmaz.

---

# 8. Journal

Ürünün merkezidir.

Amaç

Çocuk hakkında oluşan bütün olayları kayıt altına almak.

Journal aşağıdaki kayıt türlerini destekler.

Genel

Okul

Sağlık

Uyku

Beslenme

Davranış

Duygu

Başarı

Gelişim

Fotoğraf

Video

Ses

Belge

---

Journal;

AI üretmez.

Yorum yapmaz.

Analiz yapmaz.

Sadece veri toplar.

---

# 9. AI

Amaç

Journal kayıtlarını analiz etmek.

AI hiçbir zaman veri sahibi değildir.

AI sadece;

Journal

Children

Timeline

üzerinden okuma yapar.

AI çıktıları tekrar Journal'a yazılmaz.

AI History altında saklanır.

---

# 10. Timeline

Amaç

Çocuğun yaşamını kronolojik sırayla göstermek.

Timeline;

Journal kayıtlarını,

AI analizlerini,

Önemli olayları,

tek zaman çizelgesinde birleştirir.

Timeline yeni veri oluşturmaz.

---

# 11. Reports

Amaç

Verileri anlamlı raporlara dönüştürmek.

Reports;

Journal

Timeline

AI

üzerinden veri okur.

Yeni veri oluşturmaz.

---

# 12. Notifications

Amaç

Hatırlatmaları ve sistem bildirimlerini yönetmek.

Bildirimler;

Journal

AI

System

olaylarından oluşabilir.

---

# 13. Account

Amaç

Kullanıcı hesabını yönetmek.

Alt Bölümler

Profil

Premium

Güvenlik

Bildirimler

Dil

Tema

Veri Aktarma

Hesabı Sil

---

# 14. Modül Bağımlılıkları

Children

↓

Journal

↓

AI

↓

Timeline

↓

Reports

↓

Dashboard

Bu sıralama değiştirilemez.

---

# 15. Veri Sahipliği

Children

↓

Çocuk bilgileri

---

Journal

↓

Olaylar

---

Media

↓

Fotoğraf

Video

Ses

Belgeler

---

AI

↓

Analizler

---

Reports

↓

Oluşturulan raporlar

---

Notifications

↓

Bildirim geçmişi

---

# 16. Ortak Bileşenler

Aşağıdaki bileşenler bütün uygulamada ortak kullanılacaktır.

Header

Navigation

Search

Child Selector

Quick Add

Floating Action Button

Modal

Drawer

Toast

Dialog

Loading

Empty State

Error State

---

# 17. Responsive Mimarisi

KidMemoir iki farklı kullanıcı deneyimine sahiptir.

Desktop Experience

Mobile Experience

İş kuralları aynıdır.

Veri aynıdır.

API aynıdır.

Fakat;

Yerleşim

Navigasyon

Kart sıraları

Menüler

Popup yapıları

cihaza göre yeniden tasarlanacaktır.

Responsive yalnızca ekran küçültme değildir.

Her cihaz için ayrı kullanıcı deneyimi oluşturulacaktır.

---

# 18. Desktop Yapısı

Desktop sürümünde;

Sol Menü

Üst Header

Geniş içerik alanı

Çok kolonlu kart yapıları

Sağ panel

kullanılabilir.

Desktop üretkenlik odaklıdır.

---

# 19. Mobile Yapısı

Mobile sürümünde;

Bottom Navigation

Tek kolon

Tam ekran sayfalar

Swipe hareketleri

Büyük dokunma alanları

Quick Add

ön plandadır.

Mobile hız odaklıdır.

---

# 20. Modül Kuralları

Hiçbir modül başka bir modülün verisini değiştiremez.

Örnek

Dashboard

↓

Journal kaydı oluşturamaz.

AI

↓

Child bilgisi değiştiremez.

Timeline

↓

Journal silemez.

Reports

↓

AI cevabı değiştiremez.

---

# 21. Gelecek Modüller (v2+)

Bu modüller ilk sürümde geliştirilmeyecektir.

Calendar

Doctor Portal

Teacher Portal

Family Sharing

Wearable Integration

Apple Health

Google Fit

---

# Sonuç

KidMemoir'ın mimarisi üç temel yapı üzerine kuruludur.

**Child**

↓

Kimdir?

---

**Journal**

↓

Neler yaşadı?

---

**AI**

↓

Bütün bunlar bize ne anlatıyor?

Bu üç yapı ürünün temelidir.

Yeni geliştirilecek her özellik bu üç yapıyı desteklemek zorundadır.

---

# Onay Durumu

✅ Final