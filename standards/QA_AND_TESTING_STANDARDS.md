# 🧪 Siliquarium QA & Testing Standards
*Verification Protocols, Invariant Audits, and Staged Pipelines*

---

## 1. The Verification Mandate: 100% Deterministic Coverage

In evolutionary simulations, bugs often hide behind randomness. A buggy mutation operator or an accidental energy leak might produce the illusion of "evolution" when it is actually a software defect. 

To prevent false claims and ensure institutional-grade integrity, Siliquarium adopts BooleanGA's **Zero-Flakiness Testing Mandate**:

1. **Native, Zero-Bloat Test Runner:**  
   Tests run directly via Node.js using native assertions (`import assert from 'node:assert'`). No massive testing frameworks (Jest, Mocha, Karma) that introduce external dependencies.
2. **Deterministic Seed Locks:**  
   Every evolutionary test specifies an explicit `PRNG.seed(N)`. At Tick $K$, the ecosystem must reproduce the exact same state, down to the bitwise level, across all operating systems.
3. **100% Core Algorithm Coverage:**  
   Codon tables, prefix parsing, pore energy accounting, vent pulse propagation, and neighbor wire-routing must maintain 100% branch and path coverage.

---

## 2. Progressive Staged Test Pipeline

Siliquarium’s automated verification suite (`tests/run_tests.mjs`) must be organized into progressive verification stages:

```
[Stage 01: PRNG Determinism] ──► Verified Mulberry32 sequence reproducibility
       │
[Stage 02: Codon Translation] ──► 64-entry degenerate codon map & silent introns
       │
[Stage 03: Pore Workshop AST] ──► Logic gate placement, wiring validity, and execution
       │
[Stage 04: Vent Physics]     ──► Hydrothermal pulse generation & spatial dissipation
       │
[Stage 05: Pore Battery]     ──► Landauer switching costs & energy depletion
       │
[Stage 06: Replication]      ──► Photocopy to neighbor pore, mutation rate bounds
       │
[Stage 07: Thermodynamics]   ──► Conservation of energy invariance audits
       │
[Stage 08: Ecological Arms]  ──► Neighbor wiretaps, jammer attacks, and lysis decay
```

---

## 3. The Anti-Smuggling Verification (Thermodynamic Invariants)

To uphold the **Zero-Smuggling Mandate**, automated test suites must include strict physical invariant audits:

### Invariant 1: Conservation of Energy (The Zero-Leak Audit)
Energy cannot be created or destroyed. In every test run over $N$ ticks, the total energy of the closed simulation must balance perfectly:
$$\sum E_{\text{injected by vent}} = \sum E_{\text{stored in batteries}} + \sum E_{\text{burned by gate toggles}} + \sum E_{\text{dissipated heat}}$$
- Any test where total energy tokens do not balance to zero tolerance ($0.000$) immediately fails.

### Invariant 1B: Conservation of Matter (Mass Balance Audit)
Physical matter cannot be created or destroyed. Mineral matter tokens ($M$) required to construct gates, build stone walls, and replicate bodies must balance across the closed universe:
$$\sum M_{\text{injected}} = \sum M_{\text{living circuits}} + \sum M_{\text{seafloor carcasses}} + \sum M_{\text{benthic sediment}}$$
- Any test where total matter tokens fail to balance to zero tolerance ($0.000$) immediately fails.

### Invariant 2: Operator Blindness Audit
The mutation operator and replication engine must possess **zero awareness** of the environment:
- The photocopy routine must never inspect vent frequencies, neighbor states, or battery levels to choose mutation targets.
- Mutations must be statistically isotropic across the genome bitstring.

### Invariant 3: Epistemic Cut Audit
Active gates in a pore's workshop must never be mutated during runtime.
- Tests must assert that the running circuit topology remains strictly identical to its initial translation, and that mutation occurs exclusively on the inert bitstring during replication into a child pore.

---

## 4. Failure Mode & Edge Case Testing

The test suite must aggressively exercise boundary edge cases:

1. **Starvation Lysis:** When a pore's battery hits $0$, assert that all gates decouple, the pore becomes marked as `EMPTY`, and residual energy is correctly dissipated or scavenged.
2. **Grid Saturation / Overcrowding:** When all adjacent neighbor pores are occupied, assert that a full-battery cell holds in a quiescent "dormant" state without crashing the engine or overwriting living neighbors.
3. **Catastrophic Mutation Survival:** When a genome suffers severe mutations (e.g., 50% bit inversion), assert that the translation engine gracefully isolates corrupted tokens into non-coding introns without throwing unhandled exceptions.
4. **Wire Boundary Isolation:** Assert that an organism cannot read from or write to a pore that is not an immediate orthogonal neighbor (North, South, East, West).

---

## 5. User Acceptance Testing (UAT) Dashboard Standards

For visual and user acceptance testing, Siliquarium must provide an interactive HTML UAT dashboard (`docs/USER_ACCEPTANCE_TESTING_GUIDE.html`) featuring:
- **Live Interactive Test Cards:** Allowing non-technical educators and researchers to trigger individual test stages with one click.
- **Visual State Assertions:** Color-coded pass/fail badges (Emerald for pass, Rose for fail, Amber for pending).
- **Step-by-Step Fossil Playback:** Ability to step forward and backward through individual clock cycles of a pore’s life to inspect voltages, token counts, and codon reads in real time.
