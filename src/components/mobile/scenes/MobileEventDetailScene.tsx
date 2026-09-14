import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { EventItem } from '../../scenes/12_EventArchiveScene';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileEventDetailSceneProps {
  event: EventItem;
  onNext: () => void;
}

export const MobileEventDetailScene: React.FC<MobileEventDetailSceneProps> = ({
  event,
  onNext,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const photos = [
    '/assets/mobile/stage_crowd.jpg',
    '/assets/mobile/dj_booth.jpg',
    '/assets/mobile/venue_entrance.jpg',
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black overflow-hidden">
      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          11 • EVENT DETAIL
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          07 / 20
        </span>
      </div>

      {/* Main Content (Storyboard 11) */}
      <div className="relative z-10 flex flex-col gap-3 my-auto w-full max-w-xs mx-auto">
        {/* Large Event Hero Photograph */}
        <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_35px_rgba(240,124,34,0.3)]">
          <img
            src={photos[selectedPhotoIndex]}
            alt={event.name}
            className="w-full h-full object-cover object-center transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 border border-amber-500/40 backdrop-blur-md text-[9px] font-mono text-amber-300 uppercase font-bold">
            {event.category}
          </div>
        </div>

        {/* Interactive Film-Strip Gallery */}
        <div className="flex items-center gap-2">
          {photos.map((src, idx) => (
            <button
              key={`thumb-${idx}`}
              onClick={() => {
                AudioEngine.triggerLightPulseSound();
                setSelectedPhotoIndex(idx);
              }}
              className={`flex-1 h-14 rounded-xl overflow-hidden border transition-all ${
                selectedPhotoIndex === idx
                  ? 'border-amber-400 scale-105 shadow-[0_0_10px_#f59e0b]'
                  : 'border-white/10 opacity-60'
              }`}
            >
              <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Event Title & Metadata */}
        <div className="flex flex-col gap-1 mt-1">
          <h2 className="text-xl sm:text-2xl font-black font-['Syne'] text-white uppercase text-glow">
            {event.name}
          </h2>

          <div className="flex flex-col gap-1 text-xs font-mono text-zinc-400 mt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{event.date}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 font-['Space_Grotesk'] mt-2 leading-relaxed">
            {event.highlight}
          </p>
        </div>
      </div>

      {/* Bottom CTA to Biography Entrance */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>ENTER BIOGRAPHY</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
