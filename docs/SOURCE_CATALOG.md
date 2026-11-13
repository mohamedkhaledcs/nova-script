# NovaScript: Scientific Source Catalog & Reference Documentation

This document catalogs the scientific literature, NASA publications, and systems engineering methodologies incorporated into NovaScript.

---

## 1. Primary Challenge Source

- **Challenge**: *NASA Space Apps Challenge 2026: Space Mission Design Game*
- **URL**: [https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/)
- **Attribution**: Cited across all 31 questions in `ques-en.json` under the `source` field.
- **Role**: Establishes the core mission design challenge: balancing scientific return, budget caps, mass margins, electrical power generation, and deep space communications.

---

## 2. NASA Systems Engineering & Mission Design Literature

### 2.1 Space Mission Concept Development Using Concept Maturity Levels
- **Authors**: Randii R. Wessen, Chester Borden, John Ziemer, Johnny Kwok
- **Affiliation**: Jet Propulsion Laboratory (JPL), California Institute of Technology
- **Document in Workspace**: `resouces folder/13-3547_A1b.pdf`
- **Application in NovaScript**:
  - Implements the Concept Maturity Level (CML) methodology: CML 1 (Cocktail napkin idea) to CML 3 (Trade space explored) to CML 4 (Point design baseline).
  - Guides the relationship between mission architecture options and engineering feasibility.

### 2.2 Design and Develop Science Missions (NASA Science Mission Directorate, 2025)
- **Document in Workspace**: `resouces folder/250323-design-and-develop-science-mission.pdf`
- **Application in NovaScript**:
  - Science traceability: Connecting high-level science goals (water on Mars, volatiles in lunar permanently shadowed craters) to specific instrument payloads.
  - Cost caps and risk management profiles.

### 2.3 CubeSat 101: Basic Concepts and Processes for First-Time CubeSat Developers
- **Publisher**: NASA CubeSat Launch Initiative (CSLI)
- **Document in Workspace**: `resouces folder/nasa_csli_cubesat_101_508.pdf`
- **Application in NovaScript**:
  - Subsystem breakdown: Spacecraft bus structure, Power Systems (solar arrays, depth-of-discharge, battery chemistry), Thermal Control (MLI blankets, heaters), Command & Data Handling (C&DH), Communications (RF link budgets, antenna selection), and Launch Integration.
  - Realistic mass constraints and vehicle margin rules.

---

## 3. NASA Interactive Visualization & Tool References

### 3.1 NASA Web-based Space Mission Visualization (`mission-viz`)
- **Repository**: [https://github.com/nasa/mission-viz](https://github.com/nasa/mission-viz)
- **Application in NovaScript**:
  - Inspiration for lightweight Three.js orbital spline rendering, planet-centric coordinate systems, and ground-track projections.

### 3.2 NASA Webb: Build It Yourself
- **URL**: [https://science.nasa.gov/mission/webb/game-build-it-yourself/](https://science.nasa.gov/mission/webb/game-build-it-yourself/)
- **Application in NovaScript**:
  - Interactive instrument selection lab where payload trades directly modify the visual model and telemetry readouts.

### 3.3 NASA Goddard Space Flight Center: Mission Design Lab (MDL)
- **URL**: [https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/)
- **Application in NovaScript**:
  - Concurrent engineering principles: A choice in the Instrument Lab instantly propagates to the Power, Mass, and Thermal subsystems.
