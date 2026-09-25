import React, { useState } from 'react';
import { Volume2, ChevronUp } from 'lucide-react';
import { HowlerEngine } from '../../../audio/howlerEngine';

interface MobileSoundGateSceneProps {
  onEnter: () => void;
}

export const MobileSoundGateScene: React.FC<MobileSoundGateSceneProps> = ({ onEnter }) => {
  const [isActivating, setIsActivating] = useState(false);

  const handleSoundOn = async () => {
    setIsActivating(true);
    await HowlerEngine.startAudio();
    HowlerEngine.triggerLightPulseSound();
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-black via-zinc-950 to-black text-center select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 w-[360px] h-[360px] rounded-full bg-amber-600/20 blur-[110px] pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-4 flex items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase">
          02 • SOUND GATE
        </span>
      </div>

      {/* Brand & Subtitle */}
      <div className="flex flex-col items-center mt-4">
        <span className="text-xs tracking-[0.4em] font-semibold text-amber-500 uppercase">
          DJ
        </span>
        <h1 className="text-4xl font-black tracking-[0.3em] text-white font-['Syne'] mt-1">
          PRAXX
        </h1>
        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent my-2" />
        <span className="text-[11px] tracking-[0.35em] text-zinc-300 font-['Space_Grotesk'] uppercase">
          ENTER THE NIGHT
        </span>
      </div>

      {/* Center: Physical Central Lighting Lens Button (Storyboard 02) */}
      <div className="relative flex flex-col items-center gap-6 my-auto">
        <button
          onClick={handleSoundOn}
          className={`group relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-amber-500/60 shadow-[0_0_40px_rgba(240,124,34,0.45)] active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
            isActivating ? 'scale-110 border-white shadow-[0_0_60px_#ffffff]' : ''
          }`}
          aria-label="Sound On - Enter DJ PRAXX"
        >
          {/* Animated pulse rings */}
          <span className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping opacity-60 pointer-events-none" />
          <span className="absolute -inset-3 rounded-full border border-amber-400/20 animate-pulse pointer-events-none" />

          {/* Physical Lens Reflection */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600/40 to-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform mb-2">
            <Volume2 className="w-7 h-7" />
          </div>

          <span className="text-xs font-bold tracking-[0.25em] text-white uppercase font-['Space_Grotesk'] group-hover:text-amber-300 transition-colors">
            SOUND ON
          </span>
          <span className="text-[9px] font-mono text-amber-400/80 tracking-widest mt-0.5">
            TAP TO ACTIVATE
          </span>
        </button>

        {/* Silhouette Corridor Atmosphere */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs tracking-[0.25em] text-zinc-400 uppercase font-['Space_Grotesk']">
            MUSIC CONNECTS PEOPLE
          </span>
        </div>
      </div>

      {/* Bottom: Swipe up or tap prompt */}
      <div
        onClick={handleSoundOn}
        className="w-full flex flex-col items-center gap-1 pb-4 cursor-pointer text-zinc-500 hover:text-amber-400 transition-colors"
      >
        <ChevronUp className="w-5 h-5 animate-bounce text-amber-500" />
        <span className="text-[10px] tracking-[0.3em] font-mono uppercase">
          SWIPE UP TO EXPLORE
        </span>
      </div>
    </div>
  );
};
