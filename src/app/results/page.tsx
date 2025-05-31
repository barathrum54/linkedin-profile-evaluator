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
    <div className="sm:p-6 md:p-8 flex items-center justify-center">
      <div className="h-full w-full max-w-3xl">
        <div className="scale-in">
          <div className="card-container rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                <div className="score-container">
                  <div
                    className="score-fill"
                    style={
                      { "--score-height": `${score}%` } as React.CSSProperties
                    }
                  />
                </div>
                <div className="grade-container">
                  <div
                    className={`grade-marker ${score >= 85 ? "active" : ""}`}
                    data-grade="S"
                  >
                    <div className="grade-letter">S</div>
                    <div className="grade-label">Profesyonel</div>
                  </div>
                  <div
                    className={`grade-marker ${
                      score >= 70 && score < 85 ? "active" : ""
                    }`}
                    data-grade="A"
                  >
                    <div className="grade-letter">A</div>
                    <div className="grade-label">Takibe Değer</div>
                  </div>
                  <div
                    className={`grade-marker ${
                      score >= 50 && score < 70 ? "active" : ""
                    }`}
                    data-grade="B"
                  >
                    <div className="grade-letter">B</div>
                    <div className="grade-label">Fena Değil</div>
                  </div>
                  <div
                    className={`grade-marker ${
                      score >= 30 && score < 50 ? "active" : ""
                    }`}
                    data-grade="C"
                  >
                    <div className="grade-letter">C</div>
                    <div className="grade-label">Ne iş Belli Değil</div>
                  </div>
                  <div
                    className={`grade-marker ${score < 30 ? "active" : ""}`}
                    data-grade="D"
                  >
                    <div className="grade-letter">D</div>
                    <div className="grade-label">Sadece Var</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                {showScoreLoader && (
                  <div
                    className="loader"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                )}
                <div
                  className={`score-number ${
                    !showScoreLoader ? "visible" : ""
                  }`}
                >
                  {score}/100
                </div>
              </div>
              <p className="score-message">{getScoreMessage(score)}</p>
              <SocialShare />
              <button
                onClick={handleImprovement}
                className="gradient-bg text-white px-8 py-4 rounded-xl transition-all duration-300 
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
