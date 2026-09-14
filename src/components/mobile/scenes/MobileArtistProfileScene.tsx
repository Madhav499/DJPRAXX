import React from 'react';
import { MapPin, Calendar, Award, ArrowRight } from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileArtistProfileSceneProps {
  onNext: () => void;
}

export const MobileArtistProfileScene: React.FC<MobileArtistProfileSceneProps> = ({
  onNext,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black overflow-hidden">
      {/* Background Photographic Artist Portrait (Storyboard 14) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-60"
        style={{
          backgroundImage: 'url(/assets/mobile/artist_portrait.jpg)',
          filter: 'contrast(1.15) brightness(0.7)',
        }}
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/60 to-black/85 pointer-events-none" />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          14 • ARTIST PROFILE
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          10 / 20
        </span>
      </div>

      {/* Center Profile Information (Storyboard 14) */}
      <div className="relative z-10 flex flex-col gap-3 my-auto w-full max-w-xs mx-auto">
        {/* Brand & Artist Name */}
        <div>
          <span className="text-[11px] tracking-[0.3em] font-mono text-amber-500 font-bold uppercase">
            DJ / PRODUCER / CURATOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-['Syne'] text-white uppercase text-glow tracking-wide mt-0.5">
            DJ PRAXX
          </h2>
          <div className="text-lg font-bold font-['Syne'] text-zinc-200 mt-0.5">
            Parth Chavda
          </div>
        </div>

        {/* Origin & Experience Badges */}
        <div className="flex flex-col gap-2 bg-zinc-950/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>RAJKOT, GUJARAT, INDIA</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>4+ YEARS ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>20+ EVENTS</span>
            </div>
          </div>
        </div>

        {/* Signature & Philosophy */}
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-2xl font-serif italic text-amber-300 font-bold tracking-widest drop-shadow-[0_2px_8px_rgba(240,124,34,0.4)]">
            Parth
          </span>
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            MUSIC IS A CONVERSATION
          </span>
        </div>
      </div>

      {/* Bottom CTA to Booking */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <span>INITIATE BOOKING</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
