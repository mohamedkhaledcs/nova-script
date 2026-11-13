import {
  playSynthHover,
  playSynthClick,
  playSynthSelect,
  playSynthSuccess,
  playSynthWarning,
  playSynthFailure,
} from './procedural-synth';

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  isMuted: boolean;
}

const STORAGE_KEY = 'novascript_audio_settings_v1';

type MusicSyncCallback = () => void;
type MusicDuckCallback = (durationMs?: number) => void;

let musicSyncCallback: MusicSyncCallback | null = null;
let musicDuckCallback: MusicDuckCallback | null = null;

export function registerMusicHooks(
  syncCb: MusicSyncCallback,
  duckCb: MusicDuckCallback
): void {
  musicSyncCallback = syncCb;
  musicDuckCallback = duckCb;
}

export class AudioManager {
  private static instance: AudioManager;
  private settings: AudioSettings = {
    masterVolume: 0.8,
    sfxVolume: 0.8,
    musicVolume: 0.5,
    isMuted: false,
  };

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.settings = { ...this.settings, ...JSON.parse(data) };
      }
    } catch {
      // fallback to defaults
    }
  }

  public saveSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      } catch {
        // storage unavailable
      }
    }
    // Notify music engine to update volume
    if (musicSyncCallback) {
      musicSyncCallback();
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private getEffectiveSfxVolume(): number {
    if (this.settings.isMuted) return 0;
    return this.settings.masterVolume * this.settings.sfxVolume;
  }

  // SFX triggers
  public hover(): void {
    playSynthHover(this.getEffectiveSfxVolume());
  }

  public click(): void {
    playSynthClick(this.getEffectiveSfxVolume());
  }

  public select(): void {
    playSynthSelect(this.getEffectiveSfxVolume());
  }

  public success(): void {
    playSynthSuccess(this.getEffectiveSfxVolume());
  }

  public warning(): void {
    // Duck music when warnings/crises occur
    if (musicDuckCallback) musicDuckCallback(1500);
    playSynthWarning(this.getEffectiveSfxVolume());
  }

  public failure(): void {
    if (musicDuckCallback) musicDuckCallback(2000);
    playSynthFailure(this.getEffectiveSfxVolume());
  }
}

export const audio = AudioManager.getInstance();
