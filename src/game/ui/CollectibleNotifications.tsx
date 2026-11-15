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
  const language = useGameStore((s) => s.language);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className={`fixed top-16 ${language === 'ar' ? 'left-4' : 'right-4'} z-40 flex flex-col gap-2 pointer-events-none select-none`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {toasts.map((toast) => {
        const info = COLLECTIBLE_INFO[toast.type];
        const isMax = toast.currentTotal >= toast.maxLimit;
        const localizedLabel =
          language === 'ar'
            ? toast.type === 'metal-scrap'
              ? 'خردة معادن'
              : toast.type === 'energy-cell'
              ? 'خلية طاقة'
              : toast.type === 'science-sample'
              ? 'عينة علمية'
              : toast.type === 'blueprint-fragment'
              ? 'جزء مخطط'
              : 'معدن نادر'
            : info.label;

        return (
          <div
            key={toast.type}
            className={`glass-panel rounded-xl px-4 py-2.5 flex items-center gap-3 border shadow-2xl transition-all duration-300 ${
              isMax
                ? 'border-amber-400/80 shadow-glow-amber bg-space-950/90'
                : 'border-cyan-500/50 shadow-glow-cyan bg-space-950/85'
            }`}
          >
            {/* Clean Vector Item Badge (Zero Emojis) */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0"
              style={{
                backgroundColor: `${info.color}25`,
                borderColor: `${info.color}60`,
                borderWidth: '1px',
                color: info.color,
              }}
            >
              {toast.type === 'metal-scrap'
                ? 'SCRP'
                : toast.type === 'energy-cell'
                ? 'FUSN'
                : toast.type === 'science-sample'
                ? 'SMPL'
                : toast.type === 'blueprint-fragment'
                ? 'SCHM'
                : 'CRYS'}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {/* Bump animation when amount increases */}
                <span
                  key={toast.timestamp}
                  className="font-mono text-sm font-black text-cyan-300 animate-in zoom-in-75 duration-200"
                  style={{ color: info.color }}
                >
                  +{toast.amount} {localizedLabel}
                </span>

                {isMax && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {language === 'ar' ? 'الحد الأقصى' : 'MAX'}
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
