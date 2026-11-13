/**
 * Animated starfield background for the game.
 * Uses CSS animations for a deep-space star parallax effect.
 */

'use client';

import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export default function StarfieldBackground() {
  const stars = useMemo<Star[]>(() => {
    const colors = ['#FFFFFF', '#A5F3FC', '#E2E8F0', '#38BDF8', '#67E8F9'];
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 6,
      delay: Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-space-950">
      {/* Nebula glow */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-cyan-900/5 blur-[200px] -top-80 -left-40" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-900/8 blur-[180px] -bottom-40 -right-20" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-900/5 blur-[150px] top-1/3 right-1/4" />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: inherit; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}
