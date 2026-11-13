'use client';

import React, { useState } from 'react';
import { Sliders, Volume2, VolumeX, Check } from 'lucide-react';
import { audio, type AudioSettings } from '@/lib/audio/audio-manager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => audio.getSettings());

  if (!isOpen) return null;

  const updateSettings = (partial: Partial<AudioSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    audio.saveSettings(partial);
    if (!partial.isMuted) {
      audio.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-glow-cyan text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            AUDIO & DISPLAY SETTINGS
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-space-950/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {settings.isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              )}
              <span className="text-sm font-mono text-slate-200">MUTE ALL AUDIO</span>
            </div>
            <button
              onClick={() => updateSettings({ isMuted: !settings.isMuted })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.isMuted ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.isMuted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span>MASTER VOLUME</span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              disabled={settings.isMuted}
              onChange={(e) => updateSettings({ masterVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span>SOUND EFFECTS (SFX)</span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              disabled={settings.isMuted}
              onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span>AMBIENT MUSIC</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              disabled={settings.isMuted}
              onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>SAVE & CLOSE</span>
        </button>
      </div>
    </div>
  );
}
