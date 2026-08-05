export const navigationItems = [
  { href: "#features", key: "features" },
  { href: "#ai", key: "ai" },
  { href: "#timeline", key: "timeline" },
  { href: "#pricing", key: "pricing" },
  { href: "#faq", key: "faq" },
] as const;

export const trustItems = [
  "Verileriniz size aittir",
  "Reklamsız kullanım",
  "Güvenli bulut altyapısı",
  "Verileriniz AI eğitiminde kullanılmaz",
] as const;

export const featureItems = [
  {
    key: "profile",
    title: "Çocuk Profili",
    description: "Gelişim yolculuğunun tamamı tek, düzenli profilde.",
  },
  {
    key: "events",
    title: "Anı Sistemi",
    description: "Küçük notlardan hayatın dönüm noktalarına kadar her an.",
  },
  {
    key: "ai",
    title: "AI Analizi",
    description: "Kayıtlar arasında güvenli, kaynaklı ve anlamlı bağlantılar.",
  },
  {
    key: "timeline",
    title: "Zaman Çizelgesi",
    description: "Yıllar içinde büyüyen yaşam hikâyesine kuş bakışı.",
  },
  {
    key: "media",
    title: "Fotoğraf ve Belgeler",
    description: "Fotoğraf, video, ses ve belgeler anıları tamamlar.",
  },
  {
    key: "reminders",
    title: "Hatırlatmalar",
    description:
      "Kontrolleri, özel günleri ve takip edilmesi gerekenleri kaçırmayın.",
  },
  {
    key: "cloud",
    title: "Güvenli Bulut",
    description: "Özel aile verileri için tasarlanmış korumalı altyapı.",
  },
  {
    key: "reports",
    title: "Raporlar",
    description: "Dönemleri anlaşılır özetlerle yeniden görün.",
  },
] as const;

export const timelineEvents = [
  {
    date: "12 Mayıs 2024",
    label: "Doğum",
    detail: "Hayat hikâyesi başladı.",
    tone: "journal",
  },
  {
    date: "18 Mart 2025",
    label: "İlk kelime",
    detail: "Bugünün sesi geleceğe kaldı.",
    tone: "ai",
  },
  {
    date: "02 Haziran 2025",
    label: "İlk adım",
    detail: "Üç küçük adım, kocaman bir an.",
    tone: "timeline",
  },
  {
    date: "12 Mayıs 2026",
    label: "İkinci yaş",
    detail: "Fotoğraflar, notlar ve sevdikleriyle.",
    tone: "primary",
  },
] as const;

export const faqItems = [
  [
    "Verilerim güvende mi?",
    "Evet. KidMemoir güvenli bağlantı, erişim kontrolleri ve kullanıcı bazlı veri politikalarıyla tasarlanır.",
  ],
  [
    "AI çocuğuma teşhis koyar mı?",
    "Hayır. KidMemoir AI kesin hüküm veya teşhis üretmez; yalnızca sizin kayıtlarınızı özetler ve kaynak gösterir.",
  ],
  [
    "Verilerim AI eğitiminde kullanılır mı?",
    "Hayır. Aile kayıtlarınız genel amaçlı yapay zekâ modellerini eğitmek için kullanılmaz.",
  ],
  [
    "Ücretsiz sürüm yeterli mi?",
    "Ücretsiz plan bir çocuk için temel anı kaydı, zaman çizelgesi ve sınırlı AI kullanımını içerir.",
  ],
  [
    "Neleri kaydedebilirim?",
    "Anılar, gelişim notları, sağlık kontrolleri, okul bilgileri, fotoğraf, video, ses ve belgeler kaydedilebilir.",
  ],
  [
    "Verilerimi dışarı aktarabilir miyim?",
    "Evet. Kayıtlarınızı ve raporlarınızı taşınabilir biçimlerde dışarı aktarabilmeniz hedeflenir.",
  ],
  [
    "Birden fazla çocuk ekleyebilir miyim?",
    "Premium planda birden fazla çocuk profili oluşturabilir ve her hikâyeyi ayrı yönetebilirsiniz.",
  ],
  [
    "Telefon uygulaması var mı?",
    "KidMemoir önce tüm modern cihazlarda çalışan responsive web deneyimiyle sunulur. Mobil uygulamalar yol haritasındadır.",
  ],
  [
    "Eşimle birlikte kullanabilir miyim?",
    "Aile paylaşımı ve kontrollü ortak erişim ürün yol haritasında yer almaktadır.",
  ],
  [
    "Hesabımı silersem ne olur?",
    "Hesap silme talebiyle ilişkili kişisel veriler, yasal saklama gereklilikleri dışında kalıcı olarak kaldırılır.",
  ],
] as const;
