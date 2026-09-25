import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HowlerEngine } from '../../../audio/howlerEngine';

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  venue: string;
  message: string;
}

interface MobileBookingSceneProps {
  onSuccess: (data: BookingFormData) => void;
}

export const MobileBookingScene: React.FC<MobileBookingSceneProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    date: '',
    venue: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Count filled fields to light up the production console stage lights!
  const filledCount = [
    formData.name.trim() !== '',
    formData.email.trim() !== '',
    formData.phone.trim() !== '',
    formData.eventType !== '',
    formData.date.trim() !== '',
    formData.venue.trim() !== '',
  ].filter(Boolean).length;

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please provide your name and email to transmit signal.');
      return;
    }
    setIsSubmitting(true);
    HowlerEngine.triggerLightPulseSound();
    setTimeout(() => {
      onSuccess(formData);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 pb-16 select-none bg-black overflow-y-auto">
      {/* Background Concert Ambience (Storyboard 15) */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url(/assets/mobile/stage_crowd.jpg)',
          filter: 'brightness(0.6) contrast(1.2)',
        }}
      />

      {/* Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/90 to-black/95 pointer-events-none" />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex flex-col items-center text-center">
        <span className="text-[10px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
          15 • PRODUCTION CONSOLE
        </span>
        <h2 className="text-xl sm:text-2xl font-black tracking-[0.15em] text-white font-['Syne'] uppercase text-glow mt-0.5">
          LET'S CREATE SOMETHING UNFORGETTABLE
        </h2>
      </div>

      {/* Stage Light Progress Indicator (Sequential Activation Requirement) */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-xs mx-auto my-3 px-3 py-2 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-400">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>CONSOLE RIG:</span>
        </div>

        {/* 6 Miniature Fixture LEDs that activate as fields are filled */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const isLit = i <= filledCount;
            return (
              <span
                key={`rig-led-${i}`}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  isLit
                    ? 'bg-amber-400 border-amber-200 shadow-[0_0_10px_#f59e0b] scale-110'
                    : 'bg-zinc-900 border-zinc-700'
                }`}
              />
            );
          })}
        </div>

        <span className="text-[9px] font-mono text-amber-400 font-bold">
          {filledCount}/6
        </span>
      </div>

      {/* Backstage Production Form (Storyboard 15) */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xs mx-auto flex flex-col gap-2.5 bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md shadow-2xl"
      >
        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            YOUR NAME *
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-['Space_Grotesk']"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-['Space_Grotesk']"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              PHONE
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-['Space_Grotesk']"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              EVENT TYPE
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => handleChange('eventType', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-['Space_Grotesk']"
            >
              <option value="Wedding">Wedding</option>
              <option value="Sangeet">Sangeet</option>
              <option value="Club">Club Night</option>
              <option value="Festival">Festival</option>
              <option value="Private">Private Luxury</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              EVENT DATE
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-['Space_Grotesk']"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            VENUE / LOCATION
          </label>
          <input
            type="text"
            placeholder="e.g. Elegance Resort, Rajkot"
            value={formData.venue}
            onChange={(e) => handleChange('venue', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-['Space_Grotesk']"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            MESSAGE (OPTIONAL)
          </label>
          <textarea
            rows={2}
            placeholder="Tell us about your night..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-['Space_Grotesk'] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 mt-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs tracking-[0.25em] uppercase font-['Space_Grotesk'] shadow-[0_0_30px_rgba(240,124,34,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <span>{isSubmitting ? 'TRANSMITTING SIGNAL...' : 'SEND BOOKING REQUEST'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
