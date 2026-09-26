import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Update QA/STUDENT_UX_REPORT.md
{
  const filePath = path.join(rootDir, 'QA', 'STUDENT_UX_REPORT.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII table at lines 383-396
  content = content.replace(
    /```[\r\n\s]+\+--+[\r\n\s]+\|\s+STUDENT FIELD ARTIFACT INDEX\s+\|[\s\S]*?```/,
    `| ID | Artifact Filename | Epoch | Primary Evaluative Focus |
| :---: | :--- | :---: | :--- |
| **01** | \`01_overview_and_lattice_key.png\` | Tick 20 | Seamount Overview & Lattice Key |
| **02** | \`02_zooming_difficulty_drift.png\` | Tick 21 | Zoom Drift & Peripheral Loss |
| **03** | \`03_selected_silicoid_and_microscope.png\` | Tick 21 | Reticle Lock & Live Microscope |
| **04** | \`04_deep_zoom_and_insitu_circuit.png\` | Tick 21 | In-Situ 3D Breadboard Font Crisis |
| **05** | \`05_god_suite_lab_controls.png\` | Tick 21 | Lab Drawer Overlay Collisions |
| **06** | \`06_thermal_surge_and_extinction.png\` | Tick 36 | Milestone Toast & Lattice Overlap |`
  );

  // Replace ASCII table at lines 499-511
  content = content.replace(
    /```[\r\n\s]+\+--+[\r\n\s]+\|\s+STUDENT ENGINEERING RECOMMENDATION MATRIX\s+\|[\s\S]*?```/,
    `| Rec | Proposed Feature / Fix | Target File(s) | Priority | Estimated Impact |
| :---: | :--- | :--- | :---: | :--- |
| **01** | Cursor-Centric Raycast Zoom | \`OrbitCamera.ts\`, \`main.ts\` | **CRITICAL** | Eliminates zoom drift; zooms to mouse position |
| **02** | Double-Click Smooth Ease-In | \`OrbitCamera.ts\`, \`main.ts\` | **HIGH** | Cinematic orientation and smooth target acquisition |
| **03** | Aqueous Hit-Test Filter | \`SeafloorRenderer3D.ts\` | **HIGH** | Reliable benthic pore selection without fluid obstruction |
| **04** | Billboarded In-Situ Text LOD | \`SeafloorRenderer3D.ts\` | **MEDIUM** | Crisp, readable 3D gate icons across all camera angles |
| **05** | Non-Overlapping HUD Layout | \`index.html\`, \`main.ts\` | **MEDIUM** | Preserves visibility of telemetry bar and controls |`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated QA/STUDENT_UX_REPORT.md remaining ASCII tables');
}

// 2. Update THEORETICAL_MODEL.md
{
  const filePath = path.join(rootDir, 'THEORETICAL_MODEL.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace lines 331-344 (Hex Honeycomb)
  content = content.replace(
    /```[\r\n\s]+HEXAGONAL HONEYCOMB MATRIX[\s\S]*?```/,
    `| Neighbor Direction | Axial Offset Vector $(\\Delta q, \\Delta r)$ | Geometric Properties | Physical Connection |
| :---: | :---: | :--- | :--- |
| **East (E)** | $(+1, 0)$ | Distance $d = 1.0$, Angle $0^\\circ$ | Direct pore wall interface, fluid-permeable pin |
| **North-East (NE)** | $(+1, -1)$ | Distance $d = 1.0$, Angle $60^\\circ$ | Direct pore wall interface, fluid-permeable pin |
| **North-West (NW)** | $(0, -1)$ | Distance $d = 1.0$, Angle $120^\\circ$ | Direct pore wall interface, fluid-permeable pin |
| **West (W)** | $(-1, 0)$ | Distance $d = 1.0$, Angle $180^\\circ$ | Direct pore wall interface, fluid-permeable pin |
| **South-West (SW)** | $(-1, +1)$ | Distance $d = 1.0$, Angle $240^\\circ$ | Direct pore wall interface, fluid-permeable pin |
| **South-East (SE)** | $(0, +1)$ | Distance $d = 1.0$, Angle $300^\\circ$ | Direct pore wall interface, fluid-permeable pin |`
  );

  // Replace lines 358-370 (Multi-Cellular Transition)
  content = content.replace(
    /```[\r\n\s]+PORE 1: THE SHIELD \/ SENSOR[\s\S]*?```/,
    `| Compartment Role | Spatial Location & Morphogen Bias | Expressed Circuit Features | Shared Umbilical Bus Function |
| :--- | :--- | :--- | :--- |
| **Pore 1: Shield / Sensor** | Outer vent-facing boundary (Bias = 1) | Thick mineral filter walls, toxin rejection (\`NOT T\`) | Conducts filtered substrate pulses into core |
| **Pore 2: Metabolic Core** | Sheltered deep rock crevice (Bias = 0) | Heavy compute netlist, ring oscillator clock, battery bank | Shares stored energy tokens back to shield pore |`
  );

  // Replace lines 456-473 (Live Circuit Microscope ASCII)
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+LIVE CIRCUIT MICROSCOPE\s+│[\s\S]*?```/,
    `![Figure 3.2: The Live Circuit Microscope & Milestone Inspector](assets/screenshots/03_selected_silicoid_and_microscope.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.2 — Live Circuit Microscope & Milestone Recognition
> - **Visual Guide:** Shows the real-time circuit microscope inspecting a selected silicoid pore. The panel displays the active CMOS logic gates (\`AND\`, \`OR\`, \`NOT\`), pulsing electron wires, current battery tokens ($0..100$), and the 60-bit decoded genome tape.
> - **Biophysical Reality:** Verifies Howard Pattee's Epistemic Cut by maintaining a strict operational divide between the inert symbolic tape and the active, Landauer-dissipating metabolic logic network.
> - **Digital Mapping:** When a milestone motif (bistable latch, ring clock, adder) evolves, the Digital Paleontologist highlights the topological subgraph and opens the detailed theoretical citation card.
> - **Core Principle:** *Dynamic telemetry without perturbation.* Science observes the living system passively without injecting cheats or guidance.`
  );

  // Replace lines 504-523 (The Living Physical Force Field)
  content = content.replace(
    /```[\r\n\s]+THE LIVING PHYSICAL FORCE FIELD[\s\S]*?```/,
    `![Figure 5.1: Abyssal Physical Force Fields: Gravity, Thermal Plumes & Marine Snow](assets/diagrams/fig4_3_pelagic_spores.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 5.1 — Physical Force Fields & Environmental Stratification
> - **Visual Guide:** Cross-section of the 3D abyssal caldera illustrating buoyant hydrothermal updrafts rising against gravity ($z \\ge 1$) and falling organic detritus sedimenting toward the benthic rock substrate ($z=0$).
> - **Biophysical Reality:** Non-equilibrium hydrothermal systems feature steep vertical thermal and chemical gradients that drive natural convective transport.
> - **Digital Mapping:** Discrete $O(1)$ fluid advection moves pelagic spores and metabolic pulses upward, while spent carcasses slowly sink to form a benthic nutrient layer.
> - **Core Principle:** *Physical forces scaffold ecological niches.* Gravity and convection dictate spatial survival strategies.`
  );

  // Replace lines 543-553 (Z-Axis terrain)
  content = content.replace(
    /```[\r\n\s]+\[Z = 3: Hydrothermal Chimney Tip\][\s\S]*?```/,
    `| Topographical Layer | Elevation & Medium | Geological Features | Ecological Role |
| :---: | :--- | :--- | :--- |
| **$Z = 3$** | Chimney Apex (\`ROCK_SUBSTRATE\`) | Sinuous hydrothermal spires spewing into open water | Maximum energy injection, extreme thermal flux |
| **$Z = 2$** | Volcanic Ridge (\`AQUEOUS_FLUID\` / Rock) | Elevated ledges, volcanic overhangs, mineral shelves | Pelagic spore drift highway, secondary colonization |
| **$Z = 1$** | Sheltered Basalt (\`ROCK_SUBSTRATE\`) | Deep crevices, boulder dead ends, low turbulence | Protected nursery pockets for fragile nascent clades |
| **$Z = 0$** | Bedrock Seabed (\`ROCK_SUBSTRATE\`) | Solid basalt ocean floor, marine snow sediment basin | Benthic scavenger niche, detritivore foraging zone |`
  );

  // Replace lines 567-575 (Dual Metabolic Currencies)
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+DUAL METABOLIC CURRENCIES\s+│[\s\S]*?```/,
    `| Metabolic Currency | Physical / Biological Analogy | Acquisition Mechanism | Expenditure & Thermodynamic Sink |
| :--- | :--- | :--- | :--- |
| **Energy Tokens ($E$)** | ATP / Chemiosmotic PMF (Calories) | Two-substrate catalytic reactions ($A \\land B$) | Landauer dynamic gate toggles ($-1$ token), basal decay |
| **Matter Tokens ($M$)** | Carbon / Silica / Iron Biomass | Mineral absorption from chimney plumes and detritus | Synthesizing physical logic gates, cell walls, and spores |`
  );

  // Replace lines 624-633 (The Time-Machine Scrubber)
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+THE TIME-MACHINE SCRUBBER\s+│[\s\S]*?```/,
    `| Control Component | Keyboard / Mouse Action | Historical Playback Function | Scientific Purpose |
| :--- | :--- | :--- | :--- |
| **◄◄ Rewind** | Click / Left Arrow | Rewinds simulation backward across recorded epoch | Inspect initial primordial soup conditions |
| **◄ Step** | Click / Shift + Left | Single-frame backward step ($-1$ tick) | Trace precise single-tick gate transitions |
| **❚❚ Pause / ► Play** | Click / Spacebar | Freezes or resumes active physical simulation | Halt simulation for micro-inspection |
| **Step ►** | Click / Shift + Right | Single-frame forward step ($+1$ tick) | Step through division or viral breach |
| **Fast ►►** | Click / Right Arrow | Accelerates tick execution speed ($1\\times$ to $20\\times$) | Rapid multi-thousand generation evolution runs |
| **Milestone Gems (◆)** | Click on Timeline Bookmark | Jumps directly to major historical milestone event | Instant access to landmark evolutionary discoveries |`
  );

  // Replace lines 663-675 (Fitness Altitude & Kimura Neutral Drift)
  content = content.replace(
    /```[\r\n\s]+Fitness Altitude \(Metabolic Flux\)[\s\S]*?```/,
    `![Figure 4.1: Neutral Saddles, Gene Duplication, and Adaptive Breakthroughs](assets/diagrams/fig4_1_kimura_and_ohno.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.1 — Kimura Neutral Saddles & Ohno Gene Duplication
> - **Visual Guide:** The left panel diagrams a complex multi-peaked fitness landscape: populations navigate across extensive neutral fitness plateaus (Motoo Kimura's Neutral Drift) before discovering adaptive ridges. The right panel illustrates Susumu Ohno's gene duplication mechanism: a redundant paralogous copy of a functional gene escapes purifying selection, freely accumulating mutations until acquiring a novel catalytic function (neofunctionalization).
> - **Biophysical Reality:** Without neutral drift and gene duplication, populations become trapped on local sub-optimal fitness peaks. Redundancy is nature's laboratory for evolutionary innovation.
> - **Digital Mapping:** In Siliquarium, non-coding synonymous codons and tandem codon duplications create neutral reserves. Evolving lineages traverse Hamming distance ($d_H > 0$) at constant fitness altitude until stumbling upon high-yield network motifs.
> - **Core Principle:** *Neutrality enables open-ended evolution.* Most mutations are neutral; redundancy provides the raw material for macro-evolutionary leaps.`
  );

  // Replace lines 706-713 (Water Column discrete movement)
  content = content.replace(
    /```[\r\n\s]+WATER COLUMN \(Fluid Hexes\)[\s\S]*?```/,
    `| Marine Stratification | Lattice Coordinate Medium | Mechanical Physics | Biological Manifestation |
| :--- | :--- | :--- | :--- |
| **Permeable Water Column** | $z \\ge 1, \\text{medium} = \\text{AQUEOUS\\_FLUID}$ | Discrete hop-by-hop advection vector $\\vec{v}$ | Pelagic spore capsules, buoyant broadcast spawning |
| **Basalt Bedrock Substrate** | $z = 0, \\text{medium} = \\text{ROCK\\_SUBSTRATE}$ | Solid stationary mineral boundaries ($d = 0$) | Anchored benthic silicoids, sessile pore workshops |`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated THEORETICAL_MODEL.md remaining ASCII diagrams');
}

console.log('All remaining ASCII eradication complete!');
