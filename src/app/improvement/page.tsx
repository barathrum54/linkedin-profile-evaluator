"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questionsData } from "@/data/questions";

// Helper function to get improvement recommendations
const getImprovementRecommendation = (
  questionIndex: number,
  userScore: number
): string => {
  const recommendations = [
    {
      // Profil fotoğrafı
      low: "Profesyonel bir fotoğrafçıdan çekilmiş, yüksek çözünürlüklü bir profil fotoğrafı kullanın. Arka plan sade olmalı ve siz net bir şekilde görünmelisiniz.",
      medium:
        "Mevcut fotoğrafınız iyi ancak daha profesyonel bir çekim için stüdyo ortamında çektirmeyi düşünün.",
      high: "Profil fotoğrafınız harika! Düzenli olarak güncelleyerek taze tutmaya devam edin.",
    },
    {
      // Profil Başlığı
      low: "Başlığınızı sadeleştirin ve ne yaptığınızı net bir şekilde belirtin. Anahtar kelimeler kullanın ama kalabalık yapmayın.",
      medium:
        "Başlığınızı daha çekici hale getirmek için değer önerinizi vurgulayın.",
      high: "Başlığınız mükemmel! Sektörünüzdeki gelişmelere göre güncel tutmaya devam edin.",
    },
    {
      // Profil dili
      low: "Profil dilinizi hedef kitlenize göre ayarlayın. Eğer uluslararası çalışıyorsanız İngilizce, yerel odaklıysanız Türkçe kullanın.",
      medium:
        "Dil tutarlılığınızı kontrol edin ve tüm bölümlerde aynı dili kullandığınızdan emin olun.",
      high: "Dil kullanımınız tutarlı ve profesyonel!",
    },
    {
      // Web Sitesi
      low: "Portfolyo, CV veya hizmetlerinizi gösteren bir web sitesi oluşturun ve LinkedIn profilinize ekleyin.",
      medium:
        "Mevcut web sitenizi güncelleyin ve daha çok ziyaretçi çekecek içerikler ekleyin.",
      high: "Web siteniz harika! Düzenli olarak güncel içeriklerle besleyin.",
    },
    {
      // Banner
      low: "Kişisel markanızı yansıtan profesyonel bir banner tasarlayın. Canva gibi araçları kullanabilirsiniz.",
      medium:
        "Banner'ınızı daha çekici hale getirmek için renk uyumu ve tipografi üzerinde çalışın.",
      high: "Banner'ınız markanızı mükemmel yansıtıyor!",
    },
    {
      // İletişim bilgileri
      low: "E-posta, telefon ve sosyal medya hesaplarınızı ekleyin. Ulaşılabilir olduğunuzu gösterin.",
      medium:
        "İletişim bilgilerinizi güncel tutun ve profesyonel e-posta adresi kullanın.",
      high: "İletişim bilgileriniz eksiksiz ve profesyonel!",
    },
    {
      // Hakkında
      low: "Hakkında bölümünü hikayenizi anlatacak şekilde yazın. Teknik ve soft skill'lerinizi dengeli bir şekilde vurgulayın.",
      medium:
        "Hakkında bölümünüze başarı hikayelerinizi ve somut örnekleri ekleyin.",
      high: "Hakkında bölümünüz çok etkileyici ve profesyonel!",
    },
    {
      // Öne Çıkanlar
      low: "En iyi projelerinizi, makalelerinizi veya başarılarınızı öne çıkanlar bölümüne ekleyin.",
      medium:
        "Öne çıkanlar bölümünüzü düzenli olarak güncelleyin ve yeni başarılarınızı ekleyin.",
      high: "Öne çıkanlar bölümünüz portföyünüzü mükemmel sergiliyor!",
    },
    {
      // Paylaşım
      low: "Sektörünüzle ilgili düzenli paylaşımlar yapmaya başlayın. Haftada 2-3 kaliteli içerik paylaşın.",
      medium:
        "Paylaşımlarınızın etkileşim oranını artırmak için daha çekici görseller ve başlıklar kullanın.",
      high: "İçerik stratejiniz harika! Bu şekilde devam edin.",
    },
    {
      // Tavsiye
      low: "İş arkadaşlarınızdan ve müşterilerinizden tavsiye mektupları isteyin. Karşılıklı tavsiye alışverişi yapın.",
      medium:
        "Mevcut tavsiyelerinizi güncelleyin ve yeni projelerden referanslar ekleyin.",
      high: "Tavsiye bölümünüz çok güçlü ve inandırıcı!",
    },
    {
      // Otorite
      low: "Aldığınız geri bildirimleri, ödülleri ve başarılarınızı paylaşmaya başlayın.",
      medium:
        "Otorite göstergenizi güçlendirmek için sektör etkinliklerine katılın ve paylaşın.",
      high: "Sektörünüzde güçlü bir otorite konumundasınız!",
    },
    {
      // Etkileşim
      low: "Başkalarının içeriklerine yorum yapmaya ve bağlantı kurmaya başlayın. Aktif bir topluluk üyesi olun.",
      medium:
        "Etkileşimlerinizi daha anlamlı hale getirin ve değer katan yorumlar yapın.",
      high: "Etkileşim stratejiniz mükemmel! Toplulukta aktif ve değerli bir üyesiniz.",
    },
  ];

  const recommendation = recommendations[questionIndex];
  if (userScore <= 39) return recommendation.low;
  if (userScore <= 79) return recommendation.medium;
  return recommendation.high;
};

export default function ImprovementPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPricingBubble, setShowPricingBubble] = useState(true);

  useEffect(() => {
    // Get answers from localStorage
    const storedAnswers = localStorage.getItem("testAnswers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    } else {
      // If no answers found, redirect to home
      router.push("/");
      return;
    }
    setAnimateIn(true);
  }, [router]);

  const handleRestart = () => {
    localStorage.removeItem("testAnswers");
    localStorage.removeItem("testScore");
    router.push("/");
  };

  const handleBack = () => {
    router.push("/results");
  };

  const handlePricing = () => {
    router.push("/pricing");
  };

  const handleQuestionClick = (index: number) => {
    // If clicked question is already expanded, collapse it
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      // Otherwise, expand this question (and collapse any other)
      setExpandedQuestion(index);
    }
  };

  // Calculate overall statistics
  const totalScore = answers.reduce(
    (sum: number, answer) => sum + (answer || 0),
    0
  );
  const averageScore = Math.round(totalScore / answers.length);

  // Get priority areas (lowest scoring questions)
  const priorityAreas = questionsData
    .map((question, index) => ({
      index,
      question: question.question,
      score: answers[index] || 0,
      weight: question.score,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  if (answers.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 transition-all duration-1000 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between lg:h-20 h-14">
            <div className="flex items-center gap-4">
              <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Profil İyileştirme Rehberi
                </h1>
                <p className="text-sm text-gray-600">
                  Kişiselleştirilmiş öneriler ve analiz
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-3 md:px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden md:inline">Tekrar Başla</span>
              </button>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 md:px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden md:inline">Geri Dön</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-0 sm:px-4 lg:px-8 py-8">
        <div className="w-full lg:w-2/3 lg:max-w-4xl mx-auto">
          {/* Header Summary */}
          <div className="bg-white/80 backdrop-blur rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-blue-100 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Profil İyileştirme Önerileri
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detayları görmek için soruları tıklayın
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {averageScore}/100
                </p>
                <p className="text-xs text-gray-500">Ortalama Puan</p>
              </div>
            </div>
          </div>

          {/* Questions Card Container */}
          <div className="bg-white/80 backdrop-blur rounded-none sm:rounded-2xl shadow-xl border-0 sm:border border-gray-200 overflow-hidden">
            {/* Accordion Questions */}
            <div className="divide-y divide-gray-200">
              {questionsData.map((question, index) => {
                const userAnswer = answers[index] || 0;
                const isExpanded = expandedQuestion === index;
                const isPriority = priorityAreas.some(
                  (area) => area.index === index
                );
                const isLowScore = userAnswer < 40;

                return (
                  <div key={index} className="transition-all duration-300">
                    {/* Question Header - Clickable */}
                    <div
                      onClick={() => handleQuestionClick(index)}
                      className={`relative p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                        isExpanded
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Priority Indicator */}
                      {isLowScore && (
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <p
                              className={`text-lg font-semibold ${
                                isExpanded ? "text-blue-900" : "text-gray-900"
                              }`}
                            >
                              Soru {index + 1}
                            </p>
                            {isPriority && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Öncelik
                              </span>
                            )}
                            {userAnswer >= 80 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Güçlü
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-base mb-3 ${
                              isExpanded ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {question.question}
                          </p>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                userAnswer >= 80
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : userAnswer >= 60
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                                  : userAnswer >= 40
                                  ? "bg-gradient-to-r from-orange-400 to-red-400"
                                  : "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                              style={{ width: `${userAnswer}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-base sm:text-lg font-bold shadow-sm ${
                              userAnswer >= 80
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                : userAnswer >= 60
                                ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200"
                                : userAnswer >= 40
                                ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200"
                                : "bg-gradient-to-r from-red-100 to-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {userAnswer}/100
                          </div>
                          <div
                            className={`transform transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="bg-gray-50/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Examples */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Örnekler
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium text-green-700">
                                  Doğru Örnek
                                </p>
                              </div>
                              <div className="relative overflow-hidden rounded-lg border border-green-200">
                                <img
                                  src={question.correctImage}
                                  alt="Doğru örnek"
                                  className="w-full h-32 object-cover"
                                />
                              </div>
                            </div>
                            <div className="group">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm font-medium text-red-700">
                                  Yanlış Örnek
                                </p>
                              </div>
                              <div className="relative overflow-hidden rounded-lg border border-red-200">
                                <img
                                  src={question.wrongImage}
                                  alt="Yanlış örnek"
                                  className="w-full h-32 object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Improvement Suggestions */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            İyileştirme Önerileri
                          </h3>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {getImprovementRecommendation(index, userAnswer)}
                            </p>
                          </div>

                          {/* Smart tip */}
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-yellow-800 mb-1">
                                  💡 İpucu
                                </p>
                                <p className="text-xs text-yellow-700">
                                  {userAnswer < 40
                                    ? "Bu alan profilinizin en çok gelişime ihtiyaç duyduğu bölümlerden biri. Hemen harekete geçin!"
                                    : userAnswer < 70
                                    ? "İyi bir başlangıç! Birkaç küçük dokunuşla bu alanı mükemmelleştirebilirsiniz."
                                    : "Harika! Bu alanda güçlüsünüz. Bu başarıyı diğer alanlara da taşıyabilirsiniz."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button with Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Bubble */}
        {showPricingBubble && (
          <div className="absolute bottom-full right-0 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap animate-bounce">
            Bu işin sırrını öğren
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600"></div>
          </div>
        )}

        {/* FAB Button */}
        <button
          onClick={() => {
            setShowPricingBubble(false);
            handlePricing();
          }}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
