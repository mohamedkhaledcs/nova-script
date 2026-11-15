'use client';

import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Globe,
  Radio,
  Zap,
  X,
} from 'lucide-react';
import { audio, type AudioSettings } from '@/lib/audio/audio-manager';
import { useGameStore } from '@/game/store';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import { type GameAction, type VisualMode, type Language, normalizeKey } from '@/game/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AudioSettings>(() => audio.getSettings());
  const [activeTab, setActiveTab] = useState<'audio' | 'display' | 'controls'>('audio');
  const [rebindingAction, setRebindingAction] = useState<GameAction | null>(null);

  const {
    keybindings,
    setKeybinding,
    resetKeybindings,
    visualMode,
    setVisualMode,
    language,
    setLanguage,
    toggleCodex,
  } = useGameStore();

  const t = TRANSLATIONS[language || 'en'];

  // Listen for keyboard input when in rebinding mode
  useEffect(() => {
    if (!rebindingAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const key = normalizeKey(e.key, e.code);
      // Ignore alone modifiers unless user specifically presses space
      if (['control', 'shift', 'alt', 'meta'].includes(key)) return;

      audio.select();
      // Replace or set as primary key
      setKeybinding(rebindingAction, [key]);
      setRebindingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [rebindingAction, setKeybinding]);

  if (!isOpen) return null;

  const updateSettings = (partial: Partial<AudioSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    audio.saveSettings(partial);
    if (!partial.isMuted) {
      audio.click();
    }
  };

  const actionList: { id: GameAction; label: string }[] = [
    { id: 'moveForward', label: t.actionMoveForward },
    { id: 'moveBackward', label: t.actionMoveBackward },
    { id: 'moveLeft', label: t.actionMoveLeft },
    { id: 'moveRight', label: t.actionMoveRight },
    { id: 'interact', label: t.actionInteract },
    { id: 'inventory', label: t.actionInventory },
    { id: 'profile', label: t.actionProfile },
    { id: 'minimap', label: t.actionMinimap },
    { id: 'handbook', label: t.actionHandbook },
    { id: 'pause', label: t.actionPause },
  ];

  const visualModes: { id: VisualMode; title: string; desc: string; icon: string }[] = [
    {
      id: 'cinematic-3d',
      title: t.modeCinematic,
      desc: t.modeCinematicDesc,
      icon: '[3D-SIM]',
    },
    {
      id: 'retro-pixel',
      title: t.modeRetro,
      desc: t.modeRetroDesc,
      icon: '[VOXEL-3D]',
    },
    {
      id: 'cyber-neon',
      title: t.modeCyber,
      desc: t.modeCyberDesc,
      icon: '[NEON]',
    },
    {
      id: 'performance',
      title: t.modePerf,
      desc: t.modePerfDesc,
      icon: '[CAD-PERF]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150 select-none">
      <div
        className={`max-w-xl w-full glass-panel p-6 rounded-2xl border border-cyan-500/40 shadow-glow-cyan text-left flex flex-col max-h-[92vh] overflow-hidden bg-space-950/95 ${
          language === 'ar' ? 'font-sans' : 'font-mono'
        }`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-cyan-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/30">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wider">
                {t.settings}
              </h3>
              <p className="text-[11px] text-slate-400">
                NOVASCRIPT ENGINE CONFIGURATION & PREFERENCES
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Button */}
            <button
              onClick={() => {
                audio.select();
                setLanguage(language === 'en' ? 'ar' : 'en');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-900 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:bg-space-850 transition-colors shadow-glow-cyan"
              title="Toggle English / Arabic Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'EN / عربي' : 'عربي / EN'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-space-850 transition-colors"
              title="Close Settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1.5 mt-3.5 p-1 rounded-xl bg-space-900 border border-space-border/60">
          <button
            onClick={() => {
              audio.click();
              setActiveTab('audio');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audio'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.audioEngine}
          </button>
          <button
            onClick={() => {
              audio.click();
              setActiveTab('display');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'display'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.graphicsMood}
          </button>
          <button
            onClick={() => {
              audio.click();
              setActiveTab('controls');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'controls'
                ? 'bg-cyan-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.keybindings}
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
          {/* TAB 1: AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-3.5">
              {/* Mute Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-space-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  {settings.isMuted ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="text-xs text-slate-200 font-bold">MUTE ALL AUDIO</span>
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
                <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
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
                <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
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
                <div className="flex justify-between text-xs text-slate-300 mb-2 font-mono">
                  <span>AMBIENT SYNTHESIZER MUSIC</span>
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

          {/* TAB 2: GRAPHICS & VISUAL MOODS */}
          {activeTab === 'display' && (
            <div className="space-y-3.5">
              <div className="text-xs font-bold text-slate-300 mb-1">{t.visualModeTitle}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {visualModes.map((vm) => {
                  const isSelected = visualMode === vm.id;
                  return (
                    <button
                      key={vm.id}
                      onClick={() => {
                        audio.select();
                        setVisualMode(vm.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-cyan text-white'
                          : 'bg-space-900/80 border-space-border/60 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-lg">{vm.icon}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-600 text-white font-mono text-[9px] font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-cyan-300">{vm.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-snug">{vm.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Space Handbook Shortcut Banner */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 mt-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>DEEP SPACE HANDBOOK & OPERATIONS ARCHIVE</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Interactive operational manual with destination briefings, physics formulas, and spacecraft engineering.
                </p>
                <button
                  onClick={() => {
                    audio.select();
                    onClose();
                    toggleCodex();
                  }}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-glow-cyan"
                >
                  OPEN SPACE HANDBOOK [TAB]
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD CONTROLS & REBINDING */}
          {activeTab === 'controls' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.keybindingsDesc}</span>
                <button
                  onClick={() => {
                    audio.click();
                    resetKeybindings();
                  }}
                  className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 underline font-mono"
                  title="Reset all bindings to default"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.resetDefaults}</span>
                </button>
              </div>

              {rebindingAction && (
                <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-400 text-center text-xs font-bold text-cyan-300 animate-pulse shadow-glow-cyan font-mono">
                  {t.rebindPrompt}
                </div>
              )}

              <div className="space-y-2">
                {actionList.map((act) => {
                  const currentKeys = keybindings[act.id] || [];
                  const isRebindingThis = rebindingAction === act.id;

                  return (
                    <div
                      key={act.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        isRebindingThis
                          ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-cyan'
                          : 'bg-space-900 border-space-border/60 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xs text-slate-200 font-bold">{act.label}</span>

                      <div className="flex items-center gap-1.5">
                        {currentKeys.map((k, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              audio.select();
                              setRebindingAction(act.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                              isRebindingThis
                                ? 'bg-cyan-500 text-black animate-pulse'
                                : 'bg-space-950 text-cyan-300 border border-cyan-500/40 hover:border-cyan-300'
                            }`}
                            title="Click to rebind"
                          >
                            {k === ' ' ? 'SPACE' : k}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile / Touch Note */}
              <div className="p-3 rounded-xl bg-space-900/60 border border-space-border/50 text-[11px] text-slate-400 leading-relaxed font-mono">
                <span className="text-cyan-400 font-bold">TOUCH & MOUSE SHORTCUTS: </span>
                Double-click with left mouse or double-tap on touch screens when near an interactable object to interact immediately without keyboard input.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan"
        >
          <Check className="w-4 h-4" />
          <span>{t.saveAndClose}</span>
        </button>
      </div>
    </div>
  );
}
