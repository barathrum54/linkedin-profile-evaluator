"use client";

import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { questionsData, ratingScale, RatingScale } from "@/data/questions";
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

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const { playClickSound } = useSound();

  const isComplete =
    currentQuestion === questionsData.length - 1 &&
    answers[currentQuestion] !== null;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShowScoreLoader(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleRestart = () => {
    playClickSound();
    setCurrentQuestion(0);
    setAnswers(new Array(questionsData.length).fill(null));
    setScore(0);
    setShowScoreLoader(true);
  };

  const handleAnswer = (rating: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = rating;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    } else {
      setShowScoreLoader(false);
    }
    // Calculate score with multipliers
    const newScore = answers.reduce(
      (total: number, ans: number | null, idx: number) => {
        if (ans === null) return total;
        const rating: RatingScale | undefined = ratingScale.find(
          (r) => r.value === ans
        );
        return total + questionsData[idx].score * (rating?.multiplier || 0);
      },
      0
    );
    setScore(Math.ceil(newScore));
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟";
    if (score >= 70) return "Harika! Profiliniz oldukça iyi durumda! ✨";
    if (score >= 50)
      return "İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈";
    return "Profilinizi geliştirmek için önerilerimizi dikkate alın. 🎯";
  };

  if (isComplete) {
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
              className="absolute -top-8 right-4 z-20 w-10 h-10 lg:w-16 lg:h-16"
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
              className="absolute -top-8 right-4 z-20 w-10 h-10 lg:w-16 lg:h-16"
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
                <div className="flex flex-col gap-2 w-full mb-4">
                  {ratingScale.map((r) => (
                    <button
                      key={r.value}
                      className={`w-full py-2 sm:py-1 px-4 rounded-[10px] text-xs lg:text-2xl font-normal transition-all duration-200 focus:outline-none
                          ${
                            answers[currentQuestion] === r.value
                              ? "bg-[#276090] text-white"
                              : "bg-[#357ab8] text-white hover:bg-[#1d466e] active:bg-[#1d466e]"
                          }
                        `}
                      onClick={() => handleAnswer(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <button
                  className={`w-full py-2 sm:py-1 rounded-[20px] text-xs lg:text-3xl font-normal mt-1 transition-all duration-200
                      ${
                        answers[currentQuestion]
                          ? "bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]"
                          : "bg-[#e3f1fb] text-blue-200 cursor-not-allowed"
                      }`}
                  onClick={handleSubmit}
                  disabled={!answers[currentQuestion]}
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
      {isComplete && (
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
