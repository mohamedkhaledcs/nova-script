# NovaScript Development History & Version Changelog

> **Current Version**: `2.5.0 (Latest Production Release)`  
> **Repository**: [https://github.com/mohamedkhaledcs/nova-script](https://github.com/mohamedkhaledcs/nova-script)  
> **Engineering Collaboration**: Mohamed Khaled & Antigravity (Google DeepMind)

---

## Executive Summary & Narrative Journey

NovaScript was conceived as an ambitious entry for the **NASA Space Apps Challenge 2026** (*Space Mission Design Game*). Rather than creating a static multiple-choice quiz, the project was envisioned by **Mohamed Khaled** as a fully immersive, browser-based aerospace command simulation that integrates:
1. A **3D space station exploration sandbox** with interactive workstations and mini-games.
2. A **scientifically grounded, branching mission design engine** balancing realistic aerospace trade-offs (Budget, Mass, Power, Science Return, Comms).
3. **Four distinct visual modes**, including an intricate 3D Minecraft Voxel Space Station, Cyber Neon, CAD Blueprint, and Cinematic 3D.
4. **Complete deep bilingual localization** translating all 31 questions, 62 answers, and 8 endings into fluent scientific Arabic without compromising canonical data integrity.
5. An unwavering **Zero-Emoji aerospace design philosophy**, replacing standard emojis with precision-engineered SVG vector graphics and aerospace telemetry typography.

Throughout development, the engineering effort followed an iterative co-development rhythm where architectural rules were strictly defined and validated at every phase.

---

## Chronological Version Changelog

### Version 1.0.0 — The Core Engine & Canonical Graph Audit
*Initial Release — Deterministic Foundation*

- **Canonical Question Graph Loader**:
  - Validated `public/data/ques-en.json` containing 31 questions, 62 answers, and 8 endings.
  - Implemented runtime Zod validation schemas (`game-data-schema.ts`).
- **Safe Deterministic Formula Evaluator (`scoring-engine.ts`)**:
  - Replaced risky dynamic JavaScript `eval()` or `new Function()` with a typed, allowlisted mathematical tokenizer.
- **Resource Engine (`resource-engine.ts`)**:
  - Normalized 5 core aerospace resources on a 0–100 scale: Budget, Mass, Power, Science Return, and Communications.
  - Implemented strict upper and lower boundary clamping.
- **Engine Test Suite (`scripts/test-engine.mjs`)**:
  - Built an automated graph crawler that verified all 33 distinct paths, ensuring 100% reachability of all 31 questions and 8 endings.

---

### Version 1.1.0 — 3D Space Station & Isometric Exploration
*Three.js World & Station Navigation*

- **Three.js / React Three Fiber Integration**:
  - Implemented `GameCanvas.tsx` with dynamic SSR-disabled loading and WebGL error boundary fallbacks.
- **Station Room Architecture (`rooms.ts` & `Room3DScene.tsx`)**:
  - Built 5 interconnected station rooms: Central Hub, Science Lab, Spacecraft Hangar, Communications Array, and Mission Launch Board.
  - Added portals for seamless room-to-room transitions.
- **Player Controller & Isometric Camera**:
  - Billboarded astronaut sprite moving in 3D space with velocity damping and room collision detection (`usePlayerController.ts`).
  - Smooth camera lerping following player coordinates (`CameraController.tsx`).
- **Interactive Proximity System (`InteractionHandler.tsx`)**:
  - Contextual interaction triggers (E key) when standing near terminals, workbenches, and mission boards.

---

### Version 1.2.0 — Crafting, Mini-Games & Procedural Audio
*Interactive Aerospace Workstations*

- **Spectrometer Mini-Game (`MiniGameOverlay.tsx`)**:
  - Interactive wavelength analysis simulation for scanning lunar regolith and martian soil samples.
- **Antenna Alignment Mini-Game**:
  - Real-time azimuth, elevation, and frequency tuning for deep space telemetry communication.
- **Hangar Bay 3D Spacecraft Viewer (`Spacecraft3DViewer.tsx`)**:
  - Interactive 3D probe model inspection with orbit rotation controls.
- **Workbench Crafting System (`CraftingPanel.tsx` & `recipes.ts`)**:
  - Crafting recipes for ion thrusters, solar arrays, and high-gain antennas using collected scrap and blueprint fragments.
- **Zero-Dependency Procedural Audio (`procedural-synth.ts`)**:
  - Built an in-engine procedural audio synthesizer using the Web Audio API (`AudioContext`) generating UI clicks, telemetry beeps, and proximity chimes without external audio asset downloads.

---

### Version 1.3.0 — Mission Staging & Launch Cinematics
*Cinematic Orchestration & GSAP Integration*

- **GSAP Launch Cinematic (`LaunchCinematic.tsx`)**:
  - Multi-stage sequence choreography: launch countdown, main engine ignition, booster staging, fairing separation, and translunar injection.
- **Mission Debrief & Report System (`MissionReport.tsx`)**:
  - Post-flight analysis calculating final mission score, mission success grade, aerospace engineering trade-off breakdown, and chronological decision history.
- **Dynamic Ambient Music Engine (`music-engine.ts`)**:
  - Multi-layered procedural synthesizer shifting harmonic pads and filtering based on player state (menu, exploration, mission active, debrief).

---

### Version 1.4.0 — Astronaut Identity, Profile & Customization
*Player Personalization & Achievements*

- **Dual Astronaut Avatars (`MainMenu.tsx`)**:
  - Instant 1-click toggle between Commander Alex (`player.png`) and Specialist Maya (`player-female.png`).
  - Preserved original 1:1 pixel-art aesthetics and RGBA transparency.
- **Suit Color Customizer (`PlayerProfileModal.tsx`)**:
  - 6 selectable aerospace EVA suit palettes: Solar Orange, Lunar White, Deep Space Navy, Martian Crimson, Orbital Cyan, and Stealth Carbon.
- **Progression & Achievement System (`achievements.ts`)**:
  - 11 unlockable aerospace achievements tracked in LocalStorage (e.g., First Footsteps, Chief Engineer, Master Astronomer).
  - Floating toast notifications upon unlocking milestones (`AchievementNotifications.tsx`).

---

### Version 1.5.0 — Space Handbook & Station Radar Minimap
*Aerospace Encyclopedia & Real-Time Telemetry*

- **Space Handbook Encyclopedia (`SpaceHandbookModal.tsx`)**:
  - **Destinations**: Comparative environmental physics of Moon vs. Mars (gravity, temperature extremes, radiation, atmospheric density).
  - **Spacecraft Systems**: In-depth primers on chemical vs. electric propulsion, triple-junction solar cells, RTGs, and heat pipes.
  - **Orbital Mechanics 101**: Hohmann transfer orbits, delta-v budgets, and Lagrange equilibrium points.
- **Topological Station Radar Minimap (`StationMinimap.tsx`)**:
  - Real-time rotating radar sweep beam with aerospace phosphor glow.
  - Topological room layout with active player coordinate tracking.
  - Interactive waypoint setting with distance calculation.

---

### Version 2.0.0 — Visual Engine Expansion & Flexible Controls
*Multi-Style Shaders & Mobile Input Parity*

- **4 Real-Time Visual Modes (`store.ts` & `Room3DScene.tsx`)**:
  - **Cinematic 3D**: Realistic PBR lighting, metallic roughness, and space station shadows.
  - **Retro Pixel / Voxel**: Stepped block geometries and retro pixelated textures.
  - **Cyber Neon**: Cyberpunk wireframe glow with neon accents and high contrast.
  - **CAD Blueprint**: Aerospace technical schematic visualization with blueprints grids.
- **Keybinding Customization System (`SettingsModal.tsx`)**:
  - Configurable primary and secondary keys for movement, interaction, inventory, codex, and minimap.
- **Mouse & Mobile Interaction Parity (`InteractionHandler.tsx`)**:
  - Supported mouse double-click (`dblclick`) and mobile double-tap (`touchend` < 320ms) for direct interaction without physical keyboards.

---

### Version 2.1.0 — Minecraft Voxel 3D Space Station
*Block Aesthetics & In-Engine Voxel Architecture*

- **Minecraft Central Beacon (Central Hub)**:
  - Stepped 3×3 pyramid base with emerald blocks, glass enclosure, and a luminous cyan vertical skybeam firing into the ceiling.
- **Minecraft Bookshelf Assemblies (Science Lab)**:
  - Triple wooden voxel book racks with red, blue, and green book blocks.
- **Minecraft Anvil & Tool Station (Spacecraft Hangar)**:
  - Stepped base, neck, and horn anvil assembly.
- **Cyber Holographic Energy Rings**:
  - Rotating cyan and magenta holographic energy toruses around the central core for Cyber Neon mode.

---

### Version 2.2.0 — Zero-Emoji Aerospace Aesthetic Enforcement
*Strict Visual Integrity & Custom Vector Art*

- **Comprehensive Emoji Elimination**:
  - Executed automated regex scanning across all `.ts`, `.tsx`, and `.css` files, replacing all Unicode emojis with precision SVG vectors.
- **Custom Planet Graphics (`MissionSelector.tsx`)**:
  - Handcrafted SVG celestial bodies for the Moon (craters, lunar maria) and Mars (polar ice caps, Olympus Mons feature).
- **Custom Aerospace Iconography**:
  - Replaced arbitrary symbols with clean Lucide icons and aerospace telemetry typography.

---

### Version 2.3.0 (Latest Production Release) — Canonical Arabic Mission Overlay & Production Release
*Deep Bilingual Localization & GitHub Deployment*

- **Canonical Arabic Mission Overlay (`src/lib/i18n/mission-translations-ar.ts`)**:
  - Translated all **31 questions** (Q001 through Q031), **62 answer options** (A001 through A062), consequence trade-off summaries, and all **8 mission endings** (E001 through E008) into natural, scientifically rigorous Arabic.
  - Implemented `getLocalizedQuestion` and `getLocalizedEnding` getters, maintaining canonical integrity of `ques-en.json` without any direct file modification.
- **Bilingual Question Viewer & Consequence Dialog**:
  - Question operations, narrative descriptions, answer choices, and engineering consequence popups display dynamically in Arabic when `language === 'ar'`.
- **HUD Quick Visual Mode Switcher Pill**:
  - Added an instant 1-click mode cycler directly on the top telemetry bar beside the language toggle for seamless switching between 3D Cinema, Voxel, Cyber Neon, and CAD Blueprint.
- **Space Handbook Arabic Translation**:
  - Translated all destinations, spacecraft engineering subsystems, and orbital physics sections into Arabic.
- **Full Production Build Verification**:
  - Next.js 15 production build compiled successfully with zero type errors (`npx tsc --noEmit`).
  - Graph engine test passed all 33 paths, 31 questions, and 8 endings.
- **Repository Deployment**:
  - Full codebase deployed and synchronized with remote repository: `https://github.com/mohamedkhaledcs/nova-script` on both `main` and `dev` branches.

---

### Version 2.4.0 (Latest Production Release) — Tactical Radar Toggle & Universal Bilingual Keyboard Normalization
*Radar Minimization Pill & Universal Keyboard Parity*

- **Station Radar Interactive Show/Hide Toggle (`StationMinimap.tsx`)**:
  - Added an in-radar header hide button (`EyeOff`) and bottom bar toggle.
  - When minimized, collapses into a sleek tactical floating glassmorphism popup/pill in the bottom-right corner featuring an animated pulsating antenna blip, active station room code (e.g. `HUB-TRN`), and `[M]` badge.
  - Clicking the bottom-right pill smoothly restores the full holographic radar matrix.
  - Pressing `M` (or Arabic equivalent) toggles seamlessly between full radar panel and compact pill.
- **Universal Bilingual Keyboard Normalization (`types.ts`, `page.tsx`, `useInput.ts`, `InteractionHandler.tsx`)**:
  - Implemented `normalizeKey` and `matchesKey` supporting all keyboard variations across the application:
    - English lowercase and uppercase (`M` / `m`, `W` / `w`, `E` / `e`, `I` / `i`, `P` / `p`, `Tab`, `Escape`).
    - Arabic physical layout mapping: `ص`->w, `س`->s, `ش`->a, `ي`->d, `ث`->e, `ة`->m, `ه`->i, `ح`->p, `لا`->b.
    - Arabic phonetic mapping: `م` (Meem) / `ة` (Teh Marbuta) both map to `m` for immediate Radar toggle.
    - Browser physical `KeyboardEvent.code` resolution (`KeyM`, `KeyW`, `KeyA`, `KeyS`, `KeyD`, `KeyE`, `KeyI`).
- **Comprehensive Verification**:
  - Automated Puppeteer test (`scripts/test-radar-and-keys.mjs`) verified hide button, restore pill, `KeyM`, Arabic `ة` key, and Arabic HUD view with 6 verification screenshots.
- **CAD Blueprint Visual Mode Overhaul (`Room3DScene.tsx`, `GameCanvasInner.tsx`, `page.tsx`, `Player3D.tsx`)**:
  - Completely redesigned Mode 4 (CAD Blueprint) to be 100% distinct from Cinematic 3D:
    - **Luminous Blueprint Grid Floor**: Added interactive cyan/electric blue `gridHelper` over deep blueprint navy `#041633`.
    - **Architectural Schematic Walls**: Cyan wireframe edges with translucent structural blue glass infill.
    - **Holographic Gyroscope Assembly**: Rotating 3D wireframe measurement sphere and rings in the central hub.
    - **Player Target Reticle**: Technical cyan locator ring under the astronaut's feet.
    - **Technical HUD Drafting Overlay**: Blueprint drafting corner brackets, technical grid paper overlay, and specification headers.

### Version 2.5.0 (Latest Production Release) — Artemis Flight Director Telemetry Console, Multi-Room 3D Visual Modes & Collaboration Standards
*Mission Operations Overhaul & Universal Collaboration Blueprint*

- **Artemis Flight Director Telemetry Console (`QuestionViewer.tsx`)**:
  - Implemented real-time **ECLSS & Subsystem Telemetry HUD Strip** at the top of question operations, displaying live micro-gauges and progress bars for all 5 aerospace resources (Budget, Mass, Power, Science Return, Comms).
  - Integrated dynamic **Mission Elapsed Time (MET)** counter (`T+00:XX:42 MET`) and stage tracking.
  - Added **Projected Delta & Trend Indicators** (`TrendingUp` / `TrendingDown`) previewing real-time subsystem deltas on hover and focus.
  - Overhauled the **Engineering Trade-off Analysis & Flight Sign-Off Consequence Modal** with Artemis Flight Director operational standards.
- **Mode-Aware Dynamic Question UI Theming (`QuestionViewer.tsx`)**:
  - **CAD Blueprint Mode**: Navy blue drafting canvas (`#03142e`), high-contrast cyan wireframe borders, coordinate brackets (`┌ [CAD // 04.2]`, `[TRAJ-AXIS] ┐`, `└ [GEO-SPEC]`, `[SEC-NOMINAL] ┘`).
  - **Retro Pixel Mode**: Minecraft voxel aesthetic with amber drop-shadows (`6px 6px 0 0 #78350F`), chunky 2px borders, and warm golden progress bars.
  - **Cyber Neon Mode**: High-octane cyberpunk theme with emissive magenta/cyan glow lines (`#EC4899`, `#00F0FF`) and holographic neon cards.
  - **Cinematic 3D Mode**: Aerospace glassmorphism console with refined metallic borders and subtle ambient backdrops.
- **Universal Decision Hotkeys & Arabic Numeral Parity (`types.ts`, `QuestionViewer.tsx`)**:
  - Quick decision selection via keyboard hotkeys: `[1]` / `[A]` (and Arabic `[١]` / `[ش]`) for Option A; `[2]` / `[B]` (and Arabic `[٢]` / `[س]`) for Option B.
  - Modal confirmation hotkey: `[Enter]` or `[Space]` confirms decision and advances mission without mouse interaction; `[Escape]` re-examines trade-offs.
  - Extended `ARABIC_TO_LATIN` mapping in `types.ts` with Arabic numerals (`١` through `٩` and `٠`).
- **Comprehensive Multi-Room 3D Visual Mode Assemblies (`Room3DScene.tsx`)**:
  - Expanded all 4 visual engines across every station room (`command-center`, `science-lab`, `hangar`, `comms-array`, `resource-bay`, `mission-board`, `hallway`):
    - **Retro Pixel**: Minecraft Redstone Repeater console table & dust trails in Command Center; Bookshelves & Brewing stand in Science Lab; Iron Anvil & Crafting Table in Hangar; Double Chest in Resource Bay; Jukebox in Comms Array; Cartography Table in Mission Board.
    - **Cyber Neon**: Tactical holographic radar rings & twin vertical data pillars in Command Center; Glowing DNA/molecular double-helix in Science Lab; High-voltage electric blue arc cylinder in Hangar; Radiating radar rings in Comms Array; Energy storage cells in Resource Bay; Tactical holographic grid in Mission Board.
    - **CAD Blueprint**: Wireframe orbital trajectory ellipse & satellite model in Command Center; Spectrometer prism wireframe & ray vectors in Science Lab; Rocket propulsion nozzle schematic with dimension callouts in Hangar; Parabolic dish wireframe antenna in Comms Array; Isometric crate stack in Resource Bay; Flight flowgraph nodes in Mission Board.
    - **Cinematic 3D**: Subtle atmospheric dust particle lighting field.
- **Mohamed Khaled Collaboration Guidelines (`docs/MOHAMED_COLLABORATION_GUIDELINES.md`)**:
  - Codified the definitive working standard, architectural rules, bilingual parity, zero-emoji policy, and developer mindset guidelines established by Mohamed Khaled for NovaScript and future projects.
- **Automated Verification**:
  - Tested with Puppeteer (`scripts/test-v25-polish.mjs`), capturing screenshots 61 through 66 across CAD Blueprint, Retro Pixel, Cyber Neon, Cinematic 3D Arabic, and keyboard navigation.

---

## Future Roadmap Rhythm (v2.5.0+)

Any subsequent updates to NovaScript should follow this continuous engineering cadence:
1. Document the proposed changes in `PROJECT_ROADMAP_AND_CHECKLIST.md`.
2. Add new domain entities to `docs/DATA_DICTIONARY.md` and `docs/PROJECT_STRUCTURE.md`.
3. Verify zero TypeScript compiler errors (`npx tsc --noEmit`).
4. Run the deterministic engine verification suite (`npm run test:engine`).
5. Increment the minor version number (e.g., `v2.5.0`) in `docs/DEVELOPMENT_HISTORY.md` and `docs/PROJECT_STRUCTURE.md`.
