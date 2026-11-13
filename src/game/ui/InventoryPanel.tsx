/**
 * Full inventory panel overlay.
 * Shows all collected items, their descriptions, and current quantities.
 * This is SUPPLEMENTARY inventory — no effect on canonical resources.
 */

'use client';

import React from 'react';
import { X, Package } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType } from '@/game/types';

export default function InventoryPanel() {
  const { inventory, isInventoryOpen, setInventoryOpen } = useGameStore();

  if (!isInventoryOpen) return null;

  const totalItems = Object.values(inventory.items).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full glass-panel rounded-2xl border border-cyan-500/40 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-space-border/60">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono font-bold text-lg text-white tracking-wider">
              INVENTORY
            </h3>
            <span className="text-xs font-mono text-slate-400 ml-2">
              {totalItems} / {inventory.maxCapacity}
            </span>
          </div>
          <button
            onClick={() => setInventoryOpen(false)}
            className="p-1.5 rounded-lg hover:bg-space-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items grid */}
        <div className="mt-4 space-y-3">
          {(Object.entries(COLLECTIBLE_INFO) as [CollectibleType, typeof COLLECTIBLE_INFO[CollectibleType]][]).map(
            ([type, info]) => {
              const count = inventory.items[type];
              const isEmpty = count === 0;

              return (
                <div
                  key={type}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    isEmpty
                      ? 'bg-space-950/50 border-space-border/30 opacity-50'
                      : 'bg-space-900/80 border-space-border/60 hover:border-cyan-500/40'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{
                      backgroundColor: `${info.color}15`,
                      borderColor: `${info.color}40`,
                      borderWidth: '1px',
                    }}
                  >
                    {info.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color: info.color }}>
                        {info.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {info.description}
                    </p>
                  </div>

                  {/* Count */}
                  <div className="shrink-0">
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: isEmpty ? '#475569' : info.color }}
                    >
                      {count}
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-4 pt-3 border-t border-space-border/30 text-center">
          <p className="text-xs font-mono text-slate-500">
            Collect materials throughout the station to craft upgrades.
            <br />
            Press [I] or [Esc] to close.
          </p>
        </div>
      </div>
    </div>
  );
}
