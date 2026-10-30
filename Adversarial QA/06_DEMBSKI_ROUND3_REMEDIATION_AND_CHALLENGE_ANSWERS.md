# Siliquarium — Dembski Protocol Round 3 Deep-Weeds Challenges, Proofs & Architectural Remediations

**Date:** October 17, 2026  
**Audit Standard:** Dembski Protocol Zero-Charity Active Information Audit ($I_+ = 0$) & First-Law Conservation ($\Delta E = 0.000, \Delta M = 0.000$)  
**Audit Report Answered:** [`Adversarial QA/05_DEMBSKI_ROUND3_DEEP_WEEDS_AUDIT_REPORT.md`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/05_DEMBSKI_ROUND3_DEEP_WEEDS_AUDIT_REPORT.md)  
**Executable Verification Suite:** [`Adversarial QA/falsification_suite_round3.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite_round3.mjs)

---

## Executive Summary

In Round 3, the Dembski Adversarial Auditor ([`52ae4956-e74c-49df-8bd0-998f3235f59b`](conversation://52ae4956-e74c-49df-8bd0-998f3235f59b)) performed an exhaustive deep-weeds inspection across the entire Siliquarium codebase and formulated **12 concrete, empirically proven challenges (`PROOF 1A` through `PROOF 5B`)** across 5 battlefronts.

Every single challenge has been answered and remediated in the production TypeScript source code. All **25/25 stages** of `npm test`, Round 1 [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs), Round 2 [`falsification_suite_round2.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite_round2.mjs), and Round 3 [`falsification_suite_round3.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite_round3.mjs) pass 100% with exit code `0`.

| Challenge ID | Battlefront | Adversary Proof Summary | Status |
| :--- | :--- | :--- | :--- |
| **PROOF 1A** | Stack-AST & Porin Binding | `isUnaryNotWithToxin` hijacked `GATE_NOT` to `PORIN_TOXIN_T`, and `binaryPorins` censored `PORIN_TOXIN_T` from `GATE_AND`/`GATE_OR` ($I_+ = 3.17\text{ bits}$). | **REMEDIATED & VERIFIED** |
| **PROOF 1B** | 0-Gate / 0-Battery Catalysis | `this.gates.length === 0` granted free virtual `AND` (`aActive && bActive`) and free `hasBatteryAccess = true` (`catalyticYield = 6`) with zero Landauer cost. | **REMEDIATED & VERIFIED** |
| **PROOF 1C** | Sequential Circuit Physics | 3-`NOT` ring oscillator used a non-inverting buffer (`isRingTail`) that visited only 2 states in dark and froze at `100` under fuel `(1,1,0)`; latches without `PORIN_TOXIN_T` could never reset. | **REMEDIATED & VERIFIED** |
| **PROOF 2A** | Host-Side Ecological Oracles | 0-porin dead `[GATE_NOT]` genome output `true` in vacuum, granting permanent `preyShield` and `isCatabolicScavenger`. | **REMEDIATED & VERIFIED** |
| **PROOF 2B** | Morphogenetic Body Plan | `PoreCell.getMorphogeneticPlan()` read unexpressed `SINK_SEPTUM` in repressed operons and hashed silent introns (`56..59`) to determine 3D cleavage polarity and colonial topology. | **REMEDIATED & VERIFIED** |
| **PROOF 2C** | Chemotaxis Probe Isolation | `TreadmillingEngine.selectDirectionalCleavageTarget()` reused a single `probeWorkshop` across candidates, penalizing candidate 0 with cold state-toggle costs. | **REMEDIATED & VERIFIED** |
| **PROOF 3A** | Paleontology Motif Scanner | `MotifScanner` certified 0-porin dead genomes and read `PORIN_TOXIN_T`/`PORIN_PHOTON_IR` inside repressed operons. | **REMEDIATED & VERIFIED** |
| **PROOF 3B** | Taxonomic Classification | `TaxonomyNomenclature` classified scattered non-oscillating `NOT` gates as `JOHNSONII`, 3-gate combinational trees as `COLLINSII`, and repressed `PORIN_STREAM_C` as `LENSKII_CIT`. | **REMEDIATED & VERIFIED** |
| **PROOF 3C** | Pre-Baked Founder Genomes | All 10 `founderStrains` in `EnvironmentPresetRegistry.ts` used `'000000'` (`GATE_AND`) padding with zero `SINK_BATTERY` (`catalyticYield = 0`), and `BioBank.ts` Wolpert Metazoan lacked `REGULATORY_OPERATOR` (`111100`). | **REMEDIATED & VERIFIED** |
| **PROOF 4A** | Autopsy Modal Truth Table | `CircuitAutopsyModal.evaluateCircuitState()` ran 1 cold tick on `(0,0,0)`, erasing 1-bit hold memory on `BISTABLE_LATCH` circuits. | **REMEDIATED & VERIFIED** |
| **PROOF 4B** | Telemetry Yield Fabrication | `SimulationWorld.exportTelemetry()` fabricated `catYield = 2` whenever `catYield === 0 && active`. | **REMEDIATED & VERIFIED** |
| **PROOF 5A** | Endosymbiosis & Sporulation | `stepEndosymbiosis()` overwrote `cellA`/`cellB` genomes with `chimericSafe` before calling `installOrganelle()`, and `IPelagicSpore` dropped `organelleSafe` during sporulation. | **REMEDIATED & VERIFIED** |
| **PROOF 5B** | First-Law Conservation | `targetCarcass.clear()` wiped co-located spores in `stepLysisAndScavenging()`, `loadEnvironmentPreset(preset, true)` dropped carcasses/spores/displaced cells without ledger accounting, and `Pore.setResident()` overwrote `this.carcass`. | **REMEDIATED & VERIFIED** |

---

## Detailed Challenge-by-Challenge Answers & Remediations

### Battlefront 1: Stack-AST Compiler & Sequential Circuit Physics ([`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts))

#### Challenge 1A: Teleological Porin Hijacking & Toxin Censoring (`PROOF 1A`)
- **Adversary Proof:** In [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L120-L135), `assembleFromTranslation()` checked `isUnaryNotWithToxin` to force `GATE_NOT` at slot 0 to bind `PORIN_TOXIN_T` instead of `opPorinTypes[0]`, and filtered `PORIN_TOXIN_T` out of `binaryPorins` so `GATE_AND`/`GATE_OR` would skip `PORIN_TOXIN_T` at slot 1 ($I_+ = \log_2(9) = 3.17\text{ bits}$).
- **Architectural Answer & Remediation:** Removed both `isUnaryNotWithToxin` and `binaryPorins` filtering from [`PoreWorkshop.assembleFromTranslation()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L120-L132). Porin terminal binding is now 100% positional within each operon (`opPorinTypes[(localIdx * 2) % opPorinTypes.length]` and `opPorinTypes[(localIdx * 2 + 1) % opPorinTypes.length]`, or `null` when `opPorinTypes.length === 0`).

#### Challenge 1B: Free Virtual `AND` Gate & Free Battery Access for 0-Gate Genomes (`PROOF 1B`)
- **Adversary Proof:** In [`PoreWorkshop.stepTick()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L473-L501), `primaryActive` fell back to `(aActive && bActive)` when `hasAnyExpressedGate === false`, and `hasBatteryAccess` included `|| this.gates.length === 0`, allowing a 0-gate, 0-battery genome `[PORIN_A, PORIN_B, PORIN_C, PORIN_D]` to harvest `catalyticYield = 6` with `toggleCount = 0`.
- **Architectural Answer & Remediation:** Removed the 0-gate virtual `AND` and 0-gate battery exemption in [`PoreWorkshop.stepTick()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L473-L501). Now `primaryActive = hasAnyExpressedGate ? lastExpressedGateOutput : false`, `hasBatteryAccess = hasActiveBatterySink && hasAnyExpressedGate`, and both `cGateCoupled` and `dGateCoupled` strictly require `hasAnyExpressedGate`.

#### Challenge 1C: 3-`NOT` Ring Oscillator Traveling Wave & Reset-Verified Latch (`PROOF 1C`)
- **Adversary Proof:**
  1. In [`PoreWorkshop.evaluateGateInAstContext()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L631-L665), `isRingTail` inverted `childGate.output` on `inputA` (`gate.inputA = !childGate.output`), turning the 3rd `NOT` gate into a non-inverting buffer (`G2 === G1`) that visited only 2 states (`[011] <-> [100]`) in the dark and froze permanently at `100` when fueled (`streamA = true, streamB = true`).
  2. `MotifScanner.detectBistableLatch()` certified `[PORIN_A, PORIN_B, GATE_AND, GATE_OR]` (without `PORIN_TOXIN_T`) because `wReset` was instantiated cold at `false` instead of resetting a set latch.
  3. Commuted `[GATE_OR, GATE_AND]` overwrote `G1.inputA` (`leftBranch.output`).
- **Architectural Answer & Remediation:**
  1. Replaced `isRingTail` in [`PoreWorkshop.evaluateGateInAstContext()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L631-L665) with genuine 1-tick-per-stage propagation delay (`childGate.lastOutput` for `ringIdx > 0` and `tailNot.output` for `ringIdx === 0`). Every `NOT` gate in an odd ring now strictly inverts its input (`gate.output === !gate.inputA`) and traverses all $2N = 6$ traveling-wave states (`100 -> 101 -> 001 -> 011 -> 010 -> 110`) under both dark `(0,0,0)` and fueled `(1,1,0)` conditions.
  2. Updated [`MotifScanner.detectBistableLatch()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L180-L197) to test Set `(1,1,0) -> true`, Hold `(0,0,0) -> true`, Reset `(0,0,1) -> false`, and Hold `(0,0,0) -> false` sequentially on the **same** `PoreWorkshop` instance, rejecting any latch that cannot reset.
  3. Updated commuted `[GATE_OR, GATE_AND]` in [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L668-L693) so `G0` (`GATE_OR`) computes `(effA && effB) || G1.output` and `G1` (`GATE_AND`) preserves `G1.inputA = leftBranch.output` and `G1.inputB = !latchReset`.

---

### Battlefront 2: Host-Side Oracles, Morphogenesis & Chemotaxis ([`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts), [`PoreCell.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts), [`TreadmillingEngine.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts))

#### Challenge 2A: 0-Porin Dead `[GATE_NOT]` Genome Shield & Scavenging Grants (`PROOF 2A`)
- **Adversary Proof:** A 0-porin dead genome `[GATE_NOT]` evaluated `!false = true` in a sensory vacuum (`activeMembranePorins.length === 0`), granting permanent `preyShield = true` and `isCatabolicScavenger = true`.
- **Architectural Answer & Remediation:**
  1. In [`PoreWorkshop.evaluateGateInAstContext()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L746-L750), when `activeMembranePorins.length === 0 && effTermA === null`, no substrate or sensory signal can enter the cell, so `gate.output = false` and `gate.analogOutput = 0`.
  2. In [`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L897-L906), `hasWeapon`, `preyShield`, and `isCatabolicScavenger` explicitly require `g.boundTerminalA !== null || g.boundTerminalB !== null`.

#### Challenge 2B: Repressed `SINK_SEPTUM` & Silent Intron Morphogenetic Contamination (`PROOF 2B`)
- **Adversary Proof:** [`PoreCell.getMorphogeneticPlan()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts#L321-L366) checked unexpressed `trans.sinkNodes` for `SINK_SEPTUM`, cached stale plans across operon state transitions, and hashed `trans.instructions[0..2].codonIndex` (including silent introns `56..59`).
- **Architectural Answer & Remediation:** Updated [`PoreCell.getMorphogeneticPlan()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts#L321-L366) to query `this.workshop.hasSeptum()` (which checks expressed operons only), filter out `CodonType.INTRON_SILENT` before hashing, and hash canonical coding `CodonType` indices so silent introns (`56..59`) and synonymous wobble mutations are 100% morphogenetically neutral.

#### Challenge 2C: Stateful `probeWorkshop` Cross-Contamination in `TreadmillingEngine` (`PROOF 2C`)
- **Adversary Proof:** [`TreadmillingEngine.selectDirectionalCleavageTarget()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L55-L95) instantiated `probeWorkshop` once outside the `candidatePores` loop, causing candidate 0 to pay the cold `lastOutput = false -> true` Landauer toggle penalty while warming `probeWorkshop` for candidate 1.
- **Architectural Answer & Remediation:** Moved `const probeWorkshop = PoreWorkshop.fromBitstring(cellTape);` inside the `for (let i = 0; i < candidatePores.length; i++)` loop in [`TreadmillingEngine.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L67-L68) so every candidate pore is evaluated from an identical isolated baseline.

---

### Battlefront 3: Digital Paleontology, Nomenclature & Presets ([`MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts), [`TaxonomyNomenclature.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts), [`EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts), [`BioBank.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts))

#### Challenge 3A: `MotifScanner` False Positives on 0-Porin Genomes & Repressed Operons (`PROOF 3A`)
- **Adversary Proof:** [`MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) certified 0-porin dead genomes as `COHERENT_FFL`, `INCOHERENT_FFL`, `NEGATIVE_AUTOREGULATION`, `TEMPORAL_DERIVATIVE_CHEMOTAXIS`, and `CRYPTOBIOTIC_DORMANCY_CLAMP`, and read unexpressed porins in repressed operons via `workshop.hasPorinT()`.
- **Architectural Answer & Remediation:** Updated [`MotifScanner.scanWorkshop()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L27-L52) to extract `expressedPorins`, `expressedSinks`, and `expressedOperonCount` strictly from expressed operons (`opStates[idx] !== false`). Any genome tape with `expressedPorins.size === 0` immediately returns `[]`, and all proto-cognitive motif detectors check `expressedPorins` and `expressedSinks`.

#### Challenge 3B: `TaxonomyNomenclature` Bag-of-Codons & Repressed-Operon Misclassifications (`PROOF 3B`)
- **Adversary Proof:** [`TaxonomyNomenclature.classify()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L379-L445) scanned raw 6-bit chunks across repressed operons (misclassifying repressed `PORIN_STREAM_C` as `Citratovibrio lenskii`), used `notCount >= 3` without checking contiguity (misclassifying `[NOT, NOT, AND, NOT]` as `Chronobacterium johnsonii`), and used `gateCount >= 2` for `COLLINSII` (misclassifying 3-gate combinational `[AND, AND, OR]` as `Bistabilus collinsii`).
- **Architectural Answer & Remediation:** Updated [`TaxonomyNomenclature.classify()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L379-L460) to collect `codonValues` strictly from expressed operons (`opStates[idx] !== false`), require a contiguous odd-length run of $\ge 3$ `NOT` gates for `JOHNSONII`/`ELOWITZII`, and require `gateCount === 2` for `COLLINSII`.

#### Challenge 3C: Botched Founder Genomes in `EnvironmentPresetRegistry.ts` & `BioBank.ts` (`PROOF 3C`)
- **Adversary Proof:** All 10 `founderStrains` in [`EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L515) used `'000000'` (`GATE_AND`) as padding and lacked `SINK_BATTERY`, giving `catalyticYield = 0`. In [`BioBank.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L243-L258), `tapeWolpert` used `'101100'` (`PORIN_TOXIN_T`, codon 44) instead of `'111100'` (`REGULATORY_OPERATOR`, codon 60).
- **Architectural Answer & Remediation:** Updated all 10 `founderStrains` in [`EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L515) to include `SINK_BATTERY` (`110000`), `SINK_SEPTUM` (`110100`), and `INTRON_SILENT` (`111000`) padding (`catalyticYield >= 2`), and updated `tapeWolpert` in [`BioBank.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L243-L258) to include `REGULATORY_OPERATOR` (`111100`), `SINK_SEPTUM` (`110100`), and `SINK_BATTERY` (`110010`) with `preferredTopology === 'DENDRITIC'`.

---

### Battlefront 4: UI/Autopsy Sequential Memory & Authentic Telemetry Yield ([`CircuitAutopsyModal.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts), [`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts))

#### Challenge 4A & 4B: Cold 1-Tick Autopsy Blindness & Telemetry Yield Fabrication (`PROOF 4A & 4B`)
- **Adversary Proof:**
  1. [`CircuitAutopsyModal.evaluateCircuitState()`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L491-L509) instantiated a cold `PoreWorkshop` on `(0,0,0)`, erasing 1-bit hold memory for `BISTABLE_LATCH` circuits.
  2. [`SimulationWorld.exportTelemetry()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1480-L1486) overwrote `catYield = 2` whenever `catYield === 0 && active`.
- **Architectural Answer & Remediation:**
  1. Updated [`CircuitAutopsyModal.evaluateCircuitState()`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L491-L518) to prime verified `BISTABLE_LATCH` circuits before evaluating the `(0,0,0)` hold state so the truth table accurately reflects 1-bit state retention while keeping combinational truth tables 100% bit-identical to `PoreWorkshop`.
  2. Removed the `if (catYield === 0 && active) { catYield = 2; }` fabrication in [`SimulationWorld.exportTelemetry()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1476-L1486).

---

### Battlefront 5: Endosymbiosis, Sporulation & First-Law Conservation ([`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts), [`Pore.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts))

#### Challenge 5A: Endosymbiosis Self-Genome Overwrite & Sporulation Organelle Erasure (`PROOF 5A`)
- **Adversary Proof:**
  1. In [`SimulationWorld.stepEndosymbiosis()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1130-L1133), `cellA.adoptChimericGenome(chimericSafe)` was called before `cellB.installOrganelle(cellA.getSafe())`, overwriting both cells' donor genomes with `chimericSafe`.
  2. In [`SimulationWorld.stepReproduction()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1006-L1015) and [`stepSpores()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1255), `IPelagicSpore` omitted `organelleSafe`, erasing endosymbiotic organelles upon sporulation.
- **Architectural Answer & Remediation:**
  1. Captured `const donorSafeA = cellA.getSafe(); const donorSafeB = cellB.getSafe();` prior to `adoptChimericGenome()` in [`SimulationWorld.stepEndosymbiosis()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1112-L1130), installing `donorSafeB` into `cellA` and `donorSafeA` into `cellB`.
  2. Added `readonly organelleSafe?: GenomeSafe | null;` to [`IPelagicSpore`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts#L28-L38) and preserved `daughter.getOrganelleSafe()` across spore ejection and benthic settlement.

#### Challenge 5B: First-Law Conservation Leaks in Scavenging, Preset Reload & `Pore.setResident()` (`PROOF 5B`)
- **Adversary Proof:**
  1. In [`SimulationWorld.stepLysisAndScavenging()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1337), unspecialized autotroph scavenging called `targetCarcass.clear()` instead of `targetCarcass.clearCarcass()`, vaporizing any co-located pelagic spore without ledger accounting.
  2. In [`SimulationWorld.loadEnvironmentPreset(preset, true)`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2303-L2419), `preserveCells = true` wiped carcasses, spores, and cells landing on obstacles without recording their energy/matter to `this.ledger`.
  3. [`Pore.setResident()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts#L100-L105) overwrote `this.carcass = null` when a pore was in `CARCASS` state.
- **Architectural Answer & Remediation:**
  1. Replaced `targetCarcass.clear()` with `targetCarcass.clearCarcass()` in [`SimulationWorld.stepLysisAndScavenging()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1330).
  2. Updated [`SimulationWorld.loadEnvironmentPreset(preset, true)`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2303-L2419) to record heat dissipation and matter sedimentation for all carcasses, spores, and unplaceable cells.
  3. Updated [`Pore.setResident()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts#L100-L105) to return `false` whenever `this.resident !== null || this.carcass !== null`.
