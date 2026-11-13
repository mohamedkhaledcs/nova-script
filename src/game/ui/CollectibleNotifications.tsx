/**
 * Collectible pickup notification toast.
 * Shows a brief animated popup when the player collects an item.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType } from '@/game/types';

interface Notification {
  id: number;
  type: CollectibleType;
  amount: number;
  timestamp: number;
}

let notifId = 0;

export function useCollectibleNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: CollectibleType, amount: number = 1) => {
    const id = ++notifId;
    setNotifications((prev) => [...prev, { id, type, amount, timestamp: Date.now() }]);

    // Auto-remove after 2 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2000);
  }, []);

  return { notifications, notify };
}

export default function CollectibleNotifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => {
        const info = COLLECTIBLE_INFO[notif.type];
        return (
          <div
            key={notif.id}
            className="glass-panel rounded-lg px-4 py-2 flex items-center gap-3 border border-cyan-500/40 animate-in slide-in-from-right duration-300 shadow-glow-cyan"
          >
            <span className="text-xl">{info.icon}</span>
            <div>
              <span className="font-mono text-xs font-bold" style={{ color: info.color }}>
                +{notif.amount} {info.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
