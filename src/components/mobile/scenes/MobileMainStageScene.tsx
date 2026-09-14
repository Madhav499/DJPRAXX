import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileMainStageSceneProps {
  onNext: () => void;
}

export const MobileMainStageScene: React.FC<MobileMainStageSceneProps> = ({ onNext }) => {
  const [strobeActive, setStrobeActive] = useState(false);
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const analysis = AudioEngine.getAudioAnalysis();
      setEnergy(analysis.overall);
      if (analysis.beatTrigger && Math.random() > 0.6) {
        setStrobeActive(true);
        setTimeout(() => setStrobeActive(false), 90);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTriggerPyroFX = () => {
    setStrobeActive(true);
    AudioEngine.triggerPyroDropSound();
    setTimeout(() => setStrobeActive(false), 300);
  };

  return (
    <div
      onClick={handleTriggerPyroFX}
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 select-none overflow-hidden"
    >
      {/* Photographic Concert Stage Background (Storyboard 05) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700"
        style={{
          backgroundImage: 'url(/assets/mobile/stage_crowd.jpg)',
          filter: `brightness(${0.85 + energy * 0.3}) contrast(1.1)`,
          transform: `scale(${1 + energy * 0.03})`,
        }}
      />

      {/* Real-time Pyro / Strobe Flash Layer */}
      {strobeActive && (
        <div className="absolute inset-0 bg-white/40 pointer-events-none mix-blend-screen transition-opacity duration-150 animate-strobe" />
      )}

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/75 pointer-events-none" />

      {/* Top Tag & Info */}
      <div className="relative z-10 pt-4 flex items-center justify-between w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase font-bold">
          05 • MAIN STAGE REVEAL
        </span>
        <span className="text-[10px] font-mono text-zinc-300">
          03 / 20
        </span>
      </div>

      {/* Center Stage Typographic Script Overlay (Storyboard 05) */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-4 max-w-xs pointer-events-none">
        <span className="text-[11px] tracking-[0.35em] font-mono text-amber-500 font-extrabold uppercase">
          LIVE AT THE ARENA
        </span>
        <h2 className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          DJ PRAXX
        </h2>

        {/* Handcrafted Script Overlay matching Storyboard */}
        <div className="mt-2 text-2xl sm:text-3xl font-serif italic text-amber-300 tracking-wide font-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          A Higher State Together
        </div>

        {/* Interactive Strobe Affordance */}
        <div className="mt-5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md flex items-center gap-1.5 text-[9px] font-mono text-amber-400 animate-pulse">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>TAP ANYWHERE TO FIRE PYRO FX</span>
        </div>
      </div>

      {/* Bottom CTA to Approach DJ Booth */}
      <div className="relative z-10 w-full max-w-xs pb-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3.5 rounded-full bg-zinc-950/90 border border-amber-500/60 text-white font-bold text-xs tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_25px_rgba(240,124,34,0.3)] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2 group backdrop-blur-md"
          aria-label="Approach DJ Booth"
        >
          <span>APPROACH DJ BOOTH</span>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
