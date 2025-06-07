'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactElement;
  badge?: string;
  description?: string;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="nav-dashboard-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z"
        />
      </svg>
    ),
    description: 'Ana sayfa ve feed',
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="nav-profile-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    description: 'Profil yönetimi ve analizi',
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="nav-billing-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    description: 'Faturalama ve abonelik',
  },
  {
    name: 'Main Course',
    href: '/dashboard/course',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="nav-course-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    badge: 'Yakında',
    description: 'Ana eğitim kursu',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-testid="nav-settings-icon"
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
    description: 'Hesap ve uygulama ayarları',
  },
  // Add debug menu item only in development
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          name: 'Debug',
          href: '/dashboard/debug',
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-testid="nav-debug-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          badge: 'DEV',
          description: 'Debug bilgileri ve veritabanı görünümü',
        },
      ]
    : []),
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Extract user info with fallbacks
  const userName = session?.user?.name || 'Kullanıcı';
  const userEmail = session?.user?.email || '';
  const userImage = session?.user?.image;

  const isCurrentPage = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Loading state for session
  if (status === 'loading') {
    return (
      <div
        className="h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        data-testid="dashboard-layout-loading"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      data-testid="dashboard-layout"
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div
            className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            data-testid="sidebar-header"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
                data-testid="app-logo"
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold" data-testid="app-name">
                LinkedIn Pro
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
              data-testid="sidebar-close-button"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info Section */}
          <div
            className="p-4 border-b border-gray-200"
            data-testid="user-info-section"
          >
            <div className="flex items-center space-x-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-10 h-10 rounded-full"
                  data-testid="sidebar-user-avatar"
                />
              ) : (
                <div
                  className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                  data-testid="sidebar-user-avatar-placeholder"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
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
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-gray-900 truncate"
                  data-testid="sidebar-user-name"
                >
                  {userName}
                </p>
                <p
                  className="text-xs text-gray-500 truncate"
                  data-testid="sidebar-user-email"
                >
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
            data-testid="sidebar-navigation"
          >
            {navigation.map(item => {
              const isActive = isCurrentPage(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  data-testid={`nav-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-blue-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.badge && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                          data-testid={`nav-badge-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p
                        className={`text-xs mt-1 ${
                          isActive ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div
            className="p-4 border-t border-gray-200"
            data-testid="logout-section"
          >
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="logout-button"
            >
              <div className="flex-shrink-0">
                {isLoggingOut ? (
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-testid="logout-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
                </p>
                <p className="text-xs text-gray-500">
                  Hesabından güvenli çıkış
                </p>
              </div>
            </button>
          </div>

          {/* Premium Status */}
          <div
            className="p-4 border-t border-gray-200"
            data-testid="premium-status"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                  data-testid="premium-icon"
                >
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <p
                    className="text-sm font-medium text-green-800"
                    data-testid="premium-status-text"
                  >
                    Premium Üye
                  </p>
                  <p
                    className="text-xs text-green-600"
                    data-testid="premium-features-text"
                  >
                    Tüm özelliklere erişim
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-testid="main-content">
        {/* Mobile Header */}
        <div
          className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur border-b border-gray-200"
          data-testid="mobile-header"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            data-testid="sidebar-open-button"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1
            className="text-lg font-semibold text-gray-900"
            data-testid="mobile-header-title"
          >
            {title || 'Dashboard'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto" data-testid="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}
