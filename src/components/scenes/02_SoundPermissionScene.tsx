import React from 'react';
import { Volume2 } from 'lucide-react';
import { HowlerEngine } from '../../audio/howlerEngine';

interface SoundPermissionSceneProps {
  onEnter: (soundEnabled: boolean) => void;
}

export const SoundPermissionScene: React.FC<SoundPermissionSceneProps> = ({ onEnter }) => {
  const handleSoundOn = async () => {
    await HowlerEngine.startAudio();
    onEnter(true);
  };

  const handleMutedEnter = () => {
    onEnter(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background portal lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/15 blur-[140px] pointer-events-none" />

      {/* Brand & Subtitle */}
      <div className="flex flex-col items-center mb-10">
        <span className="text-xs md:text-sm tracking-[0.4em] font-semibold text-amber-500 uppercase">
          DJ
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-[0.3em] text-white font-['Syne'] mt-1">
          PRAXX
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />
        <span className="text-xs md:text-sm tracking-[0.35em] text-zinc-300 font-['Space_Grotesk'] uppercase">
          ENTER THE NIGHT
        </span>
      </div>

      {/* Interactive Sound Portal Button */}
      <div className="relative flex flex-col items-center gap-6 my-4">
        <button
          onClick={handleSoundOn}
          className="group relative w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500 shadow-[0_0_35px_rgba(240,124,34,0.3)] hover:shadow-[0_0_60px_rgba(240,124,34,0.6)] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          aria-label="Enter with Sound On"
        >
          {/* Animated pulse rings */}
          <span className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping opacity-60 pointer-events-none" />
          <span className="absolute -inset-2 rounded-full border border-amber-400/20 animate-pulse pointer-events-none" />

          {/* Sound Icon */}
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-1">
            <Volume2 className="w-6 h-6" />
          </div>

          <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-white uppercase font-['Space_Grotesk'] group-hover:text-amber-300 transition-colors">
            SOUND ON
          </span>
        </button>

        {/* Caption */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs md:text-sm tracking-[0.25em] text-zinc-400 uppercase font-['Space_Grotesk']">
            MUSIC CONNECTS PEOPLE
          </span>
          <span className="text-[11px] tracking-[0.2em] text-amber-500/90 font-mono">
            CLICK TO ENTER
          </span>
        </div>

        {/* Alternative Muted Enter */}
        <button
          onClick={handleMutedEnter}
          className="text-[10px] md:text-xs tracking-[0.2em] text-zinc-500 hover:text-zinc-300 uppercase underline decoration-zinc-700 underline-offset-4 transition-colors"
        >
          Continue in Silent Mode
        </button>
      </div>

      {/* Storyboard 02 Callout */}
      <div className="absolute bottom-8 text-center">
        <span className="text-[11px] tracking-[0.3em] text-zinc-500 font-['Space_Grotesk'] uppercase">
          GOOD MUSIC BETTER PEOPLE
        </span>
      </div>
    </div>
  );
};
