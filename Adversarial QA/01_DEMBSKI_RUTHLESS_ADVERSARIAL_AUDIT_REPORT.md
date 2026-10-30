# THE DEMBSKI PROTOCOL: ZERO-CHARITY ADVERSARIAL AUDIT OF SILIQUARIUM

**Auditor:** Dr. William A. Dembski, Senior Fellow in Information Theory, Mathematics, and Conceptual Foundations of Evolutionary Computation (in collaboration with Robert J. Marks II & David Berlinski)  
**Target Repository:** `h:\My Drive\Repos\Siliquarium`  
**Empirical Verification Script:** [`Adversarial QA/falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs)  
**Audit Date:** October 17, 2026  
**Overall Verdict:** **CRITICAL EPISTEMIC FRAUD, POTEMKIN MOTIF ILLUSION ($100\%$ FALSE POSITIVE RATE), SPLIT-BRAIN UI/ENGINE DECEPTION, & HOST-ORACLE BEHAVIORAL SMUGGLING ($I_+ \gg 0$)**

---

## EXECUTIVE SUMMARY: THE POTEMKIN HYDROTHERMAL VENT

Siliquarium presents itself—including in its own self-congratulatory test suite ([`tests/stage24_adversarial_zero_smuggling_audit.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/tests/stage24_adversarial_zero_smuggling_audit.mjs))—as an "authentic," "non-teleological," "Zero-Smuggling ($I_+ = 0$)" digital evolution observatory where Uri Alon network motifs, Alan Turing parity discriminators, Michael Elowitz ring oscillators, James Collins bistable toggle latches, Edward Purcell chemotaxis engines, Ivan Pavlov anticipatory regulators, and Eberhard Schnepf kleptoplasts emerge *de novo* from undirected prebiotic chemistry.

**Every single one of those flagship claims is a mathematical and algorithmic illusion.**

When subjected to a zero-charity inspection of the TypeScript source code and empirical falsification via [`Adversarial QA/falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs), Siliquarium's evolutionary narrative collapses into five distinct categories of programmer smuggling and architectural deceit:

1. **Hardcoded Test-Passing AST Template & Sensory Short-Circuiting (`PoreWorkshop.ts`)**:
   To pass Stage 24's synthetic 4-gate XOR test without implementing a general Prefix/Postfix Boolean Abstract Syntax Tree (AST), the developer hardcoded a brittle `else if` pattern match in [`PoreWorkshop.evaluateGateInAstContext()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L608-L634) that checks specifically for the 4-gate sequence `[AND/OR, AND/OR, NOT, AND/OR]`. Commuting the two branches of the exact same XOR formula (`(A | B) & ~(A & B)` $\to$ `~(A & B) & (A | B)`, i.e. `[AND, NOT, OR, AND]`) completely breaks the AST and evaluates to `[false, false, true, true]` ($A$) instead of XOR! Worse still, for any 4-gate circuit whose 3rd gate is not `GATE_NOT` (such as `[AND, OR, AND, OR]`), lines 625–634 **orphan Gate 0 completely**—its output is connected to nothing in `astEdges`, yet the organism is billed Landauer energy for its toggles. Meanwhile, lines 588–589 (`const effA = aActive || boundA; const effB = bActive || boundB;`) **short-circuit and overwrite all sensory porin bindings** whenever `Stream A` and `Stream B` are active.
2. **Split-Brain UI vs. Engine Deception (`CircuitTopology.ts` & `CircuitAutopsyModal.ts`)**:
   While [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L561-L651) was patched to evaluate the hardcoded 4-gate XOR template for headless Node.js tests, **neither [`CircuitTopology.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/CircuitTopology.ts#L168-L187) nor [`CircuitAutopsyModal.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L492-L551) was updated to use `PoreWorkshop`!** Both UI systems still evaluate a 1D serial daisy-chain (`inA = i === 0 ? aActive : prevOutput`) with a dead-code feedback check (`if (i === 0 && hasFeedback && gateOutputs.length > 0)` where `gateOutputs.length` is always `0` when `i === 0`!). Consequently, when a user opens the CAD Autopsy Modal on the flagship 4-gate composite XOR organism, the engine computes `[false, true, true, false]` (XOR), while the UI Truth Table, Oscilloscope, and Schematic Canvas display `[false, false, false, false]` (a 100% dead circuit)!
3. **"Bag-of-Gates" Paleontology Fraud (`MotifScanner.ts` & `TaxonomyNomenclature.ts`)**:
   [`MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L17-L230) claims to be an "external voltmeter" detecting 11 canonical Systems Biology and Proto-Cognitive network motifs. In reality, **it never inspects a single wire, directed edge (`astEdges`), feedback loop, state transition, or truth table.** Every `detect*` method merely counts how many `GATE_AND`, `GATE_OR`, and `GATE_NOT` tokens exist in `workshop.getGates()`. A single degenerate 4-gate tape `[AND, AND, OR, NOT]` (whose actual Boolean function is just $\neg A$) is simultaneously awarded **six** mutually exclusive motifs: `HALF_ADDER` (0.95), `BISTABLE_LATCH` (0.85), `COHERENT_FFL` (0.80), `INCOHERENT_FFL` (0.80), `TEMPORAL_DERIVATIVE_CHEMOTAXIS` (0.90), and `PREDICTIVE_PAVLOVIAN` (0.92). Even more absurdly, `detectRingOscillator` awards `RING_OSCILLATOR` (Elowitz's Repressilator) to `[NOT, NOT, NOT]`, even though `GATE_NOT` in `PoreWorkshop` is a purely feed-forward unary inverter with **zero feedback loop**—it outputs a static constant `true` forever with **zero oscillations**! Across 2,000 random prebiotic genomes, `MotifScanner` exhibits a **100.0% false positive rate** for `HALF_ADDER`, a **100.0% false positive rate** for `RING_OSCILLATOR`, and a **99.9% false positive rate** for `BISTABLE_LATCH`.
4. **Host-Oracle Behavioral Smuggling & Repressed-Operon Ghosts (`SimulationWorld.ts`, `TreadmillingEngine.ts`, `PoreCell.ts`)**:
   Complex ecological behaviors—contact predation weaponry, antipredator shields, catabolic carcass scavenging, endosymbiosis syntrophy, chemotaxis, and colonial adhesion—are **not** computed by evolved circuits. They are granted by host-side JavaScript `if/else` checks that inspect raw codon arrays (`gates.some(g => g.type === CodonType.GATE_NOT)`). Worse, because [`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L896-L907) and [`MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L19) call `workshop.getGates()` (which returns **all** gates in the genome, including repressed operons where `isExpressed === false`) instead of `workshop.getBuiltGates()`, an organism with a **repressed, unexpressed `GATE_NOT` codon** is granted 100% immunity to predators (`preyShield = true`), predatory attack capability (`hasWeapon = true`), catabolic scavenging (`isCatabolicScavenger = true`), and Uri Alon motif milestones!
5. **Pre-Engineered Genome Injection & Sparse Engine Comatose Bugs (`EnvironmentPresetRegistry.ts`, `BioBank.ts`, `SimulationWorld.ts`)**:
   All 5 built-in geological presets in [`EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L514) and all 3 default strains in [`BioBank.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L212-L259) inject hand-crafted 60-bit founder genomes (`100000100110...`) with pre-assembled `PORIN_STREAM_A` + `PORIN_STREAM_B` + `GATE_AND` / `SINK_BATTERY` codons ($I_+ \ge 18\text{ bits}$). Furthermore, the newly introduced "Sparse Active Pore Engine" (`this.activePores`) in [`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L108) forgot to call `this.registerActivePore()` inside [`inoculateCell()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1758-L1770), [`stepSpores()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1254-L1257), and [`loadEnvironmentPreset()` (when `preserveCells=true`)](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L2427-L2433)—meaning any cell inoculated by the user or germinated from a pelagic spore into an already-running world is **born in a permanent coma (frozen at age 0 forever)**!

---

## SECTION 1: THE `PoreWorkshop.ts` AST & SENSORY BINDING AUDIT

### 1.1 Violation 1A: Sensory Porin Short-Circuit Contamination (`effA = aActive || boundA`)
* **Classification:** `CRITICAL EPISTEMIC FRAUD` / `SENSORY SHORT-CIRCUIT SMUGGLING`
* **Location:** [`src/core/domain/PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L575-L590)

#### Exact Code Quote:
```typescript
// src/core/domain/PoreWorkshop.ts, lines 575-590
    const boundA = this.resolvePorinSignal(
      gate.boundTerminalA,
      aActive, bActive, cActive, dActive, tActive,
      photonActive, baroActive, mechanoActive, electroActive,
      aActive
    );
    const boundB = this.resolvePorinSignal(
      gate.boundTerminalB,
      aActive, bActive, cActive, dActive, tActive,
      photonActive, baroActive, mechanoActive, electroActive,
      bActive
    );

    const effA = aActive || boundA;
    const effB = bActive || boundB;
```

#### Mathematical & Algorithmic Proof of Failure:
In [`assembleFromTranslation()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L129-L134), each gate is assigned `boundTerminalA` and `boundTerminalB` from the expressed porin sequence:
$$\text{termA} = \text{effectivePorins}[(2i) \bmod k], \quad \text{termB} = \text{effectivePorins}[(2i + 1) \bmod k]$$
In [`tests/stage24_adversarial_zero_smuggling_audit.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/tests/stage24_adversarial_zero_smuggling_audit.mjs#L98-L110), the developer claimed to verify that "Physical sensory porins wire directly into catalytic AST gate terminals" by testing a genome that had **no `PORIN_STREAM_A` and no `PORIN_STREAM_B`** under `streamA = false, streamB = false`.

Why did the test carefully set `streamA = false, streamB = false`? Because in [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L588-L589), the developer wrote:
$$\text{effA} = \text{aActive} \lor \text{boundA}, \quad \text{effB} = \text{bActive} \lor \text{boundB}$$
By the Domination Law of Boolean Algebra ($1 \lor X \equiv 1$):
Whenever an organism expresses `PORIN_STREAM_A` and `PORIN_STREAM_B` (which is required for basal hydrothermal survival) and is in a Stream A + Stream B plume ($\text{aActive} = 1, \text{bActive} = 1$), we have:
$$\text{effA} = 1 \lor \text{boundA} = 1, \quad \text{effB} = 1 \lor \text{boundB} = 1$$
**regardless of the state of `boundA` and `boundB`!**
* If Gate 0 is bound to `PORIN_PHOTON_IR` ($\text{boundA} = 0$) and `PORIN_MECHANO_TOUCH` ($\text{boundB} = 0$), Gate 0 still receives $\text{effA} = 1, \text{effB} = 1$ and fires `true`!
* If Gate 0 is bound to `PORIN_TOXIN_T` ($\text{boundA} = 0$) and `PORIN_BARO_ACOUSTIC` ($\text{boundB} = 0$), Gate 0 still receives $\text{effA} = 1, \text{effB} = 1$ and fires `true`!
* Conversely, why did the developer insert `aActive || boundA` in the first place? Because if a genome has `[PORIN_PHOTON_IR, PORIN_STREAM_A, PORIN_STREAM_B]`, Gate 0 gets `boundTerminalA = PORIN_PHOTON_IR`. Without `aActive || boundA`, Gate 0 would fail to see `Stream A` when `photonIr = false`. Rather than letting evolution select for proper porin-to-gate codon ordering, the developer smuggled in a universal `aActive ||` and `bActive ||` override that destroys specific sensory transduction whenever fuel streams A and B are present!

---

### 1.2 Violation 1B: Hardcoded 4-Gate XOR Template & Orphaned Gate AST Corruption
* **Classification:** `CRITICAL EPISTEMIC FRAUD` / `BENCHMARK-TAILORED AST SMUGGLING`
* **Location:** [`src/core/domain/PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L608-L634) and [`src/core/paleontology/WeisfeilerLehmanHasher.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/WeisfeilerLehmanHasher.ts#L57-L74)

#### Exact Code Quote:
```typescript
// src/core/domain/PoreWorkshop.ts, lines 608-634
    } else if (
      idx >= 3 &&
      expressedSoFar[idx - 1].type === CodonType.GATE_NOT &&
      (expressedSoFar[idx - 2].type === CodonType.GATE_AND || expressedSoFar[idx - 2].type === CodonType.GATE_OR) &&
      (expressedSoFar[idx - 3].type === CodonType.GATE_AND || expressedSoFar[idx - 3].type === CodonType.GATE_OR)
    ) {
      // Binary AST merge of two parallel branches: e.g. Branch 1 = G_{idx-3}, Branch 2 = NOT(G_{idx-2}) = G_{idx-1}
      const leftBranch = expressedSoFar[idx - 3];
      const rightBranch = expressedSoFar[idx - 1];
      gate.leftChildGateId = leftBranch.id;
      gate.rightChildGateId = rightBranch.id;
      gate.inputA = leftBranch.output;
      gate.inputB = rightBranch.output;
      analogA = leftBranch.analogOutput ?? (leftBranch.output ? 1.0 : 0.0);
      analogB = rightBranch.analogOutput ?? (rightBranch.output ? 1.0 : 0.0);
      this.astEdges.push({ fromGateId: leftBranch.id, toGateId: gate.id, inputPin: 'A' });
      this.astEdges.push({ fromGateId: rightBranch.id, toGateId: gate.id, inputPin: 'B' });
    } else if (
      idx === 1 &&
      this.gates.length >= 4 &&
      (gate.type === CodonType.GATE_AND || gate.type === CodonType.GATE_OR) &&
      (expressedSoFar[0].type === CodonType.GATE_AND || expressedSoFar[0].type === CodonType.GATE_OR)
    ) {
      // Second parallel leaf branch in a >=4-gate composite AST
      gate.inputA = effA;
      gate.inputB = effB;
    }
```

#### Mathematical & Algorithmic Proof of Failure:
A genuine Prefix or Postfix Boolean AST parser builds a tree of arbitrary depth from any valid sequence of unary (`NOT`) and binary (`AND`, `OR`) operators. Instead, [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L608-L634) contains a **hardcoded template recognizer** specifically engineered for the 4-gate sequence `[OR, AND, NOT, AND]` tested in [`tests/stage24_adversarial_zero_smuggling_audit.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/tests/stage24_adversarial_zero_smuggling_audit.mjs#L78-L93):

1. **Failure Under Commutation (`[AND, NOT, OR, AND]`)**:
   The Boolean expression for XOR is:
   $$A \oplus B = (A \lor B) \land \neg(A \land B) \equiv \neg(A \land B) \land (A \lor B)$$
   In postfix order:
   * Branch order 1 (`[OR, AND, NOT, AND]`): $G_0 = A \lor B$, $G_1 = A \land B$, $G_2 = \neg G_1$, $G_3 = G_0 \land G_2$. Because $G_2$ is `GATE_NOT`, $G_1$ is `GATE_AND`, and $G_0$ is `GATE_OR`, the hardcoded `else if` at line 608 fires and produces `[false, true, true, false]`.
   * Branch order 2 (`[AND, NOT, OR, AND]`): $G_0 = A \land B$, $G_1 = \neg G_0$, $G_2 = A \lor B$, $G_3 = G_1 \land G_2$. Here, at `idx = 2` ($G_2 = \text{OR}$), `idx === 1` is **false**, so $G_2$ is not recognized as a parallel leaf branch! And at `idx = 3` ($G_3 = \text{AND}$), `expressedSoFar[idx - 1].type` is `GATE_OR` (not `GATE_NOT`), so the binary merge at line 608 **fails to fire**! The circuit degenerates into a linear chain `[{"fromGateId":0,"toGateId":1,"inputPin":"A"},{"fromGateId":1,"toGateId":2,"inputPin":"A"},{"fromGateId":2,"toGateId":3,"inputPin":"A"}]` with truth table `[false, false, true, true]` ($A$)!
2. **Orphaned Gate 0 Corruption (`[AND, OR, AND, OR]`)**:
   Look at lines 625–634: whenever `this.gates.length >= 4` and $G_0, G_1 \in \{\text{AND}, \text{OR}\}$, $G_1$ (`idx === 1`) is forced to be an independent leaf node (`gate.inputA = effA; gate.inputB = effB`) with **no edge from $G_0$**.
   Then, if $G_2$ (`idx === 2`) is `AND` or `OR` (rather than `NOT`), $G_2$ falls into the `else` block (line 635) and takes its input strictly from `expressedSoFar[idx - 1]` ($G_1$), while $G_3$ (`idx === 3`) also falls into the `else` block and takes its input from $G_2$!
   **Result:** As proven in Proof 2 of [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs), `astEdges` for `[AND, OR, AND, OR]` is `[{"fromGateId":1,"toGateId":2,"inputPin":"A"},{"fromGateId":2,"toGateId":3,"inputPin":"A"}]`. **Gate 0 ($G_0$) is completely disconnected from the circuit—its output goes nowhere—yet the cell still pays Landauer energy every time $G_0$ toggles!**
3. **Totalgate Count Contamination (`this.gates.length >= 4`)**:
   Notice line 627 checks `this.gates.length >= 4` (total genome gates, including unexpressed repressed operons!) rather than expressed gates, meaning the presence of unexpressed gates in repressed operons alters the AST wiring of expressed Operon 0!

---

## SECTION 2: THE SPLIT-BRAIN UI vs. ENGINE DECEPTION (`CircuitTopology.ts` & `CircuitAutopsyModal.ts`)

### 2.1 Violation 2A: Three Incompatible Circuit Evaluators Producing Contradictory Truth Tables
* **Classification:** `CRITICAL EPISTEMIC FRAUD` / `SPLIT-BRAIN SCHEMATIC DECEPTION`
* **Locations:**
  1. Engine Evaluator: [`src/core/domain/PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L561-L651)
  2. Visualizer Evaluator: [`src/visualizers/CircuitTopology.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/CircuitTopology.ts#L168-L187)
  3. Autopsy Workbench Evaluator: [`src/ui/CircuitAutopsyModal.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L492-L551)

#### Exact Code Quotes:
```typescript
// 1. src/visualizers/CircuitTopology.ts, lines 166-187
    const hasFeedback = gates.length >= 2 && gates.some(g => g.definition.type === CodonType.GATE_NOT);

    for (let i = 0; i < gates.length; i++) {
      const g = gates[i];
      const gateType = g.definition.type;

      // Evaluate gate inputs
      let inA: boolean = i === 0 ? aActive : prevOutput;
      let inB: boolean = i === 0 ? bActive : (i % 2 === 1 ? aActive : bActive);
      if (i === 0 && hasFeedback && gateOutputs.length > 0) {
        inB = gateOutputs[gateOutputs.length - 1] || inB;
      }

      let out = false;
      if (gateType === CodonType.GATE_AND) out = inA && inB;
      else if (gateType === CodonType.GATE_OR) out = inA || inB;
      else if (gateType === CodonType.GATE_NOT) out = !inA;
      else out = inA;

      gateOutputs.push(out);
      prevOutput = out;
```

```typescript
// 2. src/ui/CircuitAutopsyModal.ts, lines 514-549
    const hasFeedback = gates.length >= 2 && gates.some(g => g.definition.type === CodonType.GATE_NOT);

    for (let i = 0; i < gates.length; i++) {
      const gateType = gates[i].definition.type;
      let input1: boolean = i === 0 ? aEff : prevOutput;
      let input2: boolean = i === 0 ? bEff : (i % 2 === 1 ? aEff : bEff);
      if (i === 0 && hasFeedback && gateOutputs.length > 0) {
        input2 = gateOutputs[gateOutputs.length - 1] || input2;
      }
      ...
    }

    let primaryActive = false;
    if (gates.length > 0) {
      primaryActive = gateOutputs[gates.length - 1];
      if (tEff && gates.some(g => g.definition.type === CodonType.GATE_NOT)) {
        primaryActive = false;
      }
    } else {
      primaryActive = hasA && hasB && aEff && bEff;
    }

    let yieldMultiplier = 0.0;
    if (primaryActive) {
      yieldMultiplier = 1.5 + gates.length * 0.5;
      if (tEff) yieldMultiplier = Math.max(0.5, yieldMultiplier - 1.0);
    }
```

#### Empirical & Mathematical Proof of Split-Brain Deception:
Look at what happens when we pass the developer's own flagship 4-gate composite XOR genome (`compositeXorTape = PORIN_A + PORIN_B + OR + AND + NOT + AND + SINK_BATTERY`) into the simulation engine (`PoreWorkshop`) versus the UI (`CircuitTopology` and `CircuitAutopsyModal`):

| Input $(A, B)$ | `PoreWorkshop.step()` (Actual Engine) | `CircuitAutopsyModal.evaluateCircuitState()` (UI Truth Table & Oscilloscope) | `CircuitTopology.analyze()` (UI Schematic `gate_3`) |
| :---: | :---: | :---: | :---: |
| $(0, 0)$ | `false` | `false` | `false` |
| $(0, 1)$ | **`true`** | **`false` (WRONG!)** | **`false` (WRONG!)** |
| $(1, 0)$ | **`true`** | **`false` (WRONG!)** | **`false` (WRONG!)** |
| $(1, 1)$ | `false` | `false` | `false` |

Why do `CircuitAutopsyModal` and `CircuitTopology` output `false` for **every single input** on `[OR, AND, NOT, AND]`?
Because in their 1D daisy-chain loop:
* $i = 0$ (`OR`): $\text{out}_0 = A \lor B$
* $i = 1$ (`AND`): $\text{in}_A = \text{out}_0 = A \lor B$, $\text{in}_B = A \implies \text{out}_1 = (A \lor B) \land A = A$
* $i = 2$ (`NOT`): $\text{in}_A = \text{out}_1 = A \implies \text{out}_2 = \neg A$
* $i = 3$ (`AND`): $\text{in}_A = \text{out}_2 = \neg A$, $\text{in}_B = A \implies \text{out}_3 = \neg A \land A \equiv \mathbf{0}$ (Contradiction!)

**Even worse:**
1. **Unreachable Dead-Code Feedback Check**: Both [`CircuitTopology.ts:175`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/CircuitTopology.ts#L175) and [`CircuitAutopsyModal.ts:520`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L520) contain:
   ```typescript
   const gateOutputs: boolean[] = [];
   ...
   for (let i = 0; i < gates.length; i++) {
     ...
     if (i === 0 && hasFeedback && gateOutputs.length > 0) {
       inB = gateOutputs[gateOutputs.length - 1] || inB;
     }
   ```
   When `i === 0`, `gateOutputs` is empty (`gateOutputs.length === 0`)! The condition `i === 0 && ... && gateOutputs.length > 0` is a **logical contradiction that can never execute under any circumstances!**
2. **Unreachable Dead-Code Ring Oscillator Classification in `CircuitTopology.ts`**:
   Look at [`CircuitTopology.ts:384-391`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/CircuitTopology.ts#L384-L391):
   ```typescript
   // Line 166: const hasFeedback = gates.length >= 2 && gates.some(g => g.definition.type === CodonType.GATE_NOT);
   if (hasFeedback && gates.length >= 2) {
     motifName = 'Uri Alon Bistable Memory Latch';
     motifCognate = 'Genetic Toggle Switch (Gardner 2000)';
     motifDesc = 'Cross-coupled feedback preserves substrate pulses across famine ticks.';
   } else if (gates.filter(g => g.definition.type === CodonType.GATE_NOT).length >= 3) {
     motifName = 'Ring Oscillator Autonomous Clock';
   ```
   If `gates.filter(NOT).length >= 3`, then `gates.length >= 2` is true AND `gates.some(NOT)` is true, which means `hasFeedback` is **always true**! Therefore, the `else if` branch for `'Ring Oscillator Autonomous Clock'` in `CircuitTopology.ts` is **100% unreachable dead code**!
3. **Fake Host-Forced Toxin Shield & Fake Linear Yield in `CircuitAutopsyModal.ts`**:
   In [`CircuitAutopsyModal.ts:537-548`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts#L537-L548):
   * Line 537 forces `if (tEff && gates.some(g => g.definition.type === CodonType.GATE_NOT)) { primaryActive = false; }` even if the `NOT` gate is not wired to `PORIN_TOXIN_T`!
   * Line 546 reports `yieldMultiplier = 1.5 + gates.length * 0.5`, which is the old linear gate-count reward that was supposedly removed from `PoreWorkshop`!

---

## SECTION 3: THE "BAG-OF-GATES" PALEONTOLOGY AUDIT (`MotifScanner.ts` & `TaxonomyNomenclature.ts`)

### 3.1 Violation 3A: `MotifScanner.ts` is a 100% Topology-Blind Bag-of-Gates Counter
* **Classification:** `POTEMKIN MOTIF ILLUSION` / `CRITICAL EPISTEMIC FRAUD`
* **Location:** [`src/core/paleontology/MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L80-L230)

#### Complete Forensic Table of All 11 `detect*` Methods in `MotifScanner.ts`:

| Method (`MotifScanner.ts`) | Lines | Claimed Biological / Computational Motif | Actual Code Implementation | Checks Wiring / `astEdges`? | Checks Feedback / State Memory? | Checks Truth Table / Dynamics? |
| :--- | :---: | :--- | :--- | :---: | :---: | :---: |
| [`detectHalfAdder`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L80-L98) | 80–98 | 1-Bit Binary Half-Adder (Sum=XOR, Carry=AND) | `andGates.length >= 2 && orGates.length >= 1 && notGates.length >= 1` | **NO** | **NO** | **NO** |
| [`detectRingOscillator`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L100-L110) | 100–110 | Elowitz Repressilator Autonomous Limit Cycle | `notGates.length >= 3 && notGates.length % 2 === 1` | **NO** | **NO** | **NO** |
| [`detectBistableLatch`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L112-L124) | 112–124 | Gardner-Collins Bistable Toggle Switch (SR Latch) | `gates.length >= 2 && some(AND\|OR) && some(NOT)` | **NO** | **NO** | **NO** |
| [`detectCoherentFFL`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L126-L137) | 126–137 | Uri Alon Coherent Feed-Forward Loop (C-FFL) | `andCount >= 1 && orCount >= 1` | **NO** | **NO** | **NO** |
| [`detectIncoherentFFL`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L139-L150) | 139–150 | Uri Alon Incoherent Feed-Forward Loop (I-FFL) | `hasAnd && hasNot && gates.length >= 3` | **NO** | **NO** | **NO** |
| [`detectAutoregulation`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L152-L161) | 152–161 | Negative Autoregulation Homeostatic Clamp | `gates.length === 1 && gates[0].type === GATE_NOT` | **NO** | **NO** | **NO** |
| [`detectTemporalDerivativeChemotaxis`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L163-L175) | 163–175 | Purcell-Berg Temporal Derivative $dS/dt$ | `andCount >= 2 && hasNot && gates.length >= 3` | **NO** | **NO** | **NO** |
| [`detectPredictivePavlovian`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L177-L189) | 177–189 | Pavlov-Tavazoie Anticipatory Conditioning | `hasNot && hasAnd && hasOr && gates.length >= 3` | **NO** | **NO** | **NO** |
| [`detectEntrainedPacemaker`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L191-L202) | 191–202 | Johnson-Rust Circadian KaiABC Clock | `notGates.length >= 3 && notGates.length % 2 === 1 && hasCoupling` | **NO** | **NO** | **NO** |
| [`detectSteinerVascularNetwork`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L204-L216) | 204–216 | Nakagaki-Tero Minimal Steiner Tree | `gates.length >= 4 && andCount >= 1 && orCount >= 1 && notCount === 0` | **NO** | **NO** | **NO** |
| [`detectCryptobioticDormancyClamp`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L218-L229) | 218–229 | Balaban Persister Toxin-Antitoxin Switch | `gates.length >= 3 && notCount === 2 && hasThreshold` | **NO** | **NO** | **NO** |

#### Concrete Counterexamples & Mathematical Falsification:
1. **The 6-in-1 Nonsense Bag (`[AND, AND, OR, NOT]`)**:
   As proven in Proof 4 of [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs):
   Take the 4-gate sequence `[AND, AND, OR, NOT]`. Because the final gate $G_3$ is `GATE_NOT`, [`PoreWorkshop.ts:600-607`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L600-L607) wires $G_3 = \neg G_2$, where $G_1$ orphaned $G_0$ (due to the bug at line 625!), $G_1 = A \land B$, $G_2 = G_1 \lor A = A$, and $G_3 = \neg A$.
   Thus, the entire 4-gate circuit computes the trivial unary negation $\neg A$ (`[true, false, true, false]`)!
   Yet `MotifScanner.scanWorkshop()` simultaneously awards this trivial $\neg A$ circuit **SIX** Nobel/landmark systems biology titles:
   * `HALF_ADDER` (confidence `0.95`) — Note: A Half-Adder requires **two** distinct outputs ($\text{Sum} = A \oplus B$ and $\text{Carry} = A \land B$). `PoreWorkshop` has only **one** scalar output (`primaryActive`), so a Half-Adder is structurally impossible in `PoreWorkshop`, and this circuit doesn't even compute XOR!
   * `BISTABLE_LATCH` (confidence `0.85`) — Does not hold 1-bit state; outputs `true` whenever $A = 0$.
   * `COHERENT_FFL` (confidence `0.80`) AND `INCOHERENT_FFL` (confidence `0.80`) on the exact same gate IDs `[0, 1, 2]`!
   * `TEMPORAL_DERIVATIVE_CHEMOTAXIS` (confidence `0.90`) — Has zero delay cascade and computes no temporal derivative $dS/dt$.
   * `PREDICTIVE_PAVLOVIAN` (confidence `0.92`) — Has zero binding to `baroAcoustic` or `toxinT`!
2. **The Non-Oscillating "Ring Oscillator" (`[NOT, NOT, NOT]`)**:
   Look at [`PoreWorkshop.ts:600-607`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts#L600-L607):
   ```typescript
    } else if (gate.type === CodonType.GATE_NOT) {
      // Unary NOT gate negates the immediately preceding gate subtree
      const prevGate = expressedSoFar[idx - 1];
      gate.leftChildGateId = prevGate.id;
      gate.inputA = prevGate.output;
      gate.inputB = false;
   ```
   In `PoreWorkshop`, `GATE_NOT` is a **purely combinational feed-forward unary inverter** with **no feedback loop** from $G_{n-1}$ back to $G_0$!
   When $G_0, G_1, G_2$ are all `GATE_NOT`, at every tick $t$:
   $$G_0(t) = \neg \text{effA}(t), \quad G_1(t) = \neg G_0(t) = \text{effA}(t), \quad G_2(t) = \neg G_1(t) = \neg \text{effA}(t)$$
   When held at constant input $(A=0, B=0)$, its output across ticks $t = 1 \dots 8$ is:
   $$[\text{true}, \text{true}, \text{true}, \text{true}, \text{true}, \text{true}, \text{true}, \text{true}]$$
   **It never oscillates!** Yet [`MotifScanner.detectRingOscillator()`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L100-L110) and [`TaxonomyNomenclature.ts:385-391`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L385-L391) classify it as `Oscillocladus elowitzii` ("Exhibits an autonomous odd-inverter limit cycle oscillator, producing rhythmic metabolic pacing without external cues") with `0.90` confidence!
3. **Unused Cosmetic Prop `computeBidirectionalHypercubePotential`**:
   In [`MotifScanner.ts:65-78`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L65-L78), the developer added `computeBidirectionalHypercubePotential(actualVector, targetVector)` to pass a unit test in [`tests/stage24_adversarial_zero_smuggling_audit.mjs:160`](file:///h:/My%20Drive/Repos/Siliquarium/tests/stage24_adversarial_zero_smuggling_audit.mjs#L160). **It is never called anywhere in `src/`!** Neither `MotifScanner.scanWorkshop()` nor any other method in the simulation ever invokes it.

---

### 3.2 Violation 3B: `TaxonomyNomenclature.ts` Order-Dependent Bag-of-Codons & Dead Taxa
* **Classification:** `POTEMKIN MOTIF ILLUSION` / `DEAD CODE TAXONOMY`
* **Location:** [`src/core/paleontology/TaxonomyNomenclature.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L299-L455)

#### Exact Code Quote:
```typescript
// src/core/paleontology/TaxonomyNomenclature.ts, lines 349-406
    // 1. Expanded variable-length poly-codon genome via tandem duplication (Susumu Ohno homage)
    if (tapeBitstring && tapeBitstring.length > 60) {
      return this.TAXA.OHNOI;
    }
    ...
    // 2. Refractory Substrate C / Cit+ key innovation (Richard Lenski & Zachary Blount homage)
    if (gates.some(g => g.includes('STREAM_C') || g.includes('PORIN_STREAM_C')) || codonValues.some(c => c >= 8 && c <= 11)) {
      return this.TAXA.LENSKII_CIT;
    }
    ...
    // 5. Anticipatory Pavlovian Regulator (Pavlov & Tavazoie homage)
    if (gates.includes('NOT') && gates.includes('AND') && gates.includes('OR') && gateCount >= 3) {
      return this.TAXA.PAVLOVII;
    }
```

#### Mathematical & Algorithmic Proof of Failure:
1. **Unexpressed Codon Classification**:
   Lines 365, 370, and 375 check `codonValues.some(c => c >= 8 && c <= 11)` (and `18..21`, `28..31`) directly on the raw `tapeBitstring`. Even if a cell has **zero catalytic gates**, **zero battery sink**, or the codon is locked inside an **unexpressed repressed operon**, `TaxonomyNomenclature` still names it `Citratovibrio lenskii` ("Evolved functional PORIN_STREAM_C channel capable of catabolizing refractory benthic Substrate C"), `Siderococcus neilsonii`, or `Biofilmocladus costertonii`!
2. **Any Genome $> 60$ Bits Clobbers All Other Non-Syncytial Taxa**:
   Line 350 (`if (tapeBitstring && tapeBitstring.length > 60) return this.TAXA.OHNOI;`) sits at the very top of `doClassify()`. The moment any solitary organism undergoes a single gene duplication (66 bits), it is permanently locked into `Polyoperon ohnoi`, making it impossible for any expanded genome ($>10$ codons) to ever be classified as `TURINGII`, `ELOWITZII`, `PAVLOVII`, `PURCELLII`, `BALABANII`, `LENSKII_CIT`, etc.!
3. **100% Unreachable Taxa (`WESTII` and `LOVLEYI`)**:
   In [`TaxonomyNomenclature.ts:262-281`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts#L262-L281), the developer defined `TAXA.WESTII` (`Syntrophobacter westii`) and `TAXA.LOVLEYI` (`Electrosarcina lovleyi`). Search `classify()` and `doClassify()` across lines 299–455: **neither `this.TAXA.WESTII` nor `this.TAXA.LOVLEYI` is ever returned anywhere in `TaxonomyNomenclature.ts`!** They are 100% unreachable dictionary entries.

---

## SECTION 4: HOST-ORACLE BEHAVIORAL SMUGGLING IN `SimulationWorld.ts`, `TreadmillingEngine.ts`, & `PoreCell.ts`

### 4.1 Violation 4A: Host-Side `if/else` Predation Weaponry, Immunity Shields, & Scavenging
* **Classification:** `HOST-ORACLE SMUGGLING` ($I_+ > 0$)
* **Locations:**
  * Predation Weapon & Prey Shield: [`src/engine/SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L896-L908)
  * Catabolic Scavenging: [`src/engine/SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1304-L1307)
  * Endosymbiosis Syntrophy Check: [`src/engine/SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1088-L1100)
  * Syncytial Role Labeling: [`src/engine/SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1391-L1405)

#### Exact Code Quotes:
```typescript
// src/engine/SimulationWorld.ts, lines 896-908
      const gates = cell.getWorkshop().getGates();
      const hasWeapon = gates.length >= 2 && gates.some(g => g.type === CodonType.GATE_NOT);
      if (hasWeapon && res.telemetry.primaryActive && cell.getBattery().getEnergy() >= 30) {
        const neighbors = pore.getNeighbors().filter(p => p.getState() === PoreState.OCCUPIED);

        for (const targetPore of neighbors) {
          const prey = targetPore.getResident();
          if (!prey || prey.getCladeId() === cell.getCladeId()) continue;

          // Check if prey possesses antitoxin shield (NOT gate inhibiting attack)
          const preyShield = prey.getWorkshop().getGates().some(g => g.type === CodonType.GATE_NOT);
          if (!preyShield && prey.getBattery().getEnergy() > 0) {
            // Predation strike succeeds!
```

```typescript
// src/engine/SimulationWorld.ts, lines 1304-1308
        const gates = cell.getWorkshop().getGates();
        const isCatabolicScavenger = gates.some(g => g.type === 'GATE_OR' || g.type === 'GATE_NOT');

        if (isCatabolicScavenger) {
          // Full catabolic digestion yield
```

#### Mathematical & Algorithmic Proof of Host Smuggling:
1. **No Weapon or Shield Circuit Exists**:
   An organism does not evolve a circuit that detects adjacent prey via `PORIN_MECHANO_TOUCH` / `PORIN_ELECTRO_REDOX` and triggers a lytic effector sink. Instead, the host engine simply checks whether `cell.getWorkshop().getGates()` has length $\ge 2$ and contains at least one `CodonType.GATE_NOT`!
2. **Passive Invincibility From Any `GATE_NOT` (Including Repressed Operons!)**:
   Look at line 906:
   ```typescript
   const preyShield = prey.getWorkshop().getGates().some(g => g.type === CodonType.GATE_NOT);
   ```
   * Does the prey's `GATE_NOT` have to be active (`output === true`)? **NO!**
   * Does the prey's `GATE_NOT` have to be wired to a mechano-sensor or toxin porin? **NO!**
   * Does the prey's `GATE_NOT` even have to be **expressed** (`isExpressed === true`)? **NO!** Because `getGates()` returns `this.gates` (all gates across all operons, including repressed operons where `isExpressed === false`), as proven in Proof 5 of [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs), a cell with a **repressed, unexpressed `GATE_NOT`** in Operon 1 pays **zero** Landauer switching cost for that gate while receiving **100% invincibility against all predators** (`preyShield = true`), **full predatory weapon capability** (`hasWeapon = true`), and **100% carcass scavenging efficiency** (`isCatabolicScavenger = true`)!
3. **Hardcoded Obligate Philanthropy ("Paracrine Syntrophy")**:
   Look at [`SimulationWorld.ts:880-892`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L880-L892):
   ```typescript
   if (cell.getBattery().getEnergy() >= 85) {
     for (const targetPore of pore.getNeighbors()) {
       const neighborCell = targetPore.getResident();
       if (neighborCell && neighborCell.getCladeId() !== cell.getCladeId() && neighborCell.getBattery().getEnergy() < 40) {
         const transferred = cell.getBattery().drainEnergy(2);
         neighborCell.getBattery().chargeEnergy(transferred);
         this.activeSyntrophyEvents.push({ from: pore.coord, to: targetPore.coord, amount: transferred });
   ```
   There is **no** codon, porin, or circuit for syntrophy! Every single cell in the universe whose battery reaches 85 tokens is **forced by the host JavaScript engine** to donate 2 energy tokens per tick to any nearby rival clade with $<40$ energy, and [`DigitalPaleontologist.ts:207-223`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/DigitalPaleontologist.ts#L207-L223) then celebrates this mandatory host tax as a "DE_NOVO" evolutionary milestone (`SYNTROPHIC_CROSS_FEEDING: "Obligate metabolic cooperation"` citing Lovley 2017 & West 2007)!

---

### 4.2 Violation 4B: Host-Guided Chemotaxis & Predatory Pursuit in `TreadmillingEngine.ts`
* **Classification:** `HOST-ORACLE SMUGGLING` ($I_+ > 0$)
* **Location:** [`src/engine/kinematics/TreadmillingEngine.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L48-L126)

#### Exact Code Quote:
```typescript
// src/engine/kinematics/TreadmillingEngine.ts, lines 100-118
      // Local physical gradient coupling when cell's AST fires (primaryActive)
      if (probeTele.primaryActive || gates.some(g => g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR)) {
        score += (parentDistToVent - distToVent) * 12;
      }

      // Allosteric toxin/thermal avoidance when NOT gate inhibits firing under stress
      if (localToxin || localBaro) {
        if (gates.some(g => g.type === CodonType.GATE_NOT) && !probeTele.toxinIngested) {
          if (distToVent >= 2) score += 10;
        } else {
          score += (distToVent - parentDistToVent) * 18;
        }
      }

      // Trophic contact pursuit via evolved composite NOT + AND/OR circuitry
      if (hasCompositePredation && adjacentPrey.length > 0) {
        score += adjacentPrey.length * 22;
      }
```

#### Mathematical & Algorithmic Proof of Failure:
1. **Unconditional Vent Homing via `gates.some(...)`**:
   Look at line 101:
   `if (probeTele.primaryActive || gates.some(g => g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR))`
   Even if `probeTele.primaryActive` is **`false`** (the cell's circuit is completely OFF in the candidate pore!), as long as the cell possesses *any* `GATE_AND` or `GATE_OR` in its genome, the host engine teleologically calculates `(parentDistToVent - distToVent) * 12` using the global coordinates of `vent.nozzleCoord` and steers the daughter cell toward the vent!
2. **Host-Calculated Prey Pursuit (`adjacentPrey.length * 22`)**:
   Look at lines 51–53 and 115–117: if `gates` contains any `NOT` and any `AND`/`OR` (`hasCompositePredation`), the host engine counts `adjacentPrey.length` around each candidate pore and adds `+22` per prey cell—even if the organism lacks `PORIN_MECHANO_TOUCH` and `PORIN_ELECTRO_REDOX` and its circuit output did not change by a single bit in response to the prey!
3. **Deterministic PRNG Omission in `SimulationWorld.stepReproduction()`**:
   Look at [`TreadmillingEngine.ts:44 & 135`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts#L135): the developer added "Thermodynamic Gibbs-Boltzmann Soft Selection & Tomoko Ohta Saddle Escape (when PRNG supplied)" (`if (prng && candidatePores.length > 1)`).
   Now look at the **only** call site in the entire codebase, [`SimulationWorld.ts:976-982`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L976-L982):
   ```typescript
   target = TreadmillingEngine.selectDirectionalCleavageTarget(
     pore,
     cell,
     emptySubstrates,
     ventTele,
     this.pores.filter(p => p.getState() === PoreState.OCCUPIED)
   );
   ```
   **`this.prng` is NOT passed!** Because the 6th argument `prng` is omitted (`undefined`), lines 135–150 of `TreadmillingEngine.ts` ("Gibbs-Boltzmann Soft Selection & Tomoko Ohta Saddle Escape") **NEVER EXECUTE DURING SIMULATION RUNS!**

---

### 4.3 Violation 4C: Arbitrary Polynomial Hash Morphogenesis in `PoreCell.getMorphogeneticPlan()`
* **Classification:** `HOST-ORACLE SMUGGLING`
* **Location:** [`src/core/domain/PoreCell.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts#L321-L366)

#### Exact Code Quote:
```typescript
// src/core/domain/PoreCell.ts, lines 334-357
    const hasOperator = trans.instructions.some(inst => inst.definition.type === CodonType.REGULATORY_OPERATOR);
    const isExpandedGenome = tape.length > 60;
    const hasAdhesion = (hasSeptum && (hasOperator || isExpandedGenome)) || this.syncytiumId !== null;

    // 3. Primary Cleavage Direction (0..5) and Symmetry Mode (0..3)
    let primaryDirection = 0;
    let symmetryMode = 0;

    if (trans.instructions.length >= 3) {
      const c0 = trans.instructions[0].codonIndex;
      const c1 = trans.instructions[1].codonIndex;
      const c2 = trans.instructions[2].codonIndex;
      const hash = (c0 * 17 + c1 * 31 + c2 * 53) >>> 0;
      primaryDirection = hash % 6;
      symmetryMode = Math.floor(hash / 6) % 4;
    }
```
Instead of morphogenesis emerging from spatial regulatory circuit execution, `getMorphogeneticPlan()` computes an arbitrary linear congruence `(c0 * 17 + c1 * 31 + c2 * 53)` on the first three codons and grants multicellular syncytial adhesion (`hasAdhesion = true`) whenever `hasSeptum && tape.length > 60`!

---

## SECTION 5: PRE-BAKED GENOME INJECTION, SPARSE ENGINE COMA BUGS, & THERMODYNAMIC CORRUPTION

### 5.1 Violation 5A: Pre-Engineered Genomes Injected Across All Built-In Presets & BioBank
* **Classification:** `PRE-BAKED GENOME INJECTION` ($I_+ \gg 0$)
* **Locations:**
  * [`src/engine/storage/EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L514)
  * [`src/engine/storage/BioBank.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L212-L259)

In [`EnvironmentPresetRegistry.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/EnvironmentPresetRegistry.ts#L267-L514), all 5 built-in presets (`twin-smokers`, `abyssal-trench`, `alkaline-mound`, `caldera-maze`, `lenski-chamber`) hardcode explicit 60-bit founder genomes such as:
* `'100000100110000000000000000000000000000000000000000000000000'` (`PORIN_STREAM_A` [32] + `PORIN_STREAM_B` [38] + 8 `GATE_AND` [0] codons)
* `'100000100110000000010100000000000000000000000000000000000000'` (`PORIN_STREAM_A` [32] + `PORIN_STREAM_B` [38] + `GATE_AND` [0] + `SECRETION_CHELATOR` [20] + 6 `GATE_AND` [0] codons)

And [`BioBank.seedDefaultStrains()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/storage/BioBank.ts#L212-L259) pre-populates the vault with hand-engineered strings (`tapeAncestor`, `tapeMitchell`, `tapeWolpert`), including a hand-crafted `Metazoicladus wolpertii` genome (`'000000' + '001100' + '101100' + '110100' + '100000' + '100110' + '110010' + '111000'.repeat(3)`) labeled `generation: 3450, savedAtEpoch: 25000`—faking a 25,000-epoch evolutionary pedigree for a string typed by the programmer!
(Note also that in `tapeWolpert`, the programmer wrote comment `// Regulatory Operator (44)` for `'101100'`, but in `CodonTable.ts` index `44` is `PORIN_TOXIN_T`, not `REGULATORY_OPERATOR` [60..63]!)

---

### 5.2 Violation 5B: The "Sparse Active Pore Engine" Comatose Organism Bug
* **Classification:** `CRITICAL ENGINE BUG`
* **Locations:**
  * [`src/engine/SimulationWorld.ts` (`inoculateCell`, lines 1758–1770)](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1758-L1770)
  * [`src/engine/SimulationWorld.ts` (`stepSpores`, lines 1254–1257)](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1254-L1257)
  * [`src/engine/SimulationWorld.ts` (`depositDetritus`, lines 1661–1669)](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L1661-L1669)

#### Exact Code Quotes:
```typescript
// 1. src/engine/SimulationWorld.ts, lines 1758-1770
  public inoculateCell(coord: HexCoord3D, safe?: GenomeSafe, initialEnergy: number = 60, initialMatter: number = 20): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore || pore.isBasalt() || pore.isAqueous() || pore.getState() !== PoreState.EMPTY) {
      return false;
    }
    const cellSafe = safe ?? GenomeSafe.createPrebioticSoup(this.prng);
    const cell = new PoreCell(cellSafe, initialEnergy, initialMatter, 0);
    pore.setResident(cell);
    this.ledger.recordEnergyInjection(initialEnergy);
    this.ledger.recordMatterInjection(initialMatter);
    this.telemetryDirty = true;
    return true; // <-- BUG: NEVER CALLS this.registerActivePore(pore)!
  }

// 2. src/engine/SimulationWorld.ts, lines 1254-1257
      if (settleCandidates.length > 0 && settleCandidates[0].setResident(new PoreCell(spore.safe, spore.energy, spore.matter, spore.generation, spore.id, spore.parentId, spore.cladeId))) {
        pore.setSpore(null);
        continue; // <-- BUG: NEVER CALLS this.registerActivePore(settleCandidates[0])!
      }
```

#### Empirical Proof of Failure (Proof 6 in `falsification_suite.mjs`):
Because [`stepCellMetabolism()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L809-L812) and [`stepReproduction()`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts#L945) only iterate over `this.activePores` (and only call `syncActivePores()` when `this.activePores.size === 0`), any cell inoculated via `inoculateCell()` into a world that already has at least 1 active pore, or any pelagic spore that settles and germinates into an empty rock pore via `stepSpores()`, is **never added to `this.activePores`**.
As demonstrated in Proof 6 of [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs), after 15 world ticks, the existing cell is at `age = 15`, while the newly inoculated cell is still frozen at **`age = 0`**—completely comatose!

---

### 5.3 Violation 5C: `CHIMNEY_SPALLING` Leaves Benthic Cells Floating in Water & Injects Ex Nihilo Mass/Energy
* **Classification:** `THERMODYNAMIC / TOPOLOGICAL CORRUPTION`
* **Location:** [`src/engine/environment/GeologicalPressuresEngine.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/environment/GeologicalPressuresEngine.ts#L388-L402)

#### Exact Code Quote:
```typescript
// src/engine/environment/GeologicalPressuresEngine.ts, lines 388-402
      colPores.sort((a, b) => b.coord.z - a.coord.z);
      const spalled = colPores[0];

      // Collapse into empty water column at summit
      spalled.setMedium(PoreMedium.AQUEOUS_FLUID);
      spalled.setBasalt(false);
      world.getGrid().removeBasaltObstacle(spalled.coord);
      affected.push(spalled.coord);

      // Rain mineral detritus down to seabed beneath the spalling point
      const baseCoord = new HexCoord3D(spalled.coord.q, spalled.coord.r, 0);
      if (world.depositDetritus(baseCoord, 20, 10)) {
        affected.push(baseCoord);
      }
```
As proven in Proof 7 of [`falsification_suite.mjs`](file:///h:/My%20Drive/Repos/Siliquarium/Adversarial%20QA/falsification_suite.mjs):
When `spalled` is an elevated habitable rock pore (`z >= 1`, `isBasalt() === false`) occupied by a living `PoreCell`, `spalled.setMedium(PoreMedium.AQUEOUS_FLUID)` and `spalled.setBasalt(false)` **do not clear or lyse the resident cell** (`Pore.setBasalt(false)` only calls `this.clear()` when `basalt === true`!). As a result, a benthic rock-dwelling `PoreCell` is left illegally residing inside an `AQUEOUS_FLUID` water parcel!

---

### 5.4 Violation 5D: `CircuitAdvantageAnalyzer.ts` Sticky Toxin-Immunity Bug & Stale Yield Hallucinations
* **Classification:** `EPISTEMIC MISREPRESENTATION`
* **Location:** [`src/core/analysis/CircuitAdvantageAnalyzer.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/analysis/CircuitAdvantageAnalyzer.ts#L38-L135)

In [`CircuitAdvantageAnalyzer.ts:38-80`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/analysis/CircuitAdvantageAnalyzer.ts#L38-L80):
```typescript
      { name: 'Acid Shock (Toxin=1)', a: false, b: false, toxin: true, desc: 'Volcanic sulfuric acid pulse.' },
      { name: 'Fuel + Acid Mixed (A=1, B=1, T=1)', a: true, b: true, toxin: true, desc: 'High fuel contaminated with heavy metal toxins.' }
    ];
    ...
      if (probe.toxin && !res.primaryOutput) {
        toxinProtected = true;
      }
```
Because `'Acid Shock (Toxin=1)'` has `a: false, b: false, toxin: true`, **every normal `AND` or `OR` gate outputs `false` when `a=0, b=0`**! That immediately sets `toxinProtected = true`. And because `toxinProtected` is never set back to `false` when `'Fuel + Acid Mixed (A=1, B=1, T=1)'` fires `primaryOutput = true` (suffering toxin corrosion!), **virtually every circuit in the simulation is falsely awarded `toxinProtected = true` (`toxinImmunityScore = 85` or `98`) even when it has zero toxin protection during `A=1, B=1, T=1`!**

---

## SECTION 6: SUMMARY OF MANDATORY REMEDIATIONS TO ACHIEVE TRUE $I_+ = 0$

To bring Siliquarium into compliance with the Dembski Zero-Smuggling Protocol, the following architectural fixes are mandatory:

1. **Replace Hardcoded 4-Gate Templates & `aActive || boundA` in [`PoreWorkshop.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts)**:
   * Remove `const effA = aActive || boundA; const effB = bActive || boundB;` and use the actual bound porin signals `boundA` and `boundB` (defaulting to `aActive` and `bActive` only when no specific porin is bound).
   * Replace the brittle 4-gate `else if` hack (lines 608–634) with a genuine recursive/stack-based Prefix or Postfix AST builder where every gate's inputs are deterministically wired without orphaning gates or failing on commuted branches.
2. **Unify Circuit Evaluation Across Engine and UI ([`CircuitTopology.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/CircuitTopology.ts) & [`CircuitAutopsyModal.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/ui/CircuitAutopsyModal.ts))**:
   * Delete the 1D daisy-chain evaluators in `CircuitTopology.ts` and `CircuitAutopsyModal.ts`. Both must instantiate/query `PoreWorkshop` directly and render the actual `workshop.getGates()` outputs and `workshop.getAstEdges()` directed wires.
3. **Replace Bag-of-Gates Counting in [`MotifScanner.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) & [`TaxonomyNomenclature.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/TaxonomyNomenclature.ts)**:
   * Scan only **expressed** gates (`workshop.getBuiltGates()`).
   * Verify **behavioral truth tables and temporal state transitions** before awarding any motif:
     * `HALF_ADDER` / `TURINGII`: Must verify that the circuit's 4-input truth table $(A,B) \in \{0,1\}^2$ actually evaluates to XOR (`[false, true, true, false]`) or XNOR (`[true, false, false, true]`).
     * `RING_OSCILLATOR` / `ELOWITZII`: Must verify that under constant steady-state inputs, the circuit's output genuinely alternates ($0 \to 1 \to 0 \to 1$) across consecutive ticks via feedback.
     * `BISTABLE_LATCH` / `COLLINSII`: Must verify hysteresis (output at $(0,0)$ after a $(1,1)$ pulse differs from output at $(0,0)$ after reset).
     * `COHERENT_FFL` / `INCOHERENT_FFL`: Must verify feed-forward DAG topology in `astEdges` (a source node driving a target node both directly and via an intermediate node).
4. **Eliminate Host-Side `gates.some(...)` Behavioral Smuggling in [`SimulationWorld.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) & [`TreadmillingEngine.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/kinematics/TreadmillingEngine.ts)**:
   * Use `getBuiltGates()` (expressed gates only), never unexpressed repressed operons.
   * Require actual functional circuit responses (e.g., toxin immunity only when the circuit genuinely inhibits `primaryActive` when `toxinT = true`; chemotaxis only from endogenous `probeWorkshop.stepTick()` free-energy differences; pass `this.prng` into `TreadmillingEngine.selectDirectionalCleavageTarget()`).
5. **Fix Sparse Active Pore Registration & Chimney Spalling Conservation**:
   * Call `this.registerActivePore(...)` in `inoculateCell()`, `stepSpores()`, `depositDetritus()`, and `loadEnvironmentPreset()`.
   * Properly lyse/clear any resident cell or carcass before converting a rock pore to `AQUEOUS_FLUID` in `executeChimneySpalling()`.
