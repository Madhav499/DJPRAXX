import React, { useState, useRef } from 'react';
import { Play, Pause, Disc, ChevronRight } from 'lucide-react';
import { HowlerEngine } from '../../audio/howlerEngine';

interface InteractiveDJBoothProps {
  onNext: () => void;
}

export const InteractiveDJBooth: React.FC<InteractiveDJBoothProps> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [deckAPitch, setDeckAPitch] = useState(0);
  const [deckBPitch, setDeckBPitch] = useState(0);
  const [crossfader, setCrossfader] = useState(50);
  const [filterKnob, setFilterKnob] = useState(50); // 50 = flat/open
  const [lowEq, setLowEq] = useState(50);
  const [midEq, setMidEq] = useState(50);
  const [highEq, setHighEq] = useState(50);
  const [deckARotation, setDeckARotation] = useState(0);
  const [deckBRotation, setDeckBRotation] = useState(0);

  const isScratchingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const handlePlayToggle = () => {
    HowlerEngine.togglePlay();
    setIsPlaying(!isPlaying);
  };

  const handleFilterChange = (val: number) => {
    setFilterKnob(val);
    // 0 to 100 normalized to 0 to 1
    HowlerEngine.setDJFilter(val / 100);
  };

  // Jogwheel scratch interaction Deck A
  const handleScratchStart = (e: React.MouseEvent | React.TouchEvent) => {
    isScratchingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    lastMouseXRef.current = clientX;
  };

  const handleScratchMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratchingRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastMouseXRef.current;
    lastMouseXRef.current = clientX;

    if (Math.abs(deltaX) > 2) {
      setDeckARotation((prev) => prev + deltaX * 1.5);
      HowlerEngine.triggerScratch(deltaX / 10);
    }
  };

  const handleScratchEnd = () => {
    isScratchingRef.current = false;
  };

  return (
    <div
      onMouseMove={handleScratchMove}
      onTouchMove={handleScratchMove}
      onMouseUp={handleScratchEnd}
      onTouchEnd={handleScratchEnd}
      className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 09 • INTERACTIVE DJ BOOTH
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          TOUCH • EXPLORE • MIX • FEEL
        </h2>
        <span className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-wider">
          Scratch the jogwheels with your mouse/touch, tweak the color filter, or crossfade.
        </span>
      </div>

      {/* Pioneer CDJ / DJM Hardware Interface Layout */}
      <div className="w-full max-w-5xl my-4 p-4 md:p-6 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* DECK A (Pioneer CDJ style) */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] font-bold text-amber-400 font-mono">DECK A</span>
              <span className="text-[10px] text-zinc-500 font-mono">124.0 BPM</span>
            </div>

            {/* Simulated Track Waveform Display */}
            <div className="w-full h-8 bg-zinc-900/90 rounded border border-zinc-800 flex items-center justify-between px-2 mb-3 overflow-hidden">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-500/70 rounded-full"
                  style={{ height: `${20 + ((i * 13) % 70)}%` }}
                />
              ))}
            </div>

            {/* Interactive Motorized Jogwheel */}
            <div
              onMouseDown={handleScratchStart}
              onTouchStart={handleScratchStart}
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-zinc-900 border-4 border-zinc-700 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:border-amber-500/80 transition-colors"
              style={{
                transform: `rotate(${deckARotation}deg)`,
              }}
            >
              {/* Outer Grooved Texture Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-zinc-600/40 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-zinc-700/60 pointer-events-none" />

              {/* Center Platter Display */}
              <div className="w-20 h-20 rounded-full bg-black border border-amber-500/60 flex flex-col items-center justify-center shadow-[inset_0_0_15px_#f07c22] pointer-events-none">
                <span className="text-[9px] font-bold text-amber-400 font-mono">PRAXX</span>
                <span className="text-[8px] text-zinc-400 font-mono">SCRATCH</span>
              </div>
            </div>

            {/* Cue & Play Buttons + Pitch */}
            <div className="w-full flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => HowlerEngine.triggerLightPulseSound()}
                  className="w-11 h-11 rounded-full bg-orange-950/80 border border-orange-500/80 text-orange-400 font-bold text-xs flex items-center justify-center hover:bg-orange-900 shadow-md active:scale-95"
                >
                  CUE
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="w-11 h-11 rounded-full bg-green-950/80 border border-green-500/80 text-green-400 font-bold text-xs flex items-center justify-center hover:bg-green-900 shadow-md active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Pitch Fader */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-mono">PITCH</span>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  value={deckAPitch}
                  onChange={(e) => setDeckAPitch(Number(e.target.value))}
                  className="w-20 accent-amber-500 h-1 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* CENTER MIXER (DJM style) */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center">
            <span className="text-[11px] font-bold text-white tracking-[0.2em] uppercase font-mono mb-2">
              PRAXX DJM-900
            </span>

            {/* 3-Band EQ Knobs */}
            <div className="grid grid-cols-3 gap-3 w-full my-2 text-center">
              <div>
                <span className="text-[9px] text-zinc-400 font-mono block mb-1">HI</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={highEq}
                  onChange={(e) => setHighEq(Number(e.target.value))}
                  className="w-14 accent-amber-500 h-1 bg-zinc-800 rounded"
                />
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 font-mono block mb-1">MID</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={midEq}
                  onChange={(e) => setMidEq(Number(e.target.value))}
                  className="w-14 accent-amber-500 h-1 bg-zinc-800 rounded"
                />
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 font-mono block mb-1">LOW</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lowEq}
                  onChange={(e) => setLowEq(Number(e.target.value))}
                  className="w-14 accent-amber-500 h-1 bg-zinc-800 rounded"
                />
              </div>
            </div>

            {/* Sound Color Filter Sweep Knob */}
            <div className="w-full flex flex-col items-center my-3 p-2 bg-zinc-900/60 rounded-xl border border-white/5">
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider mb-1">
                COLOR FILTER SWEEP
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={filterKnob}
                onChange={(e) => handleFilterChange(Number(e.target.value))}
                className="w-48 accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="w-48 flex justify-between text-[8px] text-zinc-500 font-mono mt-1">
                <span>LPF (DARK)</span>
                <span>FLAT</span>
                <span>HPF (BRIGHT)</span>
              </div>
            </div>

            {/* Crossfader */}
            <div className="w-full flex flex-col items-center mt-3 pt-3 border-t border-zinc-800">
              <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest mb-1">
                CROSSFADER
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={crossfader}
                onChange={(e) => setCrossfader(Number(e.target.value))}
                className="w-52 accent-amber-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="w-52 flex justify-between text-[9px] font-mono text-zinc-400 mt-1">
                <span>A</span>
                <span>B</span>
              </div>
            </div>
          </div>

          {/* DECK B (Right Player) */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] font-bold text-amber-400 font-mono">DECK B</span>
              <span className="text-[10px] text-zinc-500 font-mono">126.0 BPM</span>
            </div>

            {/* Track Waveform */}
            <div className="w-full h-8 bg-zinc-900/90 rounded border border-zinc-800 flex items-center justify-between px-2 mb-3 overflow-hidden">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-amber-600/70 rounded-full"
                  style={{ height: `${30 + ((i * 19) % 60)}%` }}
                />
              ))}
            </div>

            {/* Motorized Jogwheel B */}
            <div
              onClick={() => {
                setDeckBRotation((prev) => prev + 35);
                HowlerEngine.triggerScratch(2);
              }}
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-950 to-zinc-900 border-4 border-zinc-700 shadow-2xl flex items-center justify-center cursor-pointer hover:border-amber-500/80 transition-colors"
              style={{
                transform: `rotate(${deckBRotation}deg)`,
              }}
            >
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-zinc-600/40 pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-black border border-amber-500/60 flex flex-col items-center justify-center shadow-[inset_0_0_15px_#f07c22] pointer-events-none">
                <span className="text-[9px] font-bold text-amber-400 font-mono">PRAXX</span>
                <span className="text-[8px] text-zinc-400 font-mono">CUE SYNC</span>
              </div>
            </div>

            {/* Cue & Play Buttons Deck B */}
            <div className="w-full flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => HowlerEngine.triggerLightPulseSound()}
                  className="w-11 h-11 rounded-full bg-orange-950/80 border border-orange-500/80 text-orange-400 font-bold text-xs flex items-center justify-center hover:bg-orange-900 shadow-md active:scale-95"
                >
                  CUE
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="w-11 h-11 rounded-full bg-green-950/80 border border-green-500/80 text-green-400 font-bold text-xs flex items-center justify-center hover:bg-green-900 shadow-md active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-mono">PITCH</span>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  value={deckBPitch}
                  onChange={(e) => setDeckBPitch(Number(e.target.value))}
                  className="w-20 accent-amber-500 h-1 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button to proceed to MUSIC destination */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_25px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>EXPLORE PRAXX RADIO</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
