import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileSoundUniverseSceneProps {
  onNext: () => void;
}

interface GenreNode {
  name: string;
  angle: number; // in degrees
  color: string;
  filterCutoff: number;
}

const GENRES: GenreNode[] = [
  { name: 'EDM', angle: 0, color: '#f59e0b', filterCutoff: 0.8 },
  { name: 'HOUSE', angle: 72, color: '#f97316', filterCutoff: 0.5 },
  { name: 'TECHNO', angle: 144, color: '#ef4444', filterCutoff: 0.3 },
  { name: 'RETRO', angle: 216, color: '#ec4899', filterCutoff: 0.6 },
  { name: 'BOLLYWOOD', angle: 288, color: '#eab308', filterCutoff: 0.7 },
];

export const MobileSoundUniverseScene: React.FC<MobileSoundUniverseSceneProps> = ({ onNext }) => {
  const [rotation, setRotation] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string>('EDM');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    setRotation((prev) => prev + deltaX * 0.4);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleSelectGenre = (genre: GenreNode) => {
    setSelectedGenre(genre.name);
    AudioEngine.setDJFilter(genre.filterCutoff);
    AudioEngine.triggerLightPulseSound();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 pb-16 select-none overflow-hidden bg-black"
    >
      {/* Background Dynamic Atmospheric Aura based on selected genre */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor:
            selectedGenre === 'TECHNO'
              ? 'rgba(239, 68, 68, 0.2)'
              : selectedGenre === 'RETRO'
              ? 'rgba(236, 72, 153, 0.2)'
              : selectedGenre === 'HOUSE'
              ? 'rgba(249, 115, 22, 0.2)'
              : 'rgba(245, 158, 11, 0.25)',
        }}
      />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          09 • SOUND UNIVERSE
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          05 / 20
        </span>
      </div>

      {/* Center 3D Orbiting Genre Cosmos (Storyboard 09) */}
      <div className="relative z-10 flex flex-col items-center my-auto w-full max-w-xs">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
            PRAXX
          </h2>
          <span className="text-[11px] tracking-[0.3em] font-mono text-amber-400 uppercase">
            SOUND UNIVERSE
          </span>
        </div>

        {/* Orbit System Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Orbital Orbit Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-white/15 pointer-events-none" />

          {/* Central Living Sonic Sphere */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 border-2 border-white shadow-[0_0_40px_rgba(240,124,34,0.7)] flex flex-col items-center justify-center text-center p-2">
            <span className="text-[9px] font-black font-mono text-black uppercase tracking-wider">
              PRAXX
            </span>
            <span className="text-[7px] font-bold text-black/80 tracking-widest uppercase mt-0.5">
              ACTIVE GENRE
            </span>
            <span className="text-xs font-black text-black tracking-wider uppercase mt-0.5">
              {selectedGenre}
            </span>
          </div>

          {/* 5 Orbiting Genre Nodes */}
          {GENRES.map((g) => {
            const currentAngle = (g.angle + rotation) * (Math.PI / 180);
            const radius = 105; // px from center
            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;
            const isCurrent = selectedGenre === g.name;

            return (
              <button
                key={g.name}
                onClick={() => handleSelectGenre(g)}
                className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-center transition-transform duration-100 active:scale-95 ${
                  isCurrent
                    ? 'bg-amber-400 border-2 border-white text-black font-black shadow-[0_0_20px_#f59e0b] scale-110 z-20'
                    : 'bg-zinc-950/90 border border-amber-500/40 text-amber-300 font-bold hover:border-amber-400 z-10'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                aria-label={`Select ${g.name} Genre`}
              >
                <span className="text-[8px] font-mono tracking-wider">{g.name}</span>
              </button>
            );
          })}
        </div>

        {/* Gesture Hint */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            DRAG TO ROTATE UNIVERSE
          </p>
          <p className="text-[9px] font-mono text-amber-500 mt-0.5">
            TAP A GENRE • EXPLORE A NEW SOUND
          </p>
        </div>
      </div>

      {/* Bottom CTA to Events Archive */}
      <div className="relative z-10 w-full max-w-xs pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>VIEW EVENT ARCHIVE</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
