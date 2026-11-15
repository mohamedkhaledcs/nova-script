/**
 * Keyboard and mouse input management hook for game controls.
 * Tracks held keys, provides movement vectors, and edge-detected action presses.
 * Supports Arabic keyboard layout normalization (physical key mapping).
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Vec2 } from '@/game/types';
import { useGameStore } from '@/game/store';
import { DEFAULT_KEYBINDINGS, normalizeKey, matchesKey } from '@/game/types';

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
  const keybindings = useGameStore((s) => s.keybindings) || DEFAULT_KEYBINDINGS;
  
  // Edge-detected action flags
  const justPressedRef = useRef({
    interact: false,
    inventory: false,
    pause: false,
    codex: false,
  });

  const matchesAction = useCallback(
    (action: keyof typeof DEFAULT_KEYBINDINGS, key: string) => {
      const list = keybindings[action] || DEFAULT_KEYBINDINGS[action] || [];
      return list.includes(key);
    },
    [keybindings]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = normalizeKey(e.key, e.code);
    
    // Check if key is used in any game action
    const isGameKey = Object.values(keybindings).some((list) => matchesKey(list, e));
    if (isGameKey && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
      if (['tab', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
      }
    }

    if (!heldKeysRef.current.has(key)) {
      heldKeysRef.current.add(key);

      // Edge detection for action keys
      if (matchesKey(keybindings.interact || DEFAULT_KEYBINDINGS.interact, e)) justPressedRef.current.interact = true;
      if (matchesKey(keybindings.inventory || DEFAULT_KEYBINDINGS.inventory, e)) justPressedRef.current.inventory = true;
      if (matchesKey(keybindings.pause || DEFAULT_KEYBINDINGS.pause, e)) justPressedRef.current.pause = true;
      if (matchesKey(keybindings.handbook || DEFAULT_KEYBINDINGS.handbook, e)) justPressedRef.current.codex = true;

      forceUpdate((n) => n + 1);
    }
  }, [keybindings]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = normalizeKey(e.key, e.code);
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

  // Compute movement vector from held keys based on custom keybindings
  const held = heldKeysRef.current;
  let mx = 0;
  let mz = 0;

  const fwdKeys = keybindings.moveForward || DEFAULT_KEYBINDINGS.moveForward;
  const backKeys = keybindings.moveBackward || DEFAULT_KEYBINDINGS.moveBackward;
  const leftKeys = keybindings.moveLeft || DEFAULT_KEYBINDINGS.moveLeft;
  const rightKeys = keybindings.moveRight || DEFAULT_KEYBINDINGS.moveRight;

  if (fwdKeys.some((k) => held.has(normalizeKey(k)) || held.has(k.toLowerCase()))) mz -= 1;
  if (backKeys.some((k) => held.has(normalizeKey(k)) || held.has(k.toLowerCase()))) mz += 1;
  if (leftKeys.some((k) => held.has(normalizeKey(k)) || held.has(k.toLowerCase()))) mx -= 1;
  if (rightKeys.some((k) => held.has(normalizeKey(k)) || held.has(k.toLowerCase()))) mx += 1;

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

  const interactKeys = keybindings.interact || DEFAULT_KEYBINDINGS.interact;
  const isInteractHeld = interactKeys.some((k) => held.has(k));

  return {
    moveDirection,
    isMoving: length > 0,
    isInteractHeld,
    justPressedInteract: justPressedRef.current.interact,
    justPressedInventory: justPressedRef.current.inventory,
    justPressedPause: justPressedRef.current.pause,
    justPressedCodex: justPressedRef.current.codex,
    heldKeys: new Set(held),
    consumeActions,
  };
}
