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
 * - Animated Radar Scanning Sweep Beam
 * - Facility Glyphs & Interactive Waypoint Navigation
 */

'use client';

import React, { useState } from 'react';
import { Compass, Maximize2, Minimize2, Radio, Navigation } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import type { RoomId } from '@/game/types';
import { audio } from '@/lib/audio/audio-manager';
import { TRANSLATIONS } from '@/lib/i18n/translations';

// True physical topological blueprint layout with tactical indicators
const ROOM_MAP_LAYOUT: Record<
  RoomId,
  {
    x: number;
    y: number;
    w: number;
    h: number;
    labelKey: keyof typeof TRANSLATIONS.en;
    code: string;
    glyph: string;
    dirKey: keyof typeof TRANSLATIONS.en;
    descKey: keyof typeof TRANSLATIONS.en;
  }
> = {
  // Center: The central transit corridor connecting all station modules
  hallway: {
    x: 64,
    y: 68,
    w: 72,
    h: 28,
    labelKey: 'centralHub',
    code: 'HUB-TRN',
    glyph: '⊕',
    dirKey: 'dirCenter',
    descKey: 'centralHubDesc',
  },
  // West (Left)
  'command-center': {
    x: 8,
    y: 58,
    w: 48,
    h: 48,
    labelKey: 'commandCenter',
    code: 'CMD-00',
    glyph: '⌗',
    dirKey: 'dirWest',
    descKey: 'commandCenterDesc',
  },
  // East (Right)
  hangar: {
    x: 144,
    y: 56,
    w: 48,
    h: 52,
    labelKey: 'vehicleHangar',
    code: 'HNG-02',
    glyph: '▲',
    dirKey: 'dirEast',
    descKey: 'vehicleHangarDesc',
  },
  // North-West (Top-Left)
  'science-lab': {
    x: 34,
    y: 12,
    w: 54,
    h: 40,
    labelKey: 'scienceLab',
    code: 'LAB-01',
    glyph: 'LAB',
    dirKey: 'dirNorthWest',
    descKey: 'scienceLabDesc',
  },
  // North-East (Top-Right)
  'comms-array': {
    x: 112,
    y: 12,
    w: 54,
    h: 40,
    labelKey: 'commsArray',
    code: 'COM-03',
    glyph: '∿',
    dirKey: 'dirNorthEast',
    descKey: 'commsArrayDesc',
  },
  // South-West (Bottom-Left)
  'resource-bay': {
    x: 34,
    y: 112,
    w: 54,
    h: 40,
    labelKey: 'resourceBay',
    code: 'RES-05',
    glyph: '◆',
    dirKey: 'dirSouthWest',
    descKey: 'resourceBayDesc',
  },
  // South-East (Bottom-Right)
  'mission-board': {
    x: 112,
    y: 112,
    w: 54,
    h: 40,
    labelKey: 'missionBoard',
    code: 'MSN-06',
    glyph: '⌖',
    dirKey: 'dirSouthEast',
    descKey: 'missionBoardDesc',
  },
};

export default function StationMinimap() {
  const {
    currentRoom,
    playerPosition,
    playerFacing,
    collectiblesFound,
    roomsVisited,
    language,
  } = useGameStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<RoomId | null>(null);
  const [waypointRoom, setWaypointRoom] = useState<RoomId | null>(null);

  const t = TRANSLATIONS[language || 'en'];
  const activeRoomDef = getRoomDefinition(currentRoom);
  const activeLayout = ROOM_MAP_LAYOUT[currentRoom];

  // Room dimensions for normalizing coordinates
  const halfW = (activeRoomDef.size.width || 14) / 2;
  const halfD = (activeRoomDef.size.depth || 14) / 2;

  const normX = Math.max(0.1, Math.min(0.9, (playerPosition.x + halfW) / (halfW * 2)));
  const normY = Math.max(0.1, Math.min(0.9, (playerPosition.z + halfD) / (halfD * 2)));

  const playerDotX = activeLayout.x + normX * activeLayout.w;
  const playerDotY = activeLayout.y + normY * activeLayout.h;

  const handleSelectWaypoint = (rId: RoomId) => {
    audio.select();
    setWaypointRoom((prev) => (prev === rId ? null : rId));
  };

  return (
    <div className="fixed bottom-14 right-4 z-30 select-none">
      {/* Radar Panel */}
      <div
        className={`glass-panel rounded-2xl border border-cyan-500/40 shadow-glow-cyan bg-space-950/95 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col ${
          isExpanded ? 'w-84 sm:w-96 h-96' : 'w-56 h-56'
        }`}
      >
        {/* Radar Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-900/50 bg-space-900/80">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300 font-bold tracking-wider">
              {t.stationRadar}
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
            <defs>
              {/* Radial radar sweep gradient */}
              <linearGradient id="radarSweepGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="radarConeGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* Background Radar Scanner Circles & Crosshairs */}
            <circle cx="100" cy="82" r="78" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 3" />
            <circle cx="100" cy="82" r="45" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.2" />
            <line x1="10" y1="82" x2="190" y2="82" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.12" />
            <line x1="100" y1="5" x2="100" y2="160" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.12" />

            {/* Animated Rotating Radar Sweep Beam */}
            <g className="origin-[100px_82px] animate-[spin_5s_linear_infinite] pointer-events-none opacity-30">
              <line x1="100" y1="82" x2="100" y2="4" stroke="url(#radarSweepGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <polygon points="100,82 100,4 124,10" fill="url(#radarConeGrad)" />
            </g>

            {/* Compass Cardinal Points */}
            <text x="100" y="8" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">
              {language === 'ar' ? 'ش' : 'N'}
            </text>
            <text x="100" y="162" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">
              {language === 'ar' ? 'ج' : 'S'}
            </text>
            <text x="5" y="84" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">
              {language === 'ar' ? 'غ' : 'W'}
            </text>
            <text x="195" y="84" textAnchor="middle" fill="#38BDF8" fontSize="5" fontFamily="monospace" opacity="0.6">
              {language === 'ar' ? 'ق' : 'E'}
            </text>

            {/* Pressurized Transit Tunnels */}
            <path d="M 64 82 L 56 82" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M 136 82 L 144 82" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M 78 68 L 78 52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M 122 68 L 122 52" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M 78 96 L 78 112" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M 122 96 L 122 112" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />

            {/* Station Room Modules */}
            {(Object.entries(ROOM_MAP_LAYOUT) as [RoomId, typeof activeLayout][]).map(([rId, layout]) => {
              const isCurrent = rId === currentRoom;
              const isVisited = roomsVisited.includes(rId);
              const isWaypoint = waypointRoom === rId;
              const isHub = rId === 'hallway';

              return (
                <g
                  key={rId}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredRoom(rId)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => handleSelectWaypoint(rId)}
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
                        : isWaypoint
                        ? '#3B1F04'
                        : isVisited
                        ? '#021B2A'
                        : '#010B13'
                    }
                    stroke={
                      isWaypoint
                        ? '#F59E0B'
                        : isCurrent
                        ? '#00F0FF'
                        : isVisited
                        ? isHub
                          ? '#38BDF8'
                          : '#0E7490'
                        : '#1E293B'
                    }
                    strokeWidth={isWaypoint || isCurrent ? '1.8' : '1'}
                    className="transition-colors"
                  />

                  {/* Room Facility Glyph Icon */}
                  <text
                    x={layout.x + (isExpanded ? 10 : 8)}
                    y={layout.y + (isExpanded ? 14 : 12)}
                    fontSize={isExpanded ? '8' : '6.5'}
                    opacity={isCurrent || isVisited ? '0.9' : '0.4'}
                  >
                    {layout.glyph}
                  </text>

                  {/* Room Short Code */}
                  <text
                    x={layout.x + layout.w / 2 + (isExpanded ? 4 : 2)}
                    y={layout.y + layout.h / 2 + (isExpanded ? -2 : 3)}
                    textAnchor="middle"
                    fill={isWaypoint ? '#FCD34D' : isCurrent ? '#00F0FF' : isVisited ? '#7DD3FC' : '#475569'}
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
                      fontSize="4.5"
                      fontFamily="monospace"
                    >
                      {t[layout.labelKey] as string}
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
              <circle
                cx={playerDotX}
                cy={playerDotY}
                r="3.2"
                fill="#00F0FF"
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />
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
          {waypointRoom ? (
            <div className="flex items-center gap-1 text-amber-300 font-bold truncate">
              <Navigation className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                {t.targetWaypoint}: {t[ROOM_MAP_LAYOUT[waypointRoom].labelKey] as string} ({t[ROOM_MAP_LAYOUT[waypointRoom].dirKey] as string})
              </span>
            </div>
          ) : hoveredRoom ? (
            <div className="truncate text-slate-300">
              <span className="text-cyan-400 font-bold">
                {t[ROOM_MAP_LAYOUT[hoveredRoom].dirKey] as string}:{' '}
              </span>
              {t[ROOM_MAP_LAYOUT[hoveredRoom].labelKey] as string} — {t[ROOM_MAP_LAYOUT[hoveredRoom].descKey] as string}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-slate-400">
              <span className="text-cyan-300 font-bold">{t[activeLayout.labelKey] as string}</span>
              <span className="text-slate-500">{t.radarToggle}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
