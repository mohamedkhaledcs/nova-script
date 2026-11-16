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
  moveForward: ['w', 'arrowup', 'ص'],
  moveBackward: ['s', 'arrowdown', 'س'],
  moveLeft: ['a', 'arrowleft', 'ش'],
  moveRight: ['d', 'arrowright', 'ي'],
  interact: ['e', 'enter', 'ث'],
  inventory: ['i', 'b', 'ه', 'لا'],
  profile: ['p', 'c', 'ح', 'ؤ'],
  minimap: ['m', 'ة', 'م'],
  handbook: ['tab', 'h', 'ا'],
  pause: ['escape'],
};

/**
 * Comprehensive bilingual keyboard normalization:
 * Normalizes any keyboard input regardless of:
 * - English uppercase / lowercase (M vs m, W vs w, E vs e, etc.)
 * - Keyboard layout: Arabic QWERTY physical keys:
 *   ض->q, ص->w, ث->e, ق->r, ف->t, غ->y, ع->u, ه->i, خ->o, ح->p, ج->[, د->]
 *   ش->a, س->s, ي->d, ب->f, ل->g, ا->h, ت->j, ن->k, م->l, ك->;, ط->'
 *   ئ->z, ء->x, ؤ->c, ر->v, لا->b, ى->n, ة->m, و->,, ز->., ظ->/
 * - Arabic phonetic/mnemonic mapping:
 *   م -> m (Minimap / Map)
 *   ة -> m (Physical key for M on Arabic keyboard)
 *   ب -> p / b (Profile / Bag)
 *   ح -> h (Handbook)
 *   ث -> e (Physical key for E)
 *   ص -> w (Physical key for W)
 *   س -> s (Physical key for S)
 *   ش -> a (Physical key for A)
 *   ي -> d (Physical key for D)
 * - KeyboardEvent.code (e.g. 'KeyM' -> 'm', 'KeyW' -> 'w')
 */
const ARABIC_TO_LATIN: Record<string, string> = {
  // Row 1 (QWERTY)
  'ض': 'q',
  'ص': 'w',
  'ث': 'e',
  'ق': 'r',
  'ف': 't',
  'غ': 'y',
  'ع': 'u',
  'ه': 'i',
  'خ': 'o',
  'ح': 'p',
  'ج': '[',
  'د': ']',

  // Row 2 (ASDFGHJKL)
  'ش': 'a',
  'س': 's',
  'ي': 'd',
  'ب': 'f',
  'ل': 'g',
  'ا': 'h',
  'ت': 'j',
  'ن': 'k',
  'م': 'm', // Maps to 'm' for minimap/movement convenience
  'ك': ';',
  'ط': "'",

  // Row 3 (ZXCVBNM)
  'ئ': 'z',
  'ء': 'x',
  'ؤ': 'c',
  'ر': 'v',
  'لا': 'b',
  'ﻻ': 'b',
  'ى': 'n',
  'ة': 'm', // Physical M key on Arabic keyboard
  'و': ',',
  'ز': '.',
  'ظ': '/',
  'ذ': '`',

  // Arabic Numerals
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0',

  // Common variants
  'أ': 'a',
  'إ': 'i',
  'آ': 'a',
};

export function normalizeKey(rawKey: string, code?: string): string {
  // If code is provided and represents a physical letter key (e.g. 'KeyM', 'KeyW')
  if (code && code.startsWith('Key')) {
    return code.slice(3).toLowerCase();
  }
  if (code && code.startsWith('Digit')) {
    return code.slice(5);
  }
  if (code && code === 'Space') {
    return ' ';
  }
  if (code && code === 'Escape') {
    return 'escape';
  }
  if (code && code === 'Enter') {
    return 'enter';
  }
  if (code && code === 'Tab') {
    return 'tab';
  }
  if (code && code.startsWith('Arrow')) {
    return code.toLowerCase();
  }

  if (rawKey.length > 1) return rawKey.toLowerCase();
  const lower = rawKey.toLowerCase();
  return ARABIC_TO_LATIN[lower] || ARABIC_TO_LATIN[rawKey] || lower;
}

export function matchesKey(actionKeys: string[], e: KeyboardEvent): boolean {
  const norm = normalizeKey(e.key, e.code);
  const raw = e.key.toLowerCase();
  const fromCode = e.code && e.code.startsWith('Key') ? e.code.slice(3).toLowerCase() : '';
  
  return actionKeys.some(
    (k) =>
      k === norm ||
      k === raw ||
      (fromCode && k === fromCode) ||
      (ARABIC_TO_LATIN[raw] && k === ARABIC_TO_LATIN[raw])
  );
}

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
    icon: 'SCRAP',
    color: '#94A3B8',
    description: 'Salvaged spacecraft alloy fragments for repairs and upgrades.',
  },
  'energy-cell': {
    label: 'Energy Cell',
    icon: 'ENERGY',
    color: '#FBBF24',
    description: 'Compact fusion micro-cells powering station subsystems.',
  },
  'science-sample': {
    label: 'Science Sample',
    icon: 'SAMPLE',
    color: '#06B6D4',
    description: 'Analyzed specimens from planetary simulations.',
  },
  'blueprint-fragment': {
    label: 'Blueprint Fragment',
    icon: 'BLUEPRINT',
    color: '#818CF8',
    description: 'Partial design schematics for advanced spacecraft modules.',
  },
  'rare-mineral': {
    label: 'Rare Mineral',
    icon: 'CRYSTAL',
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
