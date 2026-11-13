'use client';

import React, { useState, useEffect } from 'react';
import MainMenu from '@/components/game/MainMenu/MainMenu';
import MissionControl from '@/components/game/MissionControl/MissionControl';
import GameHUD from '@/components/game/GameHUD/GameHUD';
import QuestionViewer from '@/components/game/MissionOperations/QuestionViewer';
import MissionReport from '@/components/game/MissionReport/MissionReport';
import SettingsModal from '@/components/game/SettingsModal/SettingsModal';
import ContextMenu from '@/components/game/ContextMenu/ContextMenu';

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

type GameScreen = 'menu' | 'briefing' | 'gameplay' | 'report';

export default function GamePage() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [hasSavedMission, setHasSavedMission] = useState<boolean>(false);
  const [lastDeltas, setLastDeltas] = useState<Partial<Resources> | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Initialize and check LocalStorage on mount
  useEffect(() => {
    const saved = loadMissionFromStorage();
    if (saved && !saved.isComplete) {
      setHasSavedMission(true);
    }
    const currentAudio = audio.getSettings();
    setIsMuted(currentAudio.isMuted);
  }, []);

  const handleStartNewMission = () => {
    clearMissionFromStorage();
    const fresh = createInitialMissionState();
    setMissionState(fresh);
    saveMissionToStorage(fresh);
    setHasSavedMission(false);
    setLastDeltas(undefined);
    setScreen('briefing');
  };

  const handleResumeMission = () => {
    const saved = loadMissionFromStorage();
    if (saved) {
      setMissionState(saved);
      if (saved.isComplete) {
        setScreen('report');
      } else {
        setScreen('gameplay');
      }
    } else {
      handleStartNewMission();
    }
  };

  const handleProceedFromBriefing = () => {
    setScreen('gameplay');
  };

  const handleCommitAnswer = (answerId: string) => {
    if (!missionState) return;

    try {
      const prevResources = { ...missionState.resources };
      const updated = commitAnswerToState(missionState, answerId);

      // Compute deltas for HUD animations
      const deltas: Partial<Resources> = {
        budget: updated.resources.budget - prevResources.budget,
        mass: updated.resources.mass - prevResources.mass,
        power: updated.resources.power - prevResources.power,
        scientific_value: updated.resources.scientific_value - prevResources.scientific_value,
        communication: updated.resources.communication - prevResources.communication,
      };
      setLastDeltas(deltas);
      setMissionState(updated);
      saveMissionToStorage(updated);

      if (updated.isComplete) {
        setScreen('report');
      }
    } catch (err) {
      console.error('Failed to commit decision:', err);
    }
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to abort the current mission and restart from the main menu?')) {
      audio.click();
      clearMissionFromStorage();
      setMissionState(null);
      setHasSavedMission(false);
      setLastDeltas(undefined);
      setScreen('menu');
    }
  };

  const handleToggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.saveSettings({ isMuted: nextMuted });
    if (!nextMuted) audio.click();
  };

  // Resolve active question entity
  const currentQuestion = missionState?.currentQuestionId
    ? getQuestionById(missionState.currentQuestionId)
    : undefined;

  return (
    <main className="min-h-screen flex flex-col deep-space-bg stars-pattern select-none">
      {/* HUD Header active during briefing, gameplay, and report */}
      {screen !== 'menu' && missionState && (
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

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {screen === 'menu' && (
          <MainMenu
            hasSavedMission={hasSavedMission}
            onStartNewMission={handleStartNewMission}
            onResumeMission={handleResumeMission}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

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

        {screen === 'report' && missionState && missionState.ending && (
          <MissionReport
            ending={missionState.ending}
            finalScore={missionState.finalScore ?? 0}
            finalResources={missionState.resources}
            history={missionState.history}
            onRestart={handleStartNewMission}
          />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Right-Click Context Menu (Active in gameplay and briefing) */}
      {missionState && (
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
