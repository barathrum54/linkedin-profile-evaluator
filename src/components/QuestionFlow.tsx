"use client";

import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { questionsData } from "@/data/questions";
import SocialShare from "./SocialShare";

function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
        <button
          className="absolute top-2 right-2 text-black bg-white text-2xl font-bold rounded-full h-8 w-8 opacity-80 flex items-center justify-center"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Helper function to get label based on slider value
const getSliderLabel = (value: number): string => {
  if (value >= 0 && value <= 19) return "Henüz Üzerinde Çalışmadım";
  if (value >= 20 && value <= 39) return "Eksik ve Gelişime Açık";
  if (value >= 40 && value <= 59) return "Temel Seviyede Hazır";
  if (value >= 60 && value <= 79) return "Gözden Geçirilmiş ve Düzenli";
  if (value >= 80 && value <= 100) return "Stratejik ve Etkileyici";
  return "";
};

// Helper function to convert slider value to multiplier for scoring
const getMultiplierFromSliderValue = (value: number): number => {
  if (value >= 0 && value <= 19) return 0.2;
  if (value >= 20 && value <= 39) return 0.4;
  if (value >= 40 && value <= 59) return 0.6;
  if (value >= 60 && value <= 79) return 0.8;
  if (value >= 80 && value <= 100) return 1.0;
  return 0;
};

// Helper function to get improvement recommendations
const getImprovementRecommendation = (questionIndex: number, userScore: number): string => {
  const recommendations = [
    {
      // Profil fotoğrafı
      low: "Profesyonel bir fotoğrafçıdan çekilmiş, yüksek çözünürlüklü bir profil fotoğrafı kullanın. Arka plan sade olmalı ve siz net bir şekilde görünmelisiniz.",
      medium: "Mevcut fotoğrafınız iyi ancak daha profesyonel bir çekim için stüdyo ortamında çektirmeyi düşünün.",
      high: "Profil fotoğrafınız harika! Düzenli olarak güncelleyerek taze tutmaya devam edin."
    },
    {
      // Profil Başlığı
      low: "Başlığınızı sadeleştirin ve ne yaptığınızı net bir şekilde belirtin. Anahtar kelimeler kullanın ama kalabalık yapmayın.",
      medium: "Başlığınızı daha çekici hale getirmek için değer önerinizi vurgulayın.",
      high: "Başlığınız mükemmel! Sektörünüzdeki gelişmelere göre güncel tutmaya devam edin."
    },
    {
      // Profil dili
      low: "Profil dilinizi hedef kitlenize göre ayarlayın. Eğer uluslararası çalışıyorsanız İngilizce, yerel odaklıysanız Türkçe kullanın.",
      medium: "Dil tutarlılığınızı kontrol edin ve tüm bölümlerde aynı dili kullandığınızdan emin olun.",
      high: "Dil kullanımınız tutarlı ve profesyonel!"
    },
    {
      // Web Sitesi
      low: "Portfolyo, CV veya hizmetlerinizi gösteren bir web sitesi oluşturun ve LinkedIn profilinize ekleyin.",
      medium: "Mevcut web sitenizi güncelleyin ve daha çok ziyaretçi çekecek içerikler ekleyin.",
      high: "Web siteniz harika! Düzenli olarak güncel içeriklerle besleyin."
    },
    {
      // Banner
      low: "Kişisel markanızı yansıtan profesyonel bir banner tasarlayın. Canva gibi araçları kullanabilirsiniz.",
      medium: "Banner'ınızı daha çekici hale getirmek için renk uyumu ve tipografi üzerinde çalışın.",
      high: "Banner'ınız markanızı mükemmel yansıtıyor!"
    },
    {
      // İletişim bilgileri
      low: "E-posta, telefon ve sosyal medya hesaplarınızı ekleyin. Ulaşılabilir olduğunuzu gösterin.",
      medium: "İletişim bilgilerinizi güncel tutun ve profesyonel e-posta adresi kullanın.",
      high: "İletişim bilgileriniz eksiksiz ve profesyonel!"
    },
    {
      // Hakkında
      low: "Hakkında bölümünü hikayenizi anlatacak şekilde yazın. Teknik ve soft skill'lerinizi dengeli bir şekilde vurgulayın.",
      medium: "Hakkında bölümünüze başarı hikayelerinizi ve somut örnekleri ekleyin.",
      high: "Hakkında bölümünüz çok etkileyici ve profesyonel!"
    },
    {
      // Öne Çıkanlar
      low: "En iyi projelerinizi, makalelerinizi veya başarılarınızı öne çıkanlar bölümüne ekleyin.",
      medium: "Öne çıkanlar bölümünüzü düzenli olarak güncelleyin ve yeni başarılarınızı ekleyin.",
      high: "Öne çıkanlar bölümünüz portföyünüzü mükemmel sergiliyor!"
    },
    {
      // Paylaşım
      low: "Sektörünüzle ilgili düzenli paylaşımlar yapmaya başlayın. Haftada 2-3 kaliteli içerik paylaşın.",
      medium: "Paylaşımlarınızın etkileşim oranını artırmak için daha çekici görseller ve başlıklar kullanın.",
      high: "İçerik stratejiniz harika! Bu şekilde devam edin."
    },
    {
      // Tavsiye
      low: "İş arkadaşlarınızdan ve müşterilerinizden tavsiye mektupları isteyin. Karşılıklı tavsiye alışverişi yapın.",
      medium: "Mevcut tavsiyelerinizi güncelleyin ve yeni projelerden referanslar ekleyin.",
      high: "Tavsiye bölümünüz çok güçlü ve inandırıcı!"
    },
    {
      // Otorite
      low: "Aldığınız geri bildirimleri, ödülleri ve başarılarınızı paylaşmaya başlayın.",
      medium: "Otorite göstergenizi güçlendirmek için sektör etkinliklerine katılın ve paylaşın.",
      high: "Sektörünüzde güçlü bir otorite konumundasınız!"
    },
    {
      // Etkileşim
      low: "Başkalarının içeriklerine yorum yapmaya ve bağlantı kurmaya başlayın. Aktif bir topluluk üyesi olun.",
      medium: "Etkileşimlerinizi daha anlamlı hale getirin ve değer katan yorumlar yapın.",
      high: "Etkileşim stratejiniz mükemmel! Toplulukta aktif ve değerli bir üyesiniz."
    }
  ];

  const recommendation = recommendations[questionIndex];
  if (userScore <= 39) return recommendation.low;
  if (userScore <= 79) return recommendation.medium;
  return recommendation.high;
};

function ImprovementScreen({ 
  answers, 
  onBack,
  onRestart 
}: { 
  answers: (number | null)[], 
  onBack: () => void,
  onRestart: () => void 
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Calculate overall statistics
  const totalScore = answers.reduce((sum: number, answer) => sum + (answer || 0), 0);
  const averageScore = Math.round(totalScore / answers.length);
  const completedQuestions = answers.filter(answer => answer !== null).length;
  const highScoreQuestions = answers.filter(answer => (answer || 0) >= 80).length;
  const lowScoreQuestions = answers.filter(answer => (answer || 0) < 40).length;

  // Get priority areas (lowest scoring questions)
  const priorityAreas = questionsData
    .map((question, index) => ({
      index,
      question: question.question,
      score: answers[index] || 0,
      weight: question.score
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 transition-all duration-1000 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Profil İyileştirme Rehberi
                </h1>
                <p className="text-sm text-gray-600">Kişiselleştirilmiş öneriler ve analiz</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tekrar Başla
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Panel - Questions List */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sorular ve Puanlarınız</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Detayları görmek için bir soruya tıklayın
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {averageScore}/100
                  </p>
                  <p className="text-xs text-gray-500">Ortalama</p>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {questionsData.map((question, index) => {
                const userAnswer = answers[index] || 0;
                const isSelected = selectedQuestion === index;
                const isPriority = priorityAreas.some(area => area.index === index);
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedQuestion(index)}
                    className={`p-4 border-b cursor-pointer transition-all duration-300 hover:bg-blue-50 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                        : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
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
                        <p className={`text-sm mt-1 line-clamp-2 ${
                          isSelected ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {question.question}
                        </p>
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              userAnswer >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                              userAnswer >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                              userAnswer >= 40 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${userAnswer}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${
                          userAnswer >= 80 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : userAnswer >= 60
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                            : userAnswer >= 40
                            ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
                            : 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border border-red-200'
                        }`}>
                          {userAnswer}/100
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Question Details */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Soru {selectedQuestion + 1} Detayları
                </h2>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                  (answers[selectedQuestion] || 0) >= 80 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : (answers[selectedQuestion] || 0) >= 60
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                    : (answers[selectedQuestion] || 0) >= 40
                    ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                    : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                }`}>
                  {answers[selectedQuestion] || 0}/100
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Question */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Soru
                </h3>
                <p className="text-gray-800 font-medium">
                  {questionsData[selectedQuestion].question}
                </p>
              </div>

              {/* Your Score with enhanced visualization */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Puanınız
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 shadow-sm ${
                        (answers[selectedQuestion] || 0) >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        (answers[selectedQuestion] || 0) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                        (answers[selectedQuestion] || 0) >= 40 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${answers[selectedQuestion] || 0}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-900 min-w-[80px]">
                    {answers[selectedQuestion] || 0}/100
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    (answers[selectedQuestion] || 0) >= 80 ? 'bg-green-100 text-green-800' :
                    (answers[selectedQuestion] || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    (answers[selectedQuestion] || 0) >= 40 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getSliderLabel(answers[selectedQuestion] || 0)}
                  </span>
                </div>
              </div>

              {/* Examples with enhanced styling - Vertically Stacked */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Örnekler
                </h3>
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-green-700">Doğru Örnek</p>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border-2 border-green-200 group-hover:border-green-300 transition-colors">
                      <img 
                        src={questionsData[selectedQuestion].correctImage}
                        alt="Doğru örnek"
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-green-500/10 group-hover:bg-green-500/20 transition-colors"></div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-red-700">Yanlış Örnek</p>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border-2 border-red-200 group-hover:border-red-300 transition-colors">
                      <img 
                        src={questionsData[selectedQuestion].wrongImage}
                        alt="Yanlış örnek"
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  İyileştirme Önerileri
                </h3>
                <div className="bg-white/80 backdrop-blur border border-blue-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {getImprovementRecommendation(selectedQuestion, answers[selectedQuestion] || 0)}
                  </p>
                </div>
                
                {/* Smart tip based on score */}
                <div className="mt-4 p-4 bg-white/60 backdrop-blur rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">💡 Akıllı İpucu</p>
                      <p className="text-xs text-gray-600">
                        {(answers[selectedQuestion] || 0) < 40 
                          ? "Bu alan profilinizin en çok gelişime ihtiyaç duyduğu bölümlerden biri. Hemen harekete geçin!"
                          : (answers[selectedQuestion] || 0) < 70
                          ? "İyi bir başlangıç! Birkaç küçük dokunuşla bu alanı mükemmelleştirebilirsiniz."
                          : "Harika! Bu alanda güçlüsünüz. Bu başarıyı diğer alanlara da taşıyabilirsiniz."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Debug component for faster testing
function DebugComponent({ 
  onFinishTest 
}: { 
  onFinishTest: () => void 
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Debug Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-50 flex items-center justify-center"
        title="Debug Tools"
      >
        🐛
      </button>

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Debug Tools</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bu araçlar sadece test amaçlıdır. Tüm soruları rastgele cevaplarla doldurur ve sonuç ekranına geçer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onFinishTest();
                  setShowModal(false);
                }}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Testi Bitir
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [showImprovementScreen, setShowImprovementScreen] = useState(false);
  const { playClickSound } = useSound();

  useEffect(() => {
    if (isTestFinished) {
      const timer = setTimeout(() => {
        setShowScoreLoader(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTestFinished]);

  const handleRestart = () => {
    playClickSound();
    setCurrentQuestion(0);
    setAnswers(new Array(questionsData.length).fill(null));
    setScore(0);
    setShowScoreLoader(true);
    setIsTestFinished(false);
    setShowImprovementScreen(false);
  };

  const handleImprovement = () => {
    playClickSound();
    setShowImprovementScreen(true);
  };

  // Debug function to finish test with random answers
  const handleDebugFinishTest = () => {
    playClickSound();
    const randomAnswers = questionsData.map(() => Math.floor(Math.random() * 101));
    setAnswers(randomAnswers);
    
    // Calculate score with random answers
    const newScore = randomAnswers.reduce(
      (total: number, ans: number, idx: number) => {
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );
    setScore(Math.ceil(newScore));
    setIsTestFinished(true);
  };

  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    playClickSound();
    // Calculate score with multipliers
    const newScore = answers.reduce(
      (total: number, ans: number | null, idx: number) => {
        if (ans === null) return total;
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );
    setScore(Math.ceil(newScore));

    // Check if this is the last question and set isTestFinished accordingly
    if (currentQuestion === questionsData.length - 1) {
      setIsTestFinished(true);
    } else {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟";
    if (score >= 70) return "Harika! Profiliniz oldukça iyi durumda! ✨";
    if (score >= 50)
      return "İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈";
    return "Profilinizi geliştirmek için önerilerimizi dikkate alın. 🎯";
  };

  // Show improvement screen if requested
  if (showImprovementScreen) {
    return (
      <ImprovementScreen
        answers={answers}
        onBack={() => setShowImprovementScreen(false)}
        onRestart={handleRestart}
      />
    );
  }

  if (isTestFinished) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="scale-in">
            <div className="card-container rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-8">
                  <div className="score-container">
                    <div
                      className="score-fill"
                      style={
                        { "--score-height": `${score}%` } as React.CSSProperties
                      }
                    />
                  </div>
                  <div className="grade-container">
                    <div
                      className={`grade-marker ${score >= 85 ? "active" : ""}`}
                      data-grade="S"
                    >
                      <div className="grade-letter">S</div>
                      <div className="grade-label">Profesyonel</div>
                    </div>
                    <div
                      className={`grade-marker ${
                        score >= 70 && score < 85 ? "active" : ""
                      }`}
                      data-grade="A"
                    >
                      <div className="grade-letter">A</div>
                      <div className="grade-label">Takibe Değer</div>
                    </div>
                    <div
                      className={`grade-marker ${
                        score >= 50 && score < 70 ? "active" : ""
                      }`}
                      data-grade="B"
                    >
                      <div className="grade-letter">B</div>
                      <div className="grade-label">Fena Değil</div>
                    </div>
                    <div
                      className={`grade-marker ${
                        score >= 30 && score < 50 ? "active" : ""
                      }`}
                      data-grade="C"
                    >
                      <div className="grade-letter">C</div>
                      <div className="grade-label">Ne iş Belli Değil</div>
                    </div>
                    <div
                      className={`grade-marker ${score < 30 ? "active" : ""}`}
                      data-grade="D"
                    >
                      <div className="grade-letter">D</div>
                      <div className="grade-label">Sadece Var</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  {showScoreLoader && (
                    <div
                      className="loader"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  )}
                  <div
                    className={`score-number ${
                      !showScoreLoader ? "visible" : ""
                    }`}
                  >
                    {score}/100
                  </div>
                </div>
                <p className="score-message">{getScoreMessage(score)}</p>
                <SocialShare />
                <button
                  onClick={handleImprovement}
                  className="mt-8 gradient-bg text-white px-8 py-4 rounded-xl transition-all duration-300 
                      hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
                >
                  <svg
                    className="w-5 h-5"
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
                  İyileştir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-8 flex items-center justify-center">
      {/* Container for two-column layout on large screens */}
      <div className="w-full max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
        {/* First column: Correct and incorrect images */}
        <div className="flex flex-col gap-6 mb-6 lg:mb-0">
          {/* Correct Example */}
          <div
            className="relative w-full bg-white rounded-xl shadow-lg overflow-visible cursor-pointer"
            onClick={() =>
              setModalImg(questionsData[currentQuestion].correctImage)
            }
          >
            <img
              src={questionsData[currentQuestion].correctImage}
              alt="Doğru örnek"
              className="w-full h-auto object-contain rounded-lg"
            />
            <img
              src="/images/checkmark.png"
              alt="Doğru"
              className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
            />
          </div>
          {/* Incorrect Example */}
          <div
            className="relative w-full bg-white rounded-xl shadow-lg overflow-visible cursor-pointer"
            onClick={() =>
              setModalImg(questionsData[currentQuestion].wrongImage)
            }
          >
            <img
              src={questionsData[currentQuestion].wrongImage}
              alt="Yanlış örnek"
              className="w-full h-auto object-contain rounded-lg"
            />
            <img
              src="/images/cross.png"
              alt="Yanlış"
              className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
            />
          </div>
        </div>
        {/* Second column: Question card */}
        <div className="flex justify-center">
          <div className="fade-in w-full max-w-[350px] lg:max-w-[500px]">
            <div className="bg-[#4a90c2] rounded-[16px] p-4 lg:p-8 shadow-xl flex flex-col items-center lg:h-full">
              <div className="flex-grow w-full flex flex-col items-center lg:justify-between">
                <div className="mb-4 w-full">
                  <p className="text-white text-sm lg:text-2xl font-medium leading-tight">
                    {questionsData[currentQuestion].question}
                  </p>
                </div>
                <div className="flex flex-col gap-4 w-full mb-4">
                  {/* Numeric Score Display */}
                  <div className="text-center">
                    <div className="text-white text-4xl lg:text-6xl font-bold mb-2">
                      {answers[currentQuestion] || 0}
                    </div>
                    <div className="text-white text-xs lg:text-sm opacity-80">
                      Score
                    </div>
                  </div>
                  
                  {/* Slider */}
                  <div className="flex items-center gap-3 w-full px-2">
                    <span className="text-white text-xs lg:text-sm opacity-70 min-w-[20px]">0</span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers[currentQuestion] || 0}
                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                        className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ffffff ${answers[currentQuestion] || 0}%, rgba(255,255,255,0.3) ${answers[currentQuestion] || 0}%)`
                        }}
                      />
                    </div>
                    <span className="text-white text-xs lg:text-sm opacity-70 min-w-[30px]">100</span>
                  </div>
                  
                  {/* Dynamic Label */}
                  <div className="text-center">
                    <div className="text-white text-base lg:text-xl font-medium bg-transparent bg-opacity-20 rounded-lg py-2 px-4">
                      {getSliderLabel(answers[currentQuestion] || 0)}
                    </div>
                  </div>
                </div>
                <button
                  className={`w-full py-2 sm:py-1 rounded-[20px] text-xs lg:text-3xl font-normal mt-1 transition-all duration-200
                      ${
                        answers[currentQuestion] !== null
                          ? "bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]"
                          : "bg-[#e3f1fb] text-blue-200 cursor-not-allowed"
                      }`}
                  onClick={handleSubmit}
                  disabled={answers[currentQuestion] === null}
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for image viewing */}
      {modalImg && (
        <ImageModal
          src={modalImg}
          alt="Örnek"
          onClose={() => setModalImg(null)}
        />
      )}
      <DebugComponent onFinishTest={handleDebugFinishTest} />
    </div>
  );
}
