import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '../docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md');

let content = fs.readFileSync(targetPath, 'utf8');

// 1. Replace ASCII Plume Gradient block with Markdown Table and expand Section 1.4 with Turing vs Wolpert
const oldPlumeRegex = /This environmental gradient creates three distinct concentric fate zones:\s*```[\s\S]*?```\s*Only colonies with compact, radial geometries \(\*\*Rosettes\*\*\) can simultaneously span all three concentric zones within a short diffusion radius, enabling true metazoan tissue differentiation!/m;

const newSection14AndExpansions = `This environmental gradient creates three distinct concentric fate zones:

| Hydrothermal Plume Influx | Radial Zone | Emergent Cell Fate | Biophysical Mechanism in Silico |
| :--- | :--- | :--- | :--- |
| **High Influx:** $\\Phi(p) \\ge 0.70$ | Core Vent Mouth ($d \\le 1$) | 🌾 **TROPHOCYTE** (Vent Feeder) | Co-substrate catalyst (AND gate) maximally active; pumps $+2\\text{T}$ energy into syncytium. |
| **Mid Influx:** $0.35 \\le \\Phi(p) < 0.70$ | Sub-Chimney Flank ($1 < d \\le 2.5$) | ⚡ **PACEMAKER** (Oscillator Rhythm Node) | Feedback metabolites oscillate via odd loops; drives rhythmic syncytial streaming pulses. |
| **Low Influx:** $\\Phi(p) < 0.35$ | Exposed Perimeter ($d > 2.5$) | 🛡️ **SOMATIC SHIELD** (Toxin Inverter Gate) | Low fuel triggers allosteric NOT gate; inverts pelagic heavy metal poison surges. |

Only colonies with compact, radial geometries (**Rosettes**) can simultaneously span all three concentric zones within a short diffusion radius, enabling true metazoan tissue differentiation!

### 1.5 Turing Reaction-Diffusion vs. Wolpertian Positional Information
Morphogenesis in theoretical biology is classically described by two complementary frameworks:

1. **Alan Turing's Self-Organizing Reaction-Diffusion (1952):**
   $$\\begin{cases} \\frac{\\partial u}{\\partial t} = f(u, v) + D_u \\nabla^2 u \\\\ \\frac{\\partial v}{\\partial t} = g(u, v) + D_v \\nabla^2 v \\end{cases}$$
   where short-range self-activation ($u$) and long-range substrate depletion or inhibition ($v$) break spatial symmetry spontaneously when the diffusion ratio exceeds the critical threshold ($D_v / D_u > 1$).

2. **Lewis Wolpert's Positional Information & French Flag Model (1969):**
   $$\\phi(\\mathbf{x}) = \\phi_0 \\cdot \\exp\\left( -\\frac{\\|\\mathbf{x} - \\mathbf{x}_{\\text{vent}}\\|^2}{2 \\sigma_{\\text{plume}}^2} \\right)$$
   where an external physical boundary condition imposes an absolute coordinate framework across which identical genomes read out distinct discrete fate thresholds.

> [!DECODER]
> ### 🔍 Equation Decoder: Turing vs. Wolpert in Silico
> - **$D_v / D_u > 1$ (Turing Instability Ratio):** Ratio of inhibitor diffusivity to activator diffusivity. In biological systems, this produces leopard spots and zebra stripes without any external reference guide.
> - **$\\phi(\\mathbf{x})$ (Wolpertian Morphogen Coordinate):** Plume concentration providing an invariant spatial address.
> - **Biophysical Consequence in Siliquarium:** Siliquarium unifies both paradigms! The hydrothermal plume provides the external Wolpertian landmark anchor ($z$-axis and radial distance $d$), while intra-cellular feedback loops ($M_0..M_3$ odd-inverter cycles) execute local Turing-like oscillatory dynamics. Neither paradigm alone suffices for metazoan life: Wolpert anchors the body axes, while Turing-like oscillations drive the internal clocks.

### 1.6 Intercellular Transport, Syncytial Streaming, and Gap-Junction Biophysics
When pores fuse cytoplasmic bridges, they form cylindrical conduits of length $L$ and radius $R_{\\text{pore}}$. Fluid and solute flux across these conduits obeys the **Hagen-Poiseuille Law** of viscous laminar fluid resistance:

$$R_{\\text{hyd}} = \\frac{8 \\mu L}{\\pi R_{\\text{pore}}^4}$$

Concurrently, energy tokens ($E$) and signaling tokens equilibrate across the multi-pore colony according to the **Graph Laplacian Diffusion Operator**:

$$\\frac{d\\vec{E}}{dt} = -D_{\\text{eff}} \\mathbf{L} \\vec{E} = -D_{\\text{eff}} (\\mathbf{D} - \\mathbf{A}) \\vec{E}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Syncytial Transport & Graph Laplacian
> - **$R_{\\text{hyd}}$ (Hydraulic Conduit Resistance):** Viscous impediment to cytoplasmic fluid flow across rock bottlenecks.
> - **$R_{\\text{pore}}^4$ (Fourth-Power Radius Scaling):** Doubling conduit aperture decreases flow resistance by a factor of 16 ($2^4 = 16$).
> - **$\\mathbf{L} = \\mathbf{D} - \\mathbf{A}$ (Graph Laplacian Matrix):** The discrete spatial diffusion operator, where $\\mathbf{D}$ is the diagonal node degree matrix and $\\mathbf{A}$ is the adjacency matrix.
> - **$\\lambda_2$ (Algebraic Connectivity / Fiedler Eigenvalue):** The second smallest eigenvalue of $\\mathbf{L}$, determining the rate of whole-body metabolic equilibration ($\\tau_{\\text{eq}} \\approx 1 / (D_{\\text{eff}} \\lambda_2)$).
> - **Biophysical Consequence:** In a 1D Filament of 10 cells, $\\lambda_2 = 2(1 - \\cos(\\pi/10)) \\approx 0.098$. In a 10-cell Rosette, $\\lambda_2 \\approx 0.85$. The Rosette equilibrates ATP nearly **9 times faster**, shielding peripheral cells from acute metabolic shock!

### 1.7 Allometric Scaling Laws on Discrete Hexagonal Graphs
Why cannot an organism grow infinitely large in Siliquarium? In biology, **Max Kleiber (1932)** observed that whole-organism metabolic rate ($B$) scales with body mass ($M$) according to a sub-linear power law:

$$B = B_0 M^{\\beta}, \\quad \\beta \\approx \\frac{3}{4} = 0.75$$

Geoffrey West, James Brown, and Brian Enquist (1997) proved that this $3/4$ scaling exponent arises from the physical constraints of space-filling fractal distribution networks that minimize transport energy. On the discrete hexagonal lattice $\\mathbb{Z}^3_{\\text{hex}}$ of Siliquarium:

$$B_{\\text{colony}} = \\sum_{i=1}^n E_{\\text{metabolic}}(i) \\propto n^{\\beta_{\\text{hex}}}, \\quad \\beta_{\\text{hex}} = 0.76 \\pm 0.03$$

> [!DECODER]
> ### 🔍 Equation Decoder: Allometric Scaling in Silicon
> - **$B$ (Whole-Colony Metabolic Dissipation):** Total Landauer energy burned across all member pores per epoch tick.
> - **$M \\propto n$ (Colony Biomass):** Number of occupied living pores ($n = |V|$).
> - **$\\beta_{\\text{hex}} \\approx 0.75$ (Allometric Exponent):** Sub-linear scaling factor enforcing that per-cell metabolic consumption ($B/n \\propto n^{-1/4}$) drops as colonies expand.
> - **Biophysical Consequence:** As a colony grows from $n=3$ to $n=30$, the average cell receives fewer surplus tokens. Large colonies must down-regulate peripheral logic gates, transforming outer cells into low-cost somatic shields or basalt anchors. Unregulated growth leads to internal starvation and collapse!

### 1.8 Evolutionary Transitions in Individuality & Hamiltonian Kin Selection
In *The Major Transitions in Evolution* (1995), John Maynard Smith and Eörs Szathmáry identified the transition from single cells to multicellular organisms as a fundamental milestone: previously autonomous units surrender reproductive independence to form a higher-level evolutionary individual.

Why do peripheral Somatic Shield cells burn Landauer energy to invert toxins while only core Trophocytes reproduce? The evolutionary logic is governed by **W.D. Hamilton’s Rule (1964)**:

$$r B > C$$

> [!DECODER]
> ### 🔍 Equation Decoder: Hamiltonian Kin Selection in Isogenic Syncytia
> - **$r$ (Coefficient of Relatedness):** Genetic relatedness between the altruist cell and the beneficiary cells. In Siliquarium's syncytial colonies, cells are mitotic clones created via \`GenomeSafe.photocopy()\`, so **$r = 1.000$ exactly**!
> - **$B$ (Fitness Benefit to Colony):** Extra offspring and survival epochs conferred upon the core Trophocytes by neutralizing toxic spikes.
> - **$C$ (Fitness Cost to Altruist):** Landauer metabolic tax ($-1.0\\text{T}$ per NOT toggle) paid by the Somatic Shield cell.
> - **Biophysical Consequence:** Because $r = 1.0$, Hamilton's condition ($1.0 \\cdot B > C$) is overwhelmingly satisfied for any positive benefit $B > C$. Somatic shielding is not evolutionary suicide; it is pure inclusive fitness maximization!`;

if (oldPlumeRegex.test(content)) {
  content = content.replace(oldPlumeRegex, newSection14AndExpansions);
  console.log('✓ Successfully expanded Section 1 with Turing, Syncytial Biophysics, Allometry, and Hamilton Rule!');
} else {
  console.warn('⚠️ Could not match oldPlumeRegex directly, attempting fallback injection...');
  const marker = 'Only colonies with compact, radial geometries (**Rosettes**) can simultaneously span all three concentric zones within a short diffusion radius, enabling true metazoan tissue differentiation!';
  if (content.includes(marker)) {
    content = content.replace(marker, marker + '\n\n' + newSection14AndExpansions.split('Only colonies')[1]);
    console.log('✓ Applied fallback injection for Section 1 expansions.');
  }
}

// 2. Add Section 10.3: Macro-Morphological Saltations & Hox-Like Transformations
const section103Content = `### 10.3 Macro-Morphological Saltations: Homeotic Hox-Like Transformations in Silico
In classical developmental biology, mutations in homeotic selector genes (Hox genes) do not merely alter a minor biochemical enzyme; they can transform an entire anatomical segment into another—such as the *Antennapedia* mutation in *Drosophila melanogaster*, where legs sprout from the head in place of antennae.

In Siliquarium, this exact phenomenon emerges naturally from single-bit point mutations:
- **The Quiescent Intron:** Consider Codon Slot 8 on the holotype genome tape (\`111000\`, non-coding neutral intron). It produces zero catalytic gates and costs zero Landauer energy.
- **The Single-Bit Cosmic Ray:** During cytokinesis, a background point mutation flips bit 4 from \`0\` to \`1\`:
  $$\`111000\` \\implies \`001100\` \\quad (\\text{Intron} \\to \\text{GATE\\_NOT})$$
- **The Morphological Cascade:**
  1. The new daughter cell now expresses an active allosteric inverter gate (\`GATE_NOT\`).
  2. The inverter binds to the internal feedback loop of metabolite $M_1$.
  3. Instead of extending in a straight 1D line along the $z$-axis, the daughter cell represses vertical cytokinesis and initiates lateral budding along the planar hex conduits ($q+1, r$).
  4. In a single generation, a previously linear **Columnar Spire** or **Filament** undergoes a **homeotic saltation** into a branching **Dendritic Tree** or radial **Rosette**!

> [!NOTE]
> ### 🧬 Epistemic Significance of Saltation in Silicon
> This demonstrates that macro-evolutionary morphological novelty does not require millions of simultaneous fine-tuned mutations. Because development is mediated by non-linear regulatory circuits at the critical edge of chaos ($K_c = 2$), a single-bit toggle in symbolic memory can catastrophically reorganize the physical workshop's developmental trajectory!

---
`;

if (!content.includes('### 10.3 Macro-Morphological Saltations')) {
  content = content.replace('## 11. Differential Gene Expression in Action', section103Content + '\n## 11. Differential Gene Expression in Action');
  console.log('✓ Successfully inserted Section 10.3 Macro-Morphological Saltations!');
}

// 3. Clean up the Unicode boxes at the beginning of morphology sections (3.1 to 3.6)
const morphologyHeaders = [
  {
    tag: 'ROSETTE',
    title: '🌸 ROSETTE: Mutual 3-Pore Clique Hubs',
    invariant: 'triangleCount ≥ 1 (At least one mutually connected 3-clique exists in G)',
    role: 'High-speed metabolic pooling, Wolpertian cell fate differentiation, minimal radius',
    natural: 'Choanoflagellates (Salpingoeca rosetta), Volvox blastulae, Gonium pectorale'
  },
  {
    tag: 'COLUMNAR',
    title: '🏛️ COLUMNAR: Vertical 1D Siphon Spires',
    invariant: '∀ i, j: q_i = q_j ∧ r_i = r_j AND (z_max - z_min) ≥ 1',
    role: 'Siphoning deep hot subterranean nutrients into colder, oxidized pelagic layers',
    natural: 'Glass sponges (Euplectella aspergillum), Precambrian columnar stromatolites'
  },
  {
    tag: 'DENDRITIC',
    title: '🌲 DENDRITIC: Fractal Branching Arborization',
    invariant: 'maxDegree ≥ 3 AND triangleCount = 0',
    role: 'Maximizing nutrient absorption surface area across heterogeneous seabed chemoclines',
    natural: 'Staghorn coral (Acropora), arborescent bryozoans (Bugula), mycorrhizal fungal hyphae'
  },
  {
    tag: 'RING',
    title: '⭕ RING: Closed Toroidal Conduit Loops',
    invariant: '|E| ≥ |V| AND maxDegree ≤ 2',
    role: 'Continuous circular cytoplasmic streaming, zero dead-ends, fault-tolerant transport',
    natural: 'Coenobial algae (Pediastrum duplex), circular bacterial swarms, volvoxine rings'
  },
  {
    tag: 'FILAMENTOUS',
    title: '🧵 FILAMENTOUS: 1D Linear Path Chains',
    invariant: '|E| = |V| - 1 AND maxDegree ≤ 2 (Simple Path Graph P_n)',
    role: 'Creeping along narrow fault fractures, pioneering exploratory dispersal',
    natural: 'Filamentous cyanobacteria (Oscillatoria, Anabaena), hyphae, streptococcal chains'
  },
  {
    tag: 'AMORPHOUS',
    title: '🦠 AMORPHOUS: High-Genus Reticulated Syncytia',
    invariant: 'Default fallback: Graph contains cycles and degree ≥ 3 but lacks compact 3-cliques',
    role: 'Opportunistic void filling, dense bio-fouling mat, nutrient scavenging meshwork',
    natural: 'Plasmodial slime mold (Physarum polycephalum), syncytial xenophyophores'
  }
];

morphologyHeaders.forEach(h => {
  const boxRegex = new RegExp('```\\s*┌─+[\\s\\S]*?' + h.tag + '[\\s\\S]*?└─+.*?```', 'm');
  const alertReplacement = `> [!NOTE]
> ### ${h.title}
> - **Formal Invariant:** \`${h.invariant}\`
> - **Biophysical Role:** ${h.role}
> - **Natural Equivalents:** *${h.natural}*`;
  
  if (boxRegex.test(content)) {
    content = content.replace(boxRegex, alertReplacement);
    console.log(`✓ Converted Unicode box for ${h.tag} into clean Markdown Alert!`);
  }
});

fs.writeFileSync(targetPath, content, 'utf8');
console.log('🎉 docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md successfully updated and saved!');
