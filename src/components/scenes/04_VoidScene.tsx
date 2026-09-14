import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface VoidSceneProps {
  onNext: () => void;
}

export const VoidScene: React.FC<VoidSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-6 text-center select-none">
      {/* Top Tagline */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] tracking-[0.3em] text-zinc-300 font-mono uppercase">
          YOU ARE HERE • THE VOID
        </span>
      </div>

      {/* Center Arrival Stage Architecture */}
      <div className="relative flex flex-col items-center my-auto">
        {/* Overhead suspended halo lighting ring representation */}
        <div className="relative w-48 h-12 md:w-80 md:h-16 rounded-[100%] border-2 border-amber-500/50 shadow-[0_0_30px_#f07c22] mb-6 flex items-center justify-center">
          <div className="w-36 h-8 md:w-60 md:h-10 rounded-[100%] border border-amber-300/30" />
          <div className="absolute -bottom-16 w-40 md:w-64 h-32 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent pointer-events-none blur-sm" />
        </div>

        {/* Silhouette of visitor standing in the arena */}
        <div className="relative z-10 w-12 h-24 md:w-16 md:h-32 mb-4 flex flex-col items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-zinc-900 border border-amber-400/40 shadow-sm" />
          <div className="w-8 md:w-10 h-16 md:h-20 bg-gradient-to-b from-zinc-800 to-black rounded-t-lg mt-0.5 border-x border-zinc-700/40" />
          {/* Floor reflection shadow */}
          <div className="w-16 h-3 rounded-full bg-black/80 blur-[2px] mt-1" />
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          ENTER PRAXX
        </h1>
        <p className="max-w-xl text-xs md:text-sm text-zinc-400 tracking-[0.15em] font-['Space_Grotesk'] mt-3">
          Step across the threshold of dark architecture, volumetric haze, and live festival energy.
        </p>
      </div>

      {/* Bottom CTA / Navigation Prompt */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.4)] active:scale-95"
        >
          <span>ENTER THE ENTRANCE</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-mono">
          <span>EXPLORE</span>
          <span>•</span>
          <span>FEEL</span>
          <span>•</span>
          <span>DISCOVER</span>
        </div>
      </div>
    </div>
  );
};
