import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, Radio, ChevronRight } from 'lucide-react';
import { AudioEngine, TRACKS } from '../../audio/AudioEngine';

interface PraxxRadioSceneProps {
  onNext: () => void;
}

export const PraxxRadioScene: React.FC<PraxxRadioSceneProps> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({
    midnight_drive: true,
  });

  useEffect(() => {
    const syncState = () => {
      const st = AudioEngine.getState();
      setIsPlaying(st.isPlaying);
      setCurrentTrackIndex(st.currentTrackIndex);
      setPlaybackTime(st.playbackTime);
    };

    syncState();
    const unsub = AudioEngine.subscribe(syncState);
    return () => {
      unsub();
    };
  }, []);

  const currentTrack = TRACKS[currentTrackIndex];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    AudioEngine.togglePlay();
  };

  const handleTrackSelect = (idx: number) => {
    AudioEngine.setTrack(idx);
    if (!isPlaying) AudioEngine.play();
  };

  const toggleFavorite = (trackId: string) => {
    setIsLiked((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-between pt-28 pb-12 px-4 sm:px-6 select-none">
      {/* Scene Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] tracking-[0.3em] text-amber-400 font-mono uppercase">
            SCENE 10 • PRAXX RADIO
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black tracking-[0.3em] text-white font-['Syne'] uppercase text-glow">
          LIVE SESSIONS & EXCLUSIVE EDITS
        </h2>
      </div>

      {/* Main Music Player Component (Storyboard 10) */}
      <div className="w-full max-w-4xl my-auto p-6 md:p-8 rounded-3xl bg-zinc-950/85 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Realistic Spinning Vinyl Record */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div
              className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black border-4 border-zinc-800 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex items-center justify-center transition-transform ${
                isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
              }`}
            >
              {/* Vinyl Micro-Grooves */}
              <div className="absolute inset-3 rounded-full border border-zinc-800/80 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-zinc-700/60 pointer-events-none" />
              <div className="absolute inset-9 rounded-full border border-zinc-800/70 pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-zinc-700/50 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-zinc-800/60 pointer-events-none" />

              {/* Center Vinyl Label */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-amber-600 to-amber-950 border-2 border-amber-400/80 shadow-[inset_0_0_15px_#f07c22] flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                <span className="text-[8px] font-bold text-amber-200 tracking-widest uppercase">
                  PRAXX
                </span>
                <span className="text-[7px] text-amber-300 font-mono">RADIO 01</span>
                {/* Center spindle hole */}
                <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/40 mt-1" />
              </div>
            </div>

            <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-mono mt-4">
              33 ⅓ RPM • STEREO HIGH FIDELITY
            </span>
          </div>

          {/* Right: Track Info, Waveform, Controls, Tracklist */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {/* Header / Current Track */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-amber-400 font-mono uppercase font-bold">
                  NOW PLAYING
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white font-['Syne'] tracking-wide">
                  {currentTrack.title}
                </h3>
                <span className="text-xs text-zinc-400 font-['Space_Grotesk']">
                  {currentTrack.genre}
                </span>
              </div>

              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Add to Favorites"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked[currentTrack.id]
                      ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_#f07c22]'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                />
              </button>
            </div>

            {/* Simulated Live Audio Waveform visualizer */}
            <div className="w-full h-12 bg-zinc-950/90 rounded-xl border border-white/5 px-3 flex items-center justify-between gap-1 my-3 overflow-hidden">
              {[...Array(38)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-full transition-all duration-100"
                  style={{
                    height: isPlaying
                      ? `${25 + Math.sin(i * 0.4 + playbackTime * 4) * 35 + ((i * 17) % 30)}%`
                      : '15%',
                  }}
                />
              ))}
            </div>

            {/* Time readout */}
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-4">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>

            {/* Playback Transport Buttons */}
            <div className="flex items-center justify-center gap-5 mb-6">
              <button
                onClick={() => AudioEngine.prevTrack()}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-90"
                aria-label="Previous Track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_#f07c22] active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
              </button>

              <button
                onClick={() => AudioEngine.nextTrack()}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-90"
                aria-label="Next Track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Tracklist Queue */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-mono mb-1">
                EXCLUSIVES QUEUE
              </span>
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => handleTrackSelect(idx)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-all ${
                    idx === currentTrackIndex
                      ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                      : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500">{`0${idx + 1}`}</span>
                    <span className="text-xs font-semibold">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{t.bpm} BPM</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advance to Sound Universe */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold tracking-[0.2em] uppercase text-xs hover:from-amber-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(240,124,34,0.5)] active:scale-95"
        >
          <span>EXPLORE SOUND UNIVERSE</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
