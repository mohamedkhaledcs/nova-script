import { getGameDataset } from '@/lib/data/game-data-service';
import { applyResourceEffects } from './resource-engine';
import { resolveAnswer, createDecisionRecord } from './question-engine';
import { calculateEndingScore } from './scoring-engine';
import type { MissionState } from '@/types/game';

export const LOCAL_STORAGE_KEY = 'novascript_mission_state_v1';

export function createInitialMissionState(): MissionState {
  const dataset = getGameDataset();
  return {
    missionId: `mission_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    startTime: Date.now(),
    currentQuestionId: dataset.start_question_id,
    resources: { ...dataset.initial_resources },
    history: [],
    destination: null,
    ending: null,
    finalScore: null,
    isComplete: false,
  };
}

export function commitAnswerToState(
  state: MissionState,
  answerId: string
): MissionState {
  if (state.isComplete || !state.currentQuestionId) {
    throw new Error('Cannot commit answer to an already completed mission');
  }

  const dataset = getGameDataset();
  const resolution = resolveAnswer(state.currentQuestionId, answerId);

  // Apply resource deltas with canonical bounds
  const { nextResources } = applyResourceEffects(
    state.resources,
    resolution.selectedAnswer.effects,
    dataset.resource_bounds
  );

  // Update destination if this is Q001
  let nextDestination = state.destination;
  if (state.currentQuestionId === 'Q001') {
    if (answerId === 'A001') nextDestination = 'moon';
    if (answerId === 'A002') nextDestination = 'mars';
  }

  // Create decision record
  const record = createDecisionRecord(
    state.history.length + 1,
    resolution.question,
    resolution.selectedAnswer,
    state.resources,
    nextResources
  );

  const updatedHistory = [...state.history, record];

  if (resolution.type === 'ending' && resolution.ending) {
    const finalScore = calculateEndingScore(
      resolution.ending.final_score_formula,
      nextResources
    );

    return {
      ...state,
      resources: nextResources,
      history: updatedHistory,
      destination: nextDestination,
      currentQuestionId: null,
      ending: resolution.ending,
      finalScore,
      isComplete: true,
    };
  }

  return {
    ...state,
    resources: nextResources,
    history: updatedHistory,
    destination: nextDestination,
    currentQuestionId: resolution.nextQuestion!.id,
    ending: null,
    finalScore: null,
    isComplete: false,
  };
}

// LocalStorage helpers with SSR safety
export function saveMissionToStorage(state: MissionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save mission to LocalStorage:', err);
  }
}

export function loadMissionFromStorage(): MissionState | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as MissionState;
  } catch (err) {
    console.warn('Failed to parse mission from LocalStorage:', err);
    return null;
  }
}

export function clearMissionFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear mission from LocalStorage:', err);
  }
}
