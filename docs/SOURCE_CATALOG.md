# NovaScript: Scientific Source Catalog & Reference Documentation

## 1. Educational Scope & NASA Disclaimer

> [!NOTE]
> **Independent Educational Disclaimer**: NovaScript is an independent educational simulation game. It is not an official NASA product, nor is it endorsed by, affiliated with, or certified by the National Aeronautics and Space Administration or any government space agency.
> References to NASA mission guidelines, challenges, and scientific publications are cited strictly for educational attribution and contextual learning.

---

## 2. Primary Challenge Source

- **Challenge**: *NASA Space Apps Challenge 2026: Space Mission Design Game*
- **URL**: [https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/)
- **Attribution**: Cited across all 31 questions in `ques-en.json` under the `source` field.
- **Educational Concept**: Systems engineering trade-offs: balancing scientific discovery return against budget caps, mass margins, electrical power generation, and deep space communications.

---

## 3. Reference Literature

### 3.1 Space Mission Concept Development Using Concept Maturity Levels
- **Authors**: Randii R. Wessen, Chester Borden, John Ziemer, Johnny Kwok
- **Affiliation**: Jet Propulsion Laboratory (JPL), California Institute of Technology
- **Document in Workspace**: `resources/13-3547_A1b.pdf`
- **Application in NovaScript**:
  - Concept Maturity Level (CML) methodology: CML 1 (Cocktail napkin idea) to CML 3 (Trade space explored) to CML 4 (Point design baseline).
  - Demonstrates how architecture choices (destination, propulsion, power) impact engineering risk.

### 3.2 Design and Develop Science Missions (NASA Science Mission Directorate, 2025)
- **Document in Workspace**: `resources/250323-design-and-develop-science-mission.pdf`
- **Application in NovaScript**:
  - Science traceability: Connecting scientific inquiries (volatiles in lunar craters, ancient Martian water) directly to specific instrument payloads.
  - Cost caps and risk management principles.

### 3.3 CubeSat 101: Basic Concepts and Processes for First-Time CubeSat Developers
- **Publisher**: NASA CubeSat Launch Initiative (CSLI)
- **Document in Workspace**: `resources/nasa_csli_cubesat_101_508.pdf`
- **Application in NovaScript**:
  - Spacecraft subsystem breakdown: Spacecraft bus structure, Power Subsystems (solar panels, depth-of-discharge, battery chemistry), Thermal Control (MLI blankets, heaters), Communications (RF link budgets, antenna selection), and Launch Integration.
  - Realistic mass constraints and vehicle margin rules.

---

## 4. Interactive Simulation & Tool References

### 4.1 NASA Web-based Space Mission Visualization (`mission-viz`)
- **Repository**: [https://github.com/nasa/mission-viz](https://github.com/nasa/mission-viz)
- **Inspiration for NovaScript**:
  - Lightweight Three.js orbital spline rendering, planet-centric coordinate frames, and ground-track projections.

### 4.2 NASA Webb: Build It Yourself
- **URL**: [https://science.nasa.gov/mission/webb/game-build-it-yourself/](https://science.nasa.gov/mission/webb/game-build-it-yourself/)
- **Inspiration for NovaScript**:
  - Interactive instrument integration where payload selections dynamically modify spacecraft visual appearance and telemetry.

### 4.3 NASA Goddard Space Flight Center: Mission Design Lab (MDL)
- **URL**: [https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/)
- **Methodology**:
  - Concurrent engineering principles: Decisions in the Instrument Lab instantly propagate to the Power, Mass, and Thermal telemetry indicators.
