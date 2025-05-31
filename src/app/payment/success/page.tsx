"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";

const plans = {
  basic: {
    name: "Temel Plan",
    price: 5,
    color: "purple",
  },
  premium: {
    name: "Premium Plan",
    price: 20,
    color: "pink",
  },
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && plans[plan as keyof typeof plans]) {
      setSelectedPlan(plan);
    } else {
      router.push("/pricing");
    }

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  if (!selectedPlan || !plans[selectedPlan as keyof typeof plans]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const plan = plans[selectedPlan as keyof typeof plans];

  return (
    <Layout
      className="bg-gradient-to-br from-green-50 via-white to-emerald-50"
      navbarProps={{
        title: "Ödeme Başarılı!",
        subtitle: "Satın alımınız tamamlandı",
        showBackButton: false,
        showRestartButton: true,
        maxWidth: "4xl",
      }}
      contentClassName="overflow-auto"
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  Math.random() > 0.5
                    ? "bg-yellow-400"
                    : Math.random() > 0.5
                    ? "bg-pink-400"
                    : "bg-blue-400"
                } transform rotate-45`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tebrikler! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {plan.name} satın alımınız başarıyla tamamlandı!
            </p>
            <p className="text-lg text-gray-500">
              Ödeme tutarı:{" "}
              <span className="font-semibold">
                ${(plan.price * 1.18).toFixed(2)}
              </span>
            </p>
          </div>

          {/* Purchase Details Card */}
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-16 h-16 ${
                  plan.color === "purple" ? "bg-purple-500" : "bg-pink-500"
                } rounded-2xl flex items-center justify-center`}
              >
                <svg
                  className="w-8 h-8 text-white"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {plan.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Profilinizi bir sonraki seviyeye taşımak için gerekli tüm araçlara
              artık sahipsiniz!
            </p>

            {/* Next Steps */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 rounded-xl p-6">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  E-posta Kontrolü
                </h3>
                <p className="text-sm text-gray-600">
                  Satın aldığınız içeriklere erişim bilgileri e-posta adresinize
                  gönderildi.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rehbere Başla
                </h3>
                <p className="text-sm text-gray-600">
                  İyileştirme rehberinizi tekrar gözden geçirin ve önerilerimizi
                  uygulamaya başlayın.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push("/improvement")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Rehberi Görüntüle
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-50 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Ana Sayfaya Dön
            </button>
          </div>

          {/* Support Information */}
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Destek Bilgileri
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa
                  bizimle iletişime geçebilirsiniz:
                </p>
                <div className="space-y-2 text-sm text-yellow-700">
                  <div className="flex items-center gap-2">
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
                    <span>destek@linkedinprofil.com</span>
                  </div>
                  <div className="flex items-center gap-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Yanıt süresi: 24 saat içinde</span>
                  </div>
                  {selectedPlan === "premium" && (
                    <div className="flex items-center gap-2">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>Premium WhatsApp desteği yakında aktif olacak</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm font-medium">
                7 gün para iade garantisi
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
