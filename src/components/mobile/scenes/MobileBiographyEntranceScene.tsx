import React, { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileBiographyEntranceSceneProps {
  onNext: () => void;
}

export const MobileBiographyEntranceScene: React.FC<MobileBiographyEntranceSceneProps> = ({
  onNext,
}) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  const handleOpenDoor = () => {
    if (isDoorOpen) return;
    setIsDoorOpen(true);
    AudioEngine.triggerLightPulseSound();
    setTimeout(onNext, 450);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black overflow-hidden">
      {/* Backstage Door Background (Storyboard 12) */}
      <div
        className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700 ${
          isDoorOpen ? 'scale-110 filter brightness-125' : 'scale-100 brightness-90'
        }`}
        style={{
          backgroundImage: 'url(/assets/mobile/behind_sound_door.jpg)',
        }}
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          12 • BIOGRAPHY ENTRANCE
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          08 / 20
        </span>
      </div>

      {/* Center Door Frame Content (Storyboard 12) */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-xs mx-auto">
        <div className="px-3 py-1 rounded-full bg-black/60 border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 mb-3 text-[10px] font-mono text-amber-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>BACKSTAGE CORRIDOR</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-white font-['Syne'] uppercase text-glow">
          BEHIND THE SOUND
        </h2>

        {/* Chapter List overlay on door */}
        <div className="w-full flex flex-col gap-2 mt-4 bg-black/75 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md text-left">
          {[
            'THE JOURNEY',
            'THE LEARNING',
            'THE CRAFT',
            'THE PERSON',
            'THE NEXT SET',
          ].map((ch, idx) => (
            <div
              key={ch}
              className="flex items-center gap-2.5 text-xs font-mono text-zinc-300 py-0.5"
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[9px] font-bold">
                {idx + 1}
              </span>
              <span className="tracking-wider">{ch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA to Step Inside */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={handleOpenDoor}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <span>STEP INSIDE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
