'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSound } from '@/hooks/useSound';
import { questionsData } from '@/data/questions';
import OptimizedImage from '@/components/OptimizedImage';

// Image Modal Component
interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-[80vh]">
          <OptimizedImage src={src} alt={alt} fill className="object-contain" />
        </div>
        <button
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 text-2xl font-bold rounded-full h-10 w-10 flex items-center justify-center transition-colors duration-200"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Simple Left Drawer Component
interface LeftDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentQuestion: number;
  answers: (number | null)[];
  onQuestionSelect: (index: number) => void;
  showWarningIndicators: boolean;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({
  isOpen,
  onToggle,
  currentQuestion,
  answers,
  onQuestionSelect,
  showWarningIndicators,
}) => {
  const drawerWidth = 280; // Fixed width
  const visibleWidth = drawerWidth * 0; // 10% visible

  return (
    <div
      className="fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out"
      style={{
        width: `${drawerWidth}px`,
        transform: `translateX(${
          isOpen ? '0px' : `-${drawerWidth - visibleWidth}px`
        })`,
      }}
    >
      {/* Main drawer content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-[#4a90c2] text-white p-4">
          <h2 className="text-lg font-semibold">Sorular</h2>
          <span className="text-sm opacity-80">
            {currentQuestion + 1} / {questionsData.length}
          </span>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {questionsData.map((question, index) => {
              const isAnswered = answers[index] !== null;
              const isCurrent = index === currentQuestion;
              const shouldShowWarning = !isAnswered && showWarningIndicators;

              return (
                <button
                  key={index}
                  onClick={() => onQuestionSelect(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#4a90c2] text-white border-[#4a90c2]'
                      : isAnswered
                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                        : shouldShowWarning
                          ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Soru {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      {isAnswered ? (
                        <span
                          className={`text-xs font-medium ${
                            isCurrent ? 'text-white' : 'text-green-700'
                          }`}
                        >
                          {answers[index]}
                        </span>
                      ) : shouldShowWarning ? (
                        <div className="animate-pulse">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <p
                    className={`text-xs leading-tight ${
                      isCurrent
                        ? 'text-white/90'
                        : isAnswered
                          ? 'text-gray-600'
                          : shouldShowWarning
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {question.question.length > 50
                      ? `${question.question.substring(0, 50)}...`
                      : question.question}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="text-sm text-gray-600">
            Cevaplanan: {answers.filter(a => a !== null).length} /{' '}
            {questionsData.length}
          </div>
        </div>
      </div>

      {/* Toggle button in visible area */}
      <button
        onClick={onToggle}
        className="absolute -right-10 top-4 bg-[#4a90c2] text-white p-2 rounded-lg  hover:bg-[#3d7ba3] transition-colors duration-200"
        style={{ right: `-${visibleWidth - 8}px` }}
        aria-label={isOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
      >
        {isOpen ? (
          <svg
            className="w-8 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

// Helper function to get label based on slider value
const getSliderLabel = (value: number): string => {
  if (value >= 0 && value <= 19) return 'Henüz Üzerinde Çalışmadım';
  if (value >= 20 && value <= 39) return 'Eksik ve Gelişime Açık';
  if (value >= 40 && value <= 59) return 'Temel Seviyede Hazır';
  if (value >= 60 && value <= 79) return 'Gözden Geçirilmiş ve Düzenli';
  if (value >= 80 && value <= 100) return 'Stratejik ve Etkileyici';
  return '';
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

// Debug component for faster testing
interface DebugComponentProps {
  onFinishTest: () => void;
}

const DebugComponent: React.FC<DebugComponentProps> = ({ onFinishTest }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Debug Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-50 flex items-center justify-center"
        title="Debug Tools"
      >
        🐛
      </button>

      {/* Debug Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Debug Tools</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bu araçlar sadece test amaçlıdır. Tüm soruları rastgele cevaplarla
              doldurur ve sonuç ekranına geçer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onFinishTest();
                  setShowModal(false);
                }}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Testi Bitir
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function TestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showWarningIndicators, setShowWarningIndicators] = useState(false);
  const { playClickSound } = useSound();

  const handleDebugFinishTest = () => {
    // Fill all answers with random values for debugging
    const debugAnswers = questionsData.map(() =>
      Math.floor(Math.random() * 101)
    );
    setAnswers(debugAnswers);

    // Calculate debug score
    const debugScore = debugAnswers.reduce(
      (total: number, ans: number, idx: number) => {
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );

    // Always save to localStorage first
    localStorage.setItem('testAnswers', JSON.stringify(debugAnswers));
    localStorage.setItem('testScore', Math.ceil(debugScore).toString());

    // If user is authenticated, save to database and go to dashboard
    if (session?.user) {
      saveTestResultToDatabase(Math.ceil(debugScore), debugAnswers);
    } else {
      // If not authenticated, go to results page
      router.push('/results');
    }
  };

  const saveTestResultToDatabase = async (
    score: number,
    testAnswers: (number | null)[]
  ) => {
    try {
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          answers: testAnswers,
        }),
      });

      if (response.ok) {
        // Successfully saved to database, clear localStorage and redirect to dashboard
        localStorage.removeItem('testAnswers');
        localStorage.removeItem('testScore');
        router.push('/dashboard');
      } else {
        console.error('Failed to save test result to database');
        // Fallback to results page
        router.push('/results');
      }
    } catch (error) {
      console.error('Error saving test result:', error);
      // Fallback to results page
      router.push('/results');
    }
  };

  const handleSliderChange = (value: number) => {
    playClickSound();
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleQuestionSelect = (index: number) => {
    playClickSound();
    setCurrentQuestion(index);
    setIsDrawerOpen(false);
  };

  const handleSubmit = () => {
    playClickSound();

    // Check if this is the last question
    if (currentQuestion === questionsData.length - 1) {
      // This is the last question, calculate final score
      const finalScore = answers.reduce(
        (total: number, ans: number | null, idx: number) => {
          if (ans === null) return total;
          const multiplier = getMultiplierFromSliderValue(ans);
          return total + questionsData[idx].score * multiplier;
        },
        0
      );

      // Always store answers and score in localStorage first (as backup)
      localStorage.setItem('testAnswers', JSON.stringify(answers));
      localStorage.setItem('testScore', Math.ceil(finalScore).toString());

      // If user is authenticated, save to database and go to dashboard
      if (session?.user) {
        saveTestResultToDatabase(Math.ceil(finalScore), answers);
      } else {
        // If not authenticated, go to results page
        router.push('/results');
      }
    } else {
      // Just move to next question for non-last questions
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const handleFinishTest = () => {
    playClickSound();

    // Check for unanswered questions
    const unansweredQuestions = answers.some(answer => answer === null);

    if (unansweredQuestions) {
      // Enable warning indicators and open drawer
      setShowWarningIndicators(true);
      setIsDrawerOpen(true);
      return;
    }

    // Calculate final score if all questions are answered
    const finalScore = answers.reduce(
      (total: number, ans: number | null, idx: number) => {
        if (ans === null) return total;
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );

    // Always store answers and score in localStorage first (as backup)
    localStorage.setItem('testAnswers', JSON.stringify(answers));
    localStorage.setItem('testScore', Math.ceil(finalScore).toString());

    // If user is authenticated, save to database and go to dashboard
    if (session?.user) {
      saveTestResultToDatabase(Math.ceil(finalScore), answers);
    } else {
      // If not authenticated, go to results page
      router.push('/results');
    }
  };

  const currentAnswer = answers[currentQuestion];
  const isAnswered = currentAnswer !== null;
  const allQuestionsAnswered = answers.every(answer => answer !== null);

  return (
    <div className="min-h-screen bg-white">
      {/* Left Drawer */}
      <LeftDrawer
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        currentQuestion={currentQuestion}
        answers={answers}
        onQuestionSelect={handleQuestionSelect}
        showWarningIndicators={showWarningIndicators}
      />

      {/* Main Content */}
      <div className="min-h-screen px-8 py-8 flex items-center justify-center">
        {/* Container for two-column layout on large screens */}
        <div className="w-full max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
          {/* First column: Correct and incorrect images */}
          <div className="flex flex-col gap-6 mb-6 lg:mb-0">
            {/* Correct Example */}
            <div className="relative w-full bg-white rounded-xl shadow-lg overflow-visible">
              <OptimizedImage
                src={questionsData[currentQuestion].correctImage}
                alt="Doğru örnek"
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-lg cursor-pointer"
                onClick={() =>
                  setModalImg(questionsData[currentQuestion].correctImage)
                }
              />
              <OptimizedImage
                src="/images/checkmark.png"
                alt="Doğru"
                width={64}
                height={64}
                className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
              />
            </div>

            {/* Incorrect Example */}
            <div className="relative w-full bg-white rounded-xl shadow-lg overflow-visible">
              <OptimizedImage
                src={questionsData[currentQuestion].wrongImage}
                alt="Yanlış örnek"
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-lg cursor-pointer"
                onClick={() =>
                  setModalImg(questionsData[currentQuestion].wrongImage)
                }
              />
              <OptimizedImage
                src="/images/cross.png"
                alt="Yanlış"
                width={64}
                height={64}
                className="absolute lg:-top-8 -top-4 lg:right-0 right-1 z-20 w-10 h-10 lg:w-16 lg:h-16"
              />
            </div>
          </div>

          {/* Second column: Blue Question Card */}
          <div className="flex justify-center">
            <div className="fade-in w-full max-w-[350px] lg:max-w-[500px]">
              <div className="bg-[#4a90c2] rounded-[16px] p-4 lg:p-8 shadow-xl flex flex-col items-center lg:h-full">
                <div className="flex-grow w-full flex flex-col items-center lg:justify-between">
                  {/* Question */}
                  <div className="mb-4 w-full">
                    <p className="text-white text-sm lg:text-2xl font-medium leading-tight">
                      {questionsData[currentQuestion].question}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 w-full mb-4">
                    {/* Numeric Score Display */}
                    <div className="text-center">
                      <div className="text-white text-4xl lg:text-6xl font-bold mb-2">
                        {currentAnswer || 0}
                      </div>
                      <div className="text-white text-xs lg:text-sm opacity-80">
                        Score
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="flex items-center gap-3 w-full px-2">
                      <span className="text-white text-xs lg:text-sm opacity-70 min-w-[20px]">
                        0
                      </span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentAnswer || 0}
                          onChange={e =>
                            handleSliderChange(Number(e.target.value))
                          }
                          className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #ffffff ${
                              currentAnswer || 0
                            }%, rgba(255,255,255,0.3) ${currentAnswer || 0}%)`,
                          }}
                        />
                      </div>
                      <span className="text-white text-xs lg:text-sm opacity-70 min-w-[30px]">
                        100
                      </span>
                    </div>

                    {/* Dynamic Label */}
                    <div className="text-center">
                      <div className="text-white text-base lg:text-xl font-medium bg-transparent bg-opacity-20 rounded-lg py-2 px-4">
                        {getSliderLabel(currentAnswer || 0)}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full py-2 sm:py-1 rounded-[20px] text-xs lg:text-3xl font-normal mt-1 transition-all duration-200
                        ${
                          isAnswered
                            ? 'bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]'
                            : 'bg-[#e3f1fb] text-blue-200 cursor-not-allowed'
                        }`}
                    onClick={handleSubmit}
                    disabled={!isAnswered}
                  >
                    {'Gönder'}
                  </button>

                  {/* Finish Test Button - Only show when all questions answered */}
                  {allQuestionsAnswered && (
                    <button
                      onClick={handleFinishTest}
                      className="w-full py-3 mt-4 rounded-[20px] text-xs lg:text-xl font-medium transition-all duration-200 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg"
                    >
                      Testi Bitir
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImg && (
        <ImageModal
          src={modalImg}
          alt="Seçilen örnek"
          onClose={() => setModalImg(null)}
        />
      )}

      {/* Debug Component */}
      <DebugComponent onFinishTest={handleDebugFinishTest} />
    </div>
  );
}
