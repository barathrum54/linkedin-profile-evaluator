"use client";

import { useSound } from "@/hooks/useSound";

interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  const { playClickSound } = useSound();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="bg-white rounded-[16px] shadow-xl max-w-[350px] w-full text-center p-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-[#276090]">
            LinkedIn Profil Analizi
          </h1>
          <p className="text-lg text-[#357ab8]">
            Profilinizi profesyonel standartlara göre değerlendirin
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                onStart();
                playClickSound();
              }}
              className="w-full bg-[#357ab8] text-white px-8 py-4 rounded-[20px] text-lg font-semibold transition-all duration-300 hover:bg-[#276090] active:bg-[#1d466e] shadow-lg"
              aria-label="Değerlendirmeye başla"
            >
              Başla
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gray-200 text-gray-500 hover:bg-gray-300 transition-all duration-300 font-medium"
              aria-label="LinkedIn profilini bağla (yakında aktif olacak)"
              onClick={playClickSound}
              disabled
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              Yakında
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
