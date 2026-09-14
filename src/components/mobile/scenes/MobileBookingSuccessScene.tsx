import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import type { BookingFormData } from './MobileBookingScene';
import { AudioEngine } from '../../../audio/AudioEngine';

interface MobileBookingSuccessSceneProps {
  bookingData: Partial<BookingFormData>;
  onNext: () => void;
}

export const MobileBookingSuccessScene: React.FC<MobileBookingSuccessSceneProps> = ({
  bookingData,
  onNext,
}) => {
  const [signalTracerPos, setSignalTracerPos] = useState<number | null>(null);
  const [showSecretSignal, setShowSecretSignal] = useState(false);

  const handleWaveTouchMove = (e: React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
    setSignalTracerPos(x);
    setShowSecretSignal(true);
    if (Math.random() > 0.6) {
      AudioEngine.triggerLightPulseSound();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 select-none bg-black overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-600/20 blur-[120px] pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm mx-auto">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          16 • SIGNAL ACTIVE
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          12 / 20
        </span>
      </div>

      {/* Center Signal Pulse & Checkmark (Storyboard 16) */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto w-full max-w-xs mx-auto">
        <span className="text-[11px] tracking-[0.35em] font-mono text-zinc-400 uppercase">
          REQUEST RECEIVED
        </span>

        {/* Glowing Circular Lens Checkmark */}
        <div className="relative my-6 w-32 h-32 rounded-full bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-400 shadow-[0_0_50px_rgba(240,124,34,0.6)] flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-500/40 animate-ping opacity-60" />
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-[0.2em] text-white font-['Syne'] uppercase text-glow">
          PRAXX SIGNAL ACTIVE
        </h2>

        {/* Interactive Scrubbable Waveform with Secret 4: Signal Trace */}
        <div
          onTouchMove={handleWaveTouchMove}
          className="w-full relative py-4 cursor-pointer group my-2"
        >
          <div className="h-12 w-full rounded-2xl bg-zinc-950/90 border border-amber-500/30 flex items-center justify-between px-3 gap-0.5 relative overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={`sig-bar-${i}`}
                className="flex-1 rounded-full bg-gradient-to-t from-amber-600 to-amber-300 animate-pulse"
                style={{
                  height: `${Math.sin(i * 0.4) * 35 + 40}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}

            {/* Secret 4 Tracer Beam */}
            {signalTracerPos !== null && (
              <div
                className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_15px_#ffffff] pointer-events-none"
                style={{ left: `${signalTracerPos}%` }}
              />
            )}
          </div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block mt-1">
            DRAG TO TRACE PRAXX SIGNAL FREQUENCY
          </span>
        </div>

        {showSecretSignal && (
          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-400/50 text-[10px] font-mono text-amber-300 flex items-center gap-1.5 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ SECRET SIGNAL TRACE: PACKET CONFIRMED 0xPRAXX ]</span>
          </div>
        )}

        <p className="text-xs text-zinc-300 font-['Space_Grotesk'] mt-2 leading-relaxed">
          We'll take it from here, {bookingData.name || 'Friend'}. Production specs are now routed to DJ PRAXX directly.
        </p>
      </div>

      {/* Bottom CTA to Return */}
      <div className="relative z-10 w-full max-w-xs mx-auto pt-2">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3.5 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>PROCEED TO EXIT VENUE</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
