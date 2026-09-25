import React, { useState } from 'react';
import { Compass, Sparkles, ChevronRight } from 'lucide-react';
import { HowlerEngine } from '../../audio/howlerEngine';

interface GenreNode {
  id: string;
  name: string;
  bpmRange: string;
  vibe: string;
  signature: string;
  angle: number; // in degrees around core
  distance: number; // in px
}

const GENRES: GenreNode[] = [
  {
    id: 'bollywood',
    name: 'BOLLYWOOD',
    bpmRange: '124 - 130 BPM',
    vibe: 'Iconic vocal hooks blended with thunderous modern club percussion.',
    signature: 'Rajkot Festival Edit, Kesariya Progressive Remix',
    angle: 0,
    distance: 140,
  },
  {
    id: 'edm',
    name: 'EDM',
    bpmRange: '128 - 132 BPM',
    vibe: 'Massive festival anthems, stadium riser buildups, and laser-locked drops.',
    signature: 'Arena Lead Drops, Stadium Risers',
    angle: 52,
    distance: 175,
  },
  {
    id: 'house',
    name: 'HOUSE',
    bpmRange: '123 - 126 BPM',
    vibe: 'Rolling sub-basslines, tight offbeat percussion, and hypnotic grooves.',
    signature: 'Deep Midnight Grooves, Club Tool 04',
    angle: 105,
    distance: 150,
  },
  {
    id: 'club',
    name: 'CLUB',
    bpmRange: '126 - 128 BPM',
    vibe: 'High-octane crowd movers engineered to ignite packed venue floors.',
    signature: 'Peak-Hour Euphoria, VIP Mashups',
    angle: 155,
    distance: 180,
  },
  {
    id: 'punjabi',
    name: 'PUNJABI',
    bpmRange: '98 - 110 / 130 BPM',
    vibe: 'Heavy dhol percussion layered over rumbling 808 sub-bass pressure.',
    signature: 'Dhol Club Rework, Brown Munde Progressive',
    angle: 210,
    distance: 145,
  },
  {
    id: 'retro',
    name: 'RETRO',
    bpmRange: '120 - 125 BPM',
    vibe: 'Vintage 80s/90s nostalgic synths rebuilt with crisp analog modern master.',
    signature: 'Disco Nights Re-Edit, Golden Era Flip',
    angle: 260,
    distance: 165,
  },
  {
    id: 'hiphop',
    name: 'HIP-HOP',
    bpmRange: '95 - 105 BPM',
    vibe: 'Deep syncopated halftime bounce with sharp snare cracks and gritty 808s.',
    signature: 'Trap Fusion Stems, Late Night Flip',
    angle: 310,
    distance: 150,
  },
];

interface SoundUniverseSceneProps {
  onNext: () => void;
}

export const SoundUniverseScene: React.FC<SoundUniverseSceneProps> = ({ onNext }) => {
  const [selectedGenre, setSelectedGenre] = useState<GenreNode>(GENRES[0]);

  const handleSelectGenre = (genre: GenreNode) => {
    setSelectedGenre(genre);
    HowlerEngine.triggerLightPulseSound();
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Scene Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 11 • SOUND UNIVERSE
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          ORBITAL GENRE COSMOS
        </h2>
        <span className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-wider">
          Tap an orbital node to discover DJ PRAXX&apos;s distinct sonic frequencies.
        </span>
      </div>

      {/* 3D-styled Orbital Galaxy Visualization */}
      <div className="relative w-full max-w-3xl my-auto py-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Orbit Canvas / Node Cluster */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center">
          {/* Orbital Elliptical Rings */}
          <div className="absolute w-full h-full rounded-full border border-amber-500/15 pointer-events-none" />
          <div className="absolute w-3/4 h-3/4 rounded-full border border-dashed border-amber-400/20 animate-[spin_40s_linear_infinite] pointer-events-none" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-amber-500/25 pointer-events-none" />

          {/* Core PRAXX Sphere */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-b from-amber-500 via-amber-700 to-black border-2 border-amber-300 shadow-[0_0_40px_#f07c22] flex flex-col items-center justify-center text-center p-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase font-['Syne']">
              PRAXX
            </span>
            <span className="text-[8px] tracking-widest text-amber-200 font-mono">
              UNIVERSE
            </span>
            <Sparkles className="w-3 h-3 text-amber-200 mt-0.5 animate-pulse" />
          </div>

          {/* 7 Orbiting Genre Nodes */}
          {GENRES.map((g) => {
            const rad = (g.angle * Math.PI) / 180;
            // Responsive scale factor for orbit coordinates
            const factor = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.75 : 1;
            const x = Math.cos(rad) * (g.distance * factor);
            const y = Math.sin(rad) * (g.distance * factor);
            const isSelected = selectedGenre.id === g.id;

            return (
              <button
                key={g.id}
                onClick={() => handleSelectGenre(g)}
                className={`absolute z-20 flex items-center justify-center px-3 py-1.5 rounded-full transition-all duration-300 font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold tracking-wider uppercase active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-black border-2 border-white shadow-[0_0_20px_#ff9933] scale-110'
                    : 'bg-zinc-900/90 text-zinc-300 border border-white/10 hover:border-amber-400 hover:text-white hover:scale-105'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                aria-label={`Select ${g.name} genre`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* Selected Genre Detail Card */}
        <div className="w-full max-w-sm p-6 rounded-2xl bg-zinc-950/90 border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-amber-400 font-mono uppercase font-bold">
                FREQUENCY
              </span>
              <h3 className="text-2xl font-black text-white font-['Syne'] tracking-wider">
                {selectedGenre.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono">
              {selectedGenre.bpmRange}
            </span>
          </div>

          <p className="text-xs text-zinc-300 font-['Space_Grotesk'] leading-relaxed">
            {selectedGenre.vibe}
          </p>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">
              SIGNATURE PRAXX TRACKS
            </span>
            <span className="text-xs font-semibold text-amber-400 font-['Space_Grotesk']">
              {selectedGenre.signature}
            </span>
          </div>
        </div>
      </div>

      {/* Advance to EVENTS destination */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>VIEW EVENT ARCHIVE</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
