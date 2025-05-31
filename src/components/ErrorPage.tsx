"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
}

const errorConfigs = {
  400: {
    title: "Geçersiz İstek",
    message: "Gönderdiğiniz istek geçersiz. Lütfen tekrar deneyin.",
    icon: "⚠️",
    color: "orange",
  },
  401: {
    title: "Yetkilendirme Gerekli",
    message: "Bu sayfaya erişebilmek için giriş yapmanız gerekiyor.",
    icon: "🔐",
    color: "red",
  },
  403: {
    title: "Erişim Reddedildi",
    message: "Bu sayfaya erişim izniniz bulunmuyor.",
    icon: "🚫",
    color: "red",
  },
  404: {
    title: "Sayfa Bulunamadı",
    message: "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
    icon: "🔍",
    color: "blue",
  },
  500: {
    title: "Sunucu Hatası",
    message: "Bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    icon: "⚡",
    color: "red",
  },
  503: {
    title: "Hizmet Kullanılamıyor",
    message: "Servis şu anda bakımdadır. Lütfen daha sonra tekrar deneyin.",
    icon: "🔧",
    color: "yellow",
  },
};

export default function ErrorPage({
  statusCode = 404,
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = false,
}: ErrorPageProps) {
  const router = useRouter();

  const config =
    errorConfigs[statusCode as keyof typeof errorConfigs] || errorConfigs[404];
  const errorTitle = title || config.title;
  const errorMessage = message || config.message;

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: "from-red-50 via-white to-red-50",
          icon: "bg-red-500",
          button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
          accent: "text-red-600",
        };
      case "orange":
        return {
          bg: "from-orange-50 via-white to-orange-50",
          icon: "bg-orange-500",
          button:
            "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
          accent: "text-orange-600",
        };
      case "yellow":
        return {
          bg: "from-yellow-50 via-white to-yellow-50",
          icon: "bg-yellow-500",
          button:
            "from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800",
          accent: "text-yellow-600",
        };
      case "blue":
      default:
        return {
          bg: "from-blue-50 via-white to-indigo-50",
          icon: "bg-blue-500",
          button:
            "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
          accent: "text-blue-600",
        };
    }
  };

  const colors = getColorClasses(config.color);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Layout
      className={`bg-gradient-to-br ${colors.bg}`}
      navbarProps={{
        title: "Bir Hata Oluştu",
        subtitle: "Size yardımcı olmaya çalışıyoruz",
        showBackButton: false,
        showRestartButton: false,
        maxWidth: "4xl",
      }}
      contentClassName="overflow-auto"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Animation */}
          <div className="relative mb-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-96 h-96 ${colors.icon} opacity-5 rounded-full animate-pulse`}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-64 h-64 ${colors.icon} opacity-10 rounded-full animate-ping`}
                style={{ animationDuration: "3s" }}
              ></div>
            </div>

            {/* Main error display */}
            <div className="relative z-10">
              {/* Error Code */}
              <div className="mb-8">
                <span
                  className={`text-8xl md:text-9xl font-bold ${colors.accent} opacity-20`}
                >
                  {statusCode}
                </span>
              </div>

              {/* Error Icon */}
              <div
                className={`w-24 h-24 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce`}
              >
                <span className="text-4xl">{config.icon}</span>
              </div>

              {/* Error Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {errorTitle}
              </h1>

              {/* Error Message */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                {errorMessage}
              </p>
            </div>
          </div>

          {/* Helpful Tips Card */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ne Yapabilirsiniz?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Biraz Bekleyin
                </h3>
                <p className="text-sm text-gray-600">
                  Geçici bir sorun olabilir. Birkaç dakika sonra tekrar deneyin.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  URL&apos;yi Kontrol Edin
                </h3>
                <p className="text-sm text-gray-600">
                  Adres çubuğundaki URL&apos;nin doğru yazıldığından emin olun.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ana Sayfaya Dönün
                </h3>
                <p className="text-sm text-gray-600">
                  Ana sayfadan başlayarak aradığınızı bulabilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {showHomeButton && (
              <button
                onClick={() => router.push("/")}
                className={`bg-gradient-to-r ${colors.button} text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                🏠 Ana Sayfaya Dön
              </button>
            )}

            {showBackButton && (
              <button
                onClick={handleBack}
                className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-50 hover:scale-105 shadow-md hover:shadow-lg"
              >
                ← Geri Dön
              </button>
            )}

            {showRefreshButton && (
              <button
                onClick={handleRefresh}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🔄 Sayfayı Yenile
              </button>
            )}
          </div>

          {/* Contact Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Hala Sorun mu Yaşıyorsunuz?
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Bu hatanın devam etmesi durumunda destek ekibimizle iletişime
                  geçebilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:destek@linkedinprofil.com"
                    className="inline-flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-800 font-medium"
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    destek@linkedinprofil.com
                  </a>
                  <span className="text-sm text-yellow-600">
                    📞 Yanıt süresi: 24 saat içinde
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
