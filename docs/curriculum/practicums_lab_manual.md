# 🧪 Practicums 1–5: Hands-On Student Laboratory Manual
*Interactive In-Silico Biophysics, Paleontology Autopsies, and Formative Senior Assessments*

---

## Laboratory Overview & Classroom Instructions

This laboratory manual provides five rigorous, step-by-step practicums using the interactive Siliquarium application. Each practicum is designed for a standard 90-minute advanced high school block period or a 3-hour undergraduate laboratory session.

### Software Access & Prerequisites
- **Application URL:** Open `docs/index.html` or run the local development server via `npm run dev` (`http://localhost:3000`).
- **Zero Installation Mandate:** Siliquarium runs 100% in any modern web browser with WebGL enabled.
- **Required Hardware:** Standard laptop or desktop computer with mouse or trackpad.

---

## 🔬 Lab 1: Exploring the Hydrothermal Seafloor & Circuit Microscope

### 1. Learning Objectives
1. Navigate a 3D abyssal seamount and differentiate between basalt rock substrates (`PoreMedium.ROCK_SUBSTRATE`) and the permeable water column (`PoreMedium.AQUEOUS_FLUID`).
2. Operate the Circuit Microscope to inspect real-time logic gate toggles, pulsing electron wires, and battery token counters.
3. Validate Howard Pattee's Epistemic Cut by verifying that rate-independent genome tapes in the Safe do not mutate during rate-dependent metabolic gate switching in the Workshop.

### 2. Theoretical Pre-Lab Preparation
Review Unit 1, Section 5. In your notebook, define Pattee's **Epistemic Cut** and explain why living systems must separate rate-independent symbolic hereditary code from rate-dependent physical metabolic execution.

### 3. Step-by-Step Laboratory Procedure
1. Launch Siliquarium. In the top navigation header, verify that the simulation initialized with Seed `#42`.
2. **3D Orbit Camera Practice:**
   - **Rotate:** Left-click and drag to orbit around the central hydrothermal caldera.
   - **Pan:** Right-click and drag (or two-finger drag) to move across basalt shelves and volcanic ridges.
   - **Zoom:** Scroll wheel to zoom from a bird's-eye view of the caldera down to an individual hexagonal pore.
3. Locate the central hydrothermal caldera nozzle at coordinates $(0, 0, 0)$. Notice the glowing thermal convection plume rising vertically into the water column.
4. Click on an occupied hexagonal pore immediately adjacent to the vent nozzle (e.g., coordinates $(1, 0, 0)$ or $(0, 1, 0)$).
5. Observe the **Electric Neon Targeting Reticle** lock onto the selected pore.
6. Open the **Circuit Microscope** panel on the right side of the screen. Identify the three core anatomical compartments:
   - **The Genome Safe Ribbon:** The 60-bit inert tape displayed across the top.
   - **The Active Workshop Netlist:** The physical logic gates (`AND`, `OR`, `NOT`, `BUF`) and pulsing signal wires.
   - **The Battery Gauge:** Real-time token counter ($0..100$).
7. Click the **Pause** button (`❚❚`) on the bottom transport bar. Use the **Step Forward** button (`Step ►`) to advance the simulation clock cycle by clock cycle ($\pm 1$ tick).
8. Observe how gate pins light up when vent pulses enter the pore, and track whether the battery charges or discharges.

### 4. Data Collection Table
Select three distinct occupied pores at varying distances from the vent nozzle and record their physiological metrics:

| Specimen Pore $(q, r, z)$ | Distance from Nozzle | Active Gate Types | Battery Level ($E$) | Matter Reserve ($M$) | Generation | Age (Ticks) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Specimen 1 | | | | | | |
| Specimen 2 | | | | | | |
| Specimen 3 | | | | | | |

### 5. Post-Lab Synthesis Questions
1. Compare Specimen 1 (near vent) with Specimen 3 (far from vent). How does distance from the hydrothermal nozzle affect energy accumulation and division frequency?
2. Did any bits on the 60-bit genome tape change while the cell was toggling gates? Why is this separation essential for evolutionary stability?

---

## ⚡ Lab 2: Observing Landauer Power Dissipation & Metabolic Starvation

### 1. Learning Objectives
1. Quantify dynamic Landauer switching dissipation ($1$ token per gate toggle) versus basal maintenance decay ($1$ token every 10 ticks).
2. Demonstrate that computation is not free: show that excessive, uncoordinated gate switching causes rapid metabolic starvation.
3. Verify the First Law of Thermodynamics ($\Delta E_{\text{universe}} = 0.000$) using the Thermodynamic Ledger.

### 2. Theoretical Pre-Lab Preparation
Review Unit 2, Section 5. Write the algebraic formula for Rolf Landauer's thermodynamic bound of information erasure. Explain why an organism cannot evolve an infinitely large brain in a resource-limited environment.

### 3. Step-by-Step Laboratory Procedure
1. Reset the simulation. Open the **Lab Flyout Drawer** by clicking the gear icon (`⚙️`) in the top navigation bar.
2. In the Lab Flyout, set the **Primordial Soup Density** slider to `10%` and click **"Seed Soup"**.
3. Pause the simulation at Tick 1. Click through several newly seeded pores until you find a cell with 3 or more active logic gates.
4. Note its starting battery level (typically $50$ or $60$ tokens).
5. Advance the simulation tick-by-tick for 15 ticks. For each tick, record:
   - Vent Stream Inputs ($A$, $B$, $T$)
   - Number of logic gates that switched state ($0 \to 1$ or $1 \to 0$)
   - Catalytic yield added to battery
   - Net battery change
6. Identify an uncoordinated cell that fails to capture catalytic yield. Watch its battery steadily drain toward zero.
7. Observe the moment of **lysis**: when the battery reaches $0$, note how the active cell transforms into a **Carcass Pore** (`PoreState.CARCASS`), retaining unspent tokens and mineral mass for neighboring scavengers.
8. Inspect the **Thermodynamic Ledger HUD badge** at the top right:
   $$\Delta E_{\text{universe}} = \sum E_{\text{in}} - \sum E_{\text{stored}} - \sum E_{\text{dissipated}} = 0.000$$

### 4. Data Collection Table

| Tick | Stream A | Stream B | Gate Switches | Landauer Burn ($E_L$) | Catalytic Yield ($E_C$) | Basal Leak ($E_{\text{leak}}$) | Net Battery ($E$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

### 5. Post-Lab Synthesis Questions
1. If an organism mutates 4 additional `BUF` (buffer) gates that toggle constantly without contributing to catalytic yield, what is the thermodynamic consequence on its reproductive fitness?
2. How does the persistence of carcass detritus create an ecological opportunity for detritivores?

---

## 🌊 Lab 3: Tracking Phenotypic Adaptation to Vent Chemistry

### 1. Learning Objectives
1. Observe natural selection favoring catalytic `AND` enzymes that resonate with complementary vent pulses.
2. Investigate the selective advantage of allosteric inhibitor `NOT` gates during periodic toxin ($T$) pulses.
3. Map decoded 6-bit codons from the genome tape to physical circuit netlists using the Codon Table.

### 2. Theoretical Pre-Lab Preparation
Review Unit 2, Section 2. Explain why a cell with genotype expressing `(A AND B) AND (NOT T)` will outcompete a simple `A AND B` cell in a toxic vent regime.

### 3. Step-by-Step Laboratory Procedure
1. Initialize a fresh simulation with World Seed `#101` and Soup Density `25%`.
2. Let the simulation run uninhibited at normal speed for $500$ ticks.
3. Observe the HUD telemetry ticker as the vent cycles through its multi-scale rhythms:
   - High-flow fuel bursts (Streams $A=1, B=1$)
   - Low-flow resting states
   - Acidic poison bursts (Toxin $T=1$, corroding unshielded cells by $-5$ tokens)
4. At Tick 500, pause the simulation. Inspect the most densely populated cluster of cells around the caldera.
5. Select the oldest living cell (highest Age metric in HUD).
6. In the Circuit Microscope, translate its 60-bit genome tape into codons using [`CodonTable.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/codons/CodonTable.ts):
   - Group the 60 bits into ten 6-bit codons: `[Bits 0-5]`, `[Bits 6-11]`, ..., `[Bits 54-59]`.
   - Identify whether the cell possesses `PORIN_TOXIN_T` coupled to an inhibitory `GATE_NOT`.
7. Compare this adapted specimen with a peripheral cell that died or has a low battery.

### 4. Genome Codon Translation Worksheet

| Codon Index | 6-Bit Bitstring | Codon Name | Biophysical Functional Class | Active in Workshop? |
| :---: | :---: | :---: | :---: | :---: |
| 0 | | | | |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

### 5. Post-Lab Synthesis Questions
1. Why did the toxin pulses purge unshielded organisms even if their `AND` gates were highly efficient?
2. Did the surviving organisms "know" the toxin was coming, or did natural selection act as a blind sieve? Explain using the concept of autopoiesis.

---

## 🌋 Lab 4: God-Suite Perturbations: Thermal Surges, Extinction Pulses, & Lineage Recovery

### 1. Learning Objectives
1. Apply ecological disturbances using the interactive God-Suite controls in [`LabFlyout.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/LabFlyout.ts).
2. Measure the impact of catastrophic local extinction pulses on the Shannon Diversity Index ($H$).
3. Document secondary ecological succession and trans-ridge colonization via pelagic spore dispersal.

### 2. Theoretical Pre-Lab Preparation
Review Unit 4, Section 6. Define the Shannon Diversity Index ($H$). What happens to $H$ when a single dominant clade monopolizes an entire habitat? What happens to $H$ immediately after an extinction pulse?

### 3. Step-by-Step Laboratory Procedure
1. Run a simulation until Tick 1,000, allowing a dominant clade to expand across the lower benthic terrace.
2. Note the baseline metrics in the HUD:
   - Living Cells Count ($N_{\text{living}}$)
   - Active Clades Count ($K$)
   - Shannon Diversity Index ($H$)
   - Maximum Generation
3. Open the Lab Flyout (`⚙️`). Locate the **"God-Suite Interventions"** section.
4. **Thermal Surge Pulse:**
   - Click **"🔥 Thermal Surge Pulse"** (+200 tokens injected into the central plume).
   - Observe the immediate metabolic boom: cells adjacent to the caldera rapidly hit $100$ tokens and trigger a wave of binary fissions.
5. **Catastrophic Extinction Pulse:**
   - Select the center of the dominant monoculture colony.
   - Click **"💥 Local Extinction Pulse"** (clearing living cells in radius $r=2$).
   - Watch the selected quadrant collapse into carcass rubble.
6. Record the immediate collapse of $H$ and $N_{\text{living}}$.
7. Do not reset. Let the simulation run for $300$ ticks and watch **secondary ecological succession**:
   - Observe whether dormant spores drifting in the water column land on the cleared rock cavities.
   - Note which clade re-colonizes the empty territory.

### 4. Disturbance & Succession Log

| Experimental Phase | Tick | Living Count | Clades Count ($K$) | Shannon Diversity ($H$) | Dominant Clade ID |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Pre-Disturbance Baseline | | | | | |
| Post-Thermal Surge (+50 ticks) | | | | | |
| Post-Extinction Pulse (+10 ticks) | | | | | |
| Succession Recovery (+200 ticks)| | | | | |

### 5. Post-Lab Synthesis Questions
1. Did the post-extinction habitat return to the exact same genetic state as before the pulse? Why or why not?
2. How did pelagic spores drifting in the permeable fluid column prevent total extinction of the lineage?

---

## 🦕 Lab 5: Lenski Long-Term Evolution Experiment (LTEE) & Evolutionary Flight Recorder Autopsy

### 1. Learning Objectives
1. Conduct a digital analogue of Richard Lenski's Long-Term Evolution Experiment (LTEE).
2. Trace an organism's ancestral lineage back to Generation 0 using [`EvolutionaryFlightRecorder.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/EvolutionaryFlightRecorder.ts).
3. Perform a counterfactual single-bit autopsy using [`FossilFreezer.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/FossilFreezer.ts) to isolate the exact point mutation that assembled a novel network motif.
4. Mathematically prove whether two lineages sharing a network motif represent **Homology** or **Homoplasy / Convergent Evolution**.

### 2. Theoretical Pre-Lab Preparation
Review Unit 4, Section 5. Review Richard Lenski's discovery of the $Cit^+$ trait in *E. coli* at Generation 31,500. Explain why frozen fossil ledgers are essential for proving historical contingency.

### 3. Step-by-Step Laboratory Procedure
1. Initialize the simulation with World Seed `#2026` and let it run to Tick 2,000.
2. Monitor the **Paleontology HUD Alerts**. When a milestone alert triggers (e.g., *"BISTABLE MEMORY LATCH FORMED"* or *"RING OSCILLATOR DISCOVERED"*), immediately pause the simulation.
3. Click the notification alert or the glowing neon pore on the seamount.
4. Open the **Milestone Modal / Evolutionary Autopsy Inspector**:
   - Inspect the **Solution-Space Hamming Trajectory** graph:
     $$d_H(\text{Lineage}) = \sum_{i=0}^{k-1} \text{popcount}(G_i \oplus G_{i+1})$$
   - Observe the color-coded edges:
     - **Blue Edges:** Kimura Neutral Drift ($d_H > 0$, fitness invariant).
     - **Green Edges:** Positive Selection (upward jump in metabolic efficiency).
     - **Yellow Edges:** Duplication / Intron Expansion.
5. In the **Single-Bit Autopsy Panel**, identify:
   - Parent Tape (Generation $N-1$)
   - Child Tape (Generation $N$)
   - The exact inverted bit index ($0..59$)
   - The codon change (e.g., `INTRON_SILENT` $\to$ `GATE_NOT`)
6. **Convergent Evolution Audit:**
   - Scan the seamount for a second cell in a different clade exhibiting the same motif.
   - Run the automated Least Common Ancestor (LCA) query.
   - Check the audit verdict: does it declare **HOMOLOGY** or **HOMOPLASY**?

### 4. Evolutionary Autopsy Record Sheet

```
Specimen ID: ______________________      Milestone Discovered: ______________________
Generation:  ______________________      Pore Coordinate:      ( ____, ____, ____ )

1. ANCESTRAL HAMMING TRAJECTORY:
   Total Ancestral Generations: _____
   Cumulative Hamming Distance Traversals (dH): _____ bits
   Number of Neutral Drift Steps (Blue Edges):  _____

2. COUNTERFACTUAL SINGLE-BIT AUTOPSY:
   Bit Index Inverted: _______ (Bit position 0 to 59)
   Codon Index:        _______ (Codon 0 to 9)
   Parent Codon:       [ _ _ _ _ _ _ ] ──► Translation: ______________________
   Child Codon:        [ _ _ _ _ _ _ ] ──► Translation: ______________________
   Biophysical Consequence of Mutation: _________________________________________

3. HOMOLOGY VS. HOMOPLASY AUDIT:
   Comparison Specimen ID:   ______________________
   Least Common Ancestor ID: ______________________ (Generation: _____)
   Did LCA possess the motif? [ YES / NO ]
   FINAL VERDICT:            [ HOMOLOGY / HOMOPLASY (CONVERGENT EVOLUTION) ]
```

### 5. Post-Lab Synthesis Questions
1. How does the existence of neutral introns facilitate the discovery of complex motifs like the bistable latch or half-adder?
2. If your audit returned a verdict of Homoplasy, explain how two completely isolated lineages on opposite sides of the seamount converged on the exact same circuit wiring.

---

## 9. Socratic Discussion Seminar Prompts

### Seminar 1: The Physics of Information & The Epistemic Cut
> *"Erwin Schrödinger famously stated in 1944 that living organisms feed on 'negative entropy'—they preserve their internal order by continually dissipating entropy into their surroundings. Howard Pattee later argued that life is unique in physical reality because it is governed by symbolic codes. If a genetic code is made of physical matter, why must it be treated as rate-independent? Could life exist without an Epistemic Cut?"*

### Seminar 2: Is Evolution an Optimization Algorithm?
> *"In computer science, algorithms are evaluated by how quickly they converge to a global optimum. In natural evolution, is there an optimum? If an organism evolves an extraordinarily complex logic network that burns 50 tokens per tick, why might natural selection favor a 'stupid' organism consisting of a single AND gate? What does this teach us about the difference between engineering and biology?"*

### Seminar 3: Historical Contingency vs. Determinism
> *"Stephen Jay Gould famously asked: if we could 'replay the tape of life' from the beginning, would anything look the same? In Richard Lenski's LTEE, only one out of twelve lineages evolved citrate metabolism, requiring a specific pre-adaptation. In Siliquarium, if we run two simulations with the exact same starting seed, but introduce a single bit-flip perturbation at Tick 100, what will happen to the macro-evolutionary trajectory? Is convergence inevitable, or is history hostage to contingency?"*

---

## 10. Formative Diagnostic Assessment Suite

### Section A: Conceptual & Biophysical Foundations (Multiple Choice)

**1.** Why are microscopic rock pores in alkaline hydrothermal vents considered superior to open surface waters for prebiotic abiogenesis?  
A) Surface waters were too cold for chemical reactions to occur.  
B) Rock pores prevent the Dilution Catastrophe by concentrating catalytic reactants in microscopic volumes.  
C) Surface waters completely lacked hydrogen and carbon dioxide.  
D) Rock pores provided active lipid membranes before enzymes evolved.  
*Answer:* **B**. *Rationale:* The Dilution Catastrophe in open water lowers reactant concentrations toward zero. Inorganic basalt cavities act as nature's first compartments.

**2.** According to Rolf Landauer and modern thermodynamics of computation, why must a living digital cell pay an energy penalty when switching a logic gate?  
A) Gate transitions change electrical potential, dissipating a minimum of $k_B T \ln 2$ heat into the thermal sink.  
B) The simulation engine penalizes complex organisms to keep frame rates high.  
C) Logic gates physically degrade and must be rebuilt each tick.  
D) Energy is only consumed when an arithmetic addition is performed.  
*Answer:* **A**. *Rationale:* Landauer's principle proves that information erasure and physical switching incur an irreversible entropic dissipation of at least $k_B T \ln 2$.

**3.** In the Siliquarium codon table, what biological regulatory mechanism is represented by a `GATE_NOT` logic gate?  
A) Co-substrate redox catalysis.  
B) An allosteric competitive inhibitor or transcriptional repressor protein.  
C) A passive ion channel allowing unregulated nutrient entry.  
D) A cleavage furrow splitting the cell membrane.  
*Answer:* **B**. *Rationale:* In molecular biology, a repressor inverts transcription: when the repressor is present ($1$), gene expression is blocked ($0$).

**4.** Two organisms on opposite sides of the seamount possess isomorphic Bistable Memory Latches with identical Weisfeiler-Lehman hashes. The Evolutionary Flight Recorder traces their ancestry to a Least Common Ancestor that possessed only combinational `AND` gates. What is the formal evolutionary classification of this shared trait?  
A) Homology  
B) Synapomorphy  
C) Homoplasy (Convergent Evolution)  
D) Artificial Selection  
*Answer:* **C**. *Rationale:* Because the Least Common Ancestor lacked the motif, both lineages discovered the circuit independently, which defines homoplasy / convergent evolution.

---

### Section B: Quantitative Free-Response Problems

#### Problem 1: Metabolic Energy Budgeting & Starvation Thresholds
A protocell in Pore $(2, -1, 0)$ contains 3 active logic gates:
- Gate 1: `GATE_AND` wired to Stream A and Stream B (Reaction Yield: $+3$ tokens).
- Gate 2: `GATE_BUF` wired to Gate 1 output.
- Gate 3: `GATE_NOT` wired to Gate 2 output.

The hydrothermal vent pulses Stream A and Stream B synchronously ($A=1, B=1$) once every 5 ticks. On all other ticks, $A=0$ and $B=0$. Toxin $T$ is inactive ($T=0$).
- Toggle switching cost: $\kappa = 1$ token per gate transition.
- Basal maintenance leak: $E_{\text{leak}} = 1$ token dissipated every 10 ticks.
- Starting battery: $E_0 = 40$ tokens. Maximum capacity: $E_{\text{cap}} = 100$ tokens.

*Questions:*
1. Calculate the total Landauer toggle energy dissipated by this circuit over a complete 5-tick vent cycle (Ticks 0 through 4).
2. Calculate the net battery balance $\Delta E_{\text{cycle}}$ across the 5-tick cycle.
3. Will this organism reach the division threshold ($100$ tokens), maintain homeostasis, or starve to death? Show all calculations.

*Worked Solution:*
- **Tick 0 (Pulse arrives: $A=1, B=1$):**
  - Gate 1 switches $0 \to 1$ ($1$ toggle). Yields $+3$ tokens.
  - Gate 2 switches $0 \to 1$ ($1$ toggle).
  - Gate 3 switches $1 \to 0$ ($1$ toggle).
  - Landauer burn $= 3$ tokens. Yield $= +3$ tokens. Net change $= 0$.
- **Tick 1 (Pulse drops: $A=0, B=0$):**
  - Gate 1 switches $1 \to 0$ ($1$ toggle). Yield $= 0$.
  - Gate 2 switches $1 \to 0$ ($1$ toggle).
  - Gate 3 switches $0 \to 1$ ($1$ toggle).
  - Landauer burn $= 3$ tokens. Yield $= 0$. Net change $= -3$ tokens.
- **Ticks 2, 3, 4 (Idle ticks: inputs remain $0$):**
  - Gates remain static ($0$ toggles). Landauer burn $= 0$.
- **Basal leak:** $1$ token every 10 ticks $\implies 0.5$ tokens / 5 ticks.
- **Cycle Net Balance:**
  $$\Delta E_{\text{cycle}} = \Delta E_{\text{yield}} - E_{\text{Landauer}} - E_{\text{leak}} = +3 - (3 + 3) - 0.5 = -3.5 \text{ tokens per 5 ticks}$$
- **Conclusion:** The organism operates at a persistent net deficit of $-3.5$ tokens every 5 ticks. It will exhaust its 40-token battery within approximately $57$ ticks and undergo starvation lysis!

---

#### Problem 2: Weisfeiler-Lehman Topological Invariant Calculation
Given a 3-gate circuit:
- Node 1: `GATE_AND`
- Node 2: `GATE_NOT`
- Node 3: `GATE_OR`
- Directed wires: $(1 \to 2)$, $(2 \to 3)$, $(3 \to 1)$ (A directed 3-node loop).

1. Perform Round 0 color initialization.
2. Perform Round 1 Weisfeiler-Lehman color refinement, showing the neighbor multiset and signature string for each node.
3. Explain why this invariant remains identical even if Node 1 and Node 3 swap positions in the physical array.

*Worked Solution:*
- **Round 0 Colors:** $c_1^{(0)} = \text{AND}$, $c_2^{(0)} = \text{NOT}$, $c_3^{(0)} = \text{OR}$.
- **Directed Neighborhoods:**
  - $\mathcal{N}(1) = \{2\}$, $\mathcal{N}(2) = \{3\}$, $\mathcal{N}(3) = \{1\}$.
- **Round 1 Signatures:**
  - Node 1: $\text{AND}:[\text{NOT}]$
  - Node 2: $\text{NOT}:[\text{OR}]$
  - Node 3: $\text{OR}:[\text{AND}]$
- Applying deterministic hash produces updated color multiset.
- **Permutation Invariance:** If the gates are re-indexed such that Node 3 is placed first, the neighbor multiset is lexicographically sorted prior to hashing (`SORT(...)`). The resulting collection of color hashes across the graph remains identical, yielding the exact same canonical invariant hash.
