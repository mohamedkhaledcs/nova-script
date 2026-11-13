'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Suppress custom cursor on touch devices
    if (typeof window !== 'undefined') {
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(touch);
      if (touch) return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
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
  }, []);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'transform 0.04s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }}
    >
      <div
        className={`relative transition-transform duration-100 ${
          isClicking ? 'scale-90 translate-y-1' : isHovering ? '-rotate-12 scale-110' : 'rotate-0 scale-100'
        }`}
        style={{
          transformOrigin: '50% 6%', // Hotspot at top rocket tip
          marginTop: '-4px',
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
          className="pixel-art drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)]"
          draggable={false}
        />

        {/* Thruster Flame Pulse */}
        <div
          className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 blur-[2px] transition-all duration-75 ${
            isClicking ? 'w-4 h-6 bg-orange-400 opacity-100' : 'w-2 h-3 opacity-60'
          }`}
        />
      </div>
    </div>
  );
}
