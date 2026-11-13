/**
 * Inner Game Canvas — the actual R3F Canvas component.
 * This file is dynamically imported with SSR disabled via GameCanvas.tsx.
 */

'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import Room3DScene from '@/game/world/Room3DScene';
import CameraController from '@/game/world/CameraController';
import Player3D from '@/game/player/Player3D';
import PlayerControllerBridge from '@/game/player/PlayerControllerBridge';
import { useGameStore } from '@/game/store';

export default function GameCanvasInner() {
  const currentRoom = useGameStore((s) => s.currentRoom);

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 14, 10],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#02040A',
      }}
      dpr={[1, 2]}
    >
      {/* Fog for depth */}
      <fog attach="fog" args={['#02040A', 20, 50]} />

      {/* Camera follow system */}
      <CameraController />

      {/* Player controller (runs input + movement logic in the render loop) */}
      <PlayerControllerBridge />

      {/* Current room scene */}
      <Room3DScene roomId={currentRoom} />

      {/* Player character */}
      <Player3D />
    </Canvas>
  );
}
