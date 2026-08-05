# KidMemoir
# 09_Domain_Model.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Domain Model

Bağımlılıklar

- 00_Vision.md
- 01_Product_Rules.md
- 02_User_Journey.md
- 03_Information_Architecture.md

---

# 1. Amaç

Bu doküman KidMemoir'ın iş modelini tanımlar.

Bu doküman veritabanını tanımlamaz.

Bu doküman;

ürünün temel nesnelerini,

bu nesnelerin sorumluluklarını,

ve birbirleriyle olan ilişkilerini açıklar.

---

# 2. Domain Felsefesi

KidMemoir'ın merkezi AI değildir.

KidMemoir'ın merkezi Journal değildir.

KidMemoir'ın merkezi;

Child Event'tir.

Çocuğun hayatında yaşanan her olay bir Event olarak değerlendirilir.

AI bu olayları analiz eder.

Timeline bu olayları gösterir.

Reports bu olayları özetler.

---

# 3. Domain Nesneleri

Sistemin temel iş nesneleri aşağıdaki gibidir.

User

↓

Child

↓

Child Event

↓

Media

↓

AI Analysis

↓

Report

↓

Reminder

↓

Notification

---

# 4. User

Amaç

Sistemi kullanan ebeveyndir.

Sorumlulukları

Hesap oluşturmak

Çocuk oluşturmak

Kayıt eklemek

AI kullanmak

Premium yönetmek

Bildirim tercihlerini yönetmek

---

User;

çocuğun sahibi değildir.

Çocuk üzerinde yetkilidir.

---

# 5. Child

Amaç

Bir çocuğu temsil eder.

Child;

ürünün merkezindeki ana varlıktır.

Child;

kimlik bilgilerini,

temel sağlık bilgilerini,

okul bilgilerini,

kişilik bilgilerini,

saklar.

---

Child;

olay oluşturmaz.

AI üretmez.

Rapor üretmez.

---

# 6. Child Event

Amaç

Çocuğun hayatında yaşanan her önemli olayı temsil eder.

Örnekler

İlk kelime

Doktor ziyareti

Ateş

Fotoğraf

Davranış değişikliği

Uyku problemi

Başarı

Okul etkinliği

İlk bisiklet

Tatil

Arkadaş kavgası

Öğretmen görüşmesi

---

Her Event

tek bir çocuğa aittir.

---

Her Event

bir veya daha fazla medya içerebilir.

---

Her Event

AI tarafından analiz edilebilir.

---

# 7. Media

Amaç

Bir Event'e ait medya dosyalarını temsil eder.

Desteklenen Türler

Fotoğraf

Video

Ses

PDF

Belge

---

Media bağımsız değildir.

Mutlaka bir Event'e bağlıdır.

---

# 8. AI Analysis

Amaç

AI tarafından oluşturulan analizleri temsil eder.

AI Analysis;

Child Event'leri okur.

Yeni veri üretmez.

Yorum üretir.

---

AI cevapları

değişebilir.

Çünkü yeni Event'ler oluşabilir.

---

# 9. Timeline

Timeline bir veri modeli değildir.

Timeline;

Child Event'lerin görünümüdür.

---

# 10. Report

Report;

Child Event'ler,

AI analizleri

ve Child bilgileri kullanılarak oluşturulur.

---

Report bağımsız veri üretmez.

---

# 11. Reminder

Reminder;

kullanıcı tarafından oluşturulan hatırlatmadır.

Örnek

Doktor kontrolü

Aşı tarihi

Okul toplantısı

İlaç kullanımı

---

# 12. Notification

Notification;

sistemin kullanıcıya gönderdiği bilgilendirmedir.

Bildirim;

Reminder

AI

System

kaynaklı olabilir.

---

# 13. İlişkiler

Bir User

↓

Birden fazla Child

---

Bir Child

↓

Birden fazla Child Event

---

Bir Child Event

↓

Birden fazla Media

---

Bir Child

↓

Birden fazla AI Analysis

---

Bir Child

↓

Birden fazla Report

---

Bir User

↓

Birden fazla Reminder

---

# 14. Domain Kuralları

Child silinemez.

Arşivlenebilir.

---

Event silinemez.

Arşivlenebilir.

---

Media tek başına oluşturulamaz.

---

AI tek başına çalışamaz.

Event gerekir.

---

Report tek başına oluşturulamaz.

Child gerekir.

---

# 15. Sonuç

KidMemoir'ın bütün iş modeli

tek bir fikir üzerine kuruludur.

Çocuğun hayatında yaşanan her önemli an

bir Event'tir.

Bütün sistem

bu Event'leri toplar,

saklar,

analiz eder,

ve ebeveynin anlamasını sağlar.

---

# Onay Durumu

✅ Final