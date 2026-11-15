/**
 * Holographic Station Radar & Module Minimap.
 * Renders real-time telemetry of the NovaScript Orbital Complex:
 * - 7 Interconnected Station Modules
 * - Real-time Player Position & Heading Blip
 * - Uncollected Salvage & Terminal Hotspots
 * - Compact HUD widget with Expandable Blueprint Mode [M]
 */

'use client';

import React, { useState } from 'react';
import { Compass, Maximize2, Minimize2, Radio, Sparkles } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { ROOM_DEFINITIONS, getRoomDefinition } from '@/game/world/rooms';
import type { RoomId } from '@/game/types';
import { audio } from '@/lib/audio/audio-manager';

// Schematic coordinate offsets for the 7 rooms on the station blueprint grid
const ROOM_MAP_LAYOUT: Record<RoomId, { x: number; y: number; w: number; h: number; label: string; code: string }> = {
  'science-lab':    { x: 70,  y: 10,  w: 60, h: 36, label: 'Science Lab',      code: 'LAB-01' },
  'hangar':         { x: 10,  y: 56,  w: 52, h: 48, label: 'Vehicle Hangar',   code: 'HNG-02' },
  'command-center': { x: 70,  y: 54,  w: 60, h: 44, label: 'Command Center',   code: 'CMD-00' },
  'comms-array':    { x: 138, y: 56,  w: 52, h: 42, label: 'Comms Array',      code: 'COM-03' },
  'hallway':        { x: 74,  y: 104, w: 52, h: 28, label: 'Transit Corridor', code: 'TRN-04' },
  'resource-bay':   { x: 16,  y: 114, w: 50, h: 40, label: 'Resource Bay',    code: 'RES-05' },
  'mission-board':  { x: 134, y: 114, w: 56, h: 42, label: 'Mission Board',   code: 'MSN-06' },
};

export default function StationMinimap() {
  const {
    currentRoom,
    playerPosition,
    playerFacing,
    collectiblesFound,
    roomsVisited,
    isMinimapOpen,
    toggleMinimap,
  } = useGameStore();

  const [isExpanded, setIsExpanded] = useState(false);

  const activeRoomDef = getRoomDefinition(currentRoom);

  // Compute normalized player position within current room tile
  const activeLayout = ROOM_MAP_LAYOUT[currentRoom];
  const halfW = (activeRoomDef.size.width || 14) / 2;
  const halfD = (activeRoomDef.size.depth || 14) / 2;

  const normX = Math.max(0.1, Math.min(0.9, (playerPosition.x + halfW) / (halfW * 2)));
  const normY = Math.max(0.1, Math.min(0.9, (playerPosition.z + halfD) / (halfD * 2)));

  const playerDotX = activeLayout.x + normX * activeLayout.w;
  const playerDotY = activeLayout.y + normY * activeLayout.h;

  return (
    <div className="fixed bottom-14 right-4 z-30 select-none">
      {/* Compact Mini-Radar or Expanded Blueprint Panel */}
      <div
        className={`glass-panel rounded-2xl border border-cyan-500/40 shadow-glow-cyan bg-space-950/90 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-72 h-80' : 'w-48 h-48'
        }`}
      >
        {/* Radar Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-900/40 bg-space-900/60">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300 font-bold tracking-wider">
              ORBITAL RADAR
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-mono text-[9px] text-slate-400 uppercase">
              {activeLayout.code}
            </span>
            <button
              onClick={() => {
                audio.click();
                setIsExpanded((prev) => !prev);
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-space-850"
              title={isExpanded ? 'Collapse Radar' : 'Expand Radar'}
            >
              {isExpanded ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Radar SVG Matrix */}
        <div className="relative w-full h-[calc(100%-28px)] p-2 flex items-center justify-center">
          <svg
            viewBox="0 0 200 165"
            className="w-full h-full filter drop-shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          >
            {/* Background Scanner Grid Lines */}
            <circle cx="100" cy="85" r="75" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 3" />
            <circle cx="100" cy="85" r="45" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.2" />
            <line x1="20" y1="85" x2="180" y2="85" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.1" />
            <line x1="100" y1="10" x2="100" y2="160" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.1" />

            {/* Schematic Hallway Corridors */}
            <path
              d="M 100 46 L 100 54 M 62 76 L 70 76 M 130 76 L 138 76 M 100 98 L 100 104 M 66 126 L 74 126 M 126 126 L 134 126"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />

            {/* Room Modules */}
            {(Object.entries(ROOM_MAP_LAYOUT) as [RoomId, typeof activeLayout][]).map(([rId, layout]) => {
              const isCurrent = rId === currentRoom;
              const isVisited = roomsVisited.includes(rId);

              return (
                <g key={rId} className="transition-all">
                  <rect
                    x={layout.x}
                    y={layout.y}
                    width={layout.w}
                    height={layout.h}
                    rx="4"
                    fill={isCurrent ? '#003B46' : isVisited ? '#021B2A' : '#010B13'}
                    stroke={isCurrent ? '#00F0FF' : isVisited ? '#0E7490' : '#1E293B'}
                    strokeWidth={isCurrent ? '1.5' : '1'}
                    className="transition-colors"
                  />

                  {/* Room Short Code */}
                  <text
                    x={layout.x + layout.w / 2}
                    y={layout.y + layout.h / 2 + (isExpanded ? -2 : 3)}
                    textAnchor="middle"
                    fill={isCurrent ? '#00F0FF' : isVisited ? '#7DD3FC' : '#475569'}
                    fontSize={isExpanded ? '7' : '8'}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {layout.code}
                  </text>

                  {/* Room Label (visible when expanded) */}
                  {isExpanded && (
                    <text
                      x={layout.x + layout.w / 2}
                      y={layout.y + layout.h / 2 + 8}
                      textAnchor="middle"
                      fill={isCurrent ? '#E0F2FE' : '#94A3B8'}
                      fontSize="5"
                      fontFamily="monospace"
                    >
                      {layout.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Uncollected Collectible Spawns in Current Room */}
            {activeRoomDef.collectibleSpawns.map((spawn) => {
              const isCollected = collectiblesFound.includes(spawn.id);
              if (isCollected && !spawn.respawn) return null;

              const sNormX = Math.max(0.1, Math.min(0.9, (spawn.position.x + halfW) / (halfW * 2)));
              const sNormY = Math.max(0.1, Math.min(0.9, (spawn.position.z + halfD) / (halfD * 2)));
              const dotX = activeLayout.x + sNormX * activeLayout.w;
              const dotY = activeLayout.y + sNormY * activeLayout.h;

              return (
                <circle
                  key={spawn.id}
                  cx={dotX}
                  cy={dotY}
                  r="2"
                  fill="#FBBF24"
                  className="animate-ping"
                  opacity="0.8"
                />
              );
            })}

            {/* Real-time Player Blip */}
            <g className="transition-all duration-75">
              {/* Outer Pulse Ring */}
              <circle
                cx={playerDotX}
                cy={playerDotY}
                r="6"
                fill="none"
                stroke="#00F0FF"
                strokeWidth="1"
                className="animate-ping"
                opacity="0.7"
              />
              {/* Core Blip */}
              <circle
                cx={playerDotX}
                cy={playerDotY}
                r="3"
                fill="#00F0FF"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              {/* Heading Indicator Line */}
              <line
                x1={playerDotX}
                y1={playerDotY}
                x2={playerDotX + (playerFacing === 'right' ? 4 : -4)}
                y2={playerDotY}
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Minimap Live Coordinate Footer */}
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-cyan-400/80">
            X:{playerPosition.x.toFixed(1)} Z:{playerPosition.z.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
