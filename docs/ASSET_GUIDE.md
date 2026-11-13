# NovaScript: Visual Asset Guide & Integration Specification

This document details the graphical assets provided for NovaScript and defines their technical integration rules.

---

## 1. Provided Assets Overview

| Asset Name | Local File Path | Dimensions | Channels | Bounding Box | Visual Style |
|---|---|:---:|:---:|:---:|---|
| **Astronaut Player** | `public/assets/characters/player.png` | 1254 x 1254 | RGBA (Alpha) | (325, 104, 877, 1151) | Detailed pixel art astronaut in spacesuit with visor reflection |
| **Rocket Cursor** | `public/assets/cursor/rocket-cursor.png` | 1024 x 1536 | RGBA (Alpha) | (0, 92, 976, 1536) | Retro pixel art rocket with red fins, porthole, and exhaust plume |

Both assets feature 100% genuine alpha transparency, crisp pixel-art contouring, and zero background artifacting.

---

## 2. Astronaut Player Avatar (`player.png`)

### 2.1 Placement & Role
The astronaut avatar serves as the visual representation of the **Mission Commander**:
- **Mission Briefing Room**: Positioned alongside the Mission Director dialog panel, welcoming the player to NASA Mission Control.
- **Flight Operations Console**: Displayed in the communications channel feed during orbital insertion and anomaly alerts.
- **Mission Dossier Report**: Appears at mission conclusion saluting a successful mission or reviewing incident logs.

### 2.2 Animation & Styling
- **Preserve Pixel Crispness**: Rendered with CSS `image-rendering: pixelated; image-rendering: crisp-edges;`.
- **Idle Motion**: Floating / zero-gravity breathing animation powered by GSAP / CSS keyframes:
  - Slight vertical oscillation (`y: [-6px, 6px]`, 3.2s duration, `ease: "easeInOutSine"`, infinite loop).
  - Subtle visor glint / specular reflection sweep across the astronaut helmet faceplate.
- **Dimensions**: Scaled responsively to 160px – 240px wide while preserving the 1:1 square aspect ratio.

---

## 3. Rocket Mouse Pointer (`rocket-cursor.png`)

### 3.1 Problem with Raw OS Cursor
The original file is 1024 x 1536 pixels. Modern browsers and operating systems restrict native CSS cursors (`cursor: url(...)`) to a maximum of 32x32 or 128x128 pixels, and raw high-res images cause severe browser lag or clipping.

### 3.2 NovaScript Custom Cursor Implementation
We implement a high-performance, GPU-accelerated **in-DOM custom cursor component** (`src/components/game/CustomCursor/CustomCursor.tsx`):
1. **DOM Construction**:
   - Fixed overlay element positioned via CSS transforms (`transform: translate3d(x, y, 0)`).
   - `pointer-events: none;` applied to ensure all underlying buttons, sliders, and 3D scenes receive clicks without obstruction.
   - Scaled down cleanly to 36px width by 54px height.
2. **Hotspot Alignment**:
   - The rocket tip points straight up at coordinates `(x ~ 512, y = 92)`.
   - The CSS transform anchors the tip directly to the actual mouse pointer coordinates (`transform-origin: 50% 6%`).
3. **Interactive Visual Effects**:
   - **Click Action**: A momentary downward recoil (`scale: 0.88`, `translateY: 4px`) with an animated burst from the orange/yellow rocket exhaust flame.
   - **Hover Action**: Subtle angle tilt (`rotate: 12deg`) when hovering over clickable options.
4. **Touch & Accessibility Fallback**:
   - Automatically disabled on touch-enabled devices or viewports with `(pointer: coarse)`.
   - The standard OS cursor is preserved outside the game viewport and restored if the user prefers reduced motion or accessibility cursors.

---

## 4. Context Menu & Right-Click Interaction System

NovaScript turns the secondary click into an active gameplay mechanic:
- **Surface Interception**: Prevents default browser context menu inside the main game container (`e.preventDefault()`).
- **Radial Action Menu**: Opens a sleek circular or card context menu directly at pointer `(clientX, clientY)`:
  - **Inspect Subsystem**: Opens detailed telemetry specs of the targeted spacecraft module.
  - **Focus Camera**: Smoothly glides the Three.js camera to focus on the clicked planet, spacecraft, or instrument.
  - **Open Mission Log**: Pops open the chronological decision history and resource trend graph.
  - **Audio Settings**: Quick volume toggle.
- **Dismissal**: Closes seamlessly on outside click, scroll, or pressing `Escape`.
- **Mobile Alternative**: Long-press (600ms) triggers the same context menu on touch devices.
