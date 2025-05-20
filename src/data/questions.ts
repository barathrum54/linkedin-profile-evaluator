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
    "question": "Profil fotoğrafı: Kaliteli ve net mi?",
    "score": 8,
    "icon": "📸",
    "correctImage": "/images/q1.png",
    "wrongImage": "/images/q1-w.png"
  },
  {
    "question": "Profil Başlığı:  Odaklı bir şekilde ne yaptığını anlatıyor mu yoksa kalabalık mı?",
    "score": 15,
    "icon": "🎭",
    "correctImage": "/images/q2.png",
    "wrongImage": "/images/q2-w.png"
  },
  {
    "question": "Profil dili: Tanımlı profil dilin ile sayfada kullandığın dil uyumlu mu? (İngilizce açıklamaların varsa sayfanın dili de ingilizce olmalıdır)",
    "score": 5,
    "icon": "📝",
    "correctImage": "/images/q3.png",
    "wrongImage": "/images/q3-w.png"
  },
  {
    "question": "Web Sitesi: Yönlendirme linkin portfoloyona, websitene, hizmetlerine, cv'ne yönlendirme yapıyor mu?",
    "score": 10,
    "icon": "🔗",
    "correctImage": "/images/q4.png",
    "wrongImage": "/images/q4-w.png"
  },
  {
    "question": "Banner: Seni, işini, hizmetini veya teklifini yansıtan bir görsel mi yoksa alakasız mı?",
    "score": 5,
    "icon": "🌍",
    "correctImage": "/images/q5.png",
    "wrongImage": "/images/q5-w.png"
  },
  {
    "question": "İletişim bilgileri: E-posta, site, diğer sosyal medya linkleri ekli mi?",
    "score": 5,
    "icon": "📧",
    "correctImage": "/images/q6.png",
    "wrongImage": "/images/q6-w.png"
  },
  {
    "question": "Hakkında: Teknik ve davranışsal beceriler doğru yerleştirilmiş mi?",
    "score": 10,
    "icon": "🛠️",
    "correctImage": "/images/q7.png",
    "wrongImage": "/images/q7-w.png"
  },
  {
    "question": "Öne Çıkanlar (Featured):  Servislerin, projelerin veya yazıların bu alanda paylaşılmış mı?",
    "score": 5,
    "icon": "💡",
    "correctImage": "/images/q8.png",
    "wrongImage": "/images/q8-w.png"
  },
  {
    "question": "Paylaşım: Kitle çekebilen bir içerik yapısına sahip misin ve düzenli paylaşım yapıyor musun?",
    "score": 14,
    "icon": "🤝",
    "correctImage": "/images/q9.png",
    "wrongImage": "/images/q9-w.png"
  },
  {
    "question": "Tavsiye: İş arkadaşların, yöneticiler, hizmet verdiklerin vb ile referans alışverişi yapıyor musun?",
    "score": 5,
    "icon": "📱",
    "correctImage": "/images/q10.png",
    "wrongImage": "/images/q10-w.png"
  },
  {
    "question": "Otorite: Yaptığın iş hakkında verilen geri bildirimleri paylaşıyor musun?",
    "score": 8,
    "icon": "📱",
    "correctImage": "/images/q11.png",
    "wrongImage": "/images/q11-w.png"
  },
  {
    "question": "Etkileşim: Başkaları ile bağlantı kurup içeriklerine yorumlarda bulunuyor musun?",
    "score": 10,
    "icon": "📱",
    "correctImage": "/images/q12.png",
    "wrongImage": "/images/q12-w.png"
  }
];

export const ratingScale: RatingScale[] = [
  { value: 1, label: "Hiç Yapmıyorum", multiplier: 0.20 },
  { value: 2, label: "Var ama özensiz", multiplier: 0.40 },
  { value: 3, label: "Yeterli Değil", multiplier: 0.60 },
  { value: 4, label: "Biraz Düzenlemek Yeterli", multiplier: 0.80 },
  { value: 5, label: "Harika", multiplier: 1.00 }
]; 