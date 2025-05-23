export interface Question {
  question: string;
  score: number;
  icon: string;
  correctImage: string;
  wrongImage: string;
}

export interface RatingScale {
  value: number;
  label: string;
  multiplier: number;
}

export const questionsData: Question[] = [
  {
    question: "Profil fotoğrafı: Kaliteli ve net mi?",
    score: 8,
    icon: "📸",
    correctImage: "/images/1.jpg",
    wrongImage: "/images/1-w.jpg",
  },
  {
    question:
      "Profil Başlığı:  Odaklı bir şekilde ne yaptığını anlatıyor mu yoksa kalabalık mı?",
    score: 15,
    icon: "🎭",
    correctImage: "/images/2.jpg",
    wrongImage: "/images/2-w.jpg",
  },
  {
    question:
      "Profil dili: Tanımlı profil dilin ile sayfada kullandığın dil uyumlu mu? (İngilizce açıklamaların varsa sayfanın dili de ingilizce olmalıdır)",
    score: 5,
    icon: "📝",
    correctImage: "/images/3.jpg",
    wrongImage: "/images/3-w.jpg",
  },
  {
    question:
      "Web Sitesi: Yönlendirme linkin portfoloyona, websitene, hizmetlerine, cv'ne yönlendirme yapıyor mu?",
    score: 10,
    icon: "🔗",
    correctImage: "/images/4.jpg",
    wrongImage: "/images/4-w.jpg",
  },
  {
    question:
      "Banner: Seni, işini, hizmetini veya teklifini yansıtan bir görsel mi yoksa alakasız mı?",
    score: 5,
    icon: "🌍",
    correctImage: "/images/5.jpg",
    wrongImage: "/images/5-w.jpg",
  },
  {
    question:
      "İletişim bilgileri: E-posta, site, diğer sosyal medya linkleri ekli mi?",
    score: 5,
    icon: "📧",
    correctImage: "/images/6.jpg",
    wrongImage: "/images/6-w.jpg",
  },
  {
    question:
      "Hakkında: Teknik ve davranışsal beceriler doğru yerleştirilmiş mi?",
    score: 10,
    icon: "🛠️",
    correctImage: "/images/7.jpg",
    wrongImage: "/images/7-w.jpg",
  },
  {
    question:
      "Öne Çıkanlar (Featured):  Servislerin, projelerin veya yazıların bu alanda paylaşılmış mı?",
    score: 5,
    icon: "💡",
    correctImage: "/images/8.jpg",
    wrongImage: "/images/8-w.jpg",
  },
  {
    question:
      "Paylaşım: Kitle çekebilen bir içerik yapısına sahip misin ve düzenli paylaşım yapıyor musun?",
    score: 14,
    icon: "🤝",
    correctImage: "/images/9.jpg",
    wrongImage: "/images/9-w.jpg",
  },
  {
    question:
      "Tavsiye: İş arkadaşların, yöneticiler, hizmet verdiklerin vb ile referans alışverişi yapıyor musun?",
    score: 5,
    icon: "📱",
    correctImage: "/images/10.jpg",
    wrongImage: "/images/10-w.jpg",
  },
  {
    question:
      "Otorite: Yaptığın iş hakkında verilen geri bildirimleri paylaşıyor musun?",
    score: 8,
    icon: "📱",
    correctImage: "/images/11.jpg",
    wrongImage: "/images/11-w.jpg",
  },
  {
    question:
      "Etkileşim: Başkaları ile bağlantı kurup içeriklerine yorumlarda bulunuyor musun?",
    score: 10,
    icon: "📱",
    correctImage: "/images/12.jpg",
    wrongImage: "/images/12-w.jpg",
  },
];

export const ratingScale: RatingScale[] = [
  { value: 1, label: "Hiç Yapmıyorum", multiplier: 0.2 },
  { value: 2, label: "Var ama özensiz", multiplier: 0.4 },
  { value: 3, label: "Yeterli Değil", multiplier: 0.6 },
  { value: 4, label: "Biraz Düzenlemek Yeterli", multiplier: 0.8 },
  { value: 5, label: "Harika", multiplier: 1.0 },
];
