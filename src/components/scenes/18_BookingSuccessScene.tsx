import React from 'react';
import { Check, Radio, ChevronRight } from 'lucide-react';

interface BookingSuccessSceneProps {
  bookingData?: { name: string; eventType: string; date: string; venue: string };
  onNext: () => void;
}

export const BookingSuccessScene: React.FC<BookingSuccessSceneProps> = ({
  bookingData,
  onNext,
}) => {
  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none text-center">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
          SCENE 18 • BOOKING SUCCESS
        </span>
      </div>

      {/* Center Success Card (Storyboard 18) */}
      <div className="relative flex flex-col items-center my-auto max-w-lg">
        {/* Pulsating Amber Signal Ring with Checkmark */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-400 shadow-[0_0_40px_rgba(240,124,34,0.5)] mb-6">
          <span className="absolute inset-0 rounded-full border border-amber-500/40 animate-ping opacity-60" />
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <Check className="w-8 h-8 md:w-10 md:h-10 text-black stroke-[3]" />
          </div>
        </div>

        {/* Audio Wave Confirmation Strip */}
        <div className="w-48 h-8 flex items-center justify-center gap-1 mb-4">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-amber-400 rounded-full"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 60}%`,
              }}
            />
          ))}
        </div>

        <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          REQUEST RECEIVED
        </h2>
        <span className="text-xs md:text-sm tracking-[0.25em] text-amber-400 font-mono uppercase font-bold mt-1">
          PRAXX SIGNAL ACTIVE
        </span>

        <p className="text-xs md:text-sm text-zinc-300 font-['Space_Grotesk'] mt-4 leading-relaxed max-w-md">
          {bookingData?.name ? `Thank you, ${bookingData.name}. ` : 'Thank you. '}
          Your event request for {bookingData?.eventType || 'your event'} has been locked into the DJ PRAXX calendar. We will connect with you shortly.
        </p>

        {/* Confirmation Code Pill */}
        <div className="mt-6 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 font-mono">SIGNAL REF:</span>
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
            PRX-8492-NIGHT
          </span>
        </div>
      </div>

      {/* Advance to Exit Experience */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>ENTER EXIT EXPERIENCE</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
