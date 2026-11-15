/**
 * Supplementary game types for the explorable space station game world.
 * These types are SEPARATE from canonical mission types in src/types/game.ts.
 * They must NEVER alter canonical JSON resources or ending scores.
 */

// ============================================================
// Player & Movement
// ============================================================

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PlayerFacing = 'left' | 'right';
export type PlayerGender = 'male' | 'female';
export type SuitScheme =
  | 'default'
  | 'solar-amber'
  | 'cosmic-violet'
  | 'cyber-teal'
  | 'crimson-alpha';

export type VisualMode = 'cinematic-3d' | 'retro-pixel' | 'cyber-neon' | 'performance';
export type Language = 'en' | 'ar';

export type GameAction =
  | 'moveForward'
  | 'moveBackward'
  | 'moveLeft'
  | 'moveRight'
  | 'interact'
  | 'inventory'
  | 'profile'
  | 'minimap'
  | 'handbook'
  | 'pause';

export interface Keybindings {
  moveForward: string[];
  moveBackward: string[];
  moveLeft: string[];
  moveRight: string[];
  interact: string[];
  inventory: string[];
  profile: string[];
  minimap: string[];
  handbook: string[];
  pause: string[];
}

export const DEFAULT_KEYBINDINGS: Keybindings = {
  moveForward: ['w', 'arrowup'],
  moveBackward: ['s', 'arrowdown'],
  moveLeft: ['a', 'arrowleft'],
  moveRight: ['d', 'arrowright'],
  interact: ['e', 'enter'],
  inventory: ['i', 'b'],
  profile: ['p', 'c'],
  minimap: ['m'],
  handbook: ['tab', 'h'],
  pause: ['escape'],
};

export interface PlayerProfile {
  name: string;
  gender: PlayerGender;
  suitScheme: SuitScheme;
  title: string;
}

export interface PlayerState {
  position: Vec3;
  facing: PlayerFacing;
  isMoving: boolean;
  currentRoom: RoomId;
  interactionTarget: string | null;
}

// ============================================================
// Space Station Rooms
// ============================================================

export type RoomId =
  | 'command-center'
  | 'hangar'
  | 'science-lab'
  | 'comms-array'
  | 'resource-bay'
  | 'mission-board'
  | 'hallway';

export interface RoomPortal {
  id: string;
  targetRoom: RoomId;
  position: Vec3;
  label: string;
}

export interface InteractableObject {
  id: string;
  type: InteractableType;
  position: Vec3;
  label: string;
  description: string;
  interactionRadius: number;
  isActive: boolean;
  roomId: RoomId;
  requiredItem?: CollectibleType;
}

export type InteractableType =
  | 'terminal'
  | 'workbench'
  | 'storage-locker'
  | 'display-screen'
  | 'control-panel'
  | 'science-equipment'
  | 'antenna-dish'
  | 'mission-board'
  | 'hangar-bay'
  | 'collectible-node';

// ============================================================
// Inventory & Collectibles (SUPPLEMENTARY - no canonical effect)
// ============================================================

export type CollectibleType =
  | 'metal-scrap'
  | 'energy-cell'
  | 'science-sample'
  | 'blueprint-fragment'
  | 'rare-mineral';

export interface InventoryItem {
  type: CollectibleType;
  quantity: number;
}

export interface Inventory {
  items: Record<CollectibleType, number>;
  maxCapacity: number;
}

export const COLLECTIBLE_LIMITS: Record<CollectibleType, number> = {
  'metal-scrap': 20,
  'energy-cell': 20,
  'science-sample': 15,
  'blueprint-fragment': 10,
  'rare-mineral': 8,
};

export const COLLECTIBLE_INFO: Record<
  CollectibleType,
  { label: string; icon: string; color: string; description: string }
> = {
  'metal-scrap': {
    label: 'Metal Scrap',
    icon: '🔩',
    color: '#94A3B8',
    description: 'Salvaged spacecraft alloy fragments for repairs and upgrades.',
  },
  'energy-cell': {
    label: 'Energy Cell',
    icon: '⚡',
    color: '#FBBF24',
    description: 'Compact fusion micro-cells powering station subsystems.',
  },
  'science-sample': {
    label: 'Science Sample',
    icon: '🔬',
    color: '#06B6D4',
    description: 'Analyzed specimens from planetary simulations.',
  },
  'blueprint-fragment': {
    label: 'Blueprint Fragment',
    icon: '📐',
    color: '#818CF8',
    description: 'Partial design schematics for advanced spacecraft modules.',
  },
  'rare-mineral': {
    label: 'Rare Mineral',
    icon: '💎',
    color: '#F472B6',
    description: 'Exotic crystalline compounds with unique thermal properties.',
  },
};

export const INITIAL_INVENTORY: Inventory = {
  items: {
    'metal-scrap': 0,
    'energy-cell': 0,
    'science-sample': 0,
    'blueprint-fragment': 0,
    'rare-mineral': 0,
  },
  maxCapacity: 99,
};

// ============================================================
// Crafting (Cosmetic upgrades only)
// ============================================================

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: Partial<Record<CollectibleType, number>>;
  resultType: 'cosmetic' | 'tool';
  resultId: string;
}

// ============================================================
// Achievements & Progression
// ============================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export type ProgressionRank =
  | 'cadet'
  | 'ensign'
  | 'lieutenant'
  | 'commander'
  | 'captain'
  | 'admiral';

export interface PlayerProgression {
  rank: ProgressionRank;
  totalMissionsCompleted: number;
  totalScore: number;
  endingsDiscovered: string[];
  achievements: Achievement[];
}

// ============================================================
// Game World State
// ============================================================

export type GamePhase =
  | 'exploring'        // Walking around station
  | 'interacting'      // Dialog / terminal / mini-game overlay
  | 'mission-active'   // Canonical question flow active
  | 'cinematic'        // Cutscene / launch / landing
  | 'mission-report';  // Post-mission debrief

export interface GameWorldState {
  phase: GamePhase;
  player: PlayerState;
  inventory: Inventory;
  collectiblesFound: string[];
  currentInteraction: string | null;
  isMissionUnlocked: boolean;
  activeMiniGame: string | null;
}
