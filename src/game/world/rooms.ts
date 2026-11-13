/**
 * Space station room definitions.
 * Each room defines its layout, portals (exits), interactable objects,
 * and collectible spawn points.
 */

import type { RoomId, InteractableObject, Vec3, CollectibleType } from '@/game/types';

export interface RoomPortal {
  id: string;
  targetRoom: RoomId;
  position: Vec3;
  label: string;
}

export interface CollectibleSpawn {
  id: string;
  type: CollectibleType;
  position: Vec3;
  respawn: boolean;
}

export interface RoomDefinition {
  id: RoomId;
  name: string;
  description: string;
  ambientColor: string;
  accentColor: string;
  floorColor: string;
  size: { width: number; depth: number };
  portals: RoomPortal[];
  interactables: InteractableObject[];
  collectibleSpawns: CollectibleSpawn[];
  playerSpawn: Vec3;
}

export const ROOM_DEFINITIONS: Record<RoomId, RoomDefinition> = {
  'command-center': {
    id: 'command-center',
    name: 'Command Center',
    description: 'The heart of the space station. Status displays and mission control terminals line the walls.',
    ambientColor: '#1E3A8A',
    accentColor: '#00F0FF',
    floorColor: '#0F1A36',
    size: { width: 30, depth: 20 },
    playerSpawn: { x: 0, y: 0, z: 0 },
    portals: [
      { id: 'cc-to-hall', targetRoom: 'hallway', position: { x: 14, y: 0, z: 0 }, label: 'To Hallway →' },
    ],
    interactables: [
      {
        id: 'cc-status-terminal',
        type: 'terminal',
        position: { x: -8, y: 0, z: -6 },
        label: 'Status Terminal',
        description: 'View mission status and resource overview.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'command-center',
      },
      {
        id: 'cc-viewport',
        type: 'display-screen',
        position: { x: 0, y: 0, z: -8 },
        label: 'Observation Viewport',
        description: 'A panoramic view of space and the station exterior.',
        interactionRadius: 3,
        isActive: true,
        roomId: 'command-center',
      },
    ],
    collectibleSpawns: [
      { id: 'cc-bp-1', type: 'blueprint-fragment', position: { x: 6, y: 0, z: 4 }, respawn: false },
    ],
  },

  hallway: {
    id: 'hallway',
    name: 'Central Corridor',
    description: 'A long corridor connecting all station modules. Emergency lighting casts a blue glow.',
    ambientColor: '#172554',
    accentColor: '#3B82F6',
    floorColor: '#091024',
    size: { width: 40, depth: 12 },
    playerSpawn: { x: 0, y: 0, z: 0 },
    portals: [
      { id: 'hall-to-cc', targetRoom: 'command-center', position: { x: -18, y: 0, z: 0 }, label: '← Command Center' },
      { id: 'hall-to-hangar', targetRoom: 'hangar', position: { x: 18, y: 0, z: 0 }, label: 'Hangar →' },
      { id: 'hall-to-lab', targetRoom: 'science-lab', position: { x: -6, y: 0, z: -5 }, label: '↑ Science Lab' },
      { id: 'hall-to-comms', targetRoom: 'comms-array', position: { x: 6, y: 0, z: -5 }, label: '↑ Comms Array' },
      { id: 'hall-to-resources', targetRoom: 'resource-bay', position: { x: -6, y: 0, z: 5 }, label: '↓ Resource Bay' },
      { id: 'hall-to-missions', targetRoom: 'mission-board', position: { x: 6, y: 0, z: 5 }, label: '↓ Mission Board' },
    ],
    interactables: [],
    collectibleSpawns: [
      { id: 'hall-energy-1', type: 'energy-cell', position: { x: 12, y: 0, z: 3 }, respawn: true },
    ],
  },

  hangar: {
    id: 'hangar',
    name: 'Assembly Hangar',
    description: 'A massive bay where spacecraft are assembled and configured for flight.',
    ambientColor: '#78350F',
    accentColor: '#F59E0B',
    floorColor: '#1C1917',
    size: { width: 34, depth: 24 },
    playerSpawn: { x: -12, y: 0, z: 0 },
    portals: [
      { id: 'hangar-to-hall', targetRoom: 'hallway', position: { x: -16, y: 0, z: 0 }, label: '← Hallway' },
    ],
    interactables: [
      {
        id: 'hangar-spacecraft',
        type: 'hangar-bay',
        position: { x: 4, y: 0, z: 0 },
        label: 'Spacecraft Bay',
        description: 'Inspect and configure the mission spacecraft.',
        interactionRadius: 4,
        isActive: true,
        roomId: 'hangar',
      },
      {
        id: 'hangar-workbench',
        type: 'workbench',
        position: { x: -6, y: 0, z: -7 },
        label: 'Workbench',
        description: 'Craft upgrades and enhancements using collected materials.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'hangar',
      },
    ],
    collectibleSpawns: [
      { id: 'hangar-metal-1', type: 'metal-scrap', position: { x: 10, y: 0, z: 6 }, respawn: true },
      { id: 'hangar-metal-2', type: 'metal-scrap', position: { x: 8, y: 0, z: -8 }, respawn: false },
      { id: 'hangar-rare-1', type: 'rare-mineral', position: { x: 14, y: 0, z: -3 }, respawn: false },
    ],
  },

  'science-lab': {
    id: 'science-lab',
    name: 'Science Laboratory',
    description: 'Advanced research equipment fills this pristine lab. Holographic displays flicker with data.',
    ambientColor: '#164E63',
    accentColor: '#06B6D4',
    floorColor: '#0C1A2E',
    size: { width: 26, depth: 18 },
    playerSpawn: { x: 0, y: 0, z: 6 },
    portals: [
      { id: 'lab-to-hall', targetRoom: 'hallway', position: { x: 0, y: 0, z: 8 }, label: '↓ Hallway' },
    ],
    interactables: [
      {
        id: 'lab-analyzer',
        type: 'science-equipment',
        position: { x: -6, y: 0, z: -4 },
        label: 'Sample Analyzer',
        description: 'Analyze collected scientific samples for mission insights.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'science-lab',
      },
      {
        id: 'lab-display',
        type: 'display-screen',
        position: { x: 6, y: 0, z: -4 },
        label: 'Research Display',
        description: 'Review scientific discoveries and codex entries.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'science-lab',
      },
    ],
    collectibleSpawns: [
      { id: 'lab-sample-1', type: 'science-sample', position: { x: -8, y: 0, z: 0 }, respawn: true },
      { id: 'lab-sample-2', type: 'science-sample', position: { x: 8, y: 0, z: -2 }, respawn: false },
    ],
  },

  'comms-array': {
    id: 'comms-array',
    name: 'Communications Array',
    description: 'Rows of receivers and transmitters. The constant hum of deep-space signals fills the air.',
    ambientColor: '#064E3B',
    accentColor: '#10B981',
    floorColor: '#0A1628',
    size: { width: 24, depth: 18 },
    playerSpawn: { x: 0, y: 0, z: 6 },
    portals: [
      { id: 'comms-to-hall', targetRoom: 'hallway', position: { x: 0, y: 0, z: 8 }, label: '↓ Hallway' },
    ],
    interactables: [
      {
        id: 'comms-antenna',
        type: 'antenna-dish',
        position: { x: 0, y: 0, z: -5 },
        label: 'Antenna Controls',
        description: 'Align the deep-space antenna for mission communications.',
        interactionRadius: 3,
        isActive: true,
        roomId: 'comms-array',
      },
      {
        id: 'comms-terminal',
        type: 'terminal',
        position: { x: -7, y: 0, z: 0 },
        label: 'Signal Monitor',
        description: 'Monitor incoming signals from ground stations and relay satellites.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'comms-array',
      },
    ],
    collectibleSpawns: [
      { id: 'comms-energy-1', type: 'energy-cell', position: { x: 7, y: 0, z: 2 }, respawn: true },
    ],
  },

  'resource-bay': {
    id: 'resource-bay',
    name: 'Resource Bay',
    description: 'Supply crates and material reserves. Essential components for mission operations.',
    ambientColor: '#451A03',
    accentColor: '#D97706',
    floorColor: '#18120E',
    size: { width: 24, depth: 18 },
    playerSpawn: { x: 0, y: 0, z: -6 },
    portals: [
      { id: 'res-to-hall', targetRoom: 'hallway', position: { x: 0, y: 0, z: -8 }, label: '↑ Hallway' },
    ],
    interactables: [
      {
        id: 'res-storage',
        type: 'storage-locker',
        position: { x: -6, y: 0, z: 3 },
        label: 'Supply Locker',
        description: 'Store and retrieve materials for crafting.',
        interactionRadius: 2.5,
        isActive: true,
        roomId: 'resource-bay',
      },
    ],
    collectibleSpawns: [
      { id: 'res-metal-1', type: 'metal-scrap', position: { x: 6, y: 0, z: 4 }, respawn: true },
      { id: 'res-metal-2', type: 'metal-scrap', position: { x: -4, y: 0, z: -2 }, respawn: true },
      { id: 'res-energy-1', type: 'energy-cell', position: { x: 8, y: 0, z: -3 }, respawn: true },
      { id: 'res-rare-1', type: 'rare-mineral', position: { x: -8, y: 0, z: 5 }, respawn: false },
    ],
  },

  'mission-board': {
    id: 'mission-board',
    name: 'Mission Control Board',
    description: 'The mission assignment center. Choose your target and begin the mission planning sequence.',
    ambientColor: '#312E81',
    accentColor: '#818CF8',
    floorColor: '#0C0A24',
    size: { width: 24, depth: 18 },
    playerSpawn: { x: 0, y: 0, z: -6 },
    portals: [
      { id: 'mb-to-hall', targetRoom: 'hallway', position: { x: 0, y: 0, z: -8 }, label: '↑ Hallway' },
    ],
    interactables: [
      {
        id: 'mb-board',
        type: 'mission-board',
        position: { x: 0, y: 0, z: 3 },
        label: 'Mission Board',
        description: 'Select a mission target and begin your space mission.',
        interactionRadius: 3.5,
        isActive: true,
        roomId: 'mission-board',
      },
    ],
    collectibleSpawns: [
      { id: 'mb-bp-1', type: 'blueprint-fragment', position: { x: -8, y: 0, z: 0 }, respawn: false },
    ],
  },
};

export function getRoomDefinition(roomId: RoomId): RoomDefinition {
  return ROOM_DEFINITIONS[roomId];
}

export function getAllRooms(): RoomDefinition[] {
  return Object.values(ROOM_DEFINITIONS);
}
