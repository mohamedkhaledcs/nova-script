# NovaScript: Space Mission Design & Operations Simulator

> **"Design. Decide. Explore."**  
> An interactive aerospace mission simulation game and educational space station experience designed for the **NASA Space Apps Challenge 2026** (*Space Mission Design Game*).

---

## Overview

**NovaScript** is a browser-based aerospace mission simulation and interactive space exploration platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Three.js / React Three Fiber**.

Players step into the role of Mission Commander at orbital Mission Control. You navigate a fully modeled 3D Space Station, configure modular probe architectures, conduct scientific analyses, balance critical normalized engineering trade-offs (Budget, Mass, Power, Science Return, and Communications), and guide robotic exploration missions across the Solar System to the Moon and Mars across 31 interconnected decision gates and 33 flight paths.

---

## Independent Educational Project Disclaimer

NovaScript is an independent educational simulation game inspired by open-source space mission engineering principles and public challenge briefs. **NovaScript is not an official NASA product, and is not affiliated with, sponsored by, or endorsed by NASA or any government space agency.** All references to public educational challenges, space missions, and historical literature are provided solely for educational attribution and contextual learning.

---

## The Co-Development Story: Human-AI Collaborative Engineering

NovaScript was architected and built through an intensive collaborative co-development workflow between **Mohamed Khaled** (Lead Architect & Product Visionary) and **Antigravity** (Google DeepMind's autonomous agentic AI assistant):

1. **Strategic Product Vision & Iterative Steering**:
   - Mohamed Khaled directed the project from initial concept through production deployment, establishing core aesthetic philosophies (such as a strict Zero-Emoji aerospace HUD design, deep bilingual localization, customizable control schemes, and multi-style visual engines).
2. **Autonomous Systems Engineering**:
   - Antigravity worked directly in the codebase to implement pure deterministic state engines, Three.js 3D world architectures, GSAP cinematics, interactive mini-games, and automated verification test harnesses.
3. **Rigorous Verification & Architectural Guardrails**:
   - The team established non-negotiable Prime Directives: strict separation of engine logic from React UI, zero dynamic `eval()`, runtime schema validation via Zod, and preservation of canonical mission data integrity (`ques-en.json`).
   - Every stage was validated through automated headless browser test suites (capturing 50+ verification screenshots across user flows) and deterministic engine solvers checking all 33 decision paths.

---

## Core Features & Architecture

### 1. Pure Deterministic Mission Engine
- **31 Decision Gates, 62 Answer Branches, 8 Endings, 33 Distinct Playable Trajectories**:
  - Derived from canonical aerospace decision trees.
  - Safe, allowlisted formula evaluation (`src/lib/game-engine/scoring-engine.ts`) with zero runtime code injection or `eval()`.
  - Normalized 0–100 resource bounds (Budget, Mass, Power, Science Return, Telemetry Comms).
- **Comprehensive Verification Suite**:
  - Automated graph crawler (`npm run test:engine`) verifies graph reachability and resource constraints across all paths in milliseconds.

### 2. 3D Space Station Exploration & Visual Rendering Modes
- **Interactive 3D Station**:
  - Explore the Central Hub, Science Lab, Spacecraft Hangar, Communications Array, and Mission Launch Board.
  - WASD / Arrow keyboard movement, mouse double-click, and mobile double-tap interaction.
- **4 Real-Time Visual Modes Across All Station Rooms**:
  - **Cinematic 3D**: Realistic PBR lighting, atmospheric bloom, soft dust particles, and space station shadows.
  - **Minecraft Voxel 3D**: Handcrafted voxel station featuring a stepped Emerald Beacon with vertical skybeam, wall torches, Command Center redstone repeaters & dust, Science Lab bookshelves, Hangar iron anvil & crafting table, Resource Bay double chest, and Comms jukebox.
  - **Cyber Neon**: High-contrast cyberpunk aesthetic with glowing wireframes, holographic energy rings, Command Center tactical rings & data pillars, Science Lab glowing DNA double-helix, and high-voltage plasma arcs in Hangar.
  - **CAD Blueprint**: Architectural aerospace technical blueprint visualization featuring coordinate drafting brackets, floor calibration targets, datum lasers, Command Center orbital trajectory ellipse & satellite model, Science Lab spectrometer prism, and Hangar rocket propulsion nozzle schematic.
- **Topological Station Radar Minimap & Minimization**:
  - Real-time radar sweep, room topological connections, player orientation beacon, and fast waypoint tracking.
  - Interactive hide/show toggle (`[M]` key or hide button) that collapses the radar into a sleek tactical floating glassmorphism pill bottom-right.
  - Universal bilingual keyboard normalization supporting English, Arabic physical QWERTY layout, uppercase/lowercase, and browser keycodes across all controls.

### 3. Artemis Flight Director Telemetry & Mission Operations
- **Real-Time ECLSS & Telemetry Console (`QuestionViewer.tsx`)**:
  - High-density telemetry strip with live micro-gauges and progress bars for Budget, Mass, Power, Science Return, and Comms.
  - Dynamic Mission Elapsed Time (MET) counter and stage tracking.
  - Projected delta indicators (`TrendingUp` / `TrendingDown`) previewing resource impacts before committing.
  - Rapid keyboard decision execution (`[1]` / `[2]`, `[A]` / `[B]`, Arabic `[١]` / `[٢]`, `[Enter]` to commit, `[Esc]` to review).
  - Mode-aware dynamic styling adapting to CAD Blueprint, Retro Pixel, Cyber Neon, or Cinematic 3D themes.

### 4. Complete Deep Bilingual Localization (English & Arabic)
- **Scientific Arabic Overlay (`src/lib/i18n/mission-translations-ar.ts`)**:
  - All 31 questions, 62 answer choices, consequence evaluations, learning takeaways, and 8 mission endings translated into fluent, high-level scientific Arabic without touching the canonical English dataset.
  - Full RTL layout support across all modals, dialogues, and telemetry HUDs.
  - Instant 1-click language switcher in both Main Menu and Exploration HUD.

### 5. Interactive Spacecraft Systems & Mini-Games
- **Spectrometer Mini-Game**: Analyze lunar and martian soil samples and emission wavelengths.
- **Antenna Alignment Simulation**: Tune azimuth, elevation, and carrier frequency for deep space signals.
- **Spacecraft Bus Customizer & Crafting Workbench**: Assemble scientific payloads, ion thrusters, and solar arrays from collected blueprints and alloys.
- **Space Handbook Encyclopedia**: In-depth aerospace field guide covering orbital mechanics (Hohmann transfers), thermal control systems, and comparative Moon vs. Mars environmental physics.

### 6. Zero-Emoji Aerospace Aesthetic & Collaboration Standards
- Professional sci-fi styling utilizing custom SVG vectors, Lucide icons, and aerospace telemetry typography.
- Verified by automated scanner with 0 emojis across the entire production codebase.
- **Universal Collaboration Guidelines**: Codified in [`docs/MOHAMED_COLLABORATION_GUIDELINES.md`](docs/MOHAMED_COLLABORATION_GUIDELINES.md) defining architectural guardrails, input parity standards, and developer mindset for all AI and human contributors.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | Next.js 15+ (App Router), React 19, TypeScript (Strict Mode) |
| **3D & Visual Simulation** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Animation Choreography** | GSAP 3 & `@gsap/react` (Cinematics/Staging), Motion for React (UI/HUD) |
| **Styling & Design System** | Tailwind CSS 4, Lucide React, Custom Aerospace Theme |
| **State Management** | Zustand (Persistent Exploration & Session Store) |
| **Validation & Engine** | Zod runtime schema validation, safe arithmetic parser |
| **Audio Synthesis** | Web Audio API procedural synthesizer (zero external sound dependencies) |
| **Quality & Testing** | Puppeteer Core (E2E UI & Screenshot Verification), Custom Engine Graph Crawler |

---

## Getting Started

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamedkhaledcs/nova-script.git
cd nova-script

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

---

## Verification & Testing Commands

```bash
# 1. Type-check with zero compiler errors
npx tsc --noEmit

# 2. Run deterministic engine test (verifies all 33 paths, 31 questions, 8 endings)
npm run test:engine

# 3. Production build test
npm run build
```

---

## Competition Resources & Literature Attribution

NovaScript draws from open scientific educational literature and space mission design standards:

1. **NASA Space Apps Challenge 2026**:
   - Challenge Track: *Space Mission Design Game*
   - Educational objective: Gamified exploration of aerospace engineering trade-offs, mission planning, and robotic exploration.
2. **NASA Jet Propulsion Laboratory (JPL)**:
   - *Space Mission Concept Development Using Concept Maturity Levels (CML)* (Randii R. Wessen et al.)
3. **NASA Science Mission Directorate**:
   - *Design and Develop Science Missions (2025 Standard Guidelines)*
4. **NASA CubeSat Launch Initiative**:
   - *CubeSat 101: Basic Concepts and Processes for First-Time Developers*
5. **NASA Planetary Science Division**:
   - Mars Exploration Rover (MER) & Lunar Reconnaissance Orbiter (LRO) mission architecture literature.

---

## Project Structure

```text
nova-script/
├── docs/                      # Architectural specifications & blueprints
│   ├── PROJECT_BRIEF.md       # Product vision & core gameplay requirements
│   ├── GAMEPLAY_FLOW.md       # State machines & sequence choreography
│   ├── DATA_DICTIONARY.md     # Type definitions & normalized resource schemas
│   ├── JSON_GRAPH_AUDIT.md    # 31 questions, 62 answers, 8 endings audit
│   ├── TECH_ARCHITECTURE.md   # Component tree & engine boundary guidelines
│   ├── SIMULATION_DESIGN.md   # 3D scenes, orbits & spacecraft rendering
│   └── IMPLEMENTATION_PLAN.md # Phased engineering blueprint
├── public/
│   ├── assets/
│   │   ├── characters/        # Astronaut player sprite (player.png)
│   │   └── cursor/            # Rocket mouse cursor (rocket-cursor.png)
│   └── data/
│       └── ques-en.json       # Canonical mission question dataset
├── scripts/
│   ├── test-engine.mjs        # Deterministic 33-path graph verification runner
│   ├── verify-arabic-and-modes.mjs # E2E visual mode & localization test
│   └── test-mission-flow.mjs  # Mission branch traversal test
├── src/
│   ├── app/                   # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── components/            # Game UI, HUD, Mission Control, Question Viewer, Report
│   ├── game/                  # 3D World, Rooms, Player, Inputs, Minimap, Visual Modes
│   └── lib/                   # Game engine, safe tokenizer, audio manager, i18n
└── README.md                  # Project overview & documentation
```

---

## Authors & Team Collaborators

### Core Team & Collaborators
- **Mohamed Khaled**
- **Mohamed Ahmed**
- **Mohamed Fares** ([@Mo7amedFares](https://github.com/Mo7amedFares))
- **Mahmoud Abdullah** ([@MahmoudAbdullah228](https://github.com/MahmoudAbdullah228))
- **Mohamed Sobhy**
- **Abdullatif Walid**

### AI Systems Co-Engineering
- **Antigravity** (Google DeepMind)

### Event
- Built for the NASA Space Apps Challenge 2026 (Space Mission Design Game)

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
