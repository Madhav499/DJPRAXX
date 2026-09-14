import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileEntranceSceneProps {
  onNext: () => void;
}

export const MobileEntranceScene: React.FC<MobileEntranceSceneProps> = ({ onNext }) => {
  const [lightPool, setLightPool] = useState({ x: 50, y: 70 });
  const [isEntering, setIsEntering] = useState(false);

  // Dragging over floor moves pool of light
  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(10, Math.min(90, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(20, Math.min(95, ((touch.clientY - rect.top) / rect.height) * 100));
    setLightPool({ x, y });
  };

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    AudioEngine.triggerLightPulseSound();
    setTimeout(onNext, 400);
  };

  return (
    <div
      onTouchMove={handleTouchMove}
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-500 ${
        isEntering ? 'opacity-0 scale-105 filter blur-xs' : 'opacity-100 scale-100'
      }`}
    >
      {/* Photographic Background (Storyboard 04) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/mobile/venue_entrance.jpg)',
          filter: 'brightness(0.9) contrast(1.1)',
        }}
      />

      {/* Dynamic Interactive Pool of Light on Floor */}
      <div
        className="absolute w-56 h-56 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
        style={{
          left: `${lightPool.x}%`,
          top: `${lightPool.y}%`,
          background: 'radial-gradient(circle, rgba(240,124,34,0.35) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/75 pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 pt-4 flex items-center justify-between w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase">
          04 • ENTRANCE
        </span>
        <span className="text-[10px] font-mono text-amber-500 font-bold">
          02 / 20
        </span>
      </div>

      {/* Center Atmospheric Framing */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-xs">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase font-semibold">
          THE DOORS ARE OPEN
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-white font-['Syne'] uppercase mt-1 text-glow">
          MUSIC • PEOPLE
        </h2>
        <h3 className="text-xl sm:text-2xl font-black tracking-[0.15em] text-amber-400 font-['Syne'] uppercase">
          MOMENTS • FOREVER
        </h3>
        <p className="text-xs text-zinc-300 font-['Space_Grotesk'] mt-2">
          Touch the floor to cast light. The bass from the main arena vibrates the air.
        </p>
      </div>

      {/* Bottom Enter Action Button (Storyboard 04) */}
      <div className="relative z-10 w-full max-w-xs pb-6">
        <button
          onClick={handleEnter}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border border-amber-300 text-black font-extrabold text-sm tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          aria-label="Enter Main Stage"
        >
          <span>&lt; ENTER ARENA &gt;</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
