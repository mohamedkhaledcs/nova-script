/**
 * Keyboard and mouse input management hook for game controls.
 * Tracks held keys, provides movement vectors, and edge-detected action presses.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Vec2 } from '@/game/types';

export interface InputState {
  /** Normalized movement direction based on WASD/Arrow keys */
  moveDirection: Vec2;
  /** Whether any movement key is held */
  isMoving: boolean;
  /** Whether the interact key (E) is currently held */
  isInteractHeld: boolean;
  /** True on the frame E was first pressed (edge detection) */
  justPressedInteract: boolean;
  /** Whether inventory toggle (I) was just pressed */
  justPressedInventory: boolean;
  /** Whether pause (Escape) was just pressed */
  justPressedPause: boolean;
  /** Whether codex (Tab) was just pressed */
  justPressedCodex: boolean;
  /** Raw set of currently held keys */
  heldKeys: Set<string>;
  /** Clear edge-detected flags after consuming them */
  consumeActions: () => void;
}

export function useInput(): InputState {
  const heldKeysRef = useRef<Set<string>>(new Set());
  const [, forceUpdate] = useState(0);
  
  // Edge-detected action flags
  const justPressedRef = useRef({
    interact: false,
    inventory: false,
    pause: false,
    codex: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    // Prevent default for game keys
    if (['w', 'a', 's', 'd', 'e', 'i', 'tab', 'escape',
         'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      e.preventDefault();
    }

    if (!heldKeysRef.current.has(key)) {
      heldKeysRef.current.add(key);

      // Edge detection for action keys
      if (key === 'e') justPressedRef.current.interact = true;
      if (key === 'i') justPressedRef.current.inventory = true;
      if (key === 'escape') justPressedRef.current.pause = true;
      if (key === 'tab') justPressedRef.current.codex = true;

      forceUpdate((n) => n + 1);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    heldKeysRef.current.delete(key);
    forceUpdate((n) => n + 1);
  }, []);

  // Reset held keys on blur (prevent stuck keys)
  const handleBlur = useCallback(() => {
    heldKeysRef.current.clear();
    forceUpdate((n) => n + 1);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  // Compute movement vector from held keys
  const held = heldKeysRef.current;
  let mx = 0;
  let mz = 0;

  if (held.has('w') || held.has('arrowup')) mz -= 1;
  if (held.has('s') || held.has('arrowdown')) mz += 1;
  if (held.has('a') || held.has('arrowleft')) mx -= 1;
  if (held.has('d') || held.has('arrowright')) mx += 1;

  // Normalize diagonal movement
  const length = Math.sqrt(mx * mx + mz * mz);
  const moveDirection: Vec2 = length > 0
    ? { x: mx / length, y: mz / length }
    : { x: 0, y: 0 };

  const consumeActions = useCallback(() => {
    justPressedRef.current.interact = false;
    justPressedRef.current.inventory = false;
    justPressedRef.current.pause = false;
    justPressedRef.current.codex = false;
  }, []);

  return {
    moveDirection,
    isMoving: length > 0,
    isInteractHeld: held.has('e'),
    justPressedInteract: justPressedRef.current.interact,
    justPressedInventory: justPressedRef.current.inventory,
    justPressedPause: justPressedRef.current.pause,
    justPressedCodex: justPressedRef.current.codex,
    heldKeys: new Set(held),
    consumeActions,
  };
}
