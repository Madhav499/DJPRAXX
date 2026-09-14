import React, { useEffect } from 'react';

interface TransitionSceneProps {
  onComplete: () => void;
}

export const TransitionScene: React.FC<TransitionSceneProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 text-center select-none bg-black overflow-hidden cursor-pointer"
    >
      {/* Warp Speed Tunnel Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-amber-500/40"
            style={{
              width: `${(i + 1) * 16}vw`,
              height: `${(i + 1) * 16}vw`,
              animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}

        {/* Light streak lines */}
        {[...Array(16)].map((_, i) => (
          <div
            key={`streak-${i}`}
            className="absolute w-[2px] h-[40vh] bg-gradient-to-t from-transparent via-amber-400 to-transparent opacity-40"
            style={{
              transform: `rotate(${i * 22.5}deg) translateY(-20vh)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.35em] text-white font-['Syne'] uppercase">
          LET THE MUSIC TAKE YOU
        </h2>
        <div className="w-24 h-1 bg-amber-500 rounded-full shadow-[0_0_15px_#f07c22]" />
        <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-mono mt-2">
          ENTERING DIGITAL NIGHT WORLD...
        </span>
      </div>
    </div>
  );
};
