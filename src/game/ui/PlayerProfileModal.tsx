/**
 * Player Profile & Flight Service Record Modal.
 * Displays player identity, character selection (Male / Female astronaut),
 * career flight telemetry, rank progression, materials breakdown, and achievement showcase.
 */

'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Award,
  Sparkles,
  Compass,
  Rocket,
  CheckCircle2,
  Lock,
  Edit2,
  Check,
  RefreshCcw,
  Zap,
} from 'lucide-react';
import { useGameStore } from '@/game/store';
import { COLLECTIBLE_INFO, COLLECTIBLE_LIMITS } from '@/game/types';
import type { CollectibleType } from '@/game/types';
import { ACHIEVEMENTS } from '@/game/progression/achievements';
import { audio } from '@/lib/audio/audio-manager';

export default function PlayerProfileModal() {
  const {
    isProfileOpen,
    setProfileOpen,
    playerGender,
    setPlayerGender,
    playerName,
    setPlayerName,
    suitScheme,
    setSuitScheme,
    inventory,
    missionsCompleted,
    endingsDiscovered,
    bestScore,
    totalScore,
    roomsVisited,
    totalItemsCrafted,
    totalCollectiblesCount,
    unlockedAchievements,
    resetExplorationState,
  } = useGameStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(playerName);

  if (!isProfileOpen) return null;

  // Calculate dynamic rank title
  const getRankInfo = () => {
    if (bestScore >= 250 && endingsDiscovered.length >= 3) {
      return {
        title: 'Cosmos Legend',
        tier: 'Master Rank V',
        color: 'from-amber-400 via-rose-400 to-cyan-400',
        badgeColor: 'border-amber-400 text-amber-300 bg-amber-950/60',
        progress: 100,
        nextRank: 'MAXIMUM RANK ACHIEVED',
      };
    }
    if (missionsCompleted >= 4 || endingsDiscovered.length >= 4) {
      return {
        title: 'Lead Systems Architect',
        tier: 'Senior Rank IV',
        color: 'from-cyan-400 to-blue-400',
        badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/60',
        progress: Math.min(100, (bestScore / 250) * 100),
        nextRank: 'Score 250+ & discover 3 endings for Cosmos Legend',
      };
    }
    if (missionsCompleted >= 2 || endingsDiscovered.length >= 2) {
      return {
        title: 'Flight Operations Director',
        tier: 'Rank III',
        color: 'from-teal-400 to-emerald-400',
        badgeColor: 'border-teal-400 text-teal-300 bg-teal-950/60',
        progress: 75,
        nextRank: 'Complete 4 missions for Lead Architect',
      };
    }
    if (missionsCompleted >= 1) {
      return {
        title: 'Mission Specialist',
        tier: 'Rank II',
        color: 'from-blue-400 to-indigo-400',
        badgeColor: 'border-blue-400 text-blue-300 bg-blue-950/60',
        progress: 50,
        nextRank: 'Complete 2 missions for Flight Director',
      };
    }
    return {
      title: 'Flight Cadet',
      tier: 'Cadet Rank I',
      color: 'from-slate-300 to-slate-400',
      badgeColor: 'border-slate-500 text-slate-300 bg-slate-900/60',
      progress: 20,
      nextRank: 'Complete 1 mission for Mission Specialist',
    };
  };

  const rank = getRankInfo();

  const handleSaveName = () => {
    const trimmed = editedName.trim() || 'Commander';
    setPlayerName(trimmed);
    setIsEditingName(false);
    audio.click();
  };

  const handleSelectGender = (gender: 'male' | 'female') => {
    setPlayerGender(gender);
    audio.select();
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your local flight record and station progress? This action cannot be undone.'
      )
    ) {
      try {
        localStorage.removeItem('novascript_game_world_v2');
        localStorage.removeItem('novascript_mission_state_v1');
        localStorage.removeItem('novascript_crafted_v1');
        localStorage.removeItem('novascript_achievements_v1');
        localStorage.removeItem('novascript_codex_v1');
        resetExplorationState();
        setProfileOpen(false);
        window.location.reload();
      } catch {
        /* ignore */
      }
    }
  };

  const avatarSrc =
    playerGender === 'female'
      ? '/assets/characters/player-female.png'
      : '/assets/characters/player.png';

  const avatarFilter = (() => {
    switch (suitScheme) {
      case 'solar-amber':
        return 'drop-shadow(0 0 10px rgba(251,191,36,0.6)) hue-rotate(25deg)';
      case 'cosmic-violet':
        return 'drop-shadow(0 0 10px rgba(192,132,252,0.6)) hue-rotate(240deg)';
      case 'cyber-teal':
        return 'drop-shadow(0 0 10px rgba(45,212,191,0.6)) hue-rotate(150deg)';
      case 'crimson-alpha':
        return 'drop-shadow(0 0 10px rgba(244,63,94,0.6)) hue-rotate(320deg)';
      default:
        return 'drop-shadow(0 0 10px rgba(0,240,255,0.6))';
    }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="max-w-3xl w-full glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-space-border/60 bg-space-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-white tracking-wider flex items-center gap-2">
                COMMANDER FLIGHT SERVICE RECORD
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                DEEP-SPACE EXPEDITIONARY PROFILE // NOVASCRIPT CADRE
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audio.click();
              setProfileOpen(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Card: Astronaut Identity & Gender Selection */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-space-900/80 via-space-950/80 to-cyan-950/30 flex flex-col sm:flex-row items-center gap-6">
            {/* Holographic Avatar Box */}
            <div className="relative flex flex-col items-center">
              <div className="w-28 h-28 rounded-2xl bg-space-900/90 border-2 border-cyan-400/50 shadow-glow-cyan flex items-center justify-center overflow-hidden p-2 group relative">
                {/* Orbital glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt="Commander Avatar"
                  className="w-full h-full object-contain pixel-art animate-float"
                  style={{ filter: avatarFilter }}
                  draggable={false}
                />
              </div>

              {/* Character Gender Selector Switch */}
              <div className="mt-3 flex items-center gap-1.5 p-1 rounded-xl bg-space-950 border border-space-border/60">
                <button
                  onClick={() => handleSelectGender('male')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    playerGender === 'male'
                      ? 'bg-cyan-600 text-white shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-850'
                  }`}
                  title="Select Male Astronaut (Commander Alex)"
                >
                  ♂ ALEX
                </button>
                <button
                  onClick={() => handleSelectGender('female')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    playerGender === 'female'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-glow-amber'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-850'
                  }`}
                  title="Select Female Astronaut (Commander Maya)"
                >
                  ♀ MAYA
                </button>
              </div>

              {/* EVA Suit Customization Swatches */}
              <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-xl bg-space-950/80 border border-space-border/60">
                <span className="text-[10px] font-mono text-slate-400">SUIT:</span>
                {[
                  {
                    id: 'default',
                    label: playerGender === 'female' ? 'Solar Amber' : 'Titanium White',
                    bg: playerGender === 'female' ? 'bg-amber-500' : 'bg-slate-200',
                  },
                  { id: 'solar-amber', label: 'Mars Amber', bg: 'bg-amber-400' },
                  { id: 'cosmic-violet', label: 'Cosmic Violet', bg: 'bg-purple-500' },
                  { id: 'cyber-teal', label: 'Quantum Teal', bg: 'bg-teal-400' },
                  { id: 'crimson-alpha', label: 'Crimson Alpha', bg: 'bg-rose-500' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSuitScheme(s.id as any);
                      audio.select();
                    }}
                    title={s.label}
                    className={`w-3.5 h-3.5 rounded-full ${s.bg} transition-all ${
                      suitScheme === s.id
                        ? 'scale-125 ring-2 ring-cyan-400 ring-offset-1 ring-offset-space-950 shadow-glow-cyan'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Commander Credentials & Rank Info */}
            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left w-full">
              {/* Callsign / Editable Name */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      maxLength={24}
                      className="px-3 py-1 rounded-lg bg-space-950 border border-cyan-400 text-white font-mono font-bold text-lg focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="text-2xl font-mono font-extrabold text-white tracking-wide">
                      {playerName}
                    </h4>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setEditedName(playerName);
                      }}
                      className="text-slate-400 hover:text-cyan-300 p-1"
                      title="Edit Callsign"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <span
                  className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${rank.badgeColor}`}
                >
                  {rank.tier}
                </span>
              </div>

              {/* Rank Title */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span
                  className={`font-mono font-bold text-base text-transparent bg-clip-text bg-gradient-to-r ${rank.color}`}
                >
                  {rank.title}
                </span>
              </div>

              {/* Rank Progress Bar */}
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>CAREER PROGRESSION</span>
                  <span>{rank.nextRank}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-space-850 border border-space-border/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${rank.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Career Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-space-900/70 border border-space-border/60 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Missions Flown
              </span>
              <span className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                {missionsCompleted}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Target: Moon & Mars
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-900/70 border border-space-border/60 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Endings Found
              </span>
              <span className="text-2xl font-mono font-bold text-amber-300 mt-1">
                {endingsDiscovered.length}{' '}
                <span className="text-sm text-slate-500">/ 8</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Canonical Outcomes
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-900/70 border border-space-border/60 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Highest Score
              </span>
              <span className="text-2xl font-mono font-bold text-emerald-300 mt-1">
                {bestScore.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Safe Formula Evaluated
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-space-900/70 border border-space-border/60 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Station Modules
              </span>
              <span className="text-2xl font-mono font-bold text-purple-300 mt-1">
                {roomsVisited.length}{' '}
                <span className="text-sm text-slate-500">/ 7</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                Exploration Coverage
              </span>
            </div>
          </div>

          {/* Material Tokens & Inventory Capacities */}
          <div className="glass-panel p-4 rounded-2xl border border-space-border/60">
            <div className="flex items-center justify-between pb-3 border-b border-space-border/40 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h5 className="font-mono text-xs font-bold text-white tracking-wider">
                  MATERIAL TOKENS & STORAGE CAPACITY
                </h5>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Total Harvested: {totalCollectiblesCount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(
                [
                  'metal-scrap',
                  'energy-cell',
                  'science-sample',
                  'blueprint-fragment',
                  'rare-mineral',
                ] as CollectibleType[]
              ).map((type) => {
                const info = COLLECTIBLE_INFO[type];
                const count = inventory.items[type] ?? 0;
                const limit = COLLECTIBLE_LIMITS[type] ?? 20;
                const isFull = count >= limit;

                return (
                  <div
                    key={type}
                    className={`p-3 rounded-xl border transition-all ${
                      isFull
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-space-900/60 border-space-border/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{info.icon}</span>
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: info.color }}
                        >
                          {info.label}
                        </span>
                      </div>
                      {isFull && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          MAX
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Stored:</span>
                      <span className="font-bold text-slate-200">
                        {count} / {limit}
                      </span>
                    </div>

                    <div className="mt-1 w-full h-1.5 rounded-full bg-space-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (count / limit) * 100)}%`,
                          backgroundColor: isFull ? '#F59E0B' : info.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Badges Showcase */}
          <div className="glass-panel p-4 rounded-2xl border border-space-border/60">
            <div className="flex items-center justify-between pb-3 border-b border-space-border/40 mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h5 className="font-mono text-xs font-bold text-white tracking-wider">
                  CAREER BADGES & COMMENDATIONS ({unlockedAchievements.length} /{' '}
                  {ACHIEVEMENTS.length})
                </h5>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-space-900/90 border-cyan-500/50 shadow-glow-cyan'
                        : 'bg-space-950/50 border-space-border/30 opacity-40'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{ach.icon}</div>
                    <span className="font-mono text-xs font-bold text-white leading-tight">
                      {ach.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-2">
                      {ach.description}
                    </span>
                    {isUnlocked ? (
                      <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono text-slate-500">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Career Data Danger Zone */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>Guest Profile stored in LocalStorage.</span>
            <button
              onClick={handleResetData}
              className="text-red-400/80 hover:text-red-300 flex items-center gap-1 transition-colors p-1"
              title="Reset all guest progress"
            >
              <RefreshCcw className="w-3 h-3" /> Reset Profile Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
