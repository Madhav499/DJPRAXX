import { Howl, Howler } from "howler";

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  duration: number;
  description: string;
  src?: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: "midnight_drive",
    title: "Midnight Drive",
    genre: "Deep Progressive / Bollywood Edit",
    bpm: 124,
    duration: 214,
    description:
      "Deep progressive bassline woven with evocative nocturnal melody lines.",
    src: "/audio/tracks/midnight_drive.wav",
  },
  {
    id: "higher_state",
    title: "Higher State",
    genre: "Melodic Techno / Festival Energy",
    bpm: 126,
    duration: 248,
    description:
      "Peak-hour synth euphoria designed for massive arena laser arrays.",
    src: "/audio/tracks/higher_state.wav",
  },
  {
    id: "people_like_us",
    title: "People Like Us",
    genre: "Uplifting Club House",
    bpm: 125,
    duration: 195,
    description:
      "Soulful organ chords with rolling bass and infectious crowd hooks.",
    src: "/audio/tracks/people_like_us.wav",
  },
  {
    id: "lost_in_rhythm",
    title: "Lost In Rhythm",
    genre: "Afro Progressive / Percussive",
    bpm: 122,
    duration: 230,
    description:
      "Syncopated tribal percussions, deep sub vibrations, and atmospheric drops.",
    src: "/audio/tracks/lost_in_rhythm.wav",
  },
  {
    id: "rajkot_nights",
    title: "Rajkot Nights",
    genre: "Festival Fusion / Iconic Edit",
    bpm: 128,
    duration: 260,
    description:
      "Signature PRAXX fusion connecting traditional heritage with thunderous modern club drops.",
    src: "/audio/tracks/rajkot_nights.wav",
  },
];

export interface AudioAnalysis {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
  beatTrigger: boolean;
}

export interface AudioEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: TrackInfo;
  currentTrackIndex: number;
  playbackTime: number;
  bpm: number;
}

class HowlerEngineClass {
  private isInitialized = false;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.8;
  private currentTrackIndex = 0;
  private playbackTime = 0;
  private timerId: number | null = null;
  private bpm = TRACKS[0].bpm;

  private trackHowls: Howl[] = [];
  private scratchHowl: Howl | null = null;
  private lightPulseHowl: Howl | null = null;
  private pyroDropHowl: Howl | null = null;

  private filterNode: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private nodesConnected = false;

  private cachedAnalysis: AudioAnalysis = {
    bass: 0.1,
    mid: 0.05,
    treble: 0.05,
    overall: 0.08,
    beatTrigger: false,
  };

  private lastBeatTime = 0;
  private listeners = new Set<() => void>();

  public init() {
    if (this.isInitialized) {
      if (Howler.ctx?.state === "suspended") {
        Howler.ctx.resume().catch(() => undefined);
      }
      return;
    }

    try {
      Howler.autoUnlock = true;
      Howler.volume(this.volume);

      this.trackHowls = TRACKS.map(
        (track) =>
          new Howl({
            src: [track.src || `/audio/tracks/${track.id}.wav`],
            format: ["wav"],
            html5: false,
            loop: true,
            volume: 1,
            preload: true,
            onloaderror: (_id, error) => {
              console.warn(
                `[HowlerEngine] Failed to load track ${track.title}:`,
                error,
              );
            },
          }),
      );

      this.scratchHowl = new Howl({
        src: ["/audio/sfx/scratch.wav"],
        format: ["wav"],
        html5: false,
        volume: 0.6,
        preload: true,
      });

      this.lightPulseHowl = new Howl({
        src: ["/audio/sfx/light_pulse.wav"],
        format: ["wav"],
        html5: false,
        volume: 0.4,
        preload: true,
      });

      this.pyroDropHowl = new Howl({
        src: ["/audio/sfx/pyro_drop.wav"],
        format: ["wav"],
        html5: false,
        volume: 0.8,
        preload: true,
      });

      this.connectWebAudioNodes();
      this.isInitialized = true;
      this.notify();
    } catch (error) {
      console.warn("[HowlerEngine] Audio initialization failed:", error);
    }
  }

  private connectWebAudioNodes() {
    if (this.nodesConnected) return;

    try {
      const context = Howler.ctx;
      const masterGain = Howler.masterGain;

      if (!context || !masterGain) return;

      masterGain.disconnect();

      this.filterNode = context.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(20000, context.currentTime);
      this.filterNode.Q.setValueAtTime(2, context.currentTime);

      this.analyser = context.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(
        new ArrayBuffer(this.analyser.frequencyBinCount),
      );

      masterGain.connect(this.filterNode);
      this.filterNode.connect(this.analyser);
      this.analyser.connect(context.destination);

      this.nodesConnected = true;
    } catch (error) {
      console.warn("[HowlerEngine] Failed to connect Web Audio nodes:", error);
    }
  }

  public async startAudio(): Promise<boolean> {
    this.init();

    if (Howler.ctx?.state === "suspended") {
      try {
        await Howler.ctx.resume();
      } catch (error) {
        console.warn("[HowlerEngine] ctx.resume() error:", error);
      }
    }

    this.connectWebAudioNodes();
    this.play();
    return true;
  }

  public play() {
    this.init();
    this.connectWebAudioNodes();

    if (Howler.ctx?.state === "suspended") {
      Howler.ctx.resume().catch(() => undefined);
    }

    if (this.isPlaying) return;

    const currentHowl = this.trackHowls[this.currentTrackIndex];
    if (currentHowl) {
      currentHowl.play();
      if (this.playbackTime > 0) currentHowl.seek(this.playbackTime);
    }

    this.isPlaying = true;
    this.bpm = TRACKS[this.currentTrackIndex].bpm;
    this.startPlaybackTimer();
    this.notify();
  }

  public pause() {
    if (!this.isPlaying) return;

    this.trackHowls[this.currentTrackIndex]?.pause();
    this.isPlaying = false;
    this.stopPlaybackTimer();
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  public setTrack(index: number) {
    if (index < 0 || index >= TRACKS.length) return;
    if (index === this.currentTrackIndex) return;

    const wasPlaying = this.isPlaying;
    this.trackHowls[this.currentTrackIndex]?.stop();

    this.currentTrackIndex = index;
    this.playbackTime = 0;
    this.bpm = TRACKS[index].bpm;

    if (wasPlaying) {
      this.trackHowls[index]?.play();
    }

    this.notify();
  }

  public nextTrack() {
    this.setTrack((this.currentTrackIndex + 1) % TRACKS.length);
  }

  public prevTrack() {
    this.setTrack((this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  }

  public seekTo(seconds: number) {
    this.init();

    const duration = TRACKS[this.currentTrackIndex]?.duration ?? 0;
    const clamped = Math.max(0, Math.min(duration, seconds));
    const currentHowl = this.trackHowls[this.currentTrackIndex];

    if (currentHowl) currentHowl.seek(clamped);
    this.playbackTime = clamped;
    this.notify();
  }

  public setVolume(value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    this.volume = clamped;
    Howler.volume(clamped);

    if (clamped > 0 && this.isMuted) {
      this.isMuted = false;
      Howler.mute(false);
    }

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

    const normalized = Math.max(0, Math.min(1, cutoffNormalized));

    if (normalized <= 0.5) {
      const frequency = 200 + (normalized / 0.5) * 19800;
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setTargetAtTime(
        frequency,
        Howler.ctx.currentTime,
        0.05,
      );
    } else {
      const frequency = 20 + ((normalized - 0.5) / 0.5) * 8000;
      this.filterNode.type = "highpass";
      this.filterNode.frequency.setTargetAtTime(
        frequency,
        Howler.ctx.currentTime,
        0.05,
      );
    }
  }

  public triggerScratch(velocity: number) {
    this.init();
    if (!this.scratchHowl) return;

    const rate = Math.max(0.4, Math.min(3, Math.abs(velocity) * 0.8 + 0.6));
    this.scratchHowl.rate(rate);
    this.scratchHowl.play();
  }

  public triggerLightPulseSound() {
    this.init();
    this.lightPulseHowl?.play();
  }

  public triggerPyroDropSound() {
    this.init();
    this.pyroDropHowl?.play();
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

    let bassSum = 0;
    for (let index = 0; index < 6; index += 1) {
      bassSum += this.dataArray[index];
    }
    const bass = bassSum / (6 * 255);

    let midSum = 0;
    for (let index = 7; index < 32; index += 1) {
      midSum += this.dataArray[index];
    }
    const mid = midSum / (25 * 255);

    let trebleSum = 0;
    for (let index = 33; index < 90; index += 1) {
      trebleSum += this.dataArray[index];
    }
    const treble = trebleSum / (57 * 255);

    const overall = bass * 0.5 + mid * 0.3 + treble * 0.2;

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
      volume: this.volume,
      currentTrack: TRACKS[this.currentTrackIndex],
      currentTrackIndex: this.currentTrackIndex,
      playbackTime: this.playbackTime,
      bpm: this.bpm,
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private startPlaybackTimer() {
    this.stopPlaybackTimer();

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying) return;

      const currentHowl = this.trackHowls[this.currentTrackIndex];
      const seekValue = currentHowl?.seek();

      if (typeof seekValue === "number" && !Number.isNaN(seekValue)) {
        this.playbackTime = seekValue;
      } else {
        const duration = TRACKS[this.currentTrackIndex].duration;
        this.playbackTime = (this.playbackTime + 1) % duration;
      }

      this.notify();
    }, 250);
  }

  private stopPlaybackTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const HowlerEngine = new HowlerEngineClass();
export const howlerEngine = HowlerEngine;
