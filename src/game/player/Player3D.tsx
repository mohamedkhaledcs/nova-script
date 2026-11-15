/**
 * Enhanced Player 3D Character component.
 * Renders the astronaut (player.png) with procedural walk-cycle dynamics:
 * - Idle breathing & micro-hover oscillation
 * - Responsive walk gait with dynamic stride tilt, squash-and-stretch step cadence
 * - North/South/East/West directional orientation cues
 * - Alternating left/right footstep dust puffs and thruster micro-plumes
 * - Direct responsive positioning matching physics/input hitbox
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/game/store';

export default function Player3D() {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);

  const walkCycleRef = useRef(0);
  const idlePhaseRef = useRef(0);

  const {
    playerPosition,
    playerFacing,
    playerGender,
    isMoving,
    showInteractionPrompt,
  } = useGameStore();

  // Load both male & female astronaut textures for instantaneous switching
  const maleTexture = useLoader(THREE.TextureLoader, '/assets/characters/player.png');
  const femaleTexture = useLoader(THREE.TextureLoader, '/assets/characters/player-female.png');
  maleTexture.magFilter = THREE.NearestFilter;
  maleTexture.minFilter = THREE.NearestFilter;
  femaleTexture.magFilter = THREE.NearestFilter;
  femaleTexture.minFilter = THREE.NearestFilter;

  const texture = playerGender === 'female' ? femaleTexture : maleTexture;

  // Dust particles geometry (40 particles)
  const dustData = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 36;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.2;
      positions[i * 3 + 1] = Math.random() * 0.25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);

    // Direct responsive position alignment
    groupRef.current.position.x = playerPosition.x;
    groupRef.current.position.z = playerPosition.z;

    const baseHeight = 0.78;

    if (isMoving) {
      // Advance walk cycle (cadence matches FOOTSTEP_INTERVAL ~ 0.28s)
      walkCycleRef.current += dt * 11;
      const step = walkCycleRef.current;

      // Stride bounce (vertical step bobbing at 2x cadence)
      const bounce = Math.abs(Math.sin(step)) * 0.09;
      groupRef.current.position.y = bounce;

      // Gait roll & squash-and-stretch
      if (spriteRef.current) {
        // Lateral body sway during stride
        const roll = Math.sin(step) * 0.08;
        spriteRef.current.rotation.z = roll;

        // Squash on heel-strike, stretch on push-off
        const squash = 1 - Math.abs(Math.sin(step)) * 0.07;
        const stretch = 1 + Math.abs(Math.sin(step)) * 0.05;
        const dirScale = playerFacing === 'left' ? -1.25 : 1.25;
        spriteRef.current.scale.x = dirScale * stretch;
        spriteRef.current.scale.y = 1.25 * squash;
      }

      // Footstep dust bursts
      if (dustRef.current) {
        dustRef.current.visible = true;
        dustRef.current.rotation.y += dt * 3;
        const dustMat = dustRef.current.material as THREE.PointsMaterial;
        dustMat.opacity = 0.35 + Math.abs(Math.sin(step)) * 0.25;
      }

      // Thruster backpack micro-pulse
      if (thrusterRef.current) {
        thrusterRef.current.visible = true;
        const flameMat = thrusterRef.current.material as THREE.MeshBasicMaterial;
        flameMat.opacity = 0.4 + Math.sin(step * 2) * 0.3;
      }

      // Ground selection ring pulses with stride
      if (ringRef.current) {
        const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = 0.3 + (1 - Math.abs(Math.sin(step))) * 0.2;
        ringRef.current.scale.setScalar(0.95 + Math.abs(Math.sin(step)) * 0.1);
      }
    } else {
      // Idle state: breathing float & gentle halo pulse
      idlePhaseRef.current += dt * 2.2;
      const idleY = Math.sin(idlePhaseRef.current) * 0.04;
      groupRef.current.position.y = idleY;

      if (spriteRef.current) {
        spriteRef.current.rotation.z = THREE.MathUtils.lerp(spriteRef.current.rotation.z, 0, dt * 8);
        const breath = 1 + Math.sin(idlePhaseRef.current) * 0.02;
        const dirScale = playerFacing === 'left' ? -1.25 : 1.25;
        spriteRef.current.scale.x = dirScale;
        spriteRef.current.scale.y = 1.25 * breath;
      }

      if (dustRef.current) dustRef.current.visible = false;
      if (thrusterRef.current) thrusterRef.current.visible = false;

      if (ringRef.current) {
        const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
        ringMat.opacity = 0.25 + Math.sin(idlePhaseRef.current) * 0.1;
        ringRef.current.scale.setScalar(1.0);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground Navigation & Hotspot Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.45, 0.65, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000511" transparent opacity={0.5} />
      </mesh>

      {/* Character Billboard Sprite */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh ref={spriteRef} position={[0, 0.78, 0]} scale={[1.25, 1.25, 1]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>

      {/* Backpack Thruster Micro-Exhaust Plume */}
      <mesh
        ref={thrusterRef}
        position={[playerFacing === 'left' ? 0.35 : -0.35, 0.65, -0.1]}
        visible={false}
      >
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
      </mesh>

      {/* Footstep Dust Puffs */}
      <points ref={dustRef} position={[0, 0.05, 0]} visible={false}>
        <bufferGeometry attach="geometry" {...dustData} />
        <pointsMaterial
          color="#94A3B8"
          size={0.06}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Proximity Interaction Prompt */}
      {showInteractionPrompt && (
        <Billboard position={[0, 1.95, 0]}>
          <Text
            fontSize={0.24}
            color="#00F0FF"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {'[E] INTERACT'}
          </Text>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.1, 0.45]} />
            <meshBasicMaterial color="#020817" transparent opacity={0.8} />
          </mesh>
        </Billboard>
      )}
    </group>
  );
}
