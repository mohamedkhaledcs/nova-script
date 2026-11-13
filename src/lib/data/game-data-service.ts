import rawData from '../../../public/data/ques-en.json';
import { GameDatasetSchema } from './game-data-schema';
import type { GameDataset, Question, MissionEnding, Resources, ResourceBounds } from '@/types/game';

let cachedDataset: GameDataset | null = null;

export function getGameDataset(): GameDataset {
  if (cachedDataset) {
    return cachedDataset;
  }

  const parsed = GameDatasetSchema.safeParse(rawData);
  if (!parsed.success) {
    console.error('CRITICAL: Game dataset validation failed:', parsed.error.format());
    throw new Error(`Invalid game dataset: ${parsed.error.message}`);
  }

  cachedDataset = parsed.data as GameDataset;
  return cachedDataset;
}

export function getQuestionById(id: string): Question | undefined {
  const dataset = getGameDataset();
  return dataset.questions.find((q) => q.id === id);
}

export function getEndingById(id: string): MissionEnding | undefined {
  const dataset = getGameDataset();
  return dataset.endings.find((e) => e.id === id);
}

export function getInitialResources(): Resources {
  const dataset = getGameDataset();
  return { ...dataset.initial_resources };
}

export function getResourceBounds(): ResourceBounds {
  const dataset = getGameDataset();
  return { ...dataset.resource_bounds };
}
