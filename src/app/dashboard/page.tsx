"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

// Mock data for activities
const recentActivities = [
  {
    id: 1,
    type: "profile_update",
    title: "Profil başlığı güncellendi",
    description: "LinkedIn başlığınızı optimize ettiniz",
    time: "2 saat önce",
    icon: "✏️",
  },
  {
    id: 2,
    type: "connection",
    title: "Yeni bağlantı eklendi",
    description: "5 yeni profesyonel bağlantı kuruldu",
    time: "5 saat önce",
    icon: "🤝",
  },
  {
    id: 3,
    type: "content",
    title: "İçerik önerisi oluşturuldu",
    description: "Yeni haftalık içerik planınız hazır",
    time: "1 gün önce",
    icon: "📝",
  },
  {
    id: 4,
    type: "analysis",
    title: "Haftalık analiz tamamlandı",
    description: "Profil performans raporu oluşturuldu",
    time: "2 gün önce",
    icon: "📊",
  },
];

// Quick actions for icon buttons
const quickActions = [
  {
    name: "Profil Analizi",
    href: "/dashboard/profile",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Faturalama",
    href: "/dashboard/billing",
    icon: (
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Ana Kurs",
    href: "/dashboard/course",
    icon: (
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Ayarlar",
    href: "/dashboard/settings",
    icon: (
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    color: "from-orange-500 to-orange-600",
  },
];

// Mock feed posts
const feedPosts = [
  {
    id: 1,
    type: "announcement",
    title: "Yeni Özellik: AI Destekli Profil Analizi",
    content:
      "LinkedIn profilinizi yapay zeka ile analiz etmek artık daha kolay! Yeni AI destekli sistemimiz, profilinizin güçlü ve zayıf yönlerini detaylı bir şekilde analiz ediyor.",
    time: "3 saat önce",
    author: "LinkedIn Pro Ekibi",
    icon: "🤖",
  },
  {
    id: 2,
    type: "tip",
    title: "LinkedIn Profil İpucu",
    content:
      "Profil özetinizi düzenli olarak güncelleyin. Son 6 ay içinde edindiğiniz yeni becerileri ve deneyimleri eklemeyi unutmayın.",
    time: "1 gün önce",
    author: "Uzman Tavsiyeleri",
    icon: "💡",
  },
  {
    id: 3,
    type: "success",
    title: "Başarı Hikayesi",
    content:
      "Bu ay premium üyelerimiz profil görüntülenmelerinde ortalama %34 artış yaşadı. Siz de profilinizi optimize ederek daha fazla fırsata ulaşabilirsiniz.",
    time: "2 gün önce",
    author: "İstatistik Raporu",
    icon: "📈",
  },
];

export default function DashboardPage() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz! 👋</h1>
              <p className="text-blue-100 text-lg">
                LinkedIn profiliniz son 7 günde %23 daha fazla görüntülendi
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feed Header */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📰 Güncel Haberler & İpuçları
              </h2>
              <p className="text-gray-600">
                Size özel hazırlanmış güncellemeler ve profesyonel gelişim
                ipuçları
              </p>
            </div>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{post.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        ✍️ {post.author}
                      </span>
                      <div className="flex gap-3">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          👍 Beğen
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          💬 Yorum
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          📤 Paylaş
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors">
                Daha Fazla Yükle
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Hızlı İşlemler
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <div key={action.name} className="relative">
                    <button
                      onMouseEnter={() => setHoveredAction(action.name)}
                      onMouseLeave={() => setHoveredAction(null)}
                      className={`w-full bg-gradient-to-r ${action.color} text-white p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                    >
                      {action.icon}
                    </button>

                    {/* Tooltip */}
                    {hoveredAction === action.name && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
                        {action.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Son Aktiviteler
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                Tümünü Görüntüle →
              </button>
            </div>

            {/* Profil Durumu */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Profil Durumu
                </h2>
                <span className="text-sm text-gray-500">Bu ay %15 gelişme</span>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${85 * 2.2} ${100 * 2.2}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        85%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Profil Tamamlanma
                  </h3>
                  <p className="text-xs text-gray-600">Hedef: %100</p>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#10b981"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${72 * 2.2} ${100 * 2.2}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        72%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    İçerik Kalitesi
                  </h3>
                  <p className="text-xs text-gray-600">Hedef: %90</p>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="#8b5cf6"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${68 * 2.2} ${100 * 2.2}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        68%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Network Büyümesi
                  </h3>
                  <p className="text-xs text-gray-600">Hedef: %80</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
