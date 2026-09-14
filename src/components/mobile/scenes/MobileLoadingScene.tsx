import React, { useEffect, useState } from 'react';

interface MobileLoadingSceneProps {
  onComplete: () => void;
}

export const MobileLoadingScene: React.FC<MobileLoadingSceneProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        const step = Math.floor(Math.random() * 14) + 8;
        return Math.min(100, prev + step);
      });
    }, 160);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-black text-center select-none overflow-hidden">
      {/* Background Deep Fog & Amber Beam */}
      <div className="absolute top-1/4 w-[320px] h-[320px] rounded-full bg-amber-600/15 blur-[90px] pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase">
          01 • LOADING
        </span>
      </div>

      {/* Center: Glowing Sound Sphere / Sonic Planet */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Orbital rings */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-500/25 animate-[spin_16s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/35 animate-[spin_10s_linear_infinite_reverse]" />
          
          {/* Sonic Sphere / Planet */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-600/30 via-zinc-900 to-black border border-amber-500/50 shadow-[0_0_40px_rgba(240,124,34,0.4)] flex items-center justify-center relative overflow-hidden">
            {/* Waveform glow pulse inside */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.3)_0%,transparent_70%)] animate-pulse" />
            <div className="flex items-end gap-1 h-12 z-10">
              {[0.4, 0.8, 1, 0.7, 0.9, 0.5, 0.85].map((scale, i) => (
                <span
                  key={`wave-${i}`}
                  className="w-1 rounded-full bg-amber-300 animate-pulse"
                  style={{
                    height: `${scale * 100}%`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="mt-6 flex flex-col items-center">
          <span className="text-[11px] tracking-[0.35em] font-bold text-amber-500 font-mono uppercase">
            DJ
          </span>
          <h1 className="text-3xl font-black tracking-[0.3em] text-white font-['Syne'] mt-0.5">
            PRAXX
          </h1>
          <span className="text-[10px] tracking-[0.25em] text-zinc-400 font-['Space_Grotesk'] uppercase mt-1">
            INITIALIZING NIGHT...
          </span>
        </div>
      </div>

      {/* Bottom: Travelling Light Beam & Progress Status */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4 pb-6">
        {/* Dynamic Percentage */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-400">
          <span className="text-amber-500 font-bold">POWERING RIG</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>

        {/* Travelling Light Beam Track */}
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-white shadow-[0_0_12px_#f59e0b] rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Storyboard 01 Pillars */}
        <div className="flex items-center justify-between w-full pt-2 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
          <span>• MUSIC</span>
          <span>• PEOPLE</span>
          <span>• MOMENTS</span>
          <span>• FOREVER</span>
        </div>
      </div>
    </div>
  );
};
