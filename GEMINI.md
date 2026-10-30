# 🏛️ Siliquarium Mandatory Development & Inviolable QA Rules

> **INVIOLABLE STANDING MANDATE FOR ALL AI AGENTS & ENGINEERS (REGARDLESS OF SESSION):**
> 1. All coding and architectural QA requirements must be met on every change.
> 2. Zero technical debt may be introduced; any refactoring must preserve or improve compliance.
> 3. Every build, stage, feature, or bugfix must pass all tests (`npm test`).
> 4. Every build must be committed to git and pushed to the remote repository (`git push origin main`) before completing any turn or task. Never leave uncommitted or unpushed work across sessions.

---

## 1. Complexity Budgets (Strictly Enforced)

All TypeScript source code under `src/` must comply with strict numerical budgets:

| Architectural Metric | Strict Maximum Budget | Remediation Technique |
| :--- | :--- | :--- |
| **Cyclomatic Complexity per Function** | $\le 7$ | Guard clauses / early returns (Bouncer Pattern), lookup dispatch tables, subroutine extraction |
| **Function Length** | $\le 50\text{--}60$ Lines | Single-screen rule; decompose multi-phase routines into atomic helpers |
| **File Length** | $\le 250\text{--}300$ Lines | Strict Single Responsibility Principle (SRP); decompose monolithic files into cohesive sub-modules |
| **Parameter Count per Function** | $\le 3\text{--}4$ Parameters | Functions with $> 3$ args must accept a strongly-typed options/config object |
| **Maximum Nesting Depth** | $\le 3$ Levels | Guard clauses / early returns eliminate deeply nested pyramids |

---

## 2. Object-Oriented Programming (OOP) & Clean Architecture

- **Rich Domain Entities (Anti-Anemic Model):**  
  Domain entities (`Pore`, `PoreCell`, `PoreBattery`, `GenomeSafe`, `PoreWorkshop`) must encapsulate both internal state and business behavior. Never create "dumb" data structures manipulated by sprawling procedural services.
- **Strict Encapsulation:**  
  All state fields must be `private` or `protected`. State transitions must occur exclusively through explicit domain methods.
- **Composition Over Inheritance:**  
  Maximum inheritance depth is 1 level. Assemble behavior through composition and polymorphic interfaces.
- **SOLID Principles:**  
  - **S (Single Responsibility):** Each class/module has exactly one reason to change.
  - **O (Open/Closed):** Open for extension via interfaces, closed for direct core modification.
  - **L (Liskov Substitution):** Subtypes must be completely substitutable without contract violations.
  - **I (Interface Segregation):** Granular, role-specific interfaces (`IReadablePin`, `IWritablePin`, `IEnergySink`).
  - **D (Dependency Inversion):** Depend on abstractions, never on low-level concrete implementations.
- **Anti-Monolith Mandate ("No Kitchen Sink Files"):**  
  - Catch-all generic files are **strictly forbidden**: ❌ `utils.ts`, ❌ `helpers.ts`, ❌ `common.ts`, ❌ `misc.ts`, ❌ `manager.ts`, ❌ `shared.ts`.
  - Every file must have a cohesive, domain-specific name (`BitwiseMath.ts`, `SeedablePrng.ts`).
  - One primary class per source file.
- **UI Separation from Business Logic:**  
  - Presentation and DOM code must live exclusively in `src/ui/` and `src/visualizers/`.
  - UI components must never contain core physics, simulation heuristics, or thermodynamic evaluations.
  - Static HTML markup and dialog layouts must be extracted into dedicated template modules (`*HtmlTemplate.ts`), keeping modal controllers under 250 lines.

---

## 3. Zero-DOM Mandate in Core & Engine

The simulation kernel (`src/core/`, `src/engine/`, `src/server/`) must maintain **100% Zero-DOM purity**:
- ❌ No references to `document`, `window`, `HTMLElement`, `HTMLCanvasElement`, `localStorage`, or `CanvasRenderingContext2D`.
- The simulation must run fully headless in Node.js CLI test suites and Web Workers.
- Browser downloads and storage persistence must depend on abstractions (`IPersistenceStorage`) with implementations injected from `src/ui/`.

---

## 4. Strict Type Safety & Immutability

- Strict TypeScript settings enabled (`strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`).
- **Zero `any` Types:** Use of `any` is strictly banned. Use discriminated unions, generics, or `unknown` with type narrowing.
- Properties should be declared `readonly` wherever possible.

---

## 5. Scientific Integrity & The Zero-Smuggling Mandate

- **Thermodynamic Conservation ($\Delta E \equiv 0.000, \Delta M \equiv 0.000$):**  
  Every energy token and mass particle must balance to $0.000$ tolerance. Energy and matter can never be created or destroyed.
- **Operator Blindness & Zero Active Information ($I_+ = 0$):**  
  Replication and mutation operators operate completely blind to environmental telemetry. No teleological fitness beacons or guided mutations.
- **Howard Pattee's Epistemic Cut:**  
  Active operational circuits in `PoreWorkshop` never mutate during runtime. Mutations occur strictly on the inert 1D bitstring in `GenomeSafe` during reproduction.

---

## 6. Build, Verification & Git Push Protocol

For **every** coding task or modification:
1. **Compile & Typecheck:** Ensure clean build via `node scripts/tsc.mjs`.
2. **Verify Full Test Suite:** Run `npm test` (or `node tests/run_tests.mjs`) and verify all 25 test stages pass.
3. **Audit Code Quality:** Run `node scripts/audit_codebase_standards.mjs`.
4. **Commit to Git:** Create a structured conventional commit (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
5. **Push to Remote:** Execute `git push origin main`. Every build must be pushed to GitHub before ending the session.
