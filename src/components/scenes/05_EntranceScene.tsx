import React from 'react';
import { ChevronRight } from 'lucide-react';

interface EntranceSceneProps {
  onNext: () => void;
}

export const EntranceScene: React.FC<EntranceSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-6 text-center select-none">
      {/* Scene Identifier */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 05 • THE ENTRANCE
        </span>
      </div>

      {/* Monumental Venue Archway Architectural Representation */}
      <div className="relative flex flex-col items-center my-auto w-full max-w-2xl">
        {/* Glowing Amber Neon Architectural Portal */}
        <div className="relative w-full max-w-lg h-72 md:h-88 border-2 border-amber-500/40 rounded-t-3xl bg-gradient-to-b from-amber-600/10 via-zinc-950/80 to-black p-6 flex flex-col items-center justify-between shadow-[0_0_50px_rgba(240,124,34,0.25)]">
          {/* Neon PRAXX Sign on Top Arch */}
          <div className="mt-4 px-6 py-2 rounded-lg bg-black/80 border border-amber-500/60 shadow-[0_0_20px_#f07c22]">
            <span className="text-2xl md:text-3xl font-black tracking-[0.4em] text-white font-['Syne'] text-glow">
              PRAXX
            </span>
          </div>

          {/* Red Velvet Ropes and VIP Stanchions */}
          <div className="w-full flex items-center justify-between px-4 mt-auto mb-2">
            <div className="w-4 h-16 bg-gradient-to-b from-amber-300 to-amber-700 rounded-t-sm border border-amber-200 shadow-md" />
            <div className="flex-1 h-2 bg-red-800 rounded-full mx-2 shadow-[0_0_8px_rgba(220,38,38,0.5)] border-t border-red-500" />
            <div className="w-4 h-16 bg-gradient-to-b from-amber-300 to-amber-700 rounded-t-sm border border-amber-200 shadow-md" />
          </div>

          {/* Floor Amber Glow Spill */}
          <div className="absolute -bottom-4 w-3/4 h-8 bg-amber-500/30 blur-md rounded-full pointer-events-none" />
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.3em] text-white font-['Syne'] uppercase mt-6">
          MUSIC • PEOPLE • MOMENTS
        </h2>
        <p className="max-w-md text-xs md:text-sm text-zinc-400 tracking-[0.15em] font-['Space_Grotesk'] mt-2">
          The red ropes unlatch. The sub-bass vibration echoes through the grand foyer corridor.
        </p>
      </div>

      {/* Advance to Main Stage */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_25px_rgba(240,124,34,0.4)] active:scale-95"
        >
          <span>REVEAL MAIN STAGE</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
