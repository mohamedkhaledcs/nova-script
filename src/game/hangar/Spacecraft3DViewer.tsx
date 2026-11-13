/**
 * 3D Spacecraft Viewer component with OrbitControls.
 * Renders a procedural deep-space probe with modular attachments
 * (hull plating, solar wings, high-gain dish, propulsion bell, payload).
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Spacecraft3DViewerProps {
  hasGoldenHull?: boolean;
  hasPlasmaThrusters?: boolean;
  hasAntennaUpgrade?: boolean;
  hasScienceModule?: boolean;
}

function SpacecraftModel({
  hasGoldenHull,
  hasPlasmaThrusters,
  hasAntennaUpgrade,
  hasScienceModule,
}: Spacecraft3DViewerProps) {
  const craftRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (craftRef.current) {
      craftRef.current.rotation.y = t * 0.15;
    }
    if (dishRef.current) {
      dishRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }
    if (leftWingRef.current && rightWingRef.current) {
      const angle = Math.sin(t * 0.8) * 0.03;
      leftWingRef.current.rotation.x = angle;
      rightWingRef.current.rotation.x = -angle;
    }
  });

  const busColor = hasGoldenHull ? '#F59E0B' : '#64748B';
  const busMetalness = hasGoldenHull ? 0.9 : 0.6;
  const busRoughness = hasGoldenHull ? 0.2 : 0.4;

  return (
    <group ref={craftRef} position={[0, 0, 0]}>
      {/* Central Equipment Bus (Octagonal Prism) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.8, 8]} />
        <meshStandardMaterial
          color={busColor}
          metalness={busMetalness}
          roughness={busRoughness}
        />
      </mesh>

      {/* Top Deck Equipment */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[1.0, 1.1, 0.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* High-Gain Parabolic Antenna Dish */}
      <group ref={dishRef} position={[0, 1.4, 0]} rotation={[0.3, 0, 0]}>
        {/* Support Mast */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} />
        </mesh>
        {/* Parabolic Dish Bowl */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[hasAntennaUpgrade ? 1.1 : 0.85, 0.4, 24, 1, true]} />
          <meshStandardMaterial
            color={hasAntennaUpgrade ? '#38BDF8' : '#E2E8F0'}
            metalness={0.8}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Feed Horn */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} />
        </mesh>
      </group>

      {/* Solar Array Wing (Left) */}
      <group ref={leftWingRef} position={[-2.4, 0, 0]}>
        {/* Boom strut */}
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Solar Panels (Dual segment) */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[1.8, 0.04, 1.2]} />
          <meshStandardMaterial
            color="#1E3A8A"
            emissive="#0C1E4A"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Solar Array Wing (Right) */}
      <group ref={rightWingRef} position={[2.4, 0, 0]}>
        {/* Boom strut */}
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Solar Panels */}
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[1.8, 0.04, 1.2]} />
          <meshStandardMaterial
            color="#1E3A8A"
            emissive="#0C1E4A"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Science Module Bay (if crafted) */}
      {hasScienceModule && (
        <group position={[0, 0, 1.2]}>
          <mesh>
            <boxGeometry args={[0.9, 0.8, 0.6]} />
            <meshStandardMaterial color="#06B6D4" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.32]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#06B6D4"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Main Propulsion Rocket Engine (Bottom) */}
      <group position={[0, -1.3, 0]}>
        {/* Engine Bell */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.55, 0.8, 16, 1, true]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.85}
            roughness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Thruster Plume Glow */}
        <mesh position={[0, -0.6, 0]}>
          <coneGeometry args={[0.35, 0.9, 16]} />
          <meshBasicMaterial
            color={hasPlasmaThrusters ? '#00F0FF' : '#F97316'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* RCS Attitude Control Thruster Pods (4 corners) */}
      {[-0.9, 0.9].map((x) =>
        [-0.9, 0.9].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.2, z]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function Spacecraft3DViewer(props: Spacecraft3DViewerProps) {
  return (
    <div className="w-full h-full min-h-[320px] relative bg-space-950 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#00F0FF" />
        <pointLight position={[0, -5, 2]} intensity={0.8} color="#F59E0B" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <SpacecraftModel {...props} />
        </Float>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={9}
          autoRotate={false}
        />
      </Canvas>
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
        🖱️ Click & Drag to Rotate | Scroll to Zoom
      </div>
    </div>
  );
}
