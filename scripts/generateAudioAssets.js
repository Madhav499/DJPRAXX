import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public/audio');
const tracksDir = path.join(publicDir, 'tracks');
const sfxDir = path.join(publicDir, 'sfx');

fs.mkdirSync(tracksDir, { recursive: true });
fs.mkdirSync(sfxDir, { recursive: true });

function writeWavFile(filepath, sampleRate, numChannels, samplesL, samplesR) {
  const numSamples = samplesL.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Clamp sample between -1 and 1
    const sL = Math.max(-1, Math.min(1, samplesL[i]));
    const intL = sL < 0 ? Math.floor(sL * 32768) : Math.floor(sL * 32767);
    buffer.writeInt16LE(intL, offset);
    offset += 2;

    if (numChannels === 2) {
      const sR = Math.max(-1, Math.min(1, samplesR ? samplesR[i] : samplesL[i]));
      const intR = sR < 0 ? Math.floor(sR * 32768) : Math.floor(sR * 32767);
      buffer.writeInt16LE(intR, offset);
      offset += 2;
    }
  }

  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filepath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const sampleRate = 44100;

// Helper sound synthesizers
function addKick(samplesL, samplesR, startSample, durationSamples) {
  for (let i = 0; i < durationSamples; i++) {
    const idx = startSample + i;
    if (idx >= samplesL.length) break;
    const t = i / sampleRate;
    // Pitch drops from 160Hz to 38Hz exponentially
    const pitch = 38 + 122 * Math.exp(-t * 35);
    const env = Math.exp(-t * 14);
    const click = (i < 200 ? (1 - i / 200) * 0.4 : 0);
    const val = (Math.sin(2 * Math.PI * pitch * t) + click) * env * 0.85;
    samplesL[idx] += val;
    samplesR[idx] += val;
  }
}

function addSnareClap(samplesL, samplesR, startSample, durationSamples) {
  for (let i = 0; i < durationSamples; i++) {
    const idx = startSample + i;
    if (idx >= samplesL.length) break;
    const t = i / sampleRate;
    const env = Math.exp(-t * 22);
    // Noise + tone
    const noiseL = (Math.random() * 2 - 1) * 0.45;
    const noiseR = (Math.random() * 2 - 1) * 0.45;
    const tone = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 30) * 0.3;
    samplesL[idx] += (noiseL + tone) * env;
    samplesR[idx] += (noiseR + tone) * env;
  }
}

function addHiHat(samplesL, samplesR, startSample, durationSamples, volume = 0.25) {
  for (let i = 0; i < durationSamples; i++) {
    const idx = startSample + i;
    if (idx >= samplesL.length) break;
    const t = i / sampleRate;
    const env = Math.exp(-t * 80);
    const noiseL = (Math.random() * 2 - 1) * volume;
    const noiseR = (Math.random() * 2 - 1) * volume;
    samplesL[idx] += noiseL * env;
    samplesR[idx] += noiseR * env;
  }
}

function addBassNote(samplesL, samplesR, startSample, durationSamples, freq, filterEnvSpeed = 18) {
  for (let i = 0; i < durationSamples; i++) {
    const idx = startSample + i;
    if (idx >= samplesL.length) break;
    const t = i / sampleRate;
    const env = Math.exp(-t * 8);
    // Sawtooth / sub sine blend
    const saw = 2 * ((t * freq) % 1) - 1;
    const sub = Math.sin(2 * Math.PI * (freq / 2) * t);
    const filter = Math.exp(-t * filterEnvSpeed);
    const val = (saw * 0.5 * filter + sub * 0.5) * env * 0.45;
    samplesL[idx] += val;
    samplesR[idx] += val;
  }
}

function addSynthNote(samplesL, samplesR, startSample, durationSamples, freq, pan = 0) {
  for (let i = 0; i < durationSamples; i++) {
    const idx = startSample + i;
    if (idx >= samplesL.length) break;
    const t = i / sampleRate;
    const env = Math.exp(-t * 4);
    // Rich detuned saws
    const osc1 = Math.sin(2 * Math.PI * freq * t);
    const osc2 = Math.sin(2 * Math.PI * (freq * 1.004) * t);
    const osc3 = Math.sin(2 * Math.PI * (freq * 0.996) * t);
    const val = (osc1 * 0.4 + osc2 * 0.3 + osc3 * 0.3) * env * 0.22;
    samplesL[idx] += val * (1 - pan * 0.5);
    samplesR[idx] += val * (1 + pan * 0.5);
  }
}

// Generate the 5 tracks
const TRACK_DEFS = [
  {
    filename: 'midnight_drive.wav',
    bpm: 124,
    bassNotes: [55, 55, 65.4, 55, 73.4, 55, 65.4, 82.4],
    chords: [
      [220, 261.6, 329.6],
      [220, 261.6, 329.6],
      [246.9, 293.7, 369.9],
      [261.6, 329.6, 392.0],
    ],
  },
  {
    filename: 'higher_state.wav',
    bpm: 126,
    bassNotes: [43.6, 43.6, 43.6, 51.9, 43.6, 58.2, 43.6, 65.4],
    chords: [
      [277.2, 329.6, 415.3],
      [277.2, 329.6, 415.3],
      [311.1, 369.9, 466.2],
      [329.6, 415.3, 493.9],
    ],
  },
  {
    filename: 'people_like_us.wav',
    bpm: 125,
    bassNotes: [65.4, 65.4, 58.2, 65.4, 73.4, 65.4, 87.3, 73.4],
    chords: [
      [261.6, 329.6, 392.0],
      [293.7, 349.2, 440.0],
      [261.6, 329.6, 392.0],
      [329.6, 392.0, 493.9],
    ],
  },
  {
    filename: 'lost_in_rhythm.wav',
    bpm: 122,
    bassNotes: [49, 49, 55, 49, 61.7, 49, 55, 73.4],
    chords: [
      [246.9, 293.7, 369.9],
      [220, 261.6, 329.6],
      [246.9, 293.7, 369.9],
      [293.7, 349.2, 440.0],
    ],
  },
  {
    filename: 'rajkot_nights.wav',
    bpm: 128,
    bassNotes: [55, 65.4, 73.4, 82.4, 73.4, 65.4, 55, 49],
    chords: [
      [220, 246.9, 293.7, 349.2],
      [246.9, 293.7, 349.2, 440.0],
      [220, 261.6, 329.6, 392.0],
      [261.6, 329.6, 392.0, 493.9],
    ],
  },
];

TRACK_DEFS.forEach((track) => {
  const beatsPerMeasure = 4;
  const numMeasures = 4; // 16 beats = 64 16th note steps
  const totalBeats = beatsPerMeasure * numMeasures;
  const secondsPerBeat = 60 / track.bpm;
  const totalDuration = totalBeats * secondsPerBeat;
  const totalSamples = Math.floor(totalDuration * sampleRate);

  const samplesL = new Float32Array(totalSamples);
  const samplesR = new Float32Array(totalSamples);

  const stepDuration = 0.25 * secondsPerBeat;
  const stepSamples = Math.floor(stepDuration * sampleRate);

  for (let step = 0; step < 64; step++) {
    const startSample = Math.floor(step * stepSamples);

    // 1. Kick on every quarter note (step 0, 4, 8, 12, ...)
    if (step % 4 === 0) {
      addKick(samplesL, samplesR, startSample, Math.floor(sampleRate * 0.35));
    }

    // 2. Clap / Snare on beats 2 and 4 (step 4, 12, 20, 28, ...)
    if (step % 8 === 4) {
      addSnareClap(samplesL, samplesR, startSample, Math.floor(sampleRate * 0.2));
    }

    // 3. Hi-Hat offbeat
    if (step % 2 === 1) {
      const vol = step % 4 === 2 ? 0.3 : 0.16;
      addHiHat(samplesL, samplesR, startSample, Math.floor(sampleRate * 0.08), vol);
    }

    // 4. Bass note on 8th notes
    if (step % 2 === 0) {
      const noteIdx = (step / 2) % track.bassNotes.length;
      const freq = track.bassNotes[noteIdx];
      addBassNote(samplesL, samplesR, startSample, Math.floor(sampleRate * 0.24), freq);
    }

    // 5. Synth chords / melodic progression
    if (step % 16 === 0 || step % 16 === 6 || step % 16 === 10) {
      const chordIdx = Math.floor(step / 16) % track.chords.length;
      const chord = track.chords[chordIdx];
      chord.forEach((freq, i) => {
        const pan = (i - 1) * 0.4;
        addSynthNote(samplesL, samplesR, startSample, Math.floor(sampleRate * 0.45), freq, pan);
      });
    }
  }

  // Soft loop boundary crossfade (100 samples) to prevent clicks
  const fade = 120;
  for (let i = 0; i < fade; i++) {
    const factor = i / fade;
    samplesL[i] *= factor;
    samplesR[i] *= factor;
    samplesL[totalSamples - 1 - i] *= factor;
    samplesR[totalSamples - 1 - i] *= factor;
  }

  writeWavFile(path.join(tracksDir, track.filename), sampleRate, 2, samplesL, samplesR);
});

// Generate SFX:
// 1. Scratch Sound
{
  const duration = 0.22;
  const numSamples = Math.floor(duration * sampleRate);
  const sL = new Float32Array(numSamples);
  const sR = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 180 + 700 * Math.sin(Math.PI * (t / duration));
    const env = Math.sin(Math.PI * (t / duration)) * 0.7;
    const saw = 2 * ((t * freq) % 1) - 1;
    const noise = (Math.random() * 2 - 1) * 0.2;
    sL[i] = (saw + noise) * env;
    sR[i] = (saw + noise) * env;
  }
  writeWavFile(path.join(sfxDir, 'scratch.wav'), sampleRate, 2, sL, sR);
}

// 2. Light Pulse Sound
{
  const duration = 0.12;
  const numSamples = Math.floor(duration * sampleRate);
  const sL = new Float32Array(numSamples);
  const sR = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 880 * Math.exp(-t * 22);
    const env = Math.exp(-t * 30) * 0.6;
    const val = Math.sin(2 * Math.PI * freq * t) * env;
    sL[i] = val;
    sR[i] = val;
  }
  writeWavFile(path.join(sfxDir, 'light_pulse.wav'), sampleRate, 2, sL, sR);
}

// 3. Pyro Drop Sound
{
  const duration = 0.6;
  const numSamples = Math.floor(duration * sampleRate);
  const sL = new Float32Array(numSamples);
  const sR = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Sub drop 130Hz -> 30Hz
    const pitch = 30 + 100 * Math.exp(-t * 6);
    const sub = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 4) * 0.7;
    // Noise blast
    const noiseEnv = Math.exp(-t * 7) * 0.35;
    const noiseL = (Math.random() * 2 - 1) * noiseEnv;
    const noiseR = (Math.random() * 2 - 1) * noiseEnv;
    sL[i] = sub + noiseL;
    sR[i] = sub + noiseR;
  }
  writeWavFile(path.join(sfxDir, 'pyro_drop.wav'), sampleRate, 2, sL, sR);
}

console.log('All audio assets successfully generated!');
