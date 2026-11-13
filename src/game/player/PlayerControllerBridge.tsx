/**
 * PlayerControllerBridge — an R3F component that runs the player controller
 * inside the Canvas render loop. This bridges the input system with the 3D scene.
 */

import { usePlayerController } from '@/game/player/usePlayerController';

export default function PlayerControllerBridge() {
  usePlayerController();
  return null;
}
