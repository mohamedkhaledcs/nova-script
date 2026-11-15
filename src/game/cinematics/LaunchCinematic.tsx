/**
 * Launch Sequence Cinematic — a GSAP-powered countdown and launch animation.
 * Per AGENTS.md: GSAP is exclusively for cinematic orchestration.
 * 
 * This plays when a mission reaches a terminal answer leading to an ending.
 * It shows a dramatic countdown, engine ignition, and either successful
 * launch or failure sequence before transitioning to the mission report.
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import type { MissionEnding } from '@/types/game';
import { musicEngine } from '@/game/audio/music-engine';
import { useGameStore } from '@/game/store';
import { TRANSLATIONS } from '@/lib/i18n/translations';
import { getLocalizedEnding } from '@/lib/i18n/mission-translations-ar';

interface LaunchCinematicProps {
  ending: MissionEnding;
  destination: 'moon' | 'mars' | null;
  onComplete: () => void;
}

export default function LaunchCinematic({
  ending,
  destination,
  onComplete,
}: LaunchCinematicProps) {
  const language = useGameStore((s) => s.language);
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language || 'en'];
  const localizedEnding = getLocalizedEnding(ending, language || 'en');

  const containerRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [countdownNumber, setCountdownNumber] = useState(5);
  const [statusText, setStatusText] = useState(
    isAr ? 'تهيئة تسلسل الإطلاق الفضائي' : 'INITIALIZING LAUNCH SEQUENCE'
  );
  const [showRocket, setShowRocket] = useState(false);

  const isSuccess =
    ending.status.includes('success') || ending.status === 'scientific_discovery';
  const isLaunchFailure = ending.status === 'launch_failure';
  const isThermalFailure = ending.status === 'engineering_failure';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start dramatic launch countdown soundtrack
    musicEngine.setScene('launch', 0.35);

    const tl = gsap.timeline({
      onComplete: () => {
        // Brief pause then transition
        gsap.delayedCall(1.5, onComplete);
      },
    });

    // Phase 1: Status messages (0-2s)
    tl.call(() => setStatusText(t.statusCheckingSystems), [], 0);
    tl.call(() => setStatusText(t.statusPropulsionNominal), [], 0.8);
    tl.call(() => setStatusText(t.statusGuidanceOnline), [], 1.6);
    tl.call(() => setStatusText(t.statusCountdownInitiated), [], 2.4);

    // Phase 2: Countdown (3-8s)
    for (let i = 5; i >= 1; i--) {
      tl.call(() => setCountdownNumber(i), [], 3 + (5 - i));
    }

    // Phase 3: Ignition
    tl.call(() => {
      setCountdownNumber(0);
      setStatusText(t.statusIgnition);
      setShowRocket(true);
    }, [], 8);

    // Phase 4: Launch or failure
    if (isSuccess || ending.status === 'partial_success' || ending.status === 'strategy_revision') {
      // Successful launch
      tl.call(() => {
        setStatusText(t.statusLiftoff);
        musicEngine.setScene('victory', 0.32);
      }, [], 8.5);

      if (rocketRef.current) {
        tl.to(rocketRef.current, {
          y: -800,
          duration: 3,
          ease: 'power2.in',
          delay: 0,
        }, 8.8);
      }

      if (flameRef.current) {
        tl.to(flameRef.current, {
          scaleY: 3,
          opacity: 1,
          duration: 0.5,
        }, 8.5);
      }

      // Screen flash
      if (flashRef.current) {
        tl.to(flashRef.current, {
          opacity: 0.8,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        }, 8.5);
      }

      tl.call(() => {
        const destName = destination === 'mars' ? (isAr ? 'المريخ' : 'MARS') : (isAr ? 'القمر' : 'MOON');
        setStatusText(isAr ? `في المسار نحو ${destName}` : `EN ROUTE TO ${destName}`);
      }, [], 10);

      tl.call(() => setStatusText(localizedEnding.title.toUpperCase()), [], 11.5);

    } else if (isLaunchFailure) {
      // Launch failure — rocket shakes and falls
      tl.call(() => {
        setStatusText(isAr ? 'تحذير: تجاوز الوزن المسموح للحمولة' : 'WARNING: MASS OVERLOAD DETECTED');
        musicEngine.setScene('failure', 0.35);
      }, [], 8.5);

      if (rocketRef.current) {
        tl.to(rocketRef.current, {
          x: '+=10',
          duration: 0.05,
          repeat: 20,
          yoyo: true,
        }, 8.5);
        tl.to(rocketRef.current, {
          y: 100,
          opacity: 0.3,
          duration: 2,
          ease: 'power2.in',
        }, 9.5);
      }

      tl.call(() => setStatusText(t.statusScrubbed), [], 10);
      if (flashRef.current) {
        tl.to(flashRef.current, {
          opacity: 0.6,
          backgroundColor: '#EF4444',
          duration: 0.3,
          yoyo: true,
          repeat: 2,
        }, 9.5);
      }
      tl.call(() => setStatusText(localizedEnding.title.toUpperCase()), [], 11);

    } else if (isThermalFailure) {
      // Thermal failure — launch then burn up
      tl.call(() => setStatusText(t.statusLiftoff), [], 8.5);

      if (rocketRef.current) {
        tl.to(rocketRef.current, {
          y: -300,
          duration: 2,
          ease: 'power1.in',
        }, 8.8);
      }

      tl.call(() => {
        setStatusText(isAr ? 'خلل حراري: ارتفاع درجة الحرارة' : 'THERMAL ANOMALY DETECTED');
        musicEngine.setScene('failure', 0.35);
      }, [], 10);

      if (flashRef.current) {
        tl.to(flashRef.current, {
          opacity: 0.7,
          backgroundColor: '#F97316',
          duration: 0.5,
        }, 10.5);
        tl.to(flashRef.current, {
          opacity: 0,
          duration: 1,
        }, 11);
      }

      if (rocketRef.current) {
        tl.to(rocketRef.current, {
          opacity: 0,
          scale: 1.5,
          duration: 0.8,
        }, 10.5);
      }

      tl.call(() => setStatusText(localizedEnding.title.toUpperCase()), [], 11);
      tl.call(() => setStatusText(ending.title.toUpperCase()), [], 12);

    } else {
      // Resource failure or other
      tl.call(() => {
        setStatusText('MISSION ABORTED — RESOURCE DEPLETION');
        musicEngine.setScene('failure', 0.35);
      }, [], 8.5);
      if (flashRef.current) {
        tl.to(flashRef.current, {
          opacity: 0.5,
          backgroundColor: '#EF4444',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        }, 8.5);
      }
      tl.call(() => setStatusText(ending.title.toUpperCase()), [], 10);
    }

    return () => {
      tl.kill();
    };
  }, [ending, destination, isSuccess, isLaunchFailure, isThermalFailure, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Stars background */}
      <div className="absolute inset-0 stars-pattern opacity-40" />

      {/* Screen flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none z-10"
      />

      {/* Status text */}
      <div
        ref={statusRef}
        className="absolute top-12 left-0 right-0 text-center z-20"
      >
        <span className={`text-xs tracking-[0.25em] text-cyan-400 font-bold ${isAr ? 'font-sans' : 'font-mono uppercase'}`}>
          {statusText}
        </span>
      </div>

      {/* Countdown */}
      <div ref={countdownRef} className="z-20">
        {countdownNumber > 0 ? (
          <span className="font-mono text-9xl font-black text-white drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]">
            {countdownNumber}
          </span>
        ) : (
          <span className="font-mono text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500">
            {showRocket ? '' : 'GO'}
          </span>
        )}
      </div>

      {/* Rocket */}
      {showRocket && (
        <div ref={rocketRef} className="absolute bottom-20 z-20 flex flex-col items-center">
          {/* Simple rocket visualization */}
          <div className="flex flex-col items-center">
            {/* Nose cone */}
            <div className="w-6 h-10 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-full" />
            {/* Body */}
            <div className="w-10 h-20 bg-gradient-to-b from-slate-400 to-slate-500 border-x border-slate-300/50" />
            {/* Fins */}
            <div className="flex">
              <div className="w-4 h-8 bg-cyan-600 -skew-x-12 rounded-b" />
              <div className="w-10 h-4 bg-slate-500" />
              <div className="w-4 h-8 bg-cyan-600 skew-x-12 rounded-b" />
            </div>
          </div>
          {/* Flame */}
          <div
            ref={flameRef}
            className="w-8 h-16 bg-gradient-to-b from-orange-400 via-orange-500 to-transparent rounded-b-full opacity-0 animate-pulse origin-top"
          />
        </div>
      )}

      {/* Final message */}
      <div
        ref={messageRef}
        className="absolute bottom-8 left-0 right-0 text-center z-20"
      >
        <span className={`text-xs text-slate-500 tracking-wider font-bold ${isAr ? 'font-sans' : 'font-mono'}`}>
          {destination
            ? isAr
              ? destination === 'mars'
                ? 'الوجهة الفضائية: المريخ'
                : 'الوجهة الفضائية: القمر'
              : `TARGET: ${destination.toUpperCase()}`
            : isAr
            ? 'مركز قيادة العمليات الفضائية'
            : 'MISSION CONTROL'}
        </span>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-4 right-4 z-30 px-3 py-1.5 rounded text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors"
      >
        SKIP →
      </button>
    </div>
  );
}
