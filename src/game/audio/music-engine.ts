/**
 * Procedural Dynamic Music Engine for NovaScript.
 * Generates evolving multi-layered procedural soundtracks via Web Audio API:
 * - Scene-specific soundtracks (Menu, Command Hub, Hangar, Lab, Comms, Active Mission, Crisis, Launch, Victory, Failure)
 * - Harmonically rich chords, sub-bass movement, and arpeggiation
 * - Automatic music ducking when critical alerts or SFX fire
 * - Synchronized with AudioManager master and music volume settings
 * - Zero memory leaks with lifecycle-managed AudioNodes
 */

import { audio, registerMusicHooks } from '@/lib/audio/audio-manager';

export type MusicScene =
  | 'menu'
  | 'exploration'
  | 'exploration-command'
  | 'exploration-hangar'
  | 'exploration-lab'
  | 'exploration-comms'
  | 'mission-active'
  | 'tension'
  | 'launch'
  | 'victory'
  | 'failure'
  | 'silent';

interface ActiveLayer {
  osc: OscillatorNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
}

// Complex multi-voiced chord progressions (Hz frequencies)
const SCENE_THEMES: Record<
  string,
  {
    chords: number[][];
    baseType: OscillatorType;
    filterCutoff: number;
    subBassFreq: number;
    pulseRateMs: number;
    arpeggioNotes?: number[];
  }
> = {
  menu: {
    // Ethereal deep space fifths and suspended chords (D - A - C - G)
    chords: [
      [146.83, 220.0, 293.66, 440.0],  // D3, A3, D4, A4
      [130.81, 196.0, 261.63, 392.0],  // C3, G3, C4, G4
      [164.81, 246.94, 329.63, 493.88], // E3, B3, E4, B4
      [110.0, 164.81, 220.0, 329.63],   // A2, E3, A3, E4
    ],
    baseType: 'sine',
    filterCutoff: 1200,
    subBassFreq: 73.42, // D2
    pulseRateMs: 7000,
    arpeggioNotes: [587.33, 659.25, 880.0, 1046.5],
  },
  'exploration-command': {
    // Elegant systems engineering ambient (Cmaj9 - Am7 - Fmaj7 - Gsus4)
    chords: [
      [130.81, 196.0, 246.94, 293.66],  // C3, G3, B3, D4
      [110.0, 164.81, 220.0, 261.63],   // A2, E3, A3, C4
      [87.31, 130.81, 174.61, 220.0],    // F2, C3, F3, A3
      [98.0, 146.83, 196.0, 246.94],    // G2, D3, G3, B3
    ],
    baseType: 'triangle',
    filterCutoff: 1500,
    subBassFreq: 65.41, // C2
    pulseRateMs: 6500,
    arpeggioNotes: [523.25, 659.25, 783.99, 987.77],
  },
  exploration: {
    chords: [
      [130.81, 196.0, 246.94, 293.66],
      [110.0, 164.81, 220.0, 261.63],
      [87.31, 130.81, 174.61, 220.0],
      [98.0, 146.83, 196.0, 246.94],
    ],
    baseType: 'triangle',
    filterCutoff: 1500,
    subBassFreq: 65.41,
    pulseRateMs: 6500,
    arpeggioNotes: [523.25, 659.25, 783.99, 987.77],
  },
  'exploration-hangar': {
    // Deep industrial assembly atmosphere (Heavy sub-bass, detuned saws, mechanical rhythm)
    chords: [
      [73.42, 110.0, 146.83, 220.0],   // D2, A2, D3, A3
      [65.41, 98.0, 130.81, 196.0],     // C2, G2, C3, G3
      [82.41, 123.47, 164.81, 246.94], // E2, B2, E3, B3
      [73.42, 110.0, 146.83, 220.0],
    ],
    baseType: 'sawtooth',
    filterCutoff: 650, // Dark low-pass
    subBassFreq: 36.71, // Low D1 sub
    pulseRateMs: 5000,
  },
  'exploration-lab': {
    // Pure crystalline research shimmer (F#m7 - Bm7 - Dmaj7)
    chords: [
      [185.0, 277.18, 369.99, 440.0],   // F#3, C#4, F#4, A4
      [123.47, 185.0, 246.94, 329.63], // B2, F#3, B3, E4
      [146.83, 220.0, 293.66, 369.99], // D3, A3, D4, F#4
      [164.81, 246.94, 329.63, 415.3],  // E3, B3, E4, G#4
    ],
    baseType: 'sine',
    filterCutoff: 2200,
    subBassFreq: 92.5, // F#2
    pulseRateMs: 6000,
    arpeggioNotes: [739.99, 880.0, 1108.73, 1479.98],
  },
  'exploration-comms': {
    // Deep Space Network telemetry pulse (Cosmic microwave background carrier)
    chords: [
      [196.0, 293.66, 392.0, 587.33],   // G3, D4, G4, D5
      [174.61, 261.63, 349.23, 523.25], // F3, C4, F4, C5
      [164.81, 246.94, 329.63, 493.88], // E3, B3, E4, B4
      [196.0, 293.66, 392.0, 587.33],
    ],
    baseType: 'sine',
    filterCutoff: 1800,
    subBassFreq: 98.0, // G2
    pulseRateMs: 5500,
    arpeggioNotes: [880.0, 1174.66, 1567.98, 1760.0],
  },
  'mission-active': {
    // Systems operations focus (C - Eb - F - G)
    chords: [
      [130.81, 196.0, 261.63, 311.13], // C3, G3, C4, Eb4
      [116.54, 174.61, 233.08, 293.66], // Bb2, F3, Bb3, D4
      [138.59, 207.65, 277.18, 329.63], // Db3, Ab3, Db4, E4
      [130.81, 196.0, 261.63, 311.13],
    ],
    baseType: 'triangle',
    filterCutoff: 1400,
    subBassFreq: 65.41,
    pulseRateMs: 5000,
    arpeggioNotes: [622.25, 783.99, 932.33, 1046.5],
  },
  tension: {
    // Critical resource crisis (Throbbing minor second dissonance)
    chords: [
      [130.81, 138.59, 196.0, 207.65], // C3 & Db3 clashing cluster
      [116.54, 123.47, 174.61, 185.0],  // Bb2 & B2 clashing
      [123.47, 130.81, 185.0, 196.0],   // B2 & C3 clashing
      [130.81, 138.59, 196.0, 207.65],
    ],
    baseType: 'sawtooth',
    filterCutoff: 800,
    subBassFreq: 32.7, // Sub C1 alarm pulse
    pulseRateMs: 3000,
  },
  launch: {
    // Escalating countdown surge with rising harmonic tension
    chords: [
      [110.0, 164.81, 220.0, 277.18],  // A2, E3, A3, C#4
      [123.47, 185.0, 246.94, 311.13], // B2, F#3, B3, D#4
      [138.59, 207.65, 277.18, 349.23], // C#3, G#3, C#4, F4
      [146.83, 220.0, 293.66, 369.99], // D3, A3, D4, F#4
    ],
    baseType: 'sawtooth',
    filterCutoff: 2400,
    subBassFreq: 55.0, // A1 rumble
    pulseRateMs: 2500,
  },
  victory: {
    // Triumphant aerospace success (C - G - Am - F)
    chords: [
      [261.63, 329.63, 392.0, 523.25], // C major
      [196.0, 246.94, 293.66, 392.0],  // G major
      [220.0, 261.63, 329.63, 440.0],  // A minor
      [174.61, 220.0, 261.63, 349.23], // F major
    ],
    baseType: 'sine',
    filterCutoff: 3000,
    subBassFreq: 130.81,
    pulseRateMs: 4000,
    arpeggioNotes: [523.25, 659.25, 783.99, 1046.5, 1318.51],
  },
  failure: {
    // Somber, dark descending minor cadence
    chords: [
      [110.0, 130.81, 164.81, 220.0],  // A minor
      [98.0, 116.54, 146.83, 196.0],   // G minor
      [87.31, 103.83, 130.81, 174.61], // F minor
      [82.41, 98.0, 123.47, 164.81],   // E minor
    ],
    baseType: 'sawtooth',
    filterCutoff: 500,
    subBassFreq: 41.2, // Low E1
    pulseRateMs: 6000,
  },
};

class ProceduralMusicEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeLayers: ActiveLayer[] = [];
  private arpTimer: ReturnType<typeof setInterval> | null = null;
  private chordTimer: ReturnType<typeof setInterval> | null = null;
  private currentScene: MusicScene = 'silent';
  private chordIndex = 0;
  private baseVolume = 0.28;
  private isDucked = false;
  private isPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private getEffectiveVolume(): number {
    const settings = audio.getSettings();
    if (settings.isMuted) return 0;
    const vol = settings.masterVolume * settings.musicVolume * this.baseVolume;
    return this.isDucked ? vol * 0.45 : vol;
  }

  private createMasterGain(): GainNode | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  private cleanupCurrentLayers(): void {
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.arpTimer) {
      clearInterval(this.arpTimer);
      this.arpTimer = null;
    }

    const ctx = this.audioCtx;
    for (const layer of this.activeLayers) {
      try {
        if (ctx) {
          layer.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          layer.osc.stop(ctx.currentTime + 0.65);
          setTimeout(() => {
            try {
              layer.osc.disconnect();
              layer.gain.disconnect();
              if (layer.filter) layer.filter.disconnect();
            } catch { /* already disconnected */ }
          }, 700);
        } else {
          layer.osc.stop();
          layer.osc.disconnect();
        }
      } catch { /* ignored */ }
    }
    this.activeLayers = [];
  }

  public setScene(scene: MusicScene, requestedVolume = 0.28): void {
    if (scene === this.currentScene && this.isPlaying) return;

    const ctx = this.getContext();
    if (!ctx) return;

    this.baseVolume = requestedVolume;
    this.currentScene = scene;

    if (scene === 'silent') {
      this.cleanupCurrentLayers();
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    this.cleanupCurrentLayers();

    // Map exploration room variations
    const themeKey = SCENE_THEMES[scene] ? scene : 'exploration-command';
    const theme = SCENE_THEMES[themeKey];
    const master = this.createMasterGain();
    if (!master) return;

    const targetMasterVol = this.getEffectiveVolume();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, targetMasterVol), ctx.currentTime + 1.2);

    this.chordIndex = 0;
    const initialChord = theme.chords[0];

    // 1. Sub-Bass Drone Layer (Anchors the harmonic root)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(theme.subBassFreq, ctx.currentTime);
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(180, ctx.currentTime);
    subGain.gain.setValueAtTime(0.18, ctx.currentTime);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(master);
    subOsc.start();
    this.activeLayers.push({ osc: subOsc, gain: subGain, filter: subFilter });

    // 2. Multi-Voiced Chord Pad
    initialChord.forEach((noteFreq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = theme.baseType;
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 5, ctx.currentTime); // Rich stereo-like detune

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(theme.filterCutoff, ctx.currentTime);

      const voiceVol = (0.14 / (idx + 1)) * 0.8;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(voiceVol, ctx.currentTime + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();

      this.activeLayers.push({ osc, gain, filter });
    });

    // 3. Evolving Chord Progression Timer
    this.chordTimer = setInterval(() => {
      this.chordIndex = (this.chordIndex + 1) % theme.chords.length;
      const nextChord = theme.chords[this.chordIndex];
      const now = ctx.currentTime;

      // Smoothly glide pad frequencies to new harmonic inversion
      for (let i = 1; i < this.activeLayers.length && i <= nextChord.length; i++) {
        const layer = this.activeLayers[i];
        layer.osc.frequency.linearRampToValueAtTime(nextChord[i - 1], now + 2.5);
      }
    }, theme.pulseRateMs);

    // 4. Subtle Ambient Arpeggiator (if present in theme)
    if (theme.arpeggioNotes && theme.arpeggioNotes.length > 0) {
      let arpIndex = 0;
      this.arpTimer = setInterval(() => {
        if (!this.isPlaying || this.activeLayers.length === 0) return;
        const note = theme.arpeggioNotes![arpIndex % theme.arpeggioNotes!.length];
        arpIndex++;

        const arpOsc = ctx.createOscillator();
        const arpGain = ctx.createGain();
        arpOsc.type = 'sine';
        arpOsc.frequency.setValueAtTime(note, ctx.currentTime);

        const arpVol = this.getEffectiveVolume() * 0.12;
        arpGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        arpGain.gain.linearRampToValueAtTime(arpVol, ctx.currentTime + 0.05);
        arpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

        arpOsc.connect(arpGain);
        arpGain.connect(master);
        arpOsc.start();
        arpOsc.stop(ctx.currentTime + 0.5);
      }, 750);
    }
  }

  /**
   * Duck music volume by ~50% temporarily when an alert, warning, or voice prompt plays.
   */
  public duck(durationMs = 1200): void {
    if (!this.masterGain || !this.audioCtx) return;
    this.isDucked = true;
    this.syncVolume();

    setTimeout(() => {
      this.isDucked = false;
      this.syncVolume();
    }, durationMs);
  }

  /**
   * Synchronize volume with AudioManager settings.
   */
  public syncVolume(): void {
    if (!this.masterGain || !this.audioCtx) return;
    const target = this.getEffectiveVolume();
    this.masterGain.gain.linearRampToValueAtTime(
      Math.max(0.0001, target),
      this.audioCtx.currentTime + 0.1
    );
  }

  public setVolume(vol: number): void {
    this.baseVolume = vol;
    this.syncVolume();
  }

  public stop(): void {
    this.setScene('silent');
  }

  public getScene(): MusicScene {
    return this.currentScene;
  }
}

export const musicEngine = new ProceduralMusicEngine();

// Register hooks for real-time synchronization with AudioManager volume and ducking
registerMusicHooks(
  () => musicEngine.syncVolume(),
  (durationMs) => musicEngine.duck(durationMs)
);
