import React from 'react';
import { Calendar, MapPin, Sparkles, Volume2, ChevronRight, Award } from 'lucide-react';
import { type EventItem, EVENTS_DATA } from './12_EventArchiveScene';
import { AudioEngine } from '../../audio/AudioEngine';

interface EventDetailSceneProps {
  event?: EventItem;
  onNext: () => void;
}

export const EventDetailScene: React.FC<EventDetailSceneProps> = ({
  event = EVENTS_DATA[0],
  onNext,
}) => {
  const handlePlayRecapAudio = () => {
    AudioEngine.triggerLightPulseSound();
    AudioEngine.setTrack(0);
    AudioEngine.play();
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 13 • EVENT DETAIL
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          {event.name}
        </h2>
        <div className="flex items-center gap-3 text-xs md:text-sm text-zinc-400 font-['Space_Grotesk']">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {event.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {event.date}
          </span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
            {event.category}
          </span>
        </div>
      </div>

      {/* Main Details & Gallery Container */}
      <div className="w-full max-w-4xl my-auto p-6 md:p-8 rounded-3xl bg-zinc-950/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col gap-6">
        {/* Photo Strip Gallery (Storyboard 13) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Grand Stage Entrance', time: '09:30 PM' },
            { label: 'Sangeet Fusion Drop', time: '11:15 PM' },
            { label: 'Crowd Peak Ignition', time: '12:45 AM' },
            { label: 'Final Midnight Encore', time: '02:00 AM' },
          ].map((shot, idx) => (
            <div
              key={idx}
              className="relative h-32 md:h-40 rounded-xl overflow-hidden bg-gradient-to-b from-zinc-800 to-black border border-white/10 flex flex-col justify-end p-3 group hover:border-amber-500/80 transition-all shadow-md"
            >
              {/* Abstract concert light simulation in photo strip */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 20%, rgba(240,124,34,0.3) 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <span className="text-[9px] text-amber-400 font-mono block">{shot.time}</span>
                <span className="text-xs font-bold text-white font-['Space_Grotesk'] leading-tight block">
                  {shot.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col items-center text-center">
            <span className="text-[10px] tracking-wider text-zinc-500 font-mono uppercase">
              CROWD ENERGY SCORE
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-amber-400 font-['Syne'] text-2xl font-black">
              <Sparkles className="w-5 h-5" />
              <span>{event.energyScore}%</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-['Space_Grotesk'] mt-1">
              Sustained peak frenzy
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col items-center text-center">
            <span className="text-[10px] tracking-wider text-zinc-500 font-mono uppercase">
              ATTENDEES DANCED
            </span>
            <span className="text-2xl font-black text-white font-['Syne'] mt-1">
              {event.attendees}
            </span>
            <span className="text-[10px] text-zinc-400 font-['Space_Grotesk'] mt-1">
              Packed floor capacity
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col items-center text-center">
            <span className="text-[10px] tracking-wider text-zinc-500 font-mono uppercase">
              RECAP AUDIO SNIPPET
            </span>
            <button
              onClick={handlePlayRecapAudio}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Volume2 className="w-4 h-4" />
              <span>PLAY RECAP</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-zinc-300 font-['Space_Grotesk'] leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-white/5">
          <span className="font-bold text-white block mb-1">THE EXPERIENCE NOTE:</span>
          &ldquo;When the clock struck midnight, the traditional rhythm broke into high-frequency melodic techno. The entire venue lifted as one cohesive wave.&rdquo;
        </div>
      </div>

      {/* Advance to STORY destination */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>BEHIND THE SOUND • BIOGRAPHY</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
