import React, { useState } from 'react';
import { BookOpen, Disc, ChevronRight } from 'lucide-react';
import { HowlerEngine } from '../../audio/howlerEngine';

interface ChapterContent {
  id: string;
  number: string;
  title: string;
  quote: string;
  body: string[];
  artifact: string;
}

const CHAPTERS: ChapterContent[] = [
  {
    id: '01',
    number: '01',
    title: 'THE FIRST FREQUENCY',
    quote: 'It started with listening. Before there was DJ PRAXX, there was simply a love for music. One connection — the feeling.',
    body: [
      'Growing up in Rajkot, sound was not background noise; it was an obsession. Every tape, radio broadcast, and festival loudspeaker was an invitation to decipher how vibrations shape human emotions.',
      'Before ever touching professional stage equipment, hundreds of hours were spent cataloging tempos, feeling the cadence of traditional folk rhythms, and observing how a single chord shift could bring a crowd of strangers into unified synchrony.',
    ],
    artifact: 'VINTAGE CASSETTE & SONY HEADPHONES (2018)',
  },
  {
    id: '02',
    number: '02',
    title: 'THE LEARNING',
    quote: 'Mastering turntables is not about mechanical muscle memory; it is about absolute sonic patience.',
    body: [
      'Countless midnight sessions in a modest room with two entry-level decks. No sync buttons, no visual waveforms—only trained ears matching tempos by ear down to a fractional millisecond.',
      'Mistakes were recorded and dissected. Understanding EQ isolation, high-pass filtration, and how to hold tension without losing the heartbeat of the room.',
    ],
    artifact: 'ORIGINAL FIRST PIONEER DDJ-400 PRACTICE RIG',
  },
  {
    id: '03',
    number: '03',
    title: 'THE CRAFT',
    quote: 'A DJ set is emotional architecture. You build anticipation, withhold release, and then let the floodgates open.',
    body: [
      'Crafting signature edits that blend traditional Indian heritage harmonies with peak-hour global melodic techno. Reading subtle micro-expressions on the dance floor and steering the energy before the audience even realizes they needed the shift.',
      'Every venue is unique. A luxury destination sangeet demands elegance and explosive euphoria; a late-night festival demands hypnotic, relentless momentum.',
    ],
    artifact: 'BESPOKE LIVE ABLETON STEM CONTROLLER',
  },
  {
    id: '04',
    number: '04',
    title: 'THE PERSON',
    quote: 'Parth Chavda: behind the moniker is a quiet craftsman devoted to the art of giving people their best memories.',
    body: [
      'When the lights dim and the final encore fades, the equipment is packed with the same humble discipline as day one. Success is measured not by vanity metrics, but by the smiles and breathless laughter of people walking into the morning air.',
      'Staying grounded in family, culture, and relentless curiosity for emerging electronic genres across the globe.',
    ],
    artifact: 'HANDWRITTEN CUE LOGS & TRACK NOTES',
  },
  {
    id: '05',
    number: '05',
    title: 'THE NEXT SET',
    quote: 'The night is infinite. The best set has not been played yet.',
    body: [
      'Expanding into international electronic arenas, pioneering multi-sensory visual and spatial sound performances, and bringing the soulful night energy of Gujarat to worldwide stages.',
      'Still listening. Still learning. Still playing.',
    ],
    artifact: 'STAGE LIGHT NAV DIGITAL PRODUCTION RIG',
  },
];

interface BiographyChaptersSceneProps {
  onNext: () => void;
}

export const BiographyChaptersScene: React.FC<BiographyChaptersSceneProps> = ({ onNext }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const currentChapter = CHAPTERS[activeChapterIndex];

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    HowlerEngine.triggerLightPulseSound();
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 15 • BIOGRAPHY CHAPTER
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          {currentChapter.title}
        </h2>
      </div>

      {/* Chapter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-4">
        {CHAPTERS.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => handleSelectChapter(idx)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${
              idx === activeChapterIndex
                ? 'bg-amber-500 text-black font-bold shadow-[0_0_12px_#f07c22]'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            CHAPTER {ch.number}
          </button>
        ))}
      </div>

      {/* Main Chapter Content Card (Storyboard 15) */}
      <div className="w-full max-w-3xl my-auto p-6 md:p-8 rounded-3xl bg-zinc-950/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col gap-5">
        {/* Quote Block */}
        <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-500">
          <p className="text-sm md:text-base font-semibold text-amber-200 italic font-['Space_Grotesk'] leading-relaxed">
            &ldquo;{currentChapter.quote}&rdquo;
          </p>
        </div>

        {/* Narrative Paragraphs */}
        <div className="flex flex-col gap-3 text-xs md:text-sm text-zinc-300 font-['Space_Grotesk'] leading-relaxed">
          {currentChapter.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Archive Artifact Tag */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-[10px] text-zinc-500 font-mono uppercase">
          <Disc className="w-3.5 h-3.5 text-amber-500" />
          <span>ARCHIVE ARTIFACT: {currentChapter.artifact}</span>
        </div>
      </div>

      {/* Advance to Artist Profile */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>VIEW ARTIST PROFILE (QUICK VIEW)</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
