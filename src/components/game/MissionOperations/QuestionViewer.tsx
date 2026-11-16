'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  Radio,
  Coins,
  Shield,
  CornerDownRight,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import type { Question, AnswerOption, Resources, ResourceKey } from '@/types/game';
import { useGameStore } from '@/game/store';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import { getLocalizedQuestion } from '@/lib/i18n/mission-translations-ar';
import { matchesKey } from '@/game/types';

interface QuestionViewerProps {
  question: Question;
  currentResources: Resources;
  onCommitAnswer: (answerId: string) => void;
}

interface ResourceConfig {
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  barColor: string;
}

const RESOURCE_CONFIG_EN: Record<ResourceKey, ResourceConfig> = {
  budget: { 
    label: 'Budget', 
    shortLabel: 'BGT', 
    icon: Coins, 
    color: 'text-amber-400', 
    badgeBg: 'bg-amber-950/60 border-amber-600/40 text-amber-300',
    barColor: 'bg-amber-500' 
  },
  mass: { 
    label: 'Mass Margin', 
    shortLabel: 'MSS', 
    icon: Shield, 
    color: 'text-purple-400', 
    badgeBg: 'bg-purple-950/60 border-purple-600/40 text-purple-300',
    barColor: 'bg-purple-500' 
  },
  power: { 
    label: 'Power (EPS)', 
    shortLabel: 'PWR', 
    icon: Zap, 
    color: 'text-yellow-400', 
    badgeBg: 'bg-yellow-950/60 border-yellow-600/40 text-yellow-300',
    barColor: 'bg-yellow-500' 
  },
  scientific_value: { 
    label: 'Science Yield', 
    shortLabel: 'SCI', 
    icon: Activity, 
    color: 'text-cyan-400', 
    badgeBg: 'bg-cyan-950/60 border-cyan-600/40 text-cyan-300',
    barColor: 'bg-cyan-500' 
  },
  communication: { 
    label: 'Telemetry / Comms', 
    shortLabel: 'COM', 
    icon: Radio, 
    color: 'text-emerald-400', 
    badgeBg: 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300',
    barColor: 'bg-emerald-500' 
  },
};

const RESOURCE_CONFIG_AR: Record<ResourceKey, ResourceConfig> = {
  budget: { 
    label: 'الميزانية', 
    shortLabel: 'ميزانية', 
    icon: Coins, 
    color: 'text-amber-400', 
    badgeBg: 'bg-amber-950/60 border-amber-600/40 text-amber-300',
    barColor: 'bg-amber-500' 
  },
  mass: { 
    label: 'الكتلة', 
    shortLabel: 'كتلة', 
    icon: Shield, 
    color: 'text-purple-400', 
    badgeBg: 'bg-purple-950/60 border-purple-600/40 text-purple-300',
    barColor: 'bg-purple-500' 
  },
  power: { 
    label: 'الطاقة الكهربائية', 
    shortLabel: 'طاقة', 
    icon: Zap, 
    color: 'text-yellow-400', 
    badgeBg: 'bg-yellow-950/60 border-yellow-600/40 text-yellow-300',
    barColor: 'bg-yellow-500' 
  },
  scientific_value: { 
    label: 'المردود العلمي', 
    shortLabel: 'علوم', 
    icon: Activity, 
    color: 'text-cyan-400', 
    badgeBg: 'bg-cyan-950/60 border-cyan-600/40 text-cyan-300',
    barColor: 'bg-cyan-500' 
  },
  communication: { 
    label: 'الاتصالات والقياس', 
    shortLabel: 'اتصال', 
    icon: Radio, 
    color: 'text-emerald-400', 
    badgeBg: 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300',
    barColor: 'bg-emerald-500' 
  },
};

export default function QuestionViewer({
  question,
  currentResources,
  onCommitAnswer,
}: QuestionViewerProps) {
  const language = useGameStore((s) => s.language);
  const visualMode = useGameStore((s) => s.visualMode);
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language || 'en'];
  const resourceConfigs = isAr ? RESOURCE_CONFIG_AR : RESOURCE_CONFIG_EN;

  const activeQuestion = useMemo(() => {
    return getLocalizedQuestion(question, language || 'en');
  }, [question, language]);

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showConsequenceModal, setShowConsequenceModal] = useState<boolean>(false);
  const [hoveredAnswer, setHoveredAnswer] = useState<AnswerOption | null>(null);

  const handleSelectOption = useCallback((option: AnswerOption) => {
    setSelectedAnswer(option);
    audio.select();
    setShowConsequenceModal(true);
  }, []);

  const handleConfirmDecision = useCallback(() => {
    if (!selectedAnswer) return;
    if (selectedAnswer.ending_id) {
      if (selectedAnswer.ending_id === 'E001' || selectedAnswer.ending_id === 'E002' || selectedAnswer.ending_id === 'E003') {
        audio.success();
      } else {
        audio.failure();
      }
    } else {
      audio.click();
    }
    setShowConsequenceModal(false);
    onCommitAnswer(selectedAnswer.id);
  }, [selectedAnswer, onCommitAnswer]);

  // Keyboard navigation: 1/A for Option 1, 2/B for Option 2, Enter/Space to confirm, Escape to cancel modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (showConsequenceModal && selectedAnswer) {
        if (matchesKey(['enter', ' '], e)) {
          e.preventDefault();
          handleConfirmDecision();
        } else if (matchesKey(['escape'], e)) {
          e.preventDefault();
          setShowConsequenceModal(false);
        }
        return;
      }

      if (!showConsequenceModal && activeQuestion.answers.length >= 2) {
        if (matchesKey(['1', 'a', 'ش', '١'], e)) {
          e.preventDefault();
          handleSelectOption(activeQuestion.answers[0]);
        } else if (matchesKey(['2', 'b', 'س', '٢'], e)) {
          e.preventDefault();
          handleSelectOption(activeQuestion.answers[1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConsequenceModal, selectedAnswer, activeQuestion, handleConfirmDecision, handleSelectOption]);

  // Extract question sequence number for telemetry timestamp
  const qNum = activeQuestion.id.replace(/\D/g, '') || '01';
  const metDisplay = `T+00:${qNum.padStart(2, '0')}:42 MET`;

  // Visual mode dynamic class styling
  const isCAD = visualMode === 'performance';
  const isRetro = visualMode === 'retro-pixel';
  const isCyber = visualMode === 'cyber-neon';

  const containerBorderClass = isCAD
    ? 'border border-cyan-400/70 bg-[#03142e]/95 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
    : isRetro
    ? 'border-2 border-amber-600/70 bg-slate-900/95 shadow-[6px_6px_0_0_#78350F]'
    : isCyber
    ? 'border border-pink-500/50 bg-[#070b19]/95 shadow-[0_0_35px_rgba(236,72,153,0.3)]'
    : 'glass-panel border border-cyan-500/30 shadow-2xl';

  return (
    <div className={`max-w-4xl w-full mx-auto p-3 sm:p-6 select-none ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* ===== TELEMETRY HUD STRIP: LIVE SUBSYSTEM GAUGES ===== */}
      <div className={`mb-4 px-4 py-3 rounded-xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
        isCAD 
          ? 'bg-[#02142e]/90 border-cyan-500/40 text-cyan-300' 
          : isRetro
          ? 'bg-slate-900 border-amber-700/50 text-amber-200'
          : isCyber
          ? 'bg-[#0a0f24]/90 border-pink-500/30 text-pink-300'
          : 'bg-space-950/80 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          <Gauge className={`w-4 h-4 ${isCAD ? 'text-cyan-400' : isCyber ? 'text-pink-400' : 'text-cyan-400'} animate-pulse`} />
          <span className="font-bold tracking-wider uppercase">
            {isAr ? 'مؤشرات القياس الحيوي للمسبار (ECLSS & TELEMETRY)' : 'PROBE TELEMETRY & SYSTEM MARGINS'}
          </span>
        </div>

        {/* 5 Realtime Resource Micro-Meters */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {(Object.keys(currentResources) as ResourceKey[]).map((key) => {
            const val = currentResources[key];
            const cfg = resourceConfigs[key];
            const Icon = cfg.icon;
            const deltaHover = hoveredAnswer?.effects[key] || 0;

            return (
              <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-slate-700/40">
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className="text-[10px] text-slate-400 font-bold">{cfg.shortLabel}:</span>
                <span className="font-bold text-white min-w-[20px] text-center">{val}</span>
                {deltaHover !== 0 && (
                  <span className={`text-[10px] font-bold ${deltaHover > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {deltaHover > 0 ? `+${deltaHover}` : deltaHover}
                  </span>
                )}
                {/* Mini Bar */}
                <div className="w-8 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                  <div
                    className={`h-full ${cfg.barColor} transition-all duration-300`}
                    style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN QUESTION CARD ===== */}
      <div className={`rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${containerBorderClass}`}>
        
        {/* CAD Blueprint Drafting Corner Brackets Decoration */}
        {isCAD && (
          <>
            <span className="absolute top-2 left-2 text-cyan-400 font-mono text-xs select-none pointer-events-none">┌ [CAD // 04.2]</span>
            <span className="absolute top-2 right-2 text-cyan-400 font-mono text-xs select-none pointer-events-none">[TRAJ-AXIS] ┐</span>
            <span className="absolute bottom-2 left-2 text-cyan-400 font-mono text-xs select-none pointer-events-none">└ [GEO-SPEC]</span>
            <span className="absolute bottom-2 right-2 text-cyan-400 font-mono text-xs select-none pointer-events-none">[SEC-NOMINAL] ┘</span>
          </>
        )}

        {/* Subtle Ambient Glow for Non-CAD Modes */}
        {!isCAD && (
          <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            isCyber ? 'bg-pink-600/15' : isRetro ? 'bg-amber-600/15' : 'bg-cyan-600/10'
          }`} />
        )}

        {/* Stage, MET Clock & Source Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-space-border/50 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded font-bold border ${
              isCAD 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500' 
                : isCyber 
                ? 'bg-pink-950 text-pink-300 border-pink-500/60'
                : isRetro
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
            }`}>
              {activeQuestion.id}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900/90 text-slate-300 border border-slate-700 uppercase tracking-wide">
              {activeQuestion.stage.replace('_', ' ')}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/50 text-slate-400 border border-slate-800 text-[11px]">
              {metDisplay}
            </span>
          </div>

          {activeQuestion.source && (
            <a
              href={activeQuestion.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors text-[11px]"
              title={`Source: ${activeQuestion.source.title} (${activeQuestion.source.section})`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{activeQuestion.source.section}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>

        {/* Story Context Narrative */}
        <div className={`mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-light ${isAr ? 'font-sans' : 'font-mono'}`}>
          {activeQuestion.story}
        </div>

        {/* Primary Question Prompt */}
        <div className="mt-4 pt-4 border-t border-space-border/30">
          <div className="flex items-start gap-3">
            <Compass className={`w-6 h-6 shrink-0 mt-0.5 animate-pulse ${
              isCAD ? 'text-cyan-400' : isCyber ? 'text-pink-400' : isRetro ? 'text-amber-400' : 'text-cyan-400'
            }`} />
            <h3 className={`text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug ${isAr ? 'font-sans' : 'font-mono'}`}>
              {activeQuestion.question}
            </h3>
          </div>
        </div>

        {/* Binary Answer Options (Choice A & Choice B) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {activeQuestion.answers.map((option, idx) => {
            const effectsEntries = Object.entries(option.effects).filter(([, val]) => val !== 0);
            const hotkeyLabel = idx === 0 ? (isAr ? '١ / A' : '1 / A') : (isAr ? '٢ / B' : '2 / B');

            const optionBorderClass = isCAD
              ? 'border-cyan-500/50 hover:border-cyan-300 bg-[#02183b]/80 hover:bg-[#032357]/90 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
              : isRetro
              ? 'border-2 border-slate-700 hover:border-amber-500 bg-slate-900/90 shadow-[3px_3px_0_0_#475569]'
              : isCyber
              ? 'border-pink-500/40 hover:border-pink-400 bg-[#0e142e]/85 hover:bg-[#141b3d]/90 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
              : 'border-space-border/80 hover:border-cyan-400/80 glass-panel glass-panel-hover';

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => {
                  audio.hover();
                  setHoveredAnswer(option);
                }}
                onMouseLeave={() => setHoveredAnswer(null)}
                className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-xl border transition-all duration-200 cursor-pointer ${optionBorderClass} ${
                  isAr ? 'text-right' : 'text-left'
                }`}
              >
                <div>
                  {/* Option Header & Hotkey Pill */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                        isCAD 
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-600' 
                          : isCyber
                          ? 'bg-pink-950 text-pink-300 border-pink-600'
                          : 'bg-space-950 text-cyan-400 border-cyan-800/40'
                      }`}>
                        {isAr ? (idx === 0 ? t.optionA : t.optionB) : `OPTION ${idx === 0 ? 'A' : 'B'}`}
                      </span>
                      {/* Keyboard shortcut badge */}
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-700">
                        [{hotkeyLabel}]
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold">
                      {isAr ? t.chooseOption : 'CHOOSE'} 
                      <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                    </span>
                  </div>

                  {/* Option Text */}
                  <p className="text-sm sm:text-base text-slate-200 font-medium group-hover:text-white transition-colors leading-snug">
                    {option.text}
                  </p>
                </div>

                {/* Anticipated Resource Effects Badges & Trend Indicators */}
                <div className="mt-5 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    <span>{t.engineeringImpact}</span>
                    <span className="text-slate-500 font-sans">{isAr ? 'المردود المتوقع' : 'Projected Delta'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {effectsEntries.length > 0 ? (
                      effectsEntries.map(([resKey, deltaVal]) => {
                        const cfg = resourceConfigs[resKey as ResourceKey];
                        const isPositive = (deltaVal as number) > 0;
                        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                        return (
                          <span
                            key={resKey}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${cfg.badgeBg}`}
                          >
                            <TrendIcon className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />
                            <span>{cfg.label}:</span>
                            <span className="font-bold">
                              {isPositive ? `+${deltaVal}` : deltaVal}
                            </span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 italic">
                        {isAr ? 'تأثير متوازن على الموارد' : 'Neutral resource margins'}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Keyboard Instruction Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-bold">1</span>
            <span>/</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-bold">2</span>
            <span>{isAr ? 'للاختيار السريع بلوحة المفاتيح' : 'Quick Choice Keys (Keyboard Ready)'}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">
            NASA SYSTEMS ENGINEERING HANDBOOK // SP-2016-6105
          </span>
        </div>
      </div>

      {/* ===== DECISION CONSEQUENCE & LEARNING POINT MODAL ===== */}
      {showConsequenceModal && selectedAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div
            className={`max-w-xl w-full rounded-2xl border p-6 sm:p-8 relative overflow-hidden shadow-2xl ${
              isCAD 
                ? 'bg-[#02183b] border-cyan-400 text-cyan-100 shadow-[0_0_40px_rgba(0,240,255,0.3)]'
                : isRetro
                ? 'bg-slate-900 border-2 border-amber-600 text-slate-100 shadow-[8px_8px_0_0_#78350F]'
                : isCyber
                ? 'bg-[#0a0f24] border-pink-500 text-slate-100 shadow-[0_0_45px_rgba(236,72,153,0.35)]'
                : 'glass-panel border-cyan-400/50 shadow-glow-cyan'
            } ${isAr ? 'text-right' : 'text-left'}`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                {selectedAnswer.ending_id ? (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                )}
                <h4 className="text-base sm:text-lg font-mono font-bold text-white tracking-wide uppercase">
                  {isAr ? 'تحليل الموازنات الهندسية الفضائية' : 'ENGINEERING TRADE-OFF ANALYSIS'}
                </h4>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                {isAr ? 'مصادقة مدير الرحلة' : 'FLIGHT SIGN-OFF'}
              </span>
            </div>

            {/* Selected Decision Summary */}
            <div className="mt-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {isAr ? 'القرار المعتمد:' : 'Approved Action:'}
              </span>
              <p className="mt-1 text-sm font-medium text-slate-100 font-mono">
                {selectedAnswer.text}
              </p>
            </div>

            {/* Consequence Summary */}
            <div className="mt-4 p-4 rounded-xl bg-space-950/90 border border-slate-800">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {isAr ? 'التبعات والنتائج التشغيلية المباشرة:' : 'Operational Consequence:'}
              </span>
              <p className="mt-1.5 text-sm text-slate-200 font-light leading-relaxed">
                {selectedAnswer.consequence_summary}
              </p>
            </div>

            {/* Educational Learning Point */}
            <div className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {isAr ? 'المبدأ العلمي والهندسي المستفاد:' : 'Systems Engineering Takeaway:'}
              </span>
              <p className="mt-1.5 text-sm text-cyan-100 font-light leading-relaxed">
                {selectedAnswer.learning_point}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setShowConsequenceModal(false)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl font-mono text-xs text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                {isAr ? 'تراجع / إعادة النظر [ESC]' : 'Review Options [ESC]'}
              </button>

              <button
                onClick={handleConfirmDecision}
                className={`flex-1 w-full py-3.5 px-6 rounded-xl font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedAnswer.ending_id
                    ? 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white shadow-glow-amber'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan'
                }`}
              >
                <span>
                  {selectedAnswer.ending_id
                    ? isAr
                      ? 'تقييم نتيجة المهمة النهائية [Enter]'
                      : 'COMMENCE MISSION EVALUATION [Enter]'
                    : isAr
                    ? 'تأكيد القرار ومتابعة الرحلة [Enter]'
                    : 'COMMIT DECISION & ADVANCE [Enter]'}
                </span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
