# NovaScript: Master Roadmap & Implementation Checklist
**Document Version:** 2.1.0  
**Target Branch:** `dev`  
**Status:** Verification & QA Stage  

This document serves as the master checklist and architecture specification for all ongoing and completed enhancements in **NovaScript**. Any autonomous agent or developer can pick up from this checklist directly.

---

## Master Checklist

### 1. Customizable Keybindings System (نظام تخصيص أزرار التحكم)
- [x] Create `Keybindings` interface & default configuration in `src/game/types.ts` (`moveForward`, `moveBackward`, `moveLeft`, `moveRight`, `interact`, `inventory`, `profile`, `minimap`, `handbook`, `pause`).
- [x] Add `keybindings: Keybindings`, `setKeybinding: (action, key) => void`, and `resetKeybindings: () => void` in `src/game/store.ts` with LocalStorage persistence.
- [x] Build interactive Keybinding Rebinding UI inside `SettingsModal.tsx` allowing players to click an action and press any key to rebind.
- [x] Wire up `useInput.ts` and `page.tsx` global event listeners to dynamically read and respect user custom keybindings.

### 2. Mouse Double-Click & Mobile Touch Interaction (التفاعل بالماوس المزدوج واللمس)
- [x] Add mouse double-click (`dblclick`) handler in `InteractionHandler.tsx` to trigger immediate interaction when double-clicking near an interactable object or portal.
- [x] Add mobile double-tap detection on touch devices (`touchstart` / `touchend` interval < 320ms) to trigger interaction without needing a keyboard.
- [x] Add on-screen floating Action Button / Interaction Pill `[E] INTERACT // DOUBLE-CLICK` in `ExplorationHUD.tsx` for seamless touch/mouse gameplay.

### 3. Visual Modes & Render Moods (أنماط العرض والجرافيكس)
- [x] Define `VisualMode`: `'cinematic-3d'` (default), `'retro-pixel'`, `'cyber-neon'`, `'performance'`.
- [x] Store `visualMode` in `store.ts` with LocalStorage persistence.
- [x] Add real-time Visual Mode switcher in `SettingsModal.tsx`.
- [x] Implement retro pixelation & CRT scanline effect for `'retro-pixel'` in `page.tsx`.
- [x] Implement vibrant neon bloom and cyan-magenta saturation for `'cyber-neon'`.
- [x] Implement clean lightweight lighting and shadows for `'performance'`.

### 4. Bilingual Arabic & English Localization (الترجمة ودعم اللغتين)
- [x] Create localization dictionary `src/lib/i18n/translations.ts` containing complete English (`en` - default) and Arabic (`ar`) strings.
- [x] Store `language: 'en' | 'ar'` in `store.ts` with LocalStorage persistence (default `'en'`).
- [x] Add 1-click language toggle (`EN / AR` 🌐) on Main Menu, Settings, Exploration HUD, and Player Profile.
- [x] Integrate translations across Main Menu, HUD, Settings, Minimap, Profile, and Handbook with proper Arabic typography and RTL support.

### 5. Enhanced Radar Minimap Polish (ترقية وتجميل رادار المحطة)
- [x] True physical spatial topology (Central Hub at center, Command Center at West, Hangar at East, Science Lab at NW, Comms at NE, Resource Bay at SW, Mission Board at SE).
- [x] Add animated rotating radar sweep beam effect in SVG.
- [x] Add iconic facility glyphs inside each room tile (🔬 Lab, 🛸 Hangar, 📡 Comms, 🚀 Mission Board, 📦 Resource Bay, 🖥️ Command Center, 🌐 Central Hub).
- [x] Add clickable room tiles on minimap to show active waypoint distance and direction from player.
- [x] Add cardinal compass points (N, S, E, W).

### 6. Character Visual Polish & Audio Polish
- [x] Dynamic visor headlight glow with subtle point light in 3D (`Player3D.tsx`) illuminating station floor and walls.
- [x] Footstep audio timing synchronization with walk cycle in `usePlayerController.ts`.
- [x] Holographic scanline sweep animation over avatar in `PlayerProfileModal.tsx`.
- [x] Dynamic suit color customizer with 5 color swatches.

### 7. Verification & QA Protocol
- [x] Run `npx tsc --noEmit` (ensure 0 compiler errors).
- [x] Run `npm run test:engine` (verify all 33 paths, 31 questions, 8 endings).
- [x] Execute automated Puppeteer test verifying keybindings, double-click interaction, language switching, and visual modes.
- [x] Capture full-resolution screenshots into artifact screenshots directory.
- [x] Clean Git commit on `dev` without pushing to remote.

---
*Updated automatically as tasks progress.*
