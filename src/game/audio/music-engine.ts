/**
 * Procedural dynamic music engine.
 * Generates ambient music using Web Audio API oscillators,
 * with different moods/layers for each game scene.
 * 
 * Uses multiple oscillator layers with chord progressions,
 * arpeggios, and pad drones for atmospheric soundtrack.
 */

type MusicScene =
  | 'menu'
  | 'exploration'
  | 'mission-active'
  | 'tension'
  | 'cinematic'
  | 'victory'
  | 'failure'
  | 'silent';

interface MusicLayer {
  oscillator: OscillatorNode;
  gain: GainNode;
}

// Chord progressions for different moods (frequencies in Hz)
const CHORD_PROGRESSIONS: Record<string, number[][]> = {
  ambient: [
    [130.81, 196.0, 261.63, 329.63],  // Cmaj7
    [146.83, 220.0, 293.66, 349.23],  // Dm7
    [164.81, 246.94, 329.63, 392.0],  // Em7
    [174.61, 261.63, 349.23, 440.0],  // Fmaj7
  ],
  tension: [
    [130.81, 155.56, 196.0, 233.08],  // Cm
    [116.54, 146.83, 174.61, 220.0],  // Bbm
    [123.47, 155.56, 185.0, 233.08],  // B dim
    [130.81, 155.56, 196.0, 233.08],  // Cm
  ],
  victory: [
    [261.63, 329.63, 392.0, 523.25],  // C major
    [293.66, 369.99, 440.0, 587.33],  // D major
    [329.63, 415.30, 493.88, 659.25],  // E major
    [349.23, 440.0, 523.25, 698.46],  // F major
  ],
};

class ProceduralMusicEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneLayers: MusicLayer[] = [];
  private arpLayer: { oscillator: OscillatorNode; gain: GainNode } | null = null;
  private currentScene: MusicScene = 'silent';
  private chordIndex = 0;
  private beatInterval: ReturnType<typeof setInterval> | null = null;
  private isPlaying = false;
  private targetVolume = 0;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

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

  private stopAllLayers(): void {
    for (const layer of this.droneLayers) {
      try {
        layer.oscillator.stop();
        layer.oscillator.disconnect();
        layer.gain.disconnect();
      } catch {
        // Already stopped
      }
    }
    this.droneLayers = [];

    if (this.arpLayer) {
      try {
        this.arpLayer.oscillator.stop();
        this.arpLayer.oscillator.disconnect();
        this.arpLayer.gain.disconnect();
      } catch {
        // Already stopped
      }
      this.arpLayer = null;
    }

    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }

  private fadeTo(volume: number, durationMs: number = 2000): void {
    if (!this.masterGain || !this.audioCtx) return;

    this.targetVolume = volume;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    const startVol = this.masterGain.gain.value;
    const steps = 40;
    const stepTime = durationMs / steps;
    const stepSize = (volume - startVol) / steps;
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step++;
      if (!this.masterGain) return;

      const newVol = startVol + stepSize * step;
      this.masterGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, newVol)),
        this.audioCtx!.currentTime
      );

      if (step >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, stepTime);
  }

  private startDrone(progression: string): void {
    const ctx = this.getContext();
    const master = this.createMasterGain();
    if (!ctx || !master) return;

    const chords = CHORD_PROGRESSIONS[progression] || CHORD_PROGRESSIONS.ambient;
    this.chordIndex = 0;

    // Create 4 drone oscillators for chord tones
    const chord = chords[0];
    for (let i = 0; i < chord.length; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(chord[i], ctx.currentTime);

      // Stagger volumes — bass louder, upper voices softer
      const baseVol = i === 0 ? 0.12 : i === 1 ? 0.08 : 0.05;
      gain.gain.setValueAtTime(baseVol, ctx.currentTime);

      // Slight detune for warmth
      osc.detune.setValueAtTime((i - 1.5) * 4, ctx.currentTime);

      osc.connect(gain);
      gain.connect(master);
      osc.start();

      this.droneLayers.push({ oscillator: osc, gain });
    }

    // Progress chords slowly
    this.beatInterval = setInterval(() => {
      this.chordIndex = (this.chordIndex + 1) % chords.length;
      const nextChord = chords[this.chordIndex];

      for (let i = 0; i < this.droneLayers.length && i < nextChord.length; i++) {
        const now = ctx.currentTime;
        this.droneLayers[i].oscillator.frequency.linearRampToValueAtTime(
          nextChord[i],
          now + 2.0
        );
      }
    }, 6000); // Change chord every 6 seconds
  }

  setScene(scene: MusicScene, volume: number = 0.3): void {
    if (scene === this.currentScene && this.isPlaying) return;

    const ctx = this.getContext();
    if (!ctx) return;

    // Fade out, switch, fade in
    this.fadeTo(0, 800);

    setTimeout(() => {
      this.stopAllLayers();
      this.currentScene = scene;

      if (scene === 'silent') {
        this.isPlaying = false;
        return;
      }

      this.isPlaying = true;

      switch (scene) {
        case 'menu':
        case 'exploration':
          this.startDrone('ambient');
          break;
        case 'mission-active':
          this.startDrone('ambient');
          break;
        case 'tension':
          this.startDrone('tension');
          break;
        case 'victory':
          this.startDrone('victory');
          break;
        case 'cinematic':
          this.startDrone('ambient');
          break;
        case 'failure':
          this.startDrone('tension');
          break;
      }

      setTimeout(() => {
        this.fadeTo(volume, 1500);
      }, 200);
    }, 900);
  }

  setVolume(volume: number): void {
    this.targetVolume = volume;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    }
  }

  stop(): void {
    this.setScene('silent');
  }

  getScene(): MusicScene {
    return this.currentScene;
  }
}

export const musicEngine = new ProceduralMusicEngine();
export type { MusicScene };
