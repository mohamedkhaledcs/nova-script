/**
 * Central game world state store using Zustand.
 * Manages exploration state, inventory, player position, interactions, 
 * click-to-move, achievements, and notifications.
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
  PlayerGender,
  SuitScheme,
  VisualMode,
  Language,
  GameAction,
  Keybindings,
  Vec3,
  Inventory,
  CollectibleType,
} from '@/game/types';
import { COLLECTIBLE_LIMITS, DEFAULT_KEYBINDINGS } from '@/game/types';
import { checkAchievements } from '@/game/progression/achievements';
import { musicEngine } from '@/game/audio/music-engine';

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

export interface CollectibleToast {
  id: string;
  type: CollectibleType;
  amount: number;
  currentTotal: number;
  maxLimit: number;
  timestamp: number;
}

export interface AchievementToast {
  id: string;
  achievementId: string;
}

export interface GameStore {
  // Phase
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;

  // Player Profile & Customization
  playerGender: PlayerGender;
  playerName: string;
  suitScheme: SuitScheme;
  setPlayerGender: (gender: PlayerGender) => void;
  setPlayerName: (name: string) => void;
  setSuitScheme: (scheme: SuitScheme) => void;
  isProfileOpen: boolean;
  toggleProfile: () => void;
  setProfileOpen: (open: boolean) => void;

  // Keybindings, Graphics Mood & Localization
  keybindings: Keybindings;
  setKeybinding: (action: GameAction, keys: string[]) => void;
  resetKeybindings: () => void;
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Player
  playerPosition: Vec3;
  playerFacing: PlayerFacing;
  isMoving: boolean;
  currentRoom: RoomId;
  moveTarget: { x: number; z: number } | null;
  setPlayerPosition: (pos: Vec3) => void;
  setPlayerFacing: (facing: PlayerFacing) => void;
  setIsMoving: (moving: boolean) => void;
  setCurrentRoom: (room: RoomId) => void;
  setMoveTarget: (target: { x: number; z: number } | null) => void;

  // Interaction
  interactionTarget: string | null;
  showInteractionPrompt: boolean;
  setInteractionTarget: (target: string | null) => void;
  setShowInteractionPrompt: (show: boolean) => void;

  // Inventory (supplementary, no effect on canonical resources)
  inventory: Inventory;
  collectItem: (type: CollectibleType, amount?: number) => boolean;
  canCollect: (type: CollectibleType) => boolean;
  removeItem: (type: CollectibleType, amount?: number) => boolean;
  hasItems: (type: CollectibleType, amount: number) => boolean;

  // Collectibles tracking
  collectiblesFound: string[];
  markCollectibleFound: (id: string) => void;
  isCollectibleFound: (id: string) => boolean;
  totalCollectiblesCount: number;

  // Mini-games
  activeMiniGame: string | null;
  setActiveMiniGame: (game: string | null) => void;

  // UI panels
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  setInventoryOpen: (open: boolean) => void;
  isCodexOpen: boolean;
  toggleCodex: () => void;
  isMinimapOpen: boolean;
  toggleMinimap: () => void;
  setMinimapOpen: (open: boolean) => void;
  isPaused: boolean;
  togglePause: () => void;

  // Progression & Stats
  roomsVisited: string[];
  totalItemsCrafted: number;
  incrementCraftedCount: () => void;
  missionsCompleted: number;
  endingsDiscovered: string[];
  bestScore: number;
  totalScore: number;
  addEndingDiscovered: (endingId: string, score?: number) => void;

  // Achievements
  unlockedAchievements: string[];
  achievementToasts: AchievementToast[];
  dismissAchievementToast: (id: string) => void;

  // Collectible Toasts
  collectibleToasts: CollectibleToast[];
  dismissCollectibleToast: (id: string) => void;

  // Check achievements helper
  checkAchievementsTrigger: () => void;

  // Reset
  resetExplorationState: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Phase
      phase: 'exploring',
      setPhase: (phase) => {
        set({ phase });
        get().checkAchievementsTrigger();
      },

      // Player Profile & Character
      playerGender: 'male',
      playerName: 'Commander Nova',
      suitScheme: 'default',
      isProfileOpen: false,
      setPlayerGender: (gender) => set({ playerGender: gender }),
      setPlayerName: (name) => set({ playerName: name }),
      setSuitScheme: (scheme) => set({ suitScheme: scheme }),
      toggleProfile: () => set((s) => ({ isProfileOpen: !s.isProfileOpen })),
      setProfileOpen: (open) => set({ isProfileOpen: open }),

      // Keybindings, Graphics Mood & Localization
      keybindings: { ...DEFAULT_KEYBINDINGS },
      setKeybinding: (action, keys) =>
        set((s) => ({
          keybindings: { ...s.keybindings, [action]: keys.map((k) => k.toLowerCase()) },
        })),
      resetKeybindings: () => set({ keybindings: { ...DEFAULT_KEYBINDINGS } }),
      visualMode: 'cinematic-3d',
      setVisualMode: (mode) => set({ visualMode: mode }),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Player
      playerPosition: { x: 0, y: 0, z: 0 },
      playerFacing: 'right',
      isMoving: false,
      currentRoom: 'command-center',
      moveTarget: null,
      setPlayerPosition: (pos) => set({ playerPosition: pos }),
      setPlayerFacing: (facing) => set({ playerFacing: facing }),
      setIsMoving: (moving) => set({ isMoving: moving }),
      setCurrentRoom: (room) => {
        const visited = get().roomsVisited;
        const nextVisited = visited.includes(room) ? visited : [...visited, room];
        set({ currentRoom: room, roomsVisited: nextVisited, moveTarget: null });
        get().checkAchievementsTrigger();

        // Adaptive ambient music per space station module
        const roomMusicMap: Record<string, 'exploration-command' | 'exploration-hangar' | 'exploration-lab' | 'exploration-comms'> = {
          'hangar': 'exploration-hangar',
          'science-lab': 'exploration-lab',
          'comms-array': 'exploration-comms',
          'command-center': 'exploration-command',
          'resource-bay': 'exploration-hangar',
          'mission-board': 'exploration-command',
          'hallway': 'exploration-command',
        };
        const targetScene = roomMusicMap[room] || 'exploration-command';
        musicEngine.setScene(targetScene, 0.22);
      },
      setMoveTarget: (target) => set({ moveTarget: target }),

      // Interaction
      interactionTarget: null,
      showInteractionPrompt: false,
      setInteractionTarget: (target) => set({ interactionTarget: target }),
      setShowInteractionPrompt: (show) => set({ showInteractionPrompt: show }),

      // Inventory
      inventory: { ...DEFAULT_INVENTORY },
      collectItem: (type, amount = 1) => {
        const state = get();
        const limit = COLLECTIBLE_LIMITS[type] ?? 20;
        const current = state.inventory.items[type] ?? 0;
        if (current >= limit) {
          return false;
        }

        const actualAdd = Math.min(amount, limit - current);
        const newTotal = current + actualAdd;

        // Group / Merge toasts: update existing toast if present, otherwise append
        const existingToastIndex = state.collectibleToasts.findIndex((t) => t.type === type);
        let nextToasts: CollectibleToast[];

        if (existingToastIndex >= 0) {
          const existing = state.collectibleToasts[existingToastIndex];
          const updated: CollectibleToast = {
            ...existing,
            amount: existing.amount + actualAdd,
            currentTotal: newTotal,
            timestamp: Date.now(),
          };
          nextToasts = [...state.collectibleToasts];
          nextToasts[existingToastIndex] = updated;
        } else {
          nextToasts = [
            ...state.collectibleToasts,
            {
              id: `toast-${type}-${Date.now()}`,
              type,
              amount: actualAdd,
              currentTotal: newTotal,
              maxLimit: limit,
              timestamp: Date.now(),
            },
          ];
        }

        set({
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [type]: newTotal,
            },
          },
          totalCollectiblesCount: state.totalCollectiblesCount + actualAdd,
          collectibleToasts: nextToasts,
        });

        const targetType = type;
        setTimeout(() => {
          set((s) => ({
            collectibleToasts: s.collectibleToasts.filter((t) => t.type !== targetType),
          }));
        }, 2500);

        get().checkAchievementsTrigger();
        return true;
      },
      canCollect: (type) => {
        const state = get();
        const limit = COLLECTIBLE_LIMITS[type] ?? 20;
        return (state.inventory.items[type] ?? 0) < limit;
      },
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
      totalCollectiblesCount: 0,
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
      isMinimapOpen: true,
      toggleMinimap: () => set((s) => ({ isMinimapOpen: !s.isMinimapOpen })),
      setMinimapOpen: (open) => set({ isMinimapOpen: open }),
      isPaused: false,
      togglePause: () => set((s) => ({ isPaused: !s.isPaused })),

      // Progression
      roomsVisited: ['command-center'],
      totalItemsCrafted: 0,
      incrementCraftedCount: () => {
        set((s) => ({ totalItemsCrafted: s.totalItemsCrafted + 1 }));
        get().checkAchievementsTrigger();
      },
      missionsCompleted: 0,
      endingsDiscovered: [],
      bestScore: 0,
      totalScore: 0,
      addEndingDiscovered: (endingId, score = 0) => {
        set((state) => {
          const nextEndings = state.endingsDiscovered.includes(endingId)
            ? state.endingsDiscovered
            : [...state.endingsDiscovered, endingId];
          return {
            endingsDiscovered: nextEndings,
            missionsCompleted: state.missionsCompleted + 1,
            totalScore: state.totalScore + score,
            bestScore: Math.max(state.bestScore, score),
          };
        });
        get().checkAchievementsTrigger();
      },

      // Achievements
      unlockedAchievements: [],
      achievementToasts: [],
      dismissAchievementToast: (id) =>
        set((state) => ({
          achievementToasts: state.achievementToasts.filter((t) => t.id !== id),
        })),

      // Collectible Toasts
      collectibleToasts: [],
      dismissCollectibleToast: (id) =>
        set((state) => ({
          collectibleToasts: state.collectibleToasts.filter((t) => t.id !== id),
        })),

      checkAchievementsTrigger: () => {
        const state = get();
        const stats = {
          missionsCompleted: state.missionsCompleted,
          endingsDiscovered: state.endingsDiscovered,
          totalCollectiblesFound: state.totalCollectiblesCount,
          totalItemsCrafted: state.totalItemsCrafted,
          roomsVisited: state.roomsVisited,
          totalScore: state.totalScore,
          bestScore: state.bestScore,
        };

        const newUnlocked = checkAchievements(stats, state.unlockedAchievements);
        if (newUnlocked.length > 0) {
          const newToasts: AchievementToast[] = newUnlocked.map((achId) => ({
            id: `ach-${Date.now()}-${achId}`,
            achievementId: achId,
          }));

          set({
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlocked],
            achievementToasts: [...state.achievementToasts, ...newToasts],
          });

          // Sync with localStorage key for backward compatibility
          try {
            localStorage.setItem(
              'novascript_achievements_v1',
              JSON.stringify([...state.unlockedAchievements, ...newUnlocked])
            );
          } catch { /* ignore */ }

          // Auto dismiss after 4.5s
          newToasts.forEach((t) => {
            setTimeout(() => {
              get().dismissAchievementToast(t.id);
            }, 4500);
          });
        }
      },

      // Reset exploration
      resetExplorationState: () =>
        set({
          phase: 'exploring',
          playerPosition: { x: 0, y: 0, z: 0 },
          playerFacing: 'right',
          isMoving: false,
          currentRoom: 'command-center',
          moveTarget: null,
          interactionTarget: null,
          showInteractionPrompt: false,
          activeMiniGame: null,
          isInventoryOpen: false,
          isCodexOpen: false,
          isProfileOpen: false,
          isMinimapOpen: true,
          isPaused: false,
        }),
    }),
    {
      name: 'novascript_game_world_v2',
      partialize: (state) => ({
        inventory: state.inventory,
        collectiblesFound: state.collectiblesFound,
        totalCollectiblesCount: state.totalCollectiblesCount,
        currentRoom: state.currentRoom,
        playerPosition: state.playerPosition,
        playerFacing: state.playerFacing,
        playerGender: state.playerGender,
        playerName: state.playerName,
        suitScheme: state.suitScheme,
        keybindings: state.keybindings,
        visualMode: state.visualMode,
        language: state.language,
        roomsVisited: state.roomsVisited,
        totalItemsCrafted: state.totalItemsCrafted,
        missionsCompleted: state.missionsCompleted,
        endingsDiscovered: state.endingsDiscovered,
        bestScore: state.bestScore,
        totalScore: state.totalScore,
        unlockedAchievements: state.unlockedAchievements,
      }),
    }
  )
);
