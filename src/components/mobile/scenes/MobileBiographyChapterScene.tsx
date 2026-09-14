import React, { useState } from 'react';
import { ArrowRight, Disc, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileBiographyChapterSceneProps {
  onNext: () => void;
}

export const MobileBiographyChapterScene: React.FC<MobileBiographyChapterSceneProps> = ({
  onNext,
}) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [showSecretArchive, setShowSecretArchive] = useState(false);

  const chapters = [
    {
      num: '01',
      title: 'THE FIRST FREQUENCY',
      quote: 'It started with listening. Before there was DJ PRAXX, there was simply a love for music. One connection — the feeling.',
      body: 'Growing up in Rajkot, sound was never background noise; it was an obsession. Every radio broadcast and festival loudspeaker was an invitation to decipher how acoustic frequencies shape collective human emotion.',
      artifact: '1974 MASTER TAPE LOGS & POLAROID STUDY',
    },
    {
      num: '02',
      title: 'THE LEARNING',
      quote: 'Mastering turntables is not mechanical muscle memory; it is absolute sonic patience.',
      body: 'Midnight practice sessions with two entry-level decks and no sync buttons. Only trained ears matching tempos down to the fractional millisecond.',
      artifact: 'FIRST PIONEER DDJ PRACTICE RIG',
    },
    {
      num: '03',
      title: 'THE CRAFT',
      quote: 'A DJ set is emotional architecture. You withhold release until the floodgates must open.',
      body: 'Crafting signature edits that blend traditional Gujarat heritage melodies with thunderous global melodic techno.',
      artifact: 'LIVE ABLETON STEM CONTROLLER',
    },
  ];

  const current = chapters[chapterIndex];

  const handleVinylTap = () => {
    setShowSecretArchive(!showSecretArchive);
    AudioEngine.triggerLightPulseSound();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black overflow-hidden">
      {/* Photographic Turntable Background (Storyboard 13) */}
      <div
        onClick={handleVinylTap}
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45 cursor-pointer"
        style={{
          backgroundImage: 'url(/assets/mobile/vinyl_turntable.jpg)',
          filter: 'brightness(0.7) contrast(1.1)',
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-black/90 pointer-events-none" />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          13 • BIOGRAPHY CHAPTER
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span>CHAPTER</span>
          <span className="text-amber-400 font-bold">{current.num} / 03</span>
        </div>
      </div>

      {/* Center Narrative Content (Storyboard 13) */}
      <div className="relative z-10 flex flex-col gap-3 my-auto w-full max-w-xs mx-auto">
        {/* Interactive Record / Secret Vinyl Memory Affordance (Secret 3) */}
        <div
          onClick={handleVinylTap}
          className="p-3 rounded-2xl bg-zinc-950/90 border border-amber-500/40 backdrop-blur-md flex items-center justify-between cursor-pointer group active:scale-98 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Disc className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                VINYL ARTIFACT
              </span>
              <p className="text-[11px] text-white font-['Space_Grotesk']">
                {current.artifact}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 group-hover:text-amber-400">
            TAP RECORD
          </span>
        </div>

        {/* Secret 3 Popup if revealed */}
        {showSecretArchive && (
          <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-400/80 text-amber-200 text-xs font-mono animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>[ SECRET VINYL MEMORY UNLOCKED ]</span>
            </div>
            <p className="text-[10px] text-zinc-300 leading-relaxed">
              "Studio A Session 1974: 'Dusk Melodies'. Original test pressing master cut in Rajkot. Frequency balance 432Hz."
            </p>
          </div>
        )}

        {/* Chapter Title & Text */}
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[11px] tracking-[0.3em] font-mono text-amber-500 font-bold uppercase">
            CHAPTER {current.num}
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-['Syne'] text-white uppercase text-glow">
            {current.title}
          </h2>

          <blockquote className="text-xs font-serif italic text-amber-300 border-l-2 border-amber-500 pl-3 my-1">
            "{current.quote}"
          </blockquote>

          <p className="text-xs text-zinc-300 font-['Space_Grotesk'] leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Chapter Switcher Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={() => {
              AudioEngine.triggerLightPulseSound();
              setChapterIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={chapterIndex === 0}
            className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 disabled:opacity-30 active:scale-95"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>PREV</span>
          </button>

          <span className="text-[10px] font-mono text-zinc-500">
            {chapterIndex + 1} of {chapters.length}
          </span>

          <button
            onClick={() => {
              AudioEngine.triggerLightPulseSound();
              setChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1));
            }}
            disabled={chapterIndex === chapters.length - 1}
            className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 disabled:opacity-30 active:scale-95"
          >
            <span>NEXT</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom CTA to Artist Profile */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>VIEW ARTIST PROFILE</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
