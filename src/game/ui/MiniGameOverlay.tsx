/**
 * Mini-game overlay system.
 * Renders the appropriate mini-game or terminal view based on activeMiniGame state.
 */

'use client';

import React from 'react';
import { X, Monitor, Satellite, Rocket, Search } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { audio } from '@/lib/audio/audio-manager';

export default function MiniGameOverlay() {
  const { activeMiniGame, setActiveMiniGame, setPhase } = useGameStore();

  if (!activeMiniGame) return null;

  const handleClose = () => {
    audio.click();
    setActiveMiniGame(null);
    setPhase('exploring');
  };

  // Determine content based on mini-game type
  const getContent = () => {
    if (activeMiniGame.startsWith('terminal-')) {
      return <TerminalView id={activeMiniGame} onClose={handleClose} />;
    }
    if (activeMiniGame === 'scanner') {
      return <ScannerView onClose={handleClose} />;
    }
    if (activeMiniGame === 'antenna') {
      return <AntennaView onClose={handleClose} />;
    }
    if (activeMiniGame === 'spacecraft-viewer') {
      return <SpacecraftView onClose={handleClose} />;
    }
    if (activeMiniGame.startsWith('display-')) {
      return <DisplayView id={activeMiniGame} onClose={handleClose} />;
    }
    return <GenericView onClose={handleClose} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {getContent()}
    </div>
  );
}

// ================================================================
// Terminal View
// ================================================================

function TerminalView({ id, onClose }: { id: string; onClose: () => void }) {
  const lines = [
    '> STATION TERMINAL v3.2.1',
    '> System Status: OPERATIONAL',
    '> Hull Integrity: 98.7%',
    '> Atmospheric Pressure: 101.3 kPa',
    '> Power Grid: NOMINAL',
    '> Next scheduled maintenance: 72h',
    '',
    '> Crew manifest loaded...',
    '> Mission Commander: [YOU]',
    '> Status: READY FOR MISSION ASSIGNMENT',
    '',
    '> Visit the MISSION BOARD to begin',
    '> your space mission assignment.',
  ];

  return (
    <div className="max-w-2xl w-full glass-panel rounded-2xl border border-cyan-500/50 shadow-glow-cyan overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-cyan-700/50">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-cyan-300 font-bold tracking-wider">
            STATION TERMINAL
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 font-mono text-sm text-green-400 bg-space-950 min-h-[300px]">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line || '\u00A0'}
          </div>
        ))}
        <div className="mt-2 text-cyan-400 animate-pulse">{'> _'}</div>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs tracking-wider"
        >
          CLOSE TERMINAL [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Scanner Mini-Game
// ================================================================

function ScannerView({ onClose }: { onClose: () => void }) {
  const { collectItem } = useGameStore();

  const handleScan = () => {
    audio.success();
    collectItem('science-sample', 1);
  };

  return (
    <div className="max-w-lg w-full glass-panel rounded-2xl border border-cyan-500/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-cyan-700/50">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-cyan-300 font-bold tracking-wider">
            SAMPLE ANALYZER
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-48 h-48 rounded-full border-2 border-cyan-500/40 flex items-center justify-center relative overflow-hidden bg-space-950">
          {/* Scanning sweep line */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent animate-pulse" />
          <Search className="w-12 h-12 text-cyan-400/60" />
        </div>
        <p className="text-sm text-slate-300 text-center">
          Analyze planetary samples to extract scientific data.
          <br />
          Each scan yields valuable research material.
        </p>
        <button
          onClick={handleScan}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold tracking-wider"
        >
          RUN ANALYSIS
        </button>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-center">
        <button
          onClick={onClose}
          className="text-xs font-mono text-slate-400 hover:text-white"
        >
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Antenna Alignment
// ================================================================

function AntennaView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-lg w-full glass-panel rounded-2xl border border-emerald-500/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-emerald-700/50">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-sm text-emerald-300 font-bold tracking-wider">
            ANTENNA ALIGNMENT
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-full h-32 rounded-xl bg-space-950 border border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
          {/* Signal visualization */}
          <div className="flex items-end gap-1 h-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-emerald-400/60 rounded-t animate-pulse"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 20}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-300 text-center">
          Deep Space Network signal locked.
          <br />
          Communication channel is clear for mission data relay.
        </p>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs tracking-wider"
        >
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Spacecraft Viewer
// ================================================================

function SpacecraftView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-2xl w-full glass-panel rounded-2xl border border-amber-500/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-amber-700/50">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-sm text-amber-300 font-bold tracking-wider">
            SPACECRAFT ASSEMBLY BAY
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-full h-64 rounded-xl bg-space-950 border border-amber-500/20 flex items-center justify-center relative overflow-hidden">
          {/* Simplified spacecraft visualization */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-8 bg-amber-500/60 rounded-t-full" />
            <div className="w-12 h-16 bg-slate-400/40 rounded-lg border border-amber-400/30" />
            <div className="w-20 h-3 bg-blue-400/30 rounded" />
            <div className="w-6 h-10 bg-amber-600/40 rounded-b-lg" />
            <div className="w-8 h-4 bg-orange-400/30 animate-pulse rounded-b-full" />
          </div>
        </div>
        <p className="text-sm text-slate-300 text-center">
          Your spacecraft awaits configuration. Begin a mission from the
          <strong className="text-amber-300"> Mission Board</strong> to make
          engineering decisions that shape this vehicle.
        </p>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-mono text-xs tracking-wider"
        >
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Display Screen
// ================================================================

function DisplayView({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <div className="max-w-lg w-full glass-panel rounded-2xl border border-blue-500/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-blue-700/50">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm text-blue-300 font-bold tracking-wider">
            INFORMATION DISPLAY
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 text-sm text-slate-300 space-y-3">
        <p>
          Welcome to <strong className="text-cyan-300">NovaScript Station</strong>.
        </p>
        <p>
          This orbital platform serves as mission control for deep-space robotic
          exploration missions to the Moon and Mars.
        </p>
        <p>
          Explore the station to find resources, review equipment, and prepare for
          your mission. When ready, visit the <strong className="text-indigo-300">Mission Board</strong> to
          select your target and begin the engineering design process.
        </p>
        <div className="p-3 rounded-lg bg-space-950 border border-blue-800/30 text-xs text-slate-400">
          <strong>Tip:</strong> Collect materials scattered around the station. Visit the 
          Hangar workbench to craft cosmetic upgrades for your spacecraft.
        </div>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs tracking-wider"
        >
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Generic fallback
// ================================================================

function GenericView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-sm w-full glass-panel rounded-2xl border border-slate-500/50 p-6 text-center">
      <p className="text-slate-300 text-sm mb-4">This system is currently inactive.</p>
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
      >
        CLOSE
      </button>
    </div>
  );
}
