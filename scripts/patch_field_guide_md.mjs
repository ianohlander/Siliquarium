import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetFile = path.join(rootDir, 'docs', 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');

let content = fs.readFileSync(targetFile, 'utf8');

// Section 4: Bistable Latch (Figure 4.1)
content = content.replace(
  /## 4\. Bistable Memory Latch \(SR Flip-Flop\)[\s\S]*?> \[!ANALYSIS\][\s\S]*?> - \*\*💡 Core Conceptual Principle:\*\*[^\n]*\n/m,
  `## 4. Bistable Memory Latch (SR Flip-Flop)

![Figure 4.1: Bistable Memory Latch (SR Flip-Flop)](assets/diagrams/fig_circuit_1_bistable_latch.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 4.1 — Bistable Memory Latch (SR Flip-Flop)
> - **🔍 Visual Guide & Structural Mechanics:** The left panel illustrates the Bistable SR Latch: two cross-coupled \`NOR\` gates with feedback wires returning each output to the opposite gate's input. The embedded truth table shows how input pulses on Set ($S$) or Reset ($R$) switch state $Q$, while $S=0, R=0$ locks the state in permanent memory with zero Landauer burn. The right panel depicts the double-well potential energy landscape $V(x)$ showing two stable attractor basins separated by an unstable separatrix barrier $\\Delta E$, alongside a 5-tick timing trace.
> - **🔬 Biophysical & Mathematical Reality:** Models the landmark synthetic toggle switch constructed in *E. coli* by Tim Gardner, Charles Cantor, and Jim Collins (2000), mirroring the natural lysis-vs-lysogeny decision in Bacteriophage $\\lambda$. Nonlinear cooperativity ($n > 1$) creates a bistable potential energy well where stored states survive long after stimulus disappearance.
> - **💻 Digital Mapping in Siliquarium:** Scanned dynamically by [\`MotifScanner.detectBistableLatch()\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L72-L85). When a pore workshop netlist possesses cross-coupled inverting gates that maintain output state across $\\ge 3$ consecutive zero-input ticks, the Paleontologist logs milestone \`BISTABLE_LATCH\`.
> - **💡 Core Conceptual Principle:** *Memory is trapped energy circulating in a loop.* Biological memory did not evolve for intellectual reflection; it evolved as a digestive preservation strategy to bridge asynchronous nutrient arrivals.
`
);

// Section 6: Coherent Feed-Forward Loop (Figure 6.1)
content = content.replace(
  /## 6\. Coherent Feed-Forward Loop \(C-FFL Type 1\)[\s\S]*?> \[!ANALYSIS\][\s\S]*?> - \*\*💡 Core Conceptual Principle:\*\*[^\n]*\n/m,
  `## 6. Coherent Feed-Forward Loop (C-FFL Type 1)

![Figure 6.1: Coherent Feed-Forward Loop Type 1 (C-FFL)](assets/diagrams/fig_circuit_3_coherent_ffl.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 6.1 — Coherent Feed-Forward Loop Type 1 (C-FFL)
> - **🔍 Visual Guide & Structural Mechanics:** The left panel diagrams the Coherent FFL (Type 1): master regulator $X$ directly drives target $Z$ (fast arm) and intermediate buffer $Y$ (slow arm), both of which converge on an \`AND\` junction. The right panel illustrates sign-sensitive persistence filtering: a 1-tick false noise spike is rejected ($Z=0$), while a sustained pulse activates $Z$ after delay $\\tau_{\\text{on}}$, followed by immediate shutdown when $X$ ceases ($\\tau_{\\text{off}} = 0$).
> - **🔬 Biophysical & Mathematical Reality:** Discovered by Shai Mangan and Uri Alon (2003) in the *E. coli* arabinose operon. The C-FFL acts as a sign-sensitive delay filter, protecting cells from burning metabolic calories on fleeting environmental fluctuations.
> - **💻 Digital Mapping in Siliquarium:** Audited by [\`MotifScanner.detectCoherentFFL()\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L87-L98) when a workshop contains an \`AND\` gate fed by both a direct sensor input and a secondary buffer/OR pathway.
> - **💡 Core Conceptual Principle:** *Never act on a rumor.* True biological signals persist; random thermal noise vanishes quickly.
`
);

// Section 8: Negative Autoregulation (Figure 8.1)
content = content.replace(
  /## 8\. Negative Autoregulation Clamp \(NAR\)[\s\S]*?> \[!ANALYSIS\][\s\S]*?> - \*\*💡 Core Conceptual Principle:\*\*[^\n]*\n/m,
  `## 8. Negative Autoregulation Clamp (NAR)

![Figure 8.1: Negative Autoregulation Clamp (NAR)](assets/diagrams/fig_circuit_5_negative_autoregulation.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 8.1 — Negative Autoregulation Clamp (NAR)
> - **🔍 Visual Guide & Structural Mechanics:** The left panel illustrates Negative Autoregulation (NAR): a single gate whose output wire loops back to inhibit its own input with repression threshold $K$. The right panel reveals how NAR accelerates the rise time to steady state by 5-fold ($t_{1/2}^{\\text{NAR}} \\ll t_{1/2}^{\\text{unreg}}$) while clamping the plateau and compressing expression noise variance ($\\sigma^2 / [1+G]$).
> - **🔬 Biophysical & Mathematical Reality:** Discovered by Nir Rosenfeld, Michael Elowitz, and Uri Alon (2002) in *E. coli* transcription networks. NAR occurs in over 40% of all bacterial transcription factors to guarantee rapid protective response.
> - **💻 Digital Mapping in Siliquarium:** Scanned by [\`MotifScanner.detectAutoregulation()\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts#L113-L122) when a single inverting gate provides self-limiting negative feedback, triggering milestone \`NEGATIVE_AUTOREGULATION\`.
> - **💡 Core Conceptual Principle:** *Step on the gas, then let off the pedal.* Start synthesis at full throttle, and let self-inhibition do the braking.
`
);

// Section 10: Allosteric NOT Inverter (Figure 10.1)
content = content.replace(
  /## 10\. Allosteric NOT Inverter[\s\S]*?> \[!ANALYSIS\][\s\S]*?> - \*\*💡 Core Conceptual Principle:\*\*[^\n]*\n/m,
  `## 10. Allosteric NOT Inverter

![Figure 10.1: Allosteric NOT Inverter](assets/diagrams/fig_circuit_7_allosteric_inverter.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 10.1 — Allosteric NOT Inverter
> - **🔍 Visual Guide & Structural Mechanics:** The left panel diagrams the Allosteric NOT Inverter: a high-gain logic inverter converting a toxic effluent sensor signal into an immediate porin shutoff command ($0 \\to 1$ Open; $1 \\to 0$ Closed). The right panel diagrams the sigmoidal Hill repression transfer curve and Landauer dissipation profile (1 token per flip, 0 tokens static hold).
> - **🔬 Biophysical & Mathematical Reality:** Models the François Jacob & Jacques Monod (1961) *lac* operon repressor mechanism. Ultrasensitive cooperativity ($n \\ge 2$) provides razor-sharp thresholding against lethal heavy-metal plumes.
> - **💻 Digital Mapping in Siliquarium:** Scanned via \`INVERTER_NOT\` in [\`DigitalPaleontologist.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/DigitalPaleontologist.ts#L75-L95) and [\`MotifScanner.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/core/paleontology/MotifScanner.ts).
> - **💡 Core Conceptual Principle:** *Saying NO is as vital as saying YES.* Life survives not only by harvesting energy, but by shielding itself from lethal environmental entropy.
`
);

// Section 12: Syncytial Multicellularity (Figure 12.1)
content = content.replace(
  /## 12\. Syncytial Multicellularity[\s\S]*?> \[!ANALYSIS\][\s\S]*?> - \*\*💡 Core Conceptual Principle:\*\*[^\n]*\n/m,
  `## 12. Syncytial Multicellularity

![Figure 12.1: Syncytial Multicellularity](assets/diagrams/fig_circuit_9_syncytial_multicellularity.svg)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 12.1 — Syncytial Multicellularity
> - **🔍 Visual Guide & Structural Mechanics:** The left panel diagrams Syncytial Multicellularity: three adjacent hexagonal basalt pores ($A, B, C$) with fused membranes and glowing cytoplasmic streaming bridges. Battery charges ($90\\text{T}, 20\\text{T}, 40\\text{T}$) are pooled into an equalized $50\\text{T}$ average via integer Euclidean division, strictly preserving closed-universe mass ($\\Delta M = 0.000$). The right panel illustrates Fickian diffusion dynamics ($J = -D \\nabla \\Phi$) and collective famine survival (180+ ticks vs. 35 ticks isolated).
> - **🔬 Biophysical & Mathematical Reality:** Models acellular slime molds (*Physarum polycephalum*) and deep-sea hexactinellid glass sponges (Bonner 1965, Margulis 1981), where shared cytoplasm allows division of labor and mutual buffering.
> - **💻 Digital Mapping in Siliquarium:** Audited from \`telemetry.syncytialColonies\` in [\`DigitalPaleontologist.ts\`](file:///h:/My%20Drive/Repos/Siliquarium/src/engine/paleontology/DigitalPaleontologist.ts#L98-L125), triggering milestone \`SYNCYTIAL_MULTICELLULARITY\`.
> - **💡 Core Conceptual Principle:** *Cooperation overcomes localized famine.* Pooling reserves protects the whole collective from patchy resource distributions.
`
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully completed full update of docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md!');
