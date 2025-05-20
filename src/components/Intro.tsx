'use client';

import { useSound } from '@/hooks/useSound';

interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  const { playClickSound } = useSound();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-container p-8 rounded-2xl max-w-2xl w-full text-center cross-fade">
        <div className="space-y-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 
            bg-clip-text text-transparent">
            LinkedIn Profil Analizi
          </h1>
          <p className="text-xl text-gray-300">
            Profilinizi profesyonel standartlara göre değerlendirin
          </p>
          <div className="space-y-4">
            <button
              onClick={() => { onStart(); playClickSound(); }}
              className="w-full gradient-bg text-white px-8 py-4 rounded-xl text-xl font-semibold
                transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Değerlendirmeye başla"
            >
              Başla
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 font-medium"
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