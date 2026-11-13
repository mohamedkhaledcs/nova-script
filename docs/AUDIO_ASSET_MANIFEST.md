# NovaScript: Audio Architecture & Asset Manifest

## 1. Audio Architecture & Design Principles

Sound is vital for an authentic Mission Control and deep-space flight experience. NovaScript implements a **centralized Audio Manager** (`src/lib/audio/audio-manager.ts`) supporting:
- Independent volume controls for **Master**, **Sound Effects (SFX)**, and **Background Music (BGM)**.
- LocalStorage persistence for user audio preferences.
- Autoplay policy compliance: Audio context initializes only upon the player's first deliberate gesture (e.g. clicking "Start Mission").
- Clear distinction between **Synthesized Sound Effects** and **Background Music**.

---

## 2. Procedural Web Audio API Synthesizer (Primary SFX Engine)

To guarantee that NovaScript has complete zero-latency audio feedback without relying on external `.mp3` or `.wav` dependencies, `src/lib/audio/procedural-synth.ts` creates real-time sound effects directly via the browser's `AudioContext`:
- Oscillators: Sine, Triangle, Square, Sawtooth.
- Noise generators: Filtered white and brown noise buffers for thruster plumes and atmospheric wind.
- ADSR envelope shaping (Attack, Decay, Sustain, Release).
- Biquad low-pass and band-pass filtering.

---

## 3. Sound Effects (SFX) Manifest

| Event ID | Category | Trigger Action | Synthesis / Audio Description |
|---|---|---|---|
| `UI_HOVER` | Interface | Mouse hover on interactive elements | Subtle 1200Hz sine blip, 40ms duration, low amplitude. |
| `UI_CLICK` | Interface | Button press or toggle | Crisp 800Hz-to-400Hz downward frequency sweep, 60ms. |
| `OPTION_SELECT` | Interface | Selecting Answer A or Answer B | Dual-tone chord (C5 + G5), soft attack, 120ms. |
| `MODAL_OPEN` | Interface | Consequence or dialog opens | Smooth rising sweep with high-pass filtered noise burst. |
| `MODAL_CLOSE` | Interface | Dismissing dialogs | Downward sweep, 80ms. |
| `STAGE_ADVANCE` | Interface | Transitioning between mission phases | Deep resonant harmonic chime (D4 + A4 + D5). |
| `CHOICE_SUCCESS` | Feedback | Positive resource gain or milestone | Bright ascending arpeggio (C5 -> E5 -> G5 -> C6). |
| `CHOICE_WARN` | Feedback | Negative resource hit or low reserve | Two-pulse minor third buzz (F#4 -> D#4), 180ms. |
| `CHOICE_CRITICAL` | Feedback | Critical depletion or failure ending | Piercing Klaxon alarm (900Hz alternating square wave). |
| `TASK_COMPLETE` | Feedback | Task board objective cleared | Triumphant digital shimmer. |
| `ROCKET_IGNITION` | Spacecraft | T-3s launch countdown | Low-frequency rumbling noise with low-pass resonance filter. |
| `ROCKET_LIFTOFF` | Spacecraft | T-0s ascent through atmosphere | Roaring sustained rocket engine exhaust rumble. |
| `STAGE_SEPARATION` | Spacecraft | Booster / fairing jettison | Explosive pyrotechnic latch crack followed by metallic ring. |
| `THRUSTER_BURST` | Spacecraft | Trajectory correction burn | High-pressure cold-gas thruster hiss, 250ms. |
| `INSTRUMENT_SCAN` | Spacecraft | Activating camera or spectrometer | High-tech servo whirr followed by digital telemetry chirp. |
| `RADAR_PING` | Spacecraft | Subsurface radar sounder pulse | Deep acoustic ping with long reverberant decay. |
| `DSN_TRANSMIT` | Spacecraft | Beaming science data to Earth | Fast modulating FSK data stream sound. |
| `DUST_STORM` | Environment | Martian regional dust storm | Filtered brown noise wind turbulence. |
| `SOLAR_STORM` | Environment | Solar coronal mass ejection warning | Static radiation crackle and warning siren. |
| `MISSION_SUCCESS` | Outcome | High-scoring final report (`E001`/`E002`) | Ascending multi-oscillator fanfare. |
| `MISSION_FAILURE` | Outcome | Mission loss ending (`E006`/`E007`/`E008`) | Descending low-frequency drone with telemetry static fade-out. |

---

## 4. Background Music (BGM) Strategy

> [!NOTE]
> **Audio Asset Availability**: No pre-recorded soundtrack files have been supplied in the repository. Full orchestral music tracks do **not** exist yet.
>
> To deliver an immersive soundscape without infringing copyrights:
> 1. NovaScript features a procedural ambient synthesizer that produces gentle, evolving deep-space drone chords (C-minor/Eb ambient pads) using detuned sine oscillators and low-pass filters.
> 2. If dedicated music files are added in the future, they must be strictly public domain (CC0) or licensed royalty-free assets and documented here with verified source URLs.

---

## 5. Licensing & Attribution Standards

All external audio assets added to `public/audio/` must strictly adhere to:
- **Creative Commons 0 (CC0)** / Public Domain, or
- Permissive royalty-free licenses with explicit redistribution rights.
- Under no circumstances will commercial soundtrack recordings be included.
