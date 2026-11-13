'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ListOrdered, Volume2, VolumeX, X } from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import type { Resources, DecisionRecord } from '@/types/game';

interface ContextMenuProps {
  resources: Resources;
  history: DecisionRecord[];
  isMuted: boolean;
  onToggleAudio: () => void;
}

interface MenuPosition {
  x: number;
  y: number;
}

export default function ContextMenu({
  resources,
  history,
  isMuted,
  onToggleAudio,
}: ContextMenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [activeModal, setActiveModal] = useState<'telemetry' | 'log' | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Don't intercept right clicks inside text inputs or outside game
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select')) return;

      e.preventDefault();
      audio.click();

      // Clamp coordinates to viewport
      const menuWidth = 220;
      const menuHeight = 180;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setPosition({ x, y });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#novascript-context-menu')) {
        setPosition(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPosition(null);
        setActiveModal(null);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {position && (
        <div
          id="novascript-context-menu"
          className="fixed z-50 glass-panel rounded-xl border border-cyan-500/50 p-2 shadow-glow-cyan w-56 text-xs font-mono select-none animate-in fade-in duration-100"
          style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-cyan-400 border-b border-slate-700 mb-1 flex items-center justify-between">
            <span>MISSION ACTIONS</span>
            <span className="text-[9px] text-slate-500">ESC</span>
          </div>

          <button
            onClick={() => {
              setActiveModal('telemetry');
              setPosition(null);
              audio.click();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-space-800 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>INSPECT TELEMETRY</span>
          </button>

          <button
            onClick={() => {
              setActiveModal('log');
              setPosition(null);
              audio.click();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-space-800 transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
            <span>VIEW MISSION LOG ({history.length})</span>
          </button>

          <button
            onClick={() => {
              onToggleAudio();
              setPosition(null);
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-space-800 transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
                <span>UNMUTE AUDIO</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>MUTE AUDIO</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Telemetry Inspect Modal */}
      {activeModal === 'telemetry' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-cyan-500/40 text-left font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h4 className="text-sm font-bold text-cyan-glow flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                LIVE SYSTEM TELEMETRY
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-2 rounded bg-space-950 border border-amber-500/30 text-amber-400 text-xs">
                <span>BUDGET MARGIN</span>
                <span className="font-bold text-sm">{resources.budget} PTS</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-space-950 border border-purple-500/30 text-purple-400 text-xs">
                <span>STRUCTURAL MASS</span>
                <span className="font-bold text-sm">{resources.mass} PTS</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-space-950 border border-yellow-500/30 text-yellow-400 text-xs">
                <span>ELECTRICAL POWER</span>
                <span className="font-bold text-sm">{resources.power} PTS</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-space-950 border border-cyan-500/30 text-cyan-400 text-xs">
                <span>SCIENTIFIC VALUE</span>
                <span className="font-bold text-sm">{resources.scientific_value} PTS</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-space-950 border border-emerald-500/30 text-emerald-400 text-xs">
                <span>RF COMMUNICATIONS</span>
                <span className="font-bold text-sm">{resources.communication} PTS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Log Modal */}
      {activeModal === 'log' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full glass-panel p-6 rounded-2xl border border-cyan-500/40 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h4 className="text-sm font-mono font-bold text-cyan-glow flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                ACTIVE MISSION LOG ({history.length} DECISIONS)
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto space-y-2 pr-1">
              {history.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 font-mono italic">
                  No decisions committed yet.
                </div>
              ) : (
                history.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-space-950 border border-space-border/60 text-xs font-mono"
                  >
                    <div className="flex justify-between text-cyan-400 font-bold mb-1">
                      <span>STEP {rec.stepIndex}: {rec.questionId}</span>
                      <span className="text-emerald-400">{rec.selectedAnswerId}</span>
                    </div>
                    <div className="text-slate-200 font-sans text-xs mb-1">
                      {rec.selectedAnswerText}
                    </div>
                    <div className="text-slate-400 font-sans text-[11px] italic">
                      {rec.consequenceSummary}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
