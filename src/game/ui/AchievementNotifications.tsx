/**
 * Achievement notification toast — shows when a new achievement is unlocked.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAchievementById } from '@/game/progression/achievements';

interface AchievementNotif {
  id: string;
  achievementId: string;
  timestamp: number;
}

let notifCounter = 0;

export function useAchievementNotifications() {
  const [notifications, setNotifications] = useState<AchievementNotif[]>([]);

  const notify = useCallback((achievementId: string) => {
    const id = `ach-${++notifCounter}`;
    setNotifications((prev) => [...prev, { id, achievementId, timestamp: Date.now() }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  return { notifications, notify };
}

export default function AchievementNotifications({
  notifications,
}: {
  notifications: AchievementNotif[];
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => {
        const ach = getAchievementById(notif.achievementId);
        if (!ach) return null;
        return (
          <div
            key={notif.id}
            className="glass-panel rounded-xl px-6 py-3 flex items-center gap-4 border border-amber-500/50 shadow-glow-amber animate-in slide-in-from-top duration-500"
          >
            <span className="text-3xl">{ach.icon}</span>
            <div>
              <div className="text-xs font-mono text-amber-400 tracking-widest uppercase">
                Achievement Unlocked
              </div>
              <div className="font-mono text-sm font-bold text-white mt-0.5">
                {ach.title}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {ach.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
