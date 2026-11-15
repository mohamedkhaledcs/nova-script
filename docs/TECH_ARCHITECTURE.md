# NovaScript: Technical Architecture & System Design

> **Specification Version**: `2.3.0 (Latest Production Release)`  
> **Status**: Production Deployed | **Architecture**: Next.js 15 App Router | **Engine**: Deterministic Pure TS  
> **Repository**: [https://github.com/mohamedkhaledcs/nova-script](https://github.com/mohamedkhaledcs/nova-script)

## 1. System Overview & Technology Stack

NovaScript is constructed as a decoupled, layered web application built on Next.js with App Router, TypeScript, Tailwind CSS, Three.js, GSAP, Motion for React, and Supabase.

```text
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|   +-----------------------+   +-----------------------+   +-------------------+   |
|   |   GameHUD / Telemetry |   | Presentation Overlays |   | Context Radial UI |   |
|   |  (Normalized Gauges)  |   | (Planning, Lab, Ops)  |   |  (Inspect, Focus) |   |
|   +-----------------------+   +-----------------------+   +-------------------+   |
|   |               Custom Rocket Cursor Layer (Pointer-events: none)           |   |
+-----------------------------------------------------------------------------------+
                                          |
                                   Dispatches Actions
                                          v
+-----------------------------------------------------------------------------------+
|                             MISSION RUNTIME ENGINE                                |
|   +-------------------------+   +-------------------------+   +---------------+   |
|   |   QuestionGraphEngine   |   |      ResourceEngine     |   | ScoringEngine |   |
|   | (Branching, Navigation) |   | (Clamp, Deltas, Bounds) |   | (Safe Parser) |   |
|   +-------------------------+   +-------------------------+   +---------------+   |
|   |                               MissionStore                                |   |
|   |           (Deterministic State, History, Active Destination)              |   |
+-----------------------------------------------------------------------------------+
             |                                                  |
     Drives Animation & 3D                                Drives Persistence
             v                                                  v
+------------------------------------+          +-----------------------------------+
|      VISUAL SIMULATION LAYER       |          |        PERSISTENCE LAYER          |
|  +------------------------------+  |          |  +-----------------------------+  |
|  | Three.js / R3F Canvas        |  |          |  | LocalStorage (Primary)      |  |
|  | - Solar System & Orbits      |  |          |  | - Guest Active State        |  |
|  | - Modular Spacecraft Bus     |  |          |  | - Audio & Display Settings  |  |
|  +------------------------------+  |          |  +-----------------------------+  |
|  | GSAP Timelines               |  |          |  | Supabase (Optional Cloud)   |  |
|  | - Launch & Terminal Sequences|  |          |  | - User Profiles (Auth)      |  |
|  | - Camera Choreography        |  |          |  | - Opt-In Public Leaderboard |  |
|  +------------------------------+  |          |  +-----------------------------+  |
+------------------------------------+          +-----------------------------------+
```

---

## 2. Directory Structure

```text
src/
├── app/
│   ├── globals.css              # Custom styling, aerospace colors, starfields
│   ├── layout.tsx               # Root layout, fonts, meta, audio provider
│   └── page.tsx                 # Main game stage container & view switcher
│
├── components/
│   ├── layout/                  # Navigation bar, status banner, footer
│   ├── ui/                      # Buttons, badges, modals, sliders, tooltip
│   └── game/                    # Mission-specific game views
│       ├── MainMenu/            # Cinematic main menu & archive viewer
│       ├── MissionControl/      # Commander briefing room & avatar display
│       ├── MissionPlanner/      # Destination & science objective selector
│       ├── SpacecraftHangar/    # 3D bus configuration & component mounting
│       ├── InstrumentLab/       # Scientific instrument payload inspector
│       ├── OrbitPlanner/        # Orbital trajectory & eclipse visualizer
│       ├── LaunchSequence/      # GSAP countdown, staging & ignition
│       ├── MissionOperations/   # Anomaly response console (dust storm, flare)
│       ├── SpaceCommunications/ # DSN antenna pointing & data transmission
│       ├── MissionReport/       # Final dossier, score breakdown & endings
│       ├── GameHUD/             # Telemetry bars, resource counters, status
│       ├── ContextMenu/         # Right-click radial interaction menu
│       └── CustomCursor/        # Custom rocket pointer tracking mouse
│
├── simulation/
│   ├── scenes/                  # Three.js / R3F canvas environments
│   │   ├── SpacecraftScene.tsx  # Modular 3D spacecraft model
│   │   ├── SolarSystemScene.tsx # Earth, Moon, Mars 3D planetary views
│   │   └── OrbitScene.tsx       # Orbit spline trajectories & eclipse cones
│   ├── components/              # 3D mesh components (SolarArray, Antenna, Bus)
│   └── fallback/                # 2D Canvas / WebGL fallback for low-power devices
│
├── lib/
│   ├── game-engine/             # Pure TypeScript deterministic logic
│   │   ├── question-engine.ts   # Graph navigation & branch resolution
│   │   ├── resource-engine.ts   # Resource delta application & bound clamping
│   │   ├── scoring-engine.ts    # Safe AST formula parser (zero eval)
│   │   └── mission-engine.ts    # State machine coordinator
│   ├── audio/                   # Audio manager & procedural Web Audio synthesizer
│   ├── data/                    # Data loaders & Zod validation schemas
│   ├── persistence/             # LocalStorage & Supabase client handlers
│   └── utils/                   # General math, formatting, clamp helpers
│
├── hooks/                       # Custom React hooks (useMission, useAudio, useCursor)
├── types/                       # Shared TypeScript interfaces & types
└── data/                        # Static task definitions & fallback manifests
```

---

## 3. Engine / UI Decoupling

The game engine is strictly decoupled from React rendering:
1. **Engine Independence**: Every module in `src/lib/game-engine/` is written in pure TypeScript with zero imports from `react` or `react-dom`.
2. **State Store (`useMissionStore`)**: Exposes reactive state to React components while delegating state mutations directly to the pure engine.
3. **Deterministic Testing**: The entire 33-path question graph can be unit-tested in NodeJS without any DOM or browser dependencies.

---

## 4. Animation Responsibility Split

To eliminate CSS property collision and render stutter:
- **GSAP (`gsap`, `@gsap/react`)**:
  - Launch sequence staging & countdown
  - Camera zoom & orbit fly-by transitions
  - Spacecraft trajectory progression and terminal sequence cinematics
- **Motion for React (`motion/react`)**:
  - Overlay modal popups and consequence alerts
  - Telemetry HUD counter animations
  - Menu drawer toggles and button hover ripples
  - Consequence dialog entrances
- **Rule**: A DOM element animated by GSAP must never receive Motion layout or transform bindings.

---

## 5. WebGL & Three.js Performance Architecture

- All 3D canvases are dynamically imported using `next/dynamic` with `ssr: false`.
- If WebGL is not supported, the viewport renders a sleek 2D high-resolution schematic blueprint fallback.
- Framerate is throttled when the tab is out of focus (`requestAnimationFrame` pausing).
- Textures for Earth, Moon, and Mars are procedurally generated or optimized WebP.
