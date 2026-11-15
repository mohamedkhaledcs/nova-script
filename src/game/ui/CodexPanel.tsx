/**
 * Scientific Codex panel — a knowledge bank that records learning points
 * from mission decisions. Opens with Tab key.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, ChevronDown, ChevronRight, Award, Lock, Check } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { ACHIEVEMENTS, type AchievementDef } from '@/game/progression/achievements';
import { ARABIC_QUESTIONS } from '@/lib/i18n/mission-translations-ar';

interface CodexEntry {
  questionId: string;
  questionText: string;
  answerId: string;
  answerText: string;
  learningPoint: string;
  stage: string;
}

const ACHIEVEMENTS_AR: Record<string, { title: string; description: string }> = {
  'first-steps': { title: 'الخطوات الأولى', description: 'دخول المحطة الفضائية لأول مرة.' },
  explorer: { title: 'مستكشف المحطة', description: 'زيارة أقسام المحطة الفضائية السبعة.' },
  'first-mission': { title: 'قائد المهمة', description: 'إنجاز مهمتك الفضائية الأولى بنجاح.' },
  collector: { title: 'جامع الموارد', description: 'جمع 10 خامات من أرجاء المحطة.' },
  'master-collector': { title: 'خبير الخامات', description: 'جمع 50 خامة من أرجاء المحطة.' },
  'first-craft': { title: 'مهندس مبتدئ', description: 'تصنيع أول ترقية على طاولة الهندسة.' },
  'master-crafter': { title: 'كبير المهندسين', description: 'تصنيع جميع الترقيات الستة المتاحة.' },
  outstanding: { title: 'نجاح استثنائي', description: 'تحقيق نهاية النجاح الاستثنائي الباهر.' },
  efficient: { title: 'عمليات كفؤة', description: 'تحقيق نهاية النجاح بكفاءة الموارد.' },
  scientist: { title: 'اكتشاف علمي', description: 'تحقيق نهاية الاكتشاف العلمي التاريخي.' },
  'all-endings': { title: 'مستكشف الأكوان', description: 'اكتشاف جميع نهايات المهمة الثمانية.' },
};

const STAGE_NAMES_AR: Record<string, string> = {
  mission_planning: 'تخطيط المهمة',
  spacecraft_design: 'تصميم المركبة',
  scientific_instruments: 'الأجهزة العلمية',
  orbit_selection: 'اختيار المدار',
  space_communications: 'الاتصالات',
  resource_management: 'إدارة الموارد',
  launch_planning: 'تخطيط الإطلاق',
  mission_operations: 'عمليات الطيران',
};

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
  const { isCodexOpen, toggleCodex, unlockedAchievements, language } = useGameStore();
  const isAr = language === 'ar';
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-2xl w-full glass-panel rounded-2xl border border-cyan-500/40 p-6 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-space-border/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className={`font-bold text-lg text-white tracking-wider ${isAr ? 'font-sans' : 'font-mono'}`}>
              {isAr ? 'أرشيف المعارف المدارية (الكودكس)' : 'SCIENTIFIC CODEX'}
            </h3>
          </div>
          <button
            onClick={toggleCodex}
            className="p-1.5 rounded-lg hover:bg-space-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-cyan-700 text-white'
                : 'bg-space-900 text-slate-400 hover:text-white'
            } ${isAr ? 'font-sans' : 'font-mono'}`}
          >
            {isAr ? `المعارف المكتسبة (${entries.length})` : `KNOWLEDGE (${entries.length})`}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-amber-700 text-white'
                : 'bg-space-900 text-slate-400 hover:text-white'
            } ${isAr ? 'font-sans' : 'font-mono'}`}
          >
            {isAr
              ? `الإنجازات (${unlockedAchievements.length}/${ACHIEVEMENTS.length})`
              : `ACHIEVEMENTS (${unlockedAchievements.length}/${ACHIEVEMENTS.length})`}
          </button>
        </div>

        {/* Content */}
        <div className="mt-3 overflow-y-auto flex-1 pr-1">
          {activeTab === 'knowledge' ? (
            entries.length === 0 ? (
              <div className={`text-center text-sm text-slate-500 py-12 ${isAr ? 'font-sans' : 'font-mono'}`}>
                {isAr ? (
                  <>
                    لم يتم تسجيل معارف ميدانية بعد.
                    <br />
                    أكمل قرارات المهمة الفضائية لملء هذا الأرشيف.
                  </>
                ) : (
                  <>
                    No knowledge entries yet.
                    <br />
                    Complete mission decisions to fill your codex.
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(byStage).map(([stage, stageEntries]) => (
                  <div key={stage}>
                    <button
                      onClick={() =>
                        setExpandedStage(expandedStage === stage ? null : stage)
                      }
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-space-900/80 hover:bg-space-800 text-left transition-colors cursor-pointer"
                    >
                      {expandedStage === stage ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className={`text-xs font-bold text-cyan-300 uppercase tracking-wider ${isAr ? 'font-sans' : 'font-mono'}`}>
                        {isAr ? STAGE_NAMES_AR[stage] || stage : stageNames[stage] || stage}
                      </span>
                      <span className="text-xs text-slate-500 font-mono ml-auto">
                        {stageEntries.length} {isAr ? 'سجلات' : 'entries'}
                      </span>
                    </button>
                    {expandedStage === stage && (
                      <div className="ml-4 mt-1 space-y-2">
                        {stageEntries.map((entry, i) => {
                          const qAr = isAr ? ARABIC_QUESTIONS[entry.questionId] : null;
                          const qText = qAr?.question || entry.questionText;
                          const aText = qAr?.answers[entry.answerId]?.text || entry.answerText;
                          const lPoint = qAr?.answers[entry.answerId]?.learning_point || entry.learningPoint;

                          return (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-space-950/80 border border-space-border/30 text-xs space-y-1.5"
                            >
                              <div className={`text-cyan-400 font-bold ${isAr ? 'font-sans' : 'font-mono'}`}>
                                {entry.questionId}: {qText}
                              </div>
                              <div className={`text-slate-300 ${isAr ? 'font-sans' : 'font-mono'}`}>
                                <span className="text-emerald-400 font-bold">→</span> {aText}
                              </div>
                              <div className="mt-2 p-2 rounded bg-cyan-950/30 border border-cyan-800/20 text-cyan-200 flex items-start gap-1.5">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 shrink-0">
                                  {isAr ? 'المبدأ' : 'TAKEAWAY'}
                                </span>
                                <span className={isAr ? 'font-sans' : ''}>{lPoint}</span>
                              </div>
                            </div>
                          );
                        })}
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
                const title = isAr && ACHIEVEMENTS_AR[ach.id] ? ACHIEVEMENTS_AR[ach.id].title : ach.title;
                const desc = isAr && ACHIEVEMENTS_AR[ach.id] ? ACHIEVEMENTS_AR[ach.id].description : ach.description;

                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-space-950/50 border-space-border/20 opacity-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-space-900 border border-space-border shrink-0">
                      {isUnlocked ? (
                        <Award className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-500'} ${isAr ? 'font-sans' : 'font-mono'}`}>
                        {title}
                      </div>
                      <div className={`text-xs text-slate-400 ${isAr ? 'font-sans' : ''}`}>{desc}</div>
                    </div>
                    {isUnlocked && (
                      <Check className="ml-auto w-4 h-4 text-emerald-400" />
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
            {isAr ? 'اضغط [Tab] أو [Esc] للإغلاق' : 'Press [Tab] or [Esc] to close'}
          </p>
        </div>
      </div>
    </div>
  );
}
