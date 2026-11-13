/**
 * Player 3D sprite component.
 * Renders the astronaut player.png as a billboard sprite in the 3D scene.
 * Uses useFrame for bobbing animation (NOT GSAP — GSAP is for cinematics only).
 */

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/game/store';

export default function Player3D() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const bobPhaseRef = useRef(0);

  const { playerPosition, playerFacing, isMoving, showInteractionPrompt, interactionTarget } = useGameStore();

  // Load player texture
  const texture = useLoader(THREE.TextureLoader, '/assets/characters/player.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Dust particles geometry
  const dustGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = Math.random() * 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth position interpolation
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      playerPosition.x,
      10 * delta
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      playerPosition.z,
      10 * delta
    );

    // Bobbing animation
    bobPhaseRef.current += delta * (isMoving ? 8 : 2);
    const bobAmount = isMoving ? 0.08 : 0.04;
    groupRef.current.position.y = Math.sin(bobPhaseRef.current) * bobAmount;

    // Selection ring pulse
    if (ringRef.current) {
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = 0.3 + Math.sin(bobPhaseRef.current * 1.5) * 0.15;
    }

    // Dust visibility
    if (dustRef.current) {
      dustRef.current.visible = isMoving;
      if (isMoving) {
        dustRef.current.rotation.y += delta * 2;
        const mat = dustRef.current.material as THREE.PointsMaterial;
        mat.opacity = 0.4 + Math.sin(bobPhaseRef.current) * 0.2;
      }
    }
  });

  const scaleX = playerFacing === 'left' ? -1 : 1;

  return (
    <group ref={groupRef}>
      {/* Selection ring on ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Player sprite as billboard */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh scale={[scaleX * 1.2, 1.2, 1]} position={[0, 0.75, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>

      {/* Dust particles when moving */}
      <points ref={dustRef} visible={false}>
        <bufferGeometry attach="geometry" {...dustGeometry} />
        <pointsMaterial
          color="#8899AA"
          size={0.06}
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Interaction prompt */}
      {showInteractionPrompt && (
        <Billboard position={[0, 2, 0]}>
          <Text
            fontSize={0.22}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {'[E] INTERACT'}
          </Text>
          {/* Glow backing */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2, 0.4]} />
            <meshBasicMaterial color="#000820" transparent opacity={0.7} />
          </mesh>
        </Billboard>
      )}
    </group>
  );
}
