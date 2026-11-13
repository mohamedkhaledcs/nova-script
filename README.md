# NovaScript: Space Mission Design & Operations Simulator

> *"Design. Decide. Explore."*

NovaScript is an interactive, browser-based space mission simulation game built with Next.js (App Router), TypeScript, Tailwind CSS, Three.js / React Three Fiber, GSAP, and Motion for React.

The player steps into the role of Mission Commander at Mission Control, making mission architecture decisions, configuring spacecraft subsystems, balancing normalized engineering trade-offs (budget, mass, power, scientific return, communication), responding to in-flight operational events, and guiding robotic probes across the Solar System to the Moon and Mars.

---

## ⚠️ Independent Educational Project Disclaimer

NovaScript is an independent educational simulation game inspired by open-source space mission engineering principles and public challenge briefs. **NovaScript is not an official NASA product, and is not affiliated with, sponsored by, or endorsed by NASA or any government space agency.** All references to public educational challenges, space missions, and historical literature are provided solely for educational attribution and contextual learning.

---

## 🚀 Key Features

- **Branching Decision Engine**: 31 interconnected engineering decision points across 8 canonical data stages and 33 playable flight paths derived from `ques-en.json`.
- **Normalized Resource Accounting**: Dynamic tracking of Budget, Mass, Power, Scientific Value, and Communication on a normalized 0–100 scale.
- **Dynamic 3D Simulation**: Deterministic Three.js / React Three Fiber visualizations of planetary destinations (Moon, Mars), orbital trajectories, and modular spacecraft bus adaptations.
- **Cinematic Sequence Orchestration**: GSAP timeline choreography for launch countdown, staging, fairing separation, planetary approach, and entry descent events.
- **Interactive Mission Control HUD**: Contextual command telemetry, mission task board, right-click radial inspection menu, and animated astronaut avatar.
- **In-Engine Procedural Audio**: Layered sound effects system powered by a zero-dependency Web Audio API procedural synthesizer for interface and mission sound cues.
- **Dual Persistence Architecture**: Guest progress preserved in browser LocalStorage; optional Supabase PostgreSQL persistence and cloud mission dossier records with strict Row Level Security.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | Next.js 15+ (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS 4, Lucide React, Custom Dark Aerospace Theme |
| **3D & Visual Simulation** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Animation & Choreography** | GSAP 3 & `@gsap/react` (Cinematics/Trajectories), Motion for React (UI/Interactions) |
| **State & Engine** | Deterministic Pure TypeScript Mission Engine |
| **Audio Engine** | Web Audio API Procedural Synthesizer & Centralized Audio Manager |
| **Persistence & Auth** | Supabase (`@supabase/supabase-js`, `@supabase/ssr`), LocalStorage guest fallback |
| **Validation** | Zod runtime schema validation for question graph and resource bounds |

---

## 📂 Project Structure

```text
nova-script/
├── docs/                      # Architectural documentation & technical specifications
│   ├── PROJECT_BRIEF.md       # Product vision and core requirements
│   ├── GAMEPLAY_FLOW.md       # Player journey, state machine & cinematic sequences
│   ├── DATA_DICTIONARY.md     # Type definitions, normalized resources & schemas
│   ├── JSON_GRAPH_AUDIT.md    # 31 questions, 62 answers, 8 endings audit
│   ├── TECH_ARCHITECTURE.md   # Component tree, engine boundaries & state architecture
│   ├── SIMULATION_DESIGN.md   # 3D scenes, orbits, telemetry & spacecraft visuals
│   ├── AUDIO_ASSET_MANIFEST.md# Sound effects, synthesis specs & audio manager
│   ├── ASSET_GUIDE.md         # Sprite specifications (player, rocket cursor)
│   ├── SOURCE_CATALOG.md      # Literature references & challenge attributions
│   └── IMPLEMENTATION_PLAN.md # 8-phase verified engineering blueprint
├── public/
│   ├── assets/
│   │   ├── characters/        # Astronaut player sprite (player.png)
│   │   └── cursor/            # Rocket mouse cursor (rocket-cursor.png)
│   └── data/
│       └── ques-en.json       # Canonical mission question & ending dataset
├── resources/                 # Reference materials & systems engineering guides
└── src/                       # Application source code (Next.js App Router)
```

---

## 📖 Scientific References & Attribution

This simulation incorporates mission engineering principles, concept maturity trade spaces, and small satellite design concepts from public space literature:
- **NASA Space Apps Challenge 2026**: *Space Mission Design Game*
- **NASA Jet Propulsion Laboratory (JPL)**: *Space Mission Concept Development Using Concept Maturity Levels (CML)* (Randii R. Wessen et al.)
- **NASA Science Mission Directorate**: *Design and Develop Science Missions (2025)*
- **NASA CubeSat Launch Initiative**: *CubeSat 101: Basic Concepts and Processes for First-Time CubeSat Developers*

---

## 📜 License

This project is licensed under the MIT License - see the [`LICENSE`](file:///e:/systems/nova-script/LICENSE) file for details.
