import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TARGET_DOCS = [
  // Master Docs
  'THEORETICAL_MODEL.md',
  'docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.md',
  'docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.md',
  'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md',
  'docs/CIRCUIT_PALEONTOLOGY_GLOSSARY.md',
  'docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md',
  'docs/CIRCUIT_PALEONTOLOGY_NOTES.md',
  'docs/THE_GENETIC_BOOK_OF_THE_DEAD.md',
  'docs/USER_GUIDE.md',

  // 20 Paleontology Specimen Dossiers
  'docs/paleontology/specimen_01_bistable_latch.md',
  'docs/paleontology/specimen_02_repressilator.md',
  'docs/paleontology/specimen_03_coherent_ffl.md',
  'docs/paleontology/specimen_04_incoherent_ffl.md',
  'docs/paleontology/specimen_05_negative_autoregulation.md',
  'docs/paleontology/specimen_06_binary_half_adder.md',
  'docs/paleontology/specimen_07_allosteric_inverter.md',
  'docs/paleontology/specimen_08_endosymbiotic_cassette.md',
  'docs/paleontology/specimen_09_syncytial_multicellularity.md',
  'docs/paleontology/specimen_10_pelagic_sporulation.md',
  'docs/paleontology/specimen_11_chemiosmotic_autotroph.md',
  'docs/paleontology/specimen_12_basalt_lithotroph.md',
  'docs/paleontology/specimen_13_trophic_predator.md',
  'docs/paleontology/specimen_14_detrital_scavenger.md',
  'docs/paleontology/specimen_15_patriarch_lineage.md',
  'docs/paleontology/specimen_16_temporal_derivative_chemotaxis.md',
  'docs/paleontology/specimen_17_predictive_pavlovian.md',
  'docs/paleontology/specimen_18_entrained_pacemaker.md',
  'docs/paleontology/specimen_19_steiner_vascular_network.md',
  'docs/paleontology/specimen_20_cryptobiotic_dormancy_clamp.md',

  // QA Audits & Evaluation Report
  'QA/DESIGN_STUDIO_UX_AUDIT.md',
  'QA/FIELD_GUIDE_NATURALIST_EVALUATION.md',
  'QA/NAIVE_USER_VISUAL_AUDIT.md',
  'QA/PANEL_UX_EVALUATION_REPORT.html'
];

console.log('='.repeat(80));
console.log('AUDITING DOCUMENTATION AGAINST DOCUMENTATION_STANDARDS.md');
console.log('='.repeat(80));

const results = [];

for (const relPath of TARGET_DOCS) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    results.push({ relPath, exists: false });
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const isHtml = relPath.endsWith('.html');
  let matchingHtmlPath = relPath.replace(/\.md$/, '.html');
  if (relPath === 'THEORETICAL_MODEL.md') {
    matchingHtmlPath = 'docs/THEORETICAL_MODEL.html';
  }
  const fullHtmlPath = path.join(rootDir, matchingHtmlPath);
  const htmlExists = isHtml ? true : fs.existsSync(fullHtmlPath);

  // Equation analysis
  const displayEqs = content.match(/\$\$[\s\S]*?\$\$/g) || [];
  const eqDecoderBlocks = content.match(/(?:> ### 🔍 Equation Decoder|> \[!DECODER\]|### 🔍 Equation Decoder|Equation Decoder:)/gi) || [];

  // Find equations missing immediate decoder
  const eqBlocksWithDecoderStatus = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('$$')) {
      const startLine = i + 1;
      let endLine = i + 1;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim().endsWith('$$')) {
          endLine = j + 1;
          i = j;
          break;
        }
      }
      // Look ahead up to 25 lines for Equation Decoder
      const lookahead = lines.slice(endLine, Math.min(lines.length, endLine + 25)).join('\n');
      const hasDecoder = /Equation Decoder/i.test(lookahead);
      eqBlocksWithDecoderStatus.push({ startLine, endLine, hasDecoder, snippet: lines[startLine - 1].trim().slice(0, 50) });
    }
  }

  // 5 Dimensions checks
  // D1: Visceral Intuition & Foundational Motivation
  const hasD1Keywords = /existential crisis|dilution catastrophe|thermal noise|visceral|starvation|survival|physical stakes|famine|danger/i.test(content);

  // D2: Gradient of Abstraction
  const hasD2Keywords = /step-by-step|toy example|2-bit|gradient|abstraction|common sense|walkthrough/i.test(content);

  // D3: Equation Decoders count
  const d3Compliant = displayEqs.length === 0 || eqDecoderBlocks.length >= displayEqs.length;

  // D4: Worked Concrete Toy Pre-Traces
  const hasToyTrace = /(?:Toy Pre-Trace|Worked Concrete Toy|Tick[\s\S]{1,60}Battery)/i.test(content) && /\|\s*\*{0,2}0\*{0,2}\s*\|/i.test(content);

  // D5: Conceptual Misconception Immunity (Skeptic FAQ)
  const hasSkepticFAQ = /(?:Skeptic FAQ|Misconception Immunity|Conceptual Misconception|Common Student & Skeptic)/i.test(content);

  // 4 Sacred Analogies
  const analogies = {
    safeAndWorkshop: /safe and (?:the )?workshop|cookbook inside a fireproof safe|epistemic cut/i.test(content),
    hydrothermalVent: /hydrothermal vent|digital drumbeat|rhythm/i.test(content),
    rockPores: /rock pores?|nature'?s first walls|mineral (?:micro-)?compartment/i.test(content),
    batteryPantry: /battery pantry|local pantry|calorie counter|landauer.*switching/i.test(content)
  };

  // Diagrams and visual assets
  const images = (content.match(/!\[.*?\]\(.*?\)|<img .*?>/gi) || []).length;
  const svgs = (content.match(/\.svg/gi) || []).length;
  const pngs = (content.match(/\.png/gi) || []).length;

  // Topologies (Rosette, Columnar, Dendritic, Ring, Filamentous)
  const topologies = {
    rosette: /rosette/i.test(content),
    columnar: /columnar/i.test(content),
    dendritic: /dendritic/i.test(content),
    ring: /ring (?:topology|morphology|colony)/i.test(content),
    filamentous: /filamentous/i.test(content)
  };

  results.push({
    relPath,
    exists: true,
    htmlExists,
    displayEqCount: displayEqs.length,
    eqDecoderCount: eqDecoderBlocks.length,
    eqBlocksWithDecoderStatus,
    hasD1Keywords,
    hasD2Keywords,
    d3Compliant,
    hasToyTrace,
    hasSkepticFAQ,
    analogies,
    images,
    svgs,
    pngs,
    topologies
  });
}

for (const r of results) {
  if (!r.exists) {
    console.log(`❌ FILE NOT FOUND: ${r.relPath}`);
    continue;
  }
  console.log(`\n📄 [${r.relPath}]`);
  console.log(`   HTML Paired: ${r.htmlExists ? '✅' : '❌'}`);
  console.log(`   Equations: ${r.displayEqCount} | Decoders: ${r.eqDecoderCount} | D3 Compliant: ${r.d3Compliant ? '✅' : '⚠️'}`);
  if (!r.d3Compliant && r.displayEqCount > 0) {
    const missing = r.eqBlocksWithDecoderStatus.filter(e => !e.hasDecoder);
    console.log(`   ⚠️ Undecoded Equations (${missing.length}):`, missing.map(m => `L${m.startLine}`).join(', '));
  }
  console.log(`   D1 (Visceral Motivation): ${r.hasD1Keywords ? '✅' : '❌'}`);
  console.log(`   D2 (Gradient/Step-by-Step): ${r.hasD2Keywords ? '✅' : '❌'}`);
  console.log(`   D4 (Worked Toy Pre-Trace): ${r.hasToyTrace ? '✅' : '❌'}`);
  console.log(`   D5 (Skeptic FAQ): ${r.hasSkepticFAQ ? '✅' : '❌'}`);
  const aCount = Object.values(r.analogies).filter(Boolean).length;
  console.log(`   4 Sacred Analogies (${aCount}/4): Safe: ${r.analogies.safeAndWorkshop ? '✓' : '✗'}, Vent: ${r.analogies.hydrothermalVent ? '✓' : '✗'}, Pores: ${r.analogies.rockPores ? '✓' : '✗'}, Battery: ${r.analogies.batteryPantry ? '✓' : '✗'}`);
  console.log(`   Visual Assets: ${r.images} (SVGs: ${r.svgs}, PNGs: ${r.pngs})`);
  const topCount = Object.values(r.topologies).filter(Boolean).length;
  console.log(`   Topologies mentioned: ${topCount}/5`);
}
