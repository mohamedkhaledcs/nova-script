# NovaScript: Master Roadmap & Implementation Checklist
**Document Version:** 3.0.0  
**Target Branch:** `dev`  
**Status:** Verification & Polish Complete (Production Ready)  

This document serves as the master checklist and architecture specification for all ongoing and completed enhancements in **NovaScript**.

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

### 3. Dynamic 3D Visual Modes Overhaul (أنماط العرض والجرافيكس ثلاثية الأبعاد)
- [x] Define `VisualMode`: `'cinematic-3d'` (default), `'retro-pixel'`, `'cyber-neon'`, `'performance'`.
- [x] Implement real Three.js WebGL downscaling: `dpr={0.32}` with `[image-rendering:pixelated]` in `GameCanvasInner.tsx` for true blocky 16-bit retro arcade visuals.
- [x] Add CRT scanlines & phosphor vignette overlay with `[16-BIT RENDER MATRIX // CRT-01]` badge.
- [x] Implement dynamic WebGL lighting in `Room3DScene.tsx`: purple ambient `#350059` and ultra-bright point lights (`#00F0FF`, `#FF007F`, `#FFE600`) for `'cyber-neon'`, amber ambient for `'retro-pixel'`, and zero sparkles for `'performance'`.
- [x] Dynamic visor headlight adapting to mode (cyan beam in cyber-neon, warm amber in retro-pixel, disabled in performance).

### 4. Zero-Emoji Sci-Fi Aesthetic Overhaul (إلغاء الإيموجي واستبدالها برموز تكتيكية)
- [x] Zero emojis across all UI, HUD, Modals, Minimap, and Settings (verified via automated scanner).
- [x] Replaced minimap emojis with tactical glyphs (`HUB-TRN`, `CMD-00`, `HNG-02`, `LAB-01`, `COM-03`, `RES-05`, `MSN-06`).
- [x] Replaced Moon & Mars emojis in Mission Selector with custom animated SVG vector celestial spheres.
- [x] Replaced gender emojis with military designations `ALEX // CDR` and `MAYA // SPEC`.
- [x] Replaced item emojis with colored vector badges (`SCRP`, `FUSN`, `SMPL`, `SCHM`, `CRYS`).
- [x] Replaced sample mini-game emojis with geological identifiers (`BASALT`, `REGOLITH`, `ICE-SIL`).

### 5. Deep Bilingual Arabic & English Localization (الترجمة الشاملة ودعم اللغتين)
- [x] Comprehensive localization dictionary `src/lib/i18n/translations.ts` (>530 lines) covering menus, rooms, directions, HUD, inventory, crafting workbench, mini-games, profile, and settings.
- [x] Complete Arabic support in Mission Operations (`QuestionViewer.tsx`), Consequence Modals, and Final Mission Report (`MissionReport.tsx`).
- [x] Complete Arabic translations for all Crafting Workbench recipes and cosmetic descriptions (`CraftingPanel.tsx`).
- [x] 1-click language toggle (`EN / AR` 🌐) on Main Menu, Settings, Exploration HUD, and Player Profile.
- [x] Full RTL layout adjustment and Arabic typography support.

### 6. Enhanced Radar Minimap Polish (ترقية وتجميل رادار المحطة)
- [x] True physical spatial topology (Central Hub at center, Command Center at West, Hangar at East, Science Lab at NW, Comms at NE, Resource Bay at SW, Mission Board at SE).
- [x] Animated rotating radar sweep beam effect in SVG.
- [x] Clickable room tiles on minimap showing active waypoint distance in meters and direction from player.
- [x] Cardinal compass points (`ش`, `ج`, `غ`, `ق` in Arabic; `N`, `S`, `W`, `E` in English).

### 7. Character Customization & Audio Polish
- [x] Dynamic visor headlight glow with point light in 3D (`Player3D.tsx`).
- [x] Footstep audio timing synchronization with walk cycle in `usePlayerController.ts`.
- [x] Holographic scanline sweep animation over avatar in `PlayerProfileModal.tsx`.
- [x] Dynamic suit color customizer with 5 color swatches (`default`, `solar-amber`, `cosmic-violet`, `cyber-teal`, `crimson-alpha`).
- [x] Solved token/collectible spam noise: single audio chime and incrementing stack counter badge.

### 8. Verification & QA Protocol
- [x] `npx tsc --noEmit` reports 0 errors.
- [x] `npm run test:engine` passes 100% deterministically across all 33 paths, 31 questions, and 8 endings.
- [x] Automated emoji scanner verifies 0 emojis in source code.
- [x] React Rules of Hooks verified: removed hook execution after early return in `ExplorationHUD.tsx`.
- [x] Headless Puppeteer verification suite captures 32 full-resolution screenshots with 0 browser console errors.
- [x] Clean Git commit on `dev` without remote force push.
