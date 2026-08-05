# KidMemoir
# 07_Localization.md

**Versiyon:** 1.0

**Durum:** Final

**Belge Türü:** Localization Standard

Bağımlılıklar

- 01_Product_Rules.md
- 06_UI_Standards.md
- 08_Tech_Stack.md
- 31_Architecture.md
- 32_Development_Guide.md

---

# 1. Amaç

Bu doküman KidMemoir projesinin resmi localization ve internationalization standartlarını tanımlar.

Amaç;

- bütün kullanıcı deneyimini çok dilli geliştirmek,
- dil seçimini tutarlı ve öngörülebilir kılmak,
- çeviri metinlerini uygulama kodundan ayırmak,
- Server Component ve SEO avantajlarını korumak,
- yeni dillerin mevcut özellikleri bozmadan eklenmesini sağlamaktır.

Bu dokümandaki kurallar;

Landing Page,

Authentication,

uygulama ekranları,

bildirimler,

e-postalar,

raporlar

ve AI çıktıları için geçerlidir.

---

# 2. Terminoloji

Internationalization (i18n)

Uygulamanın farklı dil ve bölgelere uyarlanabilir biçimde geliştirilmesidir.

Localization (l10n)

Metin, tarih, saat, sayı, para birimi ve içeriklerin belirli bir locale için uyarlanmasıdır.

Locale

Kullanıcının dil ve bölgesel biçimlendirme bağlamını tanımlayan koddur.

Translation Key

Kullanıcıya gösterilen metni çeviri kataloğunda tanımlayan kararlı anahtardır.

Message Catalog

Bir locale ait bütün translation key ve mesajların bulunduğu JSON dosyasıdır.

Default Locale

Dil tespiti sonucunda desteklenen bir locale belirlenemediğinde kullanılan varsayılan dildir.

Fallback Locale

İstenen çevirinin bulunamadığı durumda kontrollü olarak başvurulan locale'dir.

Locale Routing

Locale bilgisinin URL içerisinde açıkça yer aldığı routing modelidir.

---

# 3. Desteklenen Diller

İlk sürümde aşağıdaki diller desteklenecektir.

- Türkçe
- İngilizce

Türkçe;

Türkiye'deki kullanıcılar için birincil deneyimdir.

İngilizce;

uluslararası kullanıcılar ve desteklenmeyen bölgeler için varsayılan deneyimdir.

Yeni bir dil yalnızca çeviri dosyası eklenerek aktif sayılmaz.

Routing,

formatlama,

SEO,

kalite kontrolü

ve içerik onayı tamamlanmalıdır.

---

# 4. Locale Kodları

Desteklenen locale kodları;

```text
tr
en
```

URL locale kodları küçük harfle yazılacaktır.

Dil kodları mümkün olduğunca BCP 47 standardına uygun olacaktır.

İlk sürümde bölgesel varyant gerekmeyen route'larda kısa kod kullanılacaktır.

```text
Doğru

/tr
/en

Yanlış

/TR
/english
/turkish
```

Tarih, para birimi veya SEO gibi bölgesel bağlam gereken yerlerde uygun bölgesel karşılık kullanılabilir.

```text
tr-TR
en-US
```

Uygulamanın merkezi locale listesi tek kaynak olmalıdır.

Component veya feature içerisinde bağımsız locale listesi tanımlanmayacaktır.

---

# 5. Routing Yapısı

KidMemoir locale routing kullanacaktır.

Temel route yapısı;

```text
/{locale}
```

Örnekler;

```text
/tr
/en
/tr/login
/en/login
/tr/children
/en/children
```

Locale segmenti bütün kullanıcı ekranlarında zorunludur.

Kök istek;

```text
/
```

doğrudan içerik render etmez.

Dil seçim stratejisi çalıştırıldıktan sonra uygun locale route'una yönlendirir.

Locale dışındaki route parçaları mümkün olduğunca dilden bağımsız ve kararlı olacaktır.

URL içerisinde çevrilmiş route adı kullanılmayacaktır.

```text
Doğru

/tr/settings
/en/settings

Yanlış

/tr/ayarlar
/en/settings
```

Uygulama içi navigasyonda locale-aware Link ve navigation yardımcıları kullanılacaktır.

Locale değişimi mevcut pathname ve mümkünse güvenli query parametrelerini korumalıdır.

---

# 6. Otomatik Dil Seçim Stratejisi

İlk ziyaret sırasında locale aşağıdaki öncelik sırasıyla belirlenir.

1. Geçerli locale cookie kontrol edilir.
2. Cookie yoksa tarayıcının `Accept-Language` başlığı değerlendirilir.
3. Tarayıcı tercihlerindeki desteklenen ilk dil seçilir.
4. Desteklenen dil bulunamazsa ülke bilgisi değerlendirilir.
5. Türkiye'den gelen kullanıcı için Türkçe seçilir.
6. Diğer ülkeler için İngilizce seçilir.
7. Seçilen locale cookie içine yazılır.
8. Kullanıcı locale içeren route'a yönlendirilir.

Örnek kararlar;

```text
Cookie: tr
Sonuç: Türkçe

Cookie: yok
Browser: en-US
Sonuç: İngilizce

Cookie: yok
Browser: de-DE
Country: TR
Sonuç: Türkçe

Cookie: yok
Browser: de-DE
Country: DE
Sonuç: İngilizce
```

Ülke bilgisi yalnızca dil fallback kararı için kullanılacaktır.

Ülke bilgisi kullanıcı profili, vatandaşlık veya kalıcı bölge tercihi olarak yorumlanmayacaktır.

Kullanıcının açık dil tercihi otomatik tespitten her zaman üstündür.

Login sonrasında `profiles.language` değeri gelecekte kullanıcı tercihini senkronize etmek için kullanılacaktır.

Bu senkronizasyon veritabanı yazma işlemi olmadan localization katmanından bağımsız tasarlanmalıdır.

---

# 7. Cookie Stratejisi

Locale cookie adı;

```text
NEXT_LOCALE
```

Cookie değeri yalnızca desteklenen locale kodlarından biri olabilir.

```text
tr
en
```

Cookie özellikleri;

- Path: `/`
- SameSite: `Lax`
- Max Age: 1 yıl
- Secure: Production ortamında aktif
- HttpOnly: Pasif

Locale cookie kişisel veya hassas veri içermez.

Cookie değeri her kullanım öncesinde desteklenen locale listesine göre doğrulanmalıdır.

Geçersiz,

boş,

bozulmuş

veya artık desteklenmeyen cookie değerleri yok sayılmalıdır.

Kullanıcı locale içeren bir route'u doğrudan ziyaret ettiğinde route locale'i güncel tercih kabul edilerek cookie ile senkronize edilmelidir.

Authentication ve Supabase session cookie'leri locale cookie'den bağımsızdır.

Locale middleware entegrasyonu auth cookie'lerini silmemeli, değiştirmemeli veya gölgelememelidir.

---

# 8. Translation Key Standardı

Translation key'ler İngilizce,

anlam odaklı,

kararlı

ve hiyerarşik olmalıdır.

Standart yapı;

```text
feature.section.element
```

Örnekler;

```text
landing.hero.title
landing.hero.description
landing.nav.features
auth.login.title
auth.login.submitButton
children.emptyState.title
common.actions.cancel
common.validation.required
```

Key içerisinde kullanıcıya gösterilen metnin kendisi kullanılmayacaktır.

```text
Doğru

auth.login.submitButton

Yanlış

auth.login.girisYap
auth.login.button1
```

Key isimleri;

- camelCase yazılmalıdır.
- UI hiyerarşisini değil anlamı temsil etmelidir.
- sıra numarasına dayanmamalıdır.
- gereksiz kısaltma içermemelidir.
- locale'e özel kelime içermemelidir.

Tekrar kullanılan genel metinler `common` namespace altında tutulabilir.

Feature'a özgü metinler başka feature'ın namespace'i altında tutulmayacaktır.

Değişken içeren mesajlarda named placeholder kullanılacaktır.

```text
common.pagination.resultCount

"{count} sonuç bulundu"
```

Çoğul ifadeler ICU Message syntax ile tanımlanmalıdır.

String birleştirme ile çevrilebilir cümle oluşturulmayacaktır.

---

# 9. Dosya Yapısı

Message catalog yapısı;

```text
messages/

tr.json
en.json
```

i18n uygulama yapısı;

```text
src/

i18n/

routing.ts
request.ts
navigation.ts

app/

[locale]/

layout.tsx
page.tsx

proxy.ts
```

Her locale dosyası aynı key şemasına sahip olmalıdır.

Bir locale'e eklenen key diğer aktif locale dosyalarına da eklenmeden görev tamamlanmış sayılmaz.

Çeviri dosyaları UTF-8 formatında tutulmalıdır.

JSON dosyalarında yorum,

trailing comma

ve çalışmayan placeholder kullanılmayacaktır.

Çeviri katalogları runtime sırasında uzak bir kaynaktan gereksiz şekilde alınmayacaktır.

Server tarafında yalnızca aktif locale kataloğu yüklenmelidir.

---

# 10. Component Kuralları

Kullanıcıya görünen hiçbir metin component içerisinde sabit yazılmayacaktır.

Bu kural;

- başlıkları,
- açıklamaları,
- butonları,
- linkleri,
- label metinlerini,
- placeholder metinlerini,
- validation mesajlarını,
- empty state metinlerini,
- toast mesajlarını,
- dialog içeriklerini,
- ARIA label metinlerini,
- görsel alt metinlerini

kapsar.

Doğru kullanım;

```tsx
const t = useTranslations("landing.hero");

<Button>{t("primaryButton")}</Button>
```

Yanlış kullanım;

```tsx
<Button>Ücretsiz Başla</Button>
```

Server Component varsayılan yaklaşım olmaya devam edecektir.

Çeviri kullanımı tek başına bir component'i Client Component yapma nedeni değildir.

Server Component içinde server translation API,

Client Component içinde client translation hook'u

kullanılmalıdır.

Locale bilgisi prop zinciriyle gereksiz biçimde taşınmayacaktır.

Uygulama içi linkler locale-aware navigation katmanı üzerinden oluşturulmalıdır.

Marka adları,

ürün adları

ve yasal isimler çevrilmeden önce ürün kararı gerektirir.

`KidMemoir` ürün adı bütün locale'lerde aynı kalacaktır.

---

# 11. Tarih ve Saat Formatları

Tarih ve saatler elle string birleştirilerek formatlanmayacaktır.

`Intl.DateTimeFormat` veya next-intl formatlama yardımcıları kullanılacaktır.

Locale bazlı örnekler;

```text
tr-TR
12 Mayıs 2026
14:30

en-US
May 12, 2026
2:30 PM
```

Veritabanında tarih ve saat değerleri gösterim formatıyla saklanmayacaktır.

Timestamp değerleri UTC olarak saklanmalıdır.

Kullanıcıya gösterim sırasında;

locale,

kullanıcının timezone tercihi,

date format tercihi,

time format tercihi

uygulanmalıdır.

Timezone önceliği;

1. `user_settings.timezone`
2. doğrulanmış tarayıcı timezone bilgisi
3. sistem fallback timezone'u

Relative time ifadeleri locale-aware olmalıdır.

```text
tr: 2 saat önce
en: 2 hours ago
```

Saat dilimi belirtilmeyen tarih değerleri sessizce yerel saate çevrilmemelidir.

---

# 12. Sayı ve Para Birimi Formatları

Sayılar ve para birimleri string birleştirme ile formatlanmayacaktır.

`Intl.NumberFormat` veya next-intl formatlama yardımcıları kullanılacaktır.

Sayı örnekleri;

```text
tr-TR: 1.250,50
en-US: 1,250.50
```

Para birimi örnekleri;

```text
tr-TR / TRY: ₺1.250,00
en-US / USD: $1,250.00
```

Locale para birimini tek başına belirlemez.

Para birimi;

ürün fiyatlandırma kararı,

ödeme sağlayıcısı,

kullanıcı bölgesi

ve abonelik kaydıyla belirlenmelidir.

Yüzde,

ölçü,

dosya boyutu

ve token maliyeti gibi değerler de locale-aware formatlanmalıdır.

Hesaplama yapılan sayısal değerler formatlanmış string olarak saklanmayacaktır.

---

# 13. SEO Kuralları

Her indexlenebilir locale route'u locale bazlı metadata üretmelidir.

Zorunlu alanlar;

- locale'e çevrilmiş title,
- locale'e çevrilmiş description,
- locale'e özel canonical URL,
- Open Graph locale,
- alternatif locale bilgileri,
- hreflang bağlantıları.

Örnek canonical URL'ler;

```text
https://kidmemoir.com/tr
https://kidmemoir.com/en
```

Her sayfa aşağıdaki hreflang ilişkilerini sağlamalıdır.

```text
tr
en
x-default
```

`x-default` uluslararası fallback route'una yönlenmelidir.

İlk sürümde;

```text
x-default → /en
```

Sitemap bütün indexlenebilir locale varyantlarını içermelidir.

Sitemap locale alternatiflerini birbirleriyle ilişkilendirmelidir.

Structured data içerisinde uygun olduğunda `inLanguage` kullanılmalıdır.

Locale route'ları aynı canonical URL altında birleştirilmeyecektir.

Bir locale sayfası başka locale'in title veya description metnini kullanmayacaktır.

---

# 14. AI Dil Davranışı

KidMemoir AI varsayılan olarak aktif kullanıcı locale'inde cevap vermelidir.

AI dil önceliği;

1. Kullanıcının açık mesajındaki dil tercihi
2. `profiles.language` veya kullanıcı ayarı
3. Aktif route locale'i
4. Sistem default locale'i

Kullanıcı farklı bir dilde açıkça cevap istediğinde AI bu tercihe uyabilir.

AI prompt'larında dil talimatı açık ve yapılandırılmış olmalıdır.

AI tarafından üretilen;

özetler,

başlıklar,

analizler,

rapor açıklamaları

locale bilgisiyle birlikte ele alınmalıdır.

Kaynak içerik başka dilde olsa bile AI;

kaynak anlamını değiştirmemeli,

isimleri çevirmemeli,

tıbbi veya psikolojik teşhis üretmemeli,

uydurma çeviri eklememelidir.

Kullanıcı tarafından yazılmış anı metni otomatik olarak değiştirilmemelidir.

Orijinal içerik korunmalı,

çeviri gerekiyorsa ayrı ve açıkça işaretlenmiş çıktı üretilmelidir.

AI fallback veya hata mesajları da translation catalog üzerinden sunulmalıdır.

---

# 15. Yeni Dil Ekleme Süreci

Yeni bir dil aşağıdaki sırayla eklenmelidir.

1. Ürün ve pazar gereksinimi onaylanır.
2. BCP 47 uyumlu locale kodu belirlenir.
3. Merkezi desteklenen locale listesine eklenir.
4. Yeni message catalog oluşturulur.
5. Mevcut aktif locale şeması eksiksiz çevrilir.
6. Tarih, saat ve sayı formatları doğrulanır.
7. Para birimi davranışı ürün kararıyla eşleştirilir.
8. Locale routing doğrulanır.
9. Otomatik dil seçim kuralı güncellenir.
10. Cookie doğrulaması yeni locale'i destekleyecek şekilde güncellenir.
11. Metadata, Open Graph ve hreflang eşlemeleri eklenir.
12. Sitemap güncellenir.
13. AI dil talimatları doğrulanır.
14. Mobile, tablet ve desktop görünümleri kontrol edilir.
15. Uzun metin ve taşma testleri yapılır.
16. Native speaker veya yetkili içerik editörü onayı alınır.
17. TypeScript, lint ve production build kontrolleri tamamlanır.

Yeni locale eksik çeviriyle production ortamında aktif edilmemelidir.

---

# 16. Best Practices

- Locale kararlarını tek merkezde tut.
- Server Component yaklaşımını koru.
- Yalnızca aktif locale mesajlarını yükle.
- Translation key'leri anlam odaklı tasarla.
- Bütün aktif locale dosyalarında aynı key şemasını koru.
- Tarih, saat, sayı ve para birimlerinde Intl API kullan.
- Cümleleri parçalara bölmek yerine bütün mesajı çevir.
- Çoğulları ICU Message syntax ile yönet.
- ARIA ve screen reader metinlerini de çevir.
- Çevirilerde ürün terminolojisini tutarlı kullan.
- Locale-aware navigation kullan.
- Explicit kullanıcı tercihini otomatik tespitten üstün tut.
- Missing message hatalarını build veya CI aşamasında yakala.
- Uzun çevirileri responsive ve erişilebilirlik açısından test et.
- Translation değişikliklerini ilgili ekranla birlikte review et.
- Çeviri dosyalarını UTF-8 olarak sakla.

---

# 17. Yapılmaması Gerekenler

- Component içinde kullanıcıya görünen sabit metin yazmak.
- Locale kodlarını componentlere dağıtmak.
- Tarayıcı dilini kullanıcı tercihinden üstün tutmak.
- Ülke bilgisini kesin kullanıcı dili olarak kabul etmek.
- URL locale'i ile cookie locale'ini kontrolsüz biçimde çelişkili bırakmak.
- Auth veya session cookie'lerini locale middleware içinde kaybetmek.
- Çevrilmiş route isimleriyle farklı URL mimarileri oluşturmak.
- Translation key olarak çevrilen cümleyi kullanmak.
- Key isimlerinde sıra numarası veya anlamsız kısaltma kullanmak.
- Cümleleri string birleştirme ile oluşturmak.
- Tarih, saat, sayı veya para birimini elle formatlamak.
- Formatlanmış sayısal değeri veritabanında saklamak.
- Eksik key'i sessizce production'a taşımak.
- Bir locale'in SEO metadata'sını başka locale'den kopyalamak.
- Kullanıcı tarafından yazılan içeriği izinsiz çevirmek veya değiştirmek.
- AI çıktısının dilini yalnızca prompt metnini tahmin ederek belirlemek.
- Yeni locale'i çeviri ve kalite kontrolü tamamlanmadan aktif etmek.
- Localization ihtiyacı nedeniyle gereksiz Client Component oluşturmak.

---

# Sonuç

KidMemoir localization altyapısı;

server-first,

SEO uyumlu,

erişilebilir,

ölçeklenebilir,

kullanıcı tercihlerine saygılı

ve yeni dillere açık olacaktır.

Bu doküman projedeki bütün dil,

locale routing,

formatlama

ve çok dilli içerik kararları için resmi referanstır.

---

# Onay Durumu

✅ Final
