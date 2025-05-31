"use client";

import DashboardLayout from "@/components/DashboardLayout";

const profileData = {
  score: 85,
  completionRate: 78,
  strengths: [
    {
      title: "Profesyonel Başlık",
      score: 95,
      description: "LinkedIn başlığınız açık ve etkileyici",
    },
    {
      title: "Özet Bölümü",
      score: 88,
      description: "Kişisel özetiniz güçlü ve dikkat çekici",
    },
    {
      title: "Deneyim Detayları",
      score: 82,
      description: "İş deneyimleriniz detaylı ve etkileyici",
    },
  ],
  improvements: [
    {
      title: "Beceri Listesi",
      priority: "high",
      description: "Daha fazla beceri eklemeniz önerilir",
    },
    {
      title: "Öneri Sayısı",
      priority: "medium",
      description: "Daha fazla öneri almanız faydalı olacak",
    },
    {
      title: "Profil Fotoğrafı",
      priority: "low",
      description: "Daha profesyonel bir fotoğraf kullanabilirsiniz",
    },
  ],
};

export default function ProfilePage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profil Yönetimi</h1>
              <p className="text-blue-100 text-lg">
                LinkedIn profilinizi analiz edin ve optimize edin
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${profileData.score * 2.51} ${
                      100 * 2.51
                    }`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profileData.score}
                  </span>
                </div>
              </div>
              <p className="text-blue-100">Profil Skoru</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Güçlü Yönler</h2>
            </div>
            <div className="space-y-4">
              {profileData.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-green-50/50 border border-green-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {strength.title}
                    </h3>
                    <span className="text-lg font-bold text-green-600">
                      {strength.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {strength.description}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
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
              <h2 className="text-2xl font-bold text-gray-900">
                İyileştirme Önerileri
              </h2>
            </div>
            <div className="space-y-4">
              {profileData.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-4 ${getPriorityColor(
                    improvement.priority
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {improvement.title}
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/50">
                      {improvement.priority === "high"
                        ? "Yüksek"
                        : improvement.priority === "medium"
                        ? "Orta"
                        : "Düşük"}{" "}
                      Öncelik
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {improvement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profil İşlemleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 hover:shadow-lg group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
              <h3 className="text-lg font-semibold mb-2">Yeniden Analiz Et</h3>
              <p className="text-sm text-blue-100">
                Profilinizi tekrar analiz edin
              </p>
            </button>

            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 hover:shadow-lg group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Profil Optimize Et</h3>
              <p className="text-sm text-green-100">AI destekli optimizasyon</p>
            </button>

            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 hover:shadow-lg group">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rapor İndir</h3>
              <p className="text-sm text-purple-100">PDF analiz raporu</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
