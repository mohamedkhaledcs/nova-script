# NovaScript: Audio Architecture & Asset Manifest

## 1. Audio Architecture & Design Principles

Sound is vital for an authentic Mission Control and deep-space flight experience. NovaScript implements a **centralized Audio Manager** (`src/lib/audio/audio-manager.ts`) supporting:
- Independent volume sliders for **Master**, **Sound Effects (SFX)**, and **Background Music (BGM)**.
- LocalStorage persistence for user audio preferences.
- Autoplay policy compliance: Audio context initializes only upon the player's first deliberate gesture (e.g. clicking "Start Mission").
- Dual-mode architecture: Plays pre-rendered high-quality audio files when available, with an **instant procedural Web Audio API synthesizer** providing zero-dependency sound effects out of the box!

---

## 2. Audio Categories & Event Manifest

| Event ID | Category | Trigger Action | Audio Description / Synthesis Parameter |
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
| `ROCKET_LIFTOFF` | Spacecraft | T-0s ascent through atmosphere | Roaring sustained rocket engine exhaust rumble with Doppler pitch. |
| `STAGE_SEPARATION` | Spacecraft | Booster / fairing jettison | Explosive pyrotechnic latch crack followed by metallic ring. |
| `THRUSTER_BURST` | Spacecraft | Trajectory correction burn | High-pressure cold-gas thruster hiss, 250ms. |
| `INSTRUMENT_SCAN` | Spacecraft | Activating camera or spectrometer | High-tech servo whirr followed by digital telemetry chirp. |
| `RADAR_PING` | Spacecraft | Subsurface radar sounder pulse | Deep submarine-like acoustic ping with long reverberant decay. |
| `DSN_TRANSMIT` | Spacecraft | Beaming science data to Earth | Fast modulating FSK (Frequency Shift Keying) data stream sound. |
| `DUST_STORM` | Environment | Martian regional dust storm | Howling wind turbulence with filtered brown noise. |
| `SOLAR_STORM` | Environment | Solar coronal mass ejection warning | Static radiation crackle and warning siren. |
| `MISSION_SUCCESS` | Outcome | High-scoring final report (E001/E002) | Grand triumphant orchestral synth fanfare. |
| `MISSION_FAILURE` | Outcome | Mission loss ending (E006/E007/E008) | Solemn descending drone with telemetry static fade-out. |

---

## 3. Background Music Suites

1. **`BGM_MENU`**: *"Deep Space Horizon"* - Ambient floating pads, slow evolving sub-bass, distant pulsar rhythm (BPM: 65).
2. **`BGM_PLANNING`**: *"Mission Formulation"* - Thoughtful, focused analog synthesizers, gentle arpeggiated sequences.
3. **`BGM_FLIGHT`**: *"Interplanetary Cruise"* - Expansive cosmic soundscape, subtle ticking clocks, deep space ambiance.
4. **`BGM_CRISIS`**: *"Anomaly Operations"* - Tense polyrhythmic pulse, distorted bass swells, operational urgency.
5. **`BGM_REPORT`**: *"Mission Debrief"* - Reflective, cinematic closure score.

---

## 4. Procedural Web Audio API Synthesizer (Built-in Fallback)

To guarantee that NovaScript never breaks due to missing remote sound files, `src/lib/audio/procedural-synth.ts` creates real-time audio waveforms directly via the browser's `AudioContext`:
- Pure oscillators (Sine, Triangle, Square, Sawtooth)
- White / Brown noise generators for rocket plumes and wind
- ADSR envelope shaping (Attack, Decay, Sustain, Release)
- Biquad low-pass and band-pass filtering
- Gain nodes for instantaneous zero-latency playback

---

## 5. Licensing & Attribution Standards

All external audio assets must strictly adhere to:
- **Creative Commons 0 (CC0)** / Public Domain, or
- Royalty-Free permissive licenses with explicit commercial/educational re-use rights.
- Under no circumstances will copyrighted soundtrack music be included.
