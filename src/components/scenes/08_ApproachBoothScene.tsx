import React from 'react';
import { ChevronRight, Disc } from 'lucide-react';

interface ApproachBoothSceneProps {
  onNext: () => void;
}

export const ApproachBoothScene: React.FC<ApproachBoothSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-6 text-center select-none">
      {/* Scene Header */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Disc className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 08 • APPROACH TO DJ BOOTH
        </span>
      </div>

      {/* Visual Composition */}
      <div className="relative flex flex-col items-center my-auto w-full max-w-2xl">
        {/* Glowing DJ Booth Perspective View */}
        <div className="relative w-full max-w-md h-56 md:h-64 border-b-4 border-amber-500/80 rounded-b-2xl bg-gradient-to-t from-zinc-900 to-black p-6 flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(240,124,34,0.3)]">
          {/* Backlit Silhouette of DJ at the Decks */}
          <div className="w-16 h-28 flex flex-col items-center mb-2">
            {/* Headphones */}
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center">
              <div className="w-10 h-3 border-t-2 border-amber-400/80 rounded-t-full -mt-4" />
            </div>
            {/* Body */}
            <div className="w-14 h-16 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-t-xl mt-1 border-x border-zinc-700" />
          </div>

          {/* Glowing Equipment Console Lights */}
          <div className="w-48 h-3 rounded-full bg-amber-500/60 shadow-[0_0_15px_#f07c22] flex justify-around items-center px-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase mt-6 text-glow">
          EVERY DROP A STORY
        </h2>
        <p className="max-w-md text-xs md:text-sm text-zinc-400 tracking-[0.15em] font-['Space_Grotesk'] mt-2">
          Step up behind the twin jogwheels and high-performance mixer. Take control of the frequencies.
        </p>
      </div>

      {/* Button to Enter Interactive DJ Booth */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_25px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>TAKE THE DECKS</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
