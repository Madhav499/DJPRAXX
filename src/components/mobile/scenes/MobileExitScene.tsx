import React from 'react';
import { RotateCcw } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileExitSceneProps {
  onReplay: () => void;
}

export const MobileExitScene: React.FC<MobileExitSceneProps> = ({ onReplay }) => {
  const handleReplay = () => {
    AudioEngine.triggerLightPulseSound();
    onReplay();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 select-none bg-black overflow-hidden">
      {/* Background Empty Arena Image (Storyboard 18) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-60"
        style={{
          backgroundImage: 'url(/assets/mobile/venue_exit.jpg)',
          filter: 'contrast(1.1) brightness(0.75)',
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/60 to-black/80 pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          18 • EXIT EXPERIENCE
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          20 / 20
        </span>
      </div>

      {/* Center Atmospheric Reflections (Storyboard 18) */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto w-full max-w-xs mx-auto">
        <span className="text-xs tracking-[0.4em] font-semibold text-amber-500 uppercase">
          DJ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-white font-['Syne'] mt-1 text-glow">
          PRAXX
        </h1>

        <div className="w-12 h-[2px] bg-amber-500 my-3" />

        <h3 className="text-sm font-extrabold tracking-[0.15em] text-zinc-200 font-['Space_Grotesk'] uppercase leading-relaxed">
          STILL LISTENING.<br />
          STILL LEARNING.<br />
          STILL PLAYING.
        </h3>

        <p className="text-xs font-serif italic text-amber-300 mt-4">
          The story is still playing...
        </p>
      </div>

      {/* Bottom Replay Action */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={handleReplay}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          aria-label="Replay Experience"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
          <span>REPLAY EXPERIENCE</span>
        </button>
      </div>
    </div>
  );
};
