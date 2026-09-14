import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Activity,
  X,
} from 'lucide-react';
import { AudioEngine } from '../../../audio/AudioEngine';

export const MobileAudioUI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioState, setAudioState] = useState(() => AudioEngine.getState());
  const [energy, setEnergy] = useState({ bass: 0, mid: 0, treble: 0, overall: 0 });

  useEffect(() => {
    // Subscribe to AudioEngine state changes
    const unsubscribe = AudioEngine.subscribe(() => {
      setAudioState(AudioEngine.getState());
    });

    // Real-time visualizer polling
    const interval = setInterval(() => {
      if (AudioEngine.getState().isPlaying) {
        const analysis = AudioEngine.getAudioAnalysis();
        setEnergy({
          bass: analysis.bass,
          mid: analysis.mid,
          treble: analysis.treble,
          overall: analysis.overall,
        });
      }
    }, 60);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Environmental Audio Affordance */}
      <div className="fixed top-3 right-3 z-40 select-none">
        <button
          onClick={() => {
            AudioEngine.triggerLightPulseSound();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-zinc-950/80 border border-amber-500/30 backdrop-blur-md shadow-[0_0_18px_rgba(240,124,34,0.25)] active:scale-95 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Open Mobile Audio Console"
        >
          {/* Animated live mini-bars */}
          <div className="flex items-end gap-0.5 h-3.5">
            {[0.4, 0.9, 0.6, 1.0, 0.5].map((scale, i) => (
              <span
                key={`bar-${i}`}
                className="w-0.5 rounded-full bg-amber-400 transition-all duration-150"
                style={{
                  height: audioState.isPlaying
                    ? `${Math.max(3, Math.min(14, (energy.overall + scale * 0.5) * 14))}px`
                    : '3px',
                  opacity: audioState.isPlaying ? 0.9 : 0.4,
                }}
              />
            ))}
          </div>

          <span className="text-[10px] tracking-wider font-mono text-amber-300 font-bold uppercase">
            {audioState.isPlaying ? 'ON AIR' : 'PAUSED'}
          </span>
        </button>
      </div>

      {/* Expanded Audio Console Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-zinc-950/95 border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(240,124,34,0.25)] flex flex-col gap-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
                  PRAXX AUDIO CORE
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-full bg-white/5 active:scale-95 transition-colors"
                aria-label="Close Audio Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest font-mono text-zinc-400 uppercase">
                  CURRENT SET
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {audioState.bpm} BPM
                </span>
              </div>
              <h3 className="text-lg font-bold font-['Syne'] text-white truncate">
                {audioState.currentTrack.title}
              </h3>
              <p className="text-xs text-zinc-400 font-['Space_Grotesk']">
                {audioState.currentTrack.genre}
              </p>
            </div>

            {/* Real-time Visualizer Strip */}
            <div className="h-10 w-full rounded-xl bg-black/60 border border-white/5 flex items-end justify-between px-3 py-1 gap-1">
              {Array.from({ length: 24 }).map((_, idx) => {
                const heightPct = audioState.isPlaying
                  ? Math.max(10, Math.min(100, (energy.overall * 80 + Math.sin(idx * 0.5) * 30 + Math.random() * 20)))
                  : 8;
                return (
                  <div
                    key={`spec-${idx}`}
                    className="flex-1 rounded-xs bg-gradient-to-t from-amber-600 to-amber-300 transition-all duration-75"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>

            {/* Time & Progress */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>{formatTime(audioState.playbackTime)}</span>
              <span>{formatTime(audioState.currentTrack.duration)}</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => {
                  AudioEngine.triggerLightPulseSound();
                  AudioEngine.prevTrack();
                }}
                className="p-3 rounded-full bg-zinc-900 border border-white/10 active:scale-95 transition-transform text-zinc-300 hover:text-white"
                aria-label="Previous Track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  AudioEngine.triggerLightPulseSound();
                  AudioEngine.togglePlay();
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-black font-black shadow-[0_0_25px_rgba(240,124,34,0.6)] active:scale-95 transition-transform"
                aria-label={audioState.isPlaying ? 'Pause Audio' : 'Play Audio'}
              >
                {audioState.isPlaying ? (
                  <Pause className="w-6 h-6 fill-black" />
                ) : (
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  AudioEngine.triggerLightPulseSound();
                  AudioEngine.nextTrack();
                }}
                className="p-3 rounded-full bg-zinc-900 border border-white/10 active:scale-95 transition-transform text-zinc-300 hover:text-white"
                aria-label="Next Track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume & Mute */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  AudioEngine.triggerLightPulseSound();
                  AudioEngine.toggleMute();
                }}
                className="p-2 rounded-lg bg-zinc-900 text-amber-400 active:scale-95"
                aria-label={audioState.isMuted ? 'Unmute' : 'Mute'}
              >
                {audioState.isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="0.75"
                onChange={(e) => AudioEngine.setVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1 bg-zinc-800 rounded-lg"
                aria-label="Master Volume"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
