# Agent & Developer Working Guidelines: NovaScript

This document defines core conventions, constraints, and architecture rules for developers and autonomous agents working on the **NovaScript** repository.

---

## 1. Prime Directives

1. **Canonical Gameplay Source of Truth**:
   - `public/data/ques-en.json` is the sole canonical source of truth for the question graph, answer branches, resource effects, educational explanations, and mission endings.
   - **Never hardcode questions or endings** into UI components.
   - **Never rewrite or modify scientific content or branch IDs** in `ques-en.json` without explicit user instruction.
   - Any supplementary gameplay objectives, checklists, or interactive tasks must be stored in distinct files (e.g., `src/data/gameplay-tasks.ts`) and must not alter the canonical graph.

2. **Asset Integrity**:
   - The player character asset `player.png` and custom pointer `rocket-cursor.png` must preserve original pixel-art style, aspect ratios, and RGBA transparency.
   - Do not replace or regenerate these assets with arbitrary AI imagery.
   - The rocket cursor is a large graphic (1024x1536) and must be rendered as an in-DOM viewport element with `pointer-events: none;`, scaled down (~36px), with hotspot aligned to the rocket tip. Disable it on touch devices.

3. **No Dynamic Eval for Formulas**:
   - Never use JavaScript `eval()` or `new Function()` to execute score formulas in client-side or server-side code.
   - Use the typed safe evaluator (`src/lib/game-engine/scoring-engine.ts`) which deterministically parses and computes scores using an allowlisted arithmetic tokenizer.

4. **Engine / UI Separation**:
   - All game state transitions, graph navigations, resource clamping, and ending resolutions must live inside pure, testable TypeScript modules under `src/lib/game-engine/`.
   - React components are strictly view & interaction layers that render state and dispatch engine actions.

5. **Animation Responsibility Division**:
   - **GSAP / `@gsap/react`**: Exclusively used for cinematic sequence orchestration (launch countdown, rocket staging, orbital transitions, camera choreography, timeline playback).
   - **Motion for React**: Exclusively used for UI state transitions (modals, dialogs, button hovers, card selections, HUD transitions).
   - **Never let GSAP and Motion control the same CSS property on the same element.**

6. **Git Hygiene**:
   - Maintain a clean commit history with descriptive prefixes (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
   - Remote repository: `https://github.com/mohamedkhaledcs/nova-script`.
   - Never force-push (`git push --force`).
   - Do not commit `.env`, credentials, or Supabase service keys.

---

## 2. Architecture & File Conventions

- **Path aliases**: Use `@/*` pointing to `./src/*`.
- **Typing**: Strict TypeScript (`noImplicitAny: true`, strict null checks).
- **Zod Schemas**: Validate all loaded game data at boot time via `src/lib/data/game-data-schema.ts`.
- **Graceful 3D Degradation**: All Three.js / React Three Fiber canvases must be dynamically imported with SSR disabled (`next/dynamic`, `ssr: false`), wrapped in React Error Boundaries, with WebGL fallback detection.

---

## 3. Verification Protocol

Before declaring any feature complete:
1. Run `npx tsc --noEmit` to ensure zero TypeScript compiler errors.
2. Verify all 31 questions, 62 answers, and 8 endings remain reachable.
3. Test guest persistence in LocalStorage across browser page refreshes.
4. Verify accessibility: keyboard navigation (`Tab`, `Space`, `Enter`, `Escape`), responsive layouts, and `prefers-reduced-motion` compliance.
