/**
 * DJ PRAXX Web Audio Engine
 * Real-time synthesis, dance music sequencer, audio analysis, and DJ FX.
 * Zero external audio file dependencies - 100% self-contained Web Audio API.
 */

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  duration: number; // in seconds
  description: string;
}

export const TRACKS: TrackInfo[] = [
  {
    id: 'midnight_drive',
    title: 'Midnight Drive',
    genre: 'Deep Progressive / Bollywood Edit',
    bpm: 124,
    duration: 214,
    description: 'Deep progressive bassline woven with evocative nocturnal melody lines.',
  },
  {
    id: 'higher_state',
    title: 'Higher State',
    genre: 'Melodic Techno / Festival Energy',
    bpm: 126,
    duration: 248,
    description: 'Peak-hour synth euphoria designed for massive arena laser arrays.',
  },
  {
    id: 'people_like_us',
    title: 'People Like Us',
    genre: 'Uplifting Club House',
    bpm: 125,
    duration: 195,
    description: 'Soulful organ chords with rolling bass and infectious crowd hooks.',
  },
  {
    id: 'lost_in_rhythm',
    title: 'Lost In Rhythm',
    genre: 'Afro Progressive / Percussive',
    bpm: 122,
    duration: 230,
    description: 'Syncopated tribal percussions, deep sub vibrations, and atmospheric drops.',
  },
  {
    id: 'rajkot_nights',
    title: 'Rajkot Nights',
    genre: 'Festival Fusion / Iconic Edit',
    bpm: 128,
    duration: 260,
    description: 'Signature PRAXX fusion connecting traditional heritage with thunderous modern club drops.',
  },
];

export interface AudioAnalysis {
  bass: number; // 0 to 1
  mid: number; // 0 to 1
  treble: number; // 0 to 1
  overall: number; // 0 to 1
  beatTrigger: boolean;
}

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;

  private isInitialized = false;
  private isPlaying = false;
  private isMuted = false;
  private currentTrackIndex = 0;
  private playbackTime = 0;
  private timerId: number | null = null;

  // Step sequencer variables
  private step = 0;
  private bpm = 124;
  private nextNoteTime = 0;
  private scheduleAheadTime = 0.15;
  private lookahead = 25; // ms
  private schedulerInterval: number | null = null;

  // Audio analysis cache
  private cachedAnalysis: AudioAnalysis = {
    bass: 0,
    mid: 0,
    treble: 0,
    overall: 0,
    beatTrigger: false,
  };
  private lastBeatTime = 0;

  // Listeners
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Lazy init on first user gesture
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));

      // Connect graph: Sound Nodes -> filterNode -> masterGain -> analyser -> destination
      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
      this.notify();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  public async startAudio(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.play();
    return true;
  }

  public play() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.bpm = TRACKS[this.currentTrackIndex].bpm;
    this.nextNoteTime = this.ctx.currentTime;
    this.step = 0;

    // Start background sequencing loop
    if (this.schedulerInterval) clearInterval(this.schedulerInterval);
    this.schedulerInterval = window.setInterval(() => {
      this.scheduler();
    }, this.lookahead);

    // Playback timer
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = window.setInterval(() => {
      if (this.isPlaying) {
        this.playbackTime = (this.playbackTime + 1) % TRACKS[this.currentTrackIndex].duration;
        this.notify();
      }
    }, 1000);

    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
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
    this.currentTrackIndex = index;
    this.playbackTime = 0;
    this.bpm = TRACKS[index].bpm;
    this.step = 0;
    if (this.isPlaying && this.ctx) {
      this.nextNoteTime = this.ctx.currentTime;
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
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : clamped, this.ctx.currentTime, 0.05);
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setDJFilter(cutoffNormalized: number) {
    // cutoff: 0 = lowpass dark, 0.5 = flat open, 1 = highpass bright
    if (!this.filterNode || !this.ctx) return;
    if (cutoffNormalized <= 0.5) {
      // Lowpass: from 200Hz to 20000Hz
      const freq = 200 + (cutoffNormalized / 0.5) * 19800;
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    } else {
      // Highpass: from 20Hz to 8000Hz
      const freq = 20 + ((cutoffNormalized - 0.5) / 0.5) * 8000;
      this.filterNode.type = 'highpass';
      this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Sound effect for DJ scratch action
   */
  public triggerScratch(velocity: number) {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 220 + Math.abs(velocity) * 600;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (velocity > 0 ? 1.8 : 0.4), now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.filterNode);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Sound effect for button click / fixture activation
   */
  public triggerLightPulseSound() {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.filterNode);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Sound effect for stage pyro / strobe / bass drop
   */
  public triggerPyroDropSound() {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;

    // Sub drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.filterNode);
    osc.start(now);
    osc.stop(now + 0.55);

    // White noise blast (CO2 / pyro hiss)
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2500, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.filterNode);
    noise.start(now);
  }

  /**
   * Internal step sequencer scheduler
   */
  private scheduler() {
    if (!this.ctx) return;
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.step, this.nextNoteTime);
      this.advanceStep();
    }
  }

  private advanceStep() {
    const secondsPerBeat = 60.0 / this.bpm;
    const stepDuration = 0.25 * secondsPerBeat; // 16th note steps
    this.nextNoteTime += stepDuration;
    this.step = (this.step + 1) % 16;
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.filterNode) return;

    // 1. Kick drum on beats 0, 4, 8, 12 (4-on-the-floor)
    if (step % 4 === 0) {
      this.playKick(time);
    }

    // 2. Snare / Clap on beats 4, 12
    if (step === 4 || step === 12) {
      this.playClap(time);
    }

    // 3. Offbeat Hi-Hat on steps 2, 6, 10, 14
    if (step % 2 === 2) {
      this.playHiHat(time, step % 4 === 2 ? 0.25 : 0.12);
    }

    // 4. Bassline pattern (syncopated electronic pulse)
    const trackIndex = this.currentTrackIndex;
    const bassNotes = [
      [55, 55, 65.4, 55, 73.4, 55, 65.4, 82.4], // Midnight Drive
      [43.6, 43.6, 43.6, 51.9, 43.6, 58.2, 43.6, 65.4], // Higher State
      [65.4, 65.4, 58.2, 65.4, 73.4, 65.4, 87.3, 73.4], // People Like Us
      [49, 49, 55, 49, 61.7, 49, 55, 73.4], // Lost In Rhythm
      [55, 65.4, 73.4, 82.4, 73.4, 65.4, 55, 49], // Rajkot Nights
    ][trackIndex % 5];

    if (step % 2 === 0) {
      const noteFreq = bassNotes[(step / 2) % bassNotes.length];
      this.playBass(time, noteFreq);
    }

    // 5. Ambient Melodic Lead / Chords on select steps
    if (step === 0 || step === 6 || step === 10) {
      const leadNotes = [
        [220, 261.6, 329.6],
        [277.2, 329.6, 415.3],
        [261.6, 329.6, 392.0],
        [246.9, 293.7, 369.9],
        [220, 246.9, 293.7, 349.2],
      ][trackIndex % 5];
      this.playSynthChord(time, leadNotes);
    }
  }

  private playKick(time: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.09);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.filterNode);
    osc.start(time);
    osc.stop(time + 0.3);

    // Audio Analysis trigger
    this.cachedAnalysis.beatTrigger = true;
    this.lastBeatTime = Date.now();
  }

  private playClap(time: number) {
    if (!this.ctx || !this.filterNode) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.filterNode);
    noise.start(time);
  }

  private playHiHat(time: number, volume: number) {
    if (!this.ctx || !this.filterNode) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.filterNode);
    noise.start(time);
  }

  private playBass(time: number, freq: number) {
    if (!this.ctx || !this.filterNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(450, time);
    bassFilter.frequency.exponentialRampToValueAtTime(120, time + 0.18);

    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(bassFilter);
    bassFilter.connect(gain);
    gain.connect(this.filterNode);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playSynthChord(time: number, freqs: number[]) {
    if (!this.ctx || !this.filterNode) return;
    freqs.forEach((freq) => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.45);
    });
  }

  /**
   * Real-time analysis for 3D stage lighting rig
   */
  public getAudioAnalysis(): AudioAnalysis {
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

    // Average lower bins for bass (0-6)
    let bassSum = 0;
    for (let i = 0; i < 6; i++) {
      bassSum += this.dataArray[i];
    }
    const bass = bassSum / (6 * 255);

    // Mids (7-32)
    let midSum = 0;
    for (let i = 7; i < 32; i++) {
      midSum += this.dataArray[i];
    }
    const mid = midSum / (25 * 255);

    // Treble (33-90)
    let trebleSum = 0;
    for (let i = 33; i < 90; i++) {
      trebleSum += this.dataArray[i];
    }
    const treble = trebleSum / (57 * 255);

    const overall = (bass * 0.5 + mid * 0.3 + treble * 0.2);
    const beatTrigger = (Date.now() - this.lastBeatTime) < 80;

    this.cachedAnalysis = {
      bass,
      mid,
      treble,
      overall,
      beatTrigger,
    };

    return this.cachedAnalysis;
  }

  public getState() {
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

export const AudioEngine = new AudioEngineClass();
