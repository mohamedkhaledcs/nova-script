'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import type { Question, AnswerOption, Resources, ResourceKey } from '@/types/game';
import { useGameStore } from '@/game/store';
import { TRANSLATIONS } from '@/lib/i18n/translations';

interface QuestionViewerProps {
  question: Question;
  currentResources: Resources;
  onCommitAnswer: (answerId: string) => void;
}

const RESOURCE_LABELS_EN: Record<ResourceKey, { label: string; color: string }> = {
  budget: { label: 'Budget', color: 'text-amber-400 bg-amber-950/60 border-amber-600/40' },
  mass: { label: 'Mass', color: 'text-purple-400 bg-purple-950/60 border-purple-600/40' },
  power: { label: 'Power', color: 'text-yellow-400 bg-yellow-950/60 border-yellow-600/40' },
  scientific_value: { label: 'Science', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-600/40' },
  communication: { label: 'Comms', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/40' },
};

const RESOURCE_LABELS_AR: Record<ResourceKey, { label: string; color: string }> = {
  budget: { label: 'الميزانية', color: 'text-amber-400 bg-amber-950/60 border-amber-600/40' },
  mass: { label: 'الكتلة', color: 'text-purple-400 bg-purple-950/60 border-purple-600/40' },
  power: { label: 'الطاقة', color: 'text-yellow-400 bg-yellow-950/60 border-yellow-600/40' },
  scientific_value: { label: 'العلوم', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-600/40' },
  communication: { label: 'الاتصالات', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/40' },
};

export default function QuestionViewer({
  question,
  onCommitAnswer,
}: QuestionViewerProps) {
  const language = useGameStore((s) => s.language);
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language || 'en'];
  const resourceLabels = isAr ? RESOURCE_LABELS_AR : RESOURCE_LABELS_EN;

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showConsequenceModal, setShowConsequenceModal] = useState<boolean>(false);

  const handleSelectOption = (option: AnswerOption) => {
    setSelectedAnswer(option);
    audio.select();
    setShowConsequenceModal(true);
  };

  const handleConfirmDecision = () => {
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
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 select-none">
      {/* Top Question Context Card */}
      <div className="glass-panel rounded-2xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Stage and ID Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-space-border/50 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-bold">
              {question.id}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 uppercase">
              {question.stage.replace('_', ' ')}
            </span>
          </div>

          {question.source && (
            <a
              href={question.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors text-[11px]"
              title={`Source: ${question.source.title} (${question.source.section})`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{question.source.section}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>

        {/* Story Context Narrative */}
        <div className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          {question.story}
        </div>

        {/* Primary Question Prompt */}
        <div className="mt-4 pt-4 border-t border-space-border/30">
          <div className="flex items-start gap-3">
            <Compass className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight leading-snug">
              {question.question}
            </h3>
          </div>
        </div>

        {/* Binary Answer Options (Choice A & Choice B) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {question.answers.map((option, idx) => {
            const effectsEntries = Object.entries(option.effects).filter(([, val]) => val !== 0);

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => audio.hover()}
                className="group relative flex flex-col justify-between text-left p-5 sm:p-6 rounded-xl glass-panel glass-panel-hover border border-space-border/80 hover:border-cyan-400/80 transition-all duration-200"
              >
                <div>
                  {/* Option Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-space-950 text-cyan-400 border border-cyan-800/40">
                      {isAr ? (idx === 0 ? t.optionA : t.optionB) : `OPTION ${idx === 0 ? 'A' : 'B'}`} [{option.id}]
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold">
                      {isAr ? t.chooseOption : 'CHOOSE'} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Option Text */}
                  <p className="text-sm sm:text-base text-slate-200 font-medium group-hover:text-white transition-colors leading-snug">
                    {option.text}
                  </p>
                </div>

                {/* Anticipated Resource Effects Badges */}
                <div className="mt-5 pt-3 border-t border-slate-800/60">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    {t.engineeringImpact}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {effectsEntries.length > 0 ? (
                      effectsEntries.map(([resKey, deltaVal]) => {
                        const info = resourceLabels[resKey as ResourceKey];
                        const isPositive = (deltaVal as number) > 0;
                        return (
                          <span
                            key={resKey}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${info.color}`}
                          >
                            <span>{info.label}:</span>
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
      </div>

      {/* Decision Consequence & Learning Point Modal */}
      {showConsequenceModal && selectedAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="max-w-xl w-full glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-400/50 shadow-glow-cyan text-left">
            {/* Modal Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              {selectedAnswer.ending_id ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
              <h4 className="text-lg font-mono font-bold text-white tracking-wide">
                {isAr ? 'تحليل الموازنات الهندسية الفضائية' : 'ENGINEERING TRADE-OFF ANALYSIS'}
              </h4>
            </div>

            {/* Selected Decision Summary */}
            <div className="mt-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {isAr ? 'القرار المحدد:' : 'Confirmed Action:'}
              </span>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {selectedAnswer.text}
              </p>
            </div>

            {/* Consequence Summary */}
            <div className="mt-4 p-4 rounded-xl bg-space-950/80 border border-slate-800">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {isAr ? 'التبعات والنتائج التشغيلية:' : 'Operational Consequence:'}
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

            {/* Proceed Action Button */}
            <button
              onClick={handleConfirmDecision}
              className={`mt-6 w-full py-3.5 px-6 rounded-xl font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedAnswer.ending_id
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white shadow-glow-amber'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan'
              }`}
            >
              <span>
                {selectedAnswer.ending_id
                  ? isAr
                    ? 'تقييم نتيجة المهمة النهائية'
                    : 'COMMENCE MISSION OUTCOME EVALUATION'
                  : isAr
                  ? 'تأكيد القرار ومتابعة الرحلة'
                  : 'COMMIT DECISION & ADVANCE MISSION'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
