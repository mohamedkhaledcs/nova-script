/**
 * Holographic Station Radar & Module Minimap.
 * Renders real-time telemetry of the NovaScript Orbital Complex with true spatial topology:
 * - Central Transit Corridor (HUB-TRN) right in the center connecting all modules
 * - Command Center (CMD-00) to the West (Left)
 * - Assembly Hangar (HNG-02) to the East (Right)
 * - Science Laboratory (LAB-01) to the North-West (Top-Left)
 * - Communications Array (COM-03) to the North-East (Top-Right)
 * - Resource Bay (RES-05) to the South-West (Bottom-Left)
 * - Mission Launch Board (MSN-06) to the South-East (Bottom-Right)
 * - Real-time Player Position & Heading Blip with Compass
 * - Expandable Blueprint Mode [M]
 */

'use client';

import React, { useState } from 'react';
import { Compass, Maximize2, Minimize2, Radio } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import type { RoomId } from '@/game/types';
import { audio } from '@/lib/audio/audio-manager';

// True physical topological blueprint layout
const ROOM_MAP_LAYOUT: Record<
  RoomId,
  {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    code: string;
    direction: string;
    description: string;
  }
> = {
  // Center: The central transit corridor connecting all station modules
  hallway: {
    x: 64,
    y: 68,
    w: 72,
    h: 28,
    label: 'Central Hub',
    code: 'HUB-TRN',
    direction: 'CENTER',
    description: 'Central transit corridor linking all 6 orbital modules',
  },
  // West (Left)
  'command-center': {
    x: 8,
    y: 58,
    w: 48,
    h: 48,
    label: 'Command Center',
    code: 'CMD-00',
    direction: 'WEST (←)',
    description: 'Flight telemetry, station displays, and main observation deck',
  },
  // East (Right)
  hangar: {
    x: 144,
    y: 56,
    w: 48,
    h: 52,
    label: 'Vehicle Hangar',
    code: 'HNG-02',
    direction: 'EAST (→)',
    description: '3D Spacecraft assembly bay & engineering workbench',
  },
  // North-West (Top-Left)
  'science-lab': {
    x: 34,
    y: 12,
    w: 54,
    h: 40,
    label: 'Science Lab',
    code: 'LAB-01',
    direction: 'NORTH-WEST (↖)',
    description: 'Raman spectrometer & planetary geology analysis',
  },
  // North-East (Top-Right)
  'comms-array': {
    x: 112,
    y: 12,
    w: 54,
    h: 40,
    label: 'Comms Array',
    code: 'COM-03',
    direction: 'NORTH-EAST (↗)',
    description: 'Deep Space Network antenna dish calibration',
  },
  // South-West (Bottom-Left)
  'resource-bay': {
    x: 34,
    y: 112,
    w: 54,
    h: 40,
    label: 'Resource Bay',
    code: 'RES-05',
    direction: 'SOUTH-WEST (↙)',
    description: 'Material storage lockers & salvaged component crates',
  },
  // South-East (Bottom-Right)
  'mission-board': {
    x: 112,
    y: 112,
    w: 54,
    h: 40,
    label: 'Mission Board',
    code: 'MSN-06',
    direction: 'SOUTH-EAST (↘)',
    description: 'Mission target selection & launch authorization terminal',
  },
};

export default function StationMinimap() {
  const {
    currentRoom,
    playerPosition,
    playerFacing,
    collectiblesFound,
    roomsVisited,
  } = useGameStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<RoomId | null>(null);

  const activeRoomDef = getRoomDefinition(currentRoom);
  const activeLayout = ROOM_MAP_LAYOUT[currentRoom];

  // Room dimensions for normalizing coordinates
  const halfW = (activeRoomDef.size.width || 14) / 2;
  const halfD = (activeRoomDef.size.depth || 14) / 2;

  const normX = Math.max(0.1, Math.min(0.9, (playerPosition.x + halfW) / (halfW * 2)));
  const normY = Math.max(0.1, Math.min(0.9, (playerPosition.z + halfD) / (halfD * 2)));

  const playerDotX = activeLayout.x + normX * activeLayout.w;
  const playerDotY = activeLayout.y + normY * activeLayout.h;

  return (
    <div className="fixed bottom-14 right-4 z-30 select-none">
      {/* Radar Panel */}
      <div
        className={`glass-panel rounded-2xl border border-cyan-500/40 shadow-glow-cyan bg-space-950/95 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col ${
          isExpanded ? 'w-84 sm:w-96 h-96' : 'w-52 h-52'
        }`}
      >
        {/* Radar Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-900/50 bg-space-900/80">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300 font-bold tracking-wider">
              STATION RADAR
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold">
              {activeLayout.code}
            </span>
            <button
              onClick={() => {
                audio.click();
                setIsExpanded((prev) => !prev);
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-space-850"
              title={isExpanded ? 'Minimize Radar' : 'Expand Blueprint'}
            >
              {isExpanded ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Radar SVG Map Matrix */}
        <div className="relative flex-1 p-2 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 200 165"
            className="w-full h-full filter drop-shadow-[0_0_8px_rgba(0,240,255,0.25)]"
          >
            {/* Background Radar Scanner Circles & Crosshairs */}
            <circle cx="100" cy="82" r="78" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 3" />
            <circle cx="100" cy="82" r="45" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.2" />
            <line x1="10" y1="82" x2="190" y2="82" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.12" />
            <line x1="100" y1="5" x2="100" y2="160" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.12" />

            {/* Compass Cardinal Points */}
            <text x="100" y="8" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">N</text>
            <text x="100" y="162" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">S</text>
            <text x="5" y="84" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">W</text>
            <text x="195" y="84" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">E</text>

            {/* Connecting Pressurized Transit Tunnels */}
            {/* West Tunnel (Hub to Command Center) */}
            <path d="M 64 82 L 56 82" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
            {/* East Tunnel (Hub to Hangar) */}
            <path d="M 136 82 L 144 82" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
            {/* North-West Tunnel (Hub to Science Lab) */}
            <path d="M 78 68 L 78 52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            {/* North-East Tunnel (Hub to Comms Array) */}
            <path d="M 122 68 L 122 52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            {/* South-West Tunnel (Hub to Resource Bay) */}
            <path d="M 78 96 L 78 112" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            {/* South-East Tunnel (Hub to Mission Board) */}
            <path d="M 122 96 L 122 112" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />

            {/* Station Room Modules */}
            {(Object.entries(ROOM_MAP_LAYOUT) as [RoomId, typeof activeLayout][]).map(([rId, layout]) => {
              const isCurrent = rId === currentRoom;
              const isVisited = roomsVisited.includes(rId);
              const isHub = rId === 'hallway';

              return (
                <g
                  key={rId}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredRoom(rId)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  {/* Module Boundary */}
                  <rect
                    x={layout.x}
                    y={layout.y}
                    width={layout.w}
                    height={layout.h}
                    rx="4"
                    fill={
                      isCurrent
                        ? isHub
                          ? '#022C43'
                          : '#003B46'
                        : isVisited
                        ? '#021B2A'
                        : '#010B13'
                    }
                    stroke={
                      isCurrent
                        ? '#00F0FF'
                        : isVisited
                        ? isHub
                          ? '#38BDF8'
                          : '#0E7490'
                        : '#1E293B'
                    }
                    strokeWidth={isCurrent ? '1.8' : '1'}
                    className="transition-colors"
                  />

                  {/* Room Short Code */}
                  <text
                    x={layout.x + layout.w / 2}
                    y={layout.y + layout.h / 2 + (isExpanded ? -2 : 3)}
                    textAnchor="middle"
                    fill={isCurrent ? '#00F0FF' : isVisited ? '#7DD3FC' : '#475569'}
                    fontSize={isExpanded ? '7' : '7.5'}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {layout.code}
                  </text>

                  {/* Room Label (visible when expanded) */}
                  {isExpanded && (
                    <text
                      x={layout.x + layout.w / 2}
                      y={layout.y + layout.h / 2 + 7.5}
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

            {/* Uncollected Collectibles in Current Room */}
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

            {/* Real-time Player Position & Heading Blip */}
            <g className="transition-all duration-75">
              {/* Outer Pulse Ring */}
              <circle
                cx={playerDotX}
                cy={playerDotY}
                r="6.5"
                fill="none"
                stroke="#00F0FF"
                strokeWidth="1.2"
                className="animate-ping"
                opacity="0.75"
              />
              {/* Core Dot */}
              <circle
                cx={playerDotX}
                cy={playerDotY}
                r="3.2"
                fill="#00F0FF"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
              {/* Direction Indicator */}
              <line
                x1={playerDotX}
                y1={playerDotY}
                x2={playerDotX + (playerFacing === 'right' ? 5 : -5)}
                y2={playerDotY}
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Coordinate Footer */}
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-cyan-400/80">
            X:{playerPosition.x.toFixed(1)} Z:{playerPosition.z.toFixed(1)}
          </div>
        </div>

        {/* Hover / Active Module Info Bar (Bottom Bar) */}
        <div className="px-3 py-1.5 border-t border-cyan-900/40 bg-space-950 flex items-center justify-between text-[9px] font-mono">
          {hoveredRoom ? (
            <div className="truncate text-slate-300">
              <span className="text-cyan-400 font-bold">{ROOM_MAP_LAYOUT[hoveredRoom].direction}: </span>
              {ROOM_MAP_LAYOUT[hoveredRoom].label} — {ROOM_MAP_LAYOUT[hoveredRoom].description}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-slate-400">
              <span className="text-cyan-300 font-bold">{activeLayout.label}</span>
              <span className="text-slate-500">Press [M] to Toggle</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
