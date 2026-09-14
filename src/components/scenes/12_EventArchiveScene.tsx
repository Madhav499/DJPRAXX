import React, { useState } from 'react';
import { Calendar, MapPin, Users, Sparkles, ChevronRight } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

export interface EventItem {
  id: string;
  name: string;
  location: string;
  date: string;
  category: 'Wedding' | 'Sangeet' | 'Club' | 'Festival';
  attendees: string;
  energyScore: number;
  highlight: string;
}

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'elegance_party_plot',
    name: 'Elegance Party Plot',
    location: 'Rajkot, Gujarat',
    date: '20 JAN 2024',
    category: 'Wedding',
    attendees: '1,800+',
    energyScore: 98,
    highlight: 'Electrifying 4-hour nonstop marathon ending in synchronized crowd singalongs.',
  },
  {
    id: 'phoenix_resort',
    name: 'Phoenix Resort Arena',
    location: 'Rajkot',
    date: '31 DEC 2023',
    category: 'Festival',
    attendees: '2,500+',
    energyScore: 99,
    highlight: 'Midnight countdown pyro explosion with thunderous progressive house drop.',
  },
  {
    id: 'regency_lagoon',
    name: 'Regency Lagoon Luxury Resort',
    location: 'Rajkot Highway',
    date: '14 FEB 2024',
    category: 'Sangeet',
    attendees: '1,200+',
    energyScore: 96,
    highlight: 'Fusion Bollywood deep house set with live dhol synchronization.',
  },
  {
    id: 'nirali_resort',
    name: 'Nirali Resort Neon Night',
    location: 'Kalawad Road, Rajkot',
    date: '18 NOV 2023',
    category: 'Club',
    attendees: '1,500+',
    energyScore: 97,
    highlight: 'Intense 360-degree laser cage setup with unreleased melodic techno edits.',
  },
  {
    id: 'mtv_resort',
    name: 'MTV Resort Sunsets',
    location: 'Gondal Highway',
    date: '05 OCT 2023',
    category: 'Festival',
    attendees: '900+',
    energyScore: 95,
    highlight: 'Golden hour acoustic-to-electronic transition across the lakefront stage.',
  },
];

interface EventArchiveSceneProps {
  onSelectEvent: (event: EventItem) => void;
  onNext: () => void;
}

export const EventArchiveScene: React.FC<EventArchiveSceneProps> = ({
  onSelectEvent,
  onNext,
}) => {
  const [filter, setFilter] = useState<'All' | 'Wedding' | 'Sangeet' | 'Club' | 'Festival'>('All');

  const filteredEvents =
    filter === 'All' ? EVENTS_DATA : EVENTS_DATA.filter((e) => e.category === filter);

  const handleCardClick = (event: EventItem) => {
    AudioEngine.triggerLightPulseSound();
    onSelectEvent(event);
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Scene Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 12 • EVENT ARCHIVE
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          MOMENTS THAT MATTER
        </h2>
        <span className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-wider">
          Explore celebrated nights, arena festivals, and landmark destination sets.
        </span>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {(['All', 'Wedding', 'Sangeet', 'Club', 'Festival'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-['Space_Grotesk'] tracking-wider uppercase transition-all ${
                filter === cat
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_#f07c22]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="w-full max-w-5xl my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => handleCardClick(ev)}
            className="group relative p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-amber-500/60 shadow-xl hover:shadow-[0_10px_30px_rgba(240,124,34,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {ev.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{ev.date}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white font-['Syne'] group-hover:text-amber-300 transition-colors">
                {ev.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1 font-['Space_Grotesk']">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{ev.location}</span>
              </div>

              <p className="text-xs text-zinc-400 font-['Space_Grotesk'] mt-3 line-clamp-2">
                {ev.highlight}
              </p>
            </div>

            {/* Bottom info */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span>{ev.attendees}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ev.energyScore}% ENERGY</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advance to Event Detail */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => {
            handleCardClick(EVENTS_DATA[0]);
            onNext();
          }}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>VIEW FEATURED EVENT DETAIL</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
