# Universal Engineering Standards & AI Agent Guidelines
## الدليل الهندسي العام وقواعد العمل الموحدة لمشاريع محمد خالد (@mohamedkhaledcs)

> **Universal Reusable Standard**: This document defines the universal engineering principles, architectural patterns, design standards, and developer mindset of **Mohamed Khaled (@mohamedkhaledcs)**.  
> It is **strictly project-agnostic** and applies across any web, mobile, desktop, backend, cloud, or game development project. Any autonomous AI agent, developer, or collaborator working with Mohamed must adhere to these guidelines across all repositories.

---

## 1. Core Mindset & Execution Principles (فلسفة العمل وعقلية التنفيذ)

1. **High-Speed, Token-Conscious Execution**:
   - Mohamed values swift, decisive execution with zero wasted tokens, minimal back-and-forth, and direct problem-solving.
   - Do not ask trivial or rhetorical questions when the technical path is clear. Make thoughtful, professional design decisions and execute them thoroughly.
   - Always summarize completed work concisely in Arabic, highlighting exact achievements, verification proofs, and next steps.

2. **Autonomous End-to-End Ownership ("هندل كل حاجة وارفع في الآخر")**:
   - When given an assignment or user prompt, take full end-to-end ownership:
     `Plan -> Implement -> Type-Check -> Automated Test -> Document -> Commit -> Push`.
   - Never leave unverified assumptions, broken imports, missing types, or half-finished tasks.
   - Always verify that all project branches (e.g., `main` and `dev`) are cleanly synchronized upon completion.

3. **Production-Grade Rigor**:
   - Avoid amateurish shortcuts, fragile hacks, or toy implementations.
   - Build robust, scalable, elegant software architectures that could comfortably pass a Senior Staff Engineer review at top-tier technology companies.

---

## 2. Inviolable Architectural Directives (القواعد المعمارية الثابتة)

### Rule 2.1: The Zero-Emoji Production Rule (منع الإيموجي نهائياً في الكود)
- **Absolute Prohibition**: Never use Unicode emojis in production source code, UI components, JSON datasets, database schemas, log strings, or commit messages.
- **Enforcement**: Always use SVG vector icons (such as `lucide-react`, `heroicons`, or custom SVG components) or procedural canvas graphics.
- **Automated Verification**: Run an automated regex audit (`[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]`) across source directories before any release; violations must equal 0.

### Rule 2.2: Strict Separation of Concerns (Business Logic vs. UI View)
- All business logic, algorithms, state machines, math formulas, data processing, and validation rules must live inside pure, testable, headless domain modules completely decoupled from the view layer.
- UI components (React, Vue, Svelte, etc.) are strictly **view and interaction layers** that render state and dispatch actions.
- Never perform heavy data calculations, business mutations, or side-effects directly inside UI render trees or ad-hoc component loops.

### Rule 2.3: Zero Dynamic Code Execution (حظر eval نهائياً)
- Never use JavaScript `eval()`, `new Function()`, or unsafe dynamic string interpretation to compute formulas, scores, or expressions.
- Always implement typed, deterministic safe parsers (such as allowlisted arithmetic tokenizers, AST parsers, or strict Zod/schema validators).

### Rule 2.4: Canonical Source of Truth Immutability (قدسية البيانات الأساسية)
- Primary data schemas, canonical graph files, and database blueprints are sacred sources of truth.
- Never mutate, rewrite, or hardcode business entities, questions, or product data directly inside UI view components.
- Supplementary features, experimental flags, or localizations must live in parallel, typed extension layers that leave canonical data untouched.

### Rule 2.5: Animation & Rendering Library Domain Separation
- When multiple animation, graphics, or layout libraries are used in the same project (e.g., GSAP, Framer Motion, CSS transitions, Three.js / WebGL, Canvas):
  - Establish a strict division of responsibilities (e.g., GSAP/Three.js for canvas/3D/cinematic timeline playback; Motion for reactive DOM UI dialogs and hovers).
  - **Inviolable Conflict Rule**: Never allow two distinct animation engines to mutate or control the same CSS/DOM property on the same element.

---

## 3. Bilingual Parity & Input Accessibility (معايير ثنائية اللغة وتوافق الإدخال)

### Rule 3.1: Physical Keyboard Layout Parity (التوافق التام مع لوحات المفاتيح العربية والإنجليزية)
- Users frequently toggle between Arabic and English keyboard layouts without noticing.
- **Physical Key Mapping**: Every keyboard hotkey and shortcut must work identically regardless of active layout:
  - Movement: `W`/`S`/`A`/`D` maps to `ص`/`س`/`ش`/`ي`.
  - Primary Action / Interact: `E` maps to `ث`.
  - Secondary Action / Radar / Minimap: `M` maps to `م` / `ة`.
  - Numeric Decisions: `1`, `2`, `3`... map to Arabic numerals `١`, `٢`, `٣`...
  - Confirmation: `Enter` and `Space` must function consistently.
  - Case Insensitivity: Uppercase, lowercase, shifted, or unshifted must trigger the same deterministic action.
- Always use dedicated key normalization utilities (`normalizeKey`, `matchesKey`) checking both `event.key` and `event.code`.

### Rule 3.2: High-Quality Authoritative Localization (معايير الترجمة الرصينة)
- Translations must use formal, authoritative, domain-appropriate terminology (e.g., engineering, medical, financial, or scientific).
- Never use crude or robotic literal machine translations.
- Full RTL (Right-to-Left) layout awareness with bidirectional font scaling, proper margins, and balanced optical alignment.

---

## 4. UI/UX & Design Philosophy (فلسفة التصميم وتجربة المستخدم)

1. **High-Density, Modern Aesthetics**:
   - Dark-mode first design with deep canvases (`#0B1120`, `#03142e`, or `#090D16`).
   - Clean, high-contrast semantic color tokens:
     - **Nominal / Success**: Cyan / Emerald (`#00F0FF`, `#10B981`).
     - **Warning / Attention**: Amber / Golden Yellow (`#FFB800`, `#F59E0B`).
     - **Critical / Danger**: Rose / Crimson (`#EF4444`, `#F43F5E`).
   - Monospace numeric typography for changing telemetry, statistics, financial data, or counters to prevent layout jitter.

2. **Collapsible HUD & Floating Micro-Widgets**:
   - Secondary panels, radars, complex filters, or dense inspectors must allow instantaneous collapsing into sleek floating pills or minimized badges in a corner.
   - Re-opening or toggling must be smooth and available via both a 1-click button and a keyboard shortcut.

3. **Tactile Feedback & Micro-Interactions**:
   - Meaningful actions (clicks, toggles, success states, modal alerts) should have subtle visual pulses and procedural/synthesized audio feedback where appropriate.

4. **Instant Visual Differentiation for Themes / Modes**:
   - When multiple themes, skins, or graphic modes are provided, each mode must be **immediately distinguishable within 0.5 seconds** at a single glance (distinct lighting, shaders, borders, geometry, and color grading).

---

## 5. Verification & Quality Assurance Protocol (بروتوكول التحقق قبل الإطلاق)

Before declaring any feature complete or pushing code, every project must satisfy this checklist:

| Verification Step | Standard / Command | Target Result |
| :--- | :--- | :--- |
| **Type Check** | `npx tsc --noEmit` (or language compiler) | **0 errors** |
| **Lint & Syntax** | Linter validation | **0 errors** |
| **Automated Tests** | Unit / integration test suite | **100% pass rate** |
| **Emoji Audit** | Regex scanner across source directory | **0 Unicode emojis** |
| **Production Build** | `npm run build` (or framework bundler) | **Clean static / SSR compilation** |
| **Visual / E2E Proof** | Headless browser (Puppeteer) or visual test | **Screenshot proof captured** |

---

## 6. Git Hygiene & DevOps Discipline (إجراءات الـ Git والرفع)

1. **Conventional Commit Prefixes**:
   - `feat:` for new capabilities, features, or modes.
   - `fix:` for bug fixes, keyhandling resolutions, and patches.
   - `docs:` for documentation updates, specifications, and history logs.
   - `refactor:` for code restructuring without changing behavior.
   - `test:` for automated verification scripts and test suites.

2. **Branch Synchronization**:
   - Maintain clean synchronization across primary branches (e.g. `main` and `dev`).
   - Push to `main`, merge/push to `dev`, and confirm both remotes are up to date.

3. **Zero Force-Push (`--force`)**:
   - Never rewrite shared Git history or force-push.

4. **Zero Credential Leaks**:
   - Never commit `.env`, private keys, API secrets, service role tokens, or sensitive credentials.

5. **Continuous Documentation Updates**:
   - Every notable feature must be documented in real-time in the project's changelog (`DEVELOPMENT_HISTORY.md`), architecture guides, and `README.md`.

---

## 7. Quick Reference Cheatsheet for AI Agents (بطاقة المرجع السريع)

```text
================================================================================
                    MOHAMED KHALED UNIVERSAL DEV RULES
================================================================================
1. ZERO EMOJIS        -> Never put emojis in code/UI. Use SVG vector icons only.
2. ENGINE / UI SPLIT  -> Pure TS logic in lib/engines; UI only renders and dispatches.
3. NO EVAL            -> Never use eval() or new Function(). Use safe AST parsers.
4. ARABIC KEYBOARD    -> All hotkeys must work identically in Arabic & English.
5. FAST EXECUTION     -> Be decisive, token-conscious, and deliver end-to-end.
6. RIGOROUS QA        -> tsc --noEmit + unit tests + build check before every push.
7. GIT CLEANLINESS    -> Conventional commits, sync main & dev, never force-push.
8. AUTO DOCUMENTATION -> Update changelogs, architecture docs, and README every time.
================================================================================
```

---

*Universal Standard established by Mohamed Khaled (@mohamedkhaledcs) — Applicable across all software repositories.*
