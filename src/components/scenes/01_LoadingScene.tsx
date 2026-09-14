import React, { useEffect, useState } from 'react';

interface LoadingSceneProps {
  onComplete: () => void;
}

export const LoadingScene: React.FC<LoadingSceneProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + jump);
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-zinc-950 to-black text-center select-none">
      {/* Background ambient radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      {/* Storyboard 01: Central Glowing Sound Sphere / Waveform Aura */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer orbital rings */}
        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-amber-500/20 animate-[spin_18s_linear_infinite]" />
        <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-dashed border-amber-400/30 animate-[spin_12s_linear_infinite_reverse]" />
        <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent blur-md animate-pulse" />

        {/* Center Logo */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs md:text-sm tracking-[0.4em] font-semibold text-amber-500 uppercase">
            DJ
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[0.35em] text-white font-['Syne']">
            PRAXX
          </h1>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-400 uppercase mt-1">
            ENTER THE NIGHT
          </span>
        </div>
      </div>

      {/* Status & Progress */}
      <div className="w-full max-w-md flex flex-col items-center gap-3">
        <span className="text-xs md:text-sm tracking-[0.25em] text-amber-400 uppercase font-mono animate-pulse">
          INITIALIZING NIGHT...
        </span>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full transition-all duration-200 shadow-[0_0_12px_#f07c22]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex justify-between items-center text-[10px] md:text-xs text-zinc-500 font-mono">
          <span>LOADING ASSETS</span>
          <span className="text-amber-400 font-semibold">{progress}%</span>
        </div>
      </div>

      {/* Storyboard 01 Footers */}
      <div className="absolute bottom-8 left-8 text-left hidden sm:block">
        <div className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
          MUSIC • PEOPLE • MOMENTS • FOREVER
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-right hidden sm:block">
        <div className="text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
          A HIGHER STATE TOGETHER
        </div>
      </div>
    </div>
  );
};
