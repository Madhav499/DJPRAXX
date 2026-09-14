import React from 'react';
import { DoorOpen, ChevronRight } from 'lucide-react';

interface ExitExperienceSceneProps {
  onNext: () => void;
}

export const ExitExperienceScene: React.FC<ExitExperienceSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none text-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 19 • EXIT EXPERIENCE
        </span>
      </div>

      {/* Center Portal Composition (Storyboard 19) */}
      <div className="relative flex flex-col items-center my-auto max-w-lg">
        {/* Monolithic Tall Luminous Portal Door */}
        <div className="relative w-28 h-64 md:w-36 md:h-80 rounded-t-full bg-gradient-to-b from-white via-amber-200 to-amber-500 shadow-[0_0_80px_rgba(255,244,230,0.6)] flex flex-col items-center justify-end p-2 overflow-hidden">
          {/* Light rays spilling forward */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent animate-pulse" />
        </div>

        {/* Silhouette of lone visitor stepping through */}
        <div className="relative z-10 -mt-16 w-10 h-24 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black" />
          <div className="w-7 h-16 bg-black rounded-t-md mt-0.5" />
          {/* Reflected shadow on floor */}
          <div className="w-14 h-3 rounded-full bg-black/90 blur-[1px] mt-1" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase mt-8 text-glow">
          UNTIL NEXT NIGHT
        </h2>
        <span className="text-xs md:text-sm tracking-[0.3em] text-amber-400 font-mono uppercase font-bold mt-2">
          SAME SOUL • NEW STORIES
        </span>
        <p className="text-xs text-zinc-400 font-['Space_Grotesk'] mt-2 max-w-md">
          The music lingers long after the final spotlight dims. Carry the frequency into tomorrow.
        </p>
      </div>

      {/* Advance to Final Screen */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>VIEW FINAL SCREEN</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
