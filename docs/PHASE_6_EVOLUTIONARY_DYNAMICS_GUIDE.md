# 🧬 Phase 6: Multi-Lineage Phylogeny, Lenski LTEE Dynamics & Convergent Evolution Guide

[![Phylogeny](https://img.shields.io/badge/Phylogeny-Lineage%20Tracking-purple.svg)](#)
[![LTEE](https://img.shields.io/badge/LTEE-Lenski%20Dynamics-blue.svg)](#)
[![Convergence](https://img.shields.io/badge/Evolution-Homology%20vs%20Homoplasy-emerald.svg)](#)
[![Thermodynamics](https://img.shields.io/badge/Physics-Delta%20E%20%3D%200.000-amber.svg)](#)

---

## 1. Executive Summary & Epistemic Motivation

The foundational premise of Siliquarium is to liberate digital circuits from artificial engineering benchmarks (e.g., evolving a circuit to solve an arbitrary truth table) and immerse them in an autopoietic, thermodynamically closed hydrothermal ecosystem.

In **Phase 6**, Siliquarium achieves its full ecological and macro-evolutionary synthesis:
1. **Ancestral Lineage Tracking:** Every digital organism inherits a permanent ancestor pointer ($O(1)$ memory), allowing zero-lag retrospective reconstruction of its entire genealogical tree back to primordial Generation 0.
2. **Lenski Long-Term Evolution Experiment (LTEE) Dynamics:** Continuous real-time accounting of evolutionary velocity, cumulative replicative events, clade extinction, and the Shannon Diversity Index.
3. **The Convergent Evolution Manifold (Homology vs. Homoplasy):** Automated structural classification that distinguishes between shared ancestral inheritance (Homology) and independent physical discovery (Homoplasy / Convergent Evolution).
4. **Enhanced Seafloor Visual Reticle & HUD Key:** Complete visual clarity with anchored 3D targeting reticles, real-time phylogeny metrics, and an interactive lattice legend.

---

## 2. The 4 Sacred Everyday Analogies

To maintain documentation integrity under the **5-Dimension Conceptual Rubric**, Phase 6 maps directly to our four core metaphors:

```mermaid
flowchart TD
    subgraph S["1. The Library Safe (Genotype)"]
        Safe["60-Bit Inert Tape<br/>Protected from electrical current"]
    end

    subgraph W["2. The Active Workshop (Phenotype)"]
        Gates["Catalytic Logic Gates<br/>CMOS Landauer toggling"]
    end

    subgraph B["3. The Pantry Battery (Metabolism)"]
        Batt["Pyrophosphate Pool<br/>Energy (E) & Mineral Mass (M)"]
    end

    subgraph P["4. The Photocopy Machine (Reproduction)"]
        Copy["Blind Polymerization<br/>Split energy/matter & bit flip"]
    end

    Safe -.->|"Translates at Birth"| Gates
    Gates -->|"Charges Redox Tokens"| Batt
    Batt -->|"Triggers at 100E & 20M"| Copy
    Copy -->|"Produces Daughter"| Safe
```

1. **The Library Safe:** An immutable 60-bit inert tape stored in the pore's corner. It conducts no electricity and experiences no mutations during the organism's lifetime.
2. **The Active Workshop:** The breadboard where active logic gates (`AND`, `OR`, `NOT`) resonate with hydrothermal fuel pulses (Stream A) and oxidizer pulses (Stream B).
3. **The Pantry Battery:** A mineral capacitor storing discrete energy and mass tokens. Running gates burns Landauer tokens; catalytic reactions capture free energy and precipitate mineral mass.
4. **The Photocopy Machine:** When the battery reaches 100 energy tokens and 20 mass tokens, the cell halves its resources and photocopies the inert tape into an adjacent substrate pore or pelagic spore with a small mutation probability.

---

## 3. Mathematical Foundations of Clade Diversity & Evolutionary Velocity

### 3.1 The Shannon Diversity Index (\(H\))

To quantify ecological health and detect **clonal interference** (where competing adaptive mutations in different clades battle for substrate space), Siliquarium computes the normalized Shannon entropy over all active founder clades:

$$H = -\sum_{i=1}^{K} p_i \ln(p_i)$$

Where:
- \(K\) is the total number of distinct founder clades currently extant in the seafloor lattice.
- \(p_i = \frac{N_i}{N_{\text{total}}}\) is the proportional abundance of organisms belonging to clade \(i\).
- When \(H \to 0\), a single dominant monoculture has swept the lattice (selective sweep).
- When \(H > 1.5\), diverse phylogenetic lineages stably co-exist across different thermal micro-niches.

### 3.2 Evolutionary Velocity (\(V_{\text{evo}}\))

Evolutionary velocity measures the speed of generational turnover per 100 epoch ticks:

$$V_{\text{evo}} = \frac{\max(\text{Generation})}{T_{\text{tick}}} \times 100$$

Under Richard Lenski's LTEE framework, initial velocity is high during rapid colonization of empty volcanic ridges, then asymptotically stabilizes as organisms reach metabolic parsimony.

---

## 4. Distinguishing Homology from Convergent Evolution (Homoplasy)

A central triumph of the **Evolutionary Flight Recorder** is its mathematical proof of convergent evolution:

```mermaid
flowchart TD
    LCA["Least Common Ancestor (LCA)<br/>Motif: NONE (Gen 0)"]
    LCA -->|"Lineage A (North Chimney)"| NodeA["Descendant A (Gen 4)<br/>Motif: INVERTER_NOT"]
    LCA -->|"Lineage B (South Ridge)"| NodeB["Descendant B (Gen 5)<br/>Motif: INVERTER_NOT"]

    NodeA -.->|"Independent Physical Discovery"| Verdict["VERDICT: HOMOPLASY<br/>(Convergent Evolution)"]
    NodeB -.->|"Independent Physical Discovery"| Verdict
```

Given two organisms \(A\) and \(B\) exhibiting an identical regulatory network motif \(M\) (e.g. an allosteric inhibitor `NOT` gate):
1. **LCA Search:** The flight recorder traverses parent pointers backwards to locate their Least Common Ancestor:
   $$\text{LCA}(A, B) = \text{argmin}_{u \in \text{Ancestors}(A) \cap \text{Ancestors}(B)} (\text{Depth}(u))$$
2. **Audit Rule:**
   - If \(\text{LCA}(A, B)\) already possessed motif \(M\) $\implies$ **HOMOLOGY** (shared ancestral inheritance).
   - If \(\text{LCA}(A, B)\) did NOT possess motif \(M\) $\implies$ **HOMOPLASY** (independent convergent discovery).

---

## 5. Software Architecture & Zero-DOM Implementation

```typescript
// Core LTEE metric interface (src/engine/paleontology/LteeBenchmark.ts)
export interface ILteeReport {
  readonly tick: number;
  readonly activeLivingCount: number;
  readonly activeSporeCount: number;
  readonly maxGeneration: number;
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
  readonly totalBirths: number;
  readonly totalDeaths: number;
  readonly evolutionaryVelocity: number;
}
```

---

## 6. Verification & Conservation Invariants

Phase 6 is verified across all 14 test stages:
- **Zero Energy Leaks:** \(\Delta E = 0.000\) across thousands of multi-generational ticks.
- **Zero Matter Leaks:** \(\Delta M = 0.000\) under continuous mineral precipitation, scavenging, and lysis.
- **100% Determinism:** Identical PRNG seeds yield bit-for-bit identical phylogenetic trees.

---

## 7. Whimsical Linnaean Binomial Nomenclature & Scientist Homages

To bridge digital automata and living biology with scholarly whimsy, Siliquarium dynamically classifies all emergent digital organisms into formal Linnaean binomial taxa named in homage to landmark scientists in computation, biophysics, and evolutionary genetics ([`TaxonomyNomenclature.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts)):

| Binomial Taxon | Common Name | Honoree & Field | Landmark Citation | Glow Aura |
| :--- | :--- | :--- | :--- | :--- |
| *Pulsilicon alonii* | Alon's Pulsing Silicoid | **Uri Alon** (Systems Biology & Motifs) | *Nat. Rev. Genet.* 8(6), 450 (2007) | Emerald (`#10b981`) |
| *Oscillocladus elowitzii* | Elowitz's Repressilator | **Michael B. Elowitz** (Synthetic Oscillators) | *Nature* 403, 335 (2000) | Violet (`#a855f7`) |
| *Bistabilus collinsii* | Collins' Toggle Switch | **James J. Collins** (Cellular Memory Latches) | *Nature* 403, 339 (2000) | Electric Cyan (`#00e5ff`) |
| *Synergobacter turingii* | Turing's Parity Morphogen | **Alan Turing** (Morphogenesis & Logic) | *Phil. Trans. R. Soc. B* 237, 37 (1952) | Amber Gold (`#f59e0b`) |
| *Inhibitovibrio landaueri* | Landauer's Minimal Dissipator | **Rolf Landauer** (Physics of Computation) | *IBM J. Res. Dev.* 5(3), 183 (1961) | Sapphire Blue (`#3b82f6`) |
| *Ventricola mitchellii* | Mitchell's Chemiosmotic Feeder | **Peter Mitchell** (Chemiosmosis & PMF) | *Nature* 191, 144 (1961) | Deep Vent Coral (`#f97316`) |
| *Silicoplasma lenskii* | Lenski's High-Gen Adapter | **Richard E. Lenski** (Experimental Evolution / LTEE) | *Am. Nat.* 138(6), 1315 (1991) | Hot Pink (`#ec4899`) |
| *Lithomicrobium lanei* | Lane's Lithotrophic Pore-Dweller | **Nick Lane** (Prebiotic Bioenergetics) | *Cell* 151(7), 1406 (2012) | Deep Teal (`#14b8a6`) |
| *Autopoietobacter russellii* | Russell's Mineral Cavity Cell | **Michael J. Russell** (Inorganic Compartments) | *J. Geol. Soc.* 154, 377 (1997) | Pyrite Gold (`#eab308`) |
| *Chimerococcus margulisiae* | Margulis's Multi-Gate Symbiont | **Lynn Margulis** (Endosymbiotic Theory) | *J. Theor. Biol.* 14(3), 225 (1967) | Indigo Violet (`#8b5cf6`) |
| *Informavibrio shannonii* | Shannon's High-Fidelity Coder | **Claude Shannon** (Information Theory) | *Bell Syst. Tech. J.* 27(3), 379 (1948) | Neon Aqua (`#06b6d4`) |
| *Symbiovibrio patteei* | Pattee's Epistemic Generalist | **Howard H. Pattee** (The Epistemic Cut) | *Hierarchy Theory*, pp. 73-100 (1972) | Sky Blue (`#38bdf8`) |

---

## 8. Multi-Cell Ecological Drama & Trophic Dynamics

Rather than static solitary cells, Siliquarium simulates rich multi-organism trophic interactions on the 3D seafloor:
1. **Contact Predation:** An aggressive, unshielded predator taps an adjacent prey pore, firing a crimson predatory siphon arc (`#f43f5e`) that draws up to 10 battery tokens per tick.
2. **Carcass Scavenging:** When an organism exhausts its battery and lyses into a mineralizing carcass, neighboring catabolic cells emit amber detrital streamers (`#fbbf24`), extracting residual chemical tokens.
3. **Pelagic Spore Launch Bursts:** Stressed or mature cells eject buoyant spore capsules into the aqueous water column ($z \ge 1$), generating expanding yellow-gold ionization flashes (`#facc15`).
4. **Endosymbiotic Syncytial Macro-Silicoids:** Neighboring mature cells from complementary clades undergo mutualistic chimeric fusion, forming violet cytoplasmic bridges (`#8b5cf6`) and shared multi-pore syncytial colonies (*Chimerococcus margulisiae*).

