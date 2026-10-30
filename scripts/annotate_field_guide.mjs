import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetFile = path.join(rootDir, 'docs', 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');

let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add Epistemic Transparency Notice & Suite Navigation right after title
const navBanner = `> [!IMPORTANT]
> **Independent Scientific Instrument & Non-Accreditation Notice:**  
> The Siliquarium application, theoretical model, and documentation are not designed, developed, peer-reviewed, or sponsored by any accredited university, government research agency, or academic accreditation board. Because this project represents an independent computational biophysics instrument, every statement, equation, and evolutionary claim is accompanied below by full mathematical derivations, thermodynamic proofs, and peer-reviewed scientific citations.
>
> 📖 **Circuit Paleontology Companion Reference Suite:**  
> [📖 Paleontology Glossary](CIRCUIT_PALEONTOLOGY_GLOSSARY.html) | [📚 Annotated Bibliography](CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html) | [📝 Critical Notes & Justifications](CIRCUIT_PALEONTOLOGY_NOTES.html) | [🏛️ Master Documentation Portal](index.html)
`;

if (!content.includes('Independent Scientific Instrument & Non-Accreditation Notice')) {
  content = content.replace(
    /# ⚡ Digital Circuit Paleontology: Field Guide to Biological Logic Networks\n\*The Complete Illustrated Taxonomy of 10 Evolved Micro-Circuits and Macro-Adaptations Recognized by the Siliquarium Paleontologist\*\n\n---\n/m,
    `# ⚡ Digital Circuit Paleontology: Field Guide to Biological Logic Networks
*The Complete Illustrated Taxonomy of 10 Evolved Micro-Circuits and Macro-Adaptations Recognized by the Siliquarium Paleontologist*

---

${navBanner}
---
`
  );
}

// 2. Annotate Section 1 (Foundations)
content = content.replace(
  /\*\*1\. The Safe and the Workshop \(The Epistemic Cut\):\*\*/g,
  '**1. The Safe and the Workshop (The Epistemic Cut) [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2):**'
);
content = content.replace(
  /\*\*2\. The Hydrothermal Vent \(The Digital Drumbeat\):\*\*/g,
  '**2. The Hydrothermal Vent (The Digital Drumbeat) [[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4) [[Note 32]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-32):**'
);
content = content.replace(
  /\*\*3\. The Rock Pores \(Nature's First Walls\):\*\*/g,
  "**3. The Rock Pores (Nature's First Walls) [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2):**"
);
content = content.replace(
  /\*\*4\. The Battery Pantry \(Landauer's Thermodynamic Price\):\*\*/g,
  "**4. The Battery Pantry (Landauer's Thermodynamic Price) [[Note 5]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-5):**"
);

// 3. Annotate Section 2 (Paleontological Philosophy)
content = content.replace(
  /### 🛑 No Smuggled Intelligence \(The Voltmeter Principle\)/g,
  '### 🛑 No Smuggled Intelligence (The Voltmeter Principle) [[Note 1]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-1) [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)'
);

// 4. Annotate Section 3 (Master Taxonomy)
content = content.replace(
  /## 3\. Master Taxonomy of the 10 Evolved Circuits & Motifs/g,
  '## 3. Master Taxonomy of the 10 Evolved Circuits & Motifs [[Note 3]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-3)'
);

// 5. Annotate Section 4 (Bistable Latch)
content = content.replace(
  /### 4\.1 The Biophysical Dilemma: Why Cells Need Memory/g,
  '### 4.1 The Biophysical Dilemma: Why Cells Need Memory [[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4)'
);
content = content.replace(
  /- \*\*The Landauer Switching Cost:\*\*/g,
  '- **The Landauer Switching Cost [[Note 5]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-5):**'
);
content = content.replace(
  /### 4\.4 Formal Mathematics & Differential Rate Equations/g,
  '### 4.4 Formal Mathematics & Differential Rate Equations [[Note 6]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-6) [[Note 7]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-7)'
);

// 6. Annotate Section 5 (Ring Oscillator)
content = content.replace(
  /### 5\.1 The Motivating Biophysical Dilemma: The Sluggish Hydrothermal Periphery/g,
  '### 5.1 The Motivating Biophysical Dilemma: The Sluggish Hydrothermal Periphery [[Note 10]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-10)'
);
content = content.replace(
  /### 5\.2 Step-by-Step Logic & Physical Mechanics/g,
  '### 5.2 Step-by-Step Logic & Physical Mechanics [[Note 8]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-8)'
);
content = content.replace(
  /### 5\.4 Formal Mathematics & Barkhausen Oscillation Criterion/g,
  '### 5.4 Formal Mathematics & Barkhausen Oscillation Criterion [[Note 8]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-8) [[Note 9]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-9)'
);

// 7. Annotate Section 6 (Coherent FFL)
content = content.replace(
  /### 6\.1 The Motivating Biophysical Dilemma: The Fluid Turbulence False-Alarm Trap/g,
  '### 6.1 The Motivating Biophysical Dilemma: The Fluid Turbulence False-Alarm Trap [[Note 12]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-12)'
);
content = content.replace(
  /### 6\.2 Step-by-Step Logic & Asymmetric Delay/g,
  '### 6.2 Step-by-Step Logic & Asymmetric Delay [[Note 11]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-11)'
);
content = content.replace(
  /### 6\.4 Formal Mathematics & Delay Integration/g,
  '### 6.4 Formal Mathematics & Delay Integration [[Note 11]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-11)'
);

// 8. Annotate Section 7 (Incoherent FFL)
content = content.replace(
  /### 7\.1 The Motivating Biophysical Dilemma: Receptor Saturation & Sensory Blindness/g,
  '### 7.1 The Motivating Biophysical Dilemma: Receptor Saturation & Sensory Blindness [[Note 14]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-14)'
);
content = content.replace(
  /### 7\.2 Step-by-Step Logic & Physical Mechanics/g,
  '### 7.2 Step-by-Step Logic & Physical Mechanics [[Note 13]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-13)'
);
content = content.replace(
  /### 7\.4 Formal Mathematics & Exact Fold-Change Invariance/g,
  '### 7.4 Formal Mathematics & Exact Fold-Change Invariance [[Note 13]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-13)'
);

// 9. Annotate Section 8 (Negative Autoregulation)
content = content.replace(
  /### 8\.1 The Motivating Biophysical Dilemma: Sluggish Rise Times and Toxic Overshoot/g,
  '### 8.1 The Motivating Biophysical Dilemma: Sluggish Rise Times and Toxic Overshoot [[Note 15]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-15)'
);
content = content.replace(
  /### 8\.2 Step-by-Step Logic & Homeostatic Mechanics/g,
  '### 8.2 Step-by-Step Logic & Homeostatic Mechanics [[Note 16]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-16) [[Note 17]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-17)'
);
content = content.replace(
  /### 8\.4 Formal Mathematics & Response Acceleration Derivation/g,
  '### 8.4 Formal Mathematics & Response Acceleration Derivation [[Note 15]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-15)'
);

// 10. Annotate Section 9 (Half-Adder)
content = content.replace(
  /### 9\.1 The Motivating Biophysical Dilemma: Multi-Channel Signal Integration/g,
  '### 9.1 The Motivating Biophysical Dilemma: Multi-Channel Signal Integration [[Note 18]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-18)'
);
content = content.replace(
  /### 9\.4 Formal Mathematics & The Impossibility of XOR in Single Layers/g,
  '### 9.4 Formal Mathematics & The Impossibility of XOR in Single Layers [[Note 18]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-18)'
);

// 11. Annotate Section 10 (Allosteric Inverter)
content = content.replace(
  /### 10\.1 The Motivating Biophysical Dilemma: Heavy-Metal Toxin Plumes/g,
  '### 10.1 The Motivating Biophysical Dilemma: Heavy-Metal Toxin Plumes [[Note 20]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-20)'
);
content = content.replace(
  /### 10\.4 Formal Mathematics & Hill Repression Curve/g,
  '### 10.4 Formal Mathematics & Hill Repression Curve [[Note 19]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-19)'
);

// 12. Annotate Section 11 (Endosymbiont Cassette)
content = content.replace(
  /### 11\.1 The Motivating Biophysical Dilemma: The Bioenergetic Genome Ceiling/g,
  '### 11.1 The Motivating Biophysical Dilemma: The Bioenergetic Genome Ceiling [[Note 21]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-21)'
);
content = content.replace(
  /### 11\.4 Formal Mathematics: The Surface-to-Volume Power Wall/g,
  '### 11.4 Formal Mathematics: The Surface-to-Volume Power Wall [[Note 21]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-21) [[Note 22]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-22)'
);

// 13. Annotate Section 12 (Syncytial Multicellularity)
content = content.replace(
  /### 12\.1 The Motivating Biophysical Dilemma: The Starvation Shadow/g,
  '### 12.1 The Motivating Biophysical Dilemma: The Starvation Shadow [[Note 23]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-23)'
);
content = content.replace(
  /### 12\.4 Formal Mathematics & Conserved Mass Proof/g,
  '### 12.4 Formal Mathematics & Conserved Mass Proof [[Note 24]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-24) [[Note 25]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-25)'
);

// 14. Annotate Section 13 (Pelagic Sporulation Engine)
content = content.replace(
  /### 13\.1 The Motivating Biophysical Dilemma: The Benthic Malthusian Trap/g,
  '### 13.1 The Motivating Biophysical Dilemma: The Benthic Malthusian Trap [[Note 26]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-26)'
);
content = content.replace(
  /### 13\.2 Step-by-Step Logic & Physical Mechanics/g,
  '### 13.2 Step-by-Step Logic & Physical Mechanics [[Note 27]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-27) [[Note 28]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-28)'
);
content = content.replace(
  /### 13\.4 Formal Mathematics: 3D Hydrodynamic Advection/g,
  '### 13.4 Formal Mathematics: 3D Hydrodynamic Advection [[Note 29]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-29) [[Note 30]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-30)'
);

// 15. Append Section 14 at the end
const section14 = `
---

## 14. Master Concordance of Critical Scientific Notes & Epistemic Justifications

Because Siliquarium is an independent computational biophysics instrument developed without accredited university or agency sponsorship, all empirical statements, mathematical models, and thermodynamic laws are cross-referenced below to the separate [Critical Scientific Notes & Epistemic Justifications](CIRCUIT_PALEONTOLOGY_NOTES.html) page and [Annotated Primary Literature Bibliography](CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html):

| Note ID | Scientific Claim & Theoretical Principle | Governing Mathematical Formula / Law | Primary Literature Justification | Siliquarium Source Mapping |
| :---: | :--- | :--- | :--- | :--- |
| **[[Note 1]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-1)** | Non-Teleological Evolution & Absence of Fitness Functions | $\\frac{dE_p}{dt} = \\dot{E}_{\\text{in}} - \\dot{E}_{\\text{basal}} - \\dot{E}_{\\text{Landauer}}$ | Maturana & Varela (1972) Autopoiesis | [\`SimulationWorld.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) |
| **[[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)** | Howard Pattee's Epistemic Cut & Observer Paleontology | $V_i(t+1) = \\phi_i(\\vec{V}(t))$ vs. Genome Safe | Pattee (1972, 2001) Biosystems | [\`GenomeSafe.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/GenomeSafe.ts) |
| **[[Note 3]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-3)** | Weisfeiler-Lehman Graph Kernel Isomorphism Bounds | $h_v^{(t+1)} = \\text{Hash}(h_v^{(t)}, \\{\\!\\{ h_u^{(t)} \\}\\!\\})$ | Weisfeiler & Lehman (1968) | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4)** | Asymmetric Nutrient Arrival & Memory Selection Pressure | $R(t) = k \\cdot [A(t)] \\cdot [B(t)]$ across gap $\\tau$ | Gardner, Cantor, & Collins (2000) | [\`PoreCell.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts) |
| **[[Note 5]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-5)** | Landauer's Principle: Switching Cost $\\Delta Q = k_B T \\ln 2$ | $\\Delta S_{\\text{res}} \\ge k_B \\ln 2 \\implies \\Delta Q = 1\\text{ token}$ | Landauer (1961); Bennett (1982) | [\`PoreBattery.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreBattery.ts) |
| **[[Note 6]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-6)** | Gardner-Collins Bistability: Cooperativity Exponent Proof | $\\beta \\cdot \\gamma > 1$ required for bifurcation | Gardner, Cantor, & Collins (2000) | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 7]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-7)** | Double-Well Potential Well & Separatrix Barrier $\\Delta E$ | $V(x) = -\\frac{a}{2}x^2 + \\frac{b}{4}x^4$ | Bialek (2012) Biophysics | [\`fig_circuit_1_bistable_latch.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_1_bistable_latch.svg) |
| **[[Note 8]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-8)** | Odd-Loop Frustration & Absence of Static Fixed Points | $\\text{NOT}^N(x) \\ne x$ for odd $N \\implies$ limit cycle | Elowitz & Leibler (2000) Nature | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 9]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-9)** | Barkhausen Criteria & Period $T = 2N\\tau = 6\\tau$ | $|A\\beta| \\ge 1, \\quad \\Delta\\Phi = 2\\pi m$ | Elowitz & Leibler (2000); Razavi (2001) | [\`fig_circuit_2_repressilator.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_2_repressilator.svg) |
| **[[Note 10]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-10)** | Anticipatory Metabolic Pacing vs. Lag Phase Starvation | $E_{\\text{capture}} = \\int_0^T [\\text{Fuel}] \\cdot \\text{Porin}(t) dt$ | Alon (2019); Johnson et al. (2011) | [\`VentPhysics.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/physics/VentPhysics.ts) |
| **[[Note 11]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-11)** | Sign-Sensitive Delay Filtering in Coherent FFLs | $\\tau_{\\text{on}} = \\frac{1}{\\alpha_Y}\\ln(\\frac{1}{1-K/\\beta}), \\tau_{\\text{off}}=0$ | Mangan & Alon (2003) PNAS | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 12]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-12)** | Bioenergetic Overhead of Enzyme Synthesis & Eddy Rejection | $40 \\times 15\\text{T} = 600\\text{T saved per epoch}$ | Milo & Phillips (2015) Cell Numbers | [\`PoreWorkshop.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreWorkshop.ts) |
| **[[Note 13]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-13)** | Fold-Change Invariance (FCD) in Incoherent FFLs | $Z(t) = F(X(t)/X_0)$ invariant under $X \\to cX$ | Goentoro et al. (2009) Mol Cell | [\`fig_circuit_4_incoherent_ffl.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_4_incoherent_ffl.svg) |
| **[[Note 14]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-14)** | Receptor Saturation & The Weber-Fechner Law | $\\theta = C/(C+K_d) \\implies d\\theta/dC \\to 0$ | Alon (2007) Nat Rev Genet | [\`PoreCell.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts) |
| **[[Note 15]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-15)** | Negative Autoregulation: Derivation of 5× Faster Rise Time | $t_{1/2}^{\\text{NAR}} = \\frac{\\ln 2}{\\alpha(1+G)} = \\frac{t_{1/2}}{1+G}$ | Rosenfeld, Elowitz, & Alon (2002) | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 16]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-16)** | Expression Noise Suppression via Restoring Force | $\\sigma^2_{\\text{NAR}} = \\frac{\\langle X \\rangle}{1+G}$ | Thattai & van Oudenaarden (2001) | [\`fig_circuit_5_negative_autoregulation.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_5_negative_autoregulation.svg) |
| **[[Note 17]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-17)** | Empirical Prevalence of NAR in Bacterial Genomes | $> 40\\%$ of all transcription factors in *E. coli* | Shen-Orr et al. (2002) Nat Genet | RegulonDB Database |
| **[[Note 18]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-18)** | Linear Non-Separability of XOR & Stoichiometric Half-Adders | $S = A \\oplus B, \\quad C = A \\cdot B$ | Minsky & Papert (1969) Perceptrons | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |
| **[[Note 19]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-19)** | Landauer Cost of Monod-Wyman-Changeux Allosteric Shifts | $\\Delta G_{\\text{MWC}} = -k_B T \\ln(L) \\implies 1\\text{ token}$ | Monod, Wyman, & Changeux (1965) | [\`fig_circuit_7_allosteric_inverter.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_7_allosteric_inverter.svg) |
| **[[Note 20]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-20)** | Heavy Metal Plume Precipitation & Sulfide Toxicity | $\\text{Enzyme-SH} + M^{2+} \\to \\text{Enzyme-S-M}^+$ | Russell & Hall (1997) J Geol Soc | [\`VentPhysics.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/physics/VentPhysics.ts) |
| **[[Note 21]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-21)** | Nick Lane & Bill Martin Bioenergetic Power Law ($r^2$ vs. $r^3$) | $200,000\\times$ more energy per gene via organelles | Lane & Martin (2010) Nature | [\`DigitalPaleontologist.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/DigitalPaleontologist.ts) |
| **[[Note 22]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-22)** | Serial Endosymbiotic Theory (SET) Molecular Foundations | Alphaproteobacterial 16S rRNA circular DNA | Margulis (1967, 1981); Gray et al. (1999) | [\`fig_circuit_8_endosymbiotic_cassette.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_8_endosymbiotic_cassette.svg) |
| **[[Note 23]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-23)** | Fickian Diffusion Across Syncytial Cytoplasmic Bridges | $J = -D \\frac{\\partial \\Phi}{\\partial x}$ | Bonner (1965) Size and Cycle | [\`SimulationWorld.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) |
| **[[Note 24]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-24)** | Euclidean Integer Division & Conserved Mass Law Invariant | $\\Delta M_{\\text{colony}} \\equiv 0.000$ (zero float drift) | Verified in Test Stage 7 | [\`SimulationWorld.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) |
| **[[Note 25]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-25)** | Major Transitions in Individuality & Division of Labor | Somatic (feeding) vs. Germline (spores) | Maynard Smith & Szathmáry (1995) | [\`fig_circuit_9_syncytial_multicellularity.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_9_syncytial_multicellularity.svg) |
| **[[Note 26]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-26)** | Benthic Logistic Carrying Capacity ($K$) & Contact Exclusion | $\\frac{dN}{dt} = rN(1 - N/K) \\to 0$ as $N \\to K$ | MacArthur & Wilson (1967) Biogeography | [\`HexGrid3D.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/grid/HexGrid3D.ts) |
| **[[Note 27]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-27)** | FtsZ GTPase Contractile Cleavage Z-Ring Mechanics | Invaginates membrane with $\\sim 10\\text{ pN}$ constrictive force | Erickson et al. (2010) MMBR | [\`PoreCell.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/PoreCell.ts) |
| **[[Note 28]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-28)** | Metabolic Cryptobiosis & Vitrified Zero-Dissipation Drift | $\\dot{E}_{\\text{Landauer}} = 0\\text{ tokens/tick in } z=1, 2$ | Keilin (1959); Crowe et al. (1992) | [\`SimulationWorld.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) |
| **[[Note 29]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-29)** | Abyssal Hydrodynamic Advection Escapes Boundary Layer | $u(z) = \\frac{u_*}{\\kappa}\\ln(z/z_0) \\implies v_x(z\\ge 1) \\gg v_{\\text{benthic}}$ | Vogel (1994) Life in Moving Fluids | [\`fig_circuit_10_pelagic_sporulation.svg\`](file:///h:/My%20Drive/Repos/Siliquarium/docs/assets/diagrams/fig_circuit_10_pelagic_sporulation.svg) |
| **[[Note 30]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-30)** | Richard Dawkins' Extended Phenotype in Spore Dispersal | Phenotypic effects operating across ocean currents | Dawkins (1982) The Extended Phenotype | [\`SimulationWorld.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/SimulationWorld.ts) |
| **[[Note 31]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-31)** | Shannon Entropy vs. Kolmogorov Algorithmic Complexity | $H(X)$ statistical surprise vs. $K(s)$ code length | Shannon (1948); Kolmogorov (1965) | [\`GenomeSafe.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/GenomeSafe.ts) |
| **[[Note 32]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-32)** | Physical Constants of Mitchell Chemiosmotic Equation | $\\frac{2.303 RT}{F} = 59.2\\text{ mV/pH at } 25^\\circ\\text{C}$ | Mitchell (1961) Nature | [\`VentPhysics.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/physics/VentPhysics.ts) |
| **[[Note 33]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-33)** | Neutral Drift & 64-Entry Degenerate Codon Table | $k = \\mu$ neutral substitution rate | Kimura (1968, 1983) Neutral Theory | [\`CodonTable.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/CodonTable.ts) |
| **[[Note 34]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-34)** | Susumu Ohno's Gene Duplication & Divergence | Duplication frees redundant copy from purifying selection | Ohno (1970) Gene Duplication | [\`GenomeSafe.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/domain/GenomeSafe.ts) |
| **[[Note 35]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-35)** | Richard Lenski LTEE Hyperbolic Fitness Trajectories | $W(t) = (1+ct)^d$ with $d \\approx 0.1$ | Lenski et al. (1991); Blount (2008) | Verified in Test Stage 13 |
| **[[Note 36]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-36)** | Homology vs. Homoplasy in Convergent Network Motifs | Ancestral inheritance vs. independent discovery | Alon (2007); Gould (2002) | [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts) |

---
`;

if (!content.includes('Master Concordance of Critical Scientific Notes')) {
  content += section14;
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully annotated docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md with all note references and Master Concordance!');
