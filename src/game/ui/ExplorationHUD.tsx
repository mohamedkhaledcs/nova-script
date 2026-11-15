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
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType } from '@/game/types';

export default function ExplorationHUD() {
  const {
    currentRoom,
    inventory,
    phase,
    playerGender,
    playerName,
    toggleInventory,
    togglePause,
    toggleCodex,
    toggleProfile,
  } = useGameStore();

  if (phase !== 'exploring') return null;

  const room = getRoomDefinition(currentRoom);

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
              {room.name.toUpperCase()}
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
              title="Commander Profile [P]"
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
              title="Inventory [I]"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-slate-300">{totalItems}</span>
            </button>
            <button
              onClick={toggleCodex}
              className="glass-panel rounded-lg p-2 hover:border-cyan-400 transition-colors border border-transparent"
              title="Codex [Tab]"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={togglePause}
              className="glass-panel rounded-lg p-2 hover:border-cyan-400 transition-colors border border-transparent"
              title="Pause [Esc]"
            >
              <Pause className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar — controls hint */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-center px-4 py-3">
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3" /> WASD / Arrows
            </span>
            <span className="flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> [E] Interact
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" /> [I] Inventory
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> [P] Profile
            </span>
          </div>
        </div>
      </div>

      {/* Inventory mini-bar (bottom-left) */}
      <div className="fixed bottom-14 left-4 z-30 pointer-events-none">
        <div className="flex gap-1.5">
          {(Object.entries(inventory.items) as [CollectibleType, number][])
            .filter(([, count]) => count > 0)
            .map(([type, count]) => {
              const info = COLLECTIBLE_INFO[type];
              return (
                <div
                  key={type}
                  className="glass-panel rounded-lg px-2 py-1.5 flex items-center gap-1"
                  title={`${info.label}: ${count}`}
                >
                  <span className="text-sm">{info.icon}</span>
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
