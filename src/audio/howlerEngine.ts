import { Howl, Howler } from 'howler';

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  duration: number; // in seconds
  description: string;
  src?: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: 'midnight_drive',
    title: 'Midnight Drive',
    genre: 'Deep Progressive / Bollywood Edit',
    bpm: 124,
    duration: 214,
    description: 'Deep progressive bassline woven with evocative nocturnal melody lines.',
    src: '/audio/tracks/midnight_drive.wav',
  },
  {
    id: 'higher_state',
    title: 'Higher State',
    genre: 'Melodic Techno / Festival Energy',
    bpm: 126,
    duration: 248,
    description: 'Peak-hour synth euphoria designed for massive arena laser arrays.',
    src: '/audio/tracks/higher_state.wav',
  },
  {
    id: 'people_like_us',
    title: 'People Like Us',
    genre: 'Uplifting Club House',
    bpm: 125,
    duration: 195,
    description: 'Soulful organ chords with rolling bass and infectious crowd hooks.',
    src: '/audio/tracks/people_like_us.wav',
  },
  {
    id: 'lost_in_rhythm',
    title: 'Lost In Rhythm',
    genre: 'Afro Progressive / Percussive',
    bpm: 122,
    duration: 230,
    description: 'Syncopated tribal percussions, deep sub vibrations, and atmospheric drops.',
    src: '/audio/tracks/lost_in_rhythm.wav',
  },
  {
    id: 'rajkot_nights',
    title: 'Rajkot Nights',
    genre: 'Festival Fusion / Iconic Edit',
    bpm: 128,
    duration: 260,
    description: 'Signature PRAXX fusion connecting traditional heritage with thunderous modern club drops.',
    src: '/audio/tracks/rajkot_nights.wav',
  },
];

export interface AudioAnalysis {
  bass: number; // 0 to 1
  mid: number; // 0 to 1
  treble: number; // 0 to 1
  overall: number; // 0 to 1
  beatTrigger: boolean;
}

export interface AudioEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: TrackInfo;
  currentTrackIndex: number;
  playbackTime: number;
  bpm: number;
}

class HowlerEngineClass {
  private isInitialized = false;
  private isPlaying = false;
  private isMuted = false;
  private currentTrackIndex = 0;
  private playbackTime = 0;
  private timerId: number | null = null;
  private bpm = 124;

  // Howl instances
  private trackHowls: Howl[] = [];
  private scratchHowl: Howl | null = null;
  private lightPulseHowl: Howl | null = null;
  private pyroDropHowl: Howl | null = null;

  // Web Audio nodes wired to Howler
  private filterNode: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private nodesConnected = false;

  // Analysis cache
  private cachedAnalysis: AudioAnalysis = {
    bass: 0.1,
    mid: 0.05,
    treble: 0.05,
    overall: 0.08,
    beatTrigger: false,
  };
  private lastBeatTime = 0;

  // Listeners
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.bpm = TRACKS[0].bpm;
  }

  public init() {
    if (this.isInitialized) {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      // Ensure Howler uses Web Audio and default volume
      Howler.autoUnlock = true;
      Howler.volume(0.8);

      // Create track Howl instances
      this.trackHowls = TRACKS.map((track) => {
        return new Howl({
          src: [track.src || `/audio/tracks/${track.id}.wav`],
          format: ['wav'],
          html5: false, // forces Web Audio API routing
          loop: true,
          volume: 0.8,
          preload: true,
          onloaderror: (_id, err) => {
            console.warn(`[HowlerEngine] Failed to load track ${track.title}:`, err);
          },
        });
      });

      // Create SFX Howl instances
      this.scratchHowl = new Howl({
        src: ['/audio/sfx/scratch.wav'],
        format: ['wav'],
        html5: false,
        volume: 0.6,
        preload: true,
      });

      this.lightPulseHowl = new Howl({
        src: ['/audio/sfx/light_pulse.wav'],
        format: ['wav'],
        html5: false,
        volume: 0.4,
        preload: true,
      });

      this.pyroDropHowl = new Howl({
        src: ['/audio/sfx/pyro_drop.wav'],
        format: ['wav'],
        html5: false,
        volume: 0.8,
        preload: true,
      });

      this.connectWebAudioNodes();

      this.isInitialized = true;
      this.notify();
    } catch (e) {
      console.warn('[HowlerEngine] Audio initialization failed:', e);
    }
  }

  /**
   * Route Howler's masterGain through custom BiquadFilter and AnalyserNode
   */
  private connectWebAudioNodes() {
    if (this.nodesConnected) return;
    try {
      const ctx = Howler.ctx;
      const masterGain = Howler.masterGain;

      if (!ctx || !masterGain) {
        // Will retry upon first user playback
        return;
      }

      // Disconnect default masterGain -> ctx.destination
      masterGain.disconnect();

      // Create DJ Filter
      this.filterNode = ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(20000, ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2, ctx.currentTime);

      // Create AnalyserNode
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));

      // Graph: Howler.masterGain -> filterNode -> analyser -> destination
      masterGain.connect(this.filterNode);
      this.filterNode.connect(this.analyser);
      this.analyser.connect(ctx.destination);

      this.nodesConnected = true;
    } catch (e) {
      console.warn('[HowlerEngine] Failed to connect Web Audio nodes:', e);
    }
  }

  public async startAudio(): Promise<boolean> {
    this.init();
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      try {
        await Howler.ctx.resume();
      } catch (err) {
        console.warn('[HowlerEngine] ctx.resume() error:', err);
      }
    }
    this.connectWebAudioNodes();
    this.play();
    return true;
  }

  public play() {
    this.init();
    this.connectWebAudioNodes();

    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().catch(() => {});
    }

    if (this.isPlaying) return;

    const currentHowl = this.trackHowls[this.currentTrackIndex];
    if (currentHowl) {
      currentHowl.play();
    }

    this.isPlaying = true;
    this.bpm = TRACKS[this.currentTrackIndex].bpm;

    // Start playback timer
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = window.setInterval(() => {
      if (this.isPlaying) {
        const howl = this.trackHowls[this.currentTrackIndex];
        if (howl && typeof howl.seek === 'function') {
          const seekVal = howl.seek();
          if (typeof seekVal === 'number' && !isNaN(seekVal)) {
            this.playbackTime = Math.floor(seekVal);
          } else {
            this.playbackTime = (this.playbackTime + 1) % TRACKS[this.currentTrackIndex].duration;
          }
        } else {
          this.playbackTime = (this.playbackTime + 1) % TRACKS[this.currentTrackIndex].duration;
        }
        this.notify();
      }
    }, 1000);

    this.notify();
  }

  public pause() {
    if (!this.isPlaying) return;

    const currentHowl = this.trackHowls[this.currentTrackIndex];
    if (currentHowl) {
      currentHowl.pause();
    }

    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setTrack(index: number) {
    if (index < 0 || index >= TRACKS.length) return;
    if (index === this.currentTrackIndex && this.isPlaying) return;

    const prevHowl = this.trackHowls[this.currentTrackIndex];
    if (prevHowl) {
      prevHowl.stop();
    }

    this.currentTrackIndex = index;
    this.playbackTime = 0;
    this.bpm = TRACKS[index].bpm;

    if (this.isPlaying) {
      const nextHowl = this.trackHowls[index];
      if (nextHowl) {
        nextHowl.play();
      }
    }

    this.notify();
  }

  public nextTrack() {
    this.setTrack((this.currentTrackIndex + 1) % TRACKS.length);
  }

  public prevTrack() {
    this.setTrack((this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    Howler.volume(clamped);
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    this.notify();
  }

  public setDJFilter(cutoffNormalized: number) {
    this.connectWebAudioNodes();
    if (!this.filterNode || !Howler.ctx) return;

    if (cutoffNormalized <= 0.5) {
      // Lowpass: from 200Hz to 20000Hz
      const freq = 200 + (cutoffNormalized / 0.5) * 19800;
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setTargetAtTime(freq, Howler.ctx.currentTime, 0.05);
    } else {
      // Highpass: from 20Hz to 8000Hz
      const freq = 20 + ((cutoffNormalized - 0.5) / 0.5) * 8000;
      this.filterNode.type = 'highpass';
      this.filterNode.frequency.setTargetAtTime(freq, Howler.ctx.currentTime, 0.05);
    }
  }

  public triggerScratch(velocity: number) {
    this.init();
    if (!this.scratchHowl) return;
    const rate = Math.max(0.4, Math.min(3.0, Math.abs(velocity) * 0.8 + 0.6));
    this.scratchHowl.rate(rate);
    this.scratchHowl.play();
  }

  public triggerLightPulseSound() {
    this.init();
    if (this.lightPulseHowl) {
      this.lightPulseHowl.play();
    }
  }

  public triggerPyroDropSound() {
    this.init();
    if (this.pyroDropHowl) {
      this.pyroDropHowl.play();
    }
  }

  public getAudioAnalysis(): AudioAnalysis {
    this.connectWebAudioNodes();

    if (!this.analyser || !this.dataArray || !this.isPlaying) {
      return {
        bass: 0.1,
        mid: 0.05,
        treble: 0.05,
        overall: 0.08,
        beatTrigger: false,
      };
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    // Bass bins (0-6)
    let bassSum = 0;
    for (let i = 0; i < 6; i++) {
      bassSum += this.dataArray[i];
    }
    const bass = bassSum / (6 * 255);

    // Mid bins (7-32)
    let midSum = 0;
    for (let i = 7; i < 32; i++) {
      midSum += this.dataArray[i];
    }
    const mid = midSum / (25 * 255);

    // Treble bins (33-90)
    let trebleSum = 0;
    for (let i = 33; i < 90; i++) {
      trebleSum += this.dataArray[i];
    }
    const treble = trebleSum / (57 * 255);

    const overall = bass * 0.5 + mid * 0.3 + treble * 0.2;

    // Detect beat trigger
    if (bass > 0.65 && Date.now() - this.lastBeatTime > 250) {
      this.lastBeatTime = Date.now();
    }
    const beatTrigger = Date.now() - this.lastBeatTime < 80;

    this.cachedAnalysis = {
      bass,
      mid,
      treble,
      overall,
      beatTrigger,
    };

    return this.cachedAnalysis;
  }

  public getState(): AudioEngineState {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      currentTrack: TRACKS[this.currentTrackIndex],
      currentTrackIndex: this.currentTrackIndex,
      playbackTime: this.playbackTime,
      bpm: this.bpm,
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const HowlerEngine = new HowlerEngineClass();
export const howlerEngine = HowlerEngine;
