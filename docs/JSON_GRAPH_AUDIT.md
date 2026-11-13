# NovaScript: JSON Graph & Branching Audit

This document presents the complete mathematical audit of `public/data/ques-en.json`, the canonical dataset driving NovaScript.

---

## 1. Graph Summary Statistics

- **Total Questions**: 31 (`Q001` to `Q031`)
- **Total Answers**: 62 (`A001` to `A062`), exactly 2 options per question
- **Total Endings**: 8 (`E001` to `E008`)
- **Start Node**: `Q001`
- **Graph Type**: Directed Acyclic Graph (DAG) with convergence nodes
- **Total Playable Paths**: 33 distinct paths from `Q001` to terminal endings
- **Path Lengths**: Minimum 4 decisions, Maximum 6 decisions, Average 5.1 decisions
- **Reachability**: 100% (31 of 31 questions reachable; 8 of 8 endings reachable)
- **Dead Ends / Orphaned IDs**: 0

---

## 2. Mission Stages Breakdown (8 Canonical Stages)

| Stage Identifier | Question Count | Question IDs |
|---|:---:|---|
| `mission_planning` | 3 | Q001, Q002, Q003 |
| `spacecraft_design` | 6 | Q004, Q005, Q006, Q007, Q013, Q014 |
| `scientific_instruments` | 6 | Q008, Q009, Q010, Q011, Q012, Q015 |
| `orbit_selection` | 3 | Q016, Q019, Q024 |
| `space_communications` | 4 | Q017, Q020, Q023, Q029 |
| `resource_management` | 1 | Q018 |
| `launch_planning` | 4 | Q021, Q022, Q025, Q027 |
| `mission_operations` | 4 | Q026, Q028, Q030, Q031 |

---

## 3. Endings & Path Distribution

| Ending ID | Title | Status | Formula | Path Count | Min Score | Max Score | Avg Score |
|---|---|---|---|:---:|:---:|:---:|:---:|
| **E001** | Outstanding Scientific Success | `outstanding_success` | `scientific_value * 1.5 + communication + power + budget` | 9 | 256.0 | 300.0 | 280.4 |
| **E002** | Successful Mission with Smart Resource Efficiency | `efficient_success` | `budget * 1.3 + power * 1.2 + scientific_value + communication` | 9 | 241.0 | 318.5 | 280.2 |
| **E003** | Valuable Scientific Discovery | `scientific_discovery` | `scientific_value * 1.4 + communication + power` | 5 | 221.0 | 260.2 | 243.5 |
| **E004** | Partial Mission Success | `partial_success` | `scientific_value + communication + budget` | 3 | 138.0 | 152.0 | 143.3 |
| **E005** | Mission Requires a New Strategy | `strategy_revision` | `scientific_value + power + budget * 0.8` | 2 | 117.0 | 131.6 | 124.3 |
| **E006** | Mission Failure Due to Power or Fuel Depletion | `resource_failure` | `scientific_value * 0.5 + budget * 0.5` | 2 | 39.0 | 50.0 | 44.5 |
| **E007** | Launch Scrubbed: Payload Mass Overload | `launch_failure` | `budget * 0.6 + scientific_value * 0.4` | 2 | 43.6 | 46.0 | 44.8 |
| **E008** | Thermal Protection Failure During Entry | `engineering_failure` | `budget * 0.5` | 1 | 22.5 | 22.5 | 22.5 |

---

## 4. Complete Question & Answer Routing Table

| QID | Stage | Question Prompt | Ans 1 (ID, Target, Effects) | Ans 2 (ID, Target, Effects) |
|---|---|---|---|---|
| **Q001** | `mission_planning` | Which destination will your mission explore? | **[A001]** Explore the Moon, Earth's closest neighbor. -> `Q002` (B:-5, S:+5, C:+10) | **[A002]** Explore Mars, the distant Red Planet. -> `Q003` (B:-15, M:+5, P:-5, S:+15, C:-10) |
| **Q002** | `mission_planning` | What is your main scientific objective on the Moon? | **[A003]** Map sunlit lunar plains to study surface rocks and minerals. -> `Q004` (B:-5, P:+10, S:+10, C:+5) | **[A004]** Search dark polar craters for frozen water ice. -> `Q005` (B:-10, M:+5, P:-10, S:+20, C:-5) |
| **Q003** | `mission_planning` | What is your primary scientific goal at Mars? | **[A005]** Study the Martian atmosphere and track global dust storms. -> `Q006` (B:-5, P:+5, S:+15, C:+5) | **[A006]** Investigate Mars's rocky crust and ancient water history. -> `Q007` (B:-10, M:+10, P:-5, S:+20) |
| **Q004** | `spacecraft_design` | Which spacecraft configuration will you build? | **[A007]** A lightweight solar-panel bus with a standard small battery. -> `Q008` (B:-5, M:+5, P:+10, S:+5) | **[A008]** A larger bus with dual high-capacity rechargeable batteries. -> `Q009` (B:-12, M:+15, P:+20, S:+5, C:+5) |
| **Q005** | `spacecraft_design` | How will you protect your crater-hunting spacecraft? | **[A009]** Add gold multi-layer thermal blankets and electric heaters. -> `Q010` (B:-10, M:+10, P:-10, S:+10) | **[A010]** Install a heavy-duty battery pack to power quick crater dives. -> `Q011` (B:-15, M:+18, P:+15, S:+5) |
| **Q006** | `spacecraft_design` | How will you configure your Mars orbiter? | **[A011]** Equip wide, high-efficiency solar wings. -> `Q012` (B:-10, M:+10, P:+15, S:+5, C:+5) | **[A012]** Build a streamlined aerobraking frame to skim Mars's upper air. -> `Q013` (B:-5, M:-5, S:+10) |
| **Q007** | `spacecraft_design` | Which mission architecture will you choose? | **[A013]** Build a six-wheeled surface rover with a robotic arm. -> `Q014` (B:-20, M:+20, P:-5, S:+20, C:-5) | **[A014]** Build a dedicated geological survey orbiter. -> `Q015` (B:-10, M:+8, P:+10, S:+15, C:+10) |
| **Q008** | `scientific_instruments` | Which primary scientific instrument will you install? | **[A015]** A lightweight 3D stereo mapping camera. -> `Q016` (B:-5, M:+5, P:-5, S:+15) | **[A016]** A high-power laser mineral spectrometer. -> `Q017` (B:-12, M:+10, P:-15, S:+25, C:-5) |
| **Q009** | `scientific_instruments` | How will you put your extra battery capacity to work? | **[A017]** Add a small lunar hopper module to visit multiple sites. -> `Q018` (B:-10, M:+15, P:-10, S:+20) | **[A018]** Carry dual wide-angle and thermal mapping cameras in orbit. -> `Q019` (B:-8, M:+8, P:-10, S:+18, C:+5) |
| **Q010** | `scientific_instruments` | Which ice-hunting instrument will you choose? | **[A019]** A neutron spectrometer that detects hydrogen from orbit. -> `Q020` (B:-8, M:+6, P:-5, S:+20) | **[A020]** A heavy surface drill and soil-heating oven. -> `Q021` (B:-15, M:+25, P:-15, S:+25) |
| **Q011** | `scientific_instruments` | Which active sensor will you mount on your spacecraft? | **[A021]** A laser altimeter that bounces light pulses into dark craters. -> `Q022` (B:-8, M:+8, P:-10, S:+18) | **[A022]** A deep-penetrating ice radar sounder. -> `Q023` (B:-12, M:+12, P:-12, S:+22, C:-10) |
| **Q012** | `scientific_instruments` | Which atmospheric instrument will you fly? | **[A023]** A neutral gas mass spectrometer to measure escaping air. -> `Q024` (B:-8, M:+7, P:-8, S:+20) | **[A024]** A high-power atmospheric dust and cloud lidar. -> `Q025` (B:-12, M:+20, P:-12, S:+22) |
| **Q013** | `spacecraft_design` | What thermal protection will you install for aerobraking? | **[A025]** Install tested ceramic-composite heat tiles on the leading edge. -> `Q026` (B:-8, M:+10, S:+10) | **[A026]** Skip extra heat shielding and use thin aluminum foil to save weight. -> **ENDING `E008`** (M:-5, P:-50, S:-10, C:-50) |
| **Q014** | `spacecraft_design` | How will you power your Mars rover? | **[A027]** Use a radioisotope power system (MMRTG) for steady day-and-night energy. -> `Q027` (B:-18, M:+15, P:+25, S:+15, C:+5) | **[A028]** Use fold-out solar panels to save budget. -> `Q028` (B:-5, M:+5, P:+5, S:+10) |
| **Q015** | `scientific_instruments` | Which geological instrument will you choose? | **[A029]** A subsurface ground-penetrating radar to search for buried ice. -> `Q029` (B:-10, M:+12, P:-10, S:+22, C:-5) | **[A030]** A hyperspectral mineral imager to spot ancient clay deposits. -> `Q030` (B:-8, M:+8, P:-8, S:+20) |
| **Q016** | `orbit_selection` | Which lunar orbit will you select? | **[A031]** A low 50 km polar mapping orbit for ultra-sharp photos. -> `Q031` (B:-5, P:-10, S:+20) | **[A032]** A higher elliptical orbit that stays in sunlight longer. -> **ENDING `E002`** (P:+15, S:+12, C:+15) |
| **Q017** | `space_communications` | Which communication system will you install? | **[A033]** Keep a small omni-directional antenna to save budget and mass. -> **ENDING `E004`** (B:+5, M:-5, P:+5, S:-5, C:-20) | **[A034]** Install a steerable high-gain dish antenna. -> **ENDING `E001`** (B:-8, M:+5, P:-5, S:+15, C:+25) |
| **Q018** | `resource_management` | How will you balance fuel and instruments for the hop? | **[A035]** Prioritize reserve thruster propellant and execute a short, controlled hop. -> **ENDING `E003`** (M:-5, P:+5, S:+18, C:+10) | **[A036]** Attempt a long-range leap across rugged terrain with minimal fuel margin. -> **ENDING `E006`** (M:-10, P:-35, S:-10, C:-35) |
| **Q019** | `orbit_selection` | Which orbital altitude will you choose? | **[A037]** Fly at 50 km altitude for high-resolution thermal maps. -> **ENDING `E001`** (B:-5, P:-5, S:+22, C:+10) | **[A038]** Fly at 200 km altitude for wide regional coverage and gentle fuel use. -> **ENDING `E002`** (B:+5, P:+10, S:+14, C:+15) |
| **Q020** | `space_communications` | How will you send your discovery data back to Earth? | **[A039]** Wait for brief direct line-of-sight windows with Earth. -> **ENDING `E004`** (B:+5, S:+5, C:-15) | **[A040]** Beam data through a lunar relay satellite overhead. -> **ENDING `E001`** (B:-8, P:+5, S:+20, C:+25) |
| **Q021** | `launch_planning` | Which launch vehicle will you book for liftoff? | **[A041]** Book a budget-friendly medium-lift rocket. -> **ENDING `E007`** (B:+10, M:+15, S:-15) | **[A042]** Book a heavy-lift rocket matched to your lander's mass. -> **ENDING `E003`** (B:-18, P:+5, S:+20, C:+10) |
| **Q022** | `launch_planning` | Which launch option will you choose? | **[A043]** Share a rocket ride with another mission to split launch costs. -> **ENDING `E002`** (B:+15, P:+5, S:+12, C:+10) | **[A044]** Book a dedicated medium rocket for a direct polar trajectory. -> **ENDING `E003`** (B:-12, P:+5, S:+20, C:+10) |
| **Q023** | `space_communications` | How will you handle this massive flood of scientific data? | **[A045]** Use a high-frequency Ka-band radio transmitter. -> **ENDING `E001`** (B:-10, M:+5, P:-8, S:+20, C:+25) | **[A046]** Use onboard software compression to shrink files before sending. -> **ENDING `E002`** (B:+5, P:+10, S:+14, C:+15) |
| **Q024** | `orbit_selection` | Which Mars orbit will you enter? | **[A047]** Dip into a low upper-atmosphere sampling orbit. -> `Q030` (B:-5, P:-5, S:+20) | **[A048]** Stay in a high, stable orbit with long Earth communication passes. -> **ENDING `E002`** (B:+5, P:+10, S:+14, C:+20) |
| **Q025** | `launch_planning` | Which launch vehicle will send your orbiter to Mars? | **[A049]** Select a medium-class rocket meant mainly for Earth orbit. -> **ENDING `E007`** (B:+10, M:+10, S:-15) | **[A050]** Select a heavy deep-space launch vehicle. -> **ENDING `E001`** (B:-18, P:+5, S:+25, C:+15) |
| **Q026** | `mission_operations` | How fast will you execute the aerobraking campaign? | **[A051]** Perform dozens of gentle, shallow passes over several weeks. -> **ENDING `E003`** (B:-5, P:+10, S:+20, C:+15) | **[A052]** Dive deep into thick air to finish aerobraking in three passes. -> **ENDING `E005`** (B:-10, P:-15, S:+5) |
| **Q027** | `launch_planning` | Which deep-space rocket configuration will you choose? | **[A053]** Use a proven heavy-lift interplanetary rocket. -> **ENDING `E001`** (B:-15, P:+10, S:+25, C:+15) | **[A054]** Pay extra for an oversized ultra-heavy rocket with huge spare capacity. -> **ENDING `E002`** (B:-25, P:+10, S:+15, C:+10) |
| **Q028** | `mission_operations` | How will you command your rover during the dust storm? | **[A055]** Put the rover into low-power hibernation until winds clear the panels. -> **ENDING `E004`** (P:+10, S:+5, C:+5) | **[A056]** Keep driving and drilling at full speed during the storm. -> **ENDING `E005`** (B:-5, P:-20, C:-10) |
| **Q029** | `space_communications` | How will you manage Deep Space Network communications? | **[A057]** Point your 3-meter high-gain dish at NASA's Deep Space Network. -> **ENDING `E001`** (B:-8, P:-5, S:+22, C:+25) | **[A058]** Store files in onboard memory and transmit prioritized highlights. -> **ENDING `E003`** (P:+10, S:+18, C:+15) |
| **Q030** | `mission_operations` | How will you respond to the solar storm? | **[A059]** Switch sensitive cameras to Safe Mode until radiation passes. -> **ENDING `E002`** (P:+10, S:+10, C:+10) | **[A060]** Use shielded radiation sensors to record how the storm hits Mars. -> **ENDING `E001`** (B:-5, P:-10, S:+25, C:+10) |
| **Q031** | `mission_operations` | How will you manage power until your spacecraft returns to sunlight? | **[A061]** Pause the stereo camera during shadow passes and keep only core computers on. -> **ENDING `E002`** (P:+15, S:+10, C:+10) | **[A062]** Keep heaters, transmitters, and cameras running at full power in the dark. -> **ENDING `E006`** (P:-25, S:-10, C:-30) |

*(Legend: B = Budget, M = Mass, P = Power, S = Scientific Value, C = Communication. All values are normalized points on a 0 to 100 scale.)*

---

## 5. All 33 Traced Decision Paths

```text
01. Q001 -> Q002 -> Q004 -> Q008 -> Q016 -> Q031 -> [E002] (A001, A003, A007, A015, A031, A061)
02. Q001 -> Q002 -> Q004 -> Q008 -> Q016 -> Q031 -> [E006] (A001, A003, A007, A015, A031, A062)
03. Q001 -> Q002 -> Q004 -> Q008 -> Q016 -> [E002] (A001, A003, A007, A015, A032)
04. Q001 -> Q002 -> Q004 -> Q008 -> Q017 -> [E004] (A001, A003, A007, A016, A033)
05. Q001 -> Q002 -> Q004 -> Q008 -> Q017 -> [E001] (A001, A003, A007, A016, A034)
06. Q001 -> Q002 -> Q004 -> Q009 -> Q018 -> [E003] (A001, A003, A008, A017, A035)
07. Q001 -> Q002 -> Q004 -> Q009 -> Q018 -> [E006] (A001, A003, A008, A017, A036)
08. Q001 -> Q002 -> Q004 -> Q009 -> Q019 -> [E001] (A001, A003, A008, A018, A037)
09. Q001 -> Q002 -> Q004 -> Q009 -> Q019 -> [E002] (A001, A003, A008, A018, A038)
10. Q001 -> Q002 -> Q005 -> Q010 -> Q020 -> [E004] (A001, A004, A009, A019, A039)
11. Q001 -> Q002 -> Q005 -> Q010 -> Q020 -> [E001] (A001, A004, A009, A019, A040)
12. Q001 -> Q002 -> Q005 -> Q010 -> Q021 -> [E007] (A001, A004, A009, A020, A041)
13. Q001 -> Q002 -> Q005 -> Q010 -> Q021 -> [E003] (A001, A004, A009, A020, A042)
14. Q001 -> Q002 -> Q005 -> Q011 -> Q022 -> [E002] (A001, A004, A010, A021, A043)
15. Q001 -> Q002 -> Q005 -> Q011 -> Q022 -> [E003] (A001, A004, A010, A021, A044)
16. Q001 -> Q002 -> Q005 -> Q011 -> Q023 -> [E001] (A001, A004, A010, A022, A045)
17. Q001 -> Q002 -> Q005 -> Q011 -> Q023 -> [E002] (A001, A004, A010, A022, A046)
18. Q001 -> Q003 -> Q006 -> Q012 -> Q024 -> Q030 -> [E002] (A002, A005, A011, A023, A047, A059)
19. Q001 -> Q003 -> Q006 -> Q012 -> Q024 -> Q030 -> [E001] (A002, A005, A011, A023, A047, A060)
20. Q001 -> Q003 -> Q006 -> Q012 -> Q024 -> [E002] (A002, A005, A011, A023, A048)
21. Q001 -> Q003 -> Q006 -> Q012 -> Q025 -> [E007] (A002, A005, A011, A024, A049)
22. Q001 -> Q003 -> Q006 -> Q012 -> Q025 -> [E001] (A002, A005, A011, A024, A050)
23. Q001 -> Q003 -> Q006 -> Q013 -> Q026 -> [E003] (A002, A005, A012, A025, A051)
24. Q001 -> Q003 -> Q006 -> Q013 -> Q026 -> [E005] (A002, A005, A012, A025, A052)
25. Q001 -> Q003 -> Q006 -> Q013 -> [E008] (A002, A005, A012, A026)
26. Q001 -> Q003 -> Q007 -> Q014 -> Q027 -> [E001] (A002, A006, A013, A027, A053)
27. Q001 -> Q003 -> Q007 -> Q014 -> Q027 -> [E002] (A002, A006, A013, A027, A054)
28. Q001 -> Q003 -> Q007 -> Q014 -> Q028 -> [E004] (A002, A006, A013, A028, A055)
29. Q001 -> Q003 -> Q007 -> Q014 -> Q028 -> [E005] (A002, A006, A013, A028, A056)
30. Q001 -> Q003 -> Q007 -> Q015 -> Q029 -> [E001] (A002, A006, A014, A029, A057)
31. Q001 -> Q003 -> Q007 -> Q015 -> Q029 -> [E003] (A002, A006, A014, A029, A058)
32. Q001 -> Q003 -> Q007 -> Q015 -> Q030 -> [E002] (A002, A006, A014, A030, A059)
33. Q001 -> Q003 -> Q007 -> Q015 -> Q030 -> [E001] (A002, A006, A014, A030, A060)
```
