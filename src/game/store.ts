/**
 * Central game world state store using Zustand.
 * Manages exploration state, inventory, player position, interactions, 
 * and game phase transitions.
 * 
 * IMPORTANT: This store manages SUPPLEMENTARY game state only.
 * Canonical mission state (questions, resources, endings) remains in
 * the existing mission-engine.ts and is NOT duplicated here.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GamePhase,
  RoomId,
  PlayerFacing,
  Vec3,
  Inventory,
  CollectibleType,
  INITIAL_INVENTORY,
} from '@/game/types';

// Re-export the initial inventory constant inline to avoid circular imports
const DEFAULT_INVENTORY: Inventory = {
  items: {
    'metal-scrap': 0,
    'energy-cell': 0,
    'science-sample': 0,
    'blueprint-fragment': 0,
    'rare-mineral': 0,
  },
  maxCapacity: 99,
};

export interface GameStore {
  // Phase
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;

  // Player
  playerPosition: Vec3;
  playerFacing: PlayerFacing;
  isMoving: boolean;
  currentRoom: RoomId;
  setPlayerPosition: (pos: Vec3) => void;
  setPlayerFacing: (facing: PlayerFacing) => void;
  setIsMoving: (moving: boolean) => void;
  setCurrentRoom: (room: RoomId) => void;

  // Interaction
  interactionTarget: string | null;
  showInteractionPrompt: boolean;
  setInteractionTarget: (target: string | null) => void;
  setShowInteractionPrompt: (show: boolean) => void;

  // Inventory (supplementary, no effect on canonical resources)
  inventory: Inventory;
  collectItem: (type: CollectibleType, amount?: number) => void;
  removeItem: (type: CollectibleType, amount?: number) => boolean;
  hasItems: (type: CollectibleType, amount: number) => boolean;

  // Collectibles tracking
  collectiblesFound: string[];
  markCollectibleFound: (id: string) => void;
  isCollectibleFound: (id: string) => boolean;

  // Mini-games
  activeMiniGame: string | null;
  setActiveMiniGame: (game: string | null) => void;

  // UI panels
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  setInventoryOpen: (open: boolean) => void;
  isCodexOpen: boolean;
  toggleCodex: () => void;
  isPaused: boolean;
  togglePause: () => void;

  // Mission unlock & progression
  isMissionUnlocked: boolean;
  unlockMission: () => void;
  missionsCompleted: number;
  endingsDiscovered: string[];
  addEndingDiscovered: (endingId: string) => void;

  // Reset
  resetExplorationState: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Phase
      phase: 'exploring',
      setPhase: (phase) => set({ phase }),

      // Player
      playerPosition: { x: 0, y: 0, z: 0 },
      playerFacing: 'right',
      isMoving: false,
      currentRoom: 'command-center',
      setPlayerPosition: (pos) => set({ playerPosition: pos }),
      setPlayerFacing: (facing) => set({ playerFacing: facing }),
      setIsMoving: (moving) => set({ isMoving: moving }),
      setCurrentRoom: (room) => set({ currentRoom: room }),

      // Interaction
      interactionTarget: null,
      showInteractionPrompt: false,
      setInteractionTarget: (target) => set({ interactionTarget: target }),
      setShowInteractionPrompt: (show) => set({ showInteractionPrompt: show }),

      // Inventory
      inventory: { ...DEFAULT_INVENTORY },
      collectItem: (type, amount = 1) =>
        set((state) => ({
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [type]: Math.min(
                state.inventory.items[type] + amount,
                state.inventory.maxCapacity
              ),
            },
          },
        })),
      removeItem: (type, amount = 1) => {
        const current = get().inventory.items[type];
        if (current < amount) return false;
        set((state) => ({
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [type]: state.inventory.items[type] - amount,
            },
          },
        }));
        return true;
      },
      hasItems: (type, amount) => get().inventory.items[type] >= amount,

      // Collectibles
      collectiblesFound: [],
      markCollectibleFound: (id) =>
        set((state) => ({
          collectiblesFound: state.collectiblesFound.includes(id)
            ? state.collectiblesFound
            : [...state.collectiblesFound, id],
        })),
      isCollectibleFound: (id) => get().collectiblesFound.includes(id),

      // Mini-games
      activeMiniGame: null,
      setActiveMiniGame: (game) => set({ activeMiniGame: game }),

      // UI
      isInventoryOpen: false,
      toggleInventory: () => set((s) => ({ isInventoryOpen: !s.isInventoryOpen })),
      setInventoryOpen: (open) => set({ isInventoryOpen: open }),
      isCodexOpen: false,
      toggleCodex: () => set((s) => ({ isCodexOpen: !s.isCodexOpen })),
      isPaused: false,
      togglePause: () => set((s) => ({ isPaused: !s.isPaused })),

      // Mission
      isMissionUnlocked: false,
      unlockMission: () => set({ isMissionUnlocked: true }),
      missionsCompleted: 0,
      endingsDiscovered: [],
      addEndingDiscovered: (endingId) =>
        set((state) => ({
          endingsDiscovered: state.endingsDiscovered.includes(endingId)
            ? state.endingsDiscovered
            : [...state.endingsDiscovered, endingId],
        })),

      // Reset exploration
      resetExplorationState: () =>
        set({
          phase: 'exploring',
          playerPosition: { x: 0, y: 0, z: 0 },
          playerFacing: 'right',
          isMoving: false,
          currentRoom: 'command-center',
          interactionTarget: null,
          showInteractionPrompt: false,
          activeMiniGame: null,
          isInventoryOpen: false,
          isCodexOpen: false,
          isPaused: false,
        }),
    }),
    {
      name: 'novascript_game_world_v1',
      partialize: (state) => ({
        inventory: state.inventory,
        collectiblesFound: state.collectiblesFound,
        currentRoom: state.currentRoom,
        playerPosition: state.playerPosition,
        isMissionUnlocked: state.isMissionUnlocked,
        missionsCompleted: state.missionsCompleted,
        endingsDiscovered: state.endingsDiscovered,
      }),
    }
  )
);
