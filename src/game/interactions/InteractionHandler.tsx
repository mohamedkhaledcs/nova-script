/**
 * Interaction handler — processes player interactions with objects.
 * When the player presses E near an interactable, this determines what happens.
 */

'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';

interface InteractionHandlerProps {
  onStartMission: () => void;
  onOpenCrafting: () => void;
}

export default function InteractionHandler({
  onStartMission,
  onOpenCrafting,
}: InteractionHandlerProps) {
  const {
    interactionTarget,
    currentRoom,
    phase,
    isPaused,
    isInventoryOpen,
    setPhase,
    setActiveMiniGame,
  } = useGameStore();

  useEffect(() => {
    if (phase !== 'exploring' || isPaused || isInventoryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'e') return;
      if (!interactionTarget) return;

      const room = getRoomDefinition(currentRoom);
      const obj = room.interactables.find((i) => i.id === interactionTarget);
      if (!obj) return;

      e.preventDefault();

      // Handle interaction based on object type
      switch (obj.type) {
        case 'mission-board':
          onStartMission();
          break;
        case 'workbench':
          onOpenCrafting();
          break;
        case 'terminal':
        case 'control-panel':
          setPhase('interacting');
          setActiveMiniGame('terminal-' + obj.id);
          break;
        case 'science-equipment':
          setPhase('interacting');
          setActiveMiniGame('scanner');
          break;
        case 'antenna-dish':
          setPhase('interacting');
          setActiveMiniGame('antenna');
          break;
        case 'hangar-bay':
          setPhase('interacting');
          setActiveMiniGame('spacecraft-viewer');
          break;
        case 'display-screen':
          setPhase('interacting');
          setActiveMiniGame('display-' + obj.id);
          break;
        case 'storage-locker':
          // Toggle inventory when interacting with storage
          useGameStore.getState().toggleInventory();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    interactionTarget,
    currentRoom,
    phase,
    isPaused,
    isInventoryOpen,
    onStartMission,
    onOpenCrafting,
    setPhase,
    setActiveMiniGame,
  ]);

  return null;
}
