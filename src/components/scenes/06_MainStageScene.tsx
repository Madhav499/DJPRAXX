import React from 'react';
import { Play, Sparkles } from 'lucide-react';

interface MainStageSceneProps {
  onNext: () => void;
}

export const MainStageScene: React.FC<MainStageSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-6 text-center select-none">
      {/* Scene Header */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 06 • MAIN STAGE REVEAL
        </span>
      </div>

      {/* Arena Stage Visual Composition */}
      <div className="relative flex flex-col items-center my-auto w-full max-w-4xl">
        {/* Suspended Circular Concert Truss Rig in Arena */}
        <div className="relative w-72 md:w-96 h-16 border-4 border-zinc-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(240,124,34,0.4)]">
          <div className="absolute inset-0 rounded-full border border-amber-500/60 animate-pulse" />
          <span className="text-xl md:text-2xl font-black tracking-[0.35em] text-white font-['Syne'] text-glow">
            PRAXX
          </span>

          {/* Radiating Laser Beams */}
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-44 bg-gradient-to-b from-amber-400/80 via-amber-500/30 to-transparent origin-top blur-[1px]"
              style={{
                transform: `rotate(${(i - 4) * 20}deg)`,
              }}
            />
          ))}
        </div>

        {/* Crowd Silhouettes Cheering */}
        <div className="w-full max-w-2xl h-24 md:h-32 mt-12 relative flex items-end justify-center overflow-hidden">
          {/* Animated crowd hands silhouette */}
          <div className="w-full flex items-end justify-around opacity-90">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="w-4 md:w-6 bg-gradient-to-t from-black via-zinc-900 to-zinc-800 rounded-t-full"
                style={{
                  height: `${40 + ((i * 17) % 55)}px`,
                  animation: `bounce 1.4s ease-in-out infinite`,
                  animationDelay: `${(i % 5) * 0.18}s`,
                }}
              />
            ))}
          </div>
          {/* Haze overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase mt-4 text-glow">
          A HIGHER STATE TOGETHER
        </h1>
        <p className="max-w-lg text-xs md:text-sm text-zinc-300 tracking-[0.15em] font-['Space_Grotesk'] mt-2">
          Thousands of voices locked into one resonant pulse. The energy is alive.
        </p>
      </div>

      {/* Interactive Controls Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>ENTER INTERACTIVE STAGE</span>
        </button>
      </div>
    </div>
  );
};
