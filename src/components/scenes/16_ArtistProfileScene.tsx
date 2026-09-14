import React from 'react';
import { User, MapPin, Calendar, Award, ChevronRight } from 'lucide-react';

interface ArtistProfileSceneProps {
  onNext: () => void;
}

export const ArtistProfileScene: React.FC<ArtistProfileSceneProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 16 • ARTIST PROFILE (QUICK VIEW)
          </span>
        </div>
      </div>

      {/* Main Profile Card (Storyboard 16) */}
      <div className="w-full max-w-3xl my-auto p-6 md:p-10 rounded-3xl bg-zinc-950/90 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Silhouette Avatar & Signature */}
          <div className="md:col-span-5 flex flex-col items-center text-center">
            <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-800 to-black border-2 border-amber-500/40 shadow-2xl flex flex-col items-center justify-end p-4 group">
              {/* Backlit glow */}
              <div className="absolute top-4 w-28 h-28 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

              {/* Headphone silhouette */}
              <div className="w-16 h-16 rounded-full border-4 border-amber-400/80 bg-zinc-900 mb-2 flex items-center justify-center">
                <span className="text-xs font-black font-mono text-amber-400">PRAXX</span>
              </div>

              {/* Body */}
              <div className="w-28 h-20 bg-gradient-to-b from-zinc-700 to-zinc-950 rounded-t-xl" />
            </div>

            {/* Handwritten Signature Badge */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 flex items-center gap-2">
              <span className="text-sm font-serif italic text-amber-300 font-bold tracking-wider">
                Parth Chavda
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">OFFICIAL</span>
            </div>
          </div>

          {/* Right: Info, Stats, Philosophy */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div>
              <span className="text-xs tracking-[0.3em] font-semibold text-amber-500 font-mono uppercase">
                DJ / PRODUCER / CURATOR
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white font-['Syne'] tracking-wide uppercase mt-1 text-glow">
                PARTH CHAVDA
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-['Space_Grotesk'] mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>RAJKOT, GUJARAT, INDIA</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 py-2 border-y border-white/10">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono uppercase">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>EXPERIENCE</span>
                </div>
                <span className="text-xl font-bold text-white font-['Syne'] mt-0.5 block">
                  4+ YEARS
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono uppercase">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>HEADLINE SETS</span>
                </div>
                <span className="text-xl font-bold text-white font-['Syne'] mt-0.5 block">
                  20+ EVENTS
                </span>
              </div>
            </div>

            {/* Philosophy quote */}
            <div>
              <span className="text-[10px] tracking-[0.2em] text-zinc-500 font-mono uppercase block mb-1">
                PHILOSOPHY
              </span>
              <p className="text-xs md:text-sm text-zinc-300 font-['Space_Grotesk'] italic leading-relaxed">
                &ldquo;Music is not just performance; it is a conversation. The venue is our room. Every drop is a memory.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advance to Booking */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>PROCEED TO BOOKING</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
