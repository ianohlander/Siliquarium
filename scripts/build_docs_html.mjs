#!/usr/bin/env node

/**
 * 🐠 Siliquarium Native Zero-Dependency Markdown to HTML Documentation Compiler
 * Generates self-contained, responsive, enterprise-grade abyssal-themed HTML documents
 * built on Tailwind CSS, MathJax 3, and a Two-Column Categorized Sidebar + Top Dropdown layout.
 * Eliminates all horizontal scrollbars in favor of clean, categorized vertical navigation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const NAV_CATEGORIES = [
  {
    name: 'Volume I: Prebiotic Biophysics',
    icon: '🌋',
    items: [
      { id: 'theory', title: '1. Theoretical Model', href: 'docs/THEORETICAL_MODEL.html', icon: '🌊', desc: '21 sealed sections & thermodynamic laws' },
      { id: 'epistemic', title: '2. Epistemic Foundations', href: 'docs/EPISTEMIC_FOUNDATIONS.html', icon: '🧬', desc: "Howard Pattee's Epistemic Cut & defenses" },
      { id: 'translation-matrix', title: '3. Translation Matrix (Reality ↔ Sim)', href: 'docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.html', icon: '🔄', desc: 'Grounding physical metaphors to computational invariants' },
      { id: 'proto-cognition', title: '4. Proto-Cognition & Vent Biophysics', href: 'docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.html', icon: '🧠', desc: 'Sensory-motor coupling, temporal derivatives & biophysics' },
      { id: 'genetic-book', title: '5. Book of the Dead', href: 'docs/THE_GENETIC_BOOK_OF_THE_DEAD.html', icon: '📖', desc: 'Dawkins, Adami & Environmental Info' },
      { id: 'unit1', title: '6. Unit 1: Prebiotic Vents', href: 'docs/curriculum/unit1_prebiotic_threshold.html', icon: '🌋', desc: "Alkaline vents, chemiosmosis & Pattee's cut" }
    ]
  },
  {
    name: 'Volume II: Gene Regulatory Networks',
    icon: '🧬',
    items: [
      { id: 'grn-volume', title: '1. GRNs & Attractors (Vol II)', href: 'docs/GENE_REGULATORY_NETWORKS_VOLUME.html', icon: '🧬', desc: 'Biological & digital GRNs, attractors & Waddington' },
      { id: 'unit2', title: '2. Unit 2: Logic of Life', href: 'docs/curriculum/unit2_logic_of_life.html', icon: '⚡', desc: 'Primitive enzymes & XOR impossibility proof' },
      { id: 'unit3', title: '3. Unit 3: Systems Motifs', href: 'docs/curriculum/unit3_systems_biology_motifs.html', icon: '🕸️', desc: 'Uri Alon motifs & Weisfeiler-Lehman hashes' }
    ]
  },
  {
    name: 'Volume III: Multicellular Morphology',
    icon: '🌸',
    items: [
      { id: 'morphologies', title: '1. Multicellular Morphology (Vol III)', href: 'docs/MULTICELLULAR_MORPHOLOGY_GUIDE.html', icon: '🌸', desc: 'Graph theory, 3-cliques & 5 body topologies' }
    ]
  },
  {
    name: 'Volume IV: Circuit Paleontology',
    icon: '🦕',
    items: [
      { id: 'circuit-paleontology', title: 'Paleontology Field Guide', href: 'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html', icon: '🏛️', desc: 'Master taxonomy, philosophy & WL hash overview' },
      { id: 'unit4', title: 'Unit 4: Macro-Evolution', href: 'docs/curriculum/unit4_evolutionary_dynamics.html', icon: '🧬', desc: 'Kimura drift, convergent homoplasy & LTEE' },
      { id: 'specimen-01', title: 'Specimen 1: Bistable Latch', href: 'docs/paleontology/specimen_01_bistable_latch.html', icon: '🔒', desc: '1-bit memory latch & SR flip-flop' },
      { id: 'specimen-02', title: 'Specimen 2: Repressilator', href: 'docs/paleontology/specimen_02_repressilator.html', icon: '🔄', desc: 'Odd-inverter ring oscillator & clock' },
      { id: 'specimen-03', title: 'Specimen 3: Coherent FFL', href: 'docs/paleontology/specimen_03_coherent_ffl.html', icon: '⏳', desc: 'Sign-sensitive delay & persistence filter' },
      { id: 'specimen-04', title: 'Specimen 4: Incoherent FFL', href: 'docs/paleontology/specimen_04_incoherent_ffl.html', icon: '⚡', desc: 'Fold-change adaptation & pulse generator' },
      { id: 'specimen-05', title: 'Specimen 5: Negative Autoreg', href: 'docs/paleontology/specimen_05_negative_autoregulation.html', icon: '🎚️', desc: 'Homeostatic clamp & response accelerator' },
      { id: 'specimen-06', title: 'Specimen 6: Binary Half-Adder', href: 'docs/paleontology/specimen_06_binary_half_adder.html', icon: '🧮', desc: 'Arithmetic sum (XOR) & carry (AND)' },
      { id: 'specimen-07', title: 'Specimen 7: Allosteric NOT', href: 'docs/paleontology/specimen_07_allosteric_inverter.html', icon: '🛡️', desc: 'Toxin defense & inverter shielding' },
      { id: 'specimen-08', title: 'Specimen 8: Endosymbiont', href: 'docs/paleontology/specimen_08_endosymbiotic_cassette.html', icon: '🔋', desc: 'Organelle cassette & metabolic boost' },
      { id: 'specimen-09', title: 'Specimen 9: Syncytium', href: 'docs/paleontology/specimen_09_syncytial_multicellularity.html', icon: '🕸️', desc: 'Multi-pore fusion & cytoplasmic sharing' },
      { id: 'specimen-10', title: 'Specimen 10: Pelagic Spores', href: 'docs/paleontology/specimen_10_pelagic_sporulation.html', icon: '🌊', desc: 'Buoyant dispersal & benthic escape' },
      { id: 'specimen-11', title: 'Specimen 11: Apex Autotroph', href: 'docs/paleontology/specimen_11_chemiosmotic_autotroph.html', icon: '🌋', desc: 'Mitchell PMF & hydrothermal plume coupling' },
      { id: 'specimen-12', title: 'Specimen 12: Basalt Lithotroph', href: 'docs/paleontology/specimen_12_basalt_lithotroph.html', icon: '🪨', desc: 'Deep subterranean starvation & Landauer thrift' },
      { id: 'specimen-13', title: 'Specimen 13: Trophic Predator', href: 'docs/paleontology/specimen_13_trophic_predator.html', icon: '🩸', desc: 'Lytic enzymatic siphoning & heterotrophy' },
      { id: 'specimen-14', title: 'Specimen 14: Detrital Scavenger', href: 'docs/paleontology/specimen_14_detrital_scavenger.html', icon: '🍂', desc: 'Carcass necromass & mineral mass recycling' },
      { id: 'specimen-15', title: 'Specimen 15: Patriarch Ancestor', href: 'docs/paleontology/specimen_15_patriarch_lineage.html', icon: '🏛️', desc: 'Conserved primordial genome & LTEE anchor' },
      { id: 'specimen-16', title: 'Specimen 16: Chemotaxis Engine', href: 'docs/paleontology/specimen_16_temporal_derivative_chemotaxis.html', icon: '🧭', desc: 'Purcell-Berg fold-change dS/dt gradient sensor' },
      { id: 'specimen-17', title: 'Specimen 17: Pavlovian Regulator', href: 'docs/paleontology/specimen_17_predictive_pavlovian.html', icon: '🔮', desc: 'Tagkopoulos anticipatory precursor feedforward shield' },
      { id: 'specimen-18', title: 'Specimen 18: Entrained Pacemaker', href: 'docs/paleontology/specimen_18_entrained_pacemaker.html', icon: '⏱️', desc: 'Johnson-Rust phase-locked KaiABC vent clock' },
      { id: 'specimen-19', title: 'Specimen 19: Steiner Vascular Net', href: 'docs/paleontology/specimen_19_steiner_vascular_network.html', icon: '🌿', desc: 'Nakagaki Physarum minimal tree conduit router' },
      { id: 'specimen-20', title: 'Specimen 20: Dormancy Clamp', href: 'docs/paleontology/specimen_20_cryptobiotic_dormancy_clamp.html', icon: '🛡️', desc: 'Balaban HipAB zero-burn cryptobiosis gate' }
    ]
  },
  {
    name: 'Volume V: Systems Operations',
    icon: '🛠️',
    items: [
      { id: 'user-guide', title: 'Illustrated Systems Manual', href: 'docs/USER_GUIDE.html', icon: '📖', desc: '10-chapter illustrated manual & tutorials' },
      { id: 'practicums', title: 'Laboratory Practicums 1–5', href: 'docs/curriculum/practicums_lab_manual.html', icon: '🧪', desc: '5 hands-on labs & formative assessments' },
      { id: 'phase3', title: '3D Seafloor Visualizer', href: 'docs/PHASE_3_VISUALIZER_GUIDE.html', icon: '🔬', desc: 'Bathymetry, orbit camera & circuit microscope' },
      { id: 'phase4', title: 'Paleontology & Motifs', href: 'docs/PHASE_4_PALEONTOLOGY_GUIDE.html', icon: '🦕', desc: 'Weisfeiler-Lehman hashes & fossil freezer' },
      { id: 'phase5', title: 'Pelagic Spores & Controls', href: 'docs/PHASE_5_PELAGIC_SPORES_GUIDE.html', icon: '🌊', desc: 'Buoyant spore drift & God-suite parameters' },
      { id: 'phase6', title: 'Phylogeny & Dynamics', href: 'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html', icon: '🧬', desc: 'Multi-lineage clades & Lenski benchmarks' }
    ]
  },
  {
    name: 'Volume VI: Academic References',
    icon: '📚',
    items: [
      { id: 'index', title: 'Master Library Portal', href: 'docs/index.html', icon: '🏛️', desc: 'Curriculum portal & modular index' },
      { id: 'glossary', title: 'Systems Biology Glossary', href: 'docs/companion/glossary.html', icon: '📖', desc: '70-term systems biology lexicon' },
      { id: 'study-guides', title: 'Study Guides & Master Decoders', href: 'docs/companion/study_guides.html', icon: '🧭', desc: '8 equation decoders & derivations' },
      { id: 'bibliography', title: 'Annotated Master Bibliography', href: 'docs/companion/bibliography.html', icon: '📚', desc: '22 foundational primary papers' },
      { id: 'full-year-syllabus', title: 'Full-Year University Syllabus', href: 'docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.html', icon: '🎓', desc: '30-week university curriculum & syllabus' },
      { id: 'circuit-notes', title: 'Critical Scientific Notes', href: 'docs/CIRCUIT_PALEONTOLOGY_NOTES.html', icon: '📝', desc: '36 in-depth derivations, proofs & justifications' },
      { id: 'circuit-glossary', title: 'Paleontology Glossary', href: 'docs/CIRCUIT_PALEONTOLOGY_GLOSSARY.html', icon: '📖', desc: '50-term lexicon of evolved circuits' },
      { id: 'circuit-bibliography', title: 'Paleontology Bibliography', href: 'docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html', icon: '📚', desc: '25+ landmark peer-reviewed papers' },
      { id: 'pedagogy', title: 'Companion Portal', href: 'docs/PEDAGOGICAL_COMPANION_SUITE.html', icon: '🏛️', desc: 'Master portal & assessment rubrics' }
    ]
  },
  {
    name: 'Standards & Architecture',
    icon: '📏',
    items: [
      { id: 'dev-standards', title: 'Engineering Standards', href: 'standards/DEVELOPMENT_STANDARDS.html', icon: '⚙️', desc: 'Architecture, TypeScript & design principles' },
      { id: 'qa-standards', title: 'QA & Testing Standards', href: 'standards/QA_AND_TESTING_STANDARDS.html', icon: '🧪', desc: 'Verification, CI & unit test frameworks' },
      { id: 'docs-standards', title: 'Pedagogical Standards', href: 'standards/DOCUMENTATION_STANDARDS.html', icon: '📚', desc: '5-Dimension rubric & equation decoders' }
    ]
  },
  {
    name: 'QA & Field Evaluations',
    icon: '🔍',
    items: [
      { id: 'qa-coding-standards', title: 'QA Coding Standards Audit', href: 'QA/QA_CODING_STANDARDS_FULL_AUDIT_REPORT.html', icon: '🏛️', desc: 'Comprehensive audit against DEVELOPMENT, QA & DOCS standards' },
      { id: 'qa-ux-audit', title: 'UX Architecture Audit & Redesign', href: 'QA/UX_ARCHITECTURE_AUDIT_AND_REDESIGN.html', icon: '📐', desc: '5D HCI audit, domain integrity & interface redesign' },
      { id: 'qa-panel-report', title: 'Panel Evaluation Report', href: 'QA/PANEL_UX_EVALUATION_REPORT.html', icon: '🏛️', desc: 'Expert & tester panel 4x 1-hour journeys' },
      { id: 'qa-design-studio', title: 'Design Studio UX Audit', href: 'QA/DESIGN_STUDIO_UX_AUDIT.html', icon: '🏗️', desc: 'CAD sculpting & world builder evaluation' },
      { id: 'qa-naturalist-eval', title: 'Naturalist Field Evaluation', href: 'QA/FIELD_GUIDE_NATURALIST_EVALUATION.html', icon: '🌿', desc: 'Field guide & safari co-pilot audit' },
      { id: 'qa-naive-user', title: 'Naive User Visual Audit', href: 'QA/NAIVE_USER_VISUAL_AUDIT.html', icon: '👁️', desc: 'Visual clarity & cognitive ergonomics audit' },
      { id: 'qa-report', title: 'Student QA Report', href: 'QA/STUDENT_UX_REPORT.html', icon: '🔍', desc: '12th-grade usability audit & screenshots' }
    ]
  },
  {
    name: 'Visuals & Identity',
    icon: '🎨',
    items: [
      { id: 'brand', title: 'Brand Identity', href: 'docs/BRAND_IDENTITY.html', icon: '🎨', desc: 'Visual philosophy & biomorphic styling' },
      { id: 'logos', title: 'Logo Gallery', href: 'docs/logos.html', icon: '🖼️', desc: 'High-res Fibonacci nautilus asset suite' }
    ]
  }
];


function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

function splitTableRow(line) {
  const trimmed = line.trim();
  const raw = trimmed.slice(1, -1); // strip leading and trailing pipe
  const cells = [];
  let cur = '';
  let inMath = false;
  let inBacktick = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const prev = i > 0 ? raw[i - 1] : '';

    if (ch === '`' && prev !== '\\') {
      inBacktick = !inBacktick;
      cur += ch;
    } else if (ch === '$' && prev !== '\\' && !inBacktick) {
      inMath = !inMath;
      cur += ch;
    } else if (ch === '|' && !inMath && !inBacktick && prev !== '\\') {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

function getRelativeUrl(fromFile, toFile) {
  const fromDir = path.dirname(path.resolve(rootDir, fromFile));
  const toPath = path.resolve(rootDir, toFile);
  return path.relative(fromDir, toPath).replace(/\\/g, '/');
}

function resolveDocLink(href, currentSrcMd = '', currentDestHtml = '') {
  if (!href || /^https?:\/\/|^mailto:|^#|^data:/.test(href)) return href;

  // Handle file:// URLs
  if (/^file:\/{1,3}/i.test(href)) {
    try {
      const decoded = decodeURIComponent(href.replace(/^file:\/{1,3}/i, ''));
      const [fPath, fHash] = decoded.split('#');
      let absPath = fPath;
      if (/^\/?[a-zA-Z]:/.test(absPath)) {
        absPath = absPath.replace(/^\//, '');
      }
      if (fs.existsSync(absPath)) {
        const fromDir = path.dirname(path.join(rootDir, currentDestHtml || 'docs/index.html'));
        // Check if drive letters differ on Windows (e.g. C: vs H:)
        if (path.parse(fromDir).root.toLowerCase() !== path.parse(absPath).root.toLowerCase()) {
          return href; // Preserve absolute file:// URL across different drives
        }
        let rel = path.relative(fromDir, absPath).replace(/\\/g, '/');
        if (fHash) rel += `#${fHash}`;
        return rel;
      }
    } catch (e) {}
    return href;
  }

  const [targetPath, hash] = href.split('#');
  if (!targetPath) return href;

  const srcDir = path.dirname(path.join(rootDir, currentSrcMd || currentDestHtml || 'docs/index.html'));
  let resolvedTarget = path.resolve(srcDir, targetPath);

  // If target does not exist as resolved from srcDir, try resolving from rootDir or docs/
  if (!fs.existsSync(resolvedTarget)) {
    if (fs.existsSync(path.resolve(rootDir, targetPath))) {
      resolvedTarget = path.resolve(rootDir, targetPath);
    } else if (fs.existsSync(path.resolve(rootDir, 'docs', targetPath))) {
      resolvedTarget = path.resolve(rootDir, 'docs', targetPath);
    }
  }

  let targetRelToRoot = path.relative(rootDir, resolvedTarget).replace(/\\/g, '/');

  // Match against known DOCS_MAP by exact relative path
  const knownPage = DOCS_MAP.find(p => 
    p.srcMd === targetRelToRoot || 
    p.destHtml === targetRelToRoot ||
    (targetRelToRoot.endsWith('.md') && p.srcMd === targetRelToRoot) ||
    (targetRelToRoot.endsWith('.html') && p.destHtml === targetRelToRoot)
  );

  if (knownPage) {
    targetRelToRoot = knownPage.destHtml;
  } else if (targetRelToRoot.endsWith('.md')) {
    targetRelToRoot = targetRelToRoot.replace(/\.md$/, '.html');
  }

  const fromDir = path.dirname(path.join(rootDir, currentDestHtml || 'docs/index.html'));
  const toFile = path.join(rootDir, targetRelToRoot);
  let relUrl = path.relative(fromDir, toFile).replace(/\\/g, '/');
  if (hash) relUrl += `#${hash}`;
  return relUrl;
}

function parseMarkdown(md, currentDocId, relativeRoot = '', currentSrcMd = '', currentDestHtml = '') {
  // Normalize 2-argument \color{#hex}{text} or \color{name}{text} to standard LaTeX \textcolor{#hex}{text}
  md = md.replace(/\\color\{(#(?:[0-9a-fA-F]{3}){1,2}|[a-zA-Z]+)\}\{/g, '\\textcolor{$1}{');
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let inList = false;
  let listType = 'ul';

  function closeList() {
    if (inList) {
      out.push(`</${listType}>`);
      inList = false;
    }
  }

  function closeTable() {
    if (inTable) {
      let tHtml = '<div class="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60 shadow-inner"><table class="w-full text-left text-sm font-sans border-collapse"><thead><tr class="bg-slate-950/80 border-b border-slate-800 text-slate-100 font-mono text-xs uppercase tracking-wider">';
      for (const th of tableHeader) {
        tHtml += `<th class="p-3.5 font-semibold">${inlineFormat(th.trim(), currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</th>`;
      }
      tHtml += '</tr></thead><tbody class="divide-y divide-slate-800/60 text-slate-300">';
      for (const row of tableRows) {
        tHtml += '<tr class="hover:bg-slate-800/30 transition-colors">';
        for (const td of row) {
          tHtml += `<td class="p-3.5 leading-relaxed">${inlineFormat(td.trim(), currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</td>`;
        }
        tHtml += '</tr>';
      }
      tHtml += '</tbody></table></div>';
      out.push(tHtml);
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  }


  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        if (codeLang === 'mermaid') {
          out.push(`<div class="mermaid p-4 rounded-xl bg-slate-950/80 border border-slate-800 my-6 overflow-x-auto text-xs font-mono text-cyan-300">${escapeHtml(codeLines.join('\n'))}</div>`);
        } else {
          out.push(`<pre class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 my-6 overflow-x-auto text-xs font-mono text-slate-200 shadow-inner"><code class="language-${codeLang}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        }
        inCodeBlock = false;
        codeLines = [];
      } else {
        closeList();
        closeTable();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim() || 'text';
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    // Horizontal Rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeList();
      closeTable();
      out.push('<hr class="border-t border-slate-800 my-8" />');
      continue;
    }

    // Blank line
    if (!trimmed) {
      closeList();
      closeTable();
      continue;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      const cells = splitTableRow(trimmed);
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else if (cells.every(c => /^[\s:-]+$/.test(c))) {
        // separator row, skip
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      closeTable();
    }

    // Blockquotes & Semantic Alerts
    if (trimmed.startsWith('>')) {
      closeList();
      let quoteText = trimmed.replace(/^>\s?/, '');
      let alertType = 'default';

      if (quoteText.startsWith('[!ANALOGY]') || quoteText.startsWith('[!EVERYDAY ANALOGY]')) {
        alertType = 'analogy';
        quoteText = quoteText.replace(/\[!(ANALOGY|EVERYDAY ANALOGY)\]\s?/, '');
      } else if (quoteText.startsWith('[!CHECKPOINT]') || quoteText.startsWith('[!CONCEPT CHECKPOINT]')) {
        alertType = 'checkpoint';
        quoteText = quoteText.replace(/\[!(CHECKPOINT|CONCEPT CHECKPOINT)\]\s?/, '');
      } else if (quoteText.startsWith('[!ANALYSIS]') || quoteText.startsWith('[!PILLARS]')) {
        alertType = 'analysis';
        quoteText = quoteText.replace(/\[!(ANALYSIS|PILLARS)\]\s?/, '');
      } else if (quoteText.startsWith('[!NOTE]')) {
        alertType = 'note';
        quoteText = quoteText.replace(/\[!NOTE\]\s?/, '');
      } else if (quoteText.startsWith('[!TIP]')) {
        alertType = 'tip';
        quoteText = quoteText.replace(/\[!TIP\]\s?/, '');
      } else if (quoteText.startsWith('[!IMPORTANT]')) {
        alertType = 'important';
        quoteText = quoteText.replace(/\[!IMPORTANT\]\s?/, '');
      } else if (quoteText.startsWith('[!WARNING]')) {
        alertType = 'warning';
        quoteText = quoteText.replace(/\[!WARNING\]\s?/, '');
      } else if (quoteText.startsWith('[!DECODER]') || quoteText.startsWith('[!EQUATION DECODER]')) {
        alertType = 'decoder';
        quoteText = quoteText.replace(/\[!(DECODER|EQUATION DECODER)\]\s?/, '');
      }

      const bqLines = [quoteText];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
      }

      if (alertType === 'default' && bqLines.some(l => l.includes('Equation Decoder'))) {
        alertType = 'decoder';
      }

      const formattedBq = formatBlockquoteContent(bqLines, currentDocId, relativeRoot, alertType, currentSrcMd, currentDestHtml);

      if (alertType === 'analogy') {
        out.push(`<div class="card-analogy p-5 rounded-2xl border border-amber-500/40 my-6 space-y-2 text-sm text-slate-300 shadow-lg">
          <div class="font-mono text-amber-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-800/80 pb-2">
            <span>🌍</span> Everyday Analogy
          </div>
          <div class="leading-relaxed font-sans">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'checkpoint') {
        out.push(`<div class="card-experiment p-5 rounded-2xl border border-purple-500/40 my-6 space-y-2 text-sm text-slate-300 shadow-lg">
          <div class="font-mono text-purple-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-800/80 pb-2">
            <span>🎯</span> Concept Checkpoint
          </div>
          <div class="leading-relaxed font-sans">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'analysis') {
        out.push(`<div class="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono space-y-3 my-6 shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 text-sm">🔬</span>
              <span class="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Comprehensive Pedagogical Analysis &bull; Figure Breakdown</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">Deep-Dive Analysis</span>
          </div>
          <div class="space-y-2 text-slate-300 font-sans leading-relaxed text-xs">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'decoder') {
        out.push(`<div class="card-silicon p-5 rounded-2xl border border-cyan-500/40 my-6 space-y-3 text-xs shadow-lg">
          <div class="font-mono text-cyan-300 font-bold flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-800/80 pb-2">
            <span>🧭</span> Equation Decoder Apparatus
          </div>
          <div class="leading-relaxed font-sans space-y-2">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'note') {
        out.push(`<div class="p-4 rounded-xl bg-cyan-950/30 border-l-4 border-cyan-400 my-4 text-sm text-slate-300"><div class="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">NOTE</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'tip') {
        out.push(`<div class="p-4 rounded-xl bg-emerald-950/30 border-l-4 border-emerald-400 my-4 text-sm text-slate-300"><div class="font-mono text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">TIP</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'important') {
        out.push(`<div class="p-4 rounded-xl bg-purple-950/30 border-l-4 border-purple-400 my-4 text-sm text-slate-300"><div class="font-mono text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">IMPORTANT</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'warning') {
        out.push(`<div class="p-4 rounded-xl bg-amber-950/30 border-l-4 border-amber-400 my-4 text-sm text-slate-300"><div class="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">WARNING</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else {
        out.push(`<blockquote class="border-l-4 border-slate-700 bg-slate-900/60 p-4 rounded-r-xl my-4 text-slate-300 text-sm leading-relaxed italic font-serif">${formattedBq}</blockquote>`);
      }
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text.replace(/<[^>]+>/g, ''));

      let sizeClasses = 'text-xl font-bold font-mono text-slate-100 mt-8 mb-4';
      if (level === 1) sizeClasses = 'text-2xl md:text-3xl font-extrabold font-mono text-slate-100 mt-8 mb-4 pb-2 border-b border-slate-800';
      if (level === 2) sizeClasses = 'text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-8 mb-3 pb-1 border-b border-slate-800/80';
      if (level === 3) sizeClasses = 'text-lg font-bold font-mono text-cyan-400 mt-6 mb-2';
      if (level === 4) sizeClasses = 'text-base font-semibold font-mono text-amber-400 mt-4 mb-2';

      out.push(`<h${level} id="${id}" class="${sizeClasses}">${inlineFormat(text, currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</h${level}>`);
      continue;
    }

    // Lists
    const ulMatch = rawLine.match(/^(\s*)[-*+]\s+(.*)$/);
    const olMatch = rawLine.match(/^(\s*)\d+\.\s+(.*)$/);
    if (ulMatch || olMatch) {
      const match = ulMatch || olMatch;
      const curType = ulMatch ? 'ul' : 'ol';
      if (!inList) {
        inList = true;
        listType = curType;
        const listClasses = curType === 'ul' ? 'list-disc pl-6 space-y-1.5 my-4 text-sm text-slate-300 font-sans leading-relaxed' : 'list-decimal pl-6 space-y-1.5 my-4 text-sm text-slate-300 font-sans leading-relaxed';
        out.push(`<${listType} class="${listClasses}">`);
      }
      out.push(`<li>${inlineFormat(match[2], currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</li>`);
      continue;
    } else {
      closeList();
    }

    // Multi-line Display Math $$ ... $$
    if (trimmed.startsWith('$$') && !trimmed.slice(2).includes('$$')) {
      closeList();
      closeTable();
      const mathLines = [rawLine];
      while (i + 1 < lines.length) {
        i++;
        mathLines.push(lines[i]);
        if (lines[i].trim().includes('$$')) {
          break;
        }
      }
      out.push(`<p class="text-sm text-slate-300 font-sans leading-relaxed my-3">${mathLines.join('\n')}</p>`);
      continue;
    }

    // Raw HTML lines
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      let rawHtmlLine = trimmed;
      rawHtmlLine = rawHtmlLine.replace(/<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, (full, pre, href, post) => {
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('#')) {
          const fixedHref = resolveDocLink(href, currentSrcMd, currentDestHtml);
          return `<a ${pre}href="${fixedHref}"${post}>`;
        }
        return full;
      });
      out.push(rawHtmlLine);
      continue;
    }

    // Paragraph
    out.push(`<p class="text-sm text-slate-300 font-sans leading-relaxed my-3">${inlineFormat(trimmed, currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</p>`);
  }


  closeList();
  closeTable();
  return out.join('\n');
}

function formatBlockquoteContent(bqLines, currentDocId, relativeRoot = '', alertType = 'default', currentSrcMd = '', currentDestHtml = '') {
  const result = [];
  let inBqList = false;
  let bqListType = 'ul';

  function closeBqList() {
    if (inBqList) {
      result.push(`</${bqListType}>`);
      inBqList = false;
    }
  }

  // Pre-stitch multi-line $$ display math
  const stitchedLines = [];
  for (let j = 0; j < bqLines.length; j++) {
    const rawLine = bqLines[j];
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('$$') && !trimmed.slice(2).includes('$$')) {
      const mathLines = [rawLine];
      while (j + 1 < bqLines.length) {
        j++;
        mathLines.push(bqLines[j]);
        if (bqLines[j].trim().includes('$$')) {
          break;
        }
      }
      stitchedLines.push(mathLines.join('\n'));
    } else {
      stitchedLines.push(rawLine);
    }
  }

  for (let j = 0; j < stitchedLines.length; j++) {
    const rawLine = stitchedLines[j];
    const line = rawLine.trim();
    if (!line) {
      closeBqList();
      continue;
    }

    // Display Math $$ ... $$
    if (line.startsWith('$$') && line.endsWith('$$')) {
      closeBqList();
      result.push(`<div class="my-3 overflow-x-auto text-center">${line}</div>`);
      continue;
    }

    // Headings inside blockquote: ### Heading
    const headMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headMatch) {
      closeBqList();
      const level = headMatch[1].length;
      const text = headMatch[2];
      const headingClass = level <= 2 
        ? 'text-base font-bold font-mono text-cyan-300 mt-3 mb-1.5' 
        : 'text-sm font-semibold font-mono text-amber-300 mt-2 mb-1';
      result.push(`<div class="${headingClass}">${inlineFormat(text, currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</div>`);
      continue;
    }

    // Unordered List inside blockquote: - item or * item
    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!inBqList || bqListType !== 'ul') {
        closeBqList();
        inBqList = true;
        bqListType = 'ul';
        result.push('<ul class="list-disc pl-5 space-y-1.5 my-2 text-xs text-slate-300 font-sans leading-relaxed">');
      }
      result.push(`<li>${inlineFormat(ulMatch[1], currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</li>`);
      continue;
    }

    // Ordered List inside blockquote: 1. item
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inBqList || bqListType !== 'ol') {
        closeBqList();
        inBqList = true;
        bqListType = 'ol';
        result.push('<ol class="list-decimal pl-5 space-y-1.5 my-2 text-xs text-slate-300 font-sans leading-relaxed">');
      }
      result.push(`<li>${inlineFormat(olMatch[1], currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</li>`);
      continue;
    }

    closeBqList();

    // Check if line is a 4-pillar analysis bullet or bold paragraph
    if (/^\*\*(🔍|🔬|💻|🏛️|💡)/.test(line)) {
      result.push(`<p class="leading-relaxed font-sans text-xs my-2">${inlineFormat(line, currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</p>`);
    } else {
      result.push(`<p class="leading-relaxed font-sans text-xs my-1.5">${inlineFormat(line, currentDocId, relativeRoot, currentSrcMd, currentDestHtml)}</p>`);
    }
  }


  closeBqList();
  return result.join('\n');
}

function inlineFormat(text, currentDocId, relativeRoot = '', currentSrcMd = '', currentDestHtml = '') {
  // Stash math expressions to prevent Markdown asterisks/underscores from corrupting LaTeX
  const mathStash = [];
  // Stash $$...$$ display math
  text = text.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
    const idx = mathStash.length;
    mathStash.push(m);
    return `@@@MATH_BLOCK_${idx}@@@`;
  });
  // Stash $...$ inline math (ignoring escaped \$)
  text = text.replace(/(^|[^\\])\$([^\$]+?)\$/g, (match, prefix, mathContent) => {
    const idx = mathStash.length;
    mathStash.push(`$${mathContent}$`);
    return `${prefix}@@@MATH_BLOCK_${idx}@@@`;
  });

  // Inline citations: [^id], [n](#ref-n), [n](#note-n)
  text = text.replace(/\[\^([a-zA-Z0-9_\-]+)\]/g, '<sup id="cite_ref-$1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-$1">[$1]</a></sup>');
  text = text.replace(/\[(\d+)\]\(#ref-(\d+)\)/g, '<sup id="cite_ref-$2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-$2">[$1]</a></sup>');
  text = text.replace(/\[(\d+)\]\(#note-(\d+)\)/g, '<sup id="fnref-$2" class="reference"><a href="#note-$2" class="text-cyan-400 hover:text-cyan-300 font-mono text-[10px] font-bold px-0.5">[$1]</a></sup>');

  // Inline images: ![alt](src)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    let cleanSrc = src.trim();
    if (!cleanSrc.startsWith('http://') && !cleanSrc.startsWith('https://') && !cleanSrc.startsWith('data:')) {
      const srcDir = path.dirname(path.resolve(rootDir, currentSrcMd || currentDestHtml || 'docs/index.html'));
      let resolvedAsset = path.resolve(srcDir, cleanSrc);
      if (!fs.existsSync(resolvedAsset)) {
        if (cleanSrc.includes('assets/')) {
          const sub = cleanSrc.slice(cleanSrc.indexOf('assets/'));
          resolvedAsset = path.resolve(rootDir, 'docs', sub);
        } else if (cleanSrc.includes('screenshots/')) {
          const sub = cleanSrc.slice(cleanSrc.indexOf('screenshots/'));
          resolvedAsset = path.resolve(rootDir, 'QA', sub);
        }
      }
      cleanSrc = getRelativeUrl(currentDestHtml || 'docs/index.html', path.relative(rootDir, resolvedAsset));
    }
    return `<figure class="my-8 text-center group">
      <div class="relative inline-block w-full max-w-4xl rounded-2xl p-1 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-slate-900/60 shadow-2xl border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300">
        <img src="${cleanSrc}" alt="${escapeHtml(alt)}" loading="eager" class="w-full h-auto rounded-xl mx-auto block" />
      </div>
      <figcaption class="mt-3 text-xs font-mono text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5">
        <span class="text-cyan-400">📷</span> <span>${escapeHtml(alt)}</span>
      </figcaption>
    </figure>`;
  });

  // Inline links: [text](href) and robust double bracket [[text]](href)
  text = text.replace(/\[+([^\]]+)\]+\(([^)]+)\)/g, (_, label, href) => {
    let targetHref = href;
    if (!targetHref.startsWith('http://') && !targetHref.startsWith('https://') && !targetHref.startsWith('mailto:')) {
      if (targetHref.startsWith('#')) {
        targetHref = targetHref.replace(/--+/g, '-');
      } else {
        targetHref = resolveDocLink(targetHref, currentSrcMd, currentDestHtml);
      }
    }
    const isExternal = /^https?:\/\//.test(targetHref);
    const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${targetHref}"${extAttrs} class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium">${label}</a>`;
  });

  // Raw HTML anchor tags inside text
  text = text.replace(/<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, (full, pre, href, post) => {
    if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('#')) {
      const fixedHref = resolveDocLink(href, currentSrcMd, currentDestHtml);
      return `<a ${pre}href="${fixedHref}"${post}>`;
    }
    return full;
  });

  // Inline code: `...`
  text = text.replace(/`([^`]+)`/g, (_, code) => `<code class="font-mono text-xs bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300">${escapeHtml(code)}</code>`);

  // Bold + Italic: ***text***
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="text-slate-100 font-bold"><em>$1</em></strong>');

  // Bold: **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>');

  // Italic: *text*
  text = text.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em class="text-slate-200 italic">$2</em>$3');

  // Restore protected math expressions
  text = text.replace(/@@@MATH_BLOCK_(\d+)@@@/g, (_, idx) => mathStash[Number(idx)]);

  return text;
}

function generateSidebar(currentDocId, destHtml) {
  let html = '';
  for (const cat of NAV_CATEGORIES) {
    html += `<div class="space-y-1">
      <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 py-1 flex items-center gap-1.5">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </div>
      <div class="space-y-0.5">`;
    for (const item of cat.items) {
      const isActive = item.id === currentDocId;
      const target = getRelativeUrl(destHtml, item.href);
      html += `<a href="${target}" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${isActive ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'}">
        <span class="text-xs shrink-0">${item.icon}</span>
        <span class="truncate">${item.title}</span>
      </a>`;
    }
    html += `</div></div>`;
  }
  return html;
}

function generateDropdownMenu(currentDocId, destHtml) {
  let html = '';
  for (const cat of NAV_CATEGORIES) {
    html += `<div class="space-y-1.5">
      <div class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </div>
      <div class="grid grid-cols-1 gap-1">`;
    for (const item of cat.items) {
      const isActive = item.id === currentDocId;
      const target = getRelativeUrl(destHtml, item.href);
      html += `<a href="${target}" class="p-2 rounded-lg transition-colors flex items-start gap-2.5 ${isActive ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300' : 'hover:bg-slate-900 text-slate-300'}">
        <span class="text-sm shrink-0 mt-0.5">${item.icon}</span>
        <div class="min-w-0">
          <div class="font-bold text-xs ${isActive ? 'text-cyan-300' : 'text-slate-200'}">${item.title}</div>
          <div class="text-[10px] text-slate-500 truncate font-sans">${item.desc}</div>
        </div>
      </a>`;
    }
    html += `</div></div>`;
  }
  return html;
}

function renderHtmlTemplate({ title, content, currentDocId, relativeRoot = '', destHtml = 'docs/index.html', srcMd = '' }) {
  const sidebarHtml = generateSidebar(currentDocId, destHtml);
  const dropdownHtml = generateDropdownMenu(currentDocId, destHtml);
  const logoUrl = getRelativeUrl(destHtml, 'docs/assets/logos/logo.jpg');
  const indexUrl = getRelativeUrl(destHtml, 'docs/index.html');
  const simUrl = getRelativeUrl(destHtml, 'index.html');


  return `<!-- 🐠 Siliquarium Open-Ended Digital Life & Silicon Abiogenesis Laboratory • Created by & Copyright © 2026 Ian Ohlander. All rights reserved. -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Siliquarium Master Documentation</title>
  <link rel="icon" type="image/jpeg" href="${logoUrl}">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            bio: {
              bg: '#060911',
              surface: '#0a0e1a',
              panel: '#121829',
              card: '#0f172a',
              border: '#1e2c4a',
              cyan: '#00e5ff',
              amber: '#f59e0b',
              emerald: '#10b981',
              rose: '#f43f5e',
              purple: '#a855f7',
              sky: '#38bdf8'
            }
          },
          fontFamily: {
            mono: ['Cascadia Code', 'Fira Code', 'Consolas', 'monospace'],
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'Cambria', 'serif']
          }
        }
      }
    };
  </script>

  <!-- MathJax Configuration with single-dollar inline math and KaTeX compatibility -->
  <script>
    window.MathJax = {
      loader: { load: ['[tex]/color', '[tex]/configmacros'] },
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
        packages: {'[+]': ['color', 'configmacros', 'ams']},
        macros: {
          color: ['\\\\\\\\textcolor{#1}{#2}', 2]
        }
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      if (window.mermaid) {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#0a0e1a',
            primaryColor: '#00e5ff',
            primaryBorderColor: '#00e5ff',
            primaryTextColor: '#e2e8f0',
            lineColor: '#38bdf8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a'
          }
        });
      }
    });
  </script>

  <style>
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #060911; }
    ::-webkit-scrollbar-thumb { background: #1e2c4a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00e5ff; }

    .card-bio, .card-chemiosmotic {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .card-digital, .card-silicon {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(0, 229, 255, 0.4);
    }
    .card-margin, .card-analogy {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    .card-experiment, .card-paleo {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(168, 85, 247, 0.4);
    }
    .svg-container {
      background: #090e15;
      border: 1px solid #1e2c4a;
      border-radius: 0.75rem;
      padding: 1.25rem;
      overflow-x: auto;
    }

    /* Citation & Note Target Highlighting & Interactive Navigation */
    html { scroll-behavior: auto; }
    li[id^="ref-"], li[id^="note-"], div[id^="note-"] {
      scroll-margin-top: 6rem;
      position: relative;
      transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
    }
    @keyframes refTargetPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.95), 0 0 40px rgba(0, 229, 255, 0.85), inset 0 0 15px rgba(0, 229, 255, 0.35);
        border-color: #22d3ee;
        background-color: rgba(8, 51, 68, 0.95);
        transform: scale(1.02);
      }
      30% {
        box-shadow: 0 0 0 6px rgba(0, 229, 255, 0.45), 0 0 50px rgba(0, 229, 255, 0.7), inset 0 0 20px rgba(0, 229, 255, 0.25);
        border-color: #38bdf8;
        background-color: rgba(8, 51, 68, 0.92);
        transform: scale(1.015);
      }
      100% {
        box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.6), 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 12px rgba(0, 229, 255, 0.15);
        border-color: #00e5ff;
        background-color: rgba(8, 51, 68, 0.88);
        transform: scale(1);
      }
    }
    @keyframes badgePopIn {
      0% { opacity: 0; transform: translateY(6px) scale(0.8); }
      60% { opacity: 1; transform: translateY(-2px) scale(1.06); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    li[id^="ref-"]:target,
    li[id^="ref-"].active-citation-target {
      animation: refTargetPulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      border-color: #22d3ee !important;
      background-color: rgba(8, 51, 68, 0.88) !important;
      z-index: 20;
    }
    li[id^="note-"]:target,
    li[id^="note-"].active-citation-target,
    div[id^="note-"]:target,
    div[id^="note-"].active-citation-target {
      animation: refTargetPulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      border-color: #38bdf8 !important;
      background-color: rgba(8, 51, 68, 0.88) !important;
      z-index: 20;
    }
    li[id^="ref-"]:target::after,
    li[id^="ref-"].active-citation-target::after {
      content: "CITED IN TEXT 🎯";
      position: absolute;
      top: -12px;
      right: 14px;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.06em;
      background: linear-gradient(135deg, #0891b2, #0284c7);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #38bdf8;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.85);
      animation: badgePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: none;
    }
    li[id^="note-"]:target::after,
    li[id^="note-"].active-citation-target::after,
    div[id^="note-"]:target::after,
    div[id^="note-"].active-citation-target::after {
      content: "ANNOTATED NOTE 📝";
      position: absolute;
      top: -12px;
      right: 14px;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.06em;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #38bdf8;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.85);
      animation: badgePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: none;
    }

    /* Highlight reference number [n] */
    li[id^="ref-"]:target > span:first-child,
    li[id^="ref-"].active-citation-target > span:first-child,
    li[id^="note-"]:target > span:first-child,
    li[id^="note-"].active-citation-target > span:first-child {
      color: #38bdf8 !important;
      text-shadow: 0 0 12px rgba(56, 189, 248, 1);
      transform: scale(1.15);
      display: inline-block;
      transition: transform 0.3s ease;
    }

    sup a[href^="#ref-"], sup a[href^="#note-"] {
      transition: all 0.2s ease;
      display: inline-block;
      padding: 0 1px;
    }
    sup a[href^="#ref-"]:hover, sup a[href^="#note-"]:hover {
      color: #ffffff !important;
      text-shadow: 0 0 8px #22d3ee;
      transform: translateY(-1px);
    }
    sup[id^="fnref-"]:target, a[id^="fnref-"]:target,
    sup[id^="cite_ref-"]:target, sup[id^="cite_ref-"].active-backlink-target,
    sup.active-backlink-target {
      animation: backlinkTargetFlash 2.5s ease-out;
      outline: 2px solid #00e5ff;
      outline-offset: 2px;
      border-radius: 4px;
    }
    section[id], div[id], h2[id], h3[id] {
      scroll-margin-top: 5.5rem;
    }
    @keyframes backlinkTargetFlash {
      0% { outline: 3px solid rgba(0, 229, 255, 0.9); outline-offset: 4px; }
      100% { outline: 3px solid transparent; outline-offset: 4px; }
    }
    section[id]:target, div[id]:target {
      animation: backlinkTargetFlash 2.5s ease-out;
    }
  </style>

  <script id="citation-navigator">
    document.addEventListener('DOMContentLoaded', function() {
      function highlightRefCard(targetId) {
        if (!targetId || (!targetId.startsWith('ref-') && !targetId.startsWith('note-'))) return;
        const el = document.getElementById(targetId);
        if (!el) return;
        document.querySelectorAll('li[id^="ref-"].active-citation-target, li[id^="note-"].active-citation-target, div[id^="note-"].active-citation-target').forEach(function(item) {
          item.classList.remove('active-citation-target');
        });
        el.classList.remove('active-citation-target');
        void el.offsetWidth;
        el.classList.add('active-citation-target');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      function scrollToTarget(targetId) {
        if (!targetId) return;
        if (targetId.startsWith('ref-') || targetId.startsWith('note-')) {
          highlightRefCard(targetId);
          return;
        }
        const el = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.remove('active-backlink-target');
          void el.offsetWidth;
          el.classList.add('active-backlink-target');
          setTimeout(() => el.classList.remove('active-backlink-target'), 2500);
        }
      }
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#"]');
        if (link) {
          const href = link.getAttribute('href');
          if (href && href.includes('#')) {
            const hash = href.substring(href.indexOf('#') + 1);
            if (hash.startsWith('ref-') || hash.startsWith('note-')) {
              highlightRefCard(hash);
            } else if (hash.startsWith('cite_ref-') || hash.startsWith('fnref-')) {
              e.preventDefault();
              history.pushState(null, '', '#' + hash);
              scrollToTarget(hash);
            }
          }
        }
      });
      window.addEventListener('hashchange', function() {
        const hash = window.location.hash.replace('#', '');
        if (hash) scrollToTarget(hash);
      });
      function checkInitialHash() {
        if (window.location.hash) {
          const hash = window.location.hash.replace('#', '');
          scrollToTarget(hash);
        }
      }
      checkInitialHash();
      setTimeout(checkInitialHash, 150);
      setTimeout(checkInitialHash, 500);
      window.addEventListener('load', function() {
        setTimeout(checkInitialHash, 100);
      });
      if (window.MathJax && window.MathJax.startup) {
        window.MathJax.startup.promise = window.MathJax.startup.promise.then(function() {
          setTimeout(checkInitialHash, 100);
        });
      }

      // Sidebar & Dropdown Controller
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      const closeBtn = document.getElementById('sidebar-close-btn');
      const sidebar = document.getElementById('doc-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const dropdownBtn = document.getElementById('nav-dropdown-btn');
      const dropdownMenu = document.getElementById('nav-dropdown-menu');

      function openSidebar() {
        if (sidebar && backdrop) {
          sidebar.classList.remove('-translate-x-full');
          backdrop.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }
      function closeSidebar() {
        if (sidebar && backdrop) {
          sidebar.classList.add('-translate-x-full');
          backdrop.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
      if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
      if (backdrop) backdrop.addEventListener('click', closeSidebar);

      if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          dropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function(e) {
          if (!dropdownMenu.contains(e.target) && e.target !== dropdownBtn) {
            dropdownMenu.classList.add('hidden');
          }
        });
      }
    });
  </script>
</head>
<body class="bg-bio-bg text-slate-200 min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black leading-relaxed flex flex-col">

  <!-- MASTER TOP HEADER (Single Row, Zero Horizontal Scrollbars) -->
  <header class="border-b border-slate-800 bg-[#060911]/95 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Mobile/Drawer Toggle Button -->
        <button id="sidebar-toggle-btn" class="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors font-mono text-xs flex items-center gap-1.5 shrink-0" aria-label="Toggle Navigation">
          <span>☰</span>
          <span class="hidden sm:inline">Docs Menu</span>
        </button>

        <nav class="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-0">
          <a href="${indexUrl}" class="hover:text-cyan-400 text-slate-200 flex items-center gap-2 font-bold shrink-0">
            <img src="${logoUrl}" alt="Logo" class="w-6 h-6 rounded border border-cyan-400/50 shadow-sm inline">
            <span class="hidden sm:inline">Siliquarium</span>
            <span class="sm:hidden">Portal</span>
          </a>
          <span class="text-slate-600">/</span>
          <span class="text-cyan-400 font-semibold truncate">${escapeHtml(title)}</span>
        </nav>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Quick Mega-Menu Dropdown Button -->
        <div class="relative">
          <button id="nav-dropdown-btn" class="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-700/60 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm">
            <span>🧭</span>
            <span>Explore Docs</span>
            <span class="text-[10px] text-slate-500">▾</span>
          </button>
          <!-- Mega-Menu Overlay -->
          <div id="nav-dropdown-menu" class="hidden absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl p-4 backdrop-blur-xl z-50 space-y-4 font-mono text-xs max-h-[85vh] overflow-y-auto">
            ${dropdownHtml}
          </div>
        </div>

        <a href="${simUrl}" class="px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded-lg text-xs hover:bg-cyan-900 transition-colors font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span>🚀</span>
          <span class="hidden md:inline">Live Simulator</span>
        </a>
      </div>
    </div>
  </header>

  <!-- MASTER 2-COLUMN VIEWPORT (Sidebar + Content) -->
  <div class="max-w-7xl mx-auto flex-1 w-full flex">
    <!-- LEFT CATEGORIZED SIDEBAR (Desktop Sticky + Mobile Off-Canvas) -->
    <aside id="doc-sidebar" class="fixed lg:sticky top-0 lg:top-[45px] z-50 lg:z-10 h-screen lg:h-[calc(100vh-45px)] w-72 bg-[#060911]/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r border-slate-800/80 p-5 space-y-6 overflow-y-auto shrink-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 lg:hidden">
        <div class="flex items-center gap-2">
          <img src="${logoUrl}" alt="Logo" class="w-5 h-5 rounded border border-cyan-400/50">
          <span class="text-xs font-mono font-bold text-cyan-400">Documentation Index</span>
        </div>
        <button id="sidebar-close-btn" class="text-slate-400 hover:text-white text-base font-mono p-1">✕</button>
      </div>
      ${sidebarHtml}
    </aside>

    <!-- Mobile Drawer Backdrop -->
    <div id="sidebar-backdrop" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 hidden lg:hidden"></div>

    <!-- MAIN CONTENT VIEWPORT (Centered, Responsive, Zero Horizontal Scrollbars) -->
    <main class="flex-1 min-w-0 px-4 sm:px-8 md:px-10 py-8 md:py-10">
      <div class="max-w-4xl mx-auto space-y-8">
        ${content}
      </div>
    </main>
  </div>

  <!-- MASTER FOOTER -->
  <footer class="border-t border-slate-800/80 bg-[#0a0e1a] py-8 text-center text-xs font-mono text-slate-500">
    <div class="max-w-5xl mx-auto px-4 space-y-2">
      <p class="text-slate-400 font-semibold">🐠 Siliquarium: Open-Ended Digital Life &amp; Silicon Abiogenesis Laboratory</p>
      <p>
        <a href="https://github.com/ianohlander/Siliquarium" target="_blank" rel="noopener" class="text-cyan-400 hover:underline">GitHub Repository</a> •
        PolyForm Noncommercial License 1.0.0 •
        Designed for High School STEM, Undergraduate Biophysics &amp; Systems Biology Research
      </p>
    </div>
  </footer>
</body>
</html>`;
}

// Documents to compile
const DOCS_MAP = [
  {
    docId: 'index',
    srcMd: 'docs/PORTAL.md',
    destHtml: 'docs/index.html',
    title: 'Siliquarium Master Curriculum & Documentation Portal',
    relativeRoot: ''
  },
  {
    docId: 'syllabus',
    srcMd: 'docs/CURRICULUM_AND_SYLLABUS.md',
    destHtml: 'docs/CURRICULUM_AND_SYLLABUS.html',
    title: 'Curriculum & Lab Manual: Systems Biology & Silicon Abiogenesis',
    relativeRoot: ''
  },
  {
    docId: 'unit1',
    srcMd: 'docs/curriculum/unit1_prebiotic_threshold.md',
    destHtml: 'docs/curriculum/unit1_prebiotic_threshold.html',
    title: "Unit 1: The Prebiotic Threshold & Howard Pattee's Epistemic Cut",
    relativeRoot: '../'
  },
  {
    docId: 'unit2',
    srcMd: 'docs/curriculum/unit2_logic_of_life.md',
    destHtml: 'docs/curriculum/unit2_logic_of_life.html',
    title: 'Unit 2: The Logic of Life & Primitive Enzymes',
    relativeRoot: '../'
  },
  {
    docId: 'unit3',
    srcMd: 'docs/curriculum/unit3_systems_biology_motifs.md',
    destHtml: 'docs/curriculum/unit3_systems_biology_motifs.html',
    title: 'Unit 3: Systems Biology & Uri Alon Motifs',
    relativeRoot: '../'
  },
  {
    docId: 'unit4',
    srcMd: 'docs/curriculum/unit4_evolutionary_dynamics.md',
    destHtml: 'docs/curriculum/unit4_evolutionary_dynamics.html',
    title: 'Unit 4: Macro-Evolutionary Dynamics & Lenski LTEE',
    relativeRoot: '../'
  },
  {
    docId: 'practicums',
    srcMd: 'docs/curriculum/practicums_lab_manual.md',
    destHtml: 'docs/curriculum/practicums_lab_manual.html',
    title: 'Practicums 1–5: Hands-On Student Laboratory Manual',
    relativeRoot: '../'
  },
  {
    docId: 'full-year-syllabus',
    srcMd: 'docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md',
    destHtml: 'docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.html',
    title: 'Computational Morphogenesis & Gene Regulatory Networks (Full-Year Syllabus)',
    relativeRoot: '../'
  },
  {
    docId: 'pedagogy',
    srcMd: 'docs/PEDAGOGICAL_COMPANION_SUITE.md',
    destHtml: 'docs/PEDAGOGICAL_COMPANION_SUITE.html',
    title: 'Pedagogical Companion Suite: Systems Biology & Silicon Abiogenesis',
    relativeRoot: ''
  },
  {
    docId: 'glossary',
    srcMd: 'docs/companion/glossary.md',
    destHtml: 'docs/companion/glossary.html',
    title: 'Lexicon of Systems Biology & Silicon Abiogenesis',
    relativeRoot: '../'
  },
  {
    docId: 'study-guides',
    srcMd: 'docs/companion/study_guides.md',
    destHtml: 'docs/companion/study_guides.html',
    title: 'Student Study Guides & Equation Decoders',
    relativeRoot: '../'
  },
  {
    docId: 'bibliography',
    srcMd: 'docs/companion/bibliography.md',
    destHtml: 'docs/companion/bibliography.html',
    title: 'Annotated Primary Literature Bibliography',
    relativeRoot: '../'
  },
  {
    docId: 'theory',
    srcMd: 'THEORETICAL_MODEL.md',
    destHtml: 'docs/THEORETICAL_MODEL.html',
    title: 'The Master Theoretical Model',
    relativeRoot: ''
  },
  {
    docId: 'epistemic',
    srcMd: 'docs/EPISTEMIC_FOUNDATIONS.md',
    destHtml: 'docs/EPISTEMIC_FOUNDATIONS.html',
    title: 'Epistemic Foundations & Prebiotic Justifications',
    relativeRoot: ''
  },
  {
    docId: 'translation-matrix',
    srcMd: 'docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.md',
    destHtml: 'docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.html',
    title: 'Reality-to-Simulation Translation Matrix: Grounding Deep-Sea Biophysics into Siliquarium',
    relativeRoot: ''
  },
  {
    docId: 'proto-cognition',
    srcMd: 'docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.md',
    destHtml: 'docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.html',
    title: 'Deep-Sea Proto-Cognition & Hydrothermal Vent Biophysics: Evolutionary Pressures & Systems Biology Motifs',
    relativeRoot: ''
  },
  {
    docId: 'genetic-book',
    srcMd: 'docs/THE_GENETIC_BOOK_OF_THE_DEAD.md',
    destHtml: 'docs/THE_GENETIC_BOOK_OF_THE_DEAD.html',
    title: 'The Genetic Book of the Dead: Environmental Information Injection',
    relativeRoot: ''
  },
  {
    docId: 'design-principles',
    srcMd: 'docs/DOCUMENTATION_DESIGN_PRINCIPLES.md',
    destHtml: 'docs/DOCUMENTATION_DESIGN_PRINCIPLES.html',
    title: 'Documentation Architecture & Design Principles',
    relativeRoot: ''
  },
  {
    docId: 'user-guide',
    srcMd: 'docs/USER_GUIDE.md',
    destHtml: 'docs/USER_GUIDE.html',
    title: 'Siliquarium Comprehensive User Guide & Interactive Lab Tutorial',
    relativeRoot: ''
  },
  {
    docId: 'phase3',
    srcMd: 'docs/PHASE_3_VISUALIZER_GUIDE.md',
    destHtml: 'docs/PHASE_3_VISUALIZER_GUIDE.html',
    title: 'Phase 3 WebGL 3D Seafloor & Circuit Microscope Guide',
    relativeRoot: ''
  },
  {
    docId: 'phase4',
    srcMd: 'docs/PHASE_4_PALEONTOLOGY_GUIDE.md',
    destHtml: 'docs/PHASE_4_PALEONTOLOGY_GUIDE.html',
    title: 'Phase 4 Digital Paleontologist & Lenski Fossil Freezer Guide',
    relativeRoot: ''
  },
  {
    docId: 'morphologies',
    srcMd: 'docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md',
    destHtml: 'docs/MULTICELLULAR_MORPHOLOGY_GUIDE.html',
    title: 'Multicellular Body Topologies & Morphometric Graph Theory Manual',
    relativeRoot: ''
  },
  {
    docId: 'grn-volume',
    srcMd: 'docs/GENE_REGULATORY_NETWORKS_VOLUME.md',
    destHtml: 'docs/GENE_REGULATORY_NETWORKS_VOLUME.html',
    title: 'The Architecture of Gene Regulatory Networks — Master Volume 02',
    relativeRoot: ''
  },
  {
    docId: 'circuit-paleontology',
    srcMd: 'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md',
    destHtml: 'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html',
    title: 'Digital Circuit Paleontology: Master Taxonomy & Field Guide Hub',
    relativeRoot: ''
  },
  {
    docId: 'specimen-01',
    srcMd: 'docs/paleontology/specimen_01_bistable_latch.md',
    destHtml: 'docs/paleontology/specimen_01_bistable_latch.html',
    title: 'Specimen #1: Bistable Memory Latch (SR Flip-Flop) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-02',
    srcMd: 'docs/paleontology/specimen_02_repressilator.md',
    destHtml: 'docs/paleontology/specimen_02_repressilator.html',
    title: 'Specimen #2: Odd-Inverter Ring Oscillator (The Repressilator) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-03',
    srcMd: 'docs/paleontology/specimen_03_coherent_ffl.md',
    destHtml: 'docs/paleontology/specimen_03_coherent_ffl.html',
    title: 'Specimen #3: Coherent Feed-Forward Loop (C-FFL Type 1) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-04',
    srcMd: 'docs/paleontology/specimen_04_incoherent_ffl.md',
    destHtml: 'docs/paleontology/specimen_04_incoherent_ffl.html',
    title: 'Specimen #4: Incoherent Feed-Forward Loop (I-FFL Type 1) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-05',
    srcMd: 'docs/paleontology/specimen_05_negative_autoregulation.md',
    destHtml: 'docs/paleontology/specimen_05_negative_autoregulation.html',
    title: 'Specimen #5: Negative Autoregulation Clamp (NAR) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-06',
    srcMd: 'docs/paleontology/specimen_06_binary_half_adder.md',
    destHtml: 'docs/paleontology/specimen_06_binary_half_adder.html',
    title: 'Specimen #6: 1-Bit Binary Half-Adder — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-07',
    srcMd: 'docs/paleontology/specimen_07_allosteric_inverter.md',
    destHtml: 'docs/paleontology/specimen_07_allosteric_inverter.html',
    title: 'Specimen #7: Allosteric NOT Inverter — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-08',
    srcMd: 'docs/paleontology/specimen_08_endosymbiotic_cassette.md',
    destHtml: 'docs/paleontology/specimen_08_endosymbiotic_cassette.html',
    title: 'Specimen #8: Endosymbiotic Organelle Cassette — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-09',
    srcMd: 'docs/paleontology/specimen_09_syncytial_multicellularity.md',
    destHtml: 'docs/paleontology/specimen_09_syncytial_multicellularity.html',
    title: 'Specimen #9: Syncytial Multicellularity — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-10',
    srcMd: 'docs/paleontology/specimen_10_pelagic_sporulation.md',
    destHtml: 'docs/paleontology/specimen_10_pelagic_sporulation.html',
    title: 'Specimen #10: Pelagic Sporulation & Dispersal Engine — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-11',
    srcMd: 'docs/paleontology/specimen_11_chemiosmotic_autotroph.md',
    destHtml: 'docs/paleontology/specimen_11_chemiosmotic_autotroph.html',
    title: 'Specimen #11: Chemiosmotic Plume Specialist (Apex Autotroph) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-12',
    srcMd: 'docs/paleontology/specimen_12_basalt_lithotroph.md',
    destHtml: 'docs/paleontology/specimen_12_basalt_lithotroph.html',
    title: 'Specimen #12: Deep Subterranean Basalt Lithotroph — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-13',
    srcMd: 'docs/paleontology/specimen_13_trophic_predator.md',
    destHtml: 'docs/paleontology/specimen_13_trophic_predator.html',
    title: 'Specimen #13: Lytic Trophic Predator (Enzymatic Siphon) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-14',
    srcMd: 'docs/paleontology/specimen_14_detrital_scavenger.md',
    destHtml: 'docs/paleontology/specimen_14_detrital_scavenger.html',
    title: 'Specimen #14: Detrital Benthic Scavenger (Necromass Recycler) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-15',
    srcMd: 'docs/paleontology/specimen_15_patriarch_lineage.md',
    destHtml: 'docs/paleontology/specimen_15_patriarch_lineage.html',
    title: 'Specimen #15: Deep Seafloor Patriarch Lineage (Ancient Ancestor) — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-16',
    srcMd: 'docs/paleontology/specimen_16_temporal_derivative_chemotaxis.md',
    destHtml: 'docs/paleontology/specimen_16_temporal_derivative_chemotaxis.html',
    title: 'Specimen #16: Temporal Derivative Chemotaxis Engine — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-17',
    srcMd: 'docs/paleontology/specimen_17_predictive_pavlovian.md',
    destHtml: 'docs/paleontology/specimen_17_predictive_pavlovian.html',
    title: 'Specimen #17: Anticipatory Pavlovian Regulator — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-18',
    srcMd: 'docs/paleontology/specimen_18_entrained_pacemaker.md',
    destHtml: 'docs/paleontology/specimen_18_entrained_pacemaker.html',
    title: 'Specimen #18: Phase-Locked Entrained Pacemaker — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-19',
    srcMd: 'docs/paleontology/specimen_19_steiner_vascular_network.md',
    destHtml: 'docs/paleontology/specimen_19_steiner_vascular_network.html',
    title: 'Specimen #19: Steiner Vascular Transport Network — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'specimen-20',
    srcMd: 'docs/paleontology/specimen_20_cryptobiotic_dormancy_clamp.md',
    destHtml: 'docs/paleontology/specimen_20_cryptobiotic_dormancy_clamp.html',
    title: 'Specimen #20: Cryptobiotic Dormancy Clamp — Field Dossier',
    relativeRoot: '../'
  },
  {
    docId: 'circuit-glossary',
    srcMd: 'docs/CIRCUIT_PALEONTOLOGY_GLOSSARY.md',
    destHtml: 'docs/CIRCUIT_PALEONTOLOGY_GLOSSARY.html',
    title: 'Circuit Paleontology & Silicon Biophysics Glossary',
    relativeRoot: ''
  },
  {
    docId: 'circuit-bibliography',
    srcMd: 'docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md',
    destHtml: 'docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html',
    title: 'Circuit Paleontology Annotated Academic Bibliography',
    relativeRoot: ''
  },
  {
    docId: 'circuit-notes',
    srcMd: 'docs/CIRCUIT_PALEONTOLOGY_NOTES.md',
    destHtml: 'docs/CIRCUIT_PALEONTOLOGY_NOTES.html',
    title: 'Circuit Paleontology Critical Scientific Notes & Epistemic Justifications',
    relativeRoot: ''
  },
  {
    docId: 'phase5',
    srcMd: 'docs/PHASE_5_PELAGIC_SPORES_GUIDE.md',
    destHtml: 'docs/PHASE_5_PELAGIC_SPORES_GUIDE.html',
    title: 'Phase 5 Pelagic Spore Dispersal & God-Suite Guide',
    relativeRoot: ''
  },
  {
    docId: 'phase6',
    srcMd: 'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.md',
    destHtml: 'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html',
    title: 'Phase 6 Multi-Lineage Phylogeny & LTEE Dynamics Guide',
    relativeRoot: ''
  },
  {
    docId: 'brand',
    srcMd: 'docs/BRAND_IDENTITY.md',
    destHtml: 'docs/BRAND_IDENTITY.html',
    title: 'Brand Identity & Visual Philosophy',
    relativeRoot: ''
  },
  {
    docId: 'qa-coding-standards',
    srcMd: 'QA/QA_CODING_STANDARDS_FULL_AUDIT_REPORT.md',
    destHtml: 'QA/QA_CODING_STANDARDS_FULL_AUDIT_REPORT.html',
    title: 'QA Coding Standards Master Audit & Engineering Compliance Report',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-ux-audit',
    srcMd: 'QA/UX_ARCHITECTURE_AUDIT_AND_REDESIGN.md',
    destHtml: 'QA/UX_ARCHITECTURE_AUDIT_AND_REDESIGN.html',
    title: 'Siliquarium UX/UI Architecture Audit & Complete Interface Redesign Specification',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-report',
    srcMd: 'QA/STUDENT_UX_REPORT.md',
    destHtml: 'QA/STUDENT_UX_REPORT.html',
    title: '12th Grade Student QA & Usability Audit Report',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-design-studio',
    srcMd: 'QA/DESIGN_STUDIO_UX_AUDIT.md',
    destHtml: 'QA/DESIGN_STUDIO_UX_AUDIT.html',
    title: 'Design Studio & World Builder UX & Functional Systems Audit',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-naturalist-eval',
    srcMd: 'QA/FIELD_GUIDE_NATURALIST_EVALUATION.md',
    destHtml: 'QA/FIELD_GUIDE_NATURALIST_EVALUATION.html',
    title: 'Naturalist Assistant & Circuit Field Guide Deep Evaluation',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-naive-user',
    srcMd: 'QA/NAIVE_USER_VISUAL_AUDIT.md',
    destHtml: 'QA/NAIVE_USER_VISUAL_AUDIT.html',
    title: 'Naive User Visual & Cognitive Ergonomics Audit',
    relativeRoot: '../docs/'
  },
  {
    docId: 'dev-standards',
    srcMd: 'standards/DEVELOPMENT_STANDARDS.md',
    destHtml: 'standards/DEVELOPMENT_STANDARDS.html',
    title: 'Engineering & Software Architecture Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-standards',
    srcMd: 'standards/QA_AND_TESTING_STANDARDS.md',
    destHtml: 'standards/QA_AND_TESTING_STANDARDS.html',
    title: 'QA & Testing Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'docs-standards',
    srcMd: 'standards/DOCUMENTATION_STANDARDS.md',
    destHtml: 'standards/DOCUMENTATION_STANDARDS.html',
    title: 'Documentation & Pedagogical Standards',
    relativeRoot: '../docs/'
  }
];

function buildDoc(doc) {
  const fullSrc = path.join(rootDir, doc.srcMd);
  const fullDest = path.join(rootDir, doc.destHtml);
  if (!fs.existsSync(fullSrc)) {
    console.warn(`[WARN] Source file missing: ${doc.srcMd}`);
    return;
  }
  const md = fs.readFileSync(fullSrc, 'utf8');
  const bodyHtml = parseMarkdown(md, doc.docId, doc.relativeRoot, doc.srcMd, doc.destHtml);
  const finalHtml = renderHtmlTemplate({
    title: doc.title,
    content: bodyHtml,
    currentDocId: doc.docId,
    relativeRoot: doc.relativeRoot,
    destHtml: doc.destHtml,
    srcMd: doc.srcMd
  });
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  fs.writeFileSync(fullDest, finalHtml, 'utf8');
  console.log(`  ✓ Compiled: ${doc.srcMd} ──► ${doc.destHtml}`);
}

function buildLogoGallery() {
  const logos = [
    { file: 'logo.jpg', name: 'Official Canonical Logo', badge: 'Official', desc: 'Variation 5: The Living Silicon Embryo (Epistemic Cut)' },
    { file: 'nautilus_var5_embryo.jpg', name: 'Variation 5: The Living Silicon Embryo', badge: 'Selected', desc: 'Coiled 1D genome tape at center radiating into logic gate chambers (The Epistemic Cut).' },
    { file: 'nautilus_var4_isometric.jpg', name: 'Variation 4: 3D Benthic Basalt Columns', badge: '3D Matrix', desc: 'Isometric 3D hexagonal basalt columns with etched (q, r, z) foundation.' },
    { file: 'nautilus_var2_thermal.jpg', name: 'Variation 2: Hydrothermal Thermal Core', badge: 'Thermal Glow', desc: 'Volcanic amber thermal glow at center venting into cyan outer chambers.' },
    { file: 'nautilus_var1_minimal.jpg', name: 'Variation 1: Minimalist Hex Shell', badge: 'Minimalist', desc: 'Clean high-contrast flat vector line art on dark obsidian.' },
    { file: 'nautilus_var3_circuit.jpg', name: 'Variation 3: Fibonacci Circuit Ribbon', badge: 'PCB Die', desc: 'Layered golden microchip ribbon with central microprocessor die.' },
    { file: 'logo_option_1_hex_gate.jpg', name: 'Option 1: The Hydrothermal Hex Gate', badge: 'Candidate', desc: 'Basalt hex pore with branching bioluminescent cyan & gold circuits.' },
    { file: 'logo_option_2_silicon_diatom.jpg', name: 'Option 2: The Silicon Diatom', badge: 'Candidate', desc: 'Microscopic diatom shell integrated with AND/OR/NOT logic gates.' },
    { file: 'logo_option_3_vent_spire.jpg', name: 'Option 3: The Abyssal Vent Spire', badge: 'Candidate', desc: 'Volcanic basalt chimney releasing an upward plume of glowing digital pulses.' },
    { file: 'logo_option_4_silicon_nautilus.jpg', name: 'Option 4: The Silicon Nautilus (Original)', badge: 'Candidate', desc: 'Initial nautilus concept with glowing logic traces in hex chambers.' },
    { file: 'logo_option_5_silicon_fish.jpg', name: 'Option 5: The Benthic Circuit Fish', badge: 'Candidate', desc: 'Minimalist geometric fish silhouette formed of circuit traces & logic core.' }
  ];

  let galleryCards = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">';
  for (const l of logos) {
    galleryCards += `
      <div class="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl group">
        <div class="aspect-square bg-black overflow-hidden flex items-center justify-center p-2">
          <a href="assets/logos/${l.file}" target="_blank" class="w-full h-full block">
            <img src="assets/logos/${l.file}" alt="${escapeHtml(l.name)}" class="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" loading="lazy">
          </a>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">${escapeHtml(l.badge)}</span>
              <code class="text-[10px] font-mono text-slate-500">${escapeHtml(l.file)}</code>
            </div>
            <h3 class="text-sm font-mono font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">${escapeHtml(l.name)}</h3>
            <p class="text-xs text-slate-400 font-sans leading-relaxed">${escapeHtml(l.desc)}</p>
          </div>
          <a href="assets/logos/${l.file}" download="${l.file}" class="w-full text-center px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:border-cyan-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all block">⬇ Download Asset</a>
        </div>
      </div>
    `;
  }
  galleryCards += '</div>';

  const content = `
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🖼️</span>
        <div>
          <span class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Brand Identity Asset Repository</span>
          <h1 class="text-2xl md:text-3xl font-mono font-extrabold text-slate-100">Siliquarium Brand &amp; Logo Gallery</h1>
        </div>
      </div>
      <p class="text-sm text-slate-400 leading-relaxed font-sans max-w-3xl">
        Complete production asset gallery featuring the official canonical brand mark, the 5 Golden Spiral Nautilus variations, and the original prebiotic candidate suite.
      </p>
    </div>
    ${galleryCards}
  `;

  const html = renderHtmlTemplate({
    title: 'Brand & Logo Gallery',
    content,
    currentDocId: 'logos',
    relativeRoot: '',
    destHtml: 'docs/logos.html',
    srcMd: 'docs/logos.html'
  });

  fs.writeFileSync(path.join(rootDir, 'docs/logos.html'), html, 'utf8');
  console.log(`  ✓ Compiled: docs/logos.html (Interactive Logo Gallery)`);

  const rootLogosHtml = renderHtmlTemplate({
    title: 'Brand & Logo Gallery',
    content: content.replace(/assets\/logos\//g, ''),
    currentDocId: 'logos',
    relativeRoot: '../docs/',
    destHtml: 'logos/index.html',
    srcMd: 'logos/index.html'
  });
  fs.writeFileSync(path.join(rootDir, 'logos/index.html'), rootLogosHtml, 'utf8');
  console.log(`  ✓ Compiled: logos/index.html`);
}

console.log('=========================================');
console.log('🐠 Siliquarium Enterprise HTML Docs Compiler');
console.log('=========================================');

for (const doc of DOCS_MAP) {
  buildDoc(doc);
}

buildLogoGallery();

console.log('\n🎉 ALL DOCUMENTATION COMPILED WITH SIDEBAR & DROPDOWN LAYOUT SUCCESSFULLY!');
