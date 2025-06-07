'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface TestResult {
  _id: string;
  userId: string;
  userEmail: string;
  score: number;
  answers: (number | null)[];
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-results');
        const data = await response.json();

        if (response.ok) {
          setTestResult(data.data);
        } else {
          console.error(
            'Failed to fetch test results:',
            data.error || 'Unknown error'
          );
        }
      } catch (err) {
        console.error('Error fetching test results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTestResult();
    }
  }, [session]);

  // Add a key that changes when session changes to force re-fetch
  const componentKey = session?.user?.email || 'no-session';

  // Additional effect to refresh data when component becomes visible (e.g., after auth redirect)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session) {
        // Re-fetch when page becomes visible again
        const fetchTestResult = async () => {
          try {
            const response = await fetch('/api/test-results');
            const data = await response.json();
            if (response.ok) {
              setTestResult(data.data);
            }
          } catch (err) {
            console.error('Error refreshing test results:', err);
          }
        };
        fetchTestResult();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, componentKey]);

  const handleRetakeTest = () => {
    router.push('/test');
  };

  // Mock data for when user has test results - we'll calculate this from actual answers later
  const getProfileData = (score: number) => {
    return {
      score,
      completionRate: Math.min(100, score + 10), // Mock completion rate
      strengths: [
        {
          title: 'Profesyonel Başlık',
          score: Math.min(100, score + 10),
          description: 'LinkedIn başlığınız analiz edildi',
        },
        {
          title: 'Özet Bölümü',
          score: Math.max(60, score - 5),
          description: 'Kişisel özetiniz değerlendirildi',
        },
        {
          title: 'Deneyim Detayları',
          score: Math.max(50, score - 10),
          description: 'İş deneyimleriniz analiz edildi',
        },
      ],
      improvements: [
        {
          title: 'Beceri Listesi',
          priority: score < 70 ? 'high' : 'medium',
          description: 'Daha fazla beceri eklemeniz önerilir',
        },
        {
          title: 'Öneri Sayısı',
          priority: 'medium',
          description: 'Daha fazla öneri almanız faydalı olacak',
        },
        {
          title: 'Profil Fotoğrafı',
          priority: 'low',
          description: 'Daha profesyonel bir fotoğraf kullanabilirsiniz',
        },
      ],
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="p-6 space-y-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No test data - show call to action
  if (!testResult) {
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
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-blue-100">Analiz Bekleniyor</p>
              </div>
            </div>
          </div>

          {/* No Test Data - Call to Action */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Henüz Profil Analizi Yapılmadı
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                LinkedIn profilinizin detaylı analizini görmek için önce profil
                değerlendirme testini tamamlamanız gerekiyor.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Profil Analizi ile Neler Öğreneceksiniz?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Güçlü Yönleriniz
                      </h4>
                      <p className="text-sm text-blue-700">
                        Profilinizde öne çıkan alanlar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        İyileştirme Alanları
                      </h4>
                      <p className="text-sm text-blue-700">
                        Geliştirebileceğiniz bölümler
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Profil Skoru
                      </h4>
                      <p className="text-sm text-blue-700">
                        Genel performans değerlendirmesi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Öncelik Sıralaması
                      </h4>
                      <p className="text-sm text-blue-700">
                        Hangi alanları önce geliştirmeli
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRetakeTest}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Profil Analizini Başlat
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // User has test data - show analysis results
  const profileData = getProfileData(testResult.score);

  return (
    <DashboardLayout title="Profile">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profil Analizi</h1>
              <p className="text-blue-100 text-lg">
                Son analiz:{' '}
                {new Date(testResult.completedAt).toLocaleDateString('tr-TR')}
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
                    strokeDasharray={`${testResult.score * 2.51} ${100 * 2.51}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {testResult.score}
                  </span>
                </div>
              </div>
              <p className="text-blue-100">Profil Skoru</p>
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleRetakeTest}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Yeniden Analiz Et
            </button>
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
                      {improvement.priority === 'high'
                        ? 'Yüksek'
                        : improvement.priority === 'medium'
                          ? 'Orta'
                          : 'Düşük'}{' '}
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
      </div>
    </DashboardLayout>
  );
}
