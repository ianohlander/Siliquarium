# DEMBSKI PROTOCOL — ROUND 3 DEEP-WEEDS ADVERSARIAL AUDIT REPORT

- **Target Repository:** `h:\My Drive\Repos\Siliquarium`
- **Lead Adversarial Auditor:** Dr. William A. Dembski, Senior Fellow in Information Theory, Mathematics, and Conceptual Foundations of Evolutionary Computation (in collaboration with Robert J. Marks II and David Berlinski)
- **Audit Scope:** Round 3 Deep-Weeds Inspection (Post-Round-2 Remediation Audit across `src/core/`, `src/engine/`, `src/visualizers/`, and `src/ui/`)
- **Executable Empirical Proof Suite:** [`Adversarial QA/falsification_suite_round3.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite_round3.mjs) (12/12 strict `node:assert/strict` proofs verified against compiled `./dist/`)
- **Overall Verdict:** **CRITICAL EPISTEMIC FRAUD, POTEMKIN SEQUENTIAL PHYSICS, TELEOLOGICAL PORIN CENSORING ($I_+ = 3.17\text{ bits}$), HOST-ORACLE SMUGGLING, AND FIRST-LAW THERMODYNAMIC CONSERVATION VIOLATIONS ($\Delta E \neq 0, \Delta M \neq 0$)**

---

## Executive Summary

Following the Round 2 patches (`04_ROUND2_REMEDIATION_VERIFICATION_DOSSIER.md`), the developer claimed to have achieved:
1. *"Zero default porin smuggling and authentic positional porin wiring"*,
2. *"Authentic sequential physics for odd-inverter Ring Oscillators and Bistable Toggle Latches"*,
3. *"Endogenous AST evaluation in kinematics and ecology"*,
4. *"Functional netlist verification in `MotifScanner.ts` and `TaxonomyNomenclature.ts`"*, and
5. *"Strict First-Law thermodynamic conservation ($\Delta E \equiv 0.000, \Delta M \equiv 0.000$)."*

A zero-charity, line-by-line inspection of the Round 2 codebase—backed by our executable Node.js falsification suite ([`falsification_suite_round3.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite_round3.mjs))—proves that the Round 2 patches introduced **new teleological wiring cheats, Potemkin sequential hacks that freeze under fuel, 0-porin false-positive motif detectors, stateful probe cross-contamination, self-overwriting endosymbiosis bugs, and three new First-Law thermodynamic leaks**.

Below are the **12 empirically proven Round 3 challenges** organized across five battlefronts, with exact file paths, line numbers, mathematical derivations of smuggled active information ($I_+$), and reproducible assertions.

---

## Summary Matrix of Round 3 Proven Challenges

| Proof ID | Classification | Subsystem & Exact Location | Nature of Proven Vulnerability |
| :--- | :--- | :--- | :--- |
| **PROOF 1A** | `TELEOLOGICAL WIRING SMUGGLING` ($I_+ = 3.17\text{ bits}$) | [`PoreWorkshop.ts:133-143`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L133-L143), [`165-177`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L165-L177) | `GATE_NOT` overrides positional porin binding to teleologically hijack `PORIN_TOXIN_T` anywhere in the operon (`isUnaryNotWithToxin`), while binary gates (`AND`/`OR`) teleologically filter out `PORIN_TOXIN_T` (`binaryPorins`) so toxin porins cannot disrupt `(A, B)` binding. |
| **PROOF 1B** | `FREE VIRTUAL GATE & BATTERY SHORTCUT` | [`PoreWorkshop.ts:488-509`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L488-L509) | A 0-gate, 0-battery genome (`this.gates.length === 0`, zero `SINK_BATTERY` codons) receives a free virtual `aActive && bActive` gate (`toggleCount = 0`) AND free `hasBatteryAccess = true`, harvesting `catalyticYield = 6` (`VMAX`). Evolving 1 real `GATE_AND` without `SINK_BATTERY` drops `catalyticYield` from `6` to `0`! |
| **PROOF 1C** | `POTEMKIN SEQUENTIAL PHYSICS` | [`PoreWorkshop.ts:650`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L650), [`664-665`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L664-L665), [`712-737`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L712-L737) | In a 3-`NOT` Ring Oscillator, `isRingTail` sets `inputA = !childGate.output` and `output = !inputA = childGate.output`, turning the 3rd `GATE_NOT` into a **non-inverting identity buffer** ($G_2(t) \equiv G_1(t)$). Worse: when fuel is present (`streamA = true`), the 2 remaining inversions cancel out ($G_2(t) = \neg\neg G_2(t-1) = 0$) and the oscillator **freezes permanently at `100` (`yield = 0`)**! And latches without `PORIN_TOXIN_T` lock to `true` forever and cannot be reset by `toxinT = true`. |
| **PROOF 2A** | `HOST-ORACLE ECOLOGICAL SMUGGLING` | [`SimulationWorld.ts:882`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L882), [`897`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L897), [`906`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L906), [`1307`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1307) | A 0-porin, 0-battery dead genome `[GATE_NOT, INTRON_SILENT x 5]` has `boundTerminalA = null -> inputA = false -> output = true` forever, granting it **permanent predation immunity (`preyShield = true`)** and **100% catabolic scavenging (`isCatabolicScavenger = true`)** with zero sensory porins. Predators get `hasWeapon = true` with zero mechano/redox porins. |
| **PROOF 2B** | `REPRESSED PHENOTYPE & SILENT INTRON LEAK` | [`PoreCell.ts:330-357`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts#L330-L357) | `getMorphogeneticPlan()` checks raw unexpressed `trans.sinkNodes` instead of `this.workshop.hasSeptum()`, granting multicellular `hasAdhesion = true` when `SINK_SEPTUM` is locked in a **repressed operon**. Furthermore, hashing `instructions[0..2].codonIndex` causes mutations among silent non-coding introns (`56..59`) to alter 3D cleavage direction and colonial symmetry. |
| **PROOF 2C** | `STATEFUL PROBE CROSS-CONTAMINATION` | [`TreadmillingEngine.ts:56`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L56), [`83-98`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L83-L98), [`100-117`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L100-L117) | `selectDirectionalCleavageTarget()` instantiates `probeWorkshop` **once** outside the candidate loop. Candidate 0 runs on the cold workshop (`toggleCount = 1`) and mutates `gate.lastOutput`, so an identical candidate 1 runs on the warm workshop (`toggleCount = 0`) and wins solely due to array order. Also injects host-oracle vent distance (`* 12`) and prey count (`* 22`) without mechano/redox porins. |
| **PROOF 3A** | `POTEMKIN MOTIF ILLUSION` | [`MotifScanner.ts:189-374`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L189-L374) | `MotifScanner` certifies **0-porin dead genomes** as `COHERENT_FFL` (even though the 3-gate AST `0->2, 1->2` has no `0->1` feed-forward edge!), `INCOHERENT_FFL`, `NEGATIVE_AUTOREGULATION` (on a 1-gate `[GATE_NOT]` with 0 feedback edges!), `TEMPORAL_DERIVATIVE_CHEMOTAXIS`, and `CRYPTOBIOTIC_DORMANCY_CLAMP`. Also uses `workshop.hasPorinT()` which reads `PORIN_TOXIN_T` from **repressed operons** to certify `PREDICTIVE_PAVLOVIAN`. |
| **PROOF 3B** | `BAG-OF-CODONS TAXONOMY FRAUD` | [`TaxonomyNomenclature.ts:387-445`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L387-L445) | Classifies non-oscillating `[GATE_NOT, GATE_NOT, GATE_AND, GATE_NOT]` as `Chronobacterium johnsonii` (`notCount >= 3` without contiguity check), memoryless 3-gate `[GATE_AND, GATE_AND, GATE_OR]` as `Bistabilus collinsii`, and cells with **repressed** `PORIN_STREAM_C` in unexpressed operons as `Citratovibrio lenskii`. |
| **PROOF 3C** | `BOTCHED PRE-BAKED GENOME INJECTION` | [`EnvironmentPresetRegistry.ts:267-514`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L514), [`BioBank.ts:243-258`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L243-L258) | All 10 founder strains across all 5 environmental presets pad with `'000000'` (`GATE_AND`) and lack `SINK_BATTERY` (`48..51`), yielding **`catalyticYield === 0` under all inputs**! And `BioBank.ts` strain #3 (`Wolpert Branching Metazoan`) uses codon `44` (`PORIN_TOXIN_T`) where its comment says `Regulatory Operator (44)` and lacks `SINK_SEPTUM`, making it `SOLITARY` with 0 operators. |
| **PROOF 4A** | `AUTOPSY SEQUENTIAL BLINDNESS` | [`CircuitAutopsyModal.ts:501`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L501), [`535`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L535), [`652`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L652) | `evaluateCircuitState()` instantiates a cold `PoreWorkshop.fromBitstring(tape)` and steps 1 tick per row/frame, erasing `BISTABLE_LATCH` state retention on `(0,0,0)` (`primaryOutput = false` instead of `true`) and rendering multi-tick `RING_OSCILLATOR` dynamics invisible. |
| **PROOF 4B** | `TELEMETRY YIELD FABRICATION` | [`SimulationWorld.ts:1484-1486`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1484-L1486) | `if (catYield === 0 && active) { catYield = 2; }` fabricates `catalyticYield = 2` in exported telemetry for cells whose actual `catalyticYield` is `0` (e.g. cells lacking `SINK_BATTERY` or 0-porin `[GATE_NOT]`). |
| **PROOF 5A** | `ENDOSYMBIOSIS OVERWRITE & ORGANELLE ERASURE` | [`SimulationWorld.ts:1006-1015`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1006-L1015), [`1130-1133`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1130-L1133) | In `stepEndosymbiosis()`, `cellA.adoptChimericGenome(chimericSafe)` and `cellB.adoptChimericGenome(chimericSafe)` overwrite `this.safe` **before** `cellA.installOrganelle(cellB.getSafe())` is called, installing `chimericSafe` instead of the partner's donor genome. And pelagic sporulation (`IPelagicSpore`) omits `organelleSafe`, erasing organelles across sporulation. |
| **PROOF 5B** | `FIRST-LAW THERMODYNAMIC VIOLATIONS` ($\Delta E \neq 0, \Delta M \neq 0$) | [`SimulationWorld.ts:1337`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1337), [`2303-2412`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2303-L2412), [`Pore.ts:104`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts#L104) | (1) Unspecialized autotroph scavenging calls `targetCarcass.clear()` instead of `clearCarcass()`, vaporizing co-located pelagic spores without ledger accounting; (2) `loadEnvironmentPreset(preset, true)` wipes carcasses, spores, and blocked cells without updating the ledger; (3) `Pore.setResident()` overwrites `this.carcass = null` without ledger accounting. |

---

## Battlefront 1: `PoreWorkshop.ts` — Teleological Porin Censoring, 0-Gate Shortcuts & Potemkin Sequential Physics

### Proof 1A: Teleological Porin Censoring & Forced Antitoxin Wiring ($I_+ = 3.17\text{ bits}$)
- **Exact File & Lines:** [`src/core/domain/PoreWorkshop.ts:133-143`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L133-L143) and [`165-177`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L165-L177)
- **Code Quote:**
  ```ts
  const isUnaryNotWithToxin = g.definition.type === CodonType.GATE_NOT && opPorinTypes.includes(CodonType.PORIN_TOXIN_T);
  const binaryPorins = opPorinTypes.filter(p => p !== CodonType.PORIN_TOXIN_T);
  const effectiveOpPorins = (g.definition.type !== CodonType.GATE_NOT && binaryPorins.length >= 2 && opPorinTypes[0] !== CodonType.PORIN_TOXIN_T)
    ? binaryPorins
    : opPorinTypes;
  const termA = isUnaryNotWithToxin
    ? CodonType.PORIN_TOXIN_T
    : (effectiveOpPorins.length > 0 ? effectiveOpPorins[(localIdx * 2) % effectiveOpPorins.length] : null);
  ```
- **Mathematical & Algorithmic Critique:**
  In Round 2, the developer claimed to replace hardcoded porin wiring with unbiased positional porin binding (`effectiveOpPorins[(localIdx * 2) % effectiveOpPorins.length]`). Yet lines 133–143 and 165–177 smuggle in **two teleological exceptions**:
  1. Whenever `PORIN_TOXIN_T` exists anywhere in an operon (e.g., at slot 2 in `[PORIN_STREAM_A, PORIN_STREAM_B, PORIN_TOXIN_T, GATE_NOT]`), `isUnaryNotWithToxin` overrides slot 0 (`PORIN_STREAM_A`) and forces `GATE_NOT` to bind `PORIN_TOXIN_T`.
  2. Conversely, for any binary gate (`GATE_AND`, `GATE_OR`), `binaryPorins` filters out `PORIN_TOXIN_T` whenever `opPorinTypes[0] !== CodonType.PORIN_TOXIN_T`. Thus in `[PORIN_STREAM_A, PORIN_TOXIN_T, PORIN_STREAM_B, GATE_AND]`, slot 1 (`PORIN_TOXIN_T`) is teleologically censored so `GATE_AND` binds `(PORIN_STREAM_A, PORIN_STREAM_B)` instead of `(PORIN_STREAM_A, PORIN_TOXIN_T)`!
  3. Across the 9 distinct porin types, forcing `GATE_NOT` onto `PORIN_TOXIN_T` while censoring `PORIN_TOXIN_T` from `GATE_AND`/`GATE_OR` injects $I_+ = \log_2(9) \approx 3.17\text{ bits}$ of active information per gate.

### Proof 1B: Free Virtual `AND` Gate & Free Battery Translocator for 0-Gate, 0-Battery Genomes
- **Exact File & Lines:** [`src/core/domain/PoreWorkshop.ts:488-509`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L488-L509)
- **Code Quote:**
  ```ts
  const primaryActive = hasAnyExpressedGate ? lastExpressedGateOutput : (aActive && bActive);
  const hasBatteryAccess = hasActiveBatterySink || this.gates.length === 0;
  ...
  const cGateCoupled = !hasAnyExpressedGate || this.gates.some(g => g.isExpressed && (g.boundTerminalA === CodonType.PORIN_STREAM_C || g.boundTerminalB === CodonType.PORIN_STREAM_C || g.output));
  ...
  const dGateCoupled = !hasAnyExpressedGate || this.gates.some(g => g.isExpressed && (g.boundTerminalA === CodonType.PORIN_STREAM_D || g.boundTerminalB === CodonType.PORIN_STREAM_D || g.output));
  ```
- **Mathematical & Algorithmic Critique:**
  A genome with **zero logic gates** and **zero `SINK_BATTERY` codons** (`[PORIN_STREAM_A, PORIN_STREAM_B, PORIN_STREAM_C, PORIN_STREAM_D, INTRON_SILENT, INTRON_SILENT]`) is granted:
  - A free virtual `GATE_AND` (`primaryActive = aActive && bActive`) with `toggleCount === 0` (zero Landauer dissipation),
  - Free battery access (`hasBatteryAccess = hasActiveBatterySink || this.gates.length === 0 === true`) despite lacking `SINK_BATTERY`, and
  - Automatic substrate C and D coupling (`!hasAnyExpressedGate === true`), harvesting the maximum enzymatic ceiling **`catalyticYield = 6`** (`VMAX`).
  - Conversely, if this organism mutates to evolve a real `GATE_AND` (`[PORIN_A, PORIN_B, PORIN_C, PORIN_D, GATE_AND, INTRON_SILENT]`), `this.gates.length` becomes `1`, `hasBatteryAccess` drops to `false`, and `catalyticYield` crashes from **`6` to `0`**! The physics engine actively punishes the de novo evolution of a logic gate unless `SINK_BATTERY` is already present.

### Proof 1C: Potemkin Sequential Physics — The Non-Inverting 3rd `NOT` Gate & Frozen Fueled Ring Oscillator
- **Exact File & Lines:** [`src/core/domain/PoreWorkshop.ts:650`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L650), [`664-665`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L664-L665), [`712-737`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L712-L737)
- **Code Quote:**
  ```ts
  if (isRingHead) {
    ...
    gate.inputA = coupledDrive ? tailNot.output : !tailNot.output;
  } else ... {
    const isRingTail = isOddRing && ringIdx === contiguousNotRun.length - 1;
    gate.inputA = isRingTail ? !childGate.output : childGate.output;
  }
  ...
  gate.output = this.evaluateGate(gate.type, gate.inputA, gate.inputB); // !gate.inputA
  ```
- **Mathematical & Algorithmic Critique:**
  In Round 2, we proved that evaluating `[GATE_NOT, GATE_NOT, GATE_NOT]` synchronously in a single tick caused $G_2(t) \equiv G_0(t)$, locking the ring in a static fixed point. Rather than implementing genuine sequential state propagation ($G_i(t) = \neg G_{(i-1)\bmod 3}(t-1)$, which produces a $2N = 6$-tick traveling wave), the developer inserted `isRingTail ? !childGate.output : childGate.output` on line 665. Because `evaluateGate(GATE_NOT, inputA)` computes `!inputA`, the 3rd `GATE_NOT` (`G2`) computes:
  $$G_2(t) = \neg(\neg G_1(t)) = G_1(t) \quad \forall t$$
  The 3rd `GATE_NOT` gate is **not an inverter at all**—it is a hardcoded **non-inverting identity buffer**! Worse still, examine what happens under the two possible values of `coupledDrive` (`streamA`):
  1. **When `streamA = false` (`step(false, false, false)`, which is the only case `MotifScanner.detectRingOscillator` tests at line 139):**
     `isRingHead` (`G0`) ALSO sets `inputA = !tailNot.output`, so $G_0(t) = \neg(\neg G_2(t-1)) = G_2(t-1)$. Thus **two out of the three `GATE_NOT` gates (`G0` and `G2`) are non-inverting buffers**, leaving only a single inverter (`G1`) toggling with period 2 (`011 <-> 100`) instead of period 6!
  2. **When `streamA = true` (`step(true, true, false)`, i.e., when hydrothermal vent fuel is present so the cell can actually metabolize):**
     `G0` inverts $G_2(t-1)$ ($G_0(t) = \neg G_2(t-1)$), `G1` inverts $G_0(t)$ ($G_1(t) = \neg G_0(t) = G_2(t-1)$), and `G2` (`isRingTail`) copies $G_1(t)$ ($G_2(t) = G_1(t) = G_2(t-1)$). **Two inversions compose to the identity function!** Starting from $G_2(0) = 0$, the "Ring Oscillator" **freezes permanently in state `100` (`primaryOutput = false`, `catalyticYield = 0`) for all $t \ge 0$ whenever fuel is present!**
  3. **Bistable Latch Lockup (`lines 712-725`):** In `[GATE_OR, GATE_AND]`, line 720 (`gate.inputA = (effA && effB) || gate.output`) completely ignores `leftBranch.output` (`GATE_OR`'s output) and restricts `[OR, AND]` to `operonGates.length === 2` (line 718). Furthermore, because reset requires `tActive = hasActiveToxinPorin && toxinT`, a genome `[PORIN_STREAM_A, PORIN_STREAM_B, GATE_AND, GATE_OR, SINK_BATTERY]` (without `PORIN_TOXIN_T`) is certified as a `BISTABLE_LATCH` by `MotifScanner` (because `wReset` starts cold at `false`), yet once set by `(1,1,0)`, it locks to `true` forever and **can never be reset even when `toxinT = true`**!

---

## Battlefront 2: Host-Side Oracles & Stateful Probe Cross-Contamination (`SimulationWorld.ts`, `PoreCell.ts`, `TreadmillingEngine.ts`)

### Proof 2A: 0-Porin Dead Genome `[GATE_NOT]` Grants Permanent Predation Shield & 100% Scavenging
- **Exact File & Lines:** [`src/engine/SimulationWorld.ts:882`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L882), [`897`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L897), [`906`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L906), [`1307`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1307)
- **Code Quote:**
  ```ts
  const hasWeapon = gates.length >= 2 && gates.some(g => g.type === 'GATE_NOT' && g.output);
  ...
  const preyShield = preyGates.some(g => g.type === 'GATE_NOT' && g.output) || targetPore.getEps() >= 0.5;
  ...
  const isCatabolicScavenger = gates.some(g => (g.type === 'GATE_OR' || g.type === 'GATE_NOT') && g.output);
  ```
- **Mathematical & Algorithmic Critique:**
  Consider a dead genome `[GATE_NOT, INTRON_SILENT x 5]` with **0 sensory porins** and **0 battery sinks**. Because `boundTerminalA === null`, `resolvePorinSignal` returns `false`, and `GATE_NOT` outputs `!false = true` on every tick forever. Because `SimulationWorld.ts` merely checks `gates.some(g => g.type === 'GATE_NOT' && g.output)` without verifying that `GATE_NOT` is wired to any sensory porin, this 0-porin dead genome is granted **permanent predation immunity (`preyShield = true`)** and **100% catabolic scavenging efficiency (`isCatabolicScavenger = true`)**! Similarly, `hasWeapon` (line 897) grants contact predation without requiring `PORIN_MECHANO_TOUCH` or `PORIN_ELECTRO_REDOX`.

### Proof 2B: Repressed `SINK_SEPTUM` Grants Colonial Adhesion & Silent Introns Dictate 3D Body Plan
- **Exact File & Lines:** [`src/core/domain/PoreCell.ts:330-357`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts#L330-L357)
- **Code Quote:**
  ```ts
  const hasSeptum = trans.sinkNodes.some(s => s.definition.type === CodonType.SINK_SEPTUM);
  const hasOperator = trans.instructions.some(inst => inst.definition.type === CodonType.REGULATORY_OPERATOR);
  const isExpandedGenome = tape.length > 60;
  const hasAdhesion = (hasSeptum && (hasOperator || isExpandedGenome)) || this.syncytiumId !== null;
  ...
  if (trans.instructions.length >= 3) {
    const c0 = trans.instructions[0].codonIndex;
    const c1 = trans.instructions[1].codonIndex;
    const c2 = trans.instructions[2].codonIndex;
    const hash = (c0 * 17 + c1 * 31 + c2 * 53) >>> 0;
    primaryDirection = hash % 6;
    symmetryMode = Math.floor(hash / 6) % 4;
  }
  ```
- **Mathematical & Algorithmic Critique:**
  1. `getMorphogeneticPlan()` inspects raw unexpressed `trans.sinkNodes` rather than `this.workshop.hasSeptum()`. When `SINK_SEPTUM` is placed inside a **repressed operon** (e.g., after `OP_REG2` when `toxinT = false`), `cell.hasSeptum()` is `false`, yet `getMorphogeneticPlan().hasAdhesion` evaluates to `true`, forcing incomplete cytokinesis and multicellular syncytium formation on `reproduce()`!
  2. Lines 343–348 hash `trans.instructions[0..2].codonIndex` directly—including silent non-coding introns (`CodonType.INTRON_SILENT`, indices `56, 57, 58, 59`). Mutating silent introns `56, 56, 56` to `57, 58, 59` changes `primaryDirection` from `4` to `2`, violating the definition of silent non-coding introns.

### Proof 2C: `TreadmillingEngine.ts` Stateful Probe Cross-Contamination Across Candidates
- **Exact File & Lines:** [`src/engine/kinematics/TreadmillingEngine.ts:56`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L56), [`83-98`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L83-L98), [`100-117`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L100-L117)
- **Code Quote:**
  ```ts
  const probeWorkshop = PoreWorkshop.fromBitstring(cell.getSafe().getTape());
  ...
  for (let i = 0; i < candidatePores.length; i++) {
    ...
    const probeTele = probeWorkshop.stepTick(...);
    const netFreeEnergy = probeTele.catalyticYield * 8 - probeTele.toggleCount * 2 - (probeTele.toxinIngested ? 25 : 0);
  ```
- **Mathematical & Algorithmic Critique:**
  `probeWorkshop` is instantiated **once** outside the `for (let i = 0; i < candidatePores.length; i++)` loop. When `i = 0` (`candA`) is evaluated, `probeWorkshop` starts cold with `gate.output = false`. Stepping `candA` transitions `GATE_AND` from `false -> true`, incurring `toggleCount = 1` (`netFreeEnergy = 16 - 2 = 14`). Because `probeWorkshop` is not reset or re-instantiated for `i = 1` (`candB`), `candB` inherits `gate.output = true`, so stepping `candB` under the exact same environment incurs `toggleCount = 0` (`netFreeEnergy = 16 - 0 = 16`)! Swapping `[candA, candB]` to `[candB, candA]` reverses the winner. Furthermore, lines 101–103 and 115–117 still inject host-oracle `(parentDistToVent - distToVent) * 12` and `adjacentPrey.length * 22` even when the cell has zero `PORIN_MECHANO_TOUCH` or `PORIN_ELECTRO_REDOX` porins.

---

## Battlefront 3: Digital Paleontology, Nomenclature & Pre-Baked Genomes (`MotifScanner.ts`, `TaxonomyNomenclature.ts`, `EnvironmentPresetRegistry.ts`, `BioBank.ts`)

### Proof 3A: `MotifScanner.ts` Certifies 0-Porin Dead Genomes & Reads Repressed Porins
- **Exact File & Lines:** [`src/core/paleontology/MotifScanner.ts:189-374`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L189-L374)
- **Mathematical & Algorithmic Critique:**
  1. **`COHERENT_FFL` & `INCOHERENT_FFL` on 0-Porin Dead Genomes (`lines 189-218`):** `detectCoherentFFL` checks `gates.length >= 3 && gates[0].type === GATE_AND && gates[1].type === GATE_OR && lastGate.type === GATE_AND` without checking porins or AST edges. Not only does a **0-porin dead genome** `[GATE_AND, GATE_OR, GATE_AND]` pass, but in `PoreWorkshop`'s Stack-AST, `[GATE_AND, GATE_OR, GATE_AND]` builds a 2-leaf parallel merge tree (`0 -> 2` and `1 -> 2`) with **no feed-forward edge `0 -> 1`**!
  2. **`NEGATIVE_AUTOREGULATION` on a 1-Gate 0-Edge Genome (`lines 220-229`):** A 0-porin `[GATE_NOT]` genome with `getAstEdges().length === 0` is certified as `NEGATIVE_AUTOREGULATION`.
  3. **`TEMPORAL_DERIVATIVE_CHEMOTAXIS` & `CRYPTOBIOTIC_DORMANCY_CLAMP` on 0-Porin Dead Genomes (`lines 231-258, 344-374`):** Because `workshop.getOperons().length >= 2` satisfies `hasTemporalOrGradientCoupling` and `hasStressClampCoupling` without requiring any porin, the **0-porin dead genomes** `[GATE_AND, GATE_NOT, GATE_AND, OP_REG0]` and `[GATE_NOT, GATE_NOT, GATE_OR, OP_REG0]` are certified as `TEMPORAL_DERIVATIVE_CHEMOTAXIS` and `CRYPTOBIOTIC_DORMANCY_CLAMP`!
  4. **Repressed Porin Leakage (`lines 273-279, 299-305, 327-333`):** `detectPredictivePavlovian`, `detectEntrainedPacemaker`, and `detectSteinerVascularNetwork` call `workshop.hasPorinT()`, `workshop.hasPhotonIr()`, `workshop.hasEps()`, etc. Those getters return genome-wide flags set during translation (including **repressed operons**). Thus `[GATE_NOT, GATE_AND, GATE_OR, OP_REG2, PORIN_TOXIN_T]` (where `PORIN_TOXIN_T` is locked in repressed Operon 1 and 0 porins are expressed) is falsely certified as `PREDICTIVE_PAVLOVIAN`.

### Proof 3B: `TaxonomyNomenclature.ts` Bag-of-Codons & Repressed-Operon Misclassifications
- **Exact File & Lines:** [`src/core/paleontology/TaxonomyNomenclature.ts:387-445`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L387-L445)
- **Mathematical & Algorithmic Critique:**
  1. **Non-Oscillating `Chronobacterium johnsonii` (`lines 417-422`):** Checks `if (notCount >= 3)` without checking contiguity (`hasContiguousOddNotRun`). Thus `[PORIN_STREAM_A, GATE_NOT, GATE_NOT, GATE_AND, GATE_NOT]` (which has an even 2-NOT run and 1 isolated NOT, and never oscillates) is classified as `Chronobacterium johnsonii`.
  2. **Memoryless `Bistabilus collinsii` (`lines 439-442`):** Checks `if (gates.includes('AND') && gates.includes('OR') && notCount === 0 && gateCount >= 2)`. A 3-gate purely combinational tree `[PORIN_A, PORIN_B, GATE_AND, GATE_AND, GATE_OR, SINK_BATTERY]` (which has zero feedback and fails `MotifScanner.detectBistableLatch`) is classified as `Bistabilus collinsii`.
  3. **Repressed Operon Codon Scanning (`lines 380-409`):** Slices the raw `tapeBitstring` into 6-bit `codonValues` across the entire genome, ignoring operon repression. A cell whose `PORIN_STREAM_C` codon is locked inside a repressed `OP_REG2` operon is still classified as `Citratovibrio lenskii`.

### Proof 3C: Botched Pre-Baked Genomes in `EnvironmentPresetRegistry.ts` & `BioBank.ts`
- **Exact File & Lines:** [`src/engine/storage/EnvironmentPresetRegistry.ts:267-514`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L514) and [`src/engine/storage/BioBank.ts:243-258`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L243-L258)
- **Mathematical & Algorithmic Critique:**
  1. **All 10 Founder Strains in `EnvironmentPresetRegistry.ts` Have `catalyticYield === 0`:** Every single `founderStrains` entry across all 5 built-in presets (`twin-smokers`, `lost-city-alkaline`, `black-smoker-basalt`, `hadal-brine-pool`, `ltee-chemostat`) pads the last 36–42 bits of its 60-bit `tapeBitstring` with `'000000'` (`CodonType.GATE_AND`, index 0) instead of `'111000'` (`INTRON_SILENT`, index 56), and omits `SINK_BATTERY` (`110000`, index 48). Consequently, every preset founder strain builds 7–8 `GATE_AND` gates with `hasBattery() === false` and produces **`catalyticYield === 0` under all possible environmental inputs**!
  2. **Botched `Wolpert Branching Metazoan` in `BioBank.ts` (`lines 243-258`):** Hardcodes `generation: 3450, isDifferentiated: true, bodyTopology: 'DENDRITIC'`, and comments `'011100' + '101100', // EPS (28), Regulatory Operator (44)`. But in `CodonTable.ts`, index `44` (`101100`) is `PORIN_TOXIN_T` (regulatory operators are `60..63`), and its sinks are `'110000' + '110000'` (`SINK_BATTERY` x 2, lacking `SINK_SEPTUM` `52`). When instantiated, it has **0 regulatory operators (1 operon), `hasAdhesion === false`, and `preferredTopology === 'SOLITARY'`**!

---

## Battlefront 4: UI/Autopsy Blindness & Telemetry Fabrication (`CircuitAutopsyModal.ts`, `SimulationWorld.ts`)

### Proof 4A: `CircuitAutopsyModal.ts` Cold 1-Tick Instantiation Erases Sequential Memory
- **Exact File & Lines:** [`src/ui/CircuitAutopsyModal.ts:501`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L501), [`535`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L535), [`652`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L652)
- **Code Quote:**
  ```ts
  private evaluateCircuitState(a: boolean, b: boolean, t: boolean) {
    const tape = this.pore.tapeBitstring ?? '';
    const workshop = PoreWorkshop.fromBitstring(tape);
    const step = workshop.step(a, b, t);
  ```
- **Mathematical & Algorithmic Critique:**
  `evaluateCircuitState()` instantiates a brand-new cold `PoreWorkshop.fromBitstring(tape)` on every truth-table row and oscilloscope sample and steps it once. A warm `BISTABLE_LATCH` holds `primaryOutput === true` on input `(0, 0, 0)`, whereas `evaluateCircuitState(false, false, false)` always reports `primaryOutput === false`, making the autopsy modal blind to sequential memory and multi-tick oscillation.

### Proof 4B: `SimulationWorld.ts` Telemetry Yield Fabrication
- **Exact File & Lines:** [`src/engine/SimulationWorld.ts:1484-1486`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1484-L1486)
- **Code Quote:**
  ```ts
  if (catYield === 0 && active) {
    catYield = 2;
  }
  ```
- **Mathematical & Algorithmic Critique:**
  In `exportTelemetry()`, whenever a cell's actual `catalyticYield` is `0` (e.g., because it lacks `SINK_BATTERY` or is a 0-porin `[GATE_NOT]` cell) but its last gate output is `true` (`active === true`), lines 1484–1486 overwrite `catYield` with a fabricated `2`!

---

## Battlefront 5: Endosymbiosis Self-Genome Overwrite, Sporulation Organelle Erasure & First-Law Conservation Leaks (`SimulationWorld.ts`, `Pore.ts`)

### Proof 5A: Endosymbiosis Overwrites Donor Genome Before `installOrganelle` & Sporulation Erases Organelles
- **Exact File & Lines:** [`src/engine/SimulationWorld.ts:1006-1015`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1006-L1015), [`1130-1133`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1130-L1133), [`1255`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1255)
- **Code Quote (`SimulationWorld.ts:1130-1133`):**
  ```ts
  cellA.adoptChimericGenome(chimericSafeA, chimericCladeId);
  cellB.adoptChimericGenome(chimericSafeB, chimericCladeId);
  cellA.installOrganelle(cellB.getSafe());
  cellB.installOrganelle(cellA.getSafe());
  ```
- **Mathematical & Algorithmic Critique:**
  1. **Self-Genome Overwrite Bug (`lines 1130-1133`):** `adoptChimericGenome` overwrites `this.safe` on both `cellA` and `cellB` *before* `cellB.getSafe()` and `cellA.getSafe()` are passed to `installOrganelle()`. As a result, `cellA` and `cellB` install the fused chimeric genome as their organelle instead of their partner's original donor genome!
  2. **Pelagic Sporulation Organelle Erasure (`lines 1006-1015 & 1255`):** When an endosymbiotic cell reproduces into an aqueous pore via pelagic sporulation, `cell.reproduce()` copies `organelleSafe` onto `daughter`, but `aqueous[0].setSpore({ safe: daughter.getSafe(), ... })` omits `organelleSafe` from `IPelagicSpore`, permanently erasing the endosymbiotic organelle upon germination!

### Proof 5B: Three First-Law Thermodynamic Conservation Leaks ($\Delta E \neq 0, \Delta M \neq 0$)
- **Exact Files & Lines:**
  1. [`src/engine/SimulationWorld.ts:1337`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1337) (`stepLysisAndScavenging`)
  2. [`src/engine/SimulationWorld.ts:2303-2310`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2303-L2310) and [`2406-2412`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2406-L2412) (`loadEnvironmentPreset` with `preserveCells = true`)
  3. [`src/core/domain/Pore.ts:104`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/Pore.ts#L104) (`Pore.setResident`)
- **Mathematical & Algorithmic Critique:**
  1. **Leak 1 — Unspecialized Autotroph Scavenging (`SimulationWorld.ts:1337`):** When an unspecialized autotroph (`isCatabolicScavenger === false`) scavenges an adjacent carcass, line 1337 calls `targetCarcass.clear()` instead of `targetCarcass.clearCarcass()`. If `targetCarcass` also holds a co-located pelagic spore (`35 E, 18 M`), `targetCarcass.clear()` vaporizes the spore without recording its energy or matter to `this.ledger`, violating First-Law conservation by $|\Delta E| = 35, |\Delta M| = 18$!
  2. **Leak 2 — `loadEnvironmentPreset(preset, true)` (`SimulationWorld.ts:2303-2412`):** When `preserveCells = true`, `this.ledger` is not reset, yet only living residents are saved (`savedCells`), while all carcasses and pelagic spores in the world—plus any saved cells whose coordinates become basalt, aqueous, or out-of-bounds in the new preset—are destroyed without recording heat dissipation or matter sedimentation to `this.ledger` ($|\Delta E| = 40, |\Delta M| = 25$ in our test case)!
  3. **Leak 3 — `Pore.setResident()` Carcass Overwrite (`Pore.ts:104`):** `Pore.setResident(cell)` sets `this.carcass = null` without returning or accounting for any existing carcass energy/matter on the pore.

---

## Verification Execution Log

```text
$ node "Adversarial QA/falsification_suite_round3.mjs"
================================================================================
 DEMBSKI PROTOCOL — ROUND 3 DEEP-WEEDS ADVERSARIAL FALSIFICATION SUITE
================================================================================

[PROOF 1A] Teleological Porin Censoring & Forced Antitoxin Wiring (PoreWorkshop.ts:133-143, 165-177)...
  -> VERIFIED: Positional porin binding is overridden by hardcoded toxin/antitoxin rules (I+ = 3.17 bits).
[PROOF 1B] Free Virtual AND Gate & Free Battery Translocator for 0-Gate, 0-Battery Genomes (PoreWorkshop.ts:488-509)...
  -> VERIFIED: 0-gate, 0-battery genome gets free virtual AND + free battery access (yield=6, toggles=0), penalizing gate evolution.
[PROOF 1C] Potemkin Sequential Physics: isRingTail Non-Inverting Buffer & Hardcoded Latch Overrides (PoreWorkshop.ts:664-737)...
  -> VERIFIED: 3rd NOT gate in ring oscillator is a non-inverting buffer (G2 === G1), freezes at 100 under fuel, and latch rules are hardcoded overrides.
[PROOF 2A] 0-Porin Dead Genome [GATE_NOT] Grants Permanent Predation Shield & 100% Scavenging (SimulationWorld.ts:897, 906, 1307)...
  -> VERIFIED: 0-porin [GATE_NOT] genome has permanent preyShield=true & isCatabolicScavenger=true; predator needs 0 contact/redox porins.
[PROOF 2B] Repressed SINK_SEPTUM Grants Colonial Adhesion & Silent Introns Dictate 3D Body Plan (PoreCell.ts:330-352)...
  -> VERIFIED: Repressed SINK_SEPTUM grants hasAdhesion=true; silent introns change topology (DENDRITIC/dir=4 vs DENDRITIC/dir=2).
[PROOF 2C] TreadmillingEngine Stateful Probe Cross-Contamination Across Candidates (TreadmillingEngine.ts:56, 83)...
  -> VERIFIED: Single probeWorkshop instance cross-contaminates sequential candidate evaluations in TreadmillingEngine.
[PROOF 3A] MotifScanner False Positives on 0-Porin Dead Genomes & Repressed Porins (MotifScanner.ts)...
  -> VERIFIED: MotifScanner certifies 0-porin dead genomes as FFLs, NAR, Chemotaxis, Dormancy, and reads repressed porins.
[PROOF 3B] TaxonomyNomenclature Bag-of-Codons & Repressed-Operon Misclassifications (TaxonomyNomenclature.ts:387-445)...
  -> VERIFIED: TaxonomyNomenclature misclassifies non-oscillating NOTs as Chronobacterium johnsonii, combinational gates as Bistabilus collinsii, and repressed porins as Citratovibrio lenskii.
[PROOF 3C] Botched Pre-Baked Genomes in EnvironmentPresetRegistry.ts & BioBank.ts...
  -> VERIFIED: All 10 EnvironmentPresetRegistry founder strains have catalyticYield=0; BioBank Wolpert Metazoan is SOLITARY with 0 operators.
[PROOF 4A & 4B] Cold 1-Tick Autopsy Blindness (CircuitAutopsyModal.ts:652) & Telemetry Yield Fabrication (SimulationWorld.ts:1484)...
  -> VERIFIED: Cold 1-tick autopsy is blind to sequential memory, and SimulationWorld fabricates telemetry yield=2 for 0-yield cells.
[PROOF 5A] Endosymbiosis Self-Genome Overwrite Bug & Sporulation Organelle Erasure (SimulationWorld.ts:1006, 1130-1133)...
  -> VERIFIED: Endosymbiosis overwrites donor genome with chimericSafe before installOrganelle; sporulation erases organelles.
[PROOF 5B] First-Law Thermodynamic Conservation Violations (SimulationWorld.ts:1337, 2303-2412 & Pore.ts:104)...
  -> VERIFIED: First-Law conservation violated in scavenging (|ΔE|=35, |ΔM|=18), preset reload (|ΔE|=40, |ΔM|=25), and Pore.setResident.

================================================================================
 ALL 12 ROUND 3 DEMBSKI FALSIFICATION PROOFS PASSED EMPIRICALLY (100% VERIFIED)
================================================================================
```
