'use client';

import React from 'react';
import { 
  Coins, 
  Weight, 
  Zap, 
  Microscope, 
  Radio, 
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import type { Resources, MissionStage } from '@/types/game';
import { isResourceCritical } from '@/lib/game-engine/resource-engine';
import { useGameStore } from '@/game/store';

interface GameHUDProps {
  resources: Resources;
  stage?: MissionStage;
  destination: 'moon' | 'mars' | null;
  stepCount: number;
  lastDeltas?: Partial<Resources>;
  isMuted: boolean;
  onToggleAudio: () => void;
  onRestart: () => void;
}

const STAGE_LABELS_EN: Record<MissionStage, string> = {
  mission_planning: 'Mission Planning',
  spacecraft_design: 'Spacecraft Design',
  scientific_instruments: 'Science Instruments',
  orbit_selection: 'Orbit Selection',
  space_communications: 'Communications',
  resource_management: 'Resource Ops',
  launch_planning: 'Launch Planning',
  mission_operations: 'Flight Operations',
};

const STAGE_LABELS_AR: Record<MissionStage, string> = {
  mission_planning: 'تخطيط المهمة',
  spacecraft_design: 'تصميم المركبة',
  scientific_instruments: 'الأجهزة العلمية',
  orbit_selection: 'اختيار المدار',
  space_communications: 'الاتصالات',
  resource_management: 'إدارة الموارد',
  launch_planning: 'تخطيط الإطلاق',
  mission_operations: 'عمليات الطيران',
};

export default function GameHUD({
  resources,
  stage,
  destination,
  stepCount,
  lastDeltas,
  isMuted,
  onToggleAudio,
  onRestart,
}: GameHUDProps) {
  const language = useGameStore((s) => s.language);
  const isAr = language === 'ar';

  const resourceConfigs = [
    {
      key: 'budget' as const,
      label: isAr ? 'الميزانية' : 'Budget',
      value: resources.budget,
      delta: lastDeltas?.budget,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      borderColor: 'border-amber-500/30',
      icon: Coins,
    },
    {
      key: 'mass' as const,
      label: isAr ? 'الكتلة' : 'Mass',
      value: resources.mass,
      delta: lastDeltas?.mass,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400',
      borderColor: 'border-purple-500/30',
      icon: Weight,
    },
    {
      key: 'power' as const,
      label: isAr ? 'الطاقة' : 'Power',
      value: resources.power,
      delta: lastDeltas?.power,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-500/30',
      icon: Zap,
    },
    {
      key: 'scientific_value' as const,
      label: isAr ? 'العلوم' : 'Science',
      value: resources.scientific_value,
      delta: lastDeltas?.scientific_value,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400',
      borderColor: 'border-cyan-500/30',
      icon: Microscope,
    },
    {
      key: 'communication' as const,
      label: isAr ? 'الاتصال' : 'Comms',
      value: resources.communication,
      delta: lastDeltas?.communication,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400',
      borderColor: 'border-emerald-500/30',
      icon: Radio,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-space-border/60 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Mission Stage */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-widest text-cyan-glow font-bold">NOVASCRIPT</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              STEP {stepCount}
            </span>
          </div>

          {destination && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 capitalize">
              {isAr ? (destination === 'moon' ? 'الوجهة: القمر' : 'الوجهة: المريخ') : `Target: ${destination}`}
            </span>
          )}

          {stage && (
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded bg-slate-900/80 text-cyan-300/90 border border-cyan-800/40 font-mono">
              {isAr ? STAGE_LABELS_AR[stage] || stage : STAGE_LABELS_EN[stage] || stage}
            </span>
          )}
        </div>

        {/* Center: Real-Time Normalized Telemetry Gauges */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full md:w-auto">
          {resourceConfigs.map((res) => {
            const Icon = res.icon;
            const isCritical = isResourceCritical(res.key, res.value);

            return (
              <div
                key={res.key}
                className={`relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-space-900/90 border ${
                  isCritical ? 'border-red-500/80 animate-pulse bg-red-950/30' : res.borderColor
                }`}
                title={`${res.label}: ${res.value} points`}
              >
                <div className="flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${res.color}`} />
                  <span className="text-[10px] uppercase font-mono text-slate-400 hidden lg:inline">
                    {res.label}
                  </span>
                  <span className={`font-mono text-xs font-bold ${res.color}`}>
                    {res.value}
                  </span>
                </div>

                {/* Progress Mini Bar (0 - 100) */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${res.bgColor}`}
                    style={{ width: `${Math.max(0, Math.min(100, res.value))}%` }}
                  />
                </div>

                {/* Delta Badge Animation */}
                {res.delta !== undefined && res.delta !== 0 && (
                  <span
                    className={`absolute -bottom-3 text-[10px] font-mono font-bold px-1 rounded shadow ${
                      res.delta > 0 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {res.delta > 0 ? `+${res.delta}` : res.delta}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAudio}
            className="p-1.5 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-cyan-glow border border-space-border transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-amber-400 border border-space-border transition-colors"
            title="Restart Mission"
            aria-label="Restart Mission"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
