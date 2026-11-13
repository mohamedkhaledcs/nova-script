/**
 * Scientific Codex panel — a knowledge bank that records learning points
 * from mission decisions. Opens with Tab key.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { ACHIEVEMENTS, type AchievementDef } from '@/game/progression/achievements';

interface CodexEntry {
  questionId: string;
  questionText: string;
  answerId: string;
  answerText: string;
  learningPoint: string;
  stage: string;
}

const CODEX_STORAGE_KEY = 'novascript_codex_v1';

export function addCodexEntry(entry: CodexEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CODEX_STORAGE_KEY);
    const entries: CodexEntry[] = raw ? JSON.parse(raw) : [];
    // Avoid duplicates by questionId + answerId
    if (entries.some((e) => e.questionId === entry.questionId && e.answerId === entry.answerId)) {
      return;
    }
    entries.push(entry);
    localStorage.setItem(CODEX_STORAGE_KEY, JSON.stringify(entries));
  } catch { /* ignore */ }
}

function loadCodexEntries(): CodexEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CODEX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function CodexPanel() {
  const { isCodexOpen, toggleCodex, endingsDiscovered } = useGameStore();
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'achievements'>('knowledge');

  useEffect(() => {
    if (isCodexOpen) {
      setEntries(loadCodexEntries());
    }
  }, [isCodexOpen]);

  if (!isCodexOpen) return null;

  // Group entries by stage
  const byStage = entries.reduce<Record<string, CodexEntry[]>>((acc, e) => {
    if (!acc[e.stage]) acc[e.stage] = [];
    acc[e.stage].push(e);
    return acc;
  }, {});

  const stageNames: Record<string, string> = {
    mission_planning: 'Mission Planning',
    spacecraft_design: 'Spacecraft Design',
    scientific_instruments: 'Science Instruments',
    orbit_selection: 'Orbit Selection',
    space_communications: 'Communications',
    resource_management: 'Resource Ops',
    launch_planning: 'Launch Planning',
    mission_operations: 'Flight Operations',
  };

  // Achievement status
  const unlockedAchievements = (() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('novascript_achievements_v1');
      return raw ? JSON.parse(raw) as string[] : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full glass-panel rounded-2xl border border-cyan-500/40 p-6 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-space-border/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-lg text-white tracking-wider">
              CODEX
            </h3>
          </div>
          <button
            onClick={toggleCodex}
            className="p-1.5 rounded-lg hover:bg-space-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-cyan-700 text-white'
                : 'bg-space-900 text-slate-400 hover:text-white'
            }`}
          >
            KNOWLEDGE ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-colors ${
              activeTab === 'achievements'
                ? 'bg-amber-700 text-white'
                : 'bg-space-900 text-slate-400 hover:text-white'
            }`}
          >
            ACHIEVEMENTS ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </button>
        </div>

        {/* Content */}
        <div className="mt-3 overflow-y-auto flex-1 pr-1">
          {activeTab === 'knowledge' ? (
            entries.length === 0 ? (
              <div className="text-center text-sm text-slate-500 py-12 font-mono">
                No knowledge entries yet.
                <br />
                Complete mission decisions to fill your codex.
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(byStage).map(([stage, stageEntries]) => (
                  <div key={stage}>
                    <button
                      onClick={() =>
                        setExpandedStage(expandedStage === stage ? null : stage)
                      }
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-space-900/80 hover:bg-space-800 text-left transition-colors"
                    >
                      {expandedStage === stage ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        {stageNames[stage] || stage}
                      </span>
                      <span className="text-xs text-slate-500 font-mono ml-auto">
                        {stageEntries.length} entries
                      </span>
                    </button>
                    {expandedStage === stage && (
                      <div className="ml-4 mt-1 space-y-2">
                        {stageEntries.map((entry, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-space-950/80 border border-space-border/30 text-xs"
                          >
                            <div className="text-cyan-400 font-mono font-bold">
                              {entry.questionId}: {entry.questionText}
                            </div>
                            <div className="text-slate-300 mt-1">
                              <span className="text-emerald-400">→</span> {entry.answerText}
                            </div>
                            <div className="mt-2 p-2 rounded bg-cyan-950/30 border border-cyan-800/20 text-cyan-200">
                              💡 {entry.learningPoint}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-2">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-space-950/50 border-space-border/20 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{isUnlocked ? ach.icon : '🔒'}</span>
                    <div>
                      <div className={`font-mono text-sm font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                        {ach.title}
                      </div>
                      <div className="text-xs text-slate-400">{ach.description}</div>
                    </div>
                    {isUnlocked && (
                      <span className="ml-auto text-xs font-mono text-emerald-400">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-space-border/30 text-center">
          <p className="text-xs font-mono text-slate-500">
            Press [Tab] or [Esc] to close
          </p>
        </div>
      </div>
    </div>
  );
}
