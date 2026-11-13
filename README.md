# NovaScript: Space Mission Design & Operations Simulator

> *"Design. Decide. Explore."*

NovaScript is an interactive, browser-based space mission simulation game built with Next.js (App Router), TypeScript, Tailwind CSS, Three.js / React Three Fiber, GSAP, and Motion for React.

The player steps into the role of Mission Commander and Lead Systems Engineer at NASA Mission Control, making mission architecture decisions, configuring spacecraft subsystems, balancing real engineering trade-offs (mass, power, communication link, budget, scientific return), responding to in-flight operational crises, and guiding robotic probes across the Solar System to the Moon and Mars.

---

## 🚀 Key Features

- **Decision-Driven Mission Lifecycle**: 31 interconnected engineering decision points and 33 distinct operational flight paths covering Destination Selection, Spacecraft Bus & Thermal Architecture, Scientific Payloads, Orbit Insertion, Launch Vehicles, Interplanetary Flight, and Deep Space Operations.
- **Dynamic 3D Simulation**: Real-time Three.js / React Three Fiber visualization of planetary environments (Earth, Moon, Mars), orbital trajectories, spacecraft bus configurations, solar array deployments, and atmospheric entry.
- **Deterministic Mission Engine**: Complete graph navigation driven by canonical mission data (`ques-en.json`), with real-time tracking of Budget, Mass, Power, Scientific Value, and Communication margins.
- **Cinematic Sequence Orchestration**: GSAP timeline choreography for launch countdown, staging, fairing separation, planetary injection, and entry descent maneuvers.
- **Interactive Mission Control HUD**: Contextual command panels, real-time telemetry gauges, mission task board, interactive system inspect radial/context menus, and pixel-art astronaut avatar animations.
- **In-Engine Synthesizer & Audio System**: Layered sound effects system with Web Audio API procedural synthesis fallbacks and ambient space audio.
- **Dual Persistence Architecture**: Guest progress preserved in LocalStorage; optional Supabase PostgreSQL persistence and cloud mission dossier records with Row Level Security.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | Next.js 15+ (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS 4, Lucide React, Custom Dark Aerospace Theme |
| **3D & Visual Simulation** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Animation & Choreography** | GSAP 3 & `@gsap/react` (Cinematics/Trajectories), Motion for React (UI/Interactions) |
| **State & Engine** | Custom Pure TypeScript Deterministic Mission Engine, Zustand / React State |
| **Audio Engine** | Web Audio API Procedural Synthesizer & Modular Audio Manager |
| **Persistence & Auth** | Supabase (`@supabase/supabase-js`, `@supabase/ssr`), LocalStorage guest fallback |
| **Validation** | Zod runtime schema validation for question graph and resource bounds |

---

## 📂 Project Structure

```text
nova-script/
├── docs/                      # Architectural documentation & technical specifications
│   ├── PROJECT_BRIEF.md       # Product vision and core requirements
│   ├── GAMEPLAY_FLOW.md       # Full player journey & state machine transitions
│   ├── DATA_DICTIONARY.md     # Type definitions, resource semantics & formulas
│   ├── JSON_GRAPH_AUDIT.md    # 31 questions, 62 answers, 8 endings audit
│   ├── TECH_ARCHITECTURE.md   # Component tree, engine boundaries & state architecture
│   ├── SIMULATION_DESIGN.md   # 3D scenes, orbits, telemetry & spacecraft visuals
│   ├── AUDIO_ASSET_MANIFEST.md# Sound effects, synthesis specs & audio manager
│   ├── ASSET_GUIDE.md         # Sprite specifications (player, rocket cursor)
│   ├── SOURCE_CATALOG.md      # NASA & scientific source attributions
│   └── IMPLEMENTATION_PLAN.md # 8-phase verified engineering blueprint
├── public/
│   ├── assets/
│   │   ├── characters/        # Astronaut player sprite (player.png)
│   │   ├── cursor/            # Rocket mouse cursor (rocket-cursor.png)
│   │   └── textures/          # Planetary textures & starfields
│   ├── audio/                 # Ambient music & SFX assets
│   └── data/
│       └── ques-en.json       # Canonical mission question & ending dataset
├── resouces folder/           # NASA reference materials & systems engineering guides
└── src/                       # Application source code (Next.js App Router)
```

---

## 📖 Scientific References & NASA Attribution

This simulation incorporates mission engineering principles, concept maturity trade spaces, and CubeSat design guidelines from NASA documentation:
- **NASA Space Apps Challenge 2026**: *Space Mission Design Game*
- **NASA Jet Propulsion Laboratory (JPL)**: *Space Mission Concept Development Using Concept Maturity Levels (CML)* (Randii R. Wessen et al.)
- **NASA Science Mission Directorate**: *Design and Develop Science Missions (2025)*
- **NASA CubeSat Launch Initiative**: *CubeSat 101: Basic Concepts and Processes for First-Time CubeSat Developers*
- **NASA Mission Design Lab (MDL)**: Integrated Design Center systems engineering methodologies

---

## 📜 License

MIT License. See `LICENSE` for details.
