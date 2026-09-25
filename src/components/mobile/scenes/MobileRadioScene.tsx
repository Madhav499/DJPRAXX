import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ListMusic,
  ArrowRight,
} from 'lucide-react';
import { HowlerEngine, TRACKS } from '../../../audio/howlerEngine';

interface MobileRadioSceneProps {
  onNext: () => void;
}

export const MobileRadioScene: React.FC<MobileRadioSceneProps> = ({ onNext }) => {
  const [audioState, setAudioState] = useState(() => HowlerEngine.getState());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [vinylAngle, setVinylAngle] = useState(0);

  useEffect(() => {
    const unsubscribe = HowlerEngine.subscribe(() => {
      setAudioState(HowlerEngine.getState());
    });

    const anim = setInterval(() => {
      if (HowlerEngine.getState().isPlaying) {
        setVinylAngle((prev) => (prev + 3) % 360);
      }
    }, 40);

    return () => {
      unsubscribe();
      clearInterval(anim);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectTrack = (index: number) => {
    HowlerEngine.setTrack(index);
    HowlerEngine.play();
    HowlerEngine.triggerLightPulseSound();
    setIsSheetOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 pb-16 select-none overflow-hidden bg-black">
      {/* Background ambient vinyl halo */}
      <div className="absolute top-1/3 w-72 h-72 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />

      {/* Top Tag & Header */}
      <div className="relative z-10 pt-2 flex items-center justify-between w-full max-w-sm">
        <div className="flex flex-col items-start">
          <span className="text-[9px] tracking-[0.3em] font-mono text-amber-500 uppercase font-bold">
            08 • PRAXX RADIO
          </span>
          <h2 className="text-lg font-black tracking-[0.2em] text-white font-['Syne'] uppercase">
            LIVE SESSIONS
          </h2>
        </div>
        <button
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-amber-400 font-mono active:scale-95"
          aria-label="Open Tracklist"
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>TRACKS ({TRACKS.length})</span>
        </button>
      </div>

      {/* Center: Glowing Rotating Vinyl Record (Storyboard 08) */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-950 to-black border-4 border-zinc-800 shadow-[0_0_50px_rgba(240,124,34,0.35)] flex items-center justify-center">
          {/* Rotating Vinyl Grooves */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center p-3"
            style={{ transform: `rotate(${vinylAngle}deg)` }}
          >
            {/* Concentric sound grooves */}
            <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center">
              <div className="w-4/5 h-4/5 rounded-full border border-white/5 flex items-center justify-center">
                {/* Center Record Label */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-1 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-[8px] font-black font-mono text-black uppercase tracking-wider">
                    PRAXX
                  </span>
                  <span className="text-[7px] font-bold text-black/80 uppercase">
                    ORIGINALS
                  </span>
                  <div className="w-3 h-3 rounded-full bg-black mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold font-['Syne'] text-white">
            {audioState.currentTrack.title}
          </h3>
          <p className="text-xs text-amber-400 font-mono tracking-wider mt-0.5">
            DJ PRAXX • {audioState.currentTrack.genre}
          </p>
        </div>

        {/* Waveform Scrubber with Time Display */}
        <div className="w-full max-w-xs flex flex-col gap-1.5 mt-3">
          {/* Simulated Animated Waveform Bars */}
          <div className="h-10 w-full rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between px-2 gap-0.5">
            {Array.from({ length: 32 }).map((_, idx) => {
              const active = idx < (audioState.playbackTime / audioState.currentTrack.duration) * 32;
              return (
                <span
                  key={`wave-${idx}`}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    active ? 'bg-amber-400 h-6' : 'bg-zinc-800 h-2'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>{formatTime(audioState.playbackTime)}</span>
            <span className="text-zinc-600">A HIGHER STATE OF SOUND</span>
            <span>{formatTime(audioState.currentTrack.duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <button
            onClick={() => {
              HowlerEngine.triggerLightPulseSound();
              HowlerEngine.prevTrack();
            }}
            className="p-3 rounded-full bg-zinc-900 text-zinc-300 active:scale-95 transition-transform"
            aria-label="Previous Track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              HowlerEngine.triggerLightPulseSound();
              HowlerEngine.togglePlay();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-black font-black shadow-[0_0_25px_rgba(240,124,34,0.6)] active:scale-95 transition-transform"
            aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
          >
            {audioState.isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              HowlerEngine.triggerLightPulseSound();
              HowlerEngine.nextTrack();
            }}
            className="p-3 rounded-full bg-zinc-900 text-zinc-300 active:scale-95 transition-transform"
            aria-label="Next Track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom CTA to Sound Universe */}
      <div className="relative z-10 w-full max-w-xs pt-2">
        <button
          onClick={() => {
            HowlerEngine.triggerLightPulseSound();
            onNext();
          }}
          className="w-full py-3 rounded-full bg-zinc-900/90 border border-amber-500/50 text-white font-bold text-xs tracking-[0.2em] uppercase font-['Space_Grotesk'] hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>EXPLORE SOUND UNIVERSE</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Draggable Bottom Sheet for Tracklist (Storyboard 08) */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end justify-center animate-fade-in"
          onClick={() => setIsSheetOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-zinc-950 border-t border-amber-500/40 p-5 flex flex-col gap-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-1" />
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold font-['Syne'] text-white uppercase tracking-wider">
                SELECT PRAXX TRACK
              </h4>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                CLOSE
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {TRACKS.map((track, idx) => {
                const isSelected = audioState.currentTrackIndex === idx;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-900/80 border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold font-['Syne']">{track.title}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{track.genre}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-400">
                      {track.bpm} BPM
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
