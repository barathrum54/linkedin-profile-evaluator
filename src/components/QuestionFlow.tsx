"use client";

import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { questionsData, ratingScale, RatingScale } from "@/data/questions";
import SocialShare from "./SocialShare";

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
    }, 800);
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
      {/* Static images above the card */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-6">
        {/* Correct Example */}
        <div className="relative w-full bg-white rounded-xl shadow p-2">
          <img
            src={questionsData[currentQuestion].correctImage}
            alt="Doğru örnek"
            className="w-full h-auto object-contain rounded-lg"
          />
          <span className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </div>
        {/* Incorrect Example */}
        <div className="relative w-full bg-white rounded-xl shadow p-2">
          <img
            src={questionsData[currentQuestion].wrongImage}
            alt="Yanlış örnek"
            className="w-full h-auto object-contain rounded-lg"
          />
          <span className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </div>
      </div>
      {/* Blue card with question and answers */}
      <div className="w-full max-w-3xl">
        <div className="fade-in">
          <div className="bg-[#3887c1] rounded-2xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col items-center">
            <div className="flex-grow w-full flex flex-col items-center">
              <div className="mb-6 w-full">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {questionsData[currentQuestion].icon}
                  </span>
                  <p className="question-text text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                    {questionsData[currentQuestion].question}
                  </p>
                </div>
                <p className="text-sm text-blue-100 font-medium">
                  Soru {currentQuestion + 1}/{questionsData.length}
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-md mb-8">
                {ratingScale.map((r) => (
                  <button
                    key={r.value}
                    className={`w-full py-3 px-4 rounded-full text-base font-medium transition-all duration-200 focus:outline-none
                      ${
                        answers[currentQuestion] === r.value
                          ? "bg-[#5faee3] text-white font-bold"
                          : "bg-[#b7d8f6] text-[#1a3c5a] hover:bg-[#a3cbe6]"
                      }
                    `}
                    onClick={() => handleAnswer(r.value)}
                    disabled={isLoading}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <button
                className={`w-full max-w-md py-3 rounded-full text-lg font-semibold mt-2 transition-all duration-200
                  ${
                    answers[currentQuestion]
                      ? "bg-[#5faee3] text-white hover:bg-[#3887c1]"
                      : "bg-[#b7d8f6] text-blue-100 cursor-not-allowed"
                  }`}
                onClick={handleSubmit}
                disabled={!answers[currentQuestion] || isLoading}
              >
                Gönder
              </button>
              {isLoading && (
                <div className="mt-2 text-white text-sm flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
