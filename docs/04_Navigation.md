# KidMemoir
# 04_Navigation.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Navigation

**Bağımlılıklar:**

- 00_Vision.md
- 01_Product_Rules.md
- 02_User_Journey.md
- 03_Information_Architecture.md

---

# 1. Amaç

Bu doküman KidMemoir uygulamasının navigasyon kurallarını tanımlar.

Navigasyon;

• Menüleri

• Sayfa geçişlerini

• Geri dönüş davranışlarını

• URL yapısını

• Mobil ve masaüstü kullanımını

standart hale getirir.

---

# 2. Temel Prensip

Navigasyon hiçbir zaman kullanıcıyı düşündürmeyecek şekilde tasarlanacaktır.

Kullanıcı bulunduğu yeri,

geldiği yeri,

gideceği yeri

her zaman anlayabilmelidir.

---

# 3. Desktop Navigation

Desktop sürümünde ana navigasyon solda bulunacaktır.

--------------------------------------------------

LOGO

Dashboard

Children

Journal

Timeline

AI

Reports

Notifications

-------------------

Profile

Settings

Premium

Logout

--------------------------------------------------

Sol menü sabit olacaktır.

İçerik alanı değişecektir.

---

# 4. Mobile Navigation

Mobil sürümde sol menü kullanılmayacaktır.

Bottom Navigation kullanılacaktır.

--------------------------------------------------

🏠

👶

➕

🤖

👤

--------------------------------------------------

🏠 Dashboard

👶 Children

➕ Quick Add

🤖 AI

👤 More

---

More ekranı;

Reports

Timeline

Notifications

Settings

Premium

Logout

sayfalarını içerir.

---

# 5. Header

Bütün ekranlarda ortak Header bulunacaktır.

Header;

Logo

Aktif Çocuk

Bildirim

Profil

alanlarından oluşacaktır.

Mobilde logo küçültülür.

---

# 6. Child Selector

Sistemde aynı anda yalnızca bir çocuk aktif olabilir.

Çocuk değiştirildiğinde;

Dashboard

Journal

Timeline

AI

Reports

otomatik olarak yeni çocuğa göre güncellenmelidir.

Sayfa yeniden yüklenmez.

---

# 7. Sayfa Geçişleri

Sayfa geçişleri mümkün olduğunca tam sayfa olacaktır.

Popup yalnızca kısa işlemler için kullanılacaktır.

---

Popup kullanılabilecek işlemler;

Quick Add

Onay Mesajları

Silme

Etiket Seçimi

Fotoğraf Önizleme

---

Popup kullanılmayacak işlemler;

Dashboard

Journal

AI

Timeline

Reports

Settings

---

# 8. Quick Add

Quick Add ürünün en önemli navigasyon bileşenidir.

Desktop

Header veya sağ alt köşede Floating Action Button olarak bulunur.

Mobil

Bottom Navigation'ın ortasında yer alır.

Quick Add aşağıdaki işlemleri destekler;

Yeni Journal

Fotoğraf

Video

Ses Kaydı

Belge

---

# 9. Back Davranışı

Desktop

Browser Back desteklenir.

---

Mobil

Her ekranın kendi geri butonu bulunur.

Android fiziksel geri tuşu desteklenir.

---

Popup açıkken;

Geri tuşu popup'ı kapatır.

---

# 10. Breadcrumb

Breadcrumb yalnızca Desktop sürümünde kullanılacaktır.

Örnek

Dashboard

>

Children

>

Ali

>

Health

---

Mobilde breadcrumb kullanılmaz.

---

# 11. URL Standartları

URL'ler okunabilir olmalıdır.

Örnek

/dashboard

/children

/children/{id}

/journal

/journal/new

/journal/{id}

/timeline

/reports

/settings

---

Edit işlemleri

/edit

ile gösterilecektir.

/children/15/edit

---

# 12. Deep Link

Her ekran doğrudan açılabilir olmalıdır.

Örneğin;

Bir bildirimden

Journal kaydına

doğrudan gidilebilir.

---

# 13. Search

Arama ekranı global çalışacaktır.

Aranabilecek alanlar;

Journal

Tags

School

Health

Behavior

Documents

Photos

AI Analyses

---

# 14. Empty State Navigation

Boş ekranlarda kullanıcı çıkmaza girmemelidir.

Örnek;

Henüz Journal kaydınız yok.

↓

İlk Kaydı Oluştur

butonu gösterilir.

---

Henüz AI analizi bulunmuyor.

↓

İlk Analizi Oluştur

---

# 15. Loading Davranışı

Sayfa yüklenirken;

Skeleton ekran kullanılacaktır.

Spinner yalnızca kısa işlemlerde kullanılabilir.

---

# 16. Hata Sayfaları

404

403

500

Offline

bakım ekranları standart olacaktır.

---

# 17. Responsive Kuralları

Desktop ve Mobile aynı URL yapısını kullanacaktır.

İş kuralları aynıdır.

API aynıdır.

Yalnızca kullanıcı deneyimi değişebilir.

---

# 18. Navigasyon İlkeleri

Her sayfanın tek bir amacı vardır.

Kullanıcı hiçbir zaman üç tıklamadan fazla işlem yapmamalıdır.

Her zaman bulunduğu sayfayı anlayabilmelidir.

Kaydedilmemiş veri varsa kullanıcı uyarılmalıdır.

---

# 19. Gelecek Sürümler

v2

Split View

Pinned Pages

Favorites

Recent Pages

Keyboard Shortcuts

---

v3

Command Palette

Global Search

AI Navigation

---

# Sonuç

KidMemoir navigasyonu;

öğrenilmesi gereken değil,

kendiliğinden anlaşılan,

hızlı,

tutarlı,

cihazlara uygun,

modern bir deneyim sunmalıdır.

---

# Onay Durumu

✅ Final