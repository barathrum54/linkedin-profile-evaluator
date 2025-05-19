'use client';

import { useState } from 'react';
import { useSound } from '@/hooks/useSound';

interface StarRatingProps {
  value: number | null;
  onRatingChange: (rating: number) => void;
  labels: string[];
}

export default function StarRating({ value, onRatingChange, labels }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const [displayLabel, setDisplayLabel] = useState('');
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const { playClickSound, playHoverSound } = useSound();

  const handleMouseEnter = (index: number) => {
    setHoverValue(index);
    playHoverSound();
    setDisplayLabel(labels[index - 1]);
    setIsLabelVisible(true);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
    setIsLabelVisible(false);
  };

  const handleClick = (index: number) => {
    onRatingChange(index);
    playClickSound();
    setDisplayLabel(labels[index - 1]);
    setIsLabelVisible(true);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-8">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            aria-label={`Rate ${index} out of 5`}
          >
            <svg
              className={`w-24 h-24 transition-all duration-300 transform group-hover:scale-110
                ${(hoverValue >= index || (value !== null && value >= index))
                  ? 'text-yellow-400 fill-current filter drop-shadow-[0_0_16px_rgba(234,179,8,0.5)]'
                  : 'text-gray-400 stroke-current fill-none'
                }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
      <div className="h-16 flex items-center justify-center">
        <span
          className={`text-xl font-bold transition-all duration-300
            bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent
            filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]
            ${isLabelVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}
        >
          {displayLabel}
        </span>
      </div>
    </div>
  );
} 