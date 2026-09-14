import React, { useState } from 'react';
import { Flame, Zap, Wind, Radio, ChevronRight } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

interface InteractiveStageSceneProps {
  onNext: () => void;
  onTriggerFX: () => void;
}

export const InteractiveStageScene: React.FC<InteractiveStageSceneProps> = ({
  onNext,
  onTriggerFX,
}) => {
  const [energy, setEnergy] = useState(88);
  const [activeFX, setActiveFX] = useState<string | null>(null);

  const handleTriggerStrobe = () => {
    setActiveFX('strobe');
    AudioEngine.triggerLightPulseSound();
    onTriggerFX();
    setEnergy((prev) => Math.min(100, prev + 3));
    setTimeout(() => setActiveFX(null), 600);
  };

  const handleTriggerPyro = () => {
    setActiveFX('pyro');
    AudioEngine.triggerPyroDropSound();
    onTriggerFX();
    setEnergy((prev) => Math.min(100, prev + 5));
    setTimeout(() => setActiveFX(null), 1000);
  };

  const handleTriggerCO2 = () => {
    setActiveFX('co2');
    AudioEngine.triggerPyroDropSound();
    onTriggerFX();
    setEnergy((prev) => Math.min(100, prev + 4));
    setTimeout(() => setActiveFX(null), 800);
  };

  const handleTriggerLaser = () => {
    setActiveFX('laser');
    AudioEngine.triggerLightPulseSound();
    onTriggerFX();
    setEnergy((prev) => Math.min(100, prev + 2));
    setTimeout(() => setActiveFX(null), 700);
  };

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-6 text-center select-none">
      {/* Full screen FX flash overlays */}
      {activeFX === 'strobe' && (
        <div className="fixed inset-0 bg-white/40 pointer-events-none z-50 animate-strobe" />
      )}
      {activeFX === 'pyro' && (
        <div className="fixed inset-0 bg-amber-500/25 pointer-events-none z-50 transition-opacity duration-300" />
      )}
      {activeFX === 'co2' && (
        <div className="fixed inset-0 bg-zinc-200/30 backdrop-blur-sm pointer-events-none z-50 transition-opacity duration-500" />
      )}

      {/* Header & Crowd Energy Meter */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 07 • INTERACTIVE STAGE
          </span>
        </div>

        {/* Live Crowd Energy Meter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase font-mono">
            CROWD ENERGY
          </span>
          <div className="w-32 md:w-44 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-300 shadow-[0_0_10px_#f07c22]"
              style={{ width: `${energy}%` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-amber-400">{energy}%</span>
        </div>
      </div>

      {/* Center Interactive Instructions */}
      <div className="my-auto flex flex-col items-center gap-4 max-w-xl">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          CONTROL THE ARENA
        </h2>
        <p className="text-xs md:text-sm text-zinc-300 tracking-[0.15em] font-['Space_Grotesk']">
          Move cursor across the viewport to sweep stage lighting beams. Trigger live festival production FX below.
        </p>

        {/* 4 Interactive Trigger Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-4">
          <button
            onClick={handleTriggerStrobe}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-amber-400 transition-all active:scale-95 group shadow-lg"
          >
            <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] tracking-wider font-bold uppercase text-white font-mono">
              STROBE FX
            </span>
          </button>

          <button
            onClick={handleTriggerPyro}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-orange-400 transition-all active:scale-95 group shadow-lg"
          >
            <Flame className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] tracking-wider font-bold uppercase text-white font-mono">
              PYRO FLAME
            </span>
          </button>

          <button
            onClick={handleTriggerCO2}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400 transition-all active:scale-95 group shadow-lg"
          >
            <Wind className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] tracking-wider font-bold uppercase text-white font-mono">
              CO2 CANNON
            </span>
          </button>

          <button
            onClick={handleTriggerLaser}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-amber-400 transition-all active:scale-95 group shadow-lg"
          >
            <Radio className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] tracking-wider font-bold uppercase text-white font-mono">
              LASER FAN
            </span>
          </button>
        </div>
      </div>

      {/* Advance to DJ Booth */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>APPROACH DJ BOOTH</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
