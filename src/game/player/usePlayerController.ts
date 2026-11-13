/**
 * Player controller hook for the 3D scene.
 * Runs inside an R3F component. Updates player position, 
 * handles collisions, portal transitions, and proximity detection.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/game/store';
import { getRoomDefinition } from '@/game/world/rooms';
import { useInput } from '@/game/input/useInput';
import { playFootstep, playPickup, playPortal, playInteractPrompt } from '@/game/audio/exploration-sfx';
import type { Vec3 } from '@/game/types';

const PLAYER_SPEED = 6; // units per second
const PORTAL_ACTIVATE_RADIUS = 2.0;
const INTERACT_DETECT_RADIUS = 3.5;
const WALL_MARGIN = 1.0;
const FOOTSTEP_INTERVAL = 0.28; // seconds between footstep sounds

function distance2D(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function usePlayerController() {
  const input = useInput();
  const portalCooldownRef = useRef(0);
  const actionsConsumedRef = useRef(false);
  const footstepTimerRef = useRef(0);
  const footstepCountRef = useRef(0);
  const prevInteractionTargetRef = useRef<string | null>(null);

  const {
    playerPosition,
    currentRoom,
    phase,
    setPlayerPosition,
    setPlayerFacing,
    setIsMoving,
    setCurrentRoom,
    setInteractionTarget,
    setShowInteractionPrompt,
    isInventoryOpen,
    isCodexOpen,
    isPaused,
    toggleInventory,
    toggleCodex,
    togglePause,
    setInventoryOpen,
    collectiblesFound,
    markCollectibleFound,
    collectItem,
  } = useGameStore();

  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps on tab-switch
    const dt = Math.min(delta, 0.1);

    // Decrease portal cooldown
    if (portalCooldownRef.current > 0) {
      portalCooldownRef.current -= dt;
    }

    // Handle UI toggle actions (even when not exploring)
    if (!actionsConsumedRef.current) {
      if (input.justPressedInventory) {
        toggleInventory();
      }
      if (input.justPressedCodex) {
        toggleCodex();
      }
      if (input.justPressedPause) {
        if (isInventoryOpen) {
          setInventoryOpen(false);
        } else {
          togglePause();
        }
      }
      actionsConsumedRef.current = true;
      input.consumeActions();
    } else {
      // Reset the consumed flag when no action keys are pressed
      if (!input.justPressedInteract && !input.justPressedInventory &&
          !input.justPressedPause && !input.justPressedCodex) {
        actionsConsumedRef.current = false;
      }
    }

    // Only process movement during exploration phase
    if (phase !== 'exploring' || isPaused || isInventoryOpen || isCodexOpen) {
      setIsMoving(false);
      return;
    }

    const room = getRoomDefinition(currentRoom);
    const halfW = room.size.width / 2 - WALL_MARGIN;
    const halfD = room.size.depth / 2 - WALL_MARGIN;

    // Movement
    if (input.isMoving) {
      const newX = playerPosition.x + input.moveDirection.x * PLAYER_SPEED * dt;
      const newZ = playerPosition.z + input.moveDirection.y * PLAYER_SPEED * dt;

      // Clamp to room boundaries
      const clampedX = Math.max(-halfW, Math.min(halfW, newX));
      const clampedZ = Math.max(-halfD, Math.min(halfD, newZ));

      setPlayerPosition({ x: clampedX, y: 0, z: clampedZ });
      setIsMoving(true);

      // Footstep sounds
      footstepTimerRef.current += dt;
      if (footstepTimerRef.current >= FOOTSTEP_INTERVAL) {
        footstepTimerRef.current = 0;
        footstepCountRef.current++;
        playFootstep(0.12, footstepCountRef.current);
      }

      // Update facing direction
      if (input.moveDirection.x > 0.1) setPlayerFacing('right');
      if (input.moveDirection.x < -0.1) setPlayerFacing('left');
    } else {
      setIsMoving(false);
      footstepTimerRef.current = FOOTSTEP_INTERVAL; // Ready to play immediately on next move
    }

    // Portal detection
    if (portalCooldownRef.current <= 0) {
      for (const portal of room.portals) {
        if (distance2D(playerPosition, portal.position) < PORTAL_ACTIVATE_RADIUS) {
          // Transition to new room
          const targetRoom = getRoomDefinition(portal.targetRoom);
          setCurrentRoom(portal.targetRoom);
          setPlayerPosition({ ...targetRoom.playerSpawn });
          portalCooldownRef.current = 0.5; // Half second cooldown
          playPortal(0.25);
          break;
        }
      }
    }

    // Interactable proximity detection
    let closestInteractable: string | null = null;
    let closestDist = Infinity;

    for (const obj of room.interactables) {
      if (!obj.isActive) continue;
      const dist = distance2D(playerPosition, obj.position);
      if (dist < obj.interactionRadius && dist < closestDist) {
        closestDist = dist;
        closestInteractable = obj.id;
      }
    }

    // Collectible proximity detection & auto-pickup
    for (const spawn of room.collectibleSpawns) {
      if (collectiblesFound.includes(spawn.id) && !spawn.respawn) continue;
      const dist = distance2D(playerPosition, spawn.position);
      if (dist < 1.5) {
        markCollectibleFound(spawn.id);
        collectItem(spawn.type, 1);
        playPickup(0.3);
      }
    }

    // Interaction prompt sound (only on target change)
    if (closestInteractable !== prevInteractionTargetRef.current) {
      if (closestInteractable !== null) {
        playInteractPrompt(0.1);
      }
      prevInteractionTargetRef.current = closestInteractable;
    }

    setInteractionTarget(closestInteractable);
    setShowInteractionPrompt(closestInteractable !== null);
  });

  return input;
}
