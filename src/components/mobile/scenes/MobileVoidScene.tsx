import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { HowlerEngine } from '../../../audio/howlerEngine';

interface MobileVoidSceneProps {
  onNext: () => void;
}

export const MobileVoidScene: React.FC<MobileVoidSceneProps> = ({ onNext }) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY > 40) {
        // Swiped up
        triggerNext();
      }
    }
  };

  const triggerNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    HowlerEngine.triggerLightPulseSound();
    setTimeout(onNext, 400);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-500 ${
        isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Photographic Atmospheric Background (Storyboard 03) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/mobile/void_arrival.jpg)',
          filter: 'brightness(0.85) contrast(1.1)',
        }}
      />

      {/* Dark Vignette and Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

      {/* Top Tag & Progress */}
      <div className="relative z-10 pt-4 flex items-center justify-between w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase">
          03 • THE VOID / ARRIVAL
        </span>
        <span className="text-[10px] font-mono text-amber-500 font-bold">
          01 / 20
        </span>
      </div>

      {/* Center Copy */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-xs">
        <div className="w-8 h-[2px] bg-amber-500 mb-3" />
        <h2 className="text-xl sm:text-2xl font-black tracking-[0.2em] text-white font-['Syne'] uppercase leading-tight text-glow">
          YOU ARE HERE
        </h2>
        <h3 className="text-base sm:text-lg font-bold tracking-[0.15em] text-amber-400 font-['Syne'] uppercase mt-1">
          BUT THIS IS JUST THE BEGINNING
        </h3>
        <p className="text-xs text-zinc-400 font-['Space_Grotesk'] mt-3 leading-relaxed">
          The sound starts deep inside the architectural quiet. Step forward into the night.
        </p>
      </div>

      {/* Bottom Travel Gesture */}
      <div
        onClick={triggerNext}
        className="relative z-10 flex flex-col items-center gap-1 pb-6 cursor-pointer text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <ChevronUp className="w-6 h-6 text-amber-500 animate-bounce" />
        <span className="text-[10px] tracking-[0.3em] font-mono uppercase font-bold text-white">
          SWIPE UP TO ENTER
        </span>
        <span className="text-[9px] font-mono text-zinc-500">
          OR TAP ANYWHERE TO TRAVEL
        </span>
      </div>
    </div>
  );
};
