import React, { useState } from 'react';
import { Calendar, Send } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

interface BookingSceneProps {
  onSuccess: (bookingData: { name: string; eventType: string; date: string; venue: string }) => void;
}

export const BookingScene: React.FC<BookingSceneProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    date: '',
    venue: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    AudioEngine.triggerLightPulseSound();

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        name: formData.name,
        eventType: formData.eventType,
        date: formData.date || 'Upcoming Date',
        venue: formData.venue || 'Rajkot / Gujarat Venue',
      });
    }, 600);
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 17 • BOOKING SCREEN
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.25em] text-white font-['Syne'] uppercase text-glow">
          LET&apos;S CREATE SOMETHING UNFORGETTABLE
        </h2>
        <span className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-widest uppercase">
          RESERVE DJ PRAXX FOR YOUR DATE
        </span>
      </div>

      {/* Booking Form Card (Storyboard 17) */}
      <div className="w-full max-w-2xl my-auto p-6 md:p-8 rounded-3xl bg-zinc-950/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                placeholder="Parth Chavda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="booking@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Phone & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                EVENT TYPE
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              >
                <option value="Wedding">Wedding Celebration</option>
                <option value="Sangeet">Sangeet / Reception Night</option>
                <option value="Club">Club Night / Rave</option>
                <option value="Festival">Arena Music Festival</option>
                <option value="Private">Exclusive Private Gala</option>
                <option value="Corporate">Corporate Summit Showcase</option>
              </select>
            </div>
          </div>

          {/* Row 3: Date & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                EVENT DATE
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
                VENUE / CITY
              </label>
              <input
                type="text"
                placeholder="Elegance Party Plot, Rajkot"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Message */}
          <div>
            <label className="text-[10px] tracking-wider text-zinc-400 font-mono uppercase block mb-1">
              SPECIAL SOUND / LIGHTING REQUIREMENTS (OPTIONAL)
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about the crowd vibe, duration, or favorite track styles..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-amber-400 text-white text-xs font-['Space_Grotesk'] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold tracking-[0.25em] uppercase text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_25px_rgba(240,124,34,0.6)] active:scale-98 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>PROCESSING SIGNAL...</span>
            ) : (
              <>
                <span>SEND BOOKING REQUEST</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Storyboard 17 Tagline */}
      <div className="text-center">
        <span className="text-[11px] tracking-[0.3em] text-zinc-500 font-['Space_Grotesk'] uppercase">
          GOOD EVENTS • BETTER MEMORIES
        </span>
      </div>
    </div>
  );
};
