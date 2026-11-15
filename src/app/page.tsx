/**
 * NovaScript Game Page — the primary game orchestrator.
 * 
 * Manages the transition between:
 * - Main menu
 * - Exploration (3D space station with player movement)
 * - Mission gameplay (canonical question flow)
 * - Cinematic sequences
 * - Mission report
 * 
 * The exploration phase wraps the canonical mission engine:
 * when the player reaches the Mission Board and starts a mission,
 * the canonical question flow begins.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainMenu from '@/components/game/MainMenu/MainMenu';
import MissionControl from '@/components/game/MissionControl/MissionControl';
import GameHUD from '@/components/game/GameHUD/GameHUD';
import QuestionViewer from '@/components/game/MissionOperations/QuestionViewer';
import MissionReport from '@/components/game/MissionReport/MissionReport';
import SettingsModal from '@/components/game/SettingsModal/SettingsModal';
import ContextMenu from '@/components/game/ContextMenu/ContextMenu';
import GameCanvas from '@/game/world/GameCanvas';
import ExplorationHUD from '@/game/ui/ExplorationHUD';
import InventoryPanel from '@/game/ui/InventoryPanel';
import PauseMenu from '@/game/ui/PauseMenu';
import MiniGameOverlay from '@/game/ui/MiniGameOverlay';
import CraftingPanel from '@/game/ui/CraftingPanel';
import SpaceHandbookModal from '@/game/ui/SpaceHandbookModal';
import PlayerProfileModal from '@/game/ui/PlayerProfileModal';
import LaunchCinematic from '@/game/cinematics/LaunchCinematic';
import MissionSelector from '@/game/ui/MissionSelector';
import CollectibleNotifications from '@/game/ui/CollectibleNotifications';
import AchievementNotifications from '@/game/ui/AchievementNotifications';
import InteractionHandler from '@/game/interactions/InteractionHandler';
import { useGameStore } from '@/game/store';
import { DEFAULT_KEYBINDINGS, type GameAction } from '@/game/types';
import { addCodexEntry } from '@/game/ui/CodexPanel';
import { musicEngine } from '@/game/audio/music-engine';

import {
  createInitialMissionState,
  commitAnswerToState,
  saveMissionToStorage,
  loadMissionFromStorage,
  clearMissionFromStorage,
} from '@/lib/game-engine/mission-engine';
import { getQuestionById, getInitialResources } from '@/lib/data/game-data-service';
import { audio } from '@/lib/audio/audio-manager';
import type { MissionState, Resources } from '@/types/game';

type TopLevelScreen = 'menu' | 'exploring' | 'briefing' | 'gameplay' | 'cinematic' | 'report';

export default function GamePage() {
  const [screen, setScreen] = useState<TopLevelScreen>('menu');
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [hasSavedMission, setHasSavedMission] = useState(false);
  const [lastDeltas, setLastDeltas] = useState<Partial<Resources> | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCraftingOpen, setIsCraftingOpen] = useState(false);
  const [isMissionSelectorOpen, setIsMissionSelectorOpen] = useState(false);

  const gamePhase = useGameStore((s) => s.phase);
  const setGamePhase = useGameStore((s) => s.setPhase);
  const resetExploration = useGameStore((s) => s.resetExplorationState);
  const addEndingDiscovered = useGameStore((s) => s.addEndingDiscovered);
  const visualMode = useGameStore((s) => s.visualMode);
  const language = useGameStore((s) => s.language);

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __GAME_STORE__: typeof useGameStore }).__GAME_STORE__ = useGameStore;
    }
    const saved = loadMissionFromStorage();
    if (saved && !saved.isComplete) {
      setHasSavedMission(true);
    }
    const currentAudio = audio.getSettings();
    setIsMuted(currentAudio.isMuted);
  }, []);

  // Global game hotkeys (Esc, Tab, I)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();
      const store = useGameStore.getState();
      const bindings = store.keybindings || DEFAULT_KEYBINDINGS;
      const isAction = (action: GameAction) => {
        const list = bindings[action] || DEFAULT_KEYBINDINGS[action] || [];
        return list.includes(key);
      };

      if (e.key === 'Escape' || isAction('pause')) {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isCraftingOpen) {
          setIsCraftingOpen(false);
          store.setActiveMiniGame(null);
          store.setPhase('exploring');
          return;
        }
        if (isMissionSelectorOpen) {
          setIsMissionSelectorOpen(false);
          store.setActiveMiniGame(null);
          store.setPhase('exploring');
          return;
        }
        if (store.isInventoryOpen) {
          store.setInventoryOpen(false);
          return;
        }
        if (store.isCodexOpen) {
          store.toggleCodex();
          return;
        }
        if (store.isProfileOpen) {
          store.setProfileOpen(false);
          return;
        }
        if (store.activeMiniGame) {
          store.setActiveMiniGame(null);
          store.setPhase('exploring');
          return;
        }
      }

      if (isAction('handbook') || key === 'tab') {
        e.preventDefault();
        store.toggleCodex();
      }

      if (isAction('inventory')) {
        store.toggleInventory();
      }

      if (isAction('profile')) {
        store.toggleProfile();
      }

      if (isAction('minimap')) {
        store.toggleMinimap();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSettingsOpen, isCraftingOpen, isMissionSelectorOpen]);

  // ---- Menu Actions ----

  const handleStartNewMission = useCallback(() => {
    clearMissionFromStorage();
    setMissionState(null);
    setHasSavedMission(false);
    setLastDeltas(undefined);
    resetExploration();
    setScreen('exploring');
    musicEngine.setScene('exploration', 0.2);
  }, [resetExploration]);

  const handleResumeMission = useCallback(() => {
    const saved = loadMissionFromStorage();
    if (saved) {
      setMissionState(saved);
      if (saved.isComplete) {
        setScreen('report');
      } else {
        // Resume into exploration with active mission
        setScreen('exploring');
        setGamePhase('exploring');
      }
    } else {
      handleStartNewMission();
    }
  }, [handleStartNewMission, setGamePhase]);

  // ---- Mission Flow ----

  const handleStartMissionFromBoard = useCallback(() => {
    audio.select();
    setIsMissionSelectorOpen(true);
  }, []);

  const handleMissionSelected = useCallback((answerId: string) => {
    setIsMissionSelectorOpen(false);
    const fresh = createInitialMissionState();
    // Commit the first answer (A001=Moon, A002=Mars)
    const afterFirst = commitAnswerToState(fresh, answerId);
    setMissionState(afterFirst);
    saveMissionToStorage(afterFirst);
    setScreen('briefing');
    setGamePhase('mission-active');
    musicEngine.setScene('mission-active', 0.2);
  }, [setGamePhase]);

  const handleProceedFromBriefing = useCallback(() => {
    setScreen('gameplay');
  }, []);

  const handleCommitAnswer = useCallback(
    (answerId: string) => {
      if (!missionState) return;

      try {
        const prevResources = { ...missionState.resources };
        const updated = commitAnswerToState(missionState, answerId);

        const deltas: Partial<Resources> = {
          budget: updated.resources.budget - prevResources.budget,
          mass: updated.resources.mass - prevResources.mass,
          power: updated.resources.power - prevResources.power,
          scientific_value:
            updated.resources.scientific_value - prevResources.scientific_value,
          communication:
            updated.resources.communication - prevResources.communication,
        };
        setLastDeltas(deltas);
        setMissionState(updated);
        saveMissionToStorage(updated);

        // Record learning point in codex
        const answeredQ = missionState.currentQuestionId
          ? getQuestionById(missionState.currentQuestionId)
          : null;
        if (answeredQ) {
          const selectedAnswer = answeredQ.answers.find((a) => a.id === answerId);
          if (selectedAnswer) {
            addCodexEntry({
              questionId: answeredQ.id,
              questionText: answeredQ.question,
              answerId: selectedAnswer.id,
              answerText: selectedAnswer.text,
              learningPoint: selectedAnswer.learning_point,
              stage: answeredQ.stage,
            });
          }
        }

        if (updated.isComplete) {
          if (updated.ending) {
            addEndingDiscovered(updated.ending.id);
            const isSuccess = updated.ending.status.includes('success') || updated.ending.status === 'scientific_discovery';
            musicEngine.setScene(isSuccess ? 'victory' : 'failure', 0.25);
          }
          // Play cinematic before showing report
          setScreen('cinematic');
          setGamePhase('cinematic');
        } else {
          // Dynamic music: check if any resource is within critical low range (<= 25)
          const vals = [
            updated.resources.budget,
            updated.resources.mass,
            updated.resources.power,
            updated.resources.scientific_value,
            updated.resources.communication,
          ];
          const hasCritical = vals.some((v) => v <= 25);
          if (hasCritical) {
            musicEngine.setScene('tension', 0.28);
          } else {
            musicEngine.setScene('mission-active', 0.22);
          }
        }
      } catch (err) {
        console.error('Failed to commit decision:', err);
      }
    },
    [missionState, addEndingDiscovered, setGamePhase]
  );

  // ---- Restart / Return ----

  const handleRestart = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to abort the current mission and return to the station?'
      )
    ) {
      audio.click();
      clearMissionFromStorage();
      setMissionState(null);
      setHasSavedMission(false);
      setLastDeltas(undefined);
      setScreen('exploring');
      setGamePhase('exploring');
    }
  }, [setGamePhase]);

  const handleReturnToMenu = useCallback(() => {
    useGameStore.getState().togglePause();
    setScreen('menu');
  }, []);

  const handleNewMissionFromReport = useCallback(() => {
    clearMissionFromStorage();
    setMissionState(null);
    setLastDeltas(undefined);
    setScreen('exploring');
    setGamePhase('exploring');
    musicEngine.setScene('exploration', 0.2);
  }, [setGamePhase]);

  // ---- Audio ----

  const handleToggleAudio = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.saveSettings({ isMuted: nextMuted });
    if (!nextMuted) audio.click();
  }, [isMuted]);

  // ---- Resolve current question ----

  const currentQuestion =
    missionState?.currentQuestionId
      ? getQuestionById(missionState.currentQuestionId)
      : undefined;

  // ---- Render ----

  const isExploring = screen === 'exploring';
  const isMissionActive = screen === 'gameplay' || screen === 'briefing';

  const visualModeClass = React.useMemo(() => {
    switch (visualMode) {
      case 'retro-pixel':
        return 'contrast-125 saturate-110 [image-rendering:pixelated]';
      case 'cyber-neon':
        return 'contrast-125 saturate-150 drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]';
      case 'performance':
        return '';
      default:
        return '';
    }
  }, [visualMode]);

  return (
    <main
      className={`min-h-screen flex flex-col select-none relative overflow-hidden transition-all duration-300 ${visualModeClass}`}
      style={{ cursor: 'none' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Retro Pixel CRT Scanlines Overlay */}
      {visualMode === 'retro-pixel' && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_2px)] opacity-70" />
      )}
      {/* ===== MAIN MENU ===== */}
      {screen === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <MainMenu
            hasSavedMission={hasSavedMission}
            onStartNewMission={handleStartNewMission}
            onResumeMission={handleResumeMission}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>
      )}

      {/* ===== 3D EXPLORATION ===== */}
      {isExploring && (
        <>
          {/* Full-screen 3D canvas */}
          <div className="fixed inset-0 z-0">
            <GameCanvas />
          </div>

          {/* Exploration HUD overlay */}
          <ExplorationHUD />

          {/* Inventory panel */}
          <InventoryPanel />

          {/* Pause menu */}
          <PauseMenu
            onOpenSettings={() => setIsSettingsOpen(true)}
            onReturnToMenu={handleReturnToMenu}
          />

          {/* Mini-game overlay */}
          <MiniGameOverlay />

          {/* Crafting panel */}
          <CraftingPanel
            isOpen={isCraftingOpen}
            onClose={() => {
              setIsCraftingOpen(false);
              useGameStore.getState().setActiveMiniGame(null);
              useGameStore.getState().setPhase('exploring');
            }}
          />

          {/* Mission selector overlay */}
          <MissionSelector
            isOpen={isMissionSelectorOpen}
            onSelectMission={handleMissionSelected}
            onClose={() => {
              setIsMissionSelectorOpen(false);
              useGameStore.getState().setPhase('exploring');
            }}
          />

          {/* Interaction handler (invisible, handles E key presses) */}
          <InteractionHandler
            onStartMission={handleStartMissionFromBoard}
            onOpenCrafting={() => {
              setIsCraftingOpen(true);
              useGameStore.getState().setPhase('interacting');
              useGameStore.getState().setActiveMiniGame('crafting');
            }}
          />
        </>
      )}

      {/* ===== MISSION FLOW (Briefing + Gameplay + Report) ===== */}
      {isMissionActive && (
        <div className="flex-1 flex flex-col deep-space-bg stars-pattern">
          {/* Game HUD */}
          {missionState && (
            <GameHUD
              resources={missionState.resources}
              stage={currentQuestion?.stage}
              destination={missionState.destination}
              stepCount={missionState.history.length + 1}
              lastDeltas={lastDeltas}
              isMuted={isMuted}
              onToggleAudio={handleToggleAudio}
              onRestart={handleRestart}
            />
          )}

          <div className="flex-1 flex flex-col items-center justify-center">
            {screen === 'briefing' && (
              <MissionControl
                initialResources={getInitialResources()}
                onProceedToPlanning={handleProceedFromBriefing}
              />
            )}

            {screen === 'gameplay' && currentQuestion && missionState && (
              <QuestionViewer
                question={currentQuestion}
                currentResources={missionState.resources}
                onCommitAnswer={handleCommitAnswer}
              />
            )}
          </div>
        </div>
      )}

      {/* ===== LAUNCH CINEMATIC ===== */}
      {screen === 'cinematic' && missionState && missionState.ending && (
        <LaunchCinematic
          ending={missionState.ending}
          destination={missionState.destination}
          onComplete={() => {
            setScreen('report');
            setGamePhase('mission-report');
          }}
        />
      )}

      {/* ===== MISSION REPORT ===== */}
      {screen === 'report' && missionState && missionState.ending && (
        <div className="flex-1 flex flex-col deep-space-bg stars-pattern">
          {missionState && (
            <GameHUD
              resources={missionState.resources}
              stage={undefined}
              destination={missionState.destination}
              stepCount={missionState.history.length}
              lastDeltas={lastDeltas}
              isMuted={isMuted}
              onToggleAudio={handleToggleAudio}
              onRestart={handleRestart}
            />
          )}
          <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
            <MissionReport
              ending={missionState.ending}
              finalScore={missionState.finalScore ?? 0}
              finalResources={missionState.resources}
              history={missionState.history}
              onRestart={handleNewMissionFromReport}
            />
          </div>
        </div>
      )}

      {/* ===== GLOBAL NOTIFICATION TOASTS ===== */}
      <CollectibleNotifications />
      <AchievementNotifications />

      {/* ===== PLAYER PROFILE MODAL (always available) ===== */}
      <PlayerProfileModal />

      {/* ===== SPACE HANDBOOK & ENCYCLOPEDIA MODAL (always available) ===== */}
      <SpaceHandbookModal />

      {/* ===== SETTINGS MODAL (always available) ===== */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* ===== CONTEXT MENU (in mission flow) ===== */}
      {missionState && isMissionActive && (
        <ContextMenu
          resources={missionState.resources}
          history={missionState.history}
          isMuted={isMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}
    </main>
  );
}
