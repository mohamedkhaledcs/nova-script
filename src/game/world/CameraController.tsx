/**
 * Camera controller component for the 3D scene.
 * Follows the player with smooth lerp interpolation at an elevated isometric-ish angle.
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/game/store';

const CAMERA_HEIGHT = 14;
const CAMERA_OFFSET_Z = 10;
const LERP_SPEED = 3;

export default function CameraController() {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const { playerPosition } = useGameStore();

  useFrame((_, delta) => {
    // Target position: above and behind the player
    targetRef.current.set(
      playerPosition.x,
      CAMERA_HEIGHT,
      playerPosition.z + CAMERA_OFFSET_Z
    );

    // Smooth follow
    camera.position.lerp(targetRef.current, LERP_SPEED * delta);
    
    // Always look at player area (slightly ahead)
    const lookTarget = new THREE.Vector3(
      playerPosition.x,
      0,
      playerPosition.z
    );
    camera.lookAt(lookTarget);
  });

  return null;
}
