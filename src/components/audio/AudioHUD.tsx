import React, { useEffect, useState } from 'react';
import { AudioEngine } from '../../audio/AudioEngine';
import { Volume2, VolumeX, Play, Pause, SkipForward, Disc3 } from 'lucide-react';

export const AudioHUD: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [bpm, setBpm] = useState(124);
  const [eqLevels, setEqLevels] = useState<number[]>([20, 45, 75, 55, 30]);

  useEffect(() => {
    const updateState = () => {
      const st = AudioEngine.getState();
      setIsPlaying(st.isPlaying);
      setIsMuted(st.isMuted);
      setTrackTitle(st.currentTrack.title);
      setBpm(st.bpm);
    };

    updateState();
    const unsubscribe = AudioEngine.subscribe(updateState);

    // Audio visualizer loop for mini HUD equalizer bars
    let animId: number;
    const updateEQ = () => {
      animId = requestAnimationFrame(updateEQ);
      const analysis = AudioEngine.getAudioAnalysis();
      if (AudioEngine.getState().isPlaying) {
        setEqLevels([
          Math.max(15, analysis.bass * 90),
          Math.max(15, (analysis.bass + analysis.mid) * 55),
          Math.max(15, analysis.mid * 85),
          Math.max(15, (analysis.mid + analysis.treble) * 65),
          Math.max(15, analysis.treble * 80),
        ]);
      } else {
        setEqLevels([12, 12, 12, 12, 12]);
      }
    };
    updateEQ();

    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTogglePlay = () => {
    AudioEngine.togglePlay();
  };

  const handleNext = () => {
    AudioEngine.nextTrack();
  };

  const handleToggleMute = () => {
    AudioEngine.toggleMute();
  };

  return (
    <aside
      className="fixed bottom-4 right-4 z-30 pointer-events-auto"
      aria-label="Audio Playback Controller"
    >
      <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Spinning Vinyl Icon */}
        <div className="relative flex items-center justify-center">
          <Disc3
            className={`w-6 h-6 text-amber-500 transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          />
          {isPlaying && (
            <span className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-80" />
          )}
        </div>

        {/* Track Title & BPM */}
        <div className="flex flex-col min-w-[120px] max-w-[160px]">
          <span className="text-[11px] font-semibold text-white truncate font-['Space_Grotesk']">
            {trackTitle || 'PRAXX Radio'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-amber-400/90 font-mono tracking-wider">
              {bpm} BPM
            </span>
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest">
              {isPlaying ? 'ON AIR' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Mini Real-time Equalizer Visualizer */}
        <div className="flex items-end gap-0.5 h-5 px-1.5 py-0.5 bg-zinc-950/60 rounded border border-white/5">
          {eqLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="w-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-t-sm transition-all duration-75"
              style={{ height: `${lvl}%` }}
            />
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={handleTogglePlay}
          className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-all active:scale-95"
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
        </button>

        {/* Skip Track */}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
          aria-label="Next Track"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
