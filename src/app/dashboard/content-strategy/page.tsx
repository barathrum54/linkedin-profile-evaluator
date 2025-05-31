"use client";

import DashboardLayout from "@/components/DashboardLayout";

const contentSuggestions = [
  {
    type: "Post",
    title: "Endüstri Trendleri Hakkında",
    description:
      "Sektörünüzdeki son gelişmeler hakkında görüşlerinizi paylaşın",
    engagement: "Yüksek",
    timeToCreate: "15 dk",
    category: "Düşünce Liderliği",
    icon: "💡",
  },
  {
    type: "Article",
    title: "Kariyerinizden Dersler",
    description: "Profesyonel gelişiminizden edindiğiniz önemli dersleri yazın",
    engagement: "Orta",
    timeToCreate: "45 dk",
    category: "Kişisel Gelişim",
    icon: "📚",
  },
  {
    type: "Video",
    title: "Günlük Rutininiz",
    description:
      "İş günü rutininizi paylaşarak takipçilerinizle bağlantı kurun",
    engagement: "Yüksek",
    timeToCreate: "30 dk",
    category: "Kişisel Marka",
    icon: "🎥",
  },
  {
    type: "Poll",
    title: "Sektör Anketi",
    description: "Takipçilerinizin görüşlerini almak için anket oluşturun",
    engagement: "Çok Yüksek",
    timeToCreate: "10 dk",
    category: "Etkileşim",
    icon: "📊",
  },
];

const contentCalendar = [
  {
    day: "Pazartesi",
    content: "Motivasyon postu",
    type: "Post",
    status: "planned",
  },
  {
    day: "Çarşamba",
    content: "Endüstri analizi",
    type: "Article",
    status: "draft",
  },
  {
    day: "Cuma",
    content: "Haftalık öğrenimler",
    type: "Post",
    status: "published",
  },
  {
    day: "Pazar",
    content: "Kişisel deneyim",
    type: "Story",
    status: "planned",
  },
];

const performanceMetrics = [
  {
    metric: "Ortalama Etkileşim",
    value: "245",
    change: "+15%",
    color: "green",
  },
  { metric: "Haftalık Reach", value: "3.2K", change: "+8%", color: "blue" },
  { metric: "Profil Ziyareti", value: "89", change: "+23%", color: "purple" },
  { metric: "Bağlantı Talebi", value: "12", change: "+4%", color: "orange" },
];

export default function ContentStrategyPage() {
  const getEngagementColor = (engagement: string) => {
    switch (engagement.toLowerCase()) {
      case "çok yüksek":
        return "bg-green-100 text-green-800 border-green-200";
      case "yüksek":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "orta":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "planned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetricColor = (color: string) => {
    switch (color) {
      case "green":
        return "from-green-500 to-emerald-600";
      case "blue":
        return "from-blue-500 to-blue-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "orange":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <DashboardLayout
      title="İçerik Stratejisi"
      subtitle="Kişiselleştirilmiş içerik önerileri"
    >
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">İçerik Stratejiniz</h1>
              <p className="text-purple-100 text-lg">
                Bu hafta 3 içerik planlanmış, 1 taslak hazır
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.metric}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${getMetricColor(
                    metric.color
                  )} rounded-xl flex items-center justify-center text-white`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="flex items-center text-green-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
                <span className="text-sm text-gray-500 ml-2">son hafta</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Suggestions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Önerilen İçerikler
                </h2>
                <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-colors">
                  Yeni Öneri Al
                </button>
              </div>
              <div className="space-y-4">
                {contentSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{suggestion.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {suggestion.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {suggestion.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getEngagementColor(
                              suggestion.engagement
                            )}`}
                          >
                            {suggestion.engagement} Etkileşim
                          </span>
                          <span className="text-xs text-gray-500">
                            ⏱️ {suggestion.timeToCreate}
                          </span>
                          <span className="text-xs text-gray-500">
                            🏷️ {suggestion.category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                            Şablonu Kullan
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            Daha Sonra
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bu Hafta
              </h2>
              <div className="space-y-4">
                {contentCalendar.map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.day}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === "published"
                          ? "Yayınlandı"
                          : item.status === "draft"
                          ? "Taslak"
                          : "Planlandı"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-colors">
                + Yeni İçerik Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Content Tools */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            İçerik Araçları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 group">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Yazma Asistanı
              </h3>
              <p className="text-sm text-gray-600">
                Yapay zeka ile içerik oluştur
              </p>
            </button>

            <button className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 hover:from-green-100 hover:to-emerald-200 p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 group">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Şablon Kütüphanesi
              </h3>
              <p className="text-sm text-gray-600">Hazır post şablonları</p>
            </button>

            <button className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 group">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                İçerik Takvimi
              </h3>
              <p className="text-sm text-gray-600">Paylaşım planlaması</p>
            </button>

            <button className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 hover:from-orange-100 hover:to-orange-200 p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 group">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Performans Analizi
              </h3>
              <p className="text-sm text-gray-600">İçerik istatistikleri</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
