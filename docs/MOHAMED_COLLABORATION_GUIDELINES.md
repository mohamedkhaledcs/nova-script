# Mohamed Khaled Collaboration Guidelines & Engineering Standards
## دليل وقواعد التعاون والمعايير الهندسية لمشاريع محمد خالد (@mohamedkhaledcs)

This document is the definitive operational blueprint, engineering standard, and developer mindset specification established by **Mohamed Khaled (@mohamedkhaledcs)** during the development of **NovaScript** (NASA Space Apps Challenge 2026). 

It is designed to be carried forward as a universal foundation for any autonomous AI agent, developer, or collaborator working with Mohamed across current and future projects.

---

## 1. Core Mindset & Execution Principles (فلسفة العمل وعقلية التنفيذ)

1. **High-Speed, Token-Conscious Execution**:
   - Mohamed values swift, decisive execution with zero wasted tokens, minimal back-and-forth, and direct problem-solving.
   - Do not ask unnecessary questions if the requirement is logically implied. Make thoughtful, professional design decisions and execute them thoroughly.
   - Always summarize completed work concisely in Arabic, highlighting exact achievements and verification proofs.

2. **Autonomous End-to-End Delivery**:
   - "هندل كل حاجة يا برو وودون أول بأول وارفع في الآخر" — when given an assignment, take full ownership: write the code, verify types, test paths, update documentation, stamp version increments, and push to GitHub (`main` & `dev`).
   - Leave zero half-finished tasks or unverified assumptions.

3. **Production-Grade Aerospace & Gaming Rigor**:
   - NovaScript and associated projects demand clean, elegant, professional aesthetics. Avoid amateurish shortcuts, flimsy hacks, or cartoonish designs unless explicitly themed (such as the Retro Voxel mode).

---

## 2. Inviolable Architectural Directives (القواعد المعمارية الثابتة)

### Rule 2.1: The Zero-Emoji Production Rule (منع الإيموجي نهائياً في الكود)
- **Absolute Prohibition**: Never use Unicode emojis (`🚀`, `⭐`, `🛰️`, `💡`, `✅`, `❌`, etc.) in production source code, UI components, JSON datasets, database schemas, or commit titles.
- **Enforcement**: Always use SVG vector icons (primarily `lucide-react`) or custom HTML/Canvas/Three.js procedural graphics.
- **Automated Verification**: Regular regex scans (`[\u{1F300}-\u{1F9FF}]`) must return zero matches across `src/`.

### Rule 2.2: Canonical Source of Truth Immutability (قدسية بيانات اللعبة الأساسية)
- The primary graph data (e.g., `public/data/ques-en.json` in NovaScript) is the **sole canonical source of truth**.
- **Never modify, rewrite, or delete question IDs, branch keys, or scientific text** in canonical data without explicit instruction.
- **Never hardcode questions, outcomes, or branch logic into React UI components**.
- Dynamic overlays, localizations, and supplementary tasks must live in parallel typed extension files (e.g., `src/lib/i18n/mission-translations-ar.ts` or `src/data/gameplay-tasks.ts`).

### Rule 2.3: Strict Engine / UI Separation (فصل محرك الحسابات عن واجهة المستخدم)
- All business logic, game state machines, scoring algorithms, resource bounds/clamping, and ending resolutions must live inside pure, testable, headless TypeScript modules under `src/lib/game-engine/` or equivalent domain folders.
- React components (`src/components/`, `src/game/ui/`) are strictly **view and interaction layers** that observe state and dispatch actions.
- Never calculate gameplay outcomes or mutate global state directly within React render loops or ad-hoc `useEffect` handlers.

### Rule 2.4: Zero Dynamic Code Execution (حظر eval() نهائياً)
- Never use JavaScript `eval()`, `new Function()`, or unsafe string interpolation to evaluate formulas, scores, or expressions.
- Always use typed, deterministic safe evaluators with an allowlisted arithmetic tokenizer (e.g., `scoring-engine.ts`).

### Rule 2.5: Animation Engine Division of Responsibility (فصل مسؤوليات مكتبات التحريك)
- **GSAP (`@gsap/react`)**: Dedicated strictly to cinematic sequence orchestration, launch countdowns, camera choreography, staging timelines, and orbital playback.
- **Motion for React (`framer-motion`)**: Dedicated strictly to reactive UI state transitions (modals, dialogs, button hovers, card selections, HUD badge entrances).
- **Inviolable Conflict Rule**: Never allow GSAP and Motion to mutate or control the same CSS property on the same DOM element.

---

## 3. Bilingual Parity & Input Accessibility (معايير ثنائية اللغة وتوافق الإدخال)

### Rule 3.1: Dual Keyboard & Layout Parity (التوافق التام مع لوحات المفاتيح العربية والإنجليزية)
- In interactive games and applications, users frequently type in Arabic or English without noticing their OS input layout.
- **Physical Key Position Mapping**: Every hotkey must work identically whether the user has Arabic or English active:
  - Movement: `W`/`S`/`A`/`D` must map seamlessly to `ص`/`س`/`ش`/`ي`.
  - Interact: `E` maps to `ث`.
  - Radar/Minimap: `M` maps to `م` / `ة`.
  - Decision Selection: `1`/`2` and `A`/`B` map to `١`/`٢` and `ش`/`س`.
  - Case Insensitivity: Uppercase, lowercase, shifted, or unshifted must trigger the same deterministic action.
- Use dedicated normalization utilities (`normalizeKey`, `matchesKey`) on every `keydown` event listener.

### Rule 3.2: Scientific Arabic Quality Standards (معايير الترجمة العلمية الرصينة)
- Translations to Arabic must use formal, authoritative aerospace, astronomical, and engineering terminology (e.g., "الميكانيكا المدارية", "أنظمة الدعم البيئي والحياة ECLSS", "تحليل الموازنات الهندسية Trade-offs").
- Never use robotic literal machine translations.
- Full RTL layout awareness with bidirectional font scaling and balanced visual alignment.

---

## 4. Visual Modes & Graphic Differentiation (فلسفة الأنماط البصرية والجرافيكس)

NovaScript introduced 4 distinct visual render modes. When implementing or expanding visual modes in any project, follow Mohamed's **"Instant Glance Differentiation"** rule:

1. **Cinematic 3D (Default)**:
   - High-fidelity realistic PBR lighting, atmospheric depth fog, bloom, metallic/roughness material realism, smooth camera movements.
2. **Retro Pixel / Voxel (Minecraft Aesthetic)**:
   - Chunky block geometries, flat shading, voxel structures (Emerald beacon with sky beam, oak bookshelves, iron anvils, wall torches with flame voxel cubes, redstone consoles).
   - Pixel-art 2D overlays and retro gaming audio cues.
3. **Cyber Neon (Cyberpunk Aesthetic)**:
   - High saturation, emissive neon materials (`#00F0FF`, `#FF007F`, `#A855F7`), concentric holographic gyroscopic rings, pulsing floor runners, scanlines, and futuristic glowing UI accents.
4. **CAD Blueprint / Isometric Schematic (Engineering Mode)**:
   - Deep navy drafting background (`#03142e`), high-contrast cyan wireframe shaders (`#00F0FF`), floor grid calibration target rings, coordinate crosshairs, corner datum laser beams, drafting corner brackets (`┌ ┐ └ ┘`), and dual-layer solid-core + wireframe interactive assemblies.

**Key Rule**: If a user switches modes and cannot immediately tell the difference within 0.5 seconds, the mode is insufficient and must be visually heightened.

---

## 5. UI/UX & NASA Telemetry Console Standards (معايير واجهات التحكم والعمليات)

- **NASA Artemis & Mission Control Aesthetic**:
  - High-density information architecture divided into modular glassmorphism cards.
  - Deep space navy canvases (`#0B1120` to `#03142e`) with high-contrast amber data text (`#FFB800`) and cyan nominal indicators (`#00F0FF`).
  - Monospace numeric telemetry displays to prevent character jitter during rapid value fluctuations.
  - Exception-based alerting: quiet nominal states, distinct visual state vector shifts for cautions or abort criteria.
- **Collapsible HUD Architecture**:
  - Heavy or secondary HUD widgets (such as the Station Radar/Minimap) must default to open but allow instantaneous collapsing into a sleek bottom-right floating pill, expandable via one click or hotkey (`[M]`).
- **Interactive Audio Feedback**:
  - Every meaningful user interaction (hover, selection, modal open, success, warning, failure) must be wired to Web Audio synthetic SFX.

---

## 6. Git Hygiene & DevOps Discipline (إجراءات Git ورفع الكود)

1. **Conventional Commit Prefixes**:
   - `feat:` for new capabilities, modes, or features.
   - `fix:` for bug fixes, keyhandling resolutions, type corrections.
   - `docs:` for documentation updates and history logs.
   - `refactor:` for code restructuring without changing behavior.
   - `test:` for automated verification scripts.
2. **Dual-Branch Synchronization**:
   - Both `main` and `dev` must remain cleanly synchronized. Push to `main`, merge/push to `dev`.
3. **Zero Force-Push (`--force`)**:
   - Never force push or rewrite shared Git history.
4. **Zero Credential Leaks**:
   - Never commit `.env`, Supabase service role keys, Vercel tokens, or sensitive API secrets.
5. **Pre-Commit Verification Checklist**:
   - `npx tsc --noEmit` returns **0 errors**.
   - Game engine test scripts (`scripts/test-engine.mjs`) pass with 100% path coverage.
   - Zero emojis detected across source files.
   - Version stamped in `docs/DEVELOPMENT_HISTORY.md` and `docs/PROJECT_STRUCTURE.md`.

---

## 7. Quick Collaboration Cheatsheet (بطاقة المرجع السريع للتطوير)

| Requirement | Rule / Implementation |
| :--- | :--- |
| **Icons & Emojis** | Zero emojis. Always use `lucide-react` SVG vectors. |
| **Hotkeys** | Check both `e.key` and `e.code` via `normalizeKey`/`matchesKey` for Arabic + English parity. |
| **Game Data** | `public/data/ques-en.json` is immutable. Extend via parallel TS overlays. |
| **Animation** | GSAP for 3D/Cinematics; Framer Motion for UI. Never cross properties. |
| **Evaluation** | No `eval()`. Use typed safe AST evaluator. |
| **Git Push** | Always push to both `main` and `dev` upon task completion. |
| **Documentation** | Keep `DEVELOPMENT_HISTORY.md`, `PROJECT_STRUCTURE.md`, and `README.md` updated with every feature. |

---

*Authored by Antigravity under the direction of Mohamed Khaled (@mohamedkhaledcs) — NovaScript Project, 2026.*
