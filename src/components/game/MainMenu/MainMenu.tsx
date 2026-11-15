'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Play, RotateCcw, Sliders, Info, ShieldCheck, User, BookOpen, Globe } from 'lucide-react';
import { audio } from '@/lib/audio/audio-manager';
import { musicEngine } from '@/game/audio/music-engine';
import { useGameStore } from '@/game/store';
import { TRANSLATIONS } from '@/lib/i18n/translations';

interface MainMenuProps {
  hasSavedMission: boolean;
  onStartNewMission: () => void;
  onResumeMission: () => void;
  onOpenSettings: () => void;
}

export default function MainMenu({
  hasSavedMission,
  onStartNewMission,
  onResumeMission,
  onOpenSettings,
}: MainMenuProps) {
  const [showAbout, setShowAbout] = useState(false);
  const {
    playerGender,
    setPlayerGender,
    playerName,
    language,
    setLanguage,
    toggleProfile,
    toggleCodex,
  } = useGameStore();

  const t = TRANSLATIONS[language || 'en'];

  const avatarSrc =
    playerGender === 'female'
      ? '/assets/characters/player-female.png'
      : '/assets/characters/player.png';

  useEffect(() => {
    const handleFirstInteraction = () => {
      musicEngine.setScene('menu', 0.22);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center deep-space-bg stars-pattern px-4 py-12 select-none overflow-hidden">
      {/* Language Switcher in Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => {
            audio.select();
            setLanguage(language === 'en' ? 'ar' : 'en');
          }}
          className="glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:border-cyan-400 flex items-center gap-1.5 shadow-glow-cyan transition-all cursor-pointer"
          title="Toggle English / Arabic Language"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'en' ? 'EN / عربي' : 'عربي / EN'}</span>
        </button>
      </div>

      {/* Background Orbital Glow Effect */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -bottom-20 -right-20" />

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        {/* Animated Brand Banner */}
        <div className="mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            SPACE MISSION DESIGN & OPERATIONS SIMULATOR
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_4px_24px_rgba(0,240,255,0.4)]">
            NOVASCRIPT
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-light text-slate-300 italic tracking-wide">
            &ldquo;Design. Decide. Explore.&rdquo;
          </p>
        </div>

        {/* Player astronaut preview with 1-click gender selector */}
        <div className="mb-6 flex flex-col items-center gap-2.5">
          <div
            className="animate-float cursor-pointer group relative p-1 rounded-2xl"
            onClick={() => {
              setPlayerGender(playerGender === 'male' ? 'female' : 'male');
              audio.click();
            }}
            title="Click to toggle character (Alex / Maya)"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt="Astronaut"
              width={86}
              height={86}
              className="pixel-art drop-shadow-[0_4px_24px_rgba(0,240,255,0.6)] group-hover:scale-105 transition-transform"
              draggable={false}
            />
          </div>

          {/* Quick Gender / Identity Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-space-950/80 border border-cyan-500/30 shadow-lg">
            <button
              onClick={() => {
                setPlayerGender('male');
                audio.select();
              }}
              className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                playerGender === 'male'
                  ? 'bg-cyan-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ♂ ALEX
            </button>
            <button
              onClick={() => {
                setPlayerGender('female');
                audio.select();
              }}
              className={`px-3 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                playerGender === 'female'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-glow-amber'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ♀ MAYA
            </button>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col gap-4 border border-cyan-500/20">
          {hasSavedMission && (
            <button
              onClick={() => {
                audio.click();
                onResumeMission();
              }}
              onMouseEnter={() => audio.hover()}
              className="group relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wider shadow-glow-cyan transition-all duration-200 flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-5 h-5 text-cyan-200 group-hover:-rotate-45 transition-transform" />
              <span>{t.resumeMission}</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.click();
              onStartNewMission();
            }}
            onMouseEnter={() => audio.hover()}
            className={`group w-full py-4 px-6 rounded-xl font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-3 ${
              hasSavedMission
                ? 'bg-space-850 hover:bg-space-800 text-cyan-300 border border-cyan-700/50 hover:border-cyan-400'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan'
            }`}
          >
            <Play className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform fill-current" />
            <span>{t.enterStation}</span>
          </button>

          <div className="grid grid-cols-3 gap-2.5 mt-2">
            <button
              onClick={() => {
                audio.click();
                toggleProfile();
              }}
              onMouseEnter={() => audio.hover()}
              className="py-3 px-3 rounded-xl bg-space-900/90 hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-space-border hover:border-cyan-500/40 text-xs flex items-center justify-center gap-1.5 transition-colors font-bold"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>{t.profile}</span>
            </button>

            <button
              onClick={() => {
                audio.click();
                onOpenSettings();
              }}
              onMouseEnter={() => audio.hover()}
              className="py-3 px-3 rounded-xl bg-space-900/90 hover:bg-space-800 text-slate-300 hover:text-white border border-space-border text-xs flex items-center justify-center gap-1.5 transition-colors font-bold"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{t.settings}</span>
            </button>

            <button
              onClick={() => {
                audio.click();
                toggleCodex();
              }}
              onMouseEnter={() => audio.hover()}
              className="py-3 px-3 rounded-xl bg-space-900/90 hover:bg-space-800 text-slate-300 hover:text-cyan-300 border border-space-border hover:border-cyan-500/40 text-xs flex items-center justify-center gap-1.5 transition-colors font-bold"
              title="Open Space Mission Handbook & Scientific Archive"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{t.handbook}</span>
            </button>
          </div>
        </div>

        {/* Educational Disclaimer Footer */}
        <p className="mt-8 text-xs text-slate-500 max-w-lg leading-relaxed">
          NovaScript is an independent educational space simulation game. It is not an official NASA product, nor is it endorsed by or affiliated with NASA.
        </p>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full glass-panel p-6 rounded-2xl border border-cyan-500/40 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-lg font-mono font-bold text-cyan-glow flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                MISSION BRIEFING & CREDITS
              </h3>
              <button
                onClick={() => setShowAbout(false)}
                className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-sm text-slate-300 space-y-3 font-light leading-relaxed">
              <p>
                In <strong>NovaScript</strong>, you are the Mission Commander in charge of designing, launching, and operating an interplanetary robotic spacecraft.
              </p>
              <p>
                Explore 31 interconnected systems engineering trade-offs, managing normalized Budget, Mass, Power, Science, and Communication margins.
              </p>
              <div className="p-3 rounded-lg bg-space-900/90 border border-slate-800 text-xs text-slate-400">
                <strong>Attribution:</strong> Based on the NASA Space Apps Challenge 2026 Space Mission Design Game and JPL Concept Maturity Level systems engineering methodologies.
              </div>
            </div>

            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs font-bold tracking-wider"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
