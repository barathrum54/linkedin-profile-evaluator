"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSound } from "@/hooks/useSound";
import SocialShare from "@/components/SocialShare";

export default function ResultsPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const { playClickSound } = useSound();

  useEffect(() => {
    // Get score from localStorage
    const storedScore = localStorage.getItem("testScore");
    if (storedScore) {
      setScore(parseInt(storedScore));
    } else {
      // If no score found, redirect to home
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setShowScoreLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  const handleImprovement = () => {
    playClickSound();
    router.push("/improvement");
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟";
    if (score >= 70) return "Harika! Profiliniz oldukça iyi durumda! ✨";
    if (score >= 50)
      return "İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈";
    return "Profilinizi geliştirmek için önerilerimizi dikkate alın. 🎯";
  };

  return (
    <div className="fixed inset-0 sm:relative sm:w-auto sm:h-auto sm:p-6 md:p-8 flex items-center justify-center bg-white">
      <div className="h-full w-full sm:max-w-3xl">
        <div className="animate-pulse-subtle h-full">
          <div className="rounded-none sm:rounded-2xl p-6 sm:p-8 shadow-none sm:shadow-xl h-full flex flex-col justify-center bg-white border-0 sm:border border-gray-100">
            <div className="flex flex-col items-center space-y-4  ">
              {/* Score Visualization */}
              <div className="flex items-center justify-center">
                {/* Score Bar */}
                <div className="h-[300px] w-[60px] bg-gray-100 rounded-full relative overflow-hidden border border-gray-200">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-full transition-all duration-[3000ms] ease-out"
                    style={{ height: showScoreLoader ? "0%" : `${score}%` }}
                  />
                </div>

                {/* Grade Labels */}
                <div className="h-[300px] w-[180px] relative ml-5 flex flex-col justify-between py-2.5">
                  {[
                    {
                      grade: "S",
                      label: "Profesyonel",
                      range: [85, 100],
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      grade: "A",
                      label: "Takibe Değer",
                      range: [70, 84],
                      color: "text-red-600 bg-red-50",
                    },
                    {
                      grade: "B",
                      label: "Fena Değil",
                      range: [50, 69],
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      grade: "C",
                      label: "Ne iş Belli Değil",
                      range: [30, 49],
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      grade: "D",
                      label: "Sadece Var",
                      range: [0, 29],
                      color: "text-orange-600 bg-orange-50",
                    },
                  ].map((item) => {
                    const isActive =
                      score >= item.range[0] && score <= item.range[1];
                    return (
                      <div
                        key={item.grade}
                        className={`w-full flex items-center gap-3 font-bold transition-all duration-300 p-2 rounded-lg ${
                          isActive
                            ? `text-2xl ${item.color} shadow-sm`
                            : "text-xl text-gray-400"
                        }`}
                      >
                        <div className="min-w-[32px] text-center">
                          {item.grade}
                        </div>
                        <div
                          className={`${
                            isActive
                              ? "text-lg opacity-100"
                              : "text-base opacity-80"
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
                  <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin absolute left-1/2 transform -translate-x-1/2 mt-4" />
                )}
                <div
                  className={`text-6xl font-bold h-20 flex items-center justify-center text-gray-800 transition-opacity duration-300 ${
                    !showScoreLoader
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  {score}/100
                </div>
              </div>

              {/* Score Message */}
              <p className="text-2xl text-gray-600 text-center animate-fade-in-up">
                {getScoreMessage(score)}
              </p>

              {/* Social Share */}
              <SocialShare />

              {/* Improvement Button */}
              <button
                onClick={handleImprovement}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-xl transition-all duration-300 
                    hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
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
  );
}
