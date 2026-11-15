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
  const visualMode = useGameStore((s) => s.visualMode);

  // Dynamic visual configurations based on visualMode
  const modeConfig = React.useMemo(() => {
    switch (visualMode) {
      case 'retro-pixel':
        return {
          dpr: 0.32, // Low-res buffer for genuine 16-bit chunky pixelation
          antialias: false,
          fogColor: '#050a14',
          fogNear: 16,
          fogFar: 44,
          style: {
            width: '100%',
            height: '100%',
            background: '#040710',
            imageRendering: 'pixelated' as const,
            filter: 'contrast(1.35) saturate(1.25) brightness(1.05)',
          },
        };
      case 'cyber-neon':
        return {
          dpr: [1, 1.5] as [number, number],
          antialias: true,
          fogColor: '#0c001a',
          fogNear: 14,
          fogFar: 45,
          style: {
            width: '100%',
            height: '100%',
            background: '#070014',
            filter: 'saturate(2.2) contrast(1.35) brightness(1.15) hue-rotate(-12deg)',
          },
        };
      case 'performance':
        return {
          dpr: 1,
          antialias: false,
          fogColor: '#02040A',
          fogNear: 25,
          fogFar: 60,
          style: {
            width: '100%',
            height: '100%',
            background: '#02040A',
          },
        };
      default: // cinematic-3d
        return {
          dpr: [1, 2] as [number, number],
          antialias: true,
          fogColor: '#02040A',
          fogNear: 20,
          fogFar: 50,
          style: {
            width: '100%',
            height: '100%',
            background: '#02040A',
          },
        };
    }
  }, [visualMode]);

  return (
    <Canvas
      key={visualMode} // Remount canvas when visualMode changes to cleanly reinitialize WebGL buffer resolution
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 14, 10],
      }}
      gl={{
        antialias: modeConfig.antialias,
        alpha: false,
        powerPreference: visualMode === 'performance' ? 'low-power' : 'high-performance',
      }}
      style={modeConfig.style}
      dpr={modeConfig.dpr}
    >
      {/* Fog for depth */}
      <fog attach="fog" args={[modeConfig.fogColor, modeConfig.fogNear, modeConfig.fogFar]} />

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
