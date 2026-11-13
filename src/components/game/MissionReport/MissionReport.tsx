'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Award,
  Sparkles
} from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import type { MissionEnding, Resources, DecisionRecord } from '@/types/game';

interface MissionReportProps {
  ending: MissionEnding;
  finalScore: number;
  finalResources: Resources;
  history: DecisionRecord[];
  onRestart: () => void;
}

const STATUS_CONFIGS: Record<string, { label: string; color: string; badge: string }> = {
  outstanding_success: {
    label: 'OUTSTANDING SUCCESS',
    color: 'text-cyan-400',
    badge: 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-glow-cyan',
  },
  efficient_success: {
    label: 'EFFICIENT SUCCESS',
    color: 'text-emerald-400',
    badge: 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-glow-green',
  },
  scientific_discovery: {
    label: 'SCIENTIFIC DISCOVERY',
    color: 'text-blue-400',
    badge: 'bg-blue-950 border-blue-500 text-blue-300',
  },
  partial_success: {
    label: 'PARTIAL SUCCESS',
    color: 'text-yellow-400',
    badge: 'bg-yellow-950 border-yellow-500 text-yellow-300',
  },
  strategy_revision: {
    label: 'STRATEGY REVISION REQUIRED',
    color: 'text-amber-400',
    badge: 'bg-amber-950 border-amber-500 text-amber-300 shadow-glow-amber',
  },
  resource_failure: {
    label: 'RESOURCE DEPLETION FAILURE',
    color: 'text-red-400',
    badge: 'bg-red-950 border-red-500 text-red-300 shadow-glow-red',
  },
  launch_failure: {
    label: 'LAUNCH MASS OVERLOAD SCRUB',
    color: 'text-red-400',
    badge: 'bg-red-950 border-red-500 text-red-300 shadow-glow-red',
  },
  engineering_failure: {
    label: 'ENGINEERING THERMAL FAILURE',
    color: 'text-red-400',
    badge: 'bg-red-950 border-red-500 text-red-300 shadow-glow-red',
  },
};

export default function MissionReport({
  ending,
  finalScore,
  finalResources,
  history,
  onRestart,
}: MissionReportProps) {
  const statusInfo = STATUS_CONFIGS[ending.status] || {
    label: ending.status.toUpperCase(),
    color: 'text-slate-300',
    badge: 'bg-slate-900 border-slate-700 text-slate-300',
  };

  const isSuccess = ending.status.includes('success') || ending.status === 'scientific_discovery';

  useEffect(() => {
    if (isSuccess && typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#3B82F6', '#10B981', '#F59E0B'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [isSuccess]);

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 select-none animate-in fade-in duration-300 pb-16">
      <div className="glass-panel rounded-2xl border border-cyan-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
              <Trophy className="w-4 h-4" />
              FLIGHT COMMISSION // FINAL DEBRIEF DOSSIER
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {ending.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${statusInfo.badge}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Final Score Callout */}
        <div className="mt-6 p-6 rounded-xl bg-space-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Official Mission Performance Score:
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                {finalScore.toFixed(1)} <span className="text-sm font-normal text-slate-400">PTS</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-mono text-slate-400">Deterministic Formula:</div>
            <div className="text-xs font-mono text-cyan-300/90 max-w-xs break-words">
              {ending.final_score_formula}
            </div>
          </div>
        </div>

        {/* Narrative Description & Systems Engineering Analysis */}
        <div className="mt-6 space-y-4">
          <div className="p-5 rounded-xl bg-space-900/90 border border-space-border/80">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              MISSION OUTCOME NARRATIVE
            </h4>
            <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
              {ending.description}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-space-900/90 border border-space-border/80">
            <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              SYSTEMS ENGINEERING RATIONALE
            </h4>
            <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
              {ending.scientific_explanation}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
            <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              CORE EDUCATIONAL TAKEAWAY
            </h4>
            <p className="text-sm sm:text-base text-cyan-100 font-light leading-relaxed">
              {ending.learning_point}
            </p>
          </div>
        </div>

        {/* Final Resource Telemetry Summary */}
        <div className="mt-8">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Final Resource Reserves (Normalized Points):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
            <div className="p-3 rounded-lg bg-space-950 border border-amber-500/30">
              <div className="text-[10px] text-slate-400">BUDGET</div>
              <div className="text-lg font-bold text-amber-400">{finalResources.budget}</div>
            </div>
            <div className="p-3 rounded-lg bg-space-950 border border-purple-500/30">
              <div className="text-[10px] text-slate-400">MASS</div>
              <div className="text-lg font-bold text-purple-400">{finalResources.mass}</div>
            </div>
            <div className="p-3 rounded-lg bg-space-950 border border-yellow-500/30">
              <div className="text-[10px] text-slate-400">POWER</div>
              <div className="text-lg font-bold text-yellow-400">{finalResources.power}</div>
            </div>
            <div className="p-3 rounded-lg bg-space-950 border border-cyan-500/30">
              <div className="text-[10px] text-slate-400">SCIENCE</div>
              <div className="text-lg font-bold text-cyan-400">{finalResources.scientific_value}</div>
            </div>
            <div className="p-3 rounded-lg bg-space-950 border border-emerald-500/30 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400">COMMS</div>
              <div className="text-lg font-bold text-emerald-400">{finalResources.communication}</div>
            </div>
          </div>
        </div>

        {/* Chronological Decision Log */}
        <div className="mt-8 pt-6 border-t border-space-border/60">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            MISSION DECISION CHRONOLOGY ({history.length} STEPS):
          </h4>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {history.map((record, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-space-950/70 border border-space-border/50 text-xs font-mono flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-400 font-bold">
                    STEP {record.stepIndex}: {record.questionId} [{record.stage}]
                  </span>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> CHOSEN: {record.selectedAnswerId}
                  </span>
                </div>
                <div className="text-slate-200 font-sans font-medium text-xs">
                  {record.selectedAnswerText}
                </div>
                <div className="text-slate-400 text-[11px] italic font-sans">
                  {record.consequenceSummary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-space-border/60 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              audio.click();
              onRestart();
            }}
            onMouseEnter={() => audio.hover()}
            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold tracking-wider shadow-glow-cyan transition-all duration-200 flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5 text-cyan-200" />
            <span>LAUNCH NEW MISSION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
