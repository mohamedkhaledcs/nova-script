/**
 * Crafting recipes and logic.
 * All crafting results are COSMETIC only — they do NOT affect
 * canonical mission resources or ending scores.
 */

import type { CraftingRecipe, CollectibleType } from '@/game/types';

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'craft-golden-hull',
    name: 'Golden Hull Plating',
    description: 'Apply a prestigious golden finish to your spacecraft hull.',
    ingredients: { 'metal-scrap': 5, 'rare-mineral': 2 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-golden-hull',
  },
  {
    id: 'craft-enhanced-antenna',
    name: 'Enhanced Antenna Array',
    description: 'A decorative high-gain antenna upgrade for your spacecraft display.',
    ingredients: { 'metal-scrap': 3, 'energy-cell': 3 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-antenna-upgrade',
  },
  {
    id: 'craft-science-module',
    name: 'Science Lab Module',
    description: 'An extra laboratory compartment displayed on your spacecraft model.',
    ingredients: { 'science-sample': 5, 'blueprint-fragment': 2 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-science-module',
  },
  {
    id: 'craft-crystal-core',
    name: 'Crystal Power Core',
    description: 'A glowing crystalline reactor core — purely decorative but impressive.',
    ingredients: { 'rare-mineral': 3, 'energy-cell': 4 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-crystal-core',
  },
  {
    id: 'craft-thruster-boost',
    name: 'Plasma Thruster Fins',
    description: 'Stylish thruster fins that glow blue on your spacecraft model.',
    ingredients: { 'metal-scrap': 4, 'energy-cell': 2, 'blueprint-fragment': 1 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-plasma-thrusters',
  },
  {
    id: 'craft-command-badge',
    name: 'Commander Badge',
    description: 'A distinguished commander emblem. Proof of your engineering prowess.',
    ingredients: { 'metal-scrap': 2, 'rare-mineral': 1, 'science-sample': 2, 'blueprint-fragment': 1 },
    resultType: 'cosmetic',
    resultId: 'cosmetic-commander-badge',
  },
];

export interface CraftingResult {
  success: boolean;
  message: string;
}

export function canCraft(
  recipe: CraftingRecipe,
  inventory: Record<CollectibleType, number>
): boolean {
  for (const [type, required] of Object.entries(recipe.ingredients)) {
    const available = inventory[type as CollectibleType] ?? 0;
    if (available < (required as number)) return false;
  }
  return true;
}

export function getCraftableRecipes(
  inventory: Record<CollectibleType, number>
): { recipe: CraftingRecipe; canAfford: boolean }[] {
  return CRAFTING_RECIPES.map((recipe) => ({
    recipe,
    canAfford: canCraft(recipe, inventory),
  }));
}
