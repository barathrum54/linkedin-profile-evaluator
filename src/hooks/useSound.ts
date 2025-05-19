'use client';

import { useEffect, useRef } from 'react';

export const useSound = () => {
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Base64 encoded short click sound
    const clickSoundBase64 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYbUxJa2AAAAAAAAAAAAAAAAAAAAAP/7UMQAAAesTXBQQwAB0jKkC4lgAIAmSBEChJkJHP/IxGCGIYhkwQgMSAjAhSXA+D4Pg+/pBA0/B8HwfBAEAQdBAEP/DgQ/B8HwfB8EAQBA0EAQBAEH4Pg+D4PvUCAIGggCAIAg/B8HwfB96gQBA0DgQBAEH4Pg+D4Pg+CAP//+D4Pg+D4IAQBA4EAQBB+D4Pg+D4PggCAIHAgCAIAg+D4Pg+D4Pg+CAIAgcCAIAgCAIAg//+CAIAgcCAIAgCAIAg+D4Pg+D4IAgCBwIAgCAIAgCAIP//ggCAIHAgCAIAgCAIAg+D4Pg+D4IAgcCAIAgCAIAgCAIA//8EAQOBAEAQBAEAQfg+D4Pg+D4IgcCAIAgCAIAgCAIAgD//wQBA4EAQBAEAQBB+D4Pg+D4PgiAIAgCAIAgCAIAgCAP//B8EAQBAEAQBAEAQBA0EAQBAEAQBAEAQBAEAQBAEAP/7UMQvg8xldxWPYAAhC6yMexgAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
    
    clickSoundRef.current = new Audio(clickSoundBase64);
    hoverSoundRef.current = new Audio(clickSoundBase64);
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  return {
    playClickSound,
    playHoverSound
  };
}; 