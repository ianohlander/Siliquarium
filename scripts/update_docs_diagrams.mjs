import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Update docs/PEDAGOGICAL_COMPANION_SUITE.md
{
  const filePath = path.join(rootDir, 'docs', 'PEDAGOGICAL_COMPANION_SUITE.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII Suite Map
  content = content.replace(
    /```[\r\n\s]+THE SILIQUARIUM MODULAR PEDAGOGICAL SUITE[\s\S]*?```/,
    `| Pedagogical Component | Focus & Modality | Target Outcomes | Core Architectural Artifacts |
| :--- | :--- | :--- | :--- |
| **🎓 Curriculum & Syllabus** | 4 Core Modular Units, 5 Hands-on Practicums | Foundational biophysics, Pattee's cut, macro-evolution | [\`CURRICULUM_AND_SYLLABUS.md\`](CURRICULUM_AND_SYLLABUS.md) |
| **🏛️ Master Companion Suite** | Epistemic grounding & XOR treatise (This Hub) | Proof of XOR non-separability, pedagogical philosophy | [\`PEDAGOGICAL_COMPANION_SUITE.md\`](PEDAGOGICAL_COMPANION_SUITE.md) |
| **📖 Lexicon & Glossary** | 55+ Formal mathematical terms across 5 domains | Theoretical rigor, eradication of teleological jargon | [\`companion/glossary.md\`](companion/glossary.md) |
| **🧭 Study Guides & Decoders** | 8 Color equation decoders, 12 formal derivations | Mathematical fluency, Landauer dissipation bounds | [\`companion/study_guides.md\`](companion/study_guides.md) |
| **📚 Annotated Bibliography** | 14 Landmark primary papers (Mitchell, Landauer, Lenski) | Scientific literacy & historical provenance | [\`companion/bibliography.md\`](companion/bibliography.md) |
| **🔍 Student QA & Usability Audit** | 12th-grade usability report with browser screenshots | Real student feedback, DOM interaction telemetry | [\`QA/STUDENT_UX_REPORT.md\`](../QA/STUDENT_UX_REPORT.md) |`
  );

  // Insert Figure 2.1 in Section 2
  if (!content.includes('fig2_1_primitive_enzymes.svg')) {
    content = content.replace(
      /### 2\.3 The Evolutionary Milestone of Parity Logic/,
      `![Figure 2.1: The Three Primitive Catalytic Logic Gates vs. Composite XOR Logic](assets/diagrams/fig2_1_primitive_enzymes.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 2.1 — Primitive Enzymatic Logic vs. Composite XOR
> - **Visual Guide:** Panels A, B, and C depict the three physically primitive enzyme active sites: co-catalysis (\`AND\`), promiscuous substrate affinity (\`OR\`), and allosteric conformational inhibition (\`NOT\`). Panel D depicts the 3-gate composite network $(A \\lor B) \\land \\neg(A \\land B)$ required to compute XOR parity logic.
> - **Biophysical Reality:** Minsky and Papert (1969) proved that XOR is linearly non-separable: no single linear hyperplane can partition $(0,1)$ and $(1,0)$ from $(0,0)$ and $(1,1)$. In biochemistry, no single active site can extinguish its own catalysis only when saturated with both complementary ligands without distinct regulatory feedback.
> - **Digital Mapping:** In Siliquarium, the codon translation table contains opcodes for \`AND\`, \`OR\`, \`NOT\`, and \`BUF\`. There is no primitive \`XOR\` opcode in the genetic code. XOR logic must evolve as a composite multi-gate network topology.
> - **Core Principle:** *Evolution builds complex logic from simple physical primitives.* Parity detection is an emergent milestone of network topology, not an arbitrary primitive.

### 2.3 The Evolutionary Milestone of Parity Logic`
    );
  }

  // Replace Semester Evaluative Composition ASCII Box
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+SEMESTER EVALUATIVE COMPOSITION\s+│[\s\S]*?```/,
    `| Assessment Category | Weight | Target Modality & Deliverables | Focus Areas |
| :--- | :---: | :--- | :--- |
| **Formative Laboratory Notebooks** | **40%** | Labs 1–5 Telemetry Logs & Hypotheses | Chemiosmosis, Landauer power budgets, redox filtering |
| **Experimental Perturbation Project** | **25%** | Lab 4 God-Suite Environmental Stress | Thermal surge, extinction pulses, Shannon diversity $H$ |
| **Summative Computational Autopsy** | **25%** | Lab 5 Phylogenetic Lineage Reconstruction | LCA ancestry queries, Homoplasy Predicate $\\mathcal{H}(A,B,M)$ |
| **Socratic Seminar & Colloquium** | **10%** | Oral Defense & Theoretical Critique | Pattee's Epistemic Cut, Kimura drift, Lenski dynamics |`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated docs/PEDAGOGICAL_COMPANION_SUITE.md');
}

// 2. Update docs/PHASE_3_VISUALIZER_GUIDE.md
{
  const filePath = path.join(rootDir, 'docs', 'PHASE_3_VISUALIZER_GUIDE.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII box THE TWO OBSERVATIONAL LENSES
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+THE TWO OBSERVATIONAL LENSES\s+│[\s\S]*?```/,
    `![Figure 3.1: The Macroscope — Volumetric 3D Hydrothermal Caldera](assets/screenshots/01_overview_and_lattice_key.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.1 — The 3D Abyssal Macroscope
> - **Visual Guide:** The panoramic WebGL viewport renders the stacked hexagonal basalt terraces $(q, r, z=0)$, the central thermal hydrothermal chimney spires, and buoyant convective updrafts rising into the permeable aqueous fluid column.
> - **Biophysical Reality:** Benthic hydrothermal ecosystems exhibit extreme vertical and radial chemical stratification. Temperature, pH, and redox potential drop steeply as fluids mix with ambient abyssal ocean water.
> - **Digital Mapping:** Each pore is color-coded in real time according to its metabolic state and battery charge ($0\\text{--}100\\text{ tokens}$). Active autotrophs glow emerald green, while saturated spores detach and rise through the permeable water column.
> - **Core Principle:** *Spatial context drives macro-ecological dynamics.* Evolution is shaped by local geometric gradients, diffusion boundaries, and fluid advection.

![Figure 3.2: The Microscope — Real-Time Logic Workshop & Reticle Lock](assets/screenshots/03_selected_silicoid_and_microscope.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.2 — The In-Situ Circuit Microscope
> - **Visual Guide:** Clicking any living pore activates the holographic 3D reticle and expands the live \`PoreWorkshop\` inspector drawer on the right. The panel displays real-time logic gate toggles (\`AND\`, \`OR\`, \`NOT\`), active signal wires, current battery reserves, and the 60-bit decoded genome tape.
> - **Biophysical Reality:** Directly verifies Howard Pattee's Epistemic Cut: students observe the rate-independent symbolic genome tape resting safely on the library shelf, while rate-dependent CMOS logic gates toggle dynamically to process incoming vent pulses.
> - **Digital Mapping:** Dynamic Landauer power dissipation ($1\\text{ token per toggle}$) and basal membrane leakage are metered in real time. If battery reserves hit zero, the cell undergoes immediate lysis into mineral rubble.
> - **Core Principle:** *Observation without perturbation.* The microscope provides a non-invasive telemetry window into the living cell's internal state without altering its physical thermodynamics.`
  );

  // In Section 4 (Deep Zoom & In-Situ Circuits), embed Figure 3.3
  if (!content.includes('04_deep_zoom_and_insitu_circuit.png')) {
    content = content.replace(
      /## 4\. In-Situ 3D Logic Gate Inspection/,
      `## 4. In-Situ 3D Logic Gate Inspection

![Figure 3.3: In-Situ Nanoscale Logic Gate Inspection](assets/screenshots/04_deep_zoom_and_insitu_circuit.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.3 — Deep Zoom & Nanoscale Gate Visualization
> - **Visual Guide:** High-magnification close-up of an individual basalt pore, revealing the physical microchip layout of logic gates and conductive wire traces etched onto the stone floor.
> - **Biophysical Reality:** Demonstrates how intracellular enzyme netlists can be visualized directly within the spatial geology of the hydrothermal chimney.
> - **Digital Mapping:** Gate labels and binary states ($0/1$) are rendered directly on the 3D surface, giving students immediate spatial awareness of the organism's computational morphology.
> - **Core Principle:** *Form and function are spatially unified.* The physical architecture of the circuit defines its metabolic capabilities.`
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated docs/PHASE_3_VISUALIZER_GUIDE.md');
}

// 3. Update docs/PHASE_4_PALEONTOLOGY_GUIDE.md
{
  const filePath = path.join(rootDir, 'docs', 'PHASE_4_PALEONTOLOGY_GUIDE.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII box THE DIGITAL PALEONTOLOGY SUITE
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+THE DIGITAL PALEONTOLOGY SUITE\s+│[\s\S]*?```/,
    `![Figure 4.1: Canonical Network Motifs of Systems Biology](assets/diagrams/fig3_1_network_motifs.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.1 — Uri Alon Canonical Systems Biology Motifs
> - **Visual Guide:** Displays the four fundamental regulatory circuits discovered across living cells: the bistable SR latch (memory toggle), the 3-inverter repressilator (ring clock), the Coherent Type-1 Feed-Forward Loop (sign-sensitive persistence delay), and the Incoherent Type-1 Feed-Forward Loop (biphasic pulse generator).
> - **Biophysical Reality:** In *E. coli* and yeast, transcriptional networks utilize these precise subgraphs to filter noise, time cell-cycle events, and coordinate metabolic transitions.
> - **Digital Mapping:** Siliquarium's \`MotifScanner\` audits living pore workshops in real time, detecting these graph topologies using Weisfeiler-Lehman color refinement without altering simulation physics.
> - **Core Principle:** *Network motifs are the universal building blocks of living regulation.* Recurring circuits emerge repeatedly because they solve universal dynamical control problems.

![Figure 4.2: Weisfeiler-Lehman Graph Color Refinement Hashing](assets/diagrams/fig3_2_weisfeiler_lehman.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.2 — 1-WL Topological Graph Invariant Hashing
> - **Visual Guide:** Illustrates multi-round color refinement on directed circuit netlists. Initial gate opcodes (\`AND\`, \`NOT\`, \`OR\`) are iteratively hashed with sorted neighbor colors until the color histogram stabilizes into a canonical 64-bit fingerprint.
> - **Biophysical Reality:** Living regulatory networks vary widely in spatial placement and wiring permutations while performing identical logical functions. Canonical graph invariants allow researchers to group functionally identical circuits regardless of node labeling.
> - **Digital Mapping:** Siliquarium uses 1-WL hashing to classify evolved organisms into structural clades ($O(|V| + |E|)$ complexity), enabling instant phylogenetic tracking and diversity indexing ($H$).
> - **Core Principle:** *Isomorphic circuits share identical ecological function.* Structural graph theory provides the mathematical bridge between genotype and phenotype.`
  );

  // In Section 3 (Evolutionary Flight Recorder & Fossil Freezer), embed Figure 4.3
  if (!content.includes('fig4_2_lenski_and_phylogeny.svg')) {
    content = content.replace(
      /## 3\. The Evolutionary Flight Recorder & Counterfactual Autopsies/,
      `## 3. The Evolutionary Flight Recorder & Counterfactual Autopsies

![Figure 4.3: Lenski LTEE Hyperbolic Fitness Trajectories & Homology vs. Homoplasy](assets/diagrams/fig4_2_lenski_and_phylogeny.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.3 — Macro-Evolutionary Dynamics & Phylogenetic Proofs
> - **Visual Guide:** The left panel plots evolutionary fitness across 100,000 generations, showing the classic Lenski hyperbolic deceleration curve punctuated by the dramatic Citrate ($Cit^+$) innovation leap. The right panel diagrams the phylogenetic tree proving Homology (shared descent from a mutated ancestor) versus Homoplasy (independent convergent discovery in isolated clades).
> - **Biophysical Reality:** Richard Lenski's Long-Term Evolution Experiment with *E. coli* demonstrated that evolutionary adaptation follows predictable thermodynamic scaling laws while remaining open to rare, historical contingency.
> - **Digital Mapping:** Siliquarium's \`EvolutionaryFlightRecorder\` logs every birth event back to Generation 0, allowing students to compute exact Hamming distance trajectories and execute mathematical homoplasy proofs using the Least Common Ancestor (LCA) operator.
> - **Core Principle:** *Evolution is both historically contingent and physically constrained.* Deep time transforms random microscopic mutations into predictable macroscopic adaptations.`
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated docs/PHASE_4_PALEONTOLOGY_GUIDE.md');
}

// 4. Update docs/PHASE_5_PELAGIC_SPORES_GUIDE.md
{
  const filePath = path.join(rootDir, 'docs', 'PHASE_5_PELAGIC_SPORES_GUIDE.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII box THE MARINE DISPERSAL CYCLE
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+THE MARINE DISPERSAL CYCLE\s+│[\s\S]*?```/,
    `![Figure 5.1: 3D Pelagic Spore Dispersal & Caldera Colonization Dynamics](assets/diagrams/fig4_3_pelagic_spores.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 5.1 — 3D Marine Stratification & Pelagic Advection
> - **Visual Guide:** Cross-section of the 3D hydrothermal seafloor showing benthic rock pores at $z=0$, thermal convection updrafts rising through $z=1$, and horizontal pelagic fluid currents transporting dormant spore capsules across abyssal distances at $z=2$.
> - **Biophysical Reality:** Sessile marine organisms (corals, barnacles, vent tube worms) rely on broadcast spawning to escape local resource depletion and colonize distant geothermal vents across hostile oceanic trenches.
> - **Digital Mapping:** In Siliquarium, saturated cells ($E_{\\text{battery}} = 100$) launch daughter spores into the permeable water column (\`AQUEOUS_FLUID\`). Spores drift with discrete $O(1)$ fluid advection until binding an unoccupied rock pore or decaying.
> - **Core Principle:** *Dispersal rescues ecosystems from spatial gridlock.* The fluid column provides the transport medium that transforms isolated benthic pockets into a globally connected meta-population.`
  );

  // In God-Suite Perturbations section, embed screenshots
  if (!content.includes('05_god_suite_lab_controls.png')) {
    content = content.replace(
      /## 3\. Laboratory Controls: God-Suite Perturbations/,
      `## 3. Laboratory Controls: God-Suite Perturbations

![Figure 5.2: God-Suite Laboratory Perturbation Console](assets/screenshots/05_god_suite_lab_controls.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 5.2 — God-Suite Environmental Controls
> - **Visual Guide:** The interactive Lab flyout drawer provides real-time sliders for mutation rate ($p_{\\text{mut}}$), primordial soup density, simulation clock speed, and one-click shock perturbation triggers.
> - **Biophysical Reality:** Enables students to replicate ecological disturbance regimes (thermal spikes, toxic ocean anoxia, asteroid impacts) and observe how biodiversity collapses and recovers.
> - **Digital Mapping:** Sliders directly mutate global simulation parameters in the active Web Worker without interrupting the rendering pipeline.
> - **Core Principle:** *Dynamic perturbation reveals evolutionary resilience.* Stable ecosystems prove their adaptability only when tested against severe environmental shifts.

![Figure 5.3: Catastrophic Extinction Pulse & Thermal Surge Recovery](assets/screenshots/06_thermal_surge_and_extinction.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 5.3 — Extinction Shock & Secondary Succession
> - **Visual Guide:** Real-time visual aftermath of a catastrophic extinction pulse: 80% of benthic cells undergo immediate lysis, leaving scattered surviving refugia that rapidly re-seed the basalt floor via pelagic spores.
> - **Biophysical Reality:** Mass extinction events (Permian-Triassic, Cretaceous-Paleogene) wipe out dominant specialist clades, creating vacant ecological niches that drive explosive adaptive radiations.
> - **Digital Mapping:** Telemetry logs demonstrate a sharp drop in living cell count followed by an exponential rebound as opportunistic generalist lineages colonize the cleared substrate.
> - **Core Principle:** *Extinction is the catalyst of evolutionary innovation.* Vacant ecological space allows previously suppressed novel topologies to flourish.`
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated docs/PHASE_5_PELAGIC_SPORES_GUIDE.md');
}

// 5. Update QA/STUDENT_UX_REPORT.md
{
  const filePath = path.join(rootDir, 'QA', 'STUDENT_UX_REPORT.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII topology box
  content = content.replace(
    /```[\r\n\s]+SILIQUARIUM TESTBENCH TOPOLOGY[\s\S]*?```/,
    `![Figure 2.1: Siliquarium Testbench Surface & 3D Bathymetry](assets/screenshots/01_overview_and_lattice_key.png)

> [!NOTE]
> **Siliquarium Testbench Topology & HUD Architecture:** The browser UI displays the global telemetry header at the top (epoch ticks, living count, spore count, clade diversity $H$, total stored energy, and universal conservation $\\Delta E = 0.000$), the 3D WebGL seafloor viewport in the center, and the contextual inspection drawer on the right.`
  );

  // Replace ASCII table at line 407
  content = content.replace(
    /\+--+[\r\n\s]+\| ID \| Issue \/ Friction Point[\s\S]*?\+--+[\r\n]/,
    `| ID | Issue / Friction Point | Severity | Affected Component & Behavioral Manifestation |
| :---: | :--- | :---: | :--- |
| **T-1** | Disorienting Zoom Drift | **P1 (High)** | OrbitCamera zoom scales strictly toward \`(0,0,0)\` origin, pushing marginal cells off-screen. |
| **T-2** | Click Raycast Shielding | **P1 (High)** | Permeable aqueous cells ($z \\ge 1$) intercept mouse click rays, blocking benthic cell selection. |
| **T-3** | Deep-Zoom Unreadability | **P2 (Med)** | Camera min-distance limit and angle clipping prevent legible inspection of in-situ logic gates. |
| **T-4** | UI Drawer Collisions | **P2 (Med)** | Opening Lab Flyout drawer completely obscures bottom-left controls and top-left inspection bar. |
| **T-5** | Jarring Target Snap | **P3 (Low)** | Camera target snaps instantaneously without smooth ease-in interpolation, causing spatial disorientation. |`
  );

  // Replace ASCII table at line 523
  content = content.replace(
    /\+--+[\r\n\s]+\| Rec \| Recommendation[\s\S]*?\+--+[\r\n]/,
    `| Rec | Recommendation | Proposed Architecture | Severity | Implementation Target |
| :---: | :--- | :--- | :---: | :--- |
| **R-1** | Cursor-Centric Raycast Zoom | Zoom camera along ray toward mouse intersection point | **P1** | \`src/visualizers/OrbitCamera.ts\` |
| **R-2** | Click-Through Aqueous Pass | Ignore empty aqueous fluid cells ($z \\ge 1$) during click raycast | **P1** | \`src/visualizers/SeafloorRenderer3D.ts\` |
| **R-3** | In-Situ Billboard Scaling | Dynamic scale-up of 3D gate icons at steep angles and zoom | **P2** | \`src/visualizers/SeafloorRenderer3D.ts\` |
| **R-4** | Non-Overlapping HUD Layout | Dock Lab drawer as collapsible bottom tray or side tab | **P2** | \`src/ui/LabFlyout.ts\`, \`index.html\` |
| **R-5** | Smooth Cinematic Camera Lerp | Spherical slerp interpolation ($300\\text{ms}$) on reticle lock | **P3** | \`src/visualizers/OrbitCamera.ts\` |`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated QA/STUDENT_UX_REPORT.md');
}

// 6. Update THEORETICAL_MODEL.md
{
  const filePath = path.join(rootDir, 'THEORETICAL_MODEL.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII CAD vs Autopoiesis
  content = content.replace(
    /```[\r\n\s]+BOOLEAN-GA \(Tracks 1–3\)[\s\S]*?```/,
    `| Dimension | BooleanGA (Tracks 1–3) | Siliquarium (Autopoietic Ecosystem) |
| :--- | :--- | :--- |
| **Philosophical Paradigm** | Heteropoietic Engineering CAD | Autopoietic Self-Creation & Maintenance |
| **Fitness Function** | Target Truth Table (ALU, Hack CPU) | Zero Truth Table (Pure Thermodynamic Persistence) |
| **Supervision** | Omniscient External Supervisor | Blind Physical Laws & Local Energy Influx |
| **Evaluation Method** | Batch Generational Benchmark Testing | Continuous Real-Time Spatial Grid Dynamics |
| **Death & Termination** | Pruned by Genetic Algorithm Selection | Metabolic Starvation ($E_{\\text{battery}} = 0$) |`
  );

  // Replace ASCII Deep-Sea Hydrothermal Vent Matrix
  content = content.replace(
    /```[\r\n\s]+DEEP-SEA HYDROTHERMAL VENT MATRIX[\s\S]*?```/,
    `![Figure 1.2: Deep-Sea Hydrothermal Vent Matrix & Inorganic Mineral Walls](assets/diagrams/fig1_2_hydrothermal_chimney.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 1.2 — The Deep-Sea Hydrothermal Vent Matrix
> - **Visual Guide:** Shows the geological cross-section of an alkaline hydrothermal chimney with mineral channels separating warm alkaline fluid ($pH \\approx 10$) from cold acidic ocean water ($pH \\approx 5.5$).
> - **Biophysical Reality:** Inorganic porous basalt micro-cavities acted as nature's first cell walls, maintaining steep chemical and electrical gradients long before lipid membranes evolved.
> - **Digital Mapping:** In Siliquarium, the 2D lattice of rocky pores adjacent to the hydrothermal nozzle serves as the master power plant, injecting rhythmic bit pulses into living circuits.
> - **Core Principle:** *The Earth provided the energetic and structural scaffolding for the origin of life.*`
  );

  // Replace ASCII Three-Stage Evolutionary Ladder
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+STAGE 1: Primitive Chemical Catalysis[\s\S]*?```/,
    `| Evolutionary Stage | Circuit Architecture | Biological Cognate | Emergent Capability |
| :--- | :--- | :--- | :--- |
| **Stage 1: Primitive Catalysis** | Combinational 1–2 Gate Netlists (\`AND\`, \`OR\`, \`NOT\`) | Co-catalytic enzymes & allosteric repressors | Feeds only when complementary substrates arrive synchronously |
| **Stage 2: Emergence of Memory** | Directed Feedback Loops (Sequential Latches) | Phosphorylation cascades & bistable genetic switches | Preserves transient substrate pulses across time delays |
| **Stage 3: Autonomous Pacemakers** | Ring Oscillators (Odd-cycle inverters) | Circadian clocks & mitochondrial pacemakers | Generates internal metabolic pacing independent of vent fluctuations |`
  );

  // Replace ASCII Single Rock Pore
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+A SINGLE ROCK PORE\s+│[\s\S]*?```/,
    `![Figure 1.3: The Anatomy of a Rock Pore: Safe, Workshop, and Battery](assets/diagrams/fig1_3_epistemic_cut.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 1.3 — The Anatomy of a Living Rock Pore
> - **Visual Guide:** Diagram of the three physical compartments of an individual rock pore: The Safe (inert 1D genome tape), The Workshop (active 2D CMOS logic netlist), and The Battery (mineral capacitor).
> - **Biophysical Reality:** Enforces Howard Pattee's Epistemic Cut: separating rate-independent genetic instructions from rate-dependent continuous metabolic dynamics.
> - **Digital Mapping:** The 60-bit genome tape conducts no power during life. Dynamic gate toggles burn Landauer tokens from the battery. When the battery reaches 100 tokens, the tape is copied into a neighbor pore.
> - **Core Principle:** *Genotype and phenotype must occupy distinct operational domains.*`
  );

  // Replace ASCII Life Cycle flow
  content = content.replace(
    /```[\r\n\s]+1\. BIRTH \(Translation\)[\s\S]*?```/,
    `| Life Cycle Phase | Physical Process | Energetic Cost / Yield | Substrate Physics Rule |
| :--- | :--- | :--- | :--- |
| **1. Translation (Birth)** | Substrate reads 1D tape in Safe $\\to$ instantiates 2D netlist in Workshop | 0 tokens (passive crystallization) | Safe is locked; tape remains inert during life |
| **2. Metabolism (Living)** | Vent pulses toggle logic gates; resonant circuits capture energy | Toggle: $-1$ token; Influx: $+5$ tokens | Gates burn Landauer switching energy; net charge stored in battery |
| **3a. Starvation (Death)** | Battery hits 0 tokens $\\to$ circuit undergoes irreversible lysis | Complete discharge | Netlist dissolves; pore reverts to vacant mineral substrate |
| **3b. Division (Fission)** | Battery hits 100 tokens $\\to$ blind photocopy of tape to neighbor pore | Cost: $-50$ tokens ($50$ to parent, $50$ to child) | Tape copied with unguided point mutation error rate ($p=0.001$) |`
  );

  // Replace ASCII Sessile Warfare
  content = content.replace(
    /```[\r\n\s]+CELL A \(The Producer\)[\s\S]*?```/,
    `| Interaction Type | Circuit Mechanism | Ecological Role | Energetic Dynamic |
| :--- | :--- | :--- | :--- |
| **Producer (Autotroph)** | Wires directly to vent stream; extracts clean power | Primary producer | Synthesizes energy tokens from abiotic waveforms |
| **Parasite (Wiretap)** | Extends input pin across rock wall into neighbor's power rail | Kleptoparasite | Steals energy without investing in filter gates; increases host load |
| **Predator (Jammer)** | Emits chaotic high-frequency bit bursts into neighbor pore | Lytic predator | Causes neighbor timing loops to glitch, starve, and spill stored tokens |
| **Mutualist (Syntrophy)** | Exchanges complementary metabolic waste products across boundary | Symbiont | Mutual cross-feeding increases collective survival under nutrient shifts |`
  );

  // Replace ASCII Thermodynamic Conservation
  content = content.replace(
    /```[\r\n\s]+THE MASTER VENT GENERATOR \(Primary Energy Source\)[\s\S]*?```/,
    `![Figure 2.3: Global Thermodynamic Energy Flow & Landauer Dissipation](assets/diagrams/fig2_3_landauer_dissipation.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 2.3 — Conservation of Energy & Thermodynamic Limits
> - **Visual Guide:** Tracks energy flux from the primary hydrothermal vent generator through individual pore batteries, gate switching dissipation, and waste heat loss into the abyssal ocean sink.
> - **Biophysical Reality:** Rolf Landauer (1961) proved that erasing or switching 1 bit of information dissipates a minimum energy $Q \\ge k_B T \\ln 2$. The first law of thermodynamics mandates that energy is conserved across all transitions ($\\Delta E_{\\text{universe}} = 0$).
> - **Digital Mapping:** In Siliquarium, every gate toggle incurs a mandatory Landauer cost of 1 token. Total energy injected by the vent exactly equals energy stored plus energy dissipated.
> - **Core Principle:** *Computation is an irreversible thermodynamic physical process.* Life cannot escape the laws of thermodynamics.`
  );

  // Replace ASCII Simulation Kernel vs Paleontologist
  content = content.replace(
    /```[\r\n\s]+SIMULATION KERNEL \(Unbiased Physical Grid\)[\s\S]*?```/,
    `![Figure 4.2: The Digital Paleontologist: Unbiased Real-Time Telemetry](assets/diagrams/fig3_2_weisfeiler_lehman.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.2 — Passive Telemetry & Motif Recognition
> - **Visual Guide:** Illustrates the architectural firewall between the unbiased physical simulation kernel (pores, vent pulses, natural selection) and the external Digital Paleontologist observer.
> - **Biophysical Reality:** Evolutionary biology requires purely descriptive, non-invasive measurement tools that do not perturb the living system being observed.
> - **Digital Mapping:** The Paleontologist scans evolved circuit topologies using Weisfeiler-Lehman graph hashing. When a landmark motif (latch, ring clock, adder) is detected, it logs an alert without granting bonus tokens or altering fitness.
> - **Core Principle:** *The observer does not guide the course of evolution.* Life evolves blindly; science measures passively.`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated THEORETICAL_MODEL.md');
}

// 7. Update docs/DOCUMENTATION_DESIGN_PRINCIPLES.md
{
  const filePath = path.join(rootDir, 'docs', 'DOCUMENTATION_DESIGN_PRINCIPLES.md');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace ASCII Palette Box
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+DEEP ABYSSAL OBSIDIAN BASE[\s\S]*?```/,
    `| Semantic Container | CSS Class & Glow Gradient | Border Specification | Primary Curricular Use |
| :--- | :--- | :--- | :--- |
| **Biophysical Reality** | \`.card-bio\` (135° Emerald Glow) | \`border: 1px solid rgba(16, 185, 129, 0.40)\` | Peter Mitchell chemiosmosis, vents, natural selection |
| **Digital Architecture** | \`.card-digital\` (135° Cyan Glow) | \`border: 1px solid rgba(6, 182, 212, 0.40)\` | CMOS netlists, logic gates, Landauer token costs |
| **Sacred Analogy** | \`.card-margin\` (135° Amber Glow) | \`border: 1px solid rgba(245, 158, 11, 0.35)\` | Everyday conceptual anchors, apartment analogies |
| **Paleontological Fossil** | \`.card-experiment\` (135° Purple Glow) | \`border: 1px solid rgba(168, 85, 247, 0.40)\` | Lenski LTEE, Weisfeiler-Lehman hashes, frozen clades |`
  );

  // Replace ASCII Layout Hierarchy
  content = content.replace(
    /```[\r\n\s]+┌─+┐[\r\n\s]+│\s+1\. MASTER HEADER & INTERACTIVE BREADCRUMBS[\s\S]*?```/,
    `| Document Section | Visual Treatment | Interactive Functionality |
| :--- | :--- | :--- |
| **1. Master Header** | Glassmorphic sticky bar with dynamic breadcrumbs | Quick jump to portal hub and volume root |
| **2. Title Hero** | High-contrast gradient emblem box + typography | Displays chapter, subtitles, and cognitive scope |
| **3. Pedagogical Compass** | Horizontal badge strip with reading time | Real-time progress orientation and module roster |
| **4. Orientation Prologue** | \`blockquote\` with deep cyan vertical border | Explains existential stakes and foundational questions |
| **5. Modular Chapter Grid** | Responsive 2-column card layout | Visual subchapters, feature pills, direct action links |
| **6. Flagship Figures** | Glowing gradient borders + 4-pillar analysis cards | Full SVG diagrams and high-res browser screenshots |
| **7. Academic Citations** | Pop-in \`CITED IN TEXT 🎯\` beacon badge | Smooth jump to bibliography with pulse animation |`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated docs/DOCUMENTATION_DESIGN_PRINCIPLES.md');
}

console.log('All documentation updates complete!');
