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
import CodexPanel from '@/game/ui/CodexPanel';
import InteractionHandler from '@/game/interactions/InteractionHandler';
import { useGameStore } from '@/game/store';
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

type TopLevelScreen = 'menu' | 'exploring' | 'briefing' | 'gameplay' | 'report';

export default function GamePage() {
  const [screen, setScreen] = useState<TopLevelScreen>('menu');
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [hasSavedMission, setHasSavedMission] = useState(false);
  const [lastDeltas, setLastDeltas] = useState<Partial<Resources> | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCraftingOpen, setIsCraftingOpen] = useState(false);

  const gamePhase = useGameStore((s) => s.phase);
  const setGamePhase = useGameStore((s) => s.setPhase);
  const resetExploration = useGameStore((s) => s.resetExplorationState);
  const addEndingDiscovered = useGameStore((s) => s.addEndingDiscovered);

  // Initialize on mount
  useEffect(() => {
    const saved = loadMissionFromStorage();
    if (saved && !saved.isComplete) {
      setHasSavedMission(true);
    }
    const currentAudio = audio.getSettings();
    setIsMuted(currentAudio.isMuted);
  }, []);

  // Sync ESC key for closing mini-games back to exploring
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const store = useGameStore.getState();
        if (store.activeMiniGame) {
          store.setActiveMiniGame(null);
          store.setPhase('exploring');
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
    const fresh = createInitialMissionState();
    setMissionState(fresh);
    saveMissionToStorage(fresh);
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
        if (currentQuestion) {
          const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId);
          if (selectedAnswer) {
            addCodexEntry({
              questionId: currentQuestion.id,
              questionText: currentQuestion.question,
              answerId: selectedAnswer.id,
              answerText: selectedAnswer.text,
              learningPoint: selectedAnswer.learning_point,
              stage: currentQuestion.stage,
            });
          }
        }

        if (updated.isComplete) {
          if (updated.ending) {
            addEndingDiscovered(updated.ending.id);
            const isSuccess = updated.ending.status.includes('success') || updated.ending.status === 'scientific_discovery';
            musicEngine.setScene(isSuccess ? 'victory' : 'failure', 0.25);
          }
          setScreen('report');
          setGamePhase('mission-report');
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

  return (
    <main
      className="min-h-screen flex flex-col select-none relative overflow-hidden"
      style={{ cursor: 'none' }}
    >
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

          {/* Codex panel */}
          <CodexPanel />

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
