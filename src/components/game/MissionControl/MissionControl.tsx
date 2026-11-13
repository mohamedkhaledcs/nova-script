'use client';

import React from 'react';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import type { Resources } from '@/types/game';

interface MissionControlProps {
  initialResources: Resources;
  onProceedToPlanning: () => void;
}

export default function MissionControl({
  initialResources,
  onProceedToPlanning,
}: MissionControlProps) {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 deep-space-bg stars-pattern select-none">
      <div className="max-w-4xl w-full glass-panel rounded-2xl border border-cyan-500/30 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        {/* Left Column: Pixel Art Astronaut Avatar */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* Halo Glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />

            {/* Astronaut Avatar Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/characters/player.png"
              alt="Mission Commander"
              width={220}
              height={220}
              className="relative z-10 pixel-art animate-float drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              draggable={false}
            />
          </div>

          <div className="mt-3 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase">
            COMMANDER ON DECK
          </div>
        </div>

        {/* Right Column: Mission Briefing Narrative & Resource Allocation */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              FLIGHT OPERATIONS CENTER // DIRECTIVE 01
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              MISSION BRIEFING
            </h2>

            <div className="mt-4 p-4 rounded-xl bg-space-900/90 border border-space-border/60 text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-light">
              <p>
                Welcome to Mission Control, Commander! Your engineering team is assembled and ready to design, launch, and operate a brand-new robotic space exploration probe.
              </p>
              <p>
                Every engineering trade-off you approve will directly alter your probe&apos;s structural mass, electrical power margins, communications capability, and scientific return.
              </p>
            </div>

            {/* Initial Resource Allocation Summary */}
            <div className="mt-5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Baseline Resource Allocation (Normalized Points):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded bg-space-950/80 border border-amber-500/30 text-amber-400">
                  <div className="text-[10px] text-slate-400">BUDGET</div>
                  <div className="font-bold text-sm">{initialResources.budget}</div>
                </div>
                <div className="p-2 rounded bg-space-950/80 border border-purple-500/30 text-purple-400">
                  <div className="text-[10px] text-slate-400">MASS</div>
                  <div className="font-bold text-sm">{initialResources.mass}</div>
                </div>
                <div className="p-2 rounded bg-space-950/80 border border-yellow-500/30 text-yellow-400">
                  <div className="text-[10px] text-slate-400">POWER</div>
                  <div className="font-bold text-sm">{initialResources.power}</div>
                </div>
                <div className="p-2 rounded bg-space-950/80 border border-cyan-500/30 text-cyan-400">
                  <div className="text-[10px] text-slate-400">SCIENCE</div>
                  <div className="font-bold text-sm">{initialResources.scientific_value}</div>
                </div>
                <div className="p-2 rounded bg-space-950/80 border border-emerald-500/30 text-emerald-400 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400">COMMS</div>
                  <div className="font-bold text-sm">{initialResources.communication}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Proceed Action Button */}
          <div className="mt-8">
            <button
              onClick={() => {
                audio.success();
                onProceedToPlanning();
              }}
              onMouseEnter={() => audio.hover()}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold tracking-wider shadow-glow-cyan transition-all duration-200 flex items-center justify-center gap-3 text-sm sm:text-base"
            >
              <Rocket className="w-5 h-5 text-cyan-200" />
              <span>ACCEPT MANDATE & BEGIN MISSION PLANNING</span>
              <CheckCircle2 className="w-5 h-5 text-cyan-300 ml-auto hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
