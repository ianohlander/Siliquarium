# 🏛️ Siliquarium Engineering & Software Architecture Standards
*The Master Specification: OOP, SOLID, DRY, KISS, YAGNI, Complexity Budgets, Anti-Monolith, Clean Architecture, and Anti-Smuggling Mandates*

> **Mandate for All Engineers & AI Agents:**  
> This document is the absolute engineering contract for Siliquarium. Every module, class, interface, and test authored for this project must strictly comply with every section below. No shortcuts, no legacy anti-patterns, and no technical debt.

---

## 1. Core Architectural Paradigms & Object-Oriented Design

### 1.1 Object-Oriented Programming (OOP) & Domain-Driven Design (DDD)
- **Rich Domain Entities (Anti-Anemic Model):**  
  Domain classes (e.g., `Pore`, `PoreCell`, `GenomeSafe`, `PoreWorkshop`, `PoreBattery`) must encapsulate both state and behavior. Never create "dumb" data structures that are manipulated by external, bloated procedural service classes. The entity itself must enforce its internal business and physical rules.
- **Strict Encapsulation & Information Hiding:**  
  All state fields must be `private` or `protected`. State transitions must occur exclusively through explicit, well-named domain methods (e.g., `battery.drainTokens(count)`, `safe.photocopy(mutationRate)`). External consumers must never directly modify an entity's internal properties.
- **Favor Composition Over Inheritance:**  
  Avoid deep class inheritance hierarchies (maximum inheritance depth: 1 level). Assemble complex behavior by composing small, focused components (e.g., a `Pore` *has a* `PoreBattery` and *has a* `PoreWorkshop`, rather than inheriting from an abstract `LivingContainer`).
- **Polymorphism Over Conditionals:**  
  Never use sprawling `switch` statements or `if/else` ladders to branch on object types. Use polymorphic interfaces (e.g., `ILogicNode`, `IVentEmitter`, `IEcologicalInteraction`) with specialized class implementations.
- **Avoid Primitive Obsession:**  
  Do not represent domain concepts with generic primitives (e.g., raw `number` or `string`). Use branded/nominal types, value objects, and enums:
  ```typescript
  // ❌ Primitive Obsession
  function setPore(x: number, y: number, state: string, energy: number): void;

  // ✅ Rich Domain Types
  type PoreCoord = { readonly x: number; readonly y: number };
  enum CellState { Dormant, Active, Lysis, Empty }
  type EnergyTokens = number & { readonly __brand: unique symbol };
  ```

---

### 1.2 The SOLID Principles (Exhaustively Enforced)

#### S — Single Responsibility Principle (SRP)
Every class and module must have **exactly one reason to change**.
- `PoreGrid.ts` manages 2D spatial indexing and neighbor lookups; it does **not** evaluate logic gates or track batteries.
- `CodonTranslator.ts` translates 6-bit strings to tokens; it does **not** manage genome replication.
- `PoreBattery.ts` tracks energy balances; it does **not** emit vent waveforms.

#### O — Open/Closed Principle (OCP)
Modules must be **open for extension, but closed for modification**.
- The core simulation engine must not be edited to add a new gate type, new environmental waveform, or new ecological behavior. 
- New features are introduced by implementing open interfaces (`ILogicNode`, `IVentWaveform`, `IEnergySink`).

#### L — Liskov Substitution Principle (LSP)
Subtypes must be **completely substitutable for their base types** without altering correctness or breaking contract assumptions.
- An `InsulatorGate` or a `MajorityFilterGate` must implement `ILogicNode` identically to an `AndGate`, accepting the same input bus and returning boolean outputs without throwing unexpected exceptions or requiring special-case branching by callers.

#### I — Interface Segregation Principle (ISP)
Clients must **never be forced to depend on interfaces they do not use**.
- Favor granular, role-specific interfaces over fat monolithic contracts:
  ```typescript
  // ❌ Fat monolithic interface
  interface IPore {
    readVoltage(): boolean;
    drainBattery(): void;
    replicateGenome(): void;
    renderCanvas(): void;
  }

  // ✅ Granular, segregated interfaces
  interface IReadablePin { readState(): boolean; }
  interface IWritablePin { writeState(val: boolean): void; }
  interface IEnergySink { consumeTokens(amount: number): boolean; }
  interface IGenomeHolder { getGenome(): string; }
  ```
- An adjacent neighbor pore only sees exposed `IReadablePin` border connections—it never has access to the internal `IEnergySink` or `IGenomeHolder`.

#### D — Dependency Inversion Principle (DIP)
High-level modules must **depend on abstractions (interfaces), never on low-level concrete details**.
- The `SimulationEngine` depends on `ISubstratePhysics` and `IEnvironmentSource`, never on concrete implementations. This enables standalone headless unit testing, test doubles, and alternate environmental rules.

---

### 1.3 DRY (Don't Repeat Yourself) & Single Source of Truth (SSOT)
- **Single Source of Truth:** Every constant, codon mapping, mathematical conversion, and physical rule must reside in exactly one canonical file (e.g., `CodonTable.ts`, `PhysicalConstants.ts`).
- **No Duplicated Bitwise Logic:** Low-level bit-twiddling, Gray code conversions, and word-level parallel operations must be centralized in thoroughly tested math modules (`BitwiseMath.ts`).
- **The Rule of Three:** Do not introduce premature abstractions for code that appears twice. When a pattern appears a third time, extract it into a clean, reusable component.

---

### 1.4 KISS (Keep It Simple, Stupid) & YAGNI (You Aren't Gonna Need It)
- **No Speculative Architecture:** Do not build abstract factory generators, multi-tiered plugin registries, or reflection frameworks for hypothetical future needs.
- **Direct, Transparent Logic:** Prefer straightforward, readable code over clever, opaque tricks. The codebase is an open-source educational laboratory; readability is paramount.

---

## 2. Complexity Budgets & Code Size Metrics

To ensure maintainability and eliminate cognitive overhead, all code must satisfy strict numerical budgets:

```
┌───────────────────────────────────────────────────────────────┐
│                      STRICT CODE BUDGETS                      │
│                                                               │
│  • Cyclomatic Complexity per Function:  MAX 7 (ESLint Error)  │
│  • Function Length:                     MAX 50–60 Lines       │
│  • File Length:                         MAX 250–300 Lines     │
│  • Parameter Count per Function:        MAX 3–4 Parameters    │
│  • Maximum Nesting Depth:               MAX 3 Levels          │
└───────────────────────────────────────────────────────────────┘
```

### 2.1 Cyclomatic Complexity Maximum $\le 7$
- **Enforcement:** Enforced via automated linting (`complexity: ["error", 7]`).
- **Remediation Techniques:**
  1. *Guard Clauses / Early Returns (Bouncer Pattern):* Exit early on invalid conditions to eliminate nested `if/else` pyramids (the Arrow Anti-Pattern).
  2. *Lookup Tables & Dispatch Maps:* Replace multi-case switch statements with `Map<Key, Handler>` or object dispatchers.
  3. *Subroutine Decomposition:* Break multi-stage procedures into atomic, well-named private helper functions.
  4. *Polymorphism:* Delegate variant behavior to specialized strategy objects.

### 2.2 Maximum Function & File Length
- **Function Length ($\le 50-60$ lines):** Every function must fit on a single screen without vertical scrolling. If a routine exceeds 60 lines, it is violating SRP and must be split.
- **File Length ($\le 250-300$ lines):** No file should exceed 300 lines. Larger files indicate mixed responsibilities and must be decomposed into cohesive sub-modules.
- **Parameter Count ($\le 3-4$ params):** If a function requires more than 3 parameters, bundle them into a strongly-typed options/config object.

---

## 3. Anti-Monolith Mandate ("No Kitchen Sink Files")

One of the most destructive anti-patterns is the "Kitchen Sink" file: dumping miscellaneous helpers into a catch-all file or creating a massive, God-object `GameManager.ts`.

### Strict Anti-Monolith Rules:
1. **Forbidden Catch-All File Names:**  
   The creation of any of the following files is **strictly banned**:
   - ❌ `utils.ts` / `utils.js`
   - ❌ `helpers.ts` / `helpers.js`
   - ❌ `common.ts` / `common.js`
   - ❌ `misc.ts` / `misc.js`
   - ❌ `manager.ts` / `shared.ts`
2. **Cohesive, Domain-Specific Naming:**  
   Every utility must be explicitly named after its bounded domain:
   - ❌ `utils.ts` $\longrightarrow$ ✅ `BitwiseMath.ts`, `ManhattanDistance.ts`, `SeedablePrng.ts`
   - ❌ `helpers.ts` $\longrightarrow$ ✅ `CodonFormatter.ts`, `WaveformGenerator.ts`
3. **One Primary Class Per File:**  
   Each source file must declare exactly one primary class or interface. Supporting types/enums may live in the same file only if they are private to that module.
4. **Strict Directory Taxonomy:**  
   Organize files into cohesive domain packages:
   ```
   src/
   ├── core/
   │   ├── domain/        # Pore, Cell, GenomeSafe, PoreWorkshop, PoreBattery
   │   ├── physics/       # Vent emission, thermodynamics, Landauer power
   │   ├── logic/         # Gate definitions, AST nodes, parallel evaluation
   │   ├── codons/        # 64-entry degenerate table, translation, introns
   │   └── prng/          # Mulberry32 seedable generator
   ├── engine/            # Simulation loop, scheduler, Web Worker dispatch
   └── presentation/      # Canvas/WebGL renderer, UI components, HUD telemetry
   ```

---

## 4. Separation of Concerns & Clean Layered Architecture

Siliquarium enforces a strict unidirectional dependency rule:

```
  [Presentation Layer]   (React, HTML5 Canvas, WebGL, UI Controls)
           │
           ▼ (Reads telemetry packets)
  [Engine / Application] (Web Worker Dispatch, Tick Loop, Scheduler)
           │
           ▼ (Executes domain physics)
  [Core Domain Layer]    (Pores, Cells, Gates, Codons, Thermodynamics)
```

- **The Zero-DOM Mandate in Core:**  
  The core simulation kernel (`src/core/` and `src/engine/`) must have **zero imports or dependencies on browser APIs**:
  - ❌ No `document`, `window`, `HTMLElement`, `localStorage`, or `CanvasRenderingContext2D`.
  - The simulation must be 100% executable inside Node.js CLI test runners and headless Web Workers.
- **Decoupled Telemetry:**  
  The core engine communicates with the UI thread strictly via flat, compressed binary buffers (`Float32Array`, `Uint8Array`) or typed messaging ports, preventing GC lag on the 60 FPS render thread.

---

## 5. Type Safety, Immutability, & Defensive Programming

1. **Strict TypeScript Compiler Settings:**
   - `"strict": true`
   - `"noImplicitAny": true`
   - `"strictNullChecks": true`
   - `"strictFunctionTypes": true`
   - `"noUnusedLocals": true`
   - `"noUnusedParameters": true`
   - `"noImplicitReturns": true`
2. **Zero `any` Types:**  
   Use of `any` is strictly prohibited. Use `unknown` with type narrowing guards, generic parameters, or discriminated unions.
3. **Immutability & Pure Functions:**  
   - Declare properties as `readonly` wherever possible.
   - Core mathematical evaluations (AST evaluation, codon parsing, metric distances) must be pure functions with zero hidden side effects.
4. **Fail-Fast Boundary Validation:**  
   Public methods must validate preconditions immediately (e.g., verifying grid coordinate bounds, non-negative energy tokens, valid 6-bit strings). Throw descriptive, custom domain errors rather than letting corrupt state silently propagate.

---

## 6. Scientific & Algorithmic Integrity (The Zero-Smuggling Mandate)

Siliquarium is an authentic artificial life simulator, not an engineering CAD tool with smuggled answers:

1. **Strict Operator Blindness:**  
   The replication and mutation operators must operate completely blind to the environment. They cannot inspect vent rhythms, cell energy levels, or neighbor circuits to guide mutation targets.
2. **Zero Hidden Gradients:**  
   No external cost functions or artificial directional beacons are permitted.
3. **The Epistemic Cut:**  
   Active gates in a pore's workshop must never be mutated during their operational lifetime. Mutation occurs exclusively on the inert symbolic bitstring during replication into a child pore.
4. **Thermodynamic Energy Conservation:**  
   Energy is strictly conserved: $\sum E_{\text{in}} = \sum E_{\text{stored}} + \sum E_{\text{dissipated}}$. No energy tokens may appear or disappear without accounting.
