export interface Question {
  question: string;
  score: number;
  animation: string;
  icon: string;
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
    "animation": "/images/q1.png",
    "icon": "📸"
  },
  {
    "question": "Profil Başlığı:  Odaklı bir şekilde ne yaptığını anlatıyor mu yoksa kalabalık mı?",
    "score": 15,
    "animation": "/images/q2.png",
    "icon": "🎭"
  },
  {
    "question": "Profil dili: Tanımlı profil dilin ile sayfada kullandığın dil uyumlu mu? (İngilizce açıklamaların varsa sayfanın dili de ingilizce olmalıdır)",
    "score": 5,
    "animation": "/images/q3.png",
    "icon": "📝"
  },
  {
    "question": "Web Sitesi: Yönlendirme linkin portfoloyona, websitene, hizmetlerine, cv'ne yönlendirme yapıyor mu?",
    "score": 10,
    "animation": "/images/q4.png",
    "icon": "🔗"
  },
  {
    "question": "Banner: Seni, işini, hizmetini veya teklifini yansıtan bir görsel mi yoksa alakasız mı?",
    "score": 5,
    "animation": "/images/q5.png",
    "icon": "🌍"
  },
  {
    "question": "İletişim bilgileri: E-posta, site, diğer sosyal medya linkleri ekli mi?",
    "score": 5,
    "animation": "/images/q6.png",
    "icon": "📧"
  },
  {
    "question": "Hakkında: Teknik ve davranışsal beceriler doğru yerleştirilmiş mi?",
    "score": 10,
    "animation": "/images/q7.png",
    "icon": "🛠️"
  },
  {
    "question": "Öne Çıkanlar (Featured):  Servislerin, projelerin veya yazıların bu alanda paylaşılmış mı?",
    "score": 5,
    "animation": "/images/q8.png",
    "icon": "💡"
  },
  {
    "question": "Paylaşım: Kitle çekebilen bir içerik yapısına sahip misin ve düzenli paylaşım yapıyor musun?",
    "score": 14,
    "animation": "/images/q9.png",
    "icon": "🤝"
  },
  {
    "question": "Tavsiye: İş arkadaşların, yöneticiler, hizmet verdiklerin vb ile referans alışverişi yapıyor musun?",
    "score": 5,
    "animation": "/images/q10.png",
    "icon": "📱"
  },
  {
    "question": "Otorite: Yaptığın iş hakkında verilen geri bildirimleri paylaşıyor musun?",
    "score": 8,
    "animation": "/images/q11.png",
    "icon": "📱"
  },
  {
    "question": "Etkileşim: Başkaları ile bağlantı kurup içeriklerine yorumlarda bulunuyor musun?",
    "score": 10,
    "animation": "/images/q12.png",
    "icon": "📱"
  }
];

export const ratingScale: RatingScale[] = [
  { value: 1, label: "Hiç Yapmıyorum", multiplier: 0.20 },
  { value: 2, label: "Var ama özensiz", multiplier: 0.40 },
  { value: 3, label: "Yeterli Değil", multiplier: 0.60 },
  { value: 4, label: "Biraz Düzenlemek Yeterli", multiplier: 0.80 },
  { value: 5, label: "Harika", multiplier: 1.00 }
]; 