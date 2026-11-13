/**
 * Crafting panel UI — overlay shown when interacting with the Hangar workbench.
 * All crafted items are COSMETIC only — no effect on canonical resources.
 */

'use client';

import React from 'react';
import { X, Hammer, Check, Lock } from 'lucide-react';
import { useGameStore } from '@/game/store';
import { getCraftableRecipes } from '@/game/crafting/recipes';
import { COLLECTIBLE_INFO } from '@/game/types';
import type { CollectibleType, CraftingRecipe } from '@/game/types';
import { audio } from '@/lib/audio/audio-manager';

interface CraftingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CraftingPanel({ isOpen, onClose }: CraftingPanelProps) {
  const { inventory, removeItem } = useGameStore();
  const [craftedItems, setCraftedItems] = React.useState<string[]>([]);

  // Load crafted items from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('novascript_crafted_v1');
      if (saved) setCraftedItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  if (!isOpen) return null;

  const recipes = getCraftableRecipes(inventory.items);

  const handleCraft = (recipe: CraftingRecipe) => {
    // Deduct ingredients
    for (const [type, amount] of Object.entries(recipe.ingredients)) {
      removeItem(type as CollectibleType, amount as number);
    }

    // Mark as crafted
    const updated = [...craftedItems, recipe.resultId];
    setCraftedItems(updated);
    try {
      localStorage.setItem('novascript_crafted_v1', JSON.stringify(updated));
    } catch { /* ignore */ }

    audio.success();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full glass-panel rounded-2xl border border-amber-500/40 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-space-border/60">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono font-bold text-lg text-white tracking-wider">
              WORKBENCH — CRAFTING
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-space-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400 font-mono">
          Use collected materials to craft cosmetic upgrades for your spacecraft.
          These are decorative only and do not affect mission performance.
        </p>

        {/* Recipe grid */}
        <div className="mt-4 space-y-3">
          {recipes.map(({ recipe, canAfford }) => {
            const alreadyCrafted = craftedItems.includes(recipe.resultId);

            return (
              <div
                key={recipe.id}
                className={`p-4 rounded-xl border transition-all ${
                  alreadyCrafted
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : canAfford
                    ? 'bg-space-900/80 border-amber-500/30 hover:border-amber-400/60'
                    : 'bg-space-950/60 border-space-border/30 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-mono text-sm font-bold text-amber-300">
                      {recipe.name}
                      {alreadyCrafted && (
                        <span className="ml-2 text-emerald-400 text-xs">✓ CRAFTED</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{recipe.description}</p>

                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Object.entries(recipe.ingredients).map(([type, amount]) => {
                        const info = COLLECTIBLE_INFO[type as CollectibleType];
                        const has = inventory.items[type as CollectibleType] >= (amount as number);
                        return (
                          <span
                            key={type}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${
                              has
                                ? 'border-emerald-600/40 bg-emerald-950/30 text-emerald-300'
                                : 'border-red-600/40 bg-red-950/30 text-red-300'
                            }`}
                          >
                            <span>{info.icon}</span>
                            <span>
                              {inventory.items[type as CollectibleType]}/{amount as number}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Craft button */}
                  <div className="shrink-0">
                    {alreadyCrafted ? (
                      <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleCraft(recipe)}
                        className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold tracking-wider transition-colors"
                      >
                        CRAFT
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-space-900/50 border border-space-border/30 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-space-border/30 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 font-mono text-xs tracking-wider"
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
