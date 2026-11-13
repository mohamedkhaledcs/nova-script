import type { Resources, ResourceBounds, ResourceKey } from '@/types/game';

export function clampResource(value: number, bounds: ResourceBounds): number {
  return Math.max(bounds.min, Math.min(bounds.max, value));
}

export function applyResourceEffects(
  current: Resources,
  effects: Partial<Resources>,
  bounds: ResourceBounds = { min: 0, max: 100 }
): {
  nextResources: Resources;
  appliedDeltas: Partial<Resources>;
} {
  const nextResources: Resources = { ...current };
  const appliedDeltas: Partial<Resources> = {};

  const keys: ResourceKey[] = ['budget', 'mass', 'power', 'scientific_value', 'communication'];

  for (const key of keys) {
    const delta = effects[key];
    if (typeof delta === 'number' && delta !== 0) {
      const rawNewValue = current[key] + delta;
      const clampedValue = clampResource(rawNewValue, bounds);
      nextResources[key] = clampedValue;
      appliedDeltas[key] = delta;
    }
  }

  return { nextResources, appliedDeltas };
}

export function isResourceCritical(key: ResourceKey, value: number): boolean {
  if (key === 'power' && value <= 20) return true;
  if (key === 'budget' && value <= 15) return true;
  if (key === 'communication' && value <= 15) return true;
  return false;
}
