"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(
    null
  );

  const handleSelectPlan = (plan: "basic" | "premium") => {
    setSelectedPlan(plan);

    // For now, redirect to sign-in with plan selection
    // This can be enhanced later with proper session management
    router.push(
      `/auth/signin?callbackUrl=${encodeURIComponent(`/payment?plan=${plan}`)}`
    );
  };

  return (
    <>
      <Layout
        className="bg-gradient-to-br from-purple-50 via-white to-pink-50"
        navbarProps={{
          title: "Premium Özellikler",
          subtitle: "LinkedIn başarınızı bir üst seviyeye taşıyın",
          showBackButton: true,
          showRestartButton: true,
          backRoute: "/improvement",
          maxWidth: "4xl",
        }}
        contentClassName="overflow-auto"
      >
        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Bu İşin Sırrını Öğren
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              LinkedIn profilinizi profesyonel seviyeye taşıyacak özel
              stratejiler, şablonlar ve kişiselleştirilmiş rehberlik ile
              başarıya ulaşın.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
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
                <span>7 gün para iade garantisi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
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
                <span>Anında erişim</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                selectedPlan === "basic"
                  ? "border-purple-500 scale-105"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="p-8 flex flex-col justify-between h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Temel Plan
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-purple-600">
                      $5
                    </span>
                    <span className="text-gray-500">/tek seferlik</span>
                  </div>
                  <p className="text-gray-600">
                    LinkedIn profilinizi optimize etmek için temel araçlar
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Detaylı profil analiz raporu
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      12 kritik alan için özel öneriler
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Profil başlığı şablonları (5 adet)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Hakkında bölümü rehberi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">Email desteği</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSelectPlan("basic")}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    selectedPlan === "basic"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {selectedPlan === "basic" ? "Seçildi ✓" : "Planı Seç"}
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                selectedPlan === "premium"
                  ? "border-pink-500 scale-105"
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  En Popüler
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Premium Plan
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-pink-600">
                      $15
                    </span>
                    <span className="text-gray-500">/tek seferlik</span>
                  </div>
                  <p className="text-gray-600">
                    Kapsamlı LinkedIn stratejisi ve kişiselleştirilmiş rehberlik
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      <strong>Temel Plan&apos;daki tüm özellikler</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Kişiselleştirilmiş LinkedIn stratejisi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Profil başlığı şablonları (20+ adet)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      İçerik stratejisi ve paylaşım takvimi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Networking stratejileri rehberi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      1-1 danışmanlık seansı (30 dk)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                    <span className="text-gray-700">
                      Öncelikli email desteği
                    </span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSelectPlan("premium")}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    selectedPlan === "premium"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:from-pink-200 hover:to-purple-200"
                  }`}
                >
                  {selectedPlan === "premium" ? "Seçildi ✓" : "Planı Seç"}
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Neler Alacaksınız?
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
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
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Kanıtlanmış Stratejiler
                </h4>
                <p className="text-gray-600">
                  Binlerce profesyonelin başarıyla kullandığı, test edilmiş
                  LinkedIn optimizasyon teknikleri
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-pink-600"
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
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Hızlı Sonuçlar
                </h4>
                <p className="text-gray-600">
                  İlk 24 saat içinde profilinizde görünür iyileştirmeler ve
                  artan profil görüntülenmeleri
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Uzman Rehberliği
                </h4>
                <p className="text-gray-600">
                  LinkedIn uzmanları tarafından hazırlanmış, adım adım
                  uygulayabileceğiniz rehberler
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Müşteri Yorumları
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  &quot;LinkedIn profilim tamamen değişti! İlk hafta içinde 3 iş
                  teklifi aldım. Bu rehberler gerçekten işe yarıyor.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">AK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ahmet Kaya</p>
                    <p className="text-sm text-gray-600">Yazılım Geliştirici</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  &quot;Profil görüntülenmelerim %400 arttı! Networking
                  stratejileri sayesinde sektörümde tanınır hale geldim.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-pink-600 font-semibold">EY</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Elif Yılmaz</p>
                    <p className="text-sm text-gray-600">Pazarlama Uzmanı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Sıkça Sorulan Sorular
            </h3>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Bu rehberler gerçekten işe yarıyor mu?
                </h4>
                <p className="text-gray-700">
                  Evet! Binlerce profesyonel bu stratejileri kullanarak
                  LinkedIn&apos;de başarı elde etti. Ortalama %300 profil
                  görüntülenme artışı ve %150 daha fazla iş fırsatı
                  garantiliyoruz.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Ne kadar sürede sonuç alırım?
                </h4>
                <p className="text-gray-700">
                  Çoğu kullanıcımız ilk 24-48 saat içinde profil
                  görüntülenmelerinde artış görüyor. Tam optimizasyon için 1-2
                  hafta süre ayırmanızı öneriyoruz.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Para iade garantisi var mı?
                </h4>
                <p className="text-gray-700">
                  Evet! 7 gün içinde memnun kalmazsanız, hiçbir soru sormadan
                  paranızı iade ediyoruz. Başarınızdan o kadar eminiz.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">
                LinkedIn Başarınız Bir Tık Uzakta!
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Bugün başlayın, yarın farkı görün. Binlerce profesyonelin tercih
                ettiği sisteme katılın.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Anında erişim</span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>7 gün garanti</span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uzman desteği</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
