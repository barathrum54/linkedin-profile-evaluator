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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
        <button
          className="absolute top-2 right-2 text-white text-4xl font-bold bg-transparent"
          onClick={onClose}
          aria-label="Kapat"
        >
          &times;
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
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="min-h-screen bg-white px-8 py-8 flex flex-col items-center justify-center">
      {/* Static images above the card */}
      <div className="w-full max-w-md flex flex-col gap-6 mb-10 px-8">
        {/* Correct Example */}
        <div
          className="relative w-full bg-white rounded-xl shadow p-2 overflow-visible cursor-pointer"
          onClick={() =>
            setModalImg(questionsData[currentQuestion].correctImage)
          }
        >
          <img
            src={questionsData[currentQuestion].correctImage}
            alt="Doğru örnek"
            className="w-full h-auto object-contain rounded-lg"
          />
          <span className="absolute -top-6 right-0 z-20">
            <svg
              className="w-24 h-24 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 26l8 8L38 14"
              />
            </svg>
          </span>
        </div>
        {/* Incorrect Example */}
        <div
          className="relative w-full bg-white rounded-xl shadow p-2 overflow-visible cursor-pointer"
          onClick={() => setModalImg(questionsData[currentQuestion].wrongImage)}
        >
          <img
            src={questionsData[currentQuestion].wrongImage}
            alt="Yanlış örnek"
            className="w-full h-auto object-contain rounded-lg"
          />
          <span className="absolute -top-6 right-0 z-20">
            <svg
              className="w-24 h-24 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 34L34 14M14 14l20 20"
              />
            </svg>
          </span>
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
      {/* Blue card with question and answers */}
      <div className="w-full flex justify-center">
        <div className="fade-in w-full max-w-[350px]">
          <div className="bg-[#4a90c2] rounded-[16px] p-6 shadow-xl mb-8 flex flex-col items-center">
            <div className="flex-grow w-full flex flex-col items-center">
              <div className="mb-4 w-full">
                <p className="question-text text-white text-base sm:text-lg md:text-xl font-medium leading-tight">
                  {questionsData[currentQuestion].question}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mb-4">
                {ratingScale.map((r) => (
                  <button
                    key={r.value}
                    className={`w-full py-2 px-4 rounded-[10px] text-base font-normal transition-all duration-200 focus:outline-none
                      ${
                        answers[currentQuestion] === r.value
                          ? "bg-[#276090] text-white"
                          : "bg-[#357ab8] text-white hover:bg-[#1d466e] active:bg-[#1d466e]"
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
                className={`w-full py-2 rounded-[20px] text-base font-normal mt-1 transition-all duration-200
                  ${
                    answers[currentQuestion]
                      ? "bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]"
                      : "bg-[#e3f1fb] text-blue-200 cursor-not-allowed"
                  }`}
                onClick={handleSubmit}
                disabled={!answers[currentQuestion] || isLoading}
              >
                Gönder
              </button>
              {isLoading && (
                <div className="mt-1 text-[#276090] text-xs flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
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
