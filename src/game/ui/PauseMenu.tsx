/**
 * Pause menu overlay.
 * Shows when the player presses Escape during exploration.
 */

'use client';

import React from 'react';
import { Play, RotateCcw, Sliders, LogOut } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { audio } from '@/lib/audio/audio-manager';

interface PauseMenuProps {
  onOpenSettings: () => void;
  onReturnToMenu: () => void;
}

export default function PauseMenu({ onOpenSettings, onReturnToMenu }: PauseMenuProps) {
  const { isPaused, togglePause } = useGameStore();

  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="max-w-sm w-full glass-panel rounded-2xl border border-cyan-500/40 p-6 shadow-2xl">
        <h3 className="text-center font-mono font-bold text-2xl text-cyan-glow tracking-widest mb-6">
          PAUSED
        </h3>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              audio.click();
              togglePause();
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            RESUME
          </button>

          <button
            onClick={() => {
              audio.click();
              onOpenSettings();
            }}
            className="w-full py-3 px-6 rounded-xl bg-space-850 hover:bg-space-800 text-slate-300 hover:text-white border border-space-border font-mono text-sm tracking-wider flex items-center justify-center gap-3 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            SETTINGS
          </button>

          <button
            onClick={() => {
              audio.click();
              onReturnToMenu();
            }}
            className="w-full py-3 px-6 rounded-xl bg-space-850 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border border-space-border hover:border-red-500/40 font-mono text-sm tracking-wider flex items-center justify-center gap-3 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            RETURN TO MENU
          </button>
        </div>

        <p className="mt-4 text-center text-xs font-mono text-slate-500">
          Press [Esc] to resume
        </p>
      </div>
    </div>
  );
}
