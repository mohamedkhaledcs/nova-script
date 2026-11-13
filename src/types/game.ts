/**
 * Core type definitions for NovaScript game entities and runtime state.
 * Normalized to 0 - 100 game resource points.
 */

export interface Resources {
  budget: number;
  mass: number;
  power: number;
  scientific_value: number;
  communication: number;
}

export type ResourceKey = keyof Resources;

export interface ResourceBounds {
  min: number;
  max: number;
}

export type MissionStage =
  | 'mission_planning'
  | 'spacecraft_design'
  | 'scientific_instruments'
  | 'orbit_selection'
  | 'space_communications'
  | 'resource_management'
  | 'launch_planning'
  | 'mission_operations';

export interface SourceCitation {
  title: string;
  url: string;
  section: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  next_question_id: string | null;
  ending_id: string | null;
  consequence_summary: string;
  effects: Partial<Resources>;
  learning_point: string;
}

export interface Question {
  id: string;
  stage: MissionStage;
  story: string;
  question: string;
  source: SourceCitation;
  answers: AnswerOption[];
}

export type EndingStatus =
  | 'outstanding_success'
  | 'efficient_success'
  | 'scientific_discovery'
  | 'partial_success'
  | 'strategy_revision'
  | 'resource_failure'
  | 'launch_failure'
  | 'engineering_failure';

export interface MissionEnding {
  id: string;
  title: string;
  status: EndingStatus;
  final_score_formula: string;
  description: string;
  scientific_explanation: string;
  learning_point: string;
}

export interface GameDataset {
  game_title: string;
  version: string;
  start_question_id: string;
  initial_resources: Resources;
  resource_bounds: ResourceBounds;
  questions: Question[];
  endings: MissionEnding[];
}

export interface DecisionRecord {
  stepIndex: number;
  questionId: string;
  questionText: string;
  stage: MissionStage;
  selectedAnswerId: string;
  selectedAnswerText: string;
  resourcesBefore: Resources;
  resourcesAfter: Resources;
  consequenceSummary: string;
  learningPoint: string;
  timestamp: number;
}

export interface MissionState {
  missionId: string;
  startTime: number;
  currentQuestionId: string | null;
  resources: Resources;
  history: DecisionRecord[];
  destination: 'moon' | 'mars' | null;
  ending: MissionEnding | null;
  finalScore: number | null;
  isComplete: boolean;
}
