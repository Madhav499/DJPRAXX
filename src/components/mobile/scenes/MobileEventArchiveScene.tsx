import React, { useState } from 'react';
import { Calendar, MapPin, ChevronRight, Flame } from 'lucide-react';
import { EVENTS_DATA, type EventItem } from '../../scenes/12_EventArchiveScene';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileEventArchiveSceneProps {
  onSelectEvent: (event: EventItem) => void;
  onNext: () => void;
}

export const MobileEventArchiveScene: React.FC<MobileEventArchiveSceneProps> = ({
  onSelectEvent,
  onNext,
}) => {
  const [filter, setFilter] = useState<'All' | 'Wedding' | 'Club' | 'Festival'>('All');

  const filteredEvents =
    filter === 'All'
      ? EVENTS_DATA
      : EVENTS_DATA.filter((e) => e.category === filter);

  const handleCardClick = (event: EventItem) => {
    AudioEngine.triggerLightPulseSound();
    onSelectEvent(event);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black">
      {/* Top Header */}
      <div className="relative z-10 pt-2 flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          10 • EVENTS ARCHIVE
        </span>
        <h2 className="text-2xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase mt-0.5 text-glow">
          EVENTS
        </h2>
        <span className="text-xs font-serif italic text-amber-300 font-normal">
          Moments That Matter
        </span>

        {/* Category Pills (Storyboard 10) */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto py-1 max-w-xs no-scrollbar">
          {(['All', 'Wedding', 'Club', 'Festival'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                AudioEngine.triggerLightPulseSound();
                setFilter(cat);
              }}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                filter === cat
                  ? 'bg-amber-500 text-black font-extrabold shadow-[0_0_12px_rgba(240,124,34,0.5)]'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400'
              }`}
            >
              {cat === 'All' ? 'ALL' : `${cat}S`}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Memory Cards (Storyboard 10) */}
      <div className="relative z-10 flex flex-col gap-3.5 my-4 overflow-y-auto max-h-[58vh] px-1">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => handleCardClick(ev)}
            className="group relative rounded-2xl bg-zinc-950/90 border border-white/10 hover:border-amber-500/50 p-4 transition-all duration-300 active:scale-98 shadow-lg flex flex-col gap-2 cursor-pointer"
          >
            {/* Visual thumbnail strip banner */}
            <div className="relative h-28 w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
              <img
                src="/assets/mobile/stage_crowd.jpg"
                alt={ev.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Energy Score Pill */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 text-[9px] font-mono text-amber-400 font-bold">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{ev.energyScore}% ENERGY</span>
              </div>

              {/* Category */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500/20 text-[9px] font-mono text-amber-300 font-bold uppercase">
                {ev.category}
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="flex items-center justify-between mt-1">
              <div>
                <h3 className="text-base font-bold font-['Syne'] text-white group-hover:text-amber-300 transition-colors">
                  {ev.name}
                </h3>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    <span>{ev.date}</span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center text-zinc-400 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>VIEW FEATURED EVENT</span>
          <ChevronRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
