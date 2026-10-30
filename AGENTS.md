# 🏛️ Siliquarium Mandatory Development & Inviolable QA Rules

This repository enforces the strict coding, architectural, and QA requirements specified in [`GEMINI.md`](./GEMINI.md) and [`standards/DEVELOPMENT_STANDARDS.md`](./standards/DEVELOPMENT_STANDARDS.md).

## Inviolable Standing Mandate (Across All Sessions)

1. **Mandatory Code QA & Technical Debt Control (Zero Accumulation):**
   - **Automated Audit Execution:** Run `node scripts/comprehensive_coding_qa_audit.mjs` and `node scripts/audit_codebase_standards.mjs` at the end of every build.
   - **Zero New Technical Debt:** No changes may increase technical debt or exceed QA budgets:
     - Cyclomatic Complexity per function $\le 7$
     - Function Length $\le 50\text{--}60$ lines
     - File Length $\le 250\text{--}300$ lines (SRP decomposition)
     - Parameter Count $\le 3\text{--}4$ args
     - Nesting Depth $\le 3$ levels
     - Zero `any` types
     - Zero DOM tokens in `src/core/`, `src/engine/`, `src/server/`
     - Strict OOP encapsulation, DDD rich models, and SOLID architecture
     - Anti-monolith mandate (no `utils.ts`, `helpers.ts`, `common.ts`, `misc.ts`, `manager.ts`, `shared.ts`)
     - UI strictly separated from business logic (HTML templates separated from controllers)
     - Zero Smuggling ($\Delta E \equiv 0.000$, $\Delta M \equiv 0.000$, $I_+ = 0$)
   - Any commit that introduces debt or fails budget checks is strictly prohibited.

2. **Automated Verification:**
   - Run `npm test` and verify that all 25 test stages pass with 100% determinism.
   - Run adversarial falsification suites (`Adversarial QA/falsification_suite*.mjs`) whenever core/engine/physics logic is touched.

3. **Mandatory Git Push:**
   - Every build must be committed with clean conventional commit messages and pushed to the repository (`git push origin main`) at the end of every task or session. Never leave unstaged or unpushed work.
