"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

const settingsData = {
  profile: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    marketingEmails: false,
  },
  privacy: {
    profileVisibility: "public",
    dataSharing: false,
    analyticsTracking: true,
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(
    settingsData.notifications
  );
  const [privacy, setPrivacy] = useState(settingsData.privacy);

  const tabs = [
    { id: "profile", name: "Profil", icon: "👤" },
    { id: "notifications", name: "Bildirimler", icon: "🔔" },
    { id: "privacy", name: "Gizlilik", icon: "🔒" },
    { id: "security", name: "Güvenlik", icon: "🛡️" },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
              <p className="text-gray-300 text-lg">
                Hesap ve uygulama ayarlarınızı yönetin
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Profil Bilgileri
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          defaultValue={settingsData.profile.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta
                        </label>
                        <input
                          type="email"
                          defaultValue={settingsData.profile.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          defaultValue={settingsData.profile.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zaman Dilimi
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="America/New_York">
                            Eastern Time (UTC-5)
                          </option>
                          <option value="America/Chicago">
                            Central Time (UTC-6)
                          </option>
                          <option value="America/Denver">
                            Mountain Time (UTC-7)
                          </option>
                          <option value="America/Los_Angeles">
                            Pacific Time (UTC-8)
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-colors">
                        Değişiklikleri Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Bildirim Ayarları
                  </h2>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {key === "emailNotifications" &&
                              "E-posta Bildirimleri"}
                            {key === "pushNotifications" && "Push Bildirimleri"}
                            {key === "weeklyReport" && "Haftalık Rapor"}
                            {key === "marketingEmails" &&
                              "Pazarlama E-postaları"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === "emailNotifications" &&
                              "Önemli güncellemeler için e-posta alın"}
                            {key === "pushNotifications" &&
                              "Tarayıcı bildirimleri"}
                            {key === "weeklyReport" &&
                              "Haftalık performans raporu"}
                            {key === "marketingEmails" &&
                              "Ürün haberleri ve özel teklifler"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Gizlilik Ayarları
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Profil Görünürlüğü
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Profilinizin diğer kullanıcılar tarafından görünürlüğünü
                        kontrol edin
                      </p>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            profileVisibility: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="public">Herkese Açık</option>
                        <option value="private">Gizli</option>
                        <option value="connections">
                          Yalnızca Bağlantılar
                        </option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Veri Paylaşımı
                        </h3>
                        <p className="text-sm text-gray-600">
                          Analiz için anonim veri paylaşımına izin ver
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.dataSharing}
                          onChange={(e) =>
                            setPrivacy((prev) => ({
                              ...prev,
                              dataSharing: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Analitik Takibi
                        </h3>
                        <p className="text-sm text-gray-600">
                          Uygulama kullanımı analitiklerine izin ver
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.analyticsTracking}
                          onChange={(e) =>
                            setPrivacy((prev) => ({
                              ...prev,
                              analyticsTracking: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Güvenlik Ayarları
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Şifre Değiştir
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Hesabınızın güvenliği için düzenli olarak şifrenizi
                        değiştirin
                      </p>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Mevcut şifre"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Yeni şifre"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Yeni şifre (tekrar)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-colors">
                          Şifreyi Güncelle
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h3 className="font-medium text-red-800 mb-2">
                        Hesabı Sil
                      </h3>
                      <p className="text-sm text-red-600 mb-4">
                        Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak
                        silinecektir.
                      </p>
                      <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-colors">
                        Hesabı Sil
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
