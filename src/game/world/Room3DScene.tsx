/**
 * 3D room scene renderer.
 * Renders the current room's floor, walls, portals, interactables, and collectibles
 * using procedural geometry (no loaded models).
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { getRoomDefinition } from '@/game/world/rooms';
import { useGameStore } from '@/game/store';
import type { RoomId } from '@/game/types';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleSpawn, RoomPortal } from '@/game/world/rooms';
import type { InteractableObject } from '@/game/types';

// ====================================
// Sub-components
// ====================================

function RoomFloor({ width, depth, color }: { width: number; depth: number; color: string }) {
  const setMoveTarget = useGameStore((s) => s.setMoveTarget);
  const moveTarget = useGameStore((s) => s.moveTarget);

  return (
    <group>
      {/* Main floor with click-to-move pointer handler */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          setMoveTarget({ x: e.point.x, z: e.point.z });
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Click target reticle when moving via click */}
      {moveTarget && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[moveTarget.x, 0.02, moveTarget.z]}>
          <ringGeometry args={[0.3, 0.45, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Grid lines overlay */}
      <gridHelper
        args={[Math.max(width, depth), Math.max(width, depth) / 2, '#1a2a4a', '#0d1933']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

function RoomWalls({
  width,
  depth,
  ambientColor,
  accentColor,
}: {
  width: number;
  depth: number;
  ambientColor: string;
  accentColor: string;
}) {
  const wallHeight = 3;
  const wallThickness = 0.3;
  const halfW = width / 2;
  const halfD = depth / 2;

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ambientColor,
        transparent: true,
        opacity: 0.4,
        roughness: 0.6,
        metalness: 0.3,
      }),
    [ambientColor]
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.6,
      }),
    [accentColor]
  );

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, -halfD]}>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      {/* Back wall top edge glow */}
      <mesh position={[0, wallHeight, -halfD]}>
        <boxGeometry args={[width, 0.05, wallThickness + 0.1]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, wallHeight / 2, halfD]}>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[0, wallHeight, halfD]}>
        <boxGeometry args={[width, 0.05, wallThickness + 0.1]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfW, wallHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[-halfW, wallHeight, 0]}>
        <boxGeometry args={[wallThickness + 0.1, 0.05, depth]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfW, wallHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[halfW, wallHeight, 0]}>
        <boxGeometry args={[wallThickness + 0.1, 0.05, depth]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function PortalMarker({ portal, accentColor }: { portal: RoomPortal; accentColor: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[portal.position.x, 0, portal.position.z]}>
      {/* Portal ring on ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.2, 1.6, 6]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Portal glow pillar */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.28}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {portal.label}
      </Text>
    </group>
  );
}

function InteractableMarker({ obj, accentColor }: { obj: InteractableObject; accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  // Different shapes for different types
  const getGeometry = () => {
    switch (obj.type) {
      case 'terminal':
      case 'control-panel':
        return <boxGeometry args={[0.8, 1.2, 0.4]} />;
      case 'workbench':
        return <boxGeometry args={[1.5, 0.7, 0.8]} />;
      case 'display-screen':
        return <boxGeometry args={[1.4, 0.9, 0.1]} />;
      case 'science-equipment':
        return <cylinderGeometry args={[0.3, 0.4, 1.0, 6]} />;
      case 'antenna-dish':
        return <coneGeometry args={[0.6, 1.2, 8]} />;
      case 'mission-board':
        return <boxGeometry args={[2.0, 1.5, 0.15]} />;
      case 'hangar-bay':
        return <dodecahedronGeometry args={[0.8]} />;
      case 'storage-locker':
        return <boxGeometry args={[0.7, 1.0, 0.7]} />;
      default:
        return <boxGeometry args={[0.6, 0.6, 0.6]} />;
    }
  };

  return (
    <group position={[obj.position.x, 0, obj.position.z]}>
      {/* Object base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.1} />
      </mesh>

      {/* Object mesh */}
      <mesh ref={meshRef} position={[0, 0.6, 0]}>
        {getGeometry()}
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.22}
        color="#E2E8F0"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {obj.label}
      </Text>
    </group>
  );
}

function CollectibleMarker({
  spawn,
  isCollected,
}: {
  spawn: CollectibleSpawn;
  isCollected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const info = COLLECTIBLE_INFO[spawn.type];

  useFrame((state) => {
    if (meshRef.current && !isCollected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });

  if (isCollected && !spawn.respawn) return null;

  return (
    <group position={[spawn.position.x, 0, spawn.position.z]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
          <octahedronGeometry args={[0.25]} />
          <meshStandardMaterial
            color={info.color}
            emissive={info.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      {/* Collection glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.4, 0.6, 16]} />
        <meshBasicMaterial color={info.color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ====================================
// Main Room Scene
// ====================================

export default function Room3DScene({ roomId }: { roomId: RoomId }) {
  const room = getRoomDefinition(roomId);
  const collectiblesFound = useGameStore((s) => s.collectiblesFound);

  return (
    <group>
      {/* Floor */}
      <RoomFloor width={room.size.width} depth={room.size.depth} color={room.floorColor} />

      {/* Walls */}
      <RoomWalls
        width={room.size.width}
        depth={room.size.depth}
        ambientColor={room.ambientColor}
        accentColor={room.accentColor}
      />

      {/* Portals */}
      {room.portals.map((portal) => (
        <PortalMarker key={portal.id} portal={portal} accentColor={room.accentColor} />
      ))}

      {/* Interactables */}
      {room.interactables.map((obj) => (
        <InteractableMarker key={obj.id} obj={obj} accentColor={room.accentColor} />
      ))}

      {/* Collectibles */}
      {room.collectibleSpawns.map((spawn) => (
        <CollectibleMarker
          key={spawn.id}
          spawn={spawn}
          isCollected={collectiblesFound.includes(spawn.id)}
        />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#8899BB" />
      <pointLight
        position={[0, 8, 0]}
        intensity={1.0}
        color={room.accentColor}
        distance={30}
        decay={2}
      />
      <pointLight
        position={[-8, 5, -5]}
        intensity={0.4}
        color="#3B82F6"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[8, 5, 5]}
        intensity={0.4}
        color={room.accentColor}
        distance={20}
        decay={2}
      />

      {/* Atmospheric particles */}
      <Sparkles
        count={80}
        scale={[room.size.width * 0.8, 5, room.size.depth * 0.8]}
        size={1.5}
        speed={0.3}
        opacity={0.3}
        color={room.accentColor}
      />

      {/* Room name display */}
      <Text
        position={[0, 2.8, -(room.size.depth / 2) + 0.5]}
        fontSize={0.5}
        color={room.accentColor}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {room.name.toUpperCase()}
      </Text>
    </group>
  );
}
