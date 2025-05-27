"use client";

import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { questionsData } from "@/data/questions";
import SocialShare from "./SocialShare";

function ImageModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
        <button
          className="absolute top-2 right-2 text-black bg-white text-2xl font-bold rounded-full h-8 w-8 opacity-80 flex items-center justify-center"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Helper function to get label based on slider value
const getSliderLabel = (value: number): string => {
  if (value >= 0 && value <= 19) return "Henüz Üzerinde Çalışmadım";
  if (value >= 20 && value <= 39) return "Eksik ve Gelişime Açık";
  if (value >= 40 && value <= 59) return "Temel Seviyede Hazır";
  if (value >= 60 && value <= 79) return "Gözden Geçirilmiş ve Düzenli";
  if (value >= 80 && value <= 100) return "Stratejik ve Etkileyici";
  return "";
};

// Helper function to convert slider value to multiplier for scoring
const getMultiplierFromSliderValue = (value: number): number => {
  if (value >= 0 && value <= 19) return 0.2;
  if (value >= 20 && value <= 39) return 0.4;
  if (value >= 40 && value <= 59) return 0.6;
  if (value >= 60 && value <= 79) return 0.8;
  if (value >= 80 && value <= 100) return 1.0;
  return 0;
};

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const { playClickSound } = useSound();

  useEffect(() => {
    if (isTestFinished) {
      const timer = setTimeout(() => {
        setShowScoreLoader(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTestFinished]);

  const handleRestart = () => {
    playClickSound();
    setCurrentQuestion(0);
    setAnswers(new Array(questionsData.length).fill(null));
    setScore(0);
    setShowScoreLoader(true);
    setIsTestFinished(false);
  };

  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    playClickSound();
    // Calculate score with multipliers
    const newScore = answers.reduce(
      (total: number, ans: number | null, idx: number) => {
        if (ans === null) return total;
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );
    setScore(Math.ceil(newScore));

    // Check if this is the last question and set isTestFinished accordingly
    if (currentQuestion === questionsData.length - 1) {
      setIsTestFinished(true);
    } else {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟";
    if (score >= 70) return "Harika! Profiliniz oldukça iyi durumda! ✨";
    if (score >= 50)
      return "İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈";
    return "Profilinizi geliştirmek için önerilerimizi dikkate alın. 🎯";
  };

  if (isTestFinished) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="scale-in">
            <div className="card-container rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-8">
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
                  onClick={handleRestart}
                  className="mt-8 gradient-bg text-white px-8 py-4 rounded-xl transition-all duration-300 
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Tekrar Başla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-8 flex items-center justify-center">
      {/* Container for two-column layout on large screens */}
      <div className="w-full max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
        {/* First column: Correct and incorrect images */}
        <div className="flex flex-col gap-6 mb-6 lg:mb-0">
          {/* Correct Example */}
          <div
            className="relative w-full bg-white rounded-xl shadow-lg overflow-visible cursor-pointer"
            onClick={() =>
              setModalImg(questionsData[currentQuestion].correctImage)
            }
          >
            <img
              src={questionsData[currentQuestion].correctImage}
              alt="Doğru örnek"
              className="w-full h-auto object-contain rounded-lg"
            />
            <img
              src="/images/checkmark.png"
              alt="Doğru"
              className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
            />
          </div>
          {/* Incorrect Example */}
          <div
            className="relative w-full bg-white rounded-xl shadow-lg overflow-visible cursor-pointer"
            onClick={() =>
              setModalImg(questionsData[currentQuestion].wrongImage)
            }
          >
            <img
              src={questionsData[currentQuestion].wrongImage}
              alt="Yanlış örnek"
              className="w-full h-auto object-contain rounded-lg"
            />
            <img
              src="/images/cross.png"
              alt="Yanlış"
              className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
            />
          </div>
        </div>
        {/* Second column: Question card */}
        <div className="flex justify-center">
          <div className="fade-in w-full max-w-[350px] lg:max-w-[500px]">
            <div className="bg-[#4a90c2] rounded-[16px] p-4 lg:p-8 shadow-xl flex flex-col items-center lg:h-full">
              <div className="flex-grow w-full flex flex-col items-center lg:justify-between">
                <div className="mb-4 w-full">
                  <p className="text-white text-sm lg:text-2xl font-medium leading-tight">
                    {questionsData[currentQuestion].question}
                  </p>
                </div>
                <div className="flex flex-col gap-4 w-full mb-4">
                  {/* Numeric Score Display */}
                  <div className="text-center">
                    <div className="text-white text-4xl lg:text-6xl font-bold mb-2">
                      {answers[currentQuestion] || 0}
                    </div>
                    <div className="text-white text-xs lg:text-sm opacity-80">
                      Score
                    </div>
                  </div>
                  
                  {/* Slider */}
                  <div className="flex items-center gap-3 w-full px-2">
                    <span className="text-white text-xs lg:text-sm opacity-70 min-w-[20px]">0</span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={answers[currentQuestion] || 0}
                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                        className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ffffff ${answers[currentQuestion] || 0}%, rgba(255,255,255,0.3) ${answers[currentQuestion] || 0}%)`
                        }}
                      />
                    </div>
                    <span className="text-white text-xs lg:text-sm opacity-70 min-w-[30px]">100</span>
                  </div>
                  
                  {/* Dynamic Label */}
                  <div className="text-center">
                    <div className="text-white text-base lg:text-xl font-medium bg-transparent bg-opacity-20 rounded-lg py-2 px-4">
                      {getSliderLabel(answers[currentQuestion] || 0)}
                    </div>
                  </div>
                </div>
                <button
                  className={`w-full py-2 sm:py-1 rounded-[20px] text-xs lg:text-3xl font-normal mt-1 transition-all duration-200
                      ${
                        answers[currentQuestion] !== null
                          ? "bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]"
                          : "bg-[#e3f1fb] text-blue-200 cursor-not-allowed"
                      }`}
                  onClick={handleSubmit}
                  disabled={answers[currentQuestion] === null}
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for image viewing */}
      {modalImg && (
        <ImageModal
          src={modalImg}
          alt="Örnek"
          onClose={() => setModalImg(null)}
        />
      )}
      {/* End screen (score/result) */}
      {isTestFinished && (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
          <div className="bg-white rounded-[16px] shadow-xl max-w-[350px] w-full text-center p-8">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">Sonuç</h2>
              <div className="text-5xl font-bold text-blue-600">
                {score}/100
              </div>
              <p className="text-lg text-gray-700">{getScoreMessage(score)}</p>
              <button
                onClick={handleRestart}
                className="w-full bg-blue-500 text-white px-8 py-4 rounded-[20px] text-lg font-semibold transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 shadow-lg"
              >
                Tekrar Başla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
