/**
 * Enhanced 3D Room Scene Renderer.
 * Supports Dynamic Visual Modes:
 * - 'retro-pixel': Genuine 3D Minecraft Voxel Space Station (3D block cube floor with depth,
 *                  voxel block towers and crenellations, Minecraft crafting table, chest,
 *                  voxel terminal with phosphor screen, obsidian portal arch, torchlight lighting)
 * - 'cyber-neon': Cyberpunk neon luminescence (pulsing neon grid, glowing laser corner pillars,
 *                 high-saturation cyan & magenta point lights, holographic barriers)
 * - 'performance': Tactical Blueprint / Minimalist CAD mode (wireframes, blueprint floor, 120 FPS)
 * - 'cinematic-3d': Realistic deep space simulation with soft shadows & balanced PBR materials.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { getRoomDefinition } from '@/game/world/rooms';
import { useGameStore } from '@/game/store';
import type { RoomId, VisualMode } from '@/game/types';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleSpawn, RoomPortal } from '@/game/world/rooms';
import type { InteractableObject } from '@/game/types';

// ============================================================================
// 1. Room Floor Component
// ============================================================================

// 3D Raised Minecraft Voxel Floor Blocks
function VoxelFloor({ width, depth }: { width: number; depth: number }) {
  const blockSize = 1.2;
  const cols = Math.floor(width / blockSize);
  const rows = Math.floor(depth / blockSize);
  const total = cols * rows;
  const halfW = (cols * blockSize) / 2;
  const halfD = (rows * blockSize) / 2;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  React.useLayoutEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const colors = [
      new THREE.Color('#475569'),
      new THREE.Color('#52525b'),
      new THREE.Color('#334155'),
      new THREE.Color('#64748b'),
    ];

    let i = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = -halfW + c * blockSize + blockSize / 2;
        const z = -halfD + r * blockSize + blockSize / 2;
        dummy.position.set(x, 0.08, z);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        const isCenter = Math.abs(x) < 1.3 || Math.abs(z) < 1.3;
        meshRef.current.setColorAt(
          i,
          isCenter ? new THREE.Color('#0284c7') : colors[(c + r) % colors.length]
        );
        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [cols, rows, halfW, halfD, blockSize]);

  return (
    <group>
      {/* Base floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} flatShading />
      </mesh>
      {/* Raised 3D Voxel Blocks */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, total]}>
        <boxGeometry args={[blockSize - 0.08, 0.16, blockSize - 0.08]} />
        <meshStandardMaterial roughness={0.7} metalness={0.2} flatShading />
      </instancedMesh>
    </group>
  );
}

function RoomFloor({
  width,
  depth,
  color,
  visualMode,
}: {
  width: number;
  depth: number;
  color: string;
  visualMode: VisualMode;
}) {
  const setMoveTarget = useGameStore((s) => s.setMoveTarget);
  const moveTarget = useGameStore((s) => s.moveTarget);
  const blockSize = 1.2;

  return (
    <group>
      {/* Minecraft 3D Voxel Floor */}
      {visualMode === 'retro-pixel' && (
        <VoxelFloor width={width} depth={depth} />
      )}

      {/* Cyberpunk Neon Obsidian Floor */}
      {visualMode === 'cyber-neon' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial
            color="#070014"
            roughness={0.2}
            metalness={0.9}
            emissive="#0d001e"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Performance / Blueprint CAD Architectural Grid Floor */}
      {visualMode === 'performance' && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[width, depth]} />
            <meshBasicMaterial color="#041633" />
          </mesh>
          {/* Luminous Blueprint Architectural Grid Overlay */}
          <gridHelper
            args={[Math.max(width, depth), Math.round(Math.max(width, depth)), '#00F0FF', '#0284C7']}
            position={[0, 0.02, 0]}
          />
        </group>
      )}

      {/* Cinematic 3D Standard Floor */}
      {visualMode === 'cinematic-3d' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
        </mesh>
      )}

      {/* Invisible plane to always catch click-to-move pointer events */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        visible={false}
        onPointerDown={(e) => {
          e.stopPropagation();
          setMoveTarget({ x: e.point.x, z: e.point.z });
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Click target reticle when moving via click */}
      {moveTarget && (
        visualMode === 'retro-pixel' ? (
          /* Minecraft square block target reticle */
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[moveTarget.x, 0.02, moveTarget.z]}>
            <planeGeometry args={[blockSize, blockSize]} />
            <meshBasicMaterial color="#00F0FF" wireframe />
          </mesh>
        ) : (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[moveTarget.x, 0.02, moveTarget.z]}>
            <ringGeometry args={[0.3, 0.45, 16]} />
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )
      )}

      {/* Grid lines overlay for Cyber, Cinematic, and Performance */}
      {visualMode !== 'retro-pixel' && (
        <gridHelper
          args={[
            Math.max(width, depth),
            Math.max(width, depth) / 2,
            visualMode === 'cyber-neon' ? '#00F0FF' : '#1a2a4a',
            visualMode === 'cyber-neon' ? '#FF007F' : '#0d1933',
          ]}
          position={[0, 0.01, 0]}
        />
      )}
    </group>
  );
}

// ============================================================================
// 2. Room Walls Component
// ============================================================================

function RoomWalls({
  width,
  depth,
  ambientColor,
  accentColor,
  visualMode,
}: {
  width: number;
  depth: number;
  ambientColor: string;
  accentColor: string;
  visualMode: VisualMode;
}) {
  const wallHeight = 3;
  const wallThickness = 0.35;
  const halfW = width / 2;
  const halfD = depth / 2;

  // Minecraft 3D Voxel Walls
  if (visualMode === 'retro-pixel') {
    return (
      <group>
        {/* 4 Corner Voxel Towers */}
        {[
          [-halfW, -halfD],
          [halfW, -halfD],
          [-halfW, halfD],
          [halfW, halfD],
        ].map(([cx, cz], i) => (
          <group key={i} position={[cx, 0, cz]}>
            <mesh position={[0, 1.6, 0]}>
              <boxGeometry args={[1.4, 3.2, 1.4]} />
              <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, 3.3, 0]}>
              <boxGeometry args={[1.6, 0.3, 1.6]} />
              <meshStandardMaterial color={accentColor} roughness={0.7} flatShading />
            </mesh>
          </group>
        ))}

        {/* Back Wall (North) */}
        <mesh position={[0, 1.2, -halfD]}>
          <boxGeometry args={[width, 2.4, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 2.5, -halfD]}>
          <boxGeometry args={[width, 0.25, 0.9]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} flatShading />
        </mesh>

        {/* Front Wall (South) */}
        <mesh position={[0, 1.2, halfD]}>
          <boxGeometry args={[width, 2.4, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 2.5, halfD]}>
          <boxGeometry args={[width, 0.25, 0.9]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} flatShading />
        </mesh>

        {/* Left Wall (West) */}
        <mesh position={[-halfW, 1.2, 0]}>
          <boxGeometry args={[0.8, 2.4, depth]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-halfW, 2.5, 0]}>
          <boxGeometry args={[0.9, 0.25, depth]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} flatShading />
        </mesh>

        {/* Right Wall (East) */}
        <mesh position={[halfW, 1.2, 0]}>
          <boxGeometry args={[0.8, 2.4, depth]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[halfW, 2.5, 0]}>
          <boxGeometry args={[0.9, 0.25, depth]} />
          <meshStandardMaterial color={accentColor} roughness={0.7} flatShading />
        </mesh>
      </group>
    );
  }

  // Cyberpunk Neon Walls
  if (visualMode === 'cyber-neon') {
    return (
      <group>
        {/* Corner Neon Light Beams */}
        {[
          [-halfW, -halfD],
          [halfW, -halfD],
          [-halfW, halfD],
          [halfW, halfD],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, wallHeight / 2, cz]}>
            <cylinderGeometry args={[0.1, 0.1, wallHeight, 8]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        ))}

        {/* Back Wall */}
        <mesh position={[0, wallHeight / 2, -halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#110022" transparent opacity={0.6} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, wallHeight, -halfD]}>
          <boxGeometry args={[width, 0.08, wallThickness + 0.15]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>

        {/* Front Wall */}
        <mesh position={[0, wallHeight / 2, halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#110022" transparent opacity={0.6} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, wallHeight, halfD]}>
          <boxGeometry args={[width, 0.08, wallThickness + 0.15]} />
          <meshBasicMaterial color="#FF007F" />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshStandardMaterial color="#110022" transparent opacity={0.6} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-halfW, wallHeight, 0]}>
          <boxGeometry args={[wallThickness + 0.15, 0.08, depth]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>

        {/* Right Wall */}
        <mesh position={[halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshStandardMaterial color="#110022" transparent opacity={0.6} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[halfW, wallHeight, 0]}>
          <boxGeometry args={[wallThickness + 0.15, 0.08, depth]} />
          <meshBasicMaterial color="#FF007F" />
        </mesh>
      </group>
    );
  }

  // Performance / Blueprint CAD Wireframe & Translucent Schematic Walls
  if (visualMode === 'performance') {
    return (
      <group>
        {/* Back wall */}
        <mesh position={[0, wallHeight / 2, -halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <mesh position={[0, wallHeight / 2, -halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshBasicMaterial color="#0284C7" transparent opacity={0.16} />
        </mesh>
        {/* Front wall */}
        <mesh position={[0, wallHeight / 2, halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <mesh position={[0, wallHeight / 2, halfD]}>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshBasicMaterial color="#0284C7" transparent opacity={0.16} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <mesh position={[-halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshBasicMaterial color="#0284C7" transparent opacity={0.16} />
        </mesh>
        {/* Right wall */}
        <mesh position={[halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <mesh position={[halfW, wallHeight / 2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshBasicMaterial color="#0284C7" transparent opacity={0.16} />
        </mesh>
      </group>
    );
  }

  // Cinematic 3D Standard Walls
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, -halfD]}>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color={ambientColor} transparent opacity={0.4} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, wallHeight, -halfD]}>
        <boxGeometry args={[width, 0.05, wallThickness + 0.1]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, wallHeight / 2, halfD]}>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color={ambientColor} transparent opacity={0.4} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, wallHeight, halfD]}>
        <boxGeometry args={[width, 0.05, wallThickness + 0.1]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfW, wallHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={ambientColor} transparent opacity={0.4} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-halfW, wallHeight, 0]}>
        <boxGeometry args={[wallThickness + 0.1, 0.05, depth]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfW, wallHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color={ambientColor} transparent opacity={0.4} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[halfW, wallHeight, 0]}>
        <boxGeometry args={[wallThickness + 0.1, 0.05, depth]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3. Portal Marker Component
// ============================================================================

function PortalMarker({
  portal,
  accentColor,
  visualMode,
}: {
  portal: RoomPortal;
  accentColor: string;
  visualMode: VisualMode;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  // Minecraft Nether/End Portal Frame
  if (visualMode === 'retro-pixel') {
    return (
      <group position={[portal.position.x, 0, portal.position.z]}>
        {/* Left Obsidian Column */}
        <mesh position={[-0.9, 1.1, 0]}>
          <boxGeometry args={[0.35, 2.2, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} flatShading />
        </mesh>
        {/* Right Obsidian Column */}
        <mesh position={[0.9, 1.1, 0]}>
          <boxGeometry args={[0.35, 2.2, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} flatShading />
        </mesh>
        {/* Top Lintel Block */}
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[2.15, 0.35, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} flatShading />
        </mesh>
        {/* Portal Energy Sheet */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[1.45, 1.85, 0.08]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.8}
            transparent
            opacity={0.65}
            flatShading
          />
        </mesh>
        <Text
          position={[0, 2.7, 0]}
          fontSize={0.28}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
        >
          {portal.label}
        </Text>
      </group>
    );
  }

  // Standard Sci-Fi Portal Ring
  return (
    <group position={[portal.position.x, 0, portal.position.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.2, 1.6, 6]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
      </mesh>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.28}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
      >
        {portal.label}
      </Text>
    </group>
  );
}

// ============================================================================
// 4. Interactable Marker Component
// ============================================================================

function InteractableMarker({
  obj,
  accentColor,
  visualMode,
}: {
  obj: InteractableObject;
  accentColor: string;
  visualMode: VisualMode;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (visualMode === 'retro-pixel') {
        meshRef.current.rotation.y = Math.floor(state.clock.elapsedTime * 6) * (Math.PI / 8);
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
        meshRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      }
    }
  });

  // Render Minecraft Voxel Assemblies
  const renderVoxelMesh = () => {
    switch (obj.type) {
      case 'workbench':
        // Minecraft Crafting Table with 4 corner legs and tabletop slab
        return (
          <group>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.4, 0.25, 0.9]} />
              <meshStandardMaterial color="#92400E" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-0.55, 0.15, -0.32]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.55, 0.15, -0.32]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-0.55, 0.15, 0.32]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.55, 0.15, 0.32]}>
              <boxGeometry args={[0.18, 0.55, 0.18]} />
              <meshStandardMaterial color="#78350F" roughness={0.9} flatShading />
            </mesh>
          </group>
        );
      case 'storage-locker':
        // Minecraft Chest with front lock latch
        return (
          <group>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.85, 0.7, 0.85]} />
              <meshStandardMaterial color="#B45309" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 0.45, 0.44]}>
              <boxGeometry args={[0.14, 0.18, 0.08]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.6} flatShading />
            </mesh>
          </group>
        );
      case 'terminal':
      case 'control-panel':
        // Voxel Computer Console with phosphor screen
        return (
          <group>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.8, 0.5, 0.6]} />
              <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 0.75, -0.05]}>
              <boxGeometry args={[0.7, 0.55, 0.35]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 0.75, 0.13]}>
              <planeGeometry args={[0.55, 0.4]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <mesh position={[0, 0.48, 0.22]}>
              <boxGeometry args={[0.6, 0.08, 0.25]} />
              <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
            </mesh>
          </group>
        );
      case 'mission-board':
        // Voxel Mission Screen on dual posts
        return (
          <group>
            <mesh position={[-0.8, 0.7, 0]}>
              <boxGeometry args={[0.18, 1.4, 0.18]} />
              <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.8, 0.7, 0]}>
              <boxGeometry args={[0.18, 1.4, 0.18]} />
              <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[1.9, 1.0, 0.15]} />
              <meshStandardMaterial color="#1E1B4B" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, 1.0, 0.09]}>
              <planeGeometry args={[1.7, 0.8]} />
              <meshBasicMaterial color="#6366F1" />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.75, 0.75, 0.75]} />
            <meshStandardMaterial color={accentColor} roughness={0.8} flatShading />
          </mesh>
        );
    }
  };

  // Standard / Cyber / Perf geometry
  const renderStandardMesh = () => {
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
      {/* Base platform */}
      {visualMode === 'retro-pixel' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.25} wireframe />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <circleGeometry args={[1, 16]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Object group */}
      <group ref={meshRef} position={[0, 0, 0]}>
        {visualMode === 'retro-pixel' ? (
          renderVoxelMesh()
        ) : (
          <mesh position={[0, 0.6, 0]}>
            {renderStandardMesh()}
            {visualMode === 'performance' ? (
              <meshBasicMaterial color={accentColor} wireframe />
            ) : visualMode === 'cyber-neon' ? (
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.9}
              />
            ) : (
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.3}
                roughness={0.4}
                metalness={0.6}
                transparent
                opacity={0.85}
              />
            )}
          </mesh>
        )}
      </group>

      {/* Label */}
      <Text
        position={[0, 2.1, 0]}
        fontSize={0.24}
        color="#F8FAFC"
        anchorX="center"
        anchorY="middle"
      >
        {obj.label}
      </Text>
    </group>
  );
}

// ============================================================================
// 5. Collectible Marker Component
// ============================================================================

function CollectibleMarker({
  spawn,
  isCollected,
  visualMode,
}: {
  spawn: CollectibleSpawn;
  isCollected: boolean;
  visualMode: VisualMode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const info = COLLECTIBLE_INFO[spawn.type];

  useFrame((state) => {
    if (meshRef.current && !isCollected) {
      if (visualMode === 'retro-pixel') {
        meshRef.current.rotation.y = Math.floor(state.clock.elapsedTime * 6) * (Math.PI / 8);
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.rotation.y = state.clock.elapsedTime * 2;
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      }
    }
  });

  if (isCollected && !spawn.respawn) return null;

  return (
    <group position={[spawn.position.x, 0, spawn.position.z]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[0, 0.5, 0]}>
          {visualMode === 'retro-pixel' ? (
            /* Minecraft floating 3D voxel mini-block */
            <boxGeometry args={[0.35, 0.35, 0.35]} />
          ) : (
            <octahedronGeometry args={[0.25]} />
          )}
          <meshStandardMaterial
            color={info.color}
            emissive={info.color}
            emissiveIntensity={visualMode === 'cyber-neon' ? 1.0 : 0.6}
            roughness={visualMode === 'retro-pixel' ? 0.8 : 0.2}
            metalness={0.8}
            flatShading={visualMode === 'retro-pixel'}
          />
        </mesh>
      </Float>
      {/* Collection ground ring / square */}
      {visualMode === 'retro-pixel' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color={info.color} transparent opacity={0.25} wireframe />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.4, 0.6, 16]} />
          <meshBasicMaterial color={info.color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// 5.5 Aesthetic Specialty Assemblies
// ============================================================================

function RoomAestheticDecorations({
  roomId,
  visualMode,
}: {
  roomId: RoomId;
  visualMode: VisualMode;
}) {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.z = state.clock.elapsedTime * 0.8;
      ringRef1.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -state.clock.elapsedTime * 0.6;
      ringRef2.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  if (visualMode === 'retro-pixel') {
    return (
      <group>
        {/* Minecraft Central Beacon in Central Hub */}
        {roomId === 'hallway' && (
          <group position={[0, 0, 0]}>
            {/* Pyramid Base Block */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[1.8, 0.24, 1.8]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.9} flatShading />
            </mesh>
            {/* Emerald Core Tier */}
            <mesh position={[0, 0.36, 0]}>
              <boxGeometry args={[1.2, 0.24, 1.2]} />
              <meshStandardMaterial color="#10B981" roughness={0.8} flatShading />
            </mesh>
            {/* Glass Beacon Block */}
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[0.7, 0.48, 0.7]} />
              <meshStandardMaterial color="#06B6D4" roughness={0.3} transparent opacity={0.85} flatShading />
            </mesh>
            {/* Vertical Skybeam Light Column */}
            <mesh position={[0, 7.5, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 14, 16]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} />
            </mesh>
            <pointLight position={[0, 1.5, 0]} intensity={1.8} color="#00F0FF" distance={16} decay={1.5} />
          </group>
        )}

        {/* Minecraft Bookshelves in Science Lab */}
        {roomId === 'science-lab' && (
          <group position={[0, 1.2, -6.8]}>
            {[-1.2, 0, 1.2].map((bx, idx) => (
              <group key={idx} position={[bx, 0, 0]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[1.1, 1.1, 0.35]} />
                  <meshStandardMaterial color="#78350F" roughness={0.9} flatShading />
                </mesh>
                <mesh position={[0, 0.24, 0.1]}>
                  <boxGeometry args={[0.92, 0.32, 0.18]} />
                  <meshStandardMaterial color="#EF4444" roughness={0.9} flatShading />
                </mesh>
                <mesh position={[0, -0.24, 0.1]}>
                  <boxGeometry args={[0.92, 0.32, 0.18]} />
                  <meshStandardMaterial color="#3B82F6" roughness={0.9} flatShading />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Minecraft Anvil in Hangar Bay */}
        {roomId === 'hangar' && (
          <group position={[-3.5, 0, -2.5]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.9, 0.2, 0.6]} />
              <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.4, 0.25, 0.35]} />
              <meshStandardMaterial color="#1E293B" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[1.1, 0.22, 0.5]} />
              <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  if (visualMode === 'cyber-neon') {
    return (
      <group>
        <group position={[0, 2.2, 0]}>
          <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.8, 0.04, 16, 64]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <mesh ref={ringRef2} rotation={[-Math.PI / 4, 0, 0]}>
            <torusGeometry args={[2.3, 0.04, 16, 64]} />
            <meshBasicMaterial color="#FF007F" />
          </mesh>
        </group>
      </group>
    );
  }

  if (visualMode === 'performance') {
    return (
      <group>
        {roomId === 'hallway' && (
          <group position={[0, 2.2, 0]}>
            {/* Holographic Wireframe Station Gyroscope & Measurement Rings */}
            <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[2.0, 0.03, 8, 48]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
            <mesh ref={ringRef2} rotation={[-Math.PI / 4, 0, 0]}>
              <torusGeometry args={[2.5, 0.03, 8, 48]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <octahedronGeometry args={[1.2, 1]} />
              <meshBasicMaterial color="#0284C7" wireframe />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  return null;
}

// ============================================================================
// 6. Main Room Scene
// ============================================================================

export default function Room3DScene({ roomId }: { roomId: RoomId }) {
  const room = getRoomDefinition(roomId);
  const collectiblesFound = useGameStore((s) => s.collectiblesFound);
  const visualMode = useGameStore((s) => s.visualMode);

  return (
    <group>
      {/* Aesthetic Specialty Assemblies */}
      <RoomAestheticDecorations roomId={roomId} visualMode={visualMode} />

      {/* Floor */}
      <RoomFloor
        width={room.size.width}
        depth={room.size.depth}
        color={room.floorColor}
        visualMode={visualMode}
      />

      {/* Walls */}
      <RoomWalls
        width={room.size.width}
        depth={room.size.depth}
        ambientColor={room.ambientColor}
        accentColor={room.accentColor}
        visualMode={visualMode}
      />

      {/* Portals */}
      {room.portals.map((portal) => (
        <PortalMarker
          key={portal.id}
          portal={portal}
          accentColor={room.accentColor}
          visualMode={visualMode}
        />
      ))}

      {/* Interactables */}
      {room.interactables.map((obj) => (
        <InteractableMarker
          key={obj.id}
          obj={obj}
          accentColor={room.accentColor}
          visualMode={visualMode}
        />
      ))}

      {/* Collectibles */}
      {room.collectibleSpawns.map((spawn) => (
        <CollectibleMarker
          key={spawn.id}
          spawn={spawn}
          isCollected={collectiblesFound.includes(spawn.id)}
          visualMode={visualMode}
        />
      ))}

      {/* Dynamic Lighting by Visual Mode */}
      {visualMode === 'retro-pixel' ? (
        <>
          {/* Minecraft Torchlight & Sunlight Illumination */}
          <ambientLight intensity={1.15} color="#D4C5B5" />
          <directionalLight position={[12, 18, 10]} intensity={1.0} color="#FFE4B5" />
          <pointLight
            position={[0, 7, 0]}
            intensity={2.2}
            color="#FFA500"
            distance={36}
            decay={1.4}
          />
          <pointLight
            position={[-8, 5, -5]}
            intensity={1.4}
            color="#00E5FF"
            distance={28}
            decay={1.4}
          />
          <pointLight
            position={[8, 5, 5]}
            intensity={1.4}
            color="#FF8800"
            distance={28}
            decay={1.4}
          />
          <Sparkles
            count={32}
            scale={[room.size.width * 0.8, 5, room.size.depth * 0.8]}
            size={3.2}
            speed={0.25}
            opacity={0.6}
            color="#FF9922"
          />
        </>
      ) : visualMode === 'cyber-neon' ? (
        <>
          {/* Cyberpunk Saturated Neon Lights */}
          <ambientLight intensity={0.7} color="#350059" />
          <pointLight
            position={[0, 8, 0]}
            intensity={2.6}
            color="#00F0FF"
            distance={35}
            decay={2}
          />
          <pointLight
            position={[-8, 6, -5]}
            intensity={2.4}
            color="#FF007F"
            distance={28}
            decay={2}
          />
          <pointLight
            position={[8, 6, 5]}
            intensity={1.9}
            color="#FFE600"
            distance={28}
            decay={2}
          />
          <Sparkles
            count={140}
            scale={[room.size.width * 0.8, 5, room.size.depth * 0.8]}
            size={2.2}
            speed={0.5}
            opacity={0.65}
            color="#00F0FF"
          />
        </>
      ) : visualMode === 'performance' ? (
        <>
          {/* Architectural CAD Blueprint Technical Lighting */}
          <ambientLight intensity={0.85} color="#0284C7" />
          <directionalLight position={[0, 15, 0]} intensity={0.9} color="#38BDF8" />
          <pointLight position={[0, 6, 0]} intensity={1.4} color="#00F0FF" distance={25} />
        </>
      ) : (
        /* Cinematic 3D Realistic Lighting */
        <>
          <ambientLight intensity={0.35} color="#8899BB" />
          <pointLight
            position={[0, 8, 0]}
            intensity={1.1}
            color={room.accentColor}
            distance={30}
            decay={2}
          />
          <pointLight
            position={[-8, 5, -5]}
            intensity={0.5}
            color="#3B82F6"
            distance={20}
            decay={2}
          />
          <pointLight
            position={[8, 5, 5]}
            intensity={0.5}
            color={room.accentColor}
            distance={20}
            decay={2}
          />
          <Sparkles
            count={80}
            scale={[room.size.width * 0.8, 5, room.size.depth * 0.8]}
            size={1.5}
            speed={0.3}
            opacity={0.3}
            color={room.accentColor}
          />
        </>
      )}

      {/* Room name display */}
      <Text
        position={[0, 2.8, -(room.size.depth / 2) + 0.5]}
        fontSize={0.5}
        color={room.accentColor}
        anchorX="center"
        anchorY="middle"
      >
        {room.name.toUpperCase()}
      </Text>
    </group>
  );
}
