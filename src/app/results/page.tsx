'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSound } from '@/hooks/useSound';
import SocialShare from '@/components/SocialShare';
import Navbar from '@/components/Navbar';

export default function ResultsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const { playClickSound } = useSound();

  useEffect(() => {
    // Get score from localStorage
    const storedScore = localStorage.getItem('testScore');
    if (storedScore) {
      setScore(parseInt(storedScore));
    } else {
      // If no score found, redirect to home
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setShowScoreLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  const handleImprovement = () => {
    playClickSound();

    // If user is authenticated, redirect to dashboard
    if (session?.user) {
      router.push('/dashboard');
    } else {
      // If not authenticated, go to improvement page
      router.push('/improvement');
    }
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟';
    if (score >= 70) return 'Harika! Profiliniz oldukça iyi durumda! ✨';
    if (score >= 50)
      return 'İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈';
    return 'Profilinizi geliştirmek için önerilerimizi dikkate alın. 🎯';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar - Fixed height */}
      <div className="flex-none">
        <Navbar
          title="LinkedIn Profil Değerlendirme"
          subtitle="Sonuçlarınız ve öneriler"
          showBackButton={false}
          showRestartButton={true}
          maxWidth="3xl"
        />
      </div>

      {/* Results Content - Remaining viewport height with overflow control */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div className="w-full max-w-3xl h-full flex items-center justify-center">
          <div className="transform transition-all duration-300 hover:scale-[1.02] w-full">
            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl bg-white border border-gray-100 flex flex-col justify-center max-h-full overflow-y-auto">
              <div className="flex flex-col items-center space-y-3">
                {/* Score Visualization - Reduced height */}
                <div className="flex items-center justify-center">
                  {/* Score Bar */}
                  <div className="h-[250px] w-[50px] bg-gray-100 rounded-full relative overflow-hidden border border-gray-200">
                    <div
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-full transition-all duration-[3000ms] ease-out"
                      style={{ height: showScoreLoader ? '0%' : `${score}%` }}
                    />
                  </div>

                  {/* Grade Labels */}
                  <div className="h-[250px] w-[160px] relative ml-4 flex flex-col justify-between py-2">
                    {[
                      {
                        grade: 'S',
                        label: 'Profesyonel',
                        range: [85, 100],
                        color: 'text-blue-600 bg-blue-50',
                      },
                      {
                        grade: 'A',
                        label: 'Takibe Değer',
                        range: [70, 84],
                        color: 'text-red-600 bg-red-50',
                      },
                      {
                        grade: 'B',
                        label: 'Fena Değil',
                        range: [50, 69],
                        color: 'text-purple-600 bg-purple-50',
                      },
                      {
                        grade: 'C',
                        label: 'Ne iş Belli Değil',
                        range: [30, 49],
                        color: 'text-green-600 bg-green-50',
                      },
                      {
                        grade: 'D',
                        label: 'Sadece Var',
                        range: [0, 29],
                        color: 'text-orange-600 bg-orange-50',
                      },
                    ].map(item => {
                      const isActive =
                        score >= item.range[0] && score <= item.range[1];
                      return (
                        <div
                          key={item.grade}
                          className={`w-full flex items-center gap-2 font-bold transition-all duration-300 p-1.5 rounded-lg ${
                            isActive
                              ? `text-xl ${item.color} shadow-sm`
                              : 'text-lg text-gray-400'
                          }`}
                        >
                          <div className="min-w-[28px] text-center">
                            {item.grade}
                          </div>
                          <div
                            className={`${
                              isActive
                                ? 'text-base opacity-100'
                                : 'text-sm opacity-80'
                            }`}
                          >
                            {item.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Score Number */}
                <div className="relative">
                  {showScoreLoader && (
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin absolute left-1/2 transform -translate-x-1/2 mt-2" />
                  )}
                  <div
                    className={`text-5xl font-bold h-16 flex items-center justify-center text-gray-800 transition-opacity duration-300 ${
                      !showScoreLoader
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible'
                    }`}
                  >
                    {score}/100
                  </div>
                </div>

                {/* Score Message */}
                <p className="text-xl text-gray-600 text-center transition-opacity duration-500 delay-300">
                  {getScoreMessage(score)}
                </p>

                {/* Social Share */}
                <SocialShare />

                {/* Sign up recommendation for unauthenticated users */}
                {!session?.user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                      <div>
                        <h3 className="text-blue-900 font-semibold text-sm mb-1">
                          Sonuçlarınızı Kalıcı Olarak Saklayın
                        </h3>
                        <p className="text-blue-700 text-xs mb-3">
                          Test sonuçlarınız geçici olarak saklandı. Hesap
                          oluşturarak sonuçlarınızı kalıcı olarak saklayabilir
                          ve gelişim takibi yapabilirsiniz.
                        </p>
                        <button
                          onClick={() => router.push('/auth/signup')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Hesap Oluştur
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Improvement Button */}
                <button
                  onClick={handleImprovement}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl transition-all duration-300 
                      hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto hover:shadow-xl"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  İyileştir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
