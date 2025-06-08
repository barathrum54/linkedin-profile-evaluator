'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Mock data for activities
const recentActivities = [
  {
    id: 1,
    type: 'profile_update',
    title: 'Profil başlığı güncellendi',
    description: 'LinkedIn başlığınızı optimize ettiniz',
    time: '2 saat önce',
    icon: '✏️',
  },
  {
    id: 2,
    type: 'connection',
    title: 'Yeni bağlantı eklendi',
    description: '5 yeni profesyonel bağlantı kuruldu',
    time: '5 saat önce',
    icon: '🤝',
  },
  {
    id: 3,
    type: 'content',
    title: 'İçerik önerisi oluşturuldu',
    description: 'Yeni haftalık içerik planınız hazır',
    time: '1 gün önce',
    icon: '📝',
  },
  {
    id: 4,
    type: 'analysis',
    title: 'Haftalık analiz tamamlandı',
    description: 'Profil performans raporu oluşturuldu',
    time: '2 gün önce',
    icon: '📊',
  },
];

// Quick actions for icon buttons
const quickActions = [
  {
    name: 'Profil Analizi',
    href: '/dashboard/profile',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="profile-analysis-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Faturalama',
    href: '/dashboard/billing',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="billing-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Ana Kurs',
    href: '/dashboard/course',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="course-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Ayarlar',
    href: '/dashboard/settings',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="settings-icon"
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
    color: 'from-orange-500 to-orange-600',
  },
];

// Mock feed posts
const feedPosts = [
  {
    id: 1,
    type: 'announcement',
    title: 'Yeni Özellik: AI Destekli Profil Analizi',
    content:
      'LinkedIn profilinizi yapay zeka ile analiz etmek artık daha kolay! Yeni AI destekli sistemimiz, profilinizin güçlü ve zayıf yönlerini detaylı bir şekilde analiz ediyor.',
    time: '3 saat önce',
    author: 'LinkedIn Pro Ekibi',
    icon: '🤖',
  },
  {
    id: 2,
    type: 'tip',
    title: 'LinkedIn Profil İpucu',
    content:
      'Profil özetinizi düzenli olarak güncelleyin. Son 6 ay içinde edindiğiniz yeni becerileri ve deneyimleri eklemeyi unutmayın.',
    time: '1 gün önce',
    author: 'Uzman Tavsiyeleri',
    icon: '💡',
  },
  {
    id: 3,
    type: 'success',
    title: 'Başarı Hikayesi',
    content:
      'Bu ay premium üyelerimiz profil görüntülenmelerinde ortalama %34 artış yaşadı. Siz de profilinizi optimize ederek daha fazla fırsata ulaşabilirsiniz.',
    time: '2 gün önce',
    author: 'İstatistik Raporu',
    icon: '📈',
  },
];

export default function DashboardPage() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Extract user info with fallbacks
  const userName = session?.user?.name || 'Kullanıcı';
  const userEmail = session?.user?.email || '';
  const userImage = session?.user?.image;

  // Extract first name for greeting
  const firstName = userName.split(' ')[0];

  // Loading state
  if (status === 'loading') {
    return (
      <DashboardLayout title="Dashboard">
        <div className="p-6 space-y-8" data-testid="dashboard-loading">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-96"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-8" data-testid="dashboard-content">
        {/* Welcome Banner */}
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
          data-testid="welcome-banner"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                data-testid="welcome-message"
              >
                Hoş Geldin, {firstName}! 👋
              </h1>
              <p className="text-blue-100 text-lg" data-testid="profile-stats">
                LinkedIn profilin son 7 günde %23 daha fazla görüntülendi
              </p>
              {userEmail && (
                <p
                  className="text-blue-200 text-sm mt-2"
                  data-testid="user-email"
                >
                  {userEmail}
                </p>
              )}
            </div>
            <div className="hidden md:block">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full border-4 border-white/20"
                  data-testid="user-avatar"
                />
              ) : (
                <div
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                  data-testid="user-avatar-placeholder"
                >
                  <svg
                    className="w-10 h-10 text-white"
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-testid="quick-actions"
        >
          {quickActions.map(action => (
            <button
              key={action.name}
              onClick={() => (window.location.href = action.href)}
              onMouseEnter={() => setHoveredAction(action.name)}
              onMouseLeave={() => setHoveredAction(null)}
              className={`group relative p-6 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              data-testid={`quick-action-${action.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <span className="font-semibold text-sm">{action.name}</span>
              </div>

              {hoveredAction === action.name && (
                <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-medium">Tıkla →</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-testid="stats-grid"
        >
          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            data-testid="profile-views-stat"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Profil Görüntülenme
                </p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+23% bu hafta</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            data-testid="connections-stat"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bağlantılar</p>
                <p className="text-3xl font-bold text-gray-900">567</p>
                <p className="text-sm text-green-600">+12 yeni</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            data-testid="profile-score-stat"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Profil Skoru
                </p>
                <p className="text-3xl font-bold text-gray-900">85/100</p>
                <p className="text-sm text-orange-600">+5 puan</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-xl shadow-lg p-6"
              data-testid="recent-activities"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Son Aktiviteler
              </h2>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow-lg p-6"
              data-testid="news-feed"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Feed</h2>
              <div className="space-y-6">
                {feedPosts.map(post => (
                  <div
                    key={post.id}
                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                    data-testid={`feed-post-${post.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{post.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{post.author}</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
