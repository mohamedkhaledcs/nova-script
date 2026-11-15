'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Volume2,
  VolumeX,
  Check,
  Monitor,
  Eye,
  Keyboard,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { audio, type AudioSettings } from '@/lib/audio/audio-manager';
import { useGameStore } from '@/game/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => audio.getSettings());
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [smoothCamera, setSmoothCamera] = useState(true);
  const [activeTab, setActiveTab] = useState<'audio' | 'display' | 'controls'>('audio');

  const { toggleCodex } = useGameStore();

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
      <div className="max-w-lg w-full glass-panel p-6 sm:p-7 rounded-2xl border border-cyan-500/40 shadow-glow-cyan text-left flex flex-col max-h-[90vh] overflow-hidden bg-space-950/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-mono font-bold text-white tracking-wider">
                STATION SYSTEM SETTINGS
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                AUDIO, TELEMETRY DISPLAY & CONTROL MATRIX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1 rounded hover:bg-space-850"
          >
            ✕
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1.5 mt-4 p-1 rounded-xl bg-space-900 border border-space-border/60">
          <button
            onClick={() => {
              audio.click();
              setActiveTab('audio');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'audio'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AUDIO ENGINE
          </button>
          <button
            onClick={() => {
              audio.click();
              setActiveTab('display');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'display'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GRAPHICS & FX
          </button>
          <button
            onClick={() => {
              audio.click();
              setActiveTab('controls');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'controls'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            KEYBINDINGS
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5 overflow-y-auto pr-1 flex-1">
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Mute Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-space-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  {settings.isMuted ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="text-xs font-mono text-slate-200 font-bold">MUTE ALL AUDIO</span>
                </div>
                <button
                  onClick={() => updateSettings({ isMuted: !settings.isMuted })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    settings.isMuted ? 'bg-rose-600' : 'bg-slate-700'
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
              <div className="p-3 rounded-xl bg-space-900/60 border border-space-border/50">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                  <span>MASTER VOLUME</span>
                  <span className="text-cyan-300 font-bold">{Math.round(settings.masterVolume * 100)}%</span>
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
              <div className="p-3 rounded-xl bg-space-900/60 border border-space-border/50">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                  <span>SOUND EFFECTS (SFX)</span>
                  <span className="text-cyan-300 font-bold">{Math.round(settings.sfxVolume * 100)}%</span>
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
              <div className="p-3 rounded-xl bg-space-900/60 border border-space-border/50">
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                  <span>PROCEDURAL SYNTHESIZER MUSIC</span>
                  <span className="text-cyan-300 font-bold">{Math.round(settings.musicVolume * 100)}%</span>
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
          )}

          {activeTab === 'display' && (
            <div className="space-y-4">
              {/* Bloom / Glow Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-space-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-mono text-slate-200 font-bold">HOLOGRAPHIC BLOOM & GLOW</div>
                    <div className="text-[10px] font-mono text-slate-400">Post-processing neon visual effects</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    audio.click();
                    setBloomEnabled(!bloomEnabled);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    bloomEnabled ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      bloomEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Smooth Camera */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-space-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-mono text-slate-200 font-bold">SMOOTH CAMERA TRACKING</div>
                    <div className="text-[10px] font-mono text-slate-400">Interpolated camera dampening</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    audio.click();
                    setSmoothCamera(!smoothCamera);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    smoothCamera ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      smoothCamera ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Open Space Handbook Shortcut */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>DEEP SPACE HANDBOOK & ENCYCLOPEDIA</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Read complete scientific guides to planetary destinations, orbital mechanics, spacecraft subsystems, and salvage materials.
                </p>
                <button
                  onClick={() => {
                    audio.select();
                    onClose();
                    toggleCodex();
                  }}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-glow-cyan"
                >
                  OPEN SPACE HANDBOOK [TAB]
                </button>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="text-slate-400 text-[11px] mb-1">STATION EXPLORATION HOTKEYS:</div>
              {[
                { key: 'W / A / S / D', action: 'Move Astronaut in 3D Space' },
                { key: 'Arrow Keys', action: 'Alternative Directional Movement' },
                { key: 'Left Mouse Click', action: 'Click-to-Move Target Beacon' },
                { key: 'E', action: 'Interact with Consoles, Terminals & Workbenches' },
                { key: 'I', action: 'Open Materials & Salvage Inventory' },
                { key: 'P', action: 'Open Commander Profile & Suit Customizer' },
                { key: 'M', action: 'Toggle Station Holographic Radar Minimap' },
                { key: 'Tab', action: 'Open Deep Space Handbook & Encyclopedia' },
                { key: 'Esc', action: 'Pause Menu / Close Active Overlay' },
              ].map((ctrl, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-space-900 border border-space-border/50"
                >
                  <span className="px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/30 font-bold text-[11px]">
                    {ctrl.key}
                  </span>
                  <span className="text-slate-300 text-[11px]">{ctrl.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan"
        >
          <Check className="w-4 h-4" />
          <span>SAVE & CLOSE</span>
        </button>
      </div>
    </div>
  );
}
