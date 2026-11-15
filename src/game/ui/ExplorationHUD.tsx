/**
 * Enhanced Exploration HUD — Sci-Fi Command Cockpit & Interactive Tactical Dock.
 * Features:
 * - Redesigned top telemetry bar with 1-click language toggle [EN / عربي]
 * - Fully interactive, clickable bottom command dock with keycap badges
 * - Responsive mouse, touch, and keyboard support
 * - Dynamic interaction highlighting when near station modules
 * - Natural Arabic typography without monospaced letter disconnections
 */

'use client';

import React from 'react';
import {
  MapPin,
  Package,
  Pause,
  BookOpen,
  Move,
  KeyRound,
  User,
  Radio,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType } from '@/game/types';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import { audio } from '@/lib/audio/audio-manager';
import StationMinimap from './StationMinimap';

export default function ExplorationHUD() {
  const {
    currentRoom,
    inventory,
    phase,
    playerGender,
    playerName,
    showInteractionPrompt,
    interactionTarget,
    language,
    setLanguage,
    toggleInventory,
    togglePause,
    toggleCodex,
    toggleProfile,
    toggleMinimap,
    isMinimapOpen,
  } = useGameStore();

  const t = TRANSLATIONS[language || 'en'];
  const room = getRoomDefinition(currentRoom);

  // Localized room name with natural typography
  const localizedRoomName = React.useMemo(() => {
    if (language === 'ar') {
      const roomMap: Record<string, string> = {
        hallway: t.centralHub,
        'command-center': t.commandCenter,
        hangar: t.vehicleHangar,
        'science-lab': t.scienceLab,
        'comms-array': t.commsArray,
        'resource-bay': t.resourceBay,
        'mission-board': t.missionBoard,
      };
      return roomMap[currentRoom] || room.name;
    }
    return room.name.toUpperCase();
  }, [currentRoom, language, room.name, t]);

  if (phase !== 'exploring') return null;

  const totalItems = Object.values(inventory.items).reduce((a, b) => a + b, 0);
  const avatarSrc =
    playerGender === 'female'
      ? '/assets/characters/player-female.png'
      : '/assets/characters/player.png';

  const isArabic = language === 'ar';

  return (
    <>
      {/* ================================================================== */}
      {/* TOP COMMAND BAR                                                    */}
      {/* ================================================================== */}
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none">
        <div className="flex items-center justify-between px-3 sm:px-5 py-3">
          {/* Left: Current Station Module */}
          <div className="glass-panel rounded-xl px-3.5 py-2 flex items-center gap-2.5 pointer-events-auto border border-cyan-500/40 shadow-glow-cyan bg-space-950/90">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span
              className={`text-sm text-cyan-200 tracking-wide font-bold ${
                isArabic ? 'font-sans' : 'font-mono'
              }`}
            >
              {localizedRoomName}
            </span>
          </div>

          {/* Center: Mission Brand / Telemetry */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-space-950/80 border border-space-border/50">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-xs tracking-[0.25em] text-cyan-300/80 font-bold">
              NOVASCRIPT // ORBITAL ALPHA
            </span>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* 1-Click Instant Language Switcher */}
            <button
              onClick={() => {
                audio.select();
                setLanguage(isArabic ? 'en' : 'ar');
              }}
              className="glass-panel rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:border-cyan-400 transition-all border border-cyan-500/30 hover:scale-105 active:scale-95 shadow-glow-cyan bg-space-950/90 text-cyan-300 font-bold text-xs"
              title="Toggle English / Arabic (تبديل اللغة)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Astronaut Profile Button */}
            <button
              onClick={() => {
                audio.click();
                toggleProfile();
              }}
              className="glass-panel rounded-xl px-2.5 py-1.5 flex items-center gap-2 hover:border-cyan-400 transition-all border border-cyan-500/30 group hover:scale-105 active:scale-95 bg-space-950/90"
              title={`${t.profile} [P]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-contain pixel-art drop-shadow group-hover:scale-110 transition-transform"
              />
              <span
                className={`hidden md:inline text-xs text-cyan-300 font-bold max-w-[100px] truncate ${
                  isArabic ? 'font-sans' : 'font-mono'
                }`}
              >
                {playerName}
              </span>
              <span className="hidden sm:inline font-mono text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                P
              </span>
            </button>

            {/* Materials Inventory Button */}
            <button
              onClick={() => {
                audio.click();
                toggleInventory();
              }}
              className="glass-panel rounded-xl px-3 py-1.5 flex items-center gap-2 hover:border-amber-400 transition-all border border-amber-500/30 hover:scale-105 active:scale-95 bg-space-950/90"
              title={`${t.inventory} [I]`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold text-amber-300">{totalItems}</span>
              <span className="hidden sm:inline font-mono text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                I
              </span>
            </button>

            {/* Space Handbook Encyclopedia Button */}
            <button
              onClick={() => {
                audio.click();
                toggleCodex();
              }}
              className="glass-panel rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:border-cyan-400 transition-all border border-cyan-500/30 hover:scale-105 active:scale-95 bg-space-950/90"
              title={`${t.info} [Tab]`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span
                className={`hidden sm:inline text-xs text-cyan-300 font-bold ${
                  isArabic ? 'font-sans' : 'font-mono'
                }`}
              >
                {t.info}
              </span>
              <span className="hidden sm:inline font-mono text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                TAB
              </span>
            </button>

            {/* Pause Menu Button */}
            <button
              onClick={() => {
                audio.click();
                togglePause();
              }}
              className="glass-panel rounded-xl p-2 hover:border-cyan-400 transition-all border border-space-border/60 hover:scale-105 active:scale-95 bg-space-950/90"
              title={`${t.pause} [Esc]`}
            >
              <Pause className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* FLOATING ACTION PROMPT (WHEN NEAR AN OBJECT)                        */}
      {/* ================================================================== */}
      {showInteractionPrompt && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-auto select-none">
          <button
            onClick={() => {
              audio.click();
              window.dispatchEvent(new CustomEvent('novascript:interact'));
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white text-xs font-bold shadow-glow-cyan border-2 border-cyan-300 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Click or Double-Click / Tap to interact"
          >
            <KeyRound className="w-4 h-4 text-cyan-100 animate-pulse" />
            <span className={isArabic ? 'font-sans font-bold text-sm' : 'font-mono font-bold'}>
              {t.doubleClickPrompt}
            </span>
          </button>
        </div>
      )}

      {/* ================================================================== */}
      {/* INTERACTIVE FLOATING TACTICAL COMMAND DOCK                          */}
      {/* ================================================================== */}
      <div className="fixed bottom-2.5 left-0 right-0 z-30 pointer-events-none select-none flex justify-center px-3">
        <div className="glass-panel rounded-2xl px-3 py-1.5 flex items-center gap-1.5 sm:gap-2.5 text-xs border border-cyan-500/30 bg-space-950/95 backdrop-blur-md shadow-2xl pointer-events-auto">
          {/* Movement hint */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-space-900/60 text-slate-400 border border-space-border/40">
            <Move className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className={`text-[11px] ${isArabic ? 'font-sans' : 'font-mono'}`}>
              {t.controlsMove}
            </span>
          </div>

          <div className="w-[1px] h-4 bg-space-border/40" />

          {/* Interactive Interact button */}
          <button
            onClick={() => {
              audio.click();
              window.dispatchEvent(new CustomEvent('novascript:interact'));
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              showInteractionPrompt
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-glow-amber animate-pulse'
                : 'bg-space-900 hover:bg-space-800 text-slate-300 border border-space-border/40'
            }`}
            title="Interact with nearby console or portal [E]"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className={`text-[11px] font-bold ${isArabic ? 'font-sans' : 'font-mono'}`}>
              {t.controlsInteract}
            </span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-400/40">
              E
            </span>
          </button>

          {/* Interactive Inventory button */}
          <button
            onClick={() => {
              audio.click();
              toggleInventory();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-space-border/40"
            title="Open Materials Inventory [I]"
          >
            <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className={`text-[11px] font-bold ${isArabic ? 'font-sans' : 'font-mono'}`}>
              {t.controlsInventory}
            </span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-400/40">
              I
            </span>
          </button>

          {/* Interactive Profile button */}
          <button
            onClick={() => {
              audio.click();
              toggleProfile();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-space-border/40"
            title="Open Commander Profile [P]"
          >
            <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className={`text-[11px] font-bold ${isArabic ? 'font-sans' : 'font-mono'}`}>
              {t.controlsProfile}
            </span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-cyan-300 border border-cyan-400/40">
              P
            </span>
          </button>

          {/* Interactive Radar button */}
          <button
            onClick={() => {
              audio.click();
              toggleMinimap();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-space-900 hover:bg-space-800 text-cyan-300 hover:text-white transition-all cursor-pointer border border-space-border/40"
            title="Toggle Orbital Station Radar [M]"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className={`text-[11px] font-bold ${isArabic ? 'font-sans' : 'font-mono'}`}>
              {t.controlsRadar}
            </span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-cyan-300 border border-cyan-400/40">
              M
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ORBITAL STATION RADAR MINIMAP                                       */}
      {/* ================================================================== */}
      <StationMinimap />

      {/* ================================================================== */}
      {/* COLLECTED RESOURCES MINI-BAR (BOTTOM-LEFT)                         */}
      {/* ================================================================== */}
      <div className="fixed bottom-14 left-4 z-30 pointer-events-none select-none">
        <div className="flex gap-1.5">
          {(Object.entries(inventory.items) as [CollectibleType, number][])
            .filter(([, count]) => count > 0)
            .map(([type, count]) => {
              const info = COLLECTIBLE_INFO[type];
              const localizedLabel =
                language === 'ar'
                  ? type === 'metal-scrap'
                    ? t.metalScrap
                    : type === 'energy-cell'
                    ? t.energyCell
                    : type === 'science-sample'
                    ? t.scienceSample
                    : type === 'blueprint-fragment'
                    ? t.blueprintFragment
                    : t.rareMineral
                  : info.label;

              return (
                <div
                  key={type}
                  className="glass-panel rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 border border-cyan-900/50 bg-space-950/90 shadow-lg"
                  title={`${localizedLabel}: ${count}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="font-mono text-xs font-bold" style={{ color: info.color }}>
                    {count}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
