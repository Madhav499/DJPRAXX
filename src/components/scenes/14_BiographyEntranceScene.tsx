import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

interface BiographyEntranceSceneProps {
  onNext: () => void;
}

export const BiographyEntranceScene: React.FC<BiographyEntranceSceneProps> = ({ onNext }) => {
  const chapters = [
    { num: '01', title: 'THE FIRST FREQUENCY', subtitle: 'The spark in Rajkot' },
    { num: '02', title: 'THE LEARNING', subtitle: 'Countless sleepless turntable hours' },
    { num: '03', title: 'THE CRAFT', subtitle: 'Harmonic mixing & reading crowds' },
    { num: '04', title: 'THE PERSON', subtitle: 'Parth Chavda: humility & energy' },
    { num: '05', title: 'THE NEXT SET', subtitle: 'Building the future of live night' },
  ];

  const handleStepInside = () => {
    AudioEngine.triggerLightPulseSound();
    onNext();
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 14 • BIOGRAPHY ENTRANCE
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          BEHIND THE SOUND
        </h2>
        <span className="text-xs text-zinc-400 font-['Space_Grotesk'] tracking-widest uppercase">
          A STORY BEYOND THE STAGE
        </span>
      </div>

      {/* Chapter Portal Doorway Card (Storyboard 14) */}
      <div className="w-full max-w-2xl my-auto p-6 md:p-8 rounded-3xl bg-zinc-950/85 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col items-center">
        <div className="w-full flex flex-col gap-2.5">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              onClick={handleStepInside}
              className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold text-amber-400 group-hover:scale-110 transition-transform">
                  {ch.num}
                </span>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white font-['Syne'] group-hover:text-amber-300 transition-colors">
                    {ch.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-['Space_Grotesk']">
                    {ch.subtitle}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Advance Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleStepInside}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>STEP INSIDE • READ CHAPTERS</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
