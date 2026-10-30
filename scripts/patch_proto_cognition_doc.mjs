import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetFile = path.join(rootDir, 'docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.md');

let content = fs.readFileSync(targetFile, 'utf8');

// 1. Landauer equation in Section 1
content = content.replace(
  '$$\\Delta Q \\ge k_B T \\ln 2$$',
  () => `$$\\color{#f43f5e}{\\Delta Q} \\ge \\color{#34d399}{k_B T} \\ln \\color{#38bdf8}{2}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Landauer Thermodynamic Dissipation Limit
> - **$\\color{#f43f5e}{\\Delta Q}$ (Dissipated Thermal Heat):** The mandatory minimum thermodynamic energy dissipated into the hydrothermal environment per bit erasure or state transition.
> - **$\\color{#34d399}{k_B T}$ (Thermal Energy Scale):** Boltzmann constant $k_B$ multiplied by absolute ambient temperature $T$ (Joules).
> - **$\\color{#38bdf8}{2}$ (Binary Alphabet Base):** Reflects the two discrete informational states of a digital bit ($0$ or $1$).
> - **Biophysical Consequence:** Every gate toggle burns calories from the pore's battery pantry; computation is fundamentally bound to thermodynamic starvation.`
);

// 2. Adami complexity in Section 1
content = content.replace(
  '$$C(X) = I(X; E) = H(E) - H(E \\mid X)$$',
  () => `$$\\color{#38bdf8}{C(X)} = \\color{#34d399}{I(X; E)} = \\color{#fbbf24}{H(E)} - \\color{#f43f5e}{H(E \\mid X)}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Adami Genomic Complexity & Environmental Information
> - **$\\color{#38bdf8}{C(X)}$ (Physical Genomic Complexity):** The true biological information content (in bits) encoded in living sequence $X$.
> - **$\\color{#34d399}{I(X; E)}$ (Shannon Mutual Information):** The shared information between the genome and the selective environment $E$.
> - **$\\color{#fbbf24}{H(E)}$ (Marginal Environmental Entropy):** The raw statistical diversity and variability of ambient hydrothermal states.
> - **$\\color{#f43f5e}{H(E \\mid X)}$ (Conditional Environmental Noise):** The remaining uncertainty about environmental states given the organism's genome.
> - **Biophysical Consequence:** Genomes do not create complexity from a vacuum; natural selection burns environmental facts into surviving DNA through differential death.`
);

// 3. Serpentinization reaction in Section 2.1 (make inline)
content = content.replace(
  '$$\\color{#34d399}{(\\text{Mg, Fe})_2\\text{SiO}_4} + \\color{#38bdf8}{\\text{H}_2\\text{O}} \\longrightarrow \\color{#fbbf24}{(\\text{Mg, Fe})_3\\text{Si}_2\\text{O}_5(\\text{OH})_4} + \\color{#c084fc}{\\text{Fe}_3\\text{O}_4} + \\color{#f43f5e}{\\text{H}_2}$$',
  () => '$\\color{#34d399}{(\\text{Mg, Fe})_2\\text{SiO}_4} + \\color{#38bdf8}{\\text{H}_2\\text{O}} \\longrightarrow \\color{#fbbf24}{(\\text{Mg, Fe})_3\\text{Si}_2\\text{O}_5(\\text{OH})_4} + \\color{#c084fc}{\\text{Fe}_3\\text{O}_4} + \\color{#f43f5e}{\\text{H}_2}$'
);

// 4. Redox cascade in Section 2.1 (make inline)
content = content.replace(
  '$$\\text{Aerobic Respiration } (\\text{O}_2) \\longrightarrow \\text{Denitrification } (\\text{NO}_3^-) \\longrightarrow \\text{Manganese Reduction } (\\text{Mn}^{4+}) \\longrightarrow \\text{Iron Reduction } (\\text{Fe}^{3+}) \\longrightarrow \\text{Sulfate Reduction } (\\text{SO}_4^{2-}) \\longrightarrow \\text{Methanogenesis } (\\text{CO}_2)$$',
  () => '*Redox Cascade Hierarchy:* $\\text{Aerobic } (\\text{O}_2) \\longrightarrow \\text{Denitrification } (\\text{NO}_3^-) \\longrightarrow \\text{Mn}^{4+} \\longrightarrow \\text{Fe}^{3+} \\longrightarrow \\text{SO}_4^{2-} \\longrightarrow \\text{Methanogenesis } (\\text{CO}_2)$'
);

// 5. Redox reactions in Section 2.2 (make inline)
content = content.replace(
  '$$\\color{#34d399}{\\text{H}_2\\text{S}} + \\color{#38bdf8}{2\\text{O}_2} \\longrightarrow \\color{#fbbf24}{\\text{SO}_4^{2-}} + \\color{#c084fc}{2\\text{H}^+} \\quad (\\Delta G^\\circ = -792\\text{ kJ/mol})$$\n      $$\\color{#34d399}{4\\text{H}_2} + \\color{#38bdf8}{\\text{CO}_2} \\longrightarrow \\color{#fbbf24}{\\text{CH}_4} + \\color{#c084fc}{2\\text{H}_2\\text{O}} \\quad (\\Delta G^\\circ = -131\\text{ kJ/mol})$$',
  () => '$\\color{#34d399}{\\text{H}_2\\text{S}} + \\color{#38bdf8}{2\\text{O}_2} \\longrightarrow \\color{#fbbf24}{\\text{SO}_4^{2-}} + \\color{#c084fc}{2\\text{H}^+} \\; (\\Delta G^\\circ = -792\\text{ kJ/mol})$ and $\\color{#34d399}{4\\text{H}_2} + \\color{#38bdf8}{\\text{CO}_2} \\longrightarrow \\color{#fbbf24}{\\text{CH}_4} + \\color{#c084fc}{2\\text{H}_2\\text{O}} \\; (\\Delta G^\\circ = -131\\text{ kJ/mol})$'
);

// 6. Fenton reaction in Section 2.3 (make inline)
content = content.replace(
  '$$\\text{Fe}^{2+} + \\text{H}_2\\text{O}_2 \\longrightarrow \\text{Fe}^{3+} + \\cdot\\text{OH} + \\text{OH}^-$$',
  () => '$\\text{Fe}^{2+} + \\text{H}_2\\text{O}_2 \\longrightarrow \\text{Fe}^{3+} + \\cdot\\text{OH} + \\text{OH}^-$'
);

// 7. Berg-Purcell equations in Section 3.1
const oldBP = `The rate of molecules colliding with a cell of radius $a$ in a concentration field $c$ is given by Smoluchowski flux:
$$J = 4\\pi D a c$$
where $D$ is the molecular diffusion coefficient ($\\sim 10^{-5}\\text{ cm}^2/\\text{s}$). The number of molecular encounters recorded by surface receptors over a measurement time interval $\\tau_{\\text{meas}}$ is:
$$N = 4\\pi D a c \\tau_{\\text{meas}}$$
Because arrival events are governed by Poisson statistics, the inherent statistical noise in the measurement is $\\sigma_N = \\sqrt{N}$. Thus, the fractional measurement error in concentration is:
$$\\frac{\\delta c}{c} = \\frac{1}{\\sqrt{4\\pi D a c \\tau_{\\text{meas}}}}$$`;

const newBP = `The rate of molecules colliding with a cell of radius $a$ in a concentration field $c$ is given by Smoluchowski flux $J = 4\\pi D a c$, yielding total molecular encounters $N = 4\\pi D a c \\tau_{\\text{meas}}$ over integration window $\\tau_{\\text{meas}}$. Because arrival events are governed by Poisson statistics ($\\sigma_N = \\sqrt{N}$), the fundamental lower bound on fractional measurement uncertainty is:

$$\\color{#38bdf8}{\\frac{\\delta c}{c}} = \\frac{\\color{#c084fc}{1}}{\\sqrt{\\color{#c084fc}{4\\pi} \\color{#34d399}{D} \\color{#c084fc}{a} \\color{#fbbf24}{c} \\color{#f43f5e}{\\tau_{\\text{meas}}}}}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Berg-Purcell Physical Limit of Chemoreception
> - **$\\color{#38bdf8}{\\frac{\\delta c}{c}}$ (Fractional Measurement Uncertainty):** The irreducible statistical noise floor in concentration sensing across a single microscopic cell.
> - **$\\color{#34d399}{D}$ (Molecular Diffusion Constant):** The diffusion coefficient of chemical substrate molecules in seawater ($\\sim 10^{-5}\\text{ cm}^2/\\text{s}$).
> - **$\\color{#c084fc}{a}$ (Cellular Physical Radius):** The spherical radius of the proto-cell body ($a \\approx 1\\,\\mu\\text{m}$).
> - **$\\color{#fbbf24}{c}$ (Ambient Substrate Concentration):** Bulk environmental concentration of hydrothermal nutrient molecules.
> - **$\\color{#f43f5e}{\\tau_{\\text{meas}}}$ (Measurement Averaging Window):** The duration over which receptors integrate molecular collisions before rotational Brownian diffusion scrambles cell orientation.
> - **Biophysical Consequence:** Proves that spatial gradient sensing across a $1\\,\\mu\\text{m}$ cell is physically impossible; proto-life must measure changes over time ($dc/dt$) to navigate.`;

content = content.replace(oldBP, () => newBP);

// 8. Temporal derivative equation in Section 3.1
const oldTD = `$$\\frac{dc}{dt} \\approx \\frac{c(t_2) - c(t_1)}{\\Delta t} \\approx v \\cdot \\nabla c$$`;
const newTD = `$$\\color{#38bdf8}{\\frac{dc}{dt}} \\approx \\frac{\\color{#fbbf24}{c(t_2)} - \\color{#fbbf24}{c(t_1)}}{\\color{#c084fc}{\\Delta t}} \\approx \\color{#34d399}{v} \\cdot \\color{#f43f5e}{\\nabla c}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Temporal Gradient Calculus
> - **$\\color{#38bdf8}{\\frac{dc}{dt}}$ (Calculated Temporal Derivative):** The rate of change in nutrient concentration measured over time interval $\\Delta t$.
> - **$\\color{#fbbf24}{c(t_2)}, \\color{#fbbf24}{c(t_1)}$ (Successive Sensory Readings):** Past versus present ligand concentration samples stored in biochemical memory.
> - **$\\color{#c084fc}{\\Delta t}$ (Sensory Memory Lag):** The temporal delay separating sensory comparisons ($\sim 1\\text{ to }2\\text{ ticks}$).
> - **$\\color{#34d399}{v}$ (Advective / Swimming Velocity):** The speed of cellular displacement across spatial coordinates.
> - **$\\color{#f43f5e}{\\nabla c}$ (Spatial Concentration Gradient):** The physical spatial gradient vector in the surrounding hydrothermal fluid.
> - **Biophysical Consequence:** Converts an unmeasurable spatial gradient into a macroscopic temporal difference that rises clear above Brownian thermal noise.`;

content = content.replace(oldTD, () => newTD);

// 9. Methylation integral in Section 3.1
const oldMeth = `$$M(t) = \\int_0^t \\Big( k_R - k_B [\\text{CheB-P}](t') \\Big) dt'$$`;
const newMeth = `$$\\color{#38bdf8}{M(t)} = \\int_0^{\\color{#c084fc}{t}} \\left( \\color{#34d399}{k_R} - \\color{#f43f5e}{k_B} \\color{#fbbf24}{[\\text{CheB-P}](t')} \\right) dt'$$

> [!DECODER]
> ### 🔍 Equation Decoder: Receptor Methylation Integral Feedback
> - **$\\color{#38bdf8}{M(t)}$ (Analog Receptor Methylation State):** Total covalent methyl groups accumulating on MCP receptor glutamates (the internal memory trace).
> - **$\\color{#34d399}{k_R}$ (Zero-Order Methylation Rate):** Constant rate of methyl group addition catalyzed by CheR.
> - **$\\color{#f43f5e}{k_B}$ (Demethylation Rate Constant):** Catalytic rate of methyl group removal by phosphorylated CheB.
> - **$\\color{#fbbf24}{[\\text{CheB-P}](t')}$ (Active Demethylase Concentration):** Activity of the negative feedback enzyme reflecting current kinase state.
> - **$\\color{#c084fc}{t}$ (Integration Time Horizon):** Physical duration across which the receptor array accumulates past history.
> - **Biophysical Consequence:** Guarantees robust perfect adaptation; output kinase activity always resets to baseline under sustained constant input.`;

content = content.replace(oldMeth, () => newMeth);

// 10. Adler equation in Section 3.3
const oldAdler = `$$\\frac{d\\phi}{dt} = \\Delta\\omega - K \\sin \\phi$$`;
const newAdler = `$$\\color{#38bdf8}{\\frac{d\\phi}{dt}} = \\color{#34d399}{\\Delta\\omega} - \\color{#fbbf24}{K} \\sin \\color{#c084fc}{\\phi}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Adler Phase-Locking Dynamics
> - **$\\color{#38bdf8}{\\frac{d\\phi}{dt}}$ (Phase Drift Rate):** The rate at which the biological clock slips relative to the environmental rhythm.
> - **$\\color{#34d399}{\\Delta\\omega}$ (Frequency Detuning):** Difference between intrinsic clock frequency $\\omega_0$ and external vent pulse frequency $\\omega_e$.
> - **$\\color{#fbbf24}{K}$ (Coupling Strength):** Sensitivity of the internal oscillator to incoming hydrothermal sensory resets.
> - **$\\color{#c084fc}{\\phi}$ (Instantaneous Phase Offset):** Angular difference between internal metabolic peak and external pulse arrival.
> - **Biophysical Consequence:** When $K \\ge |\\Delta\\omega|$, the clock phase-locks with zero phase drift, priming enzymes before the nutrient pulse arrives.`;

content = content.replace(oldAdler, () => newAdler);

// 11. Hagen-Poiseuille and Nakagaki in Section 3.4
const oldHP = `The cytoplasmic transport network of *Physarum* consists of an interconnected web of cylindrical protoplasmic tubes. Fluid transport through each tube is governed by classical low-Reynolds-number **Hagen-Poiseuille flow**:
$$Q_{ij} = \\frac{\\pi r_{ij}^4}{8 \\eta L_{ij}} (P_i - P_j)$$
where $r_{ij}$ is tube radius, $L_{ij}$ is tube length, $\\eta$ is protoplasmic viscosity, and $P_i - P_j$ is the hydrostatic pressure difference generated by rhythmic actin-myosin contractions in the surrounding cortical gel (shuttle streaming).

Tero, Kobayashi, and Nakagaki (2007, 2010) proved that the collective cognitive behavior of the slime mold emerges from a simple, local physical feedback rule operating on every tube:
$$\\frac{d r_{ij}}{dt} = f(|Q_{ij}|) - \\alpha r_{ij} = \\gamma |Q_{ij}|^\\mu - \\alpha r_{ij}$$`;

const newHP = `The cytoplasmic transport network of *Physarum* consists of an interconnected web of cylindrical protoplasmic tubes. Fluid transport through each tube is governed by Hagen-Poiseuille fluid physics, coupled to Tero and Nakagaki's dynamic adaptation law:

$$\\color{#38bdf8}{Q_{ij}} = \\frac{\\color{#c084fc}{\\pi} \\color{#34d399}{r_{ij}^4}}{\\color{#c084fc}{8} \\color{#94a3b8}{\\eta} \\color{#c084fc}{L_{ij}}} (\\color{#fbbf24}{P_i} - \\color{#f43f5e}{P_j}), \\qquad \\color{#38bdf8}{\\frac{d r_{ij}}{dt}} = \\color{#34d399}{\\gamma} \\color{#fbbf24}{|Q_{ij}|^\\mu} - \\color{#f43f5e}{\\alpha} \\color{#38bdf8}{r_{ij}}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Hagen-Poiseuille Vascular Remodeling
> - **$\\color{#38bdf8}{Q_{ij}}$ (Cytoplasmic Volumetric Flux):** Rate of fluid and nutrient tokens flowing through the conduit connecting nodes $i$ and $j$.
> - **$\\color{#34d399}{r_{ij}}$ (Conduit Internal Radius):** Cross-sectional diameter of the protoplasmic tube or gap-junction pin channel.
> - **$\\color{#94a3b8}{\\eta}$ (Protoplasmic Viscosity):** Effective dynamic viscosity of the intracellular fluid medium.
> - **$\\color{#c084fc}{L_{ij}}$ (Conduit Physical Length):** Metric distance separating interconnected hexagonal rock pores.
> - **$\\color{#fbbf24}{P_i} - \\color{#f43f5e}{P_j}$ (Hydrostatic / Chemiosmotic Pressure Gradient):** Pressure or charge differential driving fluid transport.
> - **$\\color{#34d399}{\\gamma} \\color{#fbbf24}{|Q_{ij}|^\\mu}$ (Flow-Induced Dilation):** Shear stress feedback widening conduits experiencing high traffic.
> - **$\\color{#f43f5e}{\\alpha} \\color{#38bdf8}{r_{ij}}$ (Spontaneous Elastic Decay):** Basal resorption and mineral clogging that prunes stagnant loops.
> - **Biophysical Consequence:** The physical interplay of shear-induced dilation and elastic decay automatically converges on the Steiner minimal tree.`;

content = content.replace(oldHP, () => newHP);

// 12. Lyapunov growth rate in Section 3.5
const oldLyap = `$$\\ln \\lambda_{\\text{geom}} = \\lim_{T \\to \\infty} \\frac{1}{T} \\sum_{t=1}^T \\ln W(t)$$`;
const newLyap = `$$\\color{#38bdf8}{\\ln \\lambda_{\\text{geom}}} = \\lim_{\\color{#c084fc}{T} \\to \\infty} \\frac{\\color{#c084fc}{1}}{\\color{#c084fc}{T}} \\sum_{\\color{#fbbf24}{t}=1}^{\\color{#c084fc}{T}} \\ln \\color{#34d399}{W(t)}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Kussell-Leibler Lyapunov Growth Rate
> - **$\\color{#38bdf8}{\\ln \\lambda_{\\text{geom}}}$ (Long-Term Geometric Mean Fitness):** The true time-averaged growth exponent of a biological lineage across stochastic geological epochs.
> - **$\\color{#c084fc}{T}$ (Total Time Horizon):** Total elapsed generational epochs evaluated in the limit toward infinity.
> - **$\\color{#fbbf24}{t}$ (Epoch Time Index):** Discrete environmental interval alternating between feast and famine.
> - **$\\color{#34d399}{W(t)}$ (Epoch Multiplicative Fitness):** The net reproductive survival multiplier achieved in epoch $t$.
> - **Biophysical Consequence:** If fitness drops to zero in even one epoch ($W(t) = 0$), the geometric mean crashes to $-\\infty$ (extinction). Phenotypic dormancy guarantees $W(t) > 0$ always.`;

content = content.replace(oldLyap, () => newLyap);

// 13. Quorum sensing in Section 3.6
const oldQS = `$$c_{\\text{auto}} = \\frac{N \\cdot k_{\\text{synth}}}{V_{\\text{pore}} \\cdot \\gamma_{\\text{decay}}}$$`;
const newQS = `$$\\color{#38bdf8}{c_{\\text{auto}}} = \\frac{\\color{#fbbf24}{N} \\cdot \\color{#34d399}{k_{\\text{synth}}}}{\\color{#c084fc}{V_{\\text{pore}}} \\cdot \\color{#f43f5e}{\\gamma_{\\text{decay}}}}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Quorum Autoinducer Micro-Cavity Accumulation
> - **$\\color{#38bdf8}{c_{\\text{auto}}}$ (Steady-State Autoinducer Concentration):** Local signal density accumulating inside the porous basalt compartment.
> - **$\\color{#fbbf24}{N}$ (Clonal Population Count):** Number of living cells co-inhabiting the rock pore.
> - **$\\color{#34d399}{k_{\\text{synth}}}$ (Basal Secretion Rate):** Rate of autoinducer molecule production per cell.
> - **$\\color{#c084fc}{V_{\\text{pore}}}$ (Pore Fluid Volume):** Internal volume of the hexagonal rock micro-cavity.
> - **$\\color{#f43f5e}{\\gamma_{\\text{decay}}}$ (Diffusion & Washout Rate):** Rate at which signal molecules escape through pore boundary channels.
> - **Biophysical Consequence:** In small rock pores ($V_{\\text{pore}} \\to 0$), autoinducer accumulates even with small populations, acting as an inorganic confinement sensor.`;

content = content.replace(oldQS, () => newQS);

// 14. AOM in Section 3.6 (make inline)
content = content.replace(
  '$$\\text{CH}_4 + \\text{SO}_4^{2-} \\longrightarrow \\text{HCO}_3^- + \\text{HS}^- + \\text{H}_2\\text{O} \\quad (\\Delta G^\\circ\' = -16.6\\text{ kJ/mol})$$',
  () => '$\\text{CH}_4 + \\text{SO}_4^{2-} \\longrightarrow \\text{HCO}_3^- + \\text{HS}^- + \\text{H}_2\\text{O} \\; (\\Delta G^\\circ\' = -16.6\\text{ kJ/mol})$'
);

// 15. C-FFL delay in Section 4.1
const oldCFFL = `$$\\tau_{\\text{ON}} = \\frac{1}{\\alpha_y} \\ln \\left( \\frac{\\beta_y}{\\beta_y - \\alpha_y K_{yz}} \\right)$$`;
const newCFFL = `$$\\color{#38bdf8}{\\tau_{\\text{ON}}} = \\frac{\\color{#c084fc}{1}}{\\color{#f43f5e}{\\alpha_y}} \\ln \\left( \\frac{\\color{#34d399}{\\beta_y}}{\\color{#34d399}{\\beta_y} - \\color{#f43f5e}{\\alpha_y} \\color{#fbbf24}{K_{yz}}} \\right)$$

> [!DECODER]
> ### 🔍 Equation Decoder: Coherent Feed-Forward Activation Delay
> - **$\\color{#38bdf8}{\\tau_{\\text{ON}}}$ (Persistence Delay Window):** The minimum time input signal $X$ must remain continuously present before target $Z$ turns on.
> - **$\\color{#f43f5e}{\\alpha_y}$ (Intermediate Degradation Rate):** Decay/dilution constant governing the accumulation timescale of intermediate regulator $Y$.
> - **$\\color{#34d399}{\\beta_y}$ (Intermediate Maximal Expression):** Maximum transcription rate of regulator $Y$.
> - **$\\color{#fbbf24}{K_{yz}}$ (Activation Threshold):** Binding threshold required for $Y$ to activate target $Z$.
> - **Biophysical Consequence:** Rejects high-frequency transient thermal glitches; the cell commits metabolic tokens only when hydrothermal signals are sustained.`;

content = content.replace(oldCFFL, () => newCFFL);

// 16. I-FFL in Section 4.1
const oldIFFL = `The dynamical rate equations are:
    $$\\frac{dy}{dt} = \\beta_y \\theta(x > K_{xy}) - \\alpha_y y$$
    $$\\frac{dz}{dt} = \\beta_z \\theta(x > K_{xz}) \\theta(y < K_{yz}) - \\alpha_z z$$`;

const newIFFL = `The dynamical rate equations are:

$$\\color{#f43f5e}{\\frac{dy}{dt}} = \\color{#34d399}{\\beta_y} \\theta(\\color{#fbbf24}{x} > \\color{#c084fc}{K_{xy}}) - \\color{#94a3b8}{\\alpha_y} \\color{#f43f5e}{y}, \\qquad \\color{#38bdf8}{\\frac{dz}{dt}} = \\color{#34d399}{\\beta_z} \\theta(\\color{#fbbf24}{x} > \\color{#c084fc}{K_{xz}}) \\theta(\\color{#f43f5e}{y} < \\color{#c084fc}{K_{yz}}) - \\color{#94a3b8}{\\alpha_z} \\color{#38bdf8}{z}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Incoherent Feed-Forward Dynamic Rate Laws
> - **$\\color{#f43f5e}{\\frac{dy}{dt}}, \\color{#38bdf8}{\\frac{dz}{dt}}$ (Repressor & Target Rate of Change):** Temporal derivative of repressor $y$ and target enzyme $z$.
> - **$\\color{#34d399}{\\beta_y}, \\color{#34d399}{\\beta_z}$ (Maximal Production Rates):** Peak transcription velocities under fully induced promoter states.
> - **$\\color{#fbbf24}{x}$ (Master Regulator State):** Upstream sensory input signal concentration.
> - **$\\color{#c084fc}{K_{xy}}, \\color{#c084fc}{K_{xz}}, \\color{#c084fc}{K_{yz}}$ (Activation / Repression Thresholds):** Step thresholds governing Heaviside step functions $\\theta$.
> - **$\\color{#94a3b8}{\\alpha_y}, \\color{#94a3b8}{\\alpha_z}$ (Degradation Constants):** Linear decay rates that dictate adaptation speed.
> - **Biophysical Consequence:** Target $z$ fires a transient pulse upon a step increase in $x$, but shuts down once $y$ accumulates past $K_{yz}$.`;

content = content.replace(oldIFFL, () => newIFFL);

// 17. Toggle switch in Section 4.1
const oldToggle = `Modeled by the Gardner, Cantor, & Collins (2000) dimensionless dynamical equations:
    $$\\frac{du}{dt} = \\frac{\\alpha_1}{1 + v^\\beta} - u$$
    $$\\frac{dv}{dt} = \\frac{\\alpha_2}{1 + u^\\gamma} - v$$`;

const newToggle = `Modeled by the Gardner, Cantor, & Collins (2000) dimensionless dynamical equations:

$$\\color{#38bdf8}{\\frac{du}{dt}} = \\color{#34d399}{\\frac{\\alpha_1}{1 + v^\\beta}} - \\color{#94a3b8}{u}, \\qquad \\color{#f43f5e}{\\frac{dv}{dt}} = \\color{#fbbf24}{\\frac{\\alpha_2}{1 + u^\\gamma}} - \\color{#94a3b8}{v}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Gardner-Collins Bistable Toggle Dynamics
> - **$\\color{#38bdf8}{\\frac{du}{dt}}, \\color{#f43f5e}{\\frac{dv}{dt}}$ (Complementary Rate of Change):** Derivative of repressor $u$ (stored bit $Q$) and repressor $v$ (inverted bit $\\bar{Q}$).
> - **$\\color{#34d399}{\\alpha_1}, \\color{#fbbf24}{\\alpha_2}$ (Maximal Synthesis Rates):** Intrinsic promoter transcription strengths.
> - **$\\color{#c084fc}{\\beta}, \\color{#c084fc}{\\gamma}$ (Hill Cooperativity Exponents):** Cooperative multimer binding steepness ($\\beta \\cdot \\gamma > 1$ required for bistability).
> - **$\\color{#94a3b8}{u}, \\color{#94a3b8}{v}$ (Degradation Terms):** Linear protein decay or pore charge leakage.
> - **Biophysical Consequence:** The circuit possesses two stable attractor states, providing 1-bit non-volatile memory across famine gaps.`;

content = content.replace(oldToggle, () => newToggle);

// 18. NAR in Section 4.1
const oldNAR = `In an unregulated gene with promoter strength $\\beta$ and degradation rate $\\alpha$, the steady state is $x_{\\text{st}} = \\beta / \\alpha$, and the rise time to half-maximal expression is:
    $$t_{1/2}^{\\text{unreg}} = \\frac{\\ln 2}{\\alpha}$$
  - In a negatively autoregulated gene, the promoter is engineered to be much stronger ($\\beta' \\gg \\beta$), but is repressed once $x$ reaches $K$. The initial rate of production is massive ($\\beta'$), but shuts off abruptly at steady state. The rise time is accelerated by a factor of 3 to 5:
    $$t_{1/2}^{\\text{NAR}} \\approx \\frac{\\ln 2}{\\alpha} \\cdot \\frac{K}{\\beta' / \\alpha}$$`;

const newNAR = `In an unregulated gene with promoter strength $\\beta$ and degradation rate $\\alpha$, the steady state is $x_{\\text{st}} = \\beta / \\alpha$, and the rise time to half-maximal expression is $t_{1/2}^{\\text{unreg}} = \\frac{\\ln 2}{\\alpha}$. In a negatively autoregulated gene, the promoter is engineered to be much stronger ($\\beta' \\gg \\beta$), but is repressed once $x$ reaches $K$. The initial rate of production is massive ($\\beta'$), but shuts off abruptly at steady state. The rise time is accelerated by a factor of 3 to 5:

$$\\color{#38bdf8}{t_{1/2}^{\\text{NAR}}} \\approx \\color{#fbbf24}{t_{1/2}^{\\text{unreg}}} \\cdot \\frac{\\color{#c084fc}{K}}{\\color{#34d399}{\\beta'} / \\color{#f43f5e}{\\alpha}} = \\frac{\\ln \\color{#c084fc}{2}}{\\color{#f43f5e}{\\alpha}} \\cdot \\frac{\\color{#c084fc}{K}}{\\color{#34d399}{\\beta'} / \\color{#f43f5e}{\\alpha}}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Negative Autoregulation Rise-Time Acceleration
> - **$\\color{#38bdf8}{t_{1/2}^{\\text{NAR}}}$ (Accelerated Response Half-Time):** Time required for a self-repressing gene to reach half of its steady-state concentration.
> - **$\\color{#fbbf24}{t_{1/2}^{\\text{unreg}}}$ (Unregulated Baseline Rise Time):** Slow baseline half-time determined solely by degradation rate $\\alpha$ ($\\ln 2 / \\alpha$).
> - **$\\color{#c084fc}{K}$ (Repression Binding Threshold):** Promoter operator affinity where autorepression engages.
> - **$\\color{#34d399}{\\beta'}$ (Strong Boosted Promoter Velocity):** Over-engineered maximal promoter strength ($\\beta' \\gg \\beta$).
> - **$\\color{#f43f5e}{\\alpha}$ (Protein Degradation Constant):** Cellular dilution or turnover rate.
> - **Biophysical Consequence:** Accelerates response times by up to 500%, allowing cells to respond rapidly to environmental shocks without overshooting.`;

content = content.replace(oldNAR, () => newNAR);

// 19. TCS in Section 4.1 (make inline)
content = content.replace(
  '$$\\text{HK} + \\text{ATP} \\xrightarrow{\\text{Stimulus}} \\text{HK}\\sim\\text{P} + \\text{ADP}$$',
  () => '$\\text{HK} + \\text{ATP} \\xrightarrow{\\text{Stimulus}} \\text{HK}\\sim\\text{P} + \\text{ADP}$'
);
content = content.replace(
  '$$\\text{HK}\\sim\\text{P} + \\text{RR} \\longrightarrow \\text{HK} + \\text{RR}\\sim\\text{P}$$',
  () => '$\\text{HK}\\sim\\text{P} + \\text{RR} \\longrightarrow \\text{HK} + \\text{RR}\\sim\\text{P}$'
);

// 20. Ring oscillator frequency in Section 4.2
const oldRO = `$$f_{\\text{osc}} = \\frac{1}{2 \\cdot N \\cdot t_{\\text{delay}}}$$`;
const newRO = `$$\\color{#38bdf8}{f_{\\text{osc}}} = \\frac{\\color{#c084fc}{1}}{\\color{#c084fc}{2} \\cdot \\color{#34d399}{N} \\cdot \\color{#f43f5e}{t_{\\text{delay}}}}$$

> [!DECODER]
> ### 🔍 Equation Decoder: Odd-Inverter Ring Oscillator Frequency
> - **$\\color{#38bdf8}{f_{\\text{osc}}}$ (Oscillation Frequency):** Fundamental limit-cycle switching frequency of the intracellular ring pacemaker (Hertz).
> - **$\\color{#c084fc}{N}$ (Odd Number of Inverting Gates):** The number of stages in the ring ($N = 3, 5, 7$).
> - **$\\color{#f43f5e}{t_{\\text{delay}}}$ (Single-Gate Propagation Delay):** Physical propagation latency per gate stage (ticks).
> - **$\\color{#c084fc}{2}$ (Half-Cycle Inversion Constant):** Reflects the round-trip requirement for two full signal inversions per cycle.
> - **Biophysical Consequence:** Generates autonomous metabolic rhythms without external driving, timing porin opening with zero phase lag.`;

content = content.replace(oldRO, () => newRO);

// 21. Add Worked Concrete Toy Pre-Trace and Skeptic FAQ before Section 5
const preTraceAndFAQ = `
### 4.3 Worked Concrete Toy Pre-Trace: 5 Ticks in an Evolved Proto-Cognitive Pore

To observe how proto-cognitive network motifs function in discrete physical time, follow this step-by-step trace of a single rock pore equipped with an anticipatory feed-forward regulator across 5 ticks:

| Tick | Environmental Hydrothermal State | Intracellular Gate States | Landauer Burn ($\\Delta E$) | Vent Redox Harvest | Net Battery ($E$) | Physical Biological Consequence |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | Baseline quiet flow ($S=0, T=0$). | Quiescent ground state; gates idle. | $0\\text{ T}$ | $+0\\text{ T}$ | **$50\\text{ T}$** | The inert recipe rests in the genomic safe; zero Landauer dissipation. |
| **1** | Precursor warning pulse arrives ($A=1$). | Sensory gate fires; primes protective latch. | $-1\\text{ T}$ | $+0\\text{ T}$ | **$49\\text{ T}$** | Early acoustic wavefront detected; circuit prepares pre-emptive porin clamp. |
| **2** | Warning interval ($A=0, T=0$). | Latch flips; porin intake snaps shut. | $-1\\text{ T}$ | $+0\\text{ T}$ | **$48\\text{ T}$** | Pre-emptive defense deployed *before* toxic heavy metal surge touches pore. |
| **3** | Boiling toxic surge hits ($T=1$). | Porins sealed; allosteric barrier active. | $0\\text{ T}$ | $+0\\text{ T}$ | **$48\\text{ T}$** | **Toxin Repelled!** Cell incurs $0\\text{ T}$ corrosion loss. (Unshielded cells lose $20\\text{T}$). |
| **4** | Clean hydrothermal pulse arrives ($A=1, B=1$). | Toxic flag clears; catalytic gates fire! | $-2\\text{ T}$ | $+12\\text{ T}$ | **$58\\text{ T}$** | Co-catalytic redox combustion captures $+12\\text{T}$; battery pantry charges toward division. |

---

### 4.4 Conceptual Misconception Immunity (Skeptic FAQ)

- **Q: Does calling bacterial circuits "proto-cognition" or "minimal intelligence" smuggle intentionality or anthropomorphism into microbiology?**  
  *Dynamical Systems Answer:* No. In contemporary cognitive science and biophysics (Maturana & Varela 1980; Godfrey-Smith 2016; Lyon 2015), cognition is defined operationally: **the capacity of an autonomous physical system to sense, process information about its environment, and adjust its internal states to maintain autopoietic persistence**. An organism that differentiates a gradient over time, anticipates a future toxin from a precursor cue, or optimizes transport geometry across a rock pore is executing cognitive computation in the strict algorithmic sense, completely free of conscious intent or teleology.
- **Q: How does this treatise honor the Four Sacred Analogies of Siliquarium?**  
  *Biophysical Epistemic Answer:*
  1. **The Safe and the Workshop (The Epistemic Cut):** The genome is an inert tape in the safe; dynamic logic operates exclusively in the workshop.
  2. **The Hydrothermal Vent (The Digital Drumbeat):** Supplies non-equilibrium periodic enthalpy rather than passive food points.
  3. **The Rock Pores (Nature's First Walls):** Basalt micro-cavities solve the dilution catastrophe, confining metabolic catalysts.
  4. **The Battery Pantry (Local Pantry):** Discrete token accounting enforces Landauer switching costs and prevents thermodynamic free lunches.
- **Q: Why are network motifs so universally conserved across disparate evolutionary lineages?**  
  *Convergent Evolution Answer:* Just as the wheel or the lever represents an optimal mechanical solution to physical friction, motifs like the Feed-Forward Loop, the Toggle Switch, and the Ring Oscillator are mathematically unique solutions to fundamental dynamical challenges (noise filtering, memory storage, timekeeping). They evolve repeatedly through convergent homoplasy because physics permits no more parsimonious alternatives.

---
`;

content = content.replace('## 5. Master Evolutionary Taxonomies', () => preTraceAndFAQ + '\n## 5. Master Evolutionary Taxonomies');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully patched DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.md with function replacements!');
