# KidMemoir
# 01_Product_Rules.md

**Versiyon:** 1.0  
**Durum:** Final  
**Belge Türü:** Product Rules  
**Bağımlılık:** 00_Vision.md  
**Son Güncelleme:** 06.08.2026

---

# 1. Amaç

Bu doküman KidMemoir ürününün değişmeyecek temel kurallarını tanımlar.

Bu kurallar;

- Ürün Tasarımı
- Kullanıcı Deneyimi
- Yazılım Mimarisi
- Yapay Zekâ
- Güvenlik
- Performans
- İş Kuralları

için referans niteliğindedir.

Yeni geliştirilecek her özellik bu kurallara uygun olmak zorundadır.

Bu doküman, ürün geliştirme sürecindeki en üst seviye referans dokümandır.

---

# 2. Ürün Kimliği

## Kural 1

KidMemoir bir **AI sohbet uygulaması değildir.**

KidMemoir;

çocuk gelişim hafızasıdır.

Yapay zekâ bu hafızayı anlamlandıran katmandır.

---

## Kural 2

Ürünün merkezinde AI değil;

çocuk hakkında oluşturulan yaşam geçmişi bulunacaktır.

---

## Kural 3

Her yeni özellik şu soruya cevap vermelidir.

> Bu özellik ebeveynin çocuğunu daha iyi anlamasına yardımcı oluyor mu?

Cevap "Hayır" ise özellik geliştirilmeyecektir.

---

## Kural 4

Basitlik her zaman yeni özellikten daha değerlidir.

---

# 3. Kullanıcı Deneyimi

## Kural 5

İlk çocuk oluşturma işlemi 30 saniyeden uzun sürmemelidir.

İlk kayıt sırasında sadece;

- Ad
- Doğum Tarihi
- Cinsiyet

istenebilir.

Diğer bilgiler daha sonra tamamlanacaktır.

---

## Kural 6

Bir Journal kaydı ortalama 60 saniyede tamamlanabilmelidir.

---

## Kural 7

Hiçbir ekran kullanıcıyı uzun formlar doldurmaya zorlamayacaktır.

---

## Kural 8

Dashboard açıldıktan sonraki ilk 5 saniye içinde kullanıcı;

- Son kayıtları
- Son AI analizini
- Hızlı kayıt butonunu

görebilmelidir.

---

## Kural 9

Her ekranın yalnızca bir ana amacı olacaktır.

---

## Kural 10

Kullanıcı üç tıklamadan fazla işlem yapmak zorunda kalmamalıdır.

---

# 4. Journal Kuralları

## Kural 11

Journal ürünün kalbidir.

AI dahil bütün sistem Journal kayıtlarından beslenir.

---

## Kural 12

Her kayıt;

- Tarih
- Saat
- Oluşturan Kullanıcı

bilgilerini taşımalıdır.

---

## Kural 13

Bir kayıt aşağıdaki ekleri destekleyebilir.

- Fotoğraf
- Video
- Ses Kaydı
- Dosya

---

## Kural 14

Bir kayıt birden fazla kategoriye ait olabilir.

Örneğin;

Hem "Okul"

Hem "Davranış"

---

## Kural 15

Silme yerine arşivleme tercih edilir.

---

## Kural 16

Kullanıcı yazdığı veriyi hiçbir durumda kaybetmemelidir.

Taslak sistemi bulunmalıdır.

---

# 5. AI Kuralları

## Kural 17

AI yalnızca kullanıcı isterse çalışacaktır.

AI otomatik analiz başlatmayacaktır.

---

## Kural 18

Ücretsiz sürümde AI kullanım limiti bulunacaktır.

Ürün özellikleri sınırlandırılmayacaktır.

Yalnızca AI kullanım hakkı sınırlandırılır.

---

## Kural 19

Her AI cevabı;

çocuğun geçmiş kayıtlarını dikkate almak zorundadır.

---

## Kural 20

AI geçmiş kayıtları referans gösterebilmelidir.

Örnek;

> Benzer bir durum 14 Mart 2025 tarihinde de kayıt edilmiştir.

---

## Kural 21

AI aynı olayları zaman içerisindeki değişime göre değerlendirebilmelidir.

Geçmiş bilgiler arttıkça cevaplar gelişmelidir.

---

## Kural 22

AI çelişkili kayıtları fark edebilmelidir.

Örneğin;

Bir ay önce;

"Uyku problemi yok."

Bugün;

"Son iki aydır uyuyamıyor."

Bu durumda AI kullanıcıdan açıklama isteyebilir.

---

## Kural 23

AI;

Tanı koyamaz.

Teşhis koyamaz.

Tedavi öneremez.

Kesin hüküm veremez.

---

## Kural 24

AI;

Yalnızca öneri sunabilir.

Karar kullanıcıya aittir.

---

## Kural 25

AI hiçbir zaman;

Korkutucu

Suçlayıcı

Yargılayıcı

bir dil kullanamaz.

---

# 6. Çocuk Kuralları

## Kural 26

İlk sürüm;

0–12 yaş çocuklara odaklanacaktır.

---

## Kural 27

Her çocuk bağımsız bir yaşam geçmişine sahip olacaktır.

Kayıtlar çocuklar arasında karıştırılamaz.

---

## Kural 28

Bir kayıt yalnızca tek bir çocuğa ait olabilir.

---

# 7. Güvenlik

## Kural 29

Kullanıcı verileri satılamaz.

---

## Kural 30

Kullanıcı verileri AI model eğitimi amacıyla kullanılamaz.

---

## Kural 31

Kullanıcı bütün verilerini dışarı aktarabilir.

---

## Kural 32

Hesap silindiğinde;

kişisel veriler geri getirilemeyecek şekilde kaldırılır.

---

# 8. Performans

## Kural 33

Dashboard

2 saniyeden kısa sürede açılmalıdır.

---

## Kural 34

AI cevap süresi

15 saniyeyi geçmemelidir.

---

## Kural 35

Büyük dosyalar arka planda yüklenebilmelidir.

---

# 9. Tasarım

## Kural 36

Hedef kullanıcı ebeveyndir.

Çocuk değildir.

---

## Kural 37

Tasarım dili;

Sade

Premium

Güven veren

olmalıdır.

---

## Kural 38

Animasyonlar yalnızca kullanıcı deneyimini desteklemek amacıyla kullanılacaktır.

---

# 10. Bildirimler

## Kural 39

Bildirimler asla suçlayıcı olmayacaktır.

Yanlış:

"Bugün kayıt oluşturmadınız."

Doğru:

"Bugün küçük bir anı eklemek ister misiniz?"

---

## Kural 40

Kullanıcı bütün bildirimleri özelleştirebilir.

---

# 11. Premium

## Kural 41

Ücretsiz kullanıcı eksik ürün kullanmayacaktır.

Premium;

özellik açmaz.

Kullanım limitlerini genişletir.

---

## Kural 42

Premium ekranı yalnızca ihtiyaç oluştuğunda gösterilecektir.


# Responsive Kuralları

## Kural 43

KidMemoir Mobile First değildir.

KidMemoir Responsive First değildir.

KidMemoir Adaptive Experience yaklaşımını kullanacaktır.

Desktop ve Mobile kullanıcı deneyimleri farklı tasarlanacaktır.

---

## Kural 44

Desktop ve Mobile aynı verileri kullanacaktır.

Ancak ekran yerleşimleri farklı olabilir.

---

## Kural 45

Desktop ekranları;

geniş çalışma alanı,

çoklu panel,

aynı anda birden fazla bilgi gösterme

mantığıyla tasarlanacaktır.

---

## Kural 46

Mobile ekranları;

tek odaklı,

parmak ile kullanım,

hızlı veri girişi,

tek kolon

mantığıyla tasarlanacaktır.

---

## Kural 47

Hiçbir ekran yalnızca Desktop'a özel geliştirilmeyecektir.

Hiçbir özellik yalnızca Mobile'a özel geliştirilmeyecektir.

Özellikler aynıdır.

Deneyim farklıdır.

---

## Kural 48

Responsive tasarım yalnızca ekranı küçültmek değildir.

Her cihaz için en uygun kullanıcı deneyimi oluşturulacaktır.


# WOW Experience Kuralları

## Kural 49

KidMemoir yalnızca işlevsel bir uygulama olmayacaktır.

İlk açılışta kullanıcıda "Bu uygulama çok kaliteli." hissi oluşturmalıdır.

---

## Kural 50

Her ekranın en az bir WOW noktası olacaktır.

Örneğin;

Dashboard

→ AI kartı

Timeline

→ Hikâye hissi

Journal

→ Zengin medya kartları

AI

→ Referanslı cevaplar

---

## Kural 51

Hiçbir ekran sıradan CRUD görünümünde olmayacaktır.

Liste + Form yaklaşımı yalnızca yönetim ekranlarında kullanılabilir.

---

## Kural 52

Kartlar yalnızca bilgi göstermek için değil,

duygu oluşturmak için de tasarlanacaktır.

---

## Kural 53

Premium görünüm;

renklerle değil,

boşluk,

tipografi,

animasyon,

kart düzeni

ile oluşturulacaktır.


# Responsive Mimarisi

KidMemoir iki farklı kullanıcı deneyimine sahiptir.

Desktop Experience

Mobile Experience

Bu iki deneyim;

aynı veriyi,

aynı özellikleri,

aynı iş kurallarını kullanır.

Ancak ekran yerleşimleri,

navigasyon,

kart yapıları,

ve kullanıcı akışları cihaz tipine göre yeniden tasarlanır.

Responsive yalnızca ekran küçültme değildir.

Her cihaz için ayrı deneyim tasarlanacaktır.

---

# 12. Yeni Özellik Kuralları

Yeni eklenecek her özellik aşağıdaki dört soruya cevap vermelidir.

1. Ebeveyne gerçek değer katıyor mu?

2. Çocuğun gelişimini anlamaya yardımcı oluyor mu?

3. Ürünü gereksiz karmaşıklaştırıyor mu?

4. AI olmadan da anlamlı mı?

Herhangi bir soruya olumsuz cevap veriliyorsa özellik ürüne eklenmeyecektir.

---

# Son İlke

KidMemoir'ın amacı;

en fazla özelliğe sahip olmak değildir.

Amaç;

ebeveynlerin çocuklarını daha iyi anlamalarını sağlayan,

güvenilir,

sade,

uzun yıllar kullanılabilecek,

dünyanın en kaliteli çocuk gelişim hafızasını oluşturmaktır.

---

# Bağımlı Dokümanlar

- 00_Vision.md
- 02_User_Flow.md
- 03_Database.md
- 07_Journal.md
- 08_AI.md

---

# Değişiklik Geçmişi

## v1.0

- İlk sürüm oluşturuldu.

---

# Onay Durumu

✅ Onaylandı