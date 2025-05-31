"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSound } from "@/hooks/useSound";
import { questionsData } from "@/data/questions";
import OptimizedImage from "@/components/OptimizedImage";

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
        onClick={(e) => e.stopPropagation()}
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questionsData.length).fill(null)
  );
  const [modalImg, setModalImg] = useState<string | null>(null);
  const { playClickSound } = useSound();

  // Debug function to finish test with random answers
  const handleDebugFinishTest = () => {
    playClickSound();
    const randomAnswers = questionsData.map(() =>
      Math.floor(Math.random() * 101)
    );

    // Calculate score with random answers
    const newScore = randomAnswers.reduce(
      (total: number, ans: number, idx: number) => {
        const multiplier = getMultiplierFromSliderValue(ans);
        return total + questionsData[idx].score * multiplier;
      },
      0
    );

    // Store answers and score in localStorage
    localStorage.setItem("testAnswers", JSON.stringify(randomAnswers));
    localStorage.setItem("testScore", Math.ceil(newScore).toString());

    router.push("/results");
  };

  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    playClickSound();

    // Check if this is the last question
    if (currentQuestion === questionsData.length - 1) {
      // Calculate final score
      const finalScore = answers.reduce(
        (total: number, ans: number | null, idx: number) => {
          if (ans === null) return total;
          const multiplier = getMultiplierFromSliderValue(ans);
          return total + questionsData[idx].score * multiplier;
        },
        0
      );

      // Store answers and score in localStorage
      localStorage.setItem("testAnswers", JSON.stringify(answers));
      localStorage.setItem("testScore", Math.ceil(finalScore).toString());

      router.push("/results");
    } else {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const currentAnswer = answers[currentQuestion];
  const isAnswered = currentAnswer !== null;

  return (
    <div className="min-h-screen bg-white px-8 py-8 flex items-center justify-center">
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
                        onChange={(e) =>
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
                          ? "bg-[#b3d9fa] text-[#276090] hover:bg-[#d0eaff] active:bg-[#a3cbe6]"
                          : "bg-[#e3f1fb] text-blue-200 cursor-not-allowed"
                      }`}
                  onClick={handleSubmit}
                  disabled={!isAnswered}
                >
                  Gönder
                </button>
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
