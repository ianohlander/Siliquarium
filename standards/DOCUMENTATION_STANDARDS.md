# 📚 Siliquarium Documentation & Pedagogical Standards
*The 5-Dimension Conceptual Rubric, Non-Engineer Accessibility, and Epistemological Integrity*

---

## 1. The 5-Dimension Conceptual Pedagogical Rubric

All documentation, tutorials, and academic treatises in Siliquarium must meet institutional-grade teaching standards evaluated across five strict dimensions (targeting a perfect 50/50 score):

| Dimension | Standard | How to Implement in Siliquarium |
| :--- | :--- | :--- |
| **D1: Visceral Intuition & Foundational Motivation** | Never drop a student into formal mathematics without establishing the physical stakes and intuitive motivation first. | Open every chapter by explaining *why* an organism faces an existential crisis (e.g., the dilution catastrophe, the danger of thermal noise, the struggle for limited vent calories). |
| **D2: The Gradient of Abstraction** | Build a gentle, continuous bridge from everyday common sense to formal mechanics. Avoid "complexity cliffs." | Never jump straight from a metaphor to a differential equation or measure-theoretic summation. Introduce a 2-bit toy example first, then generalize. |
| **D3: Deconstructive Equation Anatomy** | Every formula must be accompanied by a Multi-Color "Equation Decoder" breaking down each algebraic variable. | Color-code terms in the formula using the standard multi-color palette (`\color{#38bdf8}`, `\color{#34d399}`, `\color{#fbbf24}`, `\color{#f43f5e}`, `\color{#c084fc}`) and provide matching color swatches in the 3-part breakdown: (1) Colored formal symbol, (2) Plain-English meaning, (3) Physical biological consequence. |
| **D4: Concrete Micro-Scaffolding & Toy Pre-Traces** | Provide concrete, worked numerical traces before showing large-scale aggregate results. | Include worked step-by-step trace tables showing a single pore over 5 ticks (e.g., Tick 1: Battery = 50, Vent pulse = 1, Gate toggles = 2, Net Tokens = +3). |
| **D5: Conceptual Misconception Immunity** | Proactively identify and dismantle common student and skeptic misunderstandings before they take root. | Include explicit "Skeptic FAQ" callouts addressing teleology, "smuggled intelligence," and the difference between mutating code vs mutating bodies. |

---

## 2. The Non-Engineer Accessibility Mandate

Siliquarium is designed to be understood by biologists, students, curious thinkers, and non-engineers. **Engineering jargon must never be used as a substitute for clear explanation.**

### The Four Sacred Analogies
When explaining Siliquarium mechanics, always anchor explanations to these foundational metaphors:

1. **The Safe and the Workshop (The Epistemic Cut):**  
   - *Jargon:* Genotype-phenotype translation bottleneck.  
   - *Plain English:* The genome is an inert recipe resting in a safe (the cookbook). The active circuit is the kitchen. You never mutate the frying pan while cooking; you only photocopy the recipe when opening a new restaurant.
2. **The Hydrothermal Vent (The Digital Drumbeat):**  
   - *Jargon:* Non-equilibrium periodic bitstream flux.  
   - *Plain English:* Digital food is a musical rhythm or drumbeat passing by. An organism "eats" by catching the rhythm with its internal pendulum.
3. **The Rock Pores (Nature's First Walls):**  
   - *Jargon:* Inorganic mineral micro-compartmentation.  
   - *Plain English:* Microscopic pockets in deep-sea volcanic rocks that act as free stone houses, protecting proto-life from being washed away before lipid cell membranes evolved.
4. **The Battery (The Local Pantry):**  
   - *Jargon:* Discrete dynamic CMOS power counter.  
   - *Plain English:* A calorie counter or health meter. Toggling gates burns calories; catching vent rhythms adds calories. Reaching 100 calories triggers division.

---

## 3. Multi-Color Equation Decoder Anatomy Format (Standing Mandate)

> ### 🎨 Standing Mandate: Universal Multi-Color Visual Decoding
> Many students, naturalists, and non-mathematicians will not be proficient with abstract algebraic notation. Mathematical formulas must not act as barrier gates; they must tell a clear visual story about physical and biological relationships.
>
> Therefore, **every equation across the entire documentation suite must use multiple distinct colors for each expression**, and **every decoder bullet must match its term's exact color**. This allows any reader to effortlessly map mathematical symbols directly to their intuitive physical meanings.

### Standard Color Palette
All equations and decoders must adhere to the standardized 5-color semantic palette:
- **Bioluminescent Cyan (`#38bdf8`):** Macroscopic state, dependent output variable, or primary result (e.g., $\textcolor{#38bdf8}{E_{\text{net}}}$, $\textcolor{#38bdf8}{\mathbf{x}(t+1)}$, $\textcolor{#38bdf8}{t_{\text{diff}}}$, $\textcolor{#38bdf8}{\tau(G)}$).
- **Emerald Green (`#34d399`):** Operators, transfer mappings, catalytic kinetics, and physical constants (e.g., $\textcolor{#34d399}{E_{\text{harvest}}}$, $\textcolor{#34d399}{\mathbf{F}}$, $\textcolor{#34d399}{D_{\text{eff}}}$, $\textcolor{#34d399}{\text{Tr}(\mathbf{A}^3)}$).
- **Amber Gold (`#fbbf24`):** Internal microstates, stored battery tokens, memory latches, and coordinate dimensions (e.g., $\textcolor{#fbbf24}{\mathbf{x}(t)}$, $\textcolor{#fbbf24}{M_k(t)}$, $\textcolor{#fbbf24}{L^2}$, $\textcolor{#fbbf24}{\Delta E_i}$).
- **Rose Red (`#f43f5e`):** Environmental perturbations, external signals, toxins, entropy leakage, and Landauer dissipation (e.g., $\textcolor{#f43f5e}{E_{\text{leak}}}$, $\textcolor{#f43f5e}{\mathbf{u}(t)}$, $\textcolor{#f43f5e}{Q_{\text{Landauer}}}$, $\textcolor{#f43f5e}{T_{\text{tox}}}$).
- **Violet Purple (`#c084fc`):** Geometric indices, topological normalization factors, coordinate strata, and scaling exponents (e.g., $\textcolor{#c084fc}{G}$, $\textcolor{#c084fc}{z_{\text{elev}}}$, $\textcolor{#c084fc}{\frac{1}{6}}$, $\textcolor{#c084fc}{r}$).

### Canonical Implementation Template

```markdown
$$\textcolor{#38bdf8}{E_{\text{net}}} = \textcolor{#34d399}{E_{\text{harvest}}} - \sum_{i=1}^{\textcolor{#c084fc}{G}} \textcolor{#fbbf24}{\Delta E_i} - \textcolor{#f43f5e}{E_{\text{leak}}}$$

> ### 🔍 Equation Decoder
> - **$\textcolor{#38bdf8}{E_{\text{net}}}$ (Net Energy Balance):** The total energy token surplus or deficit remaining in the pore's pantry after all metabolic inflows and outflows are accounted for.
> - **$\textcolor{#34d399}{E_{\text{harvest}}}$ (Food Influx):** The raw energy tokens captured when the circuit synchronizes with the incoming vent pulse (+5 tokens per harmonic match).
> - **$\sum_{i=1}^{\textcolor{#c084fc}{G}} \textcolor{#fbbf24}{\Delta E_i}$ (Metabolic Cost):** The Landauer dynamic power dissipated across all $\textcolor{#c084fc}{G}$ active logic gates (1 token burned per gate transition).
> - **$\textcolor{#f43f5e}{E_{\text{leak}}}$ (Basal Maintenance):** Constant background entropy cost required to prevent internal latches from decaying (1 token every 10 ticks).
```

---

## 4. Academic Provenance & Master Citations

Siliquarium stands on the shoulders of giants across biophysics, information theory, and evolutionary biology. Every major mechanism must cite its peer-reviewed foundation:

- **Alkaline Hydrothermal Vents & Inorganic Pores:**  
  *Russell, M. J., & Hall, A. J. (1997).* "The emergence of life from iron monosulphide bubbles at a submarine hydrothermal spring." *Journal of the Geological Society*, 154(3), 377–402.  
  *Lane, N. (2015).* *The Vital Question: Energy, Evolution, and the Origins of Complex Life.* W. W. Norton & Company.
- **The Epistemic Cut (Genotype-Phenotype Separation):**  
  *Pattee, H. H. (1972).* "The nature of hierarchical controls in living matter." *Foundations of Mathematical Biology*, 1, 1–22.  
  *Davies, P. (1999).* *The Fifth Miracle: The Search for the Origin and Meaning of Life.* Simon & Schuster.
- **Thermodynamic Limits of Information:**  
  *Landauer, R. (1961).* "Irreversibility and heat generation in the computing process." *IBM Journal of Research and Development*, 5(3), 183–191.  
  *Bennett, C. H. (1982).* "The thermodynamics of computation—a review." *International Journal of Theoretical Physics*, 21(12), 905–940.
- **Autopoiesis & Self-Maintenance:**  
  *Maturana, H. R., & Varela, F. J. (1980).* *Autopoiesis and Cognition: The Realization of the Living.* D. Reidel Publishing.
- **Self-Reproducing Automata:**  
  *Von Neumann, J. (1966).* *Theory of Self-Reproducing Automata* (Edited and completed by A. W. Burks). University of Illinois Press.

---

## 5. The HTML-First Human Documentation Mandate (Standing Rule)

> ### 📜 Standing Architectural Mandate: Dual-Format Publishing
> All documentation intended for human comprehension, review, and instruction must be published and maintained in **both** GitHub Flavored Markdown (.md) and rich, self-contained HTML (.html).

1. **Zero-Server Standalone Accessibility:**  
   Every generated HTML document must open directly in modern web browsers via the local ile:/// protocol without requiring an active HTTP server or build step at view time.
2. **The Deep-Sea Abyssal Theme:**  
   HTML documents must follow Siliquarium's dark oceanic design system:
   - Background: Dark abyssal slate/obsidian (#0a0e17 / #0f172a).
   - Text: High-contrast legible typography (#e2e8f0 / #f8fafc) with clean sans-serif font stacks.
   - Accents: Bioluminescent cyan (#00e5ff) for primary links and titles, thermal amber (#ffb300) for emphasis, and emerald (#10b981) for success badges.
3. **Mathematical & Diagrammatic Fidelity:**  
   Equations written in LaTeX must render cleanly (via KaTeX / MathJax with clear plaintext fallbacks), and tables must be fully responsive with zebra striping.
4. **Unified Top Navigation:**  
   Every human-facing HTML document must include a unified navigation header linking across the entire documentation suite:
   - **Overview / Portal** (index.html)
   - **Theoretical Model** (THEORETICAL_MODEL.html)
   - **Epistemic Foundations** (EPISTEMIC_FOUNDATIONS.html)
   - **Brand Identity & Logos** (BRAND_IDENTITY.html / logos.html)
   - **Development Standards** (DEVELOPMENT_STANDARDS.html)
   - **QA & Testing Standards** (QA_AND_TESTING_STANDARDS.html)
   - **Documentation Standards** (DOCUMENTATION_STANDARDS.html)
5. **Continuous Build Synchronization:**  
   Any prompt or commit that modifies documentation must execute the HTML doc build pipeline (`node scripts/build_docs_html.mjs`) to guarantee that HTML files never drift out of sync with their Markdown sources.

---

## 6. Strict Prohibition of Fictitious Persons and Institutions (Standing Mandate)

> ### 📜 Standing Mandate: Objective Institutional Voice & Zero Fictitious Attribution
> All documentation, specifications, tutorials, field guides, and QA audit reports in Siliquarium must be authored in an authoritative, objective, institutional voice. **The invention or referencing of fictitious persons, researchers, professors, students, instructors, universities, departments, or institutes is strictly prohibited.**

1. **Zero Fictitious Personas or Characters:**  
   - Never invent or reference fictional individuals (e.g., no fictional "Dr. Vance", "Alex Rivera", "Jordan Hayes", "Dr. Rostova", or similar character roleplays).
   - In audits, usability reviews, and QA evaluations, describe observations strictly from the perspective of **functional user archetypes** and objective user stories (e.g., "Novice User / Student Archetype", "Systems & Network Modeler", "CAD Systems Ergonomist", "Domain Paleobiologist").
2. **Academic Provenance & Scientific Integrity:**  
   - All historical foundations, mathematical models, and scientific citations must refer exclusively to **real, published peer-reviewed researchers and historical literature** (e.g., Howard Pattee, Rolf Landauer, Stuart Kauffman, Lewis Wolpert, Alan Turing, Uri Alon, Lynn Margulis, W. D. Hamilton, Motoo Kimura, Susumu Ohno, Michael Russell, Nick Lane).
   - Never fabricate academic papers, fictional institutional affiliations, or nonexistent departments.
3. **Institutional Neutrality:**  
   - Documentation speaks for the project directly ("The Siliquarium Project", "The Digital Paleontology Engine", "The Simulation Subsystem").
   - Authorship bylines, when present, must denote project roles or engineering teams, never fictional individuals or imaginary institutes.

---

## 7. Textbook Architecture, Domain Partitioning & Intuitive Navigation (Standing Mandate)

> ### 📖 Standing Mandate: Textbook-Grade Organization & Clean Domain Separation
> Siliquarium documentation is organized as an interconnected, graduate-level academic textbook suite. Readers must be able to navigate logically through every subject without facing cross-domain pollution, redundant copy-pasting, or dead-end pages.

### 7.1 Strict Domain Partitioning (Zero Contamination Rule)
Each document belongs to a single canonical ontological domain. Cross-domain concepts must be linked via formal cross-references rather than repeated:

1. **Volume 1: Prebiotic Biophysics & Thermodynamic Foundations** (`docs/THEORETICAL_MODEL.md`, `docs/EPISTEMIC_FOUNDATIONS.md`)
   - *Domain Scope:* The physical laws of the abyssal deep sea, chemiosmotic proton motive force, inorganic rock pore containment, Landauer thermodynamic dissipation, and Howard Pattee's Epistemic Cut (rate-independent symbols vs rate-dependent dynamics).
   - *Boundary Constraint:* Does NOT delve into higher-order multicellular graph invariants or user interface CAD controls.
2. **Volume 2: Gene Regulatory Networks & Attractor Landscapes** (`docs/GENE_REGULATORY_NETWORKS_VOLUME.md`)
   - *Domain Scope:* Genetic switches, promoter/repressor operon dynamics, boolean and continuous transfer kinetics, differential transcription in isogenic cells, Waddington canalization, and Kauffman $K=2$ dynamical attractors.
   - *Boundary Constraint:* Focuses on gene expression and regulatory logic; cross-references morphological body topologies in Volume 3.
3. **Volume 3: Multicellular Morphology & Graph-Theoretic Morphometrics** (`docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md`)
   - *Domain Scope:* Cytokinesis, syncytial gap-junction streaming, Wolpertian morphogen plumes, hex-lattice graph invariants ($\tau(G)$ 3-cliques), and the 5 canonical body plans (Rosette, Columnar, Dendritic, Ring, Filamentous).
   - *Boundary Constraint:* Focuses on spatial geometry and developmental morphodynamics; cross-references circuit paleontology in Volume 4.
4. **Volume 4: Circuit Paleontology & Taxonomy Field Guide** (`docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md` & specimen dossiers)
   - *Domain Scope:* Empirical taxonomy of evolved digital life, Weisfeiler-Lehman graph isomorphism hashing, fossil netlists, and the 15 canonical circuit archetypes.
   - *Boundary Constraint:* Focuses on historical/fossil specimens; cross-references theoretical proofs in Volumes 1–3.
5. **Volume 5: Illustrated Systems Manual & Laboratory Practicums** (`docs/USER_GUIDE.md`, `docs/curriculum/practicums_lab_manual.md`)
   - *Domain Scope:* Operating the simulation software, camera controls, CAD terrain sculptors, live oscilloscope, God-suite parameters, and structured student laboratory exercises.
   - *Boundary Constraint:* Focuses on software interactions and experiment procedures; relies on Volumes 1–4 for theoretical explanations.
6. **Master Companion Suite** (`docs/companion/glossary.md`, `docs/companion/study_guides.md`, `docs/companion/bibliography.md`)
   - *Domain Scope:* Centralized reference repository providing the master 70+ term lexicon, comprehensive multi-color equation decoders, and primary literature citations.

### 7.2 Textbook Navigation Standard
Every chapter and volume must provide intuitive, bidirectional navigation:
1. **Prominent Table of Contents (TOC):** Every major document must open with a categorized TOC linking directly to each section anchor.
2. **Standard Chapter Footer Navigation:** Every volume must terminate with prominent navigation cards linking to the immediately preceding and succeeding chapters:
   ```markdown
   ---

   ## 🧭 Textbook Navigation & Reading Order

   | [← Previous Chapter: Volume N-1](...) | [Master Curriculum Portal](index.md) | [Next Chapter: Volume N+1 →](...) |
   ```
3. **Explicit Cross-References:** Whenever an external concept is invoked, provide a direct hypertext link to the exact section in the relevant volume (e.g., `See [Volume 2: Gene Regulatory Networks §4.2](GENE_REGULATORY_NETWORKS_VOLUME.md#42-discrete-dynamical-transfer-mapping)`).


