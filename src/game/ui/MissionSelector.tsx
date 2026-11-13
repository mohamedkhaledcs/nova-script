/**
 * Mission Selection Board — immersive overlay for choosing Moon vs Mars.
 * This commits A001 (Moon) or A002 (Mars) to the canonical mission engine,
 * then transitions to the standard question flow.
 */

'use client';

import React, { useState } from 'react';
import { Rocket, ArrowRight, Globe, X } from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';

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
  const [hoveredMission, setHoveredMission] = useState<'moon' | 'mars' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden">
      {/* Background space effect */}
      <div className="absolute inset-0 stars-pattern opacity-30" />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest mb-3">
            <Globe className="w-4 h-4" />
            MISSION ASSIGNMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
            SELECT YOUR TARGET
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Choose your destination. Each mission presents unique engineering
            challenges and scientific opportunities.
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
            className="group relative glass-panel rounded-2xl border border-slate-600/50 hover:border-cyan-400/80 p-6 text-left transition-all duration-300 overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-cyan-700/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Moon emoji as large visual */}
            <div className="text-6xl mb-4">🌙</div>

            <h3 className="font-mono text-xl font-bold text-white tracking-wider">
              LUNAR MISSION
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Design a robotic probe to explore the Moon&apos;s surface. Study
              lunar geology, test new landing technologies, and establish
              communication with Earth stations.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-700/30">
                SHORTER TRANSIT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 text-slate-300 border border-slate-700/30">
                MODERATE COMPLEXITY
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              SELECT MOON MISSION
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
            className="group relative glass-panel rounded-2xl border border-slate-600/50 hover:border-orange-400/80 p-6 text-left transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-700/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="text-6xl mb-4">🔴</div>

            <h3 className="font-mono text-xl font-bold text-white tracking-wider">
              MARS MISSION
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Engineer an interplanetary spacecraft to reach Mars. Navigate
              atmospheric entry, manage deep-space communications, and
              search for signs of ancient water.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-950/60 text-orange-300 border border-orange-700/30">
                LONGER TRANSIT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-700/30">
                HIGHER COMPLEXITY
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-orange-400 font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              SELECT MARS MISSION
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
            ← RETURN TO STATION
          </button>
        </div>
      </div>
    </div>
  );
}
