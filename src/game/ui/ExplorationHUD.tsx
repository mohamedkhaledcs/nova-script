/**
 * Exploration HUD — overlay UI shown during the exploration phase.
 * Displays room name, mini resource indicators, inventory shortcut, and controls hint.
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
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType } from '@/game/types';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import StationMinimap from './StationMinimap';

export default function ExplorationHUD() {
  const {
    currentRoom,
    inventory,
    phase,
    playerGender,
    playerName,
    showInteractionPrompt,
    language,
    toggleInventory,
    togglePause,
    toggleCodex,
    toggleProfile,
  } = useGameStore();

  const t = TRANSLATIONS[language || 'en'];
  const room = getRoomDefinition(currentRoom);

  // Localized room name
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

  return (
    <>
      {/* Top bar — room info */}
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Room name */}
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2 pointer-events-auto">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm text-cyan-300 tracking-wider font-bold">
              {localizedRoomName}
            </span>
          </div>

          {/* Center: NOVASCRIPT brand */}
          <div className="hidden sm:block">
            <span className="font-mono text-xs tracking-[0.3em] text-cyan-glow/60 font-bold">
              NOVASCRIPT
            </span>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Commander Profile Button */}
            <button
              onClick={toggleProfile}
              className="glass-panel rounded-lg px-2.5 py-1.5 flex items-center gap-2 hover:border-cyan-400 transition-colors border border-cyan-500/30 group"
              title={`${t.profile} [P]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-contain pixel-art drop-shadow group-hover:scale-110 transition-transform"
              />
              <span className="hidden md:inline font-mono text-xs text-cyan-300 font-bold max-w-[100px] truncate">
                {playerName}
              </span>
            </button>

            <button
              onClick={toggleInventory}
              className="glass-panel rounded-lg px-3 py-2 flex items-center gap-2 hover:border-cyan-400 transition-colors border border-transparent"
              title={`${t.inventory} [I]`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-slate-300">{totalItems}</span>
            </button>
            <button
              onClick={toggleCodex}
              className="glass-panel rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 hover:border-cyan-400 transition-colors border border-transparent"
              title={`${t.info} [Tab]`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline font-mono text-xs text-cyan-300 font-bold">
                {t.info}
              </span>
            </button>
            <button
              onClick={togglePause}
              className="glass-panel rounded-lg p-2 hover:border-cyan-400 transition-colors border border-transparent"
              title={`${t.pause} [Esc]`}
            >
              <Pause className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* On-screen Clickable / Touch Interaction Pill */}
      {showInteractionPrompt && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-auto">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('novascript:interact'));
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 text-white font-mono text-xs font-bold shadow-glow-cyan border border-cyan-400 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Click or Double-Click / Tap to interact"
          >
            <KeyRound className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>{t.doubleClickPrompt}</span>
          </button>
        </div>
      )}

      {/* Bottom bar — controls hint */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-center px-4 py-3">
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-cyan-400" /> {t.controlsMove}
            </span>
            <span className="flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-cyan-400" /> {t.controlsInteract}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-400" /> {t.controlsInventory}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-cyan-400" /> {t.controlsProfile}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3" /> {t.controlsRadar}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Orbital Station Minimap Radar */}
      <StationMinimap />

      {/* Inventory mini-bar (bottom-left) */}
      <div className="fixed bottom-14 left-4 z-30 pointer-events-none">
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
                  className="glass-panel rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 border border-cyan-900/40"
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
