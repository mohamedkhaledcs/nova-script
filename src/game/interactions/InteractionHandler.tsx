/**
 * Interaction handler — processes player interactions with objects.
 * Supports:
 * - Customizable keyboard keys (bindings.interact)
 * - Mouse double-click (dblclick)
 * - Mobile double-tap on screen (touchend < 320ms)
 * - Global custom event ('novascript:interact') from on-screen HUD buttons
 */

'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import { DEFAULT_KEYBINDINGS } from '@/game/types';
import { audio } from '@/lib/audio/audio-manager';

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
    isCodexOpen,
    isProfileOpen,
    keybindings,
    setPhase,
    setActiveMiniGame,
  } = useGameStore();

  const lastTapRef = useRef<number>(0);

  const triggerInteraction = useCallback(() => {
    if (phase !== 'exploring' || isPaused || isInventoryOpen || isCodexOpen || isProfileOpen) return;
    if (!interactionTarget) return;

    const room = getRoomDefinition(currentRoom);
    const obj = room.interactables.find((i) => i.id === interactionTarget);
    if (!obj) return;

    audio.click();

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
        useGameStore.getState().toggleInventory();
        break;
      default:
        break;
    }
  }, [
    interactionTarget,
    currentRoom,
    phase,
    isPaused,
    isInventoryOpen,
    isCodexOpen,
    isProfileOpen,
    onStartMission,
    onOpenCrafting,
    setPhase,
    setActiveMiniGame,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();
      const bindings = keybindings || DEFAULT_KEYBINDINGS;
      const interactKeys = bindings.interact || DEFAULT_KEYBINDINGS.interact;

      if (interactKeys.includes(key)) {
        if (interactionTarget) {
          e.preventDefault();
          triggerInteraction();
        }
      }
    };

    // Mouse double-click handler
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
        return;
      }
      if (interactionTarget) {
        triggerInteraction();
      }
    };

    // Mobile double-tap handler
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
        return;
      }
      const now = Date.now();
      if (now - lastTapRef.current < 320) {
        if (interactionTarget) {
          triggerInteraction();
        }
      }
      lastTapRef.current = now;
    };

    // Global custom event listener (for on-screen mobile/HUD interaction button)
    const handleCustomInteract = () => {
      triggerInteraction();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('novascript:interact', handleCustomInteract);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('novascript:interact', handleCustomInteract);
    };
  }, [keybindings, interactionTarget, triggerInteraction]);

  return null;
}
