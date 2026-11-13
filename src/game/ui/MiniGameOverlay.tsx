/**
 * Mini-game overlay system.
 * Renders interactive mini-games and station subsystem displays:
 * - Antenna Alignment (Deep Space Network frequency calibration)
 * - Sample Spectrometer (Multispectral mineral analysis)
 * - 3D Spacecraft Inspection Bay (Modular vehicle inspector with OrbitControls)
 * - Station Terminals and Observation Displays
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  X,
  Monitor,
  Satellite,
  Rocket,
  Search,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Microscope,
  RotateCw,
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { audio } from '@/lib/audio/audio-manager';

// Dynamically import 3D viewer to avoid SSR issues
const Spacecraft3DViewer = dynamic(
  () => import('@/game/hangar/Spacecraft3DViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 flex items-center justify-center bg-space-950 font-mono text-xs text-amber-400">
        INITIALIZING 3D TELEMETRY MATRIX...
      </div>
    ),
  }
);

export default function MiniGameOverlay() {
  const { activeMiniGame, setActiveMiniGame, setPhase } = useGameStore();

  if (!activeMiniGame) return null;

  const handleClose = () => {
    audio.click();
    setActiveMiniGame(null);
    setPhase('exploring');
  };

  const getContent = () => {
    if (activeMiniGame.startsWith('terminal-')) {
      return <TerminalView onClose={handleClose} />;
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
      return <DisplayView onClose={handleClose} />;
    }
    return <GenericView onClose={handleClose} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {getContent()}
    </div>
  );
}

// ================================================================
// 1. Station Terminal
// ================================================================

function TerminalView({ onClose }: { onClose: () => void }) {
  const lines = [
    '> NOVASCRIPT ORBITAL HUB // LINUX KERNEL 6.8.0-DEEPSPACE',
    '> Station Telemetry: NOMINAL | Atmospheric Loop: 101.3 kPa (N2/O2 78:21)',
    '> Power Generation: 48.6 kW (Photovoltaic + Stirling Auxiliary)',
    '> Communications Relay: DSN Goldstone / Madrid / Canberra connected',
    '',
    '> [MISSION CONTROL NOTIFICATION]',
    '> Exploration Phase: Space Station Systems Operational.',
    '> Navigate to the MISSION BOARD to select your deep-space objective.',
    '> Visit the ASSEMBLY HANGAR to view and upgrade the robotic spacecraft.',
    '> Collect salvaged components to craft cosmetic modifications at the workbench.',
  ];

  return (
    <div className="max-w-2xl w-full glass-panel rounded-2xl border border-cyan-500/50 shadow-glow-cyan overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-cyan-700/50">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-cyan-300 font-bold tracking-wider">
            STATION TELEMETRY CONSOLE
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 font-mono text-xs sm:text-sm text-emerald-400 bg-space-950 min-h-[280px] space-y-1.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line || '\u00A0'}
          </div>
        ))}
        <div className="mt-3 text-cyan-400 animate-pulse">{'> ALL SYSTEMS GO _'}</div>
      </div>

      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs tracking-wider transition-colors"
        >
          DISMISS [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// 2. Interactive Antenna Alignment (DSN X-Band Frequency Calibration)
// ================================================================

function AntennaView({ onClose }: { onClose: () => void }) {
  const { collectItem } = useGameStore();
  const targetFreq = 8.415; // 8.415 GHz DSN X-Band Downlink
  const [freq, setFreq] = useState(7.85);
  const [locked, setLocked] = useState(false);

  // Compute signal strength (Gaussian curve around targetFreq)
  const signalStrength = useMemo(() => {
    const diff = Math.abs(freq - targetFreq);
    const score = Math.max(0, 100 * Math.exp(-Math.pow(diff / 0.18, 2)));
    return Math.round(score);
  }, [freq]);

  const handleTune = (delta: number) => {
    if (locked) return;
    setFreq((prev) => Math.round(Math.max(7.2, Math.min(9.5, prev + delta)) * 1000) / 1000);
  };

  const handleLockSignal = () => {
    if (signalStrength >= 90 && !locked) {
      setLocked(true);
      audio.success();
      collectItem('energy-cell', 2);
    }
  };

  return (
    <div className="max-w-xl w-full glass-panel rounded-2xl border border-emerald-500/50 shadow-glow-green overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-emerald-700/50">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-sm text-emerald-300 font-bold tracking-wider">
            DEEP SPACE NETWORK // ANTENNA CALIBRATION
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Signal Oscilloscope Visualizer */}
        <div className="w-full h-36 rounded-xl bg-space-950 border border-emerald-500/30 p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10">
            <span>BAND: X-BAND (7.0 - 9.5 GHz)</span>
            <span>TARGET: {targetFreq.toFixed(3)} GHz</span>
            <span className={signalStrength >= 90 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              SNR: +{(signalStrength * 0.28).toFixed(1)} dB
            </span>
          </div>

          {/* Dynamic Waveform Bars */}
          <div className="flex items-end justify-between gap-1 h-20 z-10">
            {Array.from({ length: 32 }).map((_, i) => {
              const barHeight = Math.min(
                100,
                Math.max(
                  10,
                  (signalStrength / 100) * (30 + Math.sin(i * 0.4 + freq * 10) * 35 + 25)
                )
              );
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-t transition-all duration-75 ${
                    locked
                      ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                      : signalStrength >= 90
                      ? 'bg-cyan-400'
                      : 'bg-emerald-800'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
              );
            })}
          </div>

          {/* Target Frequency Marker Line */}
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500/20" />
        </div>

        {/* Frequency & Signal Readouts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-space-900 border border-space-border/60 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Tuned Frequency</span>
            <div className="text-2xl font-bold text-cyan-300 mt-0.5">{freq.toFixed(3)} GHz</div>
          </div>
          <div className="p-3 rounded-lg bg-space-900 border border-space-border/60 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Signal Alignment</span>
            <div
              className={`text-2xl font-bold mt-0.5 ${
                signalStrength >= 90 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
              }`}
            >
              {signalStrength}%
            </div>
          </div>
        </div>

        {/* Tuning Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Coarse & Fine Frequency Calibration:</span>
            <span>Target: 8.415 GHz</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTune(-0.1)}
              disabled={locked}
              className="flex-1 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-space-border font-mono text-xs text-slate-200 disabled:opacity-40"
            >
              -0.10
            </button>
            <button
              onClick={() => handleTune(-0.01)}
              disabled={locked}
              className="flex-1 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-space-border font-mono text-xs text-slate-200 disabled:opacity-40"
            >
              -0.01
            </button>
            <button
              onClick={() => handleTune(0.01)}
              disabled={locked}
              className="flex-1 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-space-border font-mono text-xs text-slate-200 disabled:opacity-40"
            >
              +0.01
            </button>
            <button
              onClick={() => handleTune(0.1)}
              disabled={locked}
              className="flex-1 py-2 rounded-lg bg-space-900 hover:bg-space-800 border border-space-border font-mono text-xs text-slate-200 disabled:opacity-40"
            >
              +0.10
            </button>
          </div>
        </div>

        {/* Action Button */}
        {locked ? (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center gap-2 font-mono text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            CARRIER LOCKED // +2 ENERGY CELLS AWARDED
          </div>
        ) : (
          <button
            onClick={handleLockSignal}
            disabled={signalStrength < 90}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider transition-all ${
              signalStrength >= 90
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-green'
                : 'bg-space-900 text-slate-500 border border-space-border cursor-not-allowed'
            }`}
          >
            {signalStrength >= 90 ? 'ESTABLISH CARRIER LOCK' : 'ALIGN SIGNAL ABOVE 90%'}
          </button>
        )}
      </div>

      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-right">
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white">
          DISCONNECT [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// 3. Interactive Sample Spectrometer
// ================================================================

function ScannerView({ onClose }: { onClose: () => void }) {
  const { collectItem } = useGameStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [sampleType, setSampleType] = useState<'basalt' | 'regolith' | 'ice'>('basalt');

  const SAMPLES = {
    basalt: {
      name: 'Lunar Mare Basalt Specimen',
      composition: 'Pyroxene 48%, Plagioclase 32%, Ilmenite (FeTiO3) 14%, Olivine 6%',
      density: '3.3 g/cm³',
      notes: 'Formed from ancient basaltic volcanic lava flows on the lunar maria.',
    },
    regolith: {
      name: 'Martian Iron-Oxide Regolith',
      composition: 'Silica (SiO2) 44%, Iron Oxides (Fe2O3) 18%, Magnesium Oxide 9%, Sulfates 6%',
      density: '2.6 g/cm³',
      notes: 'Fine iron-rich silicate dust weathered by wind-driven physical attrition.',
    },
    ice: {
      name: 'Permanently Shadowed Crater Volatiles',
      composition: 'H2O Ice 86%, Carbon Dioxide (CO2) 8%, Ammonia 3%, Organics 3%',
      density: '0.92 g/cm³',
      notes: 'Trapped cryogenic volatiles inside ultra-cold lunar polar crater basins.',
    },
  };

  const currentSample = SAMPLES[sampleType];

  const handleStartAnalysis = () => {
    if (analyzing || analyzed) return;
    setAnalyzing(true);
    audio.hover();

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      audio.success();
      collectItem('science-sample', 2);
    }, 1800);
  };

  return (
    <div className="max-w-xl w-full glass-panel rounded-2xl border border-cyan-500/50 shadow-glow-cyan overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-cyan-700/50">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-cyan-300 font-bold tracking-wider">
            RAMAN & MULTISPECTRAL SPECTROMETER
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Sample Selectors */}
        <div className="flex gap-2">
          {(['basalt', 'regolith', 'ice'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSampleType(type);
                setAnalyzed(false);
              }}
              className={`flex-1 py-1.5 rounded-lg font-mono text-xs capitalize transition-colors ${
                sampleType === type
                  ? 'bg-cyan-700 text-white font-bold'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-space-border/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Laser Sweep Chamber */}
        <div className="w-full h-40 rounded-xl bg-space-950 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
          {/* Laser beam line */}
          {analyzing && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF] animate-pulse" />
          )}

          {/* Sample disk */}
          <div className="w-24 h-24 rounded-full border border-cyan-400/40 bg-space-900/80 flex items-center justify-center relative shadow-inner">
            <span className="text-3xl">
              {sampleType === 'basalt' ? '🪨' : sampleType === 'regolith' ? '🪐' : '🧊'}
            </span>
          </div>

          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
            EXCITATION LASER: 532 nm (Nd:YAG)
          </div>
        </div>

        {/* Analysis Results Display */}
        <div className="p-4 rounded-xl bg-space-900/90 border border-space-border/60 font-mono space-y-1.5">
          <div className="text-xs font-bold text-cyan-300">{currentSample.name}</div>
          <div className="text-[11px] text-slate-300">
            <span className="text-slate-400">Composition:</span> {currentSample.composition}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Bulk Density:</span> {currentSample.density}
          </div>
          <div className="text-[11px] text-slate-400 italic mt-1">{currentSample.notes}</div>
        </div>

        {/* Action Button */}
        {analyzed ? (
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center gap-2 font-mono text-xs text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            SPECTRAL SIGNATURE RECORDED // +2 SCIENCE SAMPLES
          </div>
        ) : (
          <button
            onClick={handleStartAnalysis}
            disabled={analyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider shadow-glow-cyan disabled:opacity-50 transition-all"
          >
            {analyzing ? 'ACQUIRING SPECTRAL DATA...' : 'FIRE EXCITATION LASER'}
          </button>
        )}
      </div>

      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-right">
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white">
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// 4. Spacecraft 3D Assembly Bay Viewer
// ================================================================

function SpacecraftView({ onClose }: { onClose: () => void }) {
  const [craftedList, setCraftedList] = useState<string[]>([]);
  const [selectedSubsystem, setSelectedSubsystem] = useState<
    'bus' | 'power' | 'comms' | 'propulsion' | 'science'
  >('bus');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('novascript_crafted_v1');
      if (saved) setCraftedList(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const hasGoldenHull = craftedList.includes('cosmetic-golden-hull');
  const hasPlasmaThrusters = craftedList.includes('cosmetic-plasma-thrusters');
  const hasAntennaUpgrade = craftedList.includes('cosmetic-antenna-upgrade');
  const hasScienceModule = craftedList.includes('cosmetic-science-module');

  const subsystemDescriptions = {
    bus: {
      name: 'Equipment Bus & Thermal Protection',
      detail: hasGoldenHull
        ? 'Reinforced aerospace composite chassis coated in high-emissivity Golden MLI thermal blankets.'
        : 'Standard aerospace-grade titanium-aluminum alloy frame with passive thermal coatings.',
    },
    power: {
      name: 'Electrical Power Subsystem (EPS)',
      detail: 'Ultra-Triple-Junction GaAs photovoltaic deployable solar arrays with Li-ion storage buffers.',
    },
    comms: {
      name: 'Telecommunications Subsystem',
      detail: hasAntennaUpgrade
        ? 'High-gain steerable parabolic reflector tuned for DSN X-band and Ka-band carrier communications.'
        : 'Standard parabolic high-gain dish antenna with redundant low-gain omnidirectional backup horns.',
    },
    propulsion: {
      name: 'Propulsion & Attitude Control (ADCS)',
      detail: hasPlasmaThrusters
        ? 'Electrostatic Hall-effect plasma thrusters providing ultra-high specific impulse (Isp ~ 3000s).'
        : 'Monopropellant hydrazine catalytic reaction chambers with cold-gas RCS attitude control thrusters.',
    },
    science: {
      name: 'Payload & Scientific Instruments',
      detail: hasScienceModule
        ? 'Integrated pressurized science laboratory module with Raman spectrometer and high-resolution imager.'
        : 'Core planetary exploration sensor suite with magnetometer boom and thermal radiometer.',
    },
  };

  const activeSubsystem = subsystemDescriptions[selectedSubsystem];

  return (
    <div className="max-w-3xl w-full glass-panel rounded-2xl border border-amber-500/50 shadow-glow-amber overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-amber-700/50">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-sm text-amber-300 font-bold tracking-wider">
            SPACECRAFT ASSEMBLY BAY // 3D VEHICLE INSPECTION
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Interactive 3D Spacecraft Canvas */}
        <div className="w-full h-72 rounded-xl overflow-hidden border border-amber-500/30">
          <Spacecraft3DViewer
            hasGoldenHull={hasGoldenHull}
            hasPlasmaThrusters={hasPlasmaThrusters}
            hasAntennaUpgrade={hasAntennaUpgrade}
            hasScienceModule={hasScienceModule}
          />
        </div>

        {/* Subsystem Inspection Selectors */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['bus', 'Structure & Hull'],
              ['power', 'Power / Solar'],
              ['comms', 'Comms Dish'],
              ['propulsion', 'Propulsion'],
              ['science', 'Science Bay'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedSubsystem(key)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                selectedSubsystem === key
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-space-border/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Subsystem Details Card */}
        <div className="p-3.5 rounded-xl bg-space-950/80 border border-space-border/60 font-mono text-xs">
          <div className="text-amber-300 font-bold mb-1">{activeSubsystem.name}</div>
          <div className="text-slate-300 leading-relaxed">{activeSubsystem.detail}</div>
        </div>

        {/* Active Upgrades Installed Badge List */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Crafted Upgrades Active:</span>
          {craftedList.length === 0 ? (
            <span className="text-slate-500 italic">None (visit Hangar Workbench to craft)</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {hasGoldenHull && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                  Golden Hull
                </span>
              )}
              {hasPlasmaThrusters && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  Plasma Thrusters
                </span>
              )}
              {hasAntennaUpgrade && (
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700/50">
                  High-Gain Dish
                </span>
              )}
              {hasScienceModule && (
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/50">
                  Science Module
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-right">
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white">
          CLOSE HANGAR BAY [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// 5. Station Observation Display
// ================================================================

function DisplayView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-lg w-full glass-panel rounded-2xl border border-blue-500/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-space-900 border-b border-blue-700/50">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm text-blue-300 font-bold tracking-wider">
            OBSERVATION DECK // FLIGHT STATUS
          </span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 text-sm text-slate-300 space-y-3 font-light leading-relaxed">
        <p>
          You are aboard the <strong className="text-cyan-300 font-mono">NovaScript Orbital Station</strong>.
        </p>
        <p>
          From this vantage, engineers design and simulate deep-space missions across all 8 systems engineering stages:
          Mission Planning, Spacecraft Design, Science Payload, Orbit Selection, Comms, Resource Ops, Launch Planning, and Flight Operations.
        </p>
        <div className="p-3 rounded-lg bg-space-950 border border-blue-800/30 text-xs text-slate-400 font-mono">
          <strong>Tip:</strong> Click on the ground or use WASD/Arrows to walk. Collect materials and check the Codex (Tab) to review systems engineering takeaways.
        </div>
      </div>
      <div className="px-4 py-3 bg-space-900 border-t border-space-border/50 text-right">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs tracking-wider"
        >
          CLOSE [ESC]
        </button>
      </div>
    </div>
  );
}

// ================================================================
// Fallback
// ================================================================

function GenericView({ onClose }: { onClose: () => void }) {
  return (
    <div className="max-w-sm w-full glass-panel rounded-2xl border border-slate-500/50 p-6 text-center">
      <p className="text-slate-300 text-sm mb-4">Subsystem offline or undergoing calibration.</p>
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs"
      >
        CLOSE
      </button>
    </div>
  );
}
