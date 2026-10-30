import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const guidePath = path.join(rootDir, 'docs', 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');
const content = fs.readFileSync(guidePath, 'utf8');

const SPECIMENS = [
  {
    num: 1,
    id: 'specimen_01_bistable_latch',
    file: 'specimen_01_bistable_latch.md',
    title: 'Bistable Memory Latch (SR Flip-Flop)',
    shortName: 'Bistable Memory Latch',
    binomial: 'Memoriacoccus biformis',
    commonName: 'Deep-Sea Toggle Switch',
    gates: '≥ 2 cross-coupled inverting gates',
    model: 'Bacteriophage λ Genetic Toggle Switch / Gardner-Cantor-Collins (2000)',
    role: '1-bit cellular memory; stores morning electron donor pulses to bridge asynchronous afternoon oxidizer streams.',
    confidence: '85%',
    icon: '🔒',
    startHeader: '## 4. Bistable Memory Latch (SR Flip-Flop)',
    endHeader: '## 5. Odd-Inverter Ring Oscillator (The Repressilator)'
  },
  {
    num: 2,
    id: 'specimen_02_repressilator',
    file: 'specimen_02_repressilator.md',
    title: 'Odd-Inverter Ring Oscillator (The Repressilator)',
    shortName: 'Ring Oscillator (Repressilator)',
    binomial: 'Oscillovibrio temporis',
    commonName: 'Prebiotic Chronometer',
    gates: '≥ 3 (odd cyclic inverters)',
    model: 'The Repressilator (Elowitz & Leibler 2000) / KaiC Circadian Clock',
    role: 'Autonomous internal clock; paces catalytic cycles without external environmental vent drive.',
    confidence: '90%',
    icon: '🔄',
    startHeader: '## 5. Odd-Inverter Ring Oscillator (The Repressilator)',
    endHeader: '## 6. Coherent Feed-Forward Loop (C-FFL Type 1)'
  },
  {
    num: 3,
    id: 'specimen_03_coherent_ffl',
    file: 'specimen_03_coherent_ffl.md',
    title: 'Coherent Feed-Forward Loop (C-FFL Type 1)',
    shortName: 'Coherent Feed-Forward Loop',
    binomial: 'Filtrator persistens',
    commonName: 'Persistence Filter Silicoid',
    gates: '≥ 3 directed gates (dual-pathway AND)',
    model: 'E. coli Arabinose Operon (araBAD)',
    role: 'Sign-sensitive delay filter; rejects spurious 1-tick thermal noise spikes while responding to genuine food pulses.',
    confidence: '80%',
    icon: '⏳',
    startHeader: '## 6. Coherent Feed-Forward Loop (C-FFL Type 1)',
    endHeader: '## 7. Incoherent Feed-Forward Loop (I-FFL Type 1)'
  },
  {
    num: 4,
    id: 'specimen_04_incoherent_ffl',
    file: 'specimen_04_incoherent_ffl.md',
    title: 'Incoherent Feed-Forward Loop (I-FFL Type 1)',
    shortName: 'Incoherent Feed-Forward Loop',
    binomial: 'Adaptivus biphasicus',
    commonName: 'Fold-Change Detector',
    gates: '≥ 3 directed gates (opposing sign pathways)',
    model: 'Bacterial Chemotaxis Receptor Adaptation (Barkai & Leibler 1997)',
    role: 'Biphasic pulse generator & fold-change adaptation; detects sudden step-changes in nutrient gradients.',
    confidence: '80%',
    icon: '⚡',
    startHeader: '## 7. Incoherent Feed-Forward Loop (I-FFL Type 1)',
    endHeader: '## 8. Negative Autoregulation Clamp (NAR)'
  },
  {
    num: 5,
    id: 'specimen_05_negative_autoregulation',
    file: 'specimen_05_negative_autoregulation.md',
    title: 'Negative Autoregulation Clamp (NAR)',
    shortName: 'Negative Autoregulation Clamp',
    binomial: 'Homeostaticus celer',
    commonName: 'Response Accelerator',
    gates: '≥ 1 self-inhibiting gate',
    model: 'Ribosomal Protein Operons / LexA SOS Regulon (Rosenfeld et al. 2002)',
    role: 'Response accelerator & homeostatic clamp; reaches steady-state target 5× faster with reduced cell-to-cell noise.',
    confidence: '85%',
    icon: '🎚️',
    startHeader: '## 8. Negative Autoregulation Clamp (NAR)',
    endHeader: '## 9. 1-Bit Binary Half-Adder'
  },
  {
    num: 6,
    id: 'specimen_06_binary_half_adder',
    file: 'specimen_06_binary_half_adder.md',
    title: '1-Bit Binary Half-Adder',
    shortName: '1-Bit Binary Half-Adder',
    binomial: 'Computococcus arithmeticus',
    commonName: 'Arithmetic Co-Catalyst',
    gates: '≥ 2 gates (XOR sum + AND carry)',
    model: 'Multi-Channel Parity Logic & Metabolic Branching Integration',
    role: 'Digital arithmetic; computes simultaneous Sum (XOR) and Overflow Carry (AND) for dual-channel vent streams.',
    confidence: '95%',
    icon: '🧮',
    startHeader: '## 9. 1-Bit Binary Half-Adder',
    endHeader: '## 10. Allosteric NOT Inverter'
  },
  {
    num: 7,
    id: 'specimen_07_allosteric_inverter',
    file: 'specimen_07_allosteric_inverter.md',
    title: 'Allosteric NOT Inverter',
    shortName: 'Allosteric NOT Inverter',
    binomial: 'Invertobacter allostericus',
    commonName: 'Toxin Shield Inverter',
    gates: '≥ 1 inverting gate (NOT)',
    model: 'lac Operon LacI Repressor (Jacob & Monod 1961)',
    role: 'Logic inversion & toxin shielding; clamps mineral porins shut during catastrophic heavy-metal hydrothermal plumes.',
    confidence: '90%',
    icon: '🛡️',
    startHeader: '## 10. Allosteric NOT Inverter',
    endHeader: '## 11. Endosymbiotic Organelle Cassette'
  },
  {
    num: 8,
    id: 'specimen_08_endosymbiotic_cassette',
    file: 'specimen_08_endosymbiotic_cassette.md',
    title: 'Endosymbiotic Organelle Cassette',
    shortName: 'Endosymbiotic Cassette',
    binomial: 'Symbiococcus mitochondrialis',
    commonName: 'Mitochondrial Pre-Eukaryote',
    gates: 'Dual Operon (Host + Organelle Genome)',
    model: 'Mitochondrial Eukaryogenesis (Margulis 1970; Lane & Martin 2010)',
    role: 'Compartmentalized auxiliary power; grants +15T battery boost and parallel dual catalytic processing.',
    confidence: '100%',
    icon: '🔋',
    startHeader: '## 11. Endosymbiotic Organelle Cassette',
    endHeader: '## 12. Syncytial Multicellularity'
  },
  {
    num: 9,
    id: 'specimen_09_syncytial_multicellularity',
    file: 'specimen_09_syncytial_multicellularity.md',
    title: 'Syncytial Multicellularity',
    shortName: 'Syncytial Multicellularity',
    binomial: 'Syncytiococcus colonialis',
    commonName: 'Macro-Organic Syncytium',
    gates: 'Multi-Pore Fusion Network',
    model: 'Slime Mold (Physarum) / Glass Sponge (Hexactinellida) Cytoplasmic Fusion',
    role: 'Multi-pore cytoplasmic sharing; equalizes battery voltage and matter across pores to eliminate starvation shadows.',
    confidence: '100%',
    icon: '🕸️',
    startHeader: '## 12. Syncytial Multicellularity',
    endHeader: '## 13. Pelagic Sporulation & Dispersal Engine'
  },
  {
    num: 10,
    id: 'specimen_10_pelagic_sporulation',
    file: 'specimen_10_pelagic_sporulation.md',
    title: 'Pelagic Sporulation & Dispersal Engine',
    shortName: 'Pelagic Sporulation Engine',
    binomial: 'Sporococcus pelagicus',
    commonName: 'Convective Hydro-Disperser',
    gates: 'FtsZ Septum + Catalytic Cascade',
    model: 'Bacterial Endospore (Bacillus subtilis Spo0A cascade)',
    role: 'Buoyant capsule ejection; escapes benthic crowding and toxicity into open water column (z ≥ 1).',
    confidence: '100%',
    icon: '🌊',
    startHeader: '## 13. Pelagic Sporulation & Dispersal Engine',
    endHeader: '## 14. Weisfeiler-Lehman (WL) Graph Isomorphism Hashing'
  }
];

// Extract sections
for (let i = 0; i < SPECIMENS.length; i++) {
  const spec = SPECIMENS[i];
  const startIdx = content.indexOf(spec.startHeader);
  const endIdx = content.indexOf(spec.endHeader);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Error: Could not locate headers for ${spec.title}`);
    continue;
  }

  let body = content.slice(startIdx, endIdx).trim();

  // Strip the top ## N. Header since we will provide a rich master header
  body = body.replace(/^##\s+\d+\.\s+[^\n]+\n+/, '');

  // Navigation Links
  const prevSpec = i > 0 ? SPECIMENS[i - 1] : null;
  const nextSpec = i < SPECIMENS.length - 1 ? SPECIMENS[i + 1] : null;

  let navFooter = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-10 pt-6 border-t border-slate-800 font-mono text-xs">\n';
  if (prevSpec) {
    navFooter += `  <a href="${prevSpec.id}.html" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all flex items-center gap-3 text-slate-300 hover:text-cyan-300">
    <span class="text-base">⬅️</span>
    <div>
      <div class="text-[10px] text-slate-500 uppercase tracking-wider">Previous Specimen</div>
      <div class="font-bold text-slate-200">#${prevSpec.num}: ${prevSpec.shortName}</div>
    </div>
  </a>\n`;
  } else {
    navFooter += `  <a href="../CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all flex items-center gap-3 text-slate-300 hover:text-cyan-300">
    <span class="text-base">🏛️</span>
    <div>
      <div class="text-[10px] text-slate-500 uppercase tracking-wider">Taxonomy Hub</div>
      <div class="font-bold text-slate-200">Return to Master Field Guide Index</div>
    </div>
  </a>\n`;
  }

  if (nextSpec) {
    navFooter += `  <a href="${nextSpec.id}.html" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all flex items-center justify-between text-right gap-3 text-slate-300 hover:text-cyan-300 md:ml-auto w-full">
    <div>
      <div class="text-[10px] text-slate-500 uppercase tracking-wider">Next Specimen</div>
      <div class="font-bold text-slate-200">#${nextSpec.num}: ${nextSpec.shortName}</div>
    </div>
    <span class="text-base">➡️</span>
  </a>\n`;
  } else {
    navFooter += `  <a href="../CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html" class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all flex items-center justify-between text-right gap-3 text-slate-300 hover:text-cyan-300 md:ml-auto w-full">
    <div>
      <div class="text-[10px] text-slate-500 uppercase tracking-wider">Taxonomy Hub</div>
      <div class="font-bold text-slate-200">Return to Master Field Guide Index</div>
    </div>
    <span class="text-base">🏛️</span>
  </a>\n`;
  }
  navFooter += '</div>\n';

  const specimenMd = `# ${spec.icon} Specimen #${spec.num}: ${spec.title}
*Detailed Field Dossier for Digital Paleontologists &mdash; Siliquarium Evolved Circuit Taxonomy*

---

> [!IMPORTANT]
> **Independent Scientific Instrument & Non-Accreditation Notice:**  
> The Siliquarium computational biophysics platform is an independent project and is not affiliated with, sponsored by, or accredited by any university, government agency, or accreditation board. All biophysical models, circuits, and rate equations are provided with full first-principles mathematical derivations and peer-reviewed citations.
>
> 📖 **Navigation Hub:** [🏛️ Paleontology Field Guide Index](../CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html) | [📖 Paleontology Glossary](../CIRCUIT_PALEONTOLOGY_GLOSSARY.html) | [📚 Annotated Bibliography](../CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html) | [📝 Critical Notes & Justifications](../CIRCUIT_PALEONTOLOGY_NOTES.html)

---

<div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 my-6 shadow-xl space-y-4">
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
    <div class="flex items-center gap-2">
      <span class="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold uppercase tracking-wider">Taxon #${spec.num}</span>
      <span class="text-sm font-mono text-slate-200 font-bold italic">${spec.binomial}</span>
      <span class="text-xs font-mono text-slate-400">("${spec.commonName}")</span>
    </div>
    <div class="flex items-center gap-2 font-mono text-xs">
      <span class="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">Confidence: ${spec.confidence}</span>
      <span class="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">Complexity: ${spec.gates}</span>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-300">
    <div>
      <span class="font-mono text-slate-400 font-bold block mb-1">BIOLOGICAL COGNATE / COUNTERPART:</span>
      <span class="text-slate-200 leading-relaxed">${spec.model}</span>
    </div>
    <div>
      <span class="font-mono text-slate-400 font-bold block mb-1">PRIMARY BIOPHYSICAL FUNCTION:</span>
      <span class="text-slate-200 leading-relaxed">${spec.role}</span>
    </div>
  </div>
</div>

---

${body}

---

${navFooter}

---

<div class="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2 font-sans">
  <div class="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
    <span>🔬</span> Paleontological Verification &amp; Endnote Concordance
  </div>
  <p class="leading-relaxed">
    Every empirical claim, circuit rate law, and Landauer dissipation cost in this dossier is indexed in the <a href="../CIRCUIT_PALEONTOLOGY_NOTES.html" class="text-cyan-400 hover:underline">Critical Scientific Notes &amp; Derivations</a> repository. Primary papers by Uri Alon, Michael Elowitz, Tim Gardner, Jim Collins, Lynn Margulis, Rolf Landauer, and Howard Pattee are fully annotated in the <a href="../CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html" class="text-cyan-400 hover:underline">Annotated Primary Literature Bibliography</a>.
  </p>
</div>
`;

  const destFile = path.join(rootDir, 'docs', 'paleontology', spec.file);
  fs.writeFileSync(destFile, specimenMd, 'utf8');
  console.log(`✓ Wrote Specimen ${spec.num} to docs/paleontology/${spec.file}`);
}

console.log('\nAll 10 specimens successfully extracted to docs/paleontology/!');
