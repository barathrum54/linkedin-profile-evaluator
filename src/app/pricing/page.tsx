"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";

export default function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(
    null
  );

  const handleSelectPlan = (plan: "basic" | "premium") => {
    setSelectedPlan(plan);

    // Check if user is authenticated
    if (status === "loading") {
      return; // Wait for session to load
    }

    if (!session) {
      // Redirect to sign-in with plan selection in callback URL
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(
          `/payment?plan=${plan}`
        )}`
      );
    } else {
      // User is authenticated, proceed to payment
      router.push(`/payment?plan=${plan}`);
    }
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
                    <span className="text-gray-700">PDF formatında rapor</span>
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
                    <span className="text-gray-700">E-posta desteği</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSelectPlan("basic")}
                  className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105"
                >
                  Temel Planı Seç
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
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  En Popüler
                </span>
              </div>

              <div className="p-8 flex flex-col justify-between h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Premium Plan
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      $20
                    </span>
                    <span className="text-gray-500">/tek seferlik</span>
                  </div>
                  <p className="text-gray-600">
                    Profesyonel LinkedIn başarısı için eksiksiz paket
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
                      <strong>Temel plandaki tüm özellikler</strong>
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
                      1-1 video konsültasyon (30 dk)
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
                      Kişiselleştirilmiş içerik stratejisi
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
                      LinkedIn banner tasarım şablonları (10 adet)
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
                      30 günlük takip ve destek
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
                      Özel WhatsApp destek grubu
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
                      Aylık güncellemeler ve yeni özellikler
                    </span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSelectPlan("premium")}
                  className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 hover:from-pink-200 hover:to-purple-200 hover:scale-105"
                >
                  Premium Planı Seç
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Sıkça Sorulan Sorular
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Ödeme güvenli mi?
                </h4>
                <p className="text-gray-600">
                  Evet, tüm ödemeler SSL şifreleme ile korunmaktadır. Kredi
                  kartı bilgileriniz güvenle saklanır.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Para iade garantisi nasıl çalışır?
                </h4>
                <p className="text-gray-600">
                  7 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı
                  iade ediyoruz.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Hangi plan benim için uygun?
                </h4>
                <p className="text-gray-600">
                  Temel plan profil optimizasyonu için yeterlidir. Premium plan
                  ise kişiselleştirilmiş rehberlik ve sürekli destek isteyenler
                  içindir.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">
                Hala Kararsız mısınız?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                LinkedIn profilinizi profesyonel seviyeye taşımak için bugün
                harekete geçin!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleSelectPlan("basic")}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Temel Planla Başla
                </button>
                <button
                  onClick={() => handleSelectPlan("premium")}
                  className="bg-purple-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-900 transition-colors"
                >
                  Premium&apos;u Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Structured Data for Pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: "LinkedIn Profil Analizi - Temel Plan",
              description:
                "LinkedIn profilinizi optimize etmek için temel araçlar. Detaylı analiz raporu, özel öneriler ve profil şablonları.",
              brand: {
                "@type": "Brand",
                name: "LinkedIn Profil Değerlendirici",
              },
              offers: {
                "@type": "Offer",
                url: "https://linkedinprofileprofiler.com/pricing",
                priceCurrency: "USD",
                price: "5.00",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
                validFrom: "2024-01-01",
                seller: {
                  "@type": "Organization",
                  name: "LinkedIn Profil Değerlendirici",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.7",
                reviewCount: "89",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: "LinkedIn Profil Analizi - Premium Plan",
              description:
                "Kişiselleştirilmiş LinkedIn profil optimizasyonu. 1-1 konsültasyon, özel strateji ve sürekli destek.",
              brand: {
                "@type": "Brand",
                name: "LinkedIn Profil Değerlendirici",
              },
              offers: {
                "@type": "Offer",
                url: "https://linkedinprofileprofiler.com/pricing",
                priceCurrency: "USD",
                price: "20.00",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
                validFrom: "2024-01-01",
                seller: {
                  "@type": "Organization",
                  name: "LinkedIn Profil Değerlendirici",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "156",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Ödeme güvenli mi?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Evet, tüm ödemeler SSL şifreleme ile korunmaktadır. Kredi kartı bilgileriniz güvenle saklanır.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Para iade garantisi nasıl çalışır?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "7 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Hangi plan benim için uygun?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Temel plan profil optimizasyonu için yeterlidir. Premium plan ise kişiselleştirilmiş rehberlik ve sürekli destek isteyenler içindir.",
                  },
                },
              ],
            },
          ]),
        }}
      />
    </>
  );
}
