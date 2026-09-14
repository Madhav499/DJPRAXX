import React, { useState, useRef } from 'react';
import { Play, Pause, Disc, ArrowRight } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileDJBoothSceneProps {
  onNext: () => void;
}

export const MobileDJBoothScene: React.FC<MobileDJBoothSceneProps> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(() => AudioEngine.getState().isPlaying);
  const [filterVal, setFilterVal] = useState(50);
  const [crossfaderVal, setCrossfaderVal] = useState(50);
  const [jogAngle, setJogAngle] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);

  const isScratchingRef = useRef(false);
  const lastTouchPosRef = useRef({ x: 0, y: 0 });

  const handlePlayToggle = () => {
    AudioEngine.togglePlay();
    setIsPlaying(!isPlaying);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFilterVal(val);
    AudioEngine.setDJFilter(val / 100);
  };

  const handleCrossfaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCrossfaderVal(val);
    AudioEngine.setVolume(val / 100);
  };

  // Jogwheel touch scratch
  const handleJogTouchStart = (e: React.TouchEvent) => {
    isScratchingRef.current = true;
    const touch = e.touches[0];
    lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleJogTouchMove = (e: React.TouchEvent) => {
    if (!isScratchingRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchPosRef.current.x;
    const dy = touch.clientY - lastTouchPosRef.current.y;
    lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };

    const delta = dx + dy;
    if (Math.abs(delta) > 1) {
      setJogAngle((prev) => prev + delta * 2);
      AudioEngine.triggerScratch(delta / 12);
    }
  };

  const handleJogTouchEnd = () => {
    isScratchingRef.current = false;
  };

  const handleCuePad = (padIndex: number) => {
    setActivePad(padIndex);
    AudioEngine.triggerLightPulseSound();
    setTimeout(() => setActivePad(null), 200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 pb-16 select-none overflow-hidden bg-black">
      {/* Background DJ Booth Imagery (Storyboard 07) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: 'url(/assets/mobile/dj_booth.jpg)',
          filter: 'contrast(1.2) brightness(0.6)',
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-black/90 pointer-events-none" />

      {/* Top Tag & Progress */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase font-bold">
          07 • DJ BOOTH
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          04 / 20
        </span>
      </div>

      {/* Center Console: Physical CDJ Deck Composition */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-4 my-auto">
        {/* Header Titles */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-[0.2em] text-white font-['Syne'] uppercase text-glow">
            FEEL • MIX • EXPLORE
          </h2>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wider mt-0.5">
            REAL CONTROLS. REAL ENERGY.
          </p>
        </div>

        {/* Interactive Illuminated Jogwheel Platter */}
        <div
          onTouchStart={handleJogTouchStart}
          onTouchMove={handleJogTouchMove}
          onTouchEnd={handleJogTouchEnd}
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-4 border-zinc-700 shadow-[0_0_35px_rgba(240,124,34,0.35)] flex items-center justify-center cursor-grab active:cursor-grabbing group touch-none"
        >
          {/* Glowing Amber Jog Ring */}
          <div
            className="absolute inset-1 rounded-full border-2 border-amber-500/80 shadow-[0_0_15px_#f59e0b] pointer-events-none transition-transform"
            style={{ transform: `rotate(${jogAngle}deg)` }}
          >
            {/* White index marker on platter */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
          </div>

          {/* Vinyl Platter Grooves */}
          <div
            className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center"
            style={{ transform: `rotate(${jogAngle}deg)` }}
          >
            {/* Center LCD Display */}
            <div className="w-16 h-16 rounded-full bg-black border border-amber-500/50 flex flex-col items-center justify-center text-center shadow-inner">
              <Disc className={`w-5 h-5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-[8px] font-mono text-amber-300 font-bold mt-0.5">
                {isPlaying ? 'PLAY' : 'CUE'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Slider & Crossfader */}
        <div className="w-full bg-zinc-950/90 border border-white/10 rounded-2xl p-3 flex flex-col gap-2.5 backdrop-blur-md">
          {/* Filter Cutoff */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span className="text-amber-400 font-bold">SOUND COLOR FILTER</span>
              <span>{filterVal < 50 ? `LOWPASS ${filterVal}%` : filterVal > 50 ? `HIGHPASS ${filterVal}%` : 'FLAT'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filterVal}
              onChange={handleFilterChange}
              className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg"
              aria-label="Sound Color Filter"
            />
          </div>

          {/* Crossfader */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span className="text-amber-400 font-bold">CROSSFADER</span>
              <span>CH A ← {crossfaderVal}% → CH B</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={crossfaderVal}
              onChange={handleCrossfaderChange}
              className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg"
              aria-label="Crossfader"
            />
          </div>

          {/* 4 Performance Cue Pads */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {['HOT CUE', 'LOOP', 'ROLL', 'SAMPLER'].map((pad, idx) => (
              <button
                key={pad}
                onClick={() => handleCuePad(idx)}
                className={`py-2 rounded-lg text-[8px] font-mono font-bold tracking-wider uppercase border transition-all ${
                  activePad === idx
                    ? 'bg-amber-400 border-white text-black shadow-[0_0_12px_#f59e0b]'
                    : 'bg-zinc-900 border-amber-500/30 text-amber-300 hover:bg-zinc-800'
                }`}
              >
                {pad}
              </button>
            ))}
          </div>

          {/* Play/Pause Master Deck Trigger */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePlayToggle}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_#f59e0b]'
                  : 'bg-zinc-900 border border-white/10 text-zinc-300'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'DECK ACTIVE' : 'CUE PLAY'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA to PRAXX Radio */}
      <div className="relative z-10 w-full max-w-xs pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>TUNE INTO PRAXX RADIO</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
