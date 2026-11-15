/**
 * Achievement definitions and tracking.
 * Achievements are supplementary progression — they do NOT
 * affect canonical mission resources or endings.
 */

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  missionsCompleted: number;
  endingsDiscovered: string[];
  totalCollectiblesFound: number;
  totalItemsCrafted: number;
  roomsVisited: string[];
  totalScore: number;
  bestScore: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Enter the space station for the first time.',
    icon: 'STEP',
    condition: () => true, // Unlocked immediately on first exploration
  },
  {
    id: 'explorer',
    title: 'Station Explorer',
    description: 'Visit all 7 rooms in the space station.',
    icon: 'EXPLORE',
    condition: (s) => s.roomsVisited.length >= 7,
  },
  {
    id: 'first-mission',
    title: 'Mission Commander',
    description: 'Complete your first space mission.',
    icon: 'MISSION',
    condition: (s) => s.missionsCompleted >= 1,
  },
  {
    id: 'collector',
    title: 'Scavenger',
    description: 'Collect 10 items across the station.',
    icon: 'SCRAP',
    condition: (s) => s.totalCollectiblesFound >= 10,
  },
  {
    id: 'master-collector',
    title: 'Master Collector',
    description: 'Collect 50 items across the station.',
    icon: 'RELIC',
    condition: (s) => s.totalCollectiblesFound >= 50,
  },
  {
    id: 'first-craft',
    title: 'Engineer',
    description: 'Craft your first upgrade at the workbench.',
    icon: 'CRAFT',
    condition: (s) => s.totalItemsCrafted >= 1,
  },
  {
    id: 'master-crafter',
    title: 'Master Engineer',
    description: 'Craft all 6 available upgrades.',
    icon: 'FORGE',
    condition: (s) => s.totalItemsCrafted >= 6,
  },
  {
    id: 'outstanding',
    title: 'Outstanding Success',
    description: 'Achieve an Outstanding Success ending.',
    icon: 'APEX',
    condition: (s) => s.endingsDiscovered.includes('E001'),
  },
  {
    id: 'efficient',
    title: 'Efficient Operations',
    description: 'Achieve an Efficient Success ending.',
    icon: 'ENERGY',
    condition: (s) => s.endingsDiscovered.includes('E002'),
  },
  {
    id: 'scientist',
    title: 'Scientific Discovery',
    description: 'Achieve a Scientific Discovery ending.',
    icon: 'SCIENCE',
    condition: (s) => s.endingsDiscovered.includes('E003'),
  },
  {
    id: 'all-endings',
    title: 'Multiverse Explorer',
    description: 'Discover all 8 possible mission endings.',
    icon: 'COSMOS',
    condition: (s) => s.endingsDiscovered.length >= 8,
  },
  {
    id: 'three-missions',
    title: 'Veteran Commander',
    description: 'Complete 3 missions.',
    icon: 'VETERAN',
    condition: (s) => s.missionsCompleted >= 3,
  },
  {
    id: 'five-missions',
    title: 'Fleet Admiral',
    description: 'Complete 5 missions.',
    icon: 'ADMIRAL',
    condition: (s) => s.missionsCompleted >= 5,
  },
  {
    id: 'high-score',
    title: 'Top Performer',
    description: 'Achieve a mission score above 300.',
    icon: 'ELITE',
    condition: (s) => s.bestScore > 300,
  },
];

export function checkAchievements(
  stats: AchievementStats,
  previouslyUnlocked: string[]
): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (previouslyUnlocked.includes(ach.id)) continue;
    if (ach.condition(stats)) {
      newlyUnlocked.push(ach.id);
    }
  }
  return newlyUnlocked;
}

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
