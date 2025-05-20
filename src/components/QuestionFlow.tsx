'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { useSound } from '@/hooks/useSound';
import { questionsData, ratingScale, RatingScale } from '@/data/questions';
import SocialShare from './SocialShare';

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questionsData.length).fill(null));
  const [score, setScore] = useState(0);
  const [showScoreLoader, setShowScoreLoader] = useState(true);
  const { playClickSound } = useSound();

  const isComplete = currentQuestion === questionsData.length - 1 && answers[currentQuestion] !== null;

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

    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      setTimeout(() => {
        setShowScoreLoader(false);
      }, 1000);
    }

    // Calculate score with multipliers
    const newScore = newAnswers.reduce((total: number, ans: number | null, idx: number) => {
      if (ans === null) return total;
      const rating: RatingScale | undefined = ratingScale.find(r => r.value === ans);
      return total + (questionsData[idx].score * (rating?.multiplier || 0));
    }, 0);

    // Round up the score
    setScore(Math.ceil(newScore));
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Mükemmel! LinkedIn profiliniz çok etkileyici! 🌟";
    if (score >= 70) return "Harika! Profiliniz oldukça iyi durumda! ✨";
    if (score >= 50) return "İyi! Birkaç geliştirme ile profiliniz daha da iyi olabilir. 📈";
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
                      style={{ "--score-height": `${score}%` } as React.CSSProperties}
                    />
                  </div>
                  <div className="grade-container">
                    <div className={`grade-marker ${score >= 85 ? 'active' : ''}`} data-grade="S">
                      <div className="grade-letter">S</div>
                      <div className="grade-label">Profesyonel</div>
                    </div>
                    <div className={`grade-marker ${score >= 70 && score < 85 ? 'active' : ''}`} data-grade="A">
                      <div className="grade-letter">A</div>
                      <div className="grade-label">Takibe Değer</div>
                    </div>
                    <div className={`grade-marker ${score >= 50 && score < 70 ? 'active' : ''}`} data-grade="B">
                      <div className="grade-letter">B</div>
                      <div className="grade-label">Fena Değil</div>
                    </div>
                    <div className={`grade-marker ${score >= 30 && score < 50 ? 'active' : ''}`} data-grade="C">
                      <div className="grade-letter">C</div>
                      <div className="grade-label">Ne iş Belli Değil</div>
                    </div>
                    <div className={`grade-marker ${score < 30 ? 'active' : ''}`} data-grade="D">
                      <div className="grade-letter">D</div>
                      <div className="grade-label">Sadece Var</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  {showScoreLoader && (
                    <div
                      className="loader"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  )}
                  <div className={`score-number ${!showScoreLoader ? 'visible' : ''}`}>{score}/100</div>
                </div>
                <p className="score-message">
                  {getScoreMessage(score)}
                </p>
                <SocialShare />
                <button
                  onClick={handleRestart}
                  className="mt-8 gradient-bg text-white px-8 py-4 rounded-xl transition-all duration-300 
                    hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="fade-in">
          <div className="card-container rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
            <div className="question-animation float">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={questionsData[currentQuestion].animation}
                  alt=""
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="flex-grow">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {questionsData[currentQuestion].icon}
                  </span>
                  <p className="question-text">
                    {questionsData[currentQuestion].question}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Soru {currentQuestion + 1}/{questionsData.length}
                </p>
              </div>

              <div className="progress-bar-container mb-6">
                <div
                  className="progress-bar"
                  style={{ width: `${((currentQuestion + 1) / questionsData.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={currentQuestion + 1}
                  aria-valuemin={0}
                  aria-valuemax={questionsData.length}
                />
              </div>

              <StarRating
                value={answers[currentQuestion]}
                onRatingChange={handleAnswer}
                labels={ratingScale.map((r: RatingScale) => r.label)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 