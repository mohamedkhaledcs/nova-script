/**
 * Mission Selection Board — immersive overlay for choosing Moon vs Mars.
 * This commits A001 (Moon) or A002 (Mars) to the canonical mission engine,
 * then transitions to the standard question flow.
 */

'use client';

import React, { useState } from 'react';
import { Rocket, ArrowRight, Globe, X } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { audio } from '@/lib/audio/audio-manager';
import { TRANSLATIONS } from '@/lib/i18n/translations';

interface MissionSelectorProps {
  isOpen: boolean;
  onSelectMission: (answerId: string) => void;
  onClose: () => void;
}

export default function MissionSelector({
  isOpen,
  onSelectMission,
  onClose,
}: MissionSelectorProps) {
  const language = useGameStore((s) => s.language);
  const t = TRANSLATIONS[language || 'en'];
  const [hoveredMission, setHoveredMission] = useState<'moon' | 'mars' | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden select-none"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background space effect */}
      <div className="absolute inset-0 stars-pattern opacity-30" />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest mb-3">
            <Globe className="w-4 h-4" />
            {t.missionAssignment}
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
            {t.selectTargetTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            {t.selectTargetSubtitle}
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Moon */}
          <button
            onClick={() => {
              audio.select();
              onSelectMission('A001');
            }}
            onMouseEnter={() => {
              audio.hover();
              setHoveredMission('moon');
            }}
            onMouseLeave={() => setHoveredMission(null)}
            className={`group relative glass-panel rounded-2xl border border-slate-600/50 hover:border-cyan-400/80 p-6 transition-all duration-300 overflow-hidden cursor-pointer ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-cyan-700/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Custom SVG Moon Vector Sphere (Zero Emojis) */}
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
              {/* Craters */}
              <div className="w-3 h-3 rounded-full bg-slate-600/60 absolute top-3 left-4 border border-slate-500/40" />
              <div className="w-4 h-4 rounded-full bg-slate-600/50 absolute bottom-4 right-3 border border-slate-500/40" />
              <div className="w-2 h-2 rounded-full bg-slate-600/60 absolute top-7 right-6 border border-slate-500/40" />
              <div className="absolute inset-0 border border-cyan-400/40 rounded-full opacity-60" />
            </div>

            <h3 className="font-mono text-xl font-bold text-white tracking-wider">
              {t.lunarMissionTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {t.lunarMissionDesc}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-700/30">
                {t.shorterTransit}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 text-slate-300 border border-slate-700/30">
                {t.moderateComplexity}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              {t.selectMoonButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Mars */}
          <button
            onClick={() => {
              audio.select();
              onSelectMission('A002');
            }}
            onMouseEnter={() => {
              audio.hover();
              setHoveredMission('mars');
            }}
            onMouseLeave={() => setHoveredMission(null)}
            className={`group relative glass-panel rounded-2xl border border-slate-600/50 hover:border-orange-400/80 p-6 transition-all duration-300 overflow-hidden cursor-pointer ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-700/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Custom SVG Mars Vector Sphere (Zero Emojis) */}
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-amber-600 via-rose-700 to-orange-950 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,180,120,0.5),transparent_65%)]" />
              {/* Polar Ice Cap */}
              <div className="w-5 h-2 rounded-full bg-white/80 absolute top-1 left-5 blur-[0.5px]" />
              {/* Martian Canyon / Surface Features */}
              <div className="w-8 h-1 rounded bg-amber-950/70 absolute top-8 left-3 -rotate-12" />
              <div className="w-6 h-1 rounded bg-amber-950/60 absolute bottom-4 right-4 rotate-6" />
              <div className="absolute inset-0 border border-orange-400/40 rounded-full opacity-60" />
            </div>

            <h3 className="font-mono text-xl font-bold text-white tracking-wider">
              {t.marsMissionTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {t.marsMissionDesc}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-950/60 text-orange-300 border border-orange-700/30">
                {t.longerTransit}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-700/30">
                {t.higherComplexity}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-orange-400 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              {t.selectMarsButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Close button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}
