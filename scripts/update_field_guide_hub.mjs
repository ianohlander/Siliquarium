import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const guidePath = path.join(rootDir, 'docs', 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');
const content = fs.readFileSync(guidePath, 'utf8');

// Part 1: Lines up to ## 4. Bistable Memory Latch
const cut1 = content.indexOf('## 4. Bistable Memory Latch (SR Flip-Flop)');
let prefix = content.slice(0, cut1).trim();

// Update Master Taxonomy Table links in prefix
prefix = prefix.replace(/\[Bistable Memory Latch \(SR Flip-Flop\)\]\(#4-bistable-memory-latch-sr-flip-flop\)/g, '[Bistable Memory Latch (SR Flip-Flop)](paleontology/specimen_01_bistable_latch.html)');
prefix = prefix.replace(/\[Odd-Inverter Ring Oscillator \(Repressilator\)\]\(#5-odd-inverter-ring-oscillator-the-repressilator\)/g, '[Odd-Inverter Ring Oscillator (Repressilator)](paleontology/specimen_02_repressilator.html)');
prefix = prefix.replace(/\[Coherent Feed-Forward Loop \(C-FFL Type 1\)\]\(#6-coherent-feed-forward-loop-c-ffl-type-1\)/g, '[Coherent Feed-Forward Loop (C-FFL Type 1)](paleontology/specimen_03_coherent_ffl.html)');
prefix = prefix.replace(/\[Incoherent Feed-Forward Loop \(I-FFL Type 1\)\]\(#7-incoherent-feed-forward-loop-i-ffl-type-1\)/g, '[Incoherent Feed-Forward Loop (I-FFL Type 1)](paleontology/specimen_04_incoherent_ffl.html)');
prefix = prefix.replace(/\[Negative Autoregulation Clamp \(NAR\)\]\(#8-negative-autoregulation-clamp-nar\)/g, '[Negative Autoregulation Clamp (NAR)](paleontology/specimen_05_negative_autoregulation.html)');
prefix = prefix.replace(/\[1-Bit Binary Half-Adder\]\(#9-1-bit-binary-half-adder\)/g, '[1-Bit Binary Half-Adder](paleontology/specimen_06_binary_half_adder.html)');
prefix = prefix.replace(/\[Allosteric NOT Inverter\]\(#10-allosteric-not-inverter\)/g, '[Allosteric NOT Inverter](paleontology/specimen_07_allosteric_inverter.html)');
prefix = prefix.replace(/\[Endosymbiotic Organelle Cassette\]\(#11-endosymbiotic-organelle-cassette\)/g, '[Endosymbiotic Organelle Cassette](paleontology/specimen_08_endosymbiotic_cassette.html)');
prefix = prefix.replace(/\[Syncytial Multicellularity\]\(#12-syncytial-multicellularity\)/g, '[Syncytial Multicellularity](paleontology/specimen_09_syncytial_multicellularity.html)');
prefix = prefix.replace(/\[Pelagic Sporulation Engine\]\(#13-pelagic-sporulation--dispersal-engine\)/g, '[Pelagic Sporulation Engine](paleontology/specimen_10_pelagic_sporulation.html)');

// Part 2: Lines from ## 14. Weisfeiler-Lehman onwards
const cut2 = content.indexOf('## 14. Weisfeiler-Lehman (WL) Graph Isomorphism Hashing');
let suffix = content.slice(cut2).trim();

// Renumber remaining sections in suffix
suffix = suffix.replace('## 14. Weisfeiler-Lehman (WL) Graph Isomorphism Hashing', '## 5. Weisfeiler-Lehman (WL) Graph Isomorphism Hashing');
suffix = suffix.replace('### 14.1 The Permutation Trap', '### 5.1 The Permutation Trap');
suffix = suffix.replace('## 15. Paleontological Flight Recorder & Forensic Autopsies', '## 6. Paleontological Flight Recorder & Forensic Autopsies');
suffix = suffix.replace('## 16. Wikipedia-Style Endnotes & Empirical Justifications', '## 7. Wikipedia-Style Endnotes & Empirical Justifications');
suffix = suffix.replace('## 17. Master Concordance Table of Notes, Formulas & Source Files', '## 8. Master Concordance Table of Notes, Formulas & Source Files');
suffix = suffix.replace('## 18. Annotated Primary Literature Master Bibliography', '## 9. Annotated Primary Literature Master Bibliography');

// Specimen Catalog Grid
const specimenCards = `
---

## 4. Specimen Catalog & Dedicated Field Dossiers

To avoid infinite scrolling, each of the 10 evolutionary circuits and adaptations recognized by the Digital Paleontologist is detailed in its own exhaustive field dossier, containing full mathematical rate equations, differential rate decoders, 5-tick worked pre-traces, SVG schematics, and biophysical justifications.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

  <!-- Specimen 1 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #1</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 85%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🔒</span> Bistable Memory Latch (SR Flip-Flop)
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Memoriacoccus biformis ("Deep-Sea Toggle Switch")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        1-bit cellular memory circuit. Uses cross-coupled inverting gates to trap voltage pulses from morning electron donors, enabling digestion of asynchronous afternoon oxidizer streams.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Phage λ Toggle Switch / Gardner et al. (2000)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_01_bistable_latch.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 2 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #2</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 90%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🔄</span> Odd-Inverter Ring Oscillator (Repressilator)
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Oscillovibrio temporis ("Prebiotic Chronometer")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Autonomous biological clock. An odd number of cyclic inverters creates frustration with no static steady-state attractor, generating periodic clock pulses without external environmental drive.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> The Repressilator (Elowitz &amp; Leibler 2000)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_02_repressilator.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 3 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #3</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 80%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>⏳</span> Coherent Feed-Forward Loop (C-FFL Type 1)
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Filtrator persistens ("Persistence Filter Silicoid")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Sign-sensitive delay and persistence filter. Rejects spurious 1-tick thermal noise spikes while responding swiftly to sustained food pulses, saving precious Landauer battery tokens.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> E. coli Arabinose Operon (Mangan &amp; Alon 2003)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_03_coherent_ffl.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 4 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #4</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 80%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>⚡</span> Incoherent Feed-Forward Loop (I-FFL Type 1)
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Adaptivus biphasicus ("Fold-Change Detector")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Biphasic pulse generator &amp; fold-change adaptation. Converts step-function nutrient inputs into transient activation pulses, allowing cells to sense relative fold changes across 4 orders of magnitude.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Bacterial Chemotaxis Receptor Adaptation (Barkai &amp; Leibler 1997)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_04_incoherent_ffl.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 5 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #5</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 85%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🎚️</span> Negative Autoregulation Clamp (NAR)
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Homeostaticus celer ("Response Accelerator")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Response accelerator &amp; homeostatic buffer. A transcription factor repressing its own gene allows 5× faster rise times to steady state while drastically clamping cell-to-cell protein noise.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Ribosomal Protein Operons / LexA SOS Regulon
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_05_negative_autoregulation.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 6 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #6</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 95%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🧮</span> 1-Bit Binary Half-Adder
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Computococcus arithmeticus ("Arithmetic Co-Catalyst")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        True digital arithmetic on the seafloor. Computes simultaneous Sum (XOR parity) and Overflow Carry (AND co-catalysis) across two independent vent chemical channels.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Multi-Channel Signal Parity Integration
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_06_binary_half_adder.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 7 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #7</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 90%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🛡️</span> Allosteric NOT Inverter
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Invertobacter allostericus ("Toxin Shield Inverter")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Logic inversion &amp; heavy-metal protection. Inverts toxic plume signals to trigger emergency porin shutdown, shielding the cell from lethal volcanic poisoning.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> lac Operon LacI Repressor (Jacob &amp; Monod 1961)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_07_allosteric_inverter.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 8 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #8</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 100%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🔋</span> Endosymbiotic Organelle Cassette
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Symbiococcus mitochondrialis ("Mitochondrial Pre-Eukaryote")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Prebiotic eukaryogenesis via dual operon incorporation. A host cell internalizes an auxiliary organelle genome, unlocking parallel catalytic engines and a permanent +15T battery bonus.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Serial Endosymbiosis Theory (Margulis 1970; Lane &amp; Martin 2010)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_08_endosymbiotic_cassette.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 9 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #9</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 100%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🕸️</span> Syncytial Multicellularity
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Syncytiococcus colonialis ("Macro-Organic Syncytium")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Multi-pore cytoplasmic sharing. Adjacent pores fuse their internal cytoplasmic channels into a macro-organism, equalizing battery voltage and matter to eliminate localized starvation shadows.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Slime Mold Syncytium / Glass Sponge Cytoplasmic Networks
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_09_syncytial_multicellularity.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

  <!-- Specimen 10 -->
  <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">Specimen #10</span>
        <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">Confidence: 100%</span>
      </div>
      <h3 class="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>🌊</span> Pelagic Sporulation &amp; Dispersal Engine
      </h3>
      <div class="text-xs font-mono text-cyan-400 italic">Sporococcus pelagicus ("Convective Hydro-Disperser")</div>
      <p class="text-xs text-slate-300 font-sans leading-relaxed">
        Escaping the benthic Malthusian trap. Translates FtsZ cleavage septum codons to pack matter into buoyant capsules, launching spores into upward hydrothermal convection currents.
      </p>
      <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
        <strong>Biological Model:</strong> Bacterial Endospore Cascade (Bacillus subtilis Spo0A)
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-800/80">
      <a href="paleontology/specimen_10_pelagic_sporulation.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 text-xs font-mono font-bold transition-all w-full justify-center">
        <span>🔬</span> Explore Full Specimen Dossier ➔
      </a>
    </div>
  </div>

</div>
`;

const updatedGuide = `${prefix}\n\n${specimenCards}\n\n${suffix}\n`;
fs.writeFileSync(guidePath, updatedGuide, 'utf8');
console.log('Successfully updated docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md as master hub!');
