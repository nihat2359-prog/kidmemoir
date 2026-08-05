# KidMemoir
# 10_Event_Catalog.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Event Catalog

Bağımlılıklar

- 09_Domain_Model.md

---

# 1. Amaç

Bu doküman KidMemoir içerisinde oluşturulabilecek tüm Event (Olay) tiplerini tanımlar.

Her Event;

çocuğun hayatında yaşanan anlamlı bir olayı temsil eder.

Bütün AI analizleri,

Timeline,

Raporlar

ve istatistikler

bu Event'ler üzerinden çalışacaktır.

---

# 2. Event Yapısı

Her Event aşağıdaki ortak özelliklere sahiptir.

- Kategori
- Alt Kategori
- Başlık
- Açıklama
- Tarih
- Saat
- Etiketler
- Medya
- Konum (Opsiyonel)
- AI Analizine Dahil Et
- Önem Derecesi
- Favori
- Arşiv Durumu

---

# 3. Sağlık (Health)

## Doctor Visit

Amaç

Doktor ziyaretlerini kayıt altına almak.

Önerilen Alanlar

- Doktor Adı
- Branş
- Hastane / Klinik
- Şikayet
- Doktor Notları
- Teşhis (İsteğe Bağlı)
- Tedavi Önerisi
- Kontrol Tarihi

Medya

- Fotoğraf
- PDF
- Reçete
- Laboratuvar Sonucu

AI

✅ Desteklenir

---

## Vaccination

Alanlar

- Aşı Adı
- Doz
- Yapıldığı Tarih
- Sonraki Doz Tarihi

Hatırlatma

✅

AI

✅

---

## Medication

Alanlar

- İlaç Adı
- Başlangıç
- Bitiş
- Doz
- Açıklama

Hatırlatma

✅

---

## Fever

Alanlar

- Derece
- Ölçüm Saati
- Süre
- Belirtiler

AI

✅

---

## Allergy

Alanlar

- Alerjen
- Belirti
- Şiddet
- Doktor Yorumu

---

# 4. Eğitim (Education)

## Teacher Meeting

Alanlar

- Öğretmen
- Okul
- Güçlü Yönler
- Geliştirilmesi Gereken Alanlar
- Genel Not

AI

✅

---

## Homework

Alanlar

- Ders
- Konu
- Durum

---

## Exam

Alanlar

- Ders
- Sonuç
- Notlar

---

## Report Card

Alanlar

- Dönem
- Ortalama
- Öğretmen Yorumu

---

# 5. Gelişim (Development)

## First Word

Alanlar

- Söylenen Kelime
- Açıklama

---

## First Step

Alanlar

- Açıklama

---

## Toilet Training

Alanlar

- Başlangıç
- Tamamlandı mı

---

## Swimming

Alanlar

- Seviye

---

## Bicycle

Alanlar

- İlk Deneme
- Başarı

---

# 6. Davranış (Behavior)

## Tantrum

## Aggression

## Anxiety

## Sharing

## Responsibility

## Social Interaction

Hepsi için ortak alanlar

- Durum
- Süre
- Tetikleyici
- Sonuç
- Ebeveyn Yorumu

AI

✅

---

# 7. Duygu (Emotion)

Happy

Sad

Fear

Excitement

Proud

Disappointed

Alanlar

- Duygu
- Sebep
- Açıklama

---

# 8. Uyku (Sleep)

Night Sleep

Nap

Nightmare

Sleep Problem

Alanlar

- Başlangıç
- Bitiş
- Süre
- Kalite

---

# 9. Beslenme (Nutrition)

New Food

Poor Appetite

Vitamin

Water Intake

Alanlar

- Açıklama
- Miktar
- Tepki

---

# 10. Sosyal Yaşam (Social)

Birthday

Vacation

New Friend

Family Event

Play Date

---

# 11. Başarı (Achievement)

Competition

Medal

Certificate

Award

First Success

---

# 12. Hobi (Hobby)

Music

Painting

Dance

Football

Chess

Reading

---

# 13. Genel (General)

Serbest not.

Herhangi bir kategoriye uymayan kayıtlar için kullanılır.

---

# 14. Ortak Kurallar

Her Event:

- Fotoğraf ekleyebilir.
- Video ekleyebilir.
- Ses kaydı ekleyebilir.
- Dosya ekleyebilir.
- AI analizine dahil edilebilir.
- Favorilere eklenebilir.
- Arşivlenebilir.

---

# 15. Gelecek Sürümler

v2

Özel Event Tipi oluşturma

v3

AI tarafından Event önerisi

Örnek

"Bu kayıt bir Doktor Ziyareti gibi görünüyor."

---

# Sonuç

KidMemoir'ın temel veri yapısı Event'tir.

Yeni geliştirilecek bütün özellikler Event mantığı üzerine inşa edilmelidir.

---

# Onay Durumu

✅ Final