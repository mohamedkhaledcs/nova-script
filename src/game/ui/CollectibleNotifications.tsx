/**
 * Collectible pickup notification toast.
 * Shows a brief animated popup when the player collects an item.
 */

'use client';

import React from 'react';
import { useGameStore } from '@/game/store';
import { COLLECTIBLE_INFO } from '@/game/types';

export default function CollectibleNotifications() {
  const toasts = useGameStore((s) => s.collectibleToasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const info = COLLECTIBLE_INFO[toast.type];
        return (
          <div
            key={toast.id}
            className="glass-panel rounded-lg px-4 py-2 flex items-center gap-3 border border-cyan-500/40 animate-in slide-in-from-right duration-300 shadow-glow-cyan"
          >
            <span className="text-xl">{info.icon}</span>
            <div>
              <span className="font-mono text-xs font-bold" style={{ color: info.color }}>
                +{toast.amount} {info.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
