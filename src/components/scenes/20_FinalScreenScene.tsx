import React from 'react';
import { RotateCcw, Disc } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

interface FinalScreenSceneProps {
  onReplay: () => void;
}

export const FinalScreenScene: React.FC<FinalScreenSceneProps> = ({ onReplay }) => {
  const handleReplayClick = () => {
    AudioEngine.triggerLightPulseSound();
    onReplay();
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none text-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Disc className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 20 • FINAL SCREEN
        </span>
      </div>

      {/* Main Final Manifesto Card (Storyboard 20) */}
      <div className="relative flex flex-col items-center my-auto max-w-xl">
        <div className="flex flex-col items-center mb-6">
          <span className="text-xs md:text-sm tracking-[0.4em] font-semibold text-amber-500 uppercase">
            DJ
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-[0.35em] text-white font-['Syne'] uppercase text-glow">
            PRAXX
          </h1>
          <span className="text-xs tracking-[0.3em] text-zinc-400 font-mono uppercase mt-1">
            RAJKOT • GUJARAT • INDIA
          </span>
        </div>

        {/* 3 Core Tenets */}
        <div className="flex flex-col gap-2 my-4">
          <span className="text-sm md:text-base tracking-[0.3em] font-bold text-zinc-200 font-['Space_Grotesk'] uppercase">
            STILL LISTENING.
          </span>
          <span className="text-sm md:text-base tracking-[0.3em] font-bold text-amber-400 font-['Space_Grotesk'] uppercase">
            STILL LEARNING.
          </span>
          <span className="text-sm md:text-base tracking-[0.3em] font-bold text-white font-['Space_Grotesk'] uppercase text-glow">
            STILL PLAYING.
          </span>
        </div>

        <p className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-widest uppercase mt-3">
          THE STORY IS STILL PLAYING...
        </p>

        {/* Social Connection Channels */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {[
            { name: 'INSTAGRAM', link: 'https://instagram.com' },
            { name: 'SOUNDCLOUD', link: 'https://soundcloud.com' },
            { name: 'SPOTIFY', link: 'https://spotify.com' },
            { name: 'YOUTUBE', link: 'https://youtube.com' },
            { name: 'WHATSAPP', link: 'https://whatsapp.com' },
          ].map((soc) => (
            <a
              key={soc.name}
              href={soc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-amber-500 hover:text-black border border-white/10 text-[10px] font-mono tracking-widest text-zinc-300 transition-all shadow-sm"
            >
              {soc.name}
            </a>
          ))}
        </div>
      </div>

      {/* Replay Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleReplayClick}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:scale-105 transition-all shadow-[0_0_25px_rgba(240,124,34,0.6)] active:scale-95"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
          <span>REPLAY NIGHT JOURNEY</span>
        </button>
      </div>
    </div>
  );
};
