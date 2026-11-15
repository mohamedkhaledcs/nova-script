# NovaScript Project Structure & File Guide

> **Specification Version**: `2.4.0 (Latest Production Release)`  
> **Repository**: [https://github.com/mohamedkhaledcs/nova-script](https://github.com/mohamedkhaledcs/nova-script)  
> **Architects**: Mohamed Khaled & Antigravity (Google DeepMind)

---

## Complete Repository Directory Tree

```text
nova-script/
├── .gitignore                                      # Git ignore rules for node_modules, build artifacts, env
├── AGENTS.md                                       # Working guidelines, prime directives, and engine rules for AI agents
├── LICENSE                                         # MIT Open Source License
├── next-env.d.ts                                   # Next.js TypeScript declarations
├── next.config.ts                                  # Next.js 15 configuration (React strict mode, build flags)
├── package.json                                    # Dependencies, scripts, package manifest
├── package-lock.json                              # Exact deterministic dependency tree
├── postcss.config.mjs                              # PostCSS configuration for Tailwind CSS 4
├── PROJECT_ROADMAP_AND_CHECKLIST.md                # Development roadmap, milestones, and audit checklist
├── README.md                                       # Main repository showcase, quickstart, and co-development overview
│
├── docs/                                           # Architecture, system blueprints & documentation
│   ├── ASSET_GUIDE.md                              # Sprite specs (player 1:1 pixel art, rocket cursor 36px hotspot)
│   ├── AUDIO_ASSET_MANIFEST.md                     # Sound synthesis specs, procedural Web Audio frequencies
│   ├── DATA_DICTIONARY.md                          # Zod schemas, normalized 0–100 resources, data types
│   ├── DEVELOPMENT_HISTORY.md                      # Chronological version changelog (v1.0.0 -> v2.3.0)
│   ├── GAMEPLAY_FLOW.md                            # State machines, sequence choreography, cinematic transitions
│   ├── IMPLEMENTATION_PLAN.md                      # Phased engineering blueprint & verification criteria
│   ├── JSON_GRAPH_AUDIT.md                         # Canonical graph audit (31 questions, 62 answers, 8 endings)
│   ├── PROJECT_BRIEF.md                            # Core vision, competition scope & engineering requirements
│   ├── PROJECT_STRUCTURE.md                        # Complete file-by-file annotated architectural breakdown
│   ├── SIMULATION_DESIGN.md                        # 3D scenes, orbits, telemetry & spacecraft visuals
│   ├── SOURCE_CATALOG.md                           # Scientific references & challenge attributions
│   └── TECH_ARCHITECTURE.md                        # Component tree, engine boundaries & state architecture
│
├── public/                                         # Static client assets served directly by Next.js
│   ├── assets/
│   │   ├── characters/
│   │   │   ├── player.png                          # Male astronaut Alex pixel-art sprite (1:1 aspect ratio)
│   │   │   └── player-female.png                   # Female astronaut Maya pixel-art sprite (1:1 aspect ratio)
│   │   └── cursor/
│   │       └── rocket-cursor.png                   # Rocket mouse pointer graphic (tip-aligned hotspot)
│   └── data/
│       └── ques-en.json                            # Canonical mission dataset (DO NOT MODIFY DIRECTLY)
│
├── resources/                                      # Public space agency reference documents & challenge PDFs
│   ├── 13-3547_A1b.pdf                             # Concept Maturity Levels (CML) JPL reference paper
│   ├── 250323-design-and-develop-science-mission.pdf # NASA SMD standard mission design guide
│   └── nasa_csli_cubesat_101_508.pdf               # NASA CubeSat 101 development manual
│
├── scripts/                                        # Automated test runners, engine solvers & verification suites
│   ├── browser-qa.mjs                              # Full headless Puppeteer screenshot QA runner
│   ├── test-engine.mjs                             # Deterministic graph crawler (verifies 33 paths, 31 questions)
│   ├── test-final-polish.mjs                       # Verification for visual modes, zero emojis & UI badges
│   ├── test-handbook-and-minimap.mjs               # Verification for Space Handbook and Station Minimap
│   ├── test-mission-flow.mjs                       # End-to-end mission question traversal & Arabic commit test
│   ├── test-new-features.mjs                       # Test runner for player customization & keybindings
│   ├── test-profile-and-collectibles.mjs           # Test runner for achievements and collectible pickups
│   ├── test-visual-modes-and-i18n.mjs              # Test runner for language toggling and graphic styles
│   ├── test-voxel-and-hud-buttons.mjs              # Test runner for Minecraft voxel beacon & HUD controls
│   └── verify-arabic-and-modes.mjs                 # Comprehensive 15-screenshot verification suite
│
└── src/                                            # Core application source code
    ├── app/                                        # Next.js 15 App Router pages & styles
    │   ├── globals.css                             # Global CSS, aerospace themes, animations, glassmorphism
    │   ├── layout.tsx                              # Root layout with font declarations, metadata & viewport
    │   └── page.tsx                                # Main orchestrator coordinating menus, 3D world, & missions
    │
    ├── components/                                 # Presentation and game interface components
    │   └── game/
    │       ├── ContextMenu/
    │       │   └── ContextMenu.tsx                 # Right-click contextual inspection menu
    │       ├── CustomCursor/
    │       │   └── CustomCursor.tsx                # In-DOM rocket cursor with tip hotspot (touch disabled)
    │       ├── GameHUD/
    │       │   └── GameHUD.tsx                     # Active mission telemetry bar (Budget, Mass, Power, Science)
    │       ├── MainMenu/
    │       │   └── MainMenu.tsx                    # Landing screen, avatar preview, gender toggle, language pill
    │       ├── MissionControl/
    │       │   └── MissionControl.tsx              # Directive 01 briefing, mandate acceptance, baseline metrics
    │       ├── MissionOperations/
    │       │   └── QuestionViewer.tsx              # Question card, answer choices A/B, consequence dialog
    │       ├── MissionReport/
    │       │   └── MissionReport.tsx               # Debrief debriefing, score breakdown, decision history
    │       └── SettingsModal/
    │           └── SettingsModal.tsx               # Audio sliders, visual modes, and keybinding remapping
    │
    ├── game/                                       # 3D simulation, player controller, UI overlays & station state
    │   ├── audio/
    │   │   ├── exploration-sfx.ts                  # Web Audio synthesizer triggers for footsteps, doors, beeps
    │   │   └── music-engine.ts                     # Ambient space synth engine with scene-based music layering
    │   ├── cinematics/
    │   │   └── LaunchCinematic.tsx                 # GSAP rocket launch countdown, staging, and orbit transition
    │   ├── crafting/
    │   │   └── recipes.ts                          # Workbench blueprints (ion engine, solar panel, sensor bus)
    │   ├── hangar/
    │   │   └── Spacecraft3DViewer.tsx              # 3D interactive probe inspection in Hangar Bay
    │   ├── input/
    │   │   └── useInput.ts                         # Keyboard polling hook with configurable action mappings
    │   ├── interactions/
    │   │   └── InteractionHandler.tsx              # Proximity trigger handling (E key, double-click, mobile tap)
    │   ├── player/
    │   │   ├── Player3D.tsx                        # Billboard player sprite in 3D Three.js scene with shadows
    │   │   ├── PlayerControllerBridge.tsx          # Bridge synchronizing Zustand player state with Three.js canvas
    │   │   └── usePlayerController.ts              # WASD/arrow velocity calculation, room boundaries & collision
    │   ├── progression/
    │   │   └── achievements.ts                     # 11 unlockable achievements with criteria and SVG badges
    │   ├── store.ts                                # Zustand global store (player, room, inventory, visual mode)
    │   ├── types.ts                                # TypeScript definitions for rooms, interactables, visual modes
    │   ├── ui/
    │   │   ├── AchievementNotifications.tsx        # Toast popups for unlocked aerospace achievements
    │   │   ├── CodexPanel.tsx                      # Achievements and collected blueprint logs modal
    │   │   ├── CollectibleNotifications.tsx        # Visual pickup banners for discovered items
    │   │   ├── CraftingPanel.tsx                   # Modular crafting table UI for assembling probe components
    │   │   ├── ExplorationHUD.tsx                  # Top telemetry bar, quick visual mode pill, language toggle
    │   │   ├── InventoryPanel.tsx                  # Grid display of gathered components and blueprint chips
    │   │   ├── MiniGameOverlay.tsx                 # Spectrometer analysis, antenna alignment & probe viewer
    │   │   ├── MissionSelector.tsx                 # Destination selection (Moon vs Mars) with SVG planetary icons
    │   │   ├── PauseMenu.tsx                       # Esc menu with resume, settings, and return to main screen
    │   │   ├── PlayerProfileModal.tsx              # Astronaut dossier, stats, play time, and suit color picker
    │   │   ├── SpaceHandbookModal.tsx              # In-depth aerospace encyclopedia (Destinations, Subsystems)
    │   │   ├── StarfieldBackground.tsx             # Procedural animated 2D canvas stars background
    │   │   └── StationMinimap.tsx                  # Topological radar HUD with real-time sweep & room layout
    │   └── world/
    │       ├── CameraController.tsx                # Isometric camera following player position smoothly
    │       ├── GameCanvas.tsx                      # Dynamic Three.js canvas wrapper with WebGL error boundaries
    │       ├── GameCanvasInner.tsx                 # Canvas content coordinator (lights, camera, active room)
    │       ├── Room3DScene.tsx                     # 3D room geometries, voxel Minecraft beacon, neon rings
    │       └── rooms.ts                            # Station topological map definitions, spawns, portals
    │
    └── lib/                                        # Pure business logic, engines, schemas & localization
        ├── audio/
        │   ├── audio-manager.ts                    # Central singleton audio dispatcher with volume control
        │   └── procedural-synth.ts                 # Zero-dependency Web Audio procedural sound synthesizer
        ├── data/
        │   ├── game-data-schema.ts                 # Zod validation schemas for questions, answers, and endings
        │   └── game-data-service.ts                # Data loader reading `ques-en.json` with schema validation
        ├── game-engine/
        │   ├── mission-engine.ts                   # Mission initialization, state transition & persistence
        │   ├── question-engine.ts                  # Graph traversal, finding next question by branch condition
        │   ├── resource-engine.ts                  # Resource clamping (0–100) and delta delta arithmetic
        │   └── scoring-engine.ts                   # Typed safe formula evaluator (NO dynamic eval/Function)
        ├── i18n/
        │   ├── mission-translations-ar.ts          # Arabic overlay for all 31 questions, 62 answers, 8 endings
        │   └── translations.ts                     # Bilingual dictionary for all UI text, HUD labels, and menus
        └── types/
            └── game.ts                             # Core domain types (MissionState, Question, Answer, Ending)
```

---

## Detailed Directory & File Breakdown

### 1. Root Configuration & Project Files
- **`AGENTS.md`**: The supreme constitutional guidelines for AI agents working on NovaScript. Outlines Prime Directives (Canonical Graph Source of Truth, Asset Integrity, Safe Evaluator, Engine/UI Separation, Animation Division, Git Hygiene).
- **`next.config.ts`**: Configuration file for Next.js 15. Configures TypeScript strict checks, React compiler flags, and asset optimization.
- **`package.json`**: Defines all runtime dependencies (`next`, `react`, `three`, `@react-three/fiber`, `@gsap/react`, `motion`, `lucide-react`, `zod`, `zustand`) and build scripts (`dev`, `build`, `test:engine`).
- **`PROJECT_ROADMAP_AND_CHECKLIST.md`**: Living development tracking checklist mapping completed milestones, verification proofs, and future roadmap phases.
- **`README.md`**: Public front page for GitHub showcasing features, tech stack, co-development journey, competition attribution, and quickstart commands.

---

### 2. Documentation (`docs/`)
- **`ASSET_GUIDE.md`**: Specifications for character sprites (`player.png`, `player-female.png`) and cursor dimensions (hotspot alignment, zero touch penalty).
- **`AUDIO_ASSET_MANIFEST.md`**: Technical frequencies, oscillators, filter cutoffs, and duration specs for procedural audio cues.
- **`DATA_DICTIONARY.md`**: Specification of normalized engineering resources (Budget, Mass, Power, Science, Comms) and Zod validation schemas.
- **`DEVELOPMENT_HISTORY.md`**: Full release version chronology from v1.0.0 through v2.3.0 documenting features added at each stage.
- **`GAMEPLAY_FLOW.md`**: Finite State Machine (FSM) defining screen flows (`menu` -> `exploring` -> `mission-active` -> `report`).
- **`IMPLEMENTATION_PLAN.md`**: 8-phase verified engineering plan detailing deliverables, verification tests, and criteria.
- **`JSON_GRAPH_AUDIT.md`**: Mathematical validation of `ques-en.json`, certifying 31 questions, 62 answer branches, and 8 reachable endings.
- **`PROJECT_BRIEF.md`**: High-level game design document detailing user stories, learning objectives, and NASA challenge requirements.
- **`PROJECT_STRUCTURE.md`**: *(This file)* Comprehensive file-by-file annotated architectural map.
- **`SIMULATION_DESIGN.md`**: Design guidelines for Three.js isometric rendering, lighting, camera following, and visual shader modes.
- **`SOURCE_CATALOG.md`**: Scientific references to NASA Jet Propulsion Laboratory (JPL), CubeSat 101, and NASA SMD literature.
- **`TECH_ARCHITECTURE.md`**: System architecture diagram, data flow between Zustand, Three.js, and pure engine modules.

---

### 3. Application Orchestration (`src/app/`)
- **`globals.css`**: Tailwind CSS 4 custom utility classes, starfield animations, glassmorphism panel styles, and glow filters.
- **`layout.tsx`**: HTML root layout configuring viewport responsiveness, metadata headers, and font antialiasing.
- **`page.tsx`**: Primary Next.js page component. Serves as top-level director coordinating `screen` state (`menu`, `exploring`, `briefing`, `gameplay`, `report`), keyboard shortcuts, and global modal state.

---

### 4. Game Engine & Logic (`src/lib/game-engine/`)
- **`mission-engine.ts`**: Pure state functions for starting missions (`createInitialMissionState`), committing answers (`commitAnswerToState`), and saving/loading from LocalStorage.
- **`question-engine.ts`**: Traverses the question graph, evaluating prerequisite conditions to pick the subsequent question.
- **`resource-engine.ts`**: Clamps resources within normalized [0, 100] bounds and calculates net deltas for UI indicators.
- **`scoring-engine.ts`**: Allowlisted deterministic tokenizer that safely calculates ending scores without JavaScript `eval()` or `Function()`.

---

### 5. Internationalization & Localization (`src/lib/i18n/`)
- **`mission-translations-ar.ts`**: The canonical scientific Arabic mission overlay. Translates all 31 questions (Q001–Q031), 62 answers (A001–A062), decision consequence summaries, and all 8 endings (E001–E008). Provides `getLocalizedQuestion` and `getLocalizedEnding`.
- **`translations.ts`**: Complete bilingual dictionary (English/Arabic) for all UI controls, HUD labels, settings, mini-games, and encyclopedia entries.

---

### 6. Interactive 3D World & Simulation (`src/game/world/` & `src/game/player/`)
- **`Room3DScene.tsx`**: Renders 3D rooms using Three.js meshes. Includes the multi-tiered Minecraft Emerald Beacon with vertical cyan skybeam, voxel wooden bookshelves, anvil, cyberpunk holographic rings, and dynamic floor tiles.
- **`rooms.ts`**: Room layout data defining physical dimensions, wall layouts, spawn points, portals, and interactable object coordinates.
- **`CameraController.tsx`**: Smooth isometric camera following player movement with lerp dampening.
- **`GameCanvas.tsx` & `GameCanvasInner.tsx`**: React Three Fiber canvas host with dynamic import (SSR disabled) and WebGL fallback boundaries.
- **`Player3D.tsx`**: Renders the player astronaut as a billboarded sprite in 3D space with cast shadows and footstep particle triggers.
- **`usePlayerController.ts`**: Handles velocity calculation, diagonal movement normalization, and collision detection against room walls.

---

### 7. User Interface & Overlays (`src/game/ui/` & `src/components/game/`)
- **`ExplorationHUD.tsx`**: On-screen status bar featuring room name, coordinates, inventory count, quick visual mode switcher pill, and language toggle.
- **`StationMinimap.tsx`**: Real-time topological radar minimap with rotating sweep beam, player position marker, and clickable waypoint navigation.
- **`SpaceHandbookModal.tsx`**: Comprehensive aerospace encyclopedia covering Moon vs. Mars, spacecraft subsystems, and orbital mechanics.
- **`PlayerProfileModal.tsx`**: Astronaut dossier displaying play statistics, mission records, discovered achievements, and suit color customization.
- **`MiniGameOverlay.tsx`**: Interactive workstations (Spectrometer sample analyzer, High-gain antenna tuner, Spacecraft 3D model inspector).
- **`CraftingPanel.tsx`**: Workbench interface for crafting spaceflight upgrades from collected scrap and blueprint fragments.
- **`MissionSelector.tsx`**: Modal for choosing between Moon and Mars expeditions, featuring custom SVG celestial bodies (Zero Emojis).
- **`QuestionViewer.tsx`**: Interactive card rendering the active question, story context, answer options, and scientific consequence dialogs.
- **`MissionReport.tsx`**: Post-mission analysis displaying final score, ending grade, decision chronology, and aerospace debriefing.

---

### 8. Procedural Audio Engine (`src/lib/audio/` & `src/game/audio/`)
- **`procedural-synth.ts`**: Custom procedural audio synthesizer using the Web Audio API (`AudioContext`). Generates sine, square, and triangle waves with custom envelopes for telemetry beeps, clicks, and alarms.
- **`music-engine.ts`**: Dynamic ambient space music synthesizer that shifts chord progressions and filter cutoffs based on current scene state.
- **`audio-manager.ts`**: Singleton audio coordinator managing mute state, volume levels, and audio bus dispatching.

---

### 9. Verification & Automated Test Suite (`scripts/`)
- **`test-engine.mjs`**: Automated graph solver that simulates all 33 paths, testing all 31 questions and 8 endings for reachability and formula validity.
- **`verify-arabic-and-modes.mjs`**: Headless Puppeteer E2E test suite capturing 15 high-resolution screenshots validating language switching, visual modes, beacon rendering, and question commits.
- **`test-mission-flow.mjs`**: Focused mission verification script validating Arabic question operations and state transitions.
