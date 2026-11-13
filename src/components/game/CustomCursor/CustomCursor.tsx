/**
 * Custom in-DOM Rocket Cursor.
 * Renders rocket-cursor.png as the game pointer with instant zero-lag tracking,
 * thruster exhaust pulses, hover rotation, click recoil, and clean fallback.
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is strictly touch-only (no mouse/trackpad pointer)
    if (typeof window !== 'undefined') {
      const isTouchOnly =
        window.matchMedia('(pointer: coarse)').matches &&
        !window.matchMedia('(pointer: fine)').matches;
      if (isTouchOnly) return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Reveal on first mouse motion
      if (!isVisible) setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest(
          'button, a, input, select, textarea, [role="button"], .cursor-pointer'
        );
        setIsHovering(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'opacity 0.15s ease-out', // Zero lag on position transform!
      }}
      aria-hidden="true"
    >
      <div
        className={`relative transition-transform duration-75 ${
          isClicking
            ? 'scale-90 translate-y-0.5'
            : isHovering
            ? '-rotate-12 scale-110'
            : 'rotate-0 scale-100'
        }`}
        style={{
          transformOrigin: '18px 3px', // Rocket tip hotspot
          marginTop: '-3px',
          marginLeft: '-18px',
        }}
      >
        {/* Rocket Image Pointer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/cursor/rocket-cursor.png"
          alt="Rocket Cursor"
          width={36}
          height={54}
          className="pixel-art drop-shadow-[0_2px_8px_rgba(0,240,255,0.5)]"
          draggable={false}
        />

        {/* Thruster Flame Pulse */}
        <div
          className={`absolute bottom-[-5px] left-1/2 -translate-x-1/2 rounded-full blur-[1.5px] transition-all duration-75 ${
            isClicking
              ? 'w-4 h-6 bg-gradient-to-b from-orange-400 to-red-500 opacity-100'
              : 'w-2 h-3.5 bg-gradient-to-b from-cyan-300 to-blue-500 opacity-70'
          }`}
        />
      </div>
    </div>
  );
}
