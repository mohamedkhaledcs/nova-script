/**
 * Collectible pickup notification toast.
 * Shows a merged, non-spamming animated popup where the counter increases
 * on the same popup, indicating current token count and capacity.
 */

'use client';

import React from 'react';
import { useGameStore } from '@/game/store';
import { COLLECTIBLE_INFO } from '@/game/types';

export default function CollectibleNotifications() {
  const toasts = useGameStore((s) => s.collectibleToasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-40 flex flex-col gap-2 pointer-events-none select-none">
      {toasts.map((toast) => {
        const info = COLLECTIBLE_INFO[toast.type];
        const isMax = toast.currentTotal >= toast.maxLimit;

        return (
          <div
            key={toast.type}
            className={`glass-panel rounded-xl px-4 py-2.5 flex items-center gap-3 border shadow-2xl transition-all duration-300 ${
              isMax
                ? 'border-amber-400/80 shadow-glow-amber bg-space-950/90'
                : 'border-cyan-500/50 shadow-glow-cyan bg-space-950/85'
            }`}
          >
            {/* Animated bouncing icon */}
            <span className="text-2xl animate-bounce-gentle">{info.icon}</span>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {/* Bump animation when amount increases */}
                <span
                  key={toast.timestamp}
                  className="font-mono text-sm font-black text-cyan-300 animate-in zoom-in-75 duration-200"
                  style={{ color: info.color }}
                >
                  +{toast.amount} {info.label}
                </span>

                {isMax && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    MAX
                  </span>
                )}
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 h-1.5 rounded-full bg-space-800 overflow-hidden border border-space-border/40">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (toast.currentTotal / toast.maxLimit) * 100)}%`,
                      backgroundColor: isMax ? '#F59E0B' : info.color,
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {toast.currentTotal} / {toast.maxLimit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
