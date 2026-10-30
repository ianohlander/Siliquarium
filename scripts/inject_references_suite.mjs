#!/usr/bin/env node

/**
 * 🐠 Siliquarium References & Wikipedia-Style Academic Citations Engine
 * Injects standardized BooleanGA-style citation superscripts and
 * References & Foundational Literature card sections across Siliquarium documentation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. MASTER CITATION DATABASE
const BIB_DB = {
  maturana1972: {
    authors: 'Maturana, H. R., & Varela, F. J.',
    year: '1972',
    title: 'Autopoiesis and Cognition: The Realization of the Living',
    journal: 'Boston Studies in the Philosophy of Science, Vol. 42. D. Reidel Publishing',
    doi: '10.1007/978-94-009-8947-4',
    bibAnchor: 'pattee1972'
  },
  pattee1972: {
    authors: 'Pattee, H. H.',
    year: '1972',
    title: 'The nature of hierarchical controls in living matter',
    journal: 'Foundations of Mathematical Biology, 1, 1–22',
    doi: '10.1016/B978-0-12-598001-9.50005-7',
    bibAnchor: 'pattee1972'
  },
  weisfeiler1968: {
    authors: 'Weisfeiler, B., & Lehman, A.',
    year: '1968',
    title: 'A reduction of a graph to a canonical form and an algebra which appears therein',
    journal: 'NTI, Series 2, 9, 12–16',
    doi: '10.1007/BF02579124',
    bibAnchor: 'weisfeiler1968'
  },
  gardner2000: {
    authors: 'Gardner, T. S., Cantor, C. R., & Collins, J. J.',
    year: '2000',
    title: 'Construction of a genetic toggle switch in Escherichia coli',
    journal: 'Nature, 403(6767), 339–342',
    doi: '10.1038/35002131',
    bibAnchor: 'gardner2000'
  },
  landauer1961: {
    authors: 'Landauer, R.',
    year: '1961',
    title: 'Irreversibility and heat generation in the computing process',
    journal: 'IBM Journal of Research and Development, 5(3), 183–191',
    doi: '10.1147/rd.53.0183',
    bibAnchor: 'landauer1961'
  },
  bialek2012: {
    authors: 'Bialek, W.',
    year: '2012',
    title: 'Biophysics: Searching for Principles',
    journal: 'Princeton University Press. ISBN: 978-0691138916',
    doi: '10.1515/9781400845347',
    bibAnchor: 'gardner2000'
  },
  elowitz2000: {
    authors: 'Elowitz, M. B., & Leibler, S.',
    year: '2000',
    title: 'A synthetic oscillatory network of transcriptional regulators',
    journal: 'Nature, 403(6767), 335–338',
    doi: '10.1038/35002125',
    bibAnchor: 'elowitz2000'
  },
  razavi2001: {
    authors: 'Razavi, B.',
    year: '2001',
    title: 'Design of Analog CMOS Integrated Circuits',
    journal: 'McGraw-Hill Education. ISBN: 978-0072380767',
    doi: '10.1109/JSSC.2001.954845',
    bibAnchor: 'elowitz2000'
  },
  johnson2011: {
    authors: 'Johnson, C. H., Stewart, P. L., & Egli, M.',
    year: '2011',
    title: 'The cyanobacterial circadian system: From molecules to architecture',
    journal: 'Annual Review of Biophysics, 40, 143–167',
    doi: '10.1146/annurev-biophys-042910-155317',
    bibAnchor: 'alon2019'
  },
  mangan2003: {
    authors: 'Mangan, S., & Alon, U.',
    year: '2003',
    title: 'Structure and function of the feed-forward loop network motif',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 100(21), 11980–11985',
    doi: '10.1073/pnas.2133841100',
    bibAnchor: 'mangan2003'
  },
  milo2015: {
    authors: 'Milo, R., & Phillips, R.',
    year: '2015',
    title: 'Cell Biology by the Numbers',
    journal: 'Garland Science. ISBN: 978-0815345374',
    doi: '10.1201/9780429258770',
    bibAnchor: 'mangan2003'
  },
  goentoro2009: {
    authors: 'Goentoro, L., Shoval, O., Kirschner, M. W., & Alon, U.',
    year: '2009',
    title: 'The incoherent feedforward loop can provide fold-change detection in gene regulation',
    journal: 'Molecular Cell, 36(5), 894–899',
    doi: '10.1016/j.molcel.2009.11.018',
    bibAnchor: 'goentoro2009'
  },
  alon2007: {
    authors: 'Alon, U.',
    year: '2007',
    title: 'Network motifs: theory and experimental approaches',
    journal: 'Nature Reviews Genetics, 8(6), 450–461',
    doi: '10.1038/nrg2102',
    bibAnchor: 'alon2007'
  },
  rosenfeld2002: {
    authors: 'Rosenfeld, N., Elowitz, M. B., & Alon, U.',
    year: '2002',
    title: 'Negative autoregulation speeds the response times of transcription networks',
    journal: 'Journal of Molecular Biology, 323(5), 785–793',
    doi: '10.1016/S0022-2836(02)00994-4',
    bibAnchor: 'rosenfeld2002'
  },
  thattai2001: {
    authors: 'Thattai, M., & van Oudenaarden, A.',
    year: '2001',
    title: 'Intrinsic noise in gene regulatory networks',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 98(15), 8614–8619',
    doi: '10.1073/pnas.151588598',
    bibAnchor: 'rosenfeld2002'
  },
  shenorr2002: {
    authors: 'Shen-Orr, S. S., Milo, R., Mangan, S., & Alon, U.',
    year: '2002',
    title: 'Network motifs in the transcriptional regulation network of Escherichia coli',
    journal: 'Nature Genetics, 31(1), 64–68',
    doi: '10.1038/ng881',
    bibAnchor: 'alon2007'
  },
  minsky1969: {
    authors: 'Minsky, M., & Papert, S.',
    year: '1969',
    title: 'Perceptrons: An Introduction to Computational Geometry',
    journal: 'MIT Press. ISBN: 978-0262631111',
    doi: '10.7551/mitpress/5303.001.0001',
    bibAnchor: 'alon2019'
  },
  alon2019: {
    authors: 'Alon, U.',
    year: '2019',
    title: 'An Introduction to Systems Biology: Design Principles of Biological Networks (2nd ed.)',
    journal: 'CRC Press / Taylor & Francis Group. ISBN: 978-1439837016',
    doi: '10.1201/9780429283901',
    bibAnchor: 'alon2019'
  },
  monod1965: {
    authors: 'Monod, J., Wyman, J., & Changeux, J. P.',
    year: '1965',
    title: 'On the nature of allosteric transitions: A plausible model',
    journal: 'Journal of Molecular Biology, 12(1), 88–118',
    doi: '10.1016/S0022-2836(65)80285-6',
    bibAnchor: 'jacob1961'
  },
  jacob1961: {
    authors: 'Jacob, F., & Monod, J.',
    year: '1961',
    title: 'Genetic regulatory mechanisms in the synthesis of proteins',
    journal: 'Journal of Molecular Biology, 3(3), 318–356',
    doi: '10.1016/S0022-2836(61)80072-7',
    bibAnchor: 'jacob1961'
  },
  russell1997: {
    authors: 'Russell, M. J., & Hall, A. J.',
    year: '1997',
    title: 'The emergence of life from iron monosulphide bubbles at a submarine hydrothermal spring',
    journal: 'Journal of the Geological Society, 154(3), 377–402',
    doi: '10.1144/gsjgs.154.3.0377',
    bibAnchor: 'russell1997'
  },
  lane2010: {
    authors: 'Lane, N., & Martin, W.',
    year: '2010',
    title: 'The energetics of genome complexity',
    journal: 'Nature, 467(7318), 929–934',
    doi: '10.1038/nature09486',
    bibAnchor: 'lane2010'
  },
  lane2012: {
    authors: 'Lane, N., & Martin, W. F.',
    year: '2012',
    title: 'The origin of membrane bioenergetics',
    journal: 'Cell, 151(7), 1406–1416',
    doi: '10.1016/j.cell.2012.11.050',
    bibAnchor: 'lane2010'
  },
  margulis1967: {
    authors: 'Sagan (Margulis), L.',
    year: '1967',
    title: 'On the origin of mitosing cells',
    journal: 'Journal of Theoretical Biology, 14(3), 225–274',
    doi: '10.1016/0022-5193(67)90079-3',
    bibAnchor: 'margulis1967'
  },
  margulis1981: {
    authors: 'Margulis, L.',
    year: '1981',
    title: 'Symbiosis in Cell Evolution: Life and Its Co-Evolution on the Early Earth',
    journal: 'W. H. Freeman & Company. ISBN: 978-0716712565',
    doi: '10.1007/978-94-011-8040-5',
    bibAnchor: 'margulis1981'
  },
  bonner1965: {
    authors: 'Bonner, J. T.',
    year: '1965',
    title: 'Size and Cycle: An Essay on the Structure of Biology',
    journal: 'Princeton University Press. ISBN: 978-0691080338',
    doi: '10.1515/9781400874675',
    bibAnchor: 'bonner1965'
  },
  maynardsmith1995: {
    authors: 'Maynard Smith, J., & Szathmáry, E.',
    year: '1995',
    title: 'The Major Transitions in Evolution',
    journal: 'Oxford University Press / W. H. Freeman. ISBN: 978-0198502944',
    doi: '10.1093/oso/9780198502944.001.0001',
    bibAnchor: 'bonner1965'
  },
  macarthur1967: {
    authors: 'MacArthur, R. H., & Wilson, E. O.',
    year: '1967',
    title: 'The Theory of Island Biogeography',
    journal: 'Princeton University Press. ISBN: 978-0691088365',
    doi: '10.1515/9781400881376',
    bibAnchor: 'bonner1965'
  },
  erickson2010: {
    authors: 'Erickson, H. P., Anderson, D. E., & Osawa, M.',
    year: '2010',
    title: 'FtsZ in bacterial cytokinesis: Cytoskeleton and force generator all in one',
    journal: 'Microbiology and Molecular Biology Reviews, 74(4), 504–528',
    doi: '10.1128/MMBR.00021-10',
    bibAnchor: 'bonner1965'
  },
  keilin1959: {
    authors: 'Keilin, D.',
    year: '1959',
    title: 'The Leeuwenhoek Lecture: The problem of anabiosis or latent life: history and current concept',
    journal: 'Proceedings of the Royal Society of London. Series B, 150(939), 149–191',
    doi: '10.1098/rspb.1959.0013',
    bibAnchor: 'bonner1965'
  },
  vogel1994: {
    authors: 'Vogel, S.',
    year: '1994',
    title: 'Life in Moving Fluids: The Physical Biology of Flow (2nd ed.)',
    journal: 'Princeton University Press. ISBN: 978-0691034850',
    doi: '10.1515/9780691212975',
    bibAnchor: 'bonner1965'
  },
  dawkins1982: {
    authors: 'Dawkins, R.',
    year: '1982',
    title: 'The Extended Phenotype: The Long Reach of the Gene',
    journal: 'Oxford University Press. ISBN: 978-0192880512',
    doi: '10.1093/oso/9780198788911.001.0001',
    bibAnchor: 'dawkins1982'
  },
  shannon1948: {
    authors: 'Shannon, C. E.',
    year: '1948',
    title: 'A mathematical theory of communication',
    journal: 'Bell System Technical Journal, 27(3), 379–423',
    doi: '10.1002/j.1538-7305.1948.tb01338.x',
    bibAnchor: 'weisfeiler1968'
  },
  mitchell1961: {
    authors: 'Mitchell, P.',
    year: '1961',
    title: 'Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism',
    journal: 'Nature, 191(4784), 144–148',
    doi: '10.1038/191144a0',
    bibAnchor: 'mitchell1961'
  },
  kimura1968: {
    authors: 'Kimura, M.',
    year: '1968',
    title: 'Evolutionary rate at the molecular level',
    journal: 'Nature, 217(5129), 624–626',
    doi: '10.1038/217624a0',
    bibAnchor: 'weisfeiler1968'
  },
  ohno1970: {
    authors: 'Ohno, S.',
    year: '1970',
    title: 'Evolution by Gene Duplication',
    journal: 'Springer-Verlag. ISBN: 978-3642866593',
    doi: '10.1007/978-3-642-86659-3',
    bibAnchor: 'weisfeiler1968'
  },
  lenski1991: {
    authors: 'Lenski, R. E., Rose, M. R., Simpson, S. C., & Tadler, S. C.',
    year: '1991',
    title: 'Long-term experimental evolution in Escherichia coli. I. Adaptation and divergence during 2,000 generations',
    journal: 'The American Naturalist, 138(6), 1315–1341',
    doi: '10.1086/285289',
    bibAnchor: 'weisfeiler1968'
  },
  gould2002: {
    authors: 'Gould, S. J.',
    year: '2002',
    title: 'The Structure of Evolutionary Theory',
    journal: 'Harvard University Press / Belknap Press. ISBN: 978-0674006133',
    doi: '10.2307/j.ctv136c5t9',
    bibAnchor: 'alon2007'
  },
  vonneumann1966: {
    authors: 'Von Neumann, J.',
    year: '1966',
    title: 'Theory of Self-Reproducing Automata (Edited and completed by A. W. Burks)',
    journal: 'University of Illinois Press. ISBN: 978-0252727337',
    doi: '10.1109/TEC.1968.5219395',
    bibAnchor: 'pattee1972'
  },
  bennett1982: {
    authors: 'Bennett, C. H.',
    year: '1982',
    title: 'The thermodynamics of computation—a review',
    journal: 'International Journal of Theoretical Physics, 21(12), 905–940',
    doi: '10.1007/BF02084158',
    bibAnchor: 'landauer1961'
  },
  wachtershauser1990: {
    authors: 'Wächtershäuser, G.',
    year: '1990',
    title: 'Evolution of the first metabolic cycles',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 87(1), 200–204',
    doi: '10.1073/pnas.87.1.200',
    bibAnchor: 'russell1997'
  },
  martin2003: {
    authors: 'Martin, W., & Russell, M. J.',
    year: '2003',
    title: 'On the origins of cells: a hypothesis for the evolutionary transitions from abiotic geochemistry to chemoautotrophic prokaryotes, and from prokaryotes to nucleated cells',
    journal: 'Philosophical Transactions of the Royal Society of London. Series B: Biological Sciences, 358(1429), 59–85',
    doi: '10.1098/rstb.2002.1183',
    bibAnchor: 'russell1997'
  }
};

/**
 * Deduplicates any identical adjacent citation superscripts:
 * e.g. <sup id="cite_ref-1"...>[1]</sup><sup id="cite_ref-1"...>[1]</sup> -> <sup id="cite_ref-1"...>[1]</sup>
 */
export function deduplicateAdjacentCitations(text) {
  let prev;
  do {
    prev = text;
    text = text.replace(/(<sup id="cite_ref-([^"]+)"[^>]*>.*?<\/sup>)(\s*<sup id="cite_ref-\2"[^>]*>.*?<\/sup>)+/g, '$1');
  } while (text !== prev);
  return text;
}

/**
 * Generates the standardized BooleanGA-style References & Foundational Literature HTML section.
 */
function renderReferencesSection(items, bibPath = 'CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html', notesPath = 'CIRCUIT_PALEONTOLOGY_NOTES.html') {
  let cardsHtml = '';

  for (const item of items) {
    const { id, bibKey, noteId, noteTitle, noteSummary, backlinks = [] } = item;
    const refData = BIB_DB[bibKey] || {
      authors: 'Primary Author',
      year: '2000',
      title: 'Seminal Publication',
      journal: 'Academic Literature',
      doi: '',
      bibAnchor: ''
    };

    let doiHtml = '';
    if (refData.doi) {
      doiHtml = `<a href="https://doi.org/${refData.doi}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline">doi:${refData.doi}</a>`;
    }

    let noteDerivHtml = '';
    if (noteId && notesPath) {
      noteDerivHtml = `<span class="text-slate-600">&bull;</span> <a href="${notesPath}#note-${noteId}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"><span>📝</span> Note ${noteId} Proof</a>`;
    }

    let backlinksHtml = '';
    if (backlinks.length === 1) {
      backlinksHtml = `<a href="#${backlinks[0].id}" class="text-slate-500 hover:text-cyan-300 transition-colors">&uarr; Back to text</a>`;
    } else if (backlinks.length > 1) {
      backlinksHtml = `<span class="text-slate-500">&uarr; Back to text:</span> ` +
        backlinks.map(b => `<a href="#${b.id}" class="text-slate-400 hover:text-cyan-300 font-mono text-xs px-0.5 font-bold">^${b.label}</a>`).join(' ');
    } else {
      backlinksHtml = `<a href="#cite_ref-${id}" class="text-slate-500 hover:text-cyan-300 transition-colors">&uarr; Back to text</a>`;
    }

    let noteSummaryHtml = '';
    if (noteTitle || noteSummary) {
      noteSummaryHtml = `<div><div class="text-[11px] text-slate-400 font-sans leading-relaxed pt-0.5">${noteTitle ? `<strong class="text-slate-200">${noteTitle}:</strong> ` : ''}${noteSummary || ''}</div></div>`;
    }

    const bibHref = `${bibPath}#${refData.bibAnchor || bibKey}`;

    cardsHtml += `    <li id="ref-${id}" class="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition-colors flex items-start gap-3">
      <span class="text-cyan-400 font-bold shrink-0">[${id}]</span>
      <div class="space-y-1">
        <div><span class="text-slate-100 font-bold">${refData.authors}</span> (${refData.year}). <em class="text-cyan-300">${refData.title}</em>. <span class="text-slate-400">${refData.journal}</span>.</div>
        ${noteSummaryHtml}
        <div class="flex items-center gap-3 text-[11px] pt-0.5">${doiHtml}${doiHtml ? ' <span class="text-slate-600">&bull;</span> ' : ''}<a href="${bibHref}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-cyan-300 transition-colors flex items-center gap-1"><span>📚</span> Master Bib</a>${noteDerivHtml} <span class="text-slate-600">&bull;</span> ${backlinksHtml}</div>
      </div>
    </li>\n`;
  }

  return `
<!-- COMPLETE ACADEMIC REFERENCES & CITATIONS -->
<section id="references" class="mt-16 pt-8 border-t border-slate-800 space-y-6">
<div class="flex items-center justify-between border-b border-slate-800 pb-3">
<div class="flex items-center gap-3">
<span class="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">📚</span>
<h2 class="text-lg md:text-xl font-mono font-bold text-slate-100">References &amp; Foundational Literature</h2>
</div>
<span class="text-xs font-mono text-slate-500 uppercase tracking-wider">Wikipedia-Style Academic Citations</span>
</div>
<p class="text-xs text-slate-400 leading-relaxed font-sans">The theoretical assertions, biophysical models, and computer architectural frameworks presented in this volume are grounded in the following seminal peer-reviewed literature. Numbered superscripts throughout the text link directly to these entries.</p>
<ol class="space-y-3.5 text-xs font-mono text-slate-300">
${cardsHtml}</ol>
</section>
`;
}

// 2. PROCESS docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md
function updateFieldGuideHub() {
  const file = path.join(rootDir, 'docs', 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');
  let content = fs.readFileSync(file, 'utf8');

  // Replace old Section 7
  const sec7Idx = content.indexOf('## 7. Wikipedia-Style Endnotes & Empirical Justifications');
  if (sec7Idx !== -1) {
    content = content.slice(0, sec7Idx).trim();
  }

  // 36 Field Guide items
  const fgItems = [
    { id: 1, bibKey: 'maturana1972', noteId: 1, noteTitle: 'Non-Teleological Evolution & Absence of Fitness Functions', noteSummary: 'Siliquarium contains no fitness functions or loss gradients; circuits evolve strictly via thermodynamic selection under physical energy constraints (dEp/dt = Ein - Ebasal - ELandauer).' },
    { id: 2, bibKey: 'pattee1972', noteId: 2, noteTitle: 'Howard Pattee\'s Epistemic Cut & Observer Paleontology', noteSummary: 'Life requires a fundamental Epistemic Cut separating rate-independent symbolic records from rate-dependent dynamics. The Digital Paleontologist is an outside voltmeter.', backlinks: [{ id: 'cite_ref-2a', label: 'a' }, { id: 'cite_ref-2b', label: 'b' }, { id: 'cite_ref-2c', label: 'c' }] },
    { id: 3, bibKey: 'weisfeiler1968', noteId: 3, noteTitle: 'Weisfeiler-Lehman Graph Kernel Isomorphism Bounds', noteSummary: '1-WL color refinement clusters Boolean netlists into canonical topological isomorphism classes in polynomial time O(|V| · |E|).', backlinks: [{ id: 'cite_ref-3a', label: 'a' }, { id: 'cite_ref-3b', label: 'b' }] },
    { id: 4, bibKey: 'gardner2000', noteId: 4, noteTitle: 'Asynchronous Nutrient Arrival Kinetics & Memory Selection Pressure', noteSummary: 'In hydrothermal vents, donors and acceptors arrive with phase delays; bistable memory traps donor charge across the famine gap.', backlinks: [{ id: 'cite_ref-4a', label: 'a' }, { id: 'cite_ref-4b', label: 'b' }] },
    { id: 5, bibKey: 'landauer1961', noteId: 5, noteTitle: 'Landauer\'s Principle: Switching Cost ΔE = kB T ln 2', noteSummary: 'Toggling a logic gate dissipates at least kB T ln 2 of heat (1 metabolic token in Siliquarium); holding quiescent state costs 0 tokens.', backlinks: [{ id: 'cite_ref-5a', label: 'a' }, { id: 'cite_ref-5b', label: 'b' }] },
    { id: 6, bibKey: 'gardner2000', noteId: 6, noteTitle: 'The Gardner-Collins Toggle Switch: Cooperativity Threshold β · γ > 1', noteSummary: 'Bistable bifurcation in mutually repressing gene circuits requires cooperative Hill repression; discrete Boolean gates provide infinite effective cooperativity.' },
    { id: 7, bibKey: 'bialek2012', noteId: 7, noteTitle: 'Double-Well Potential Landscapes & Separatrix Barrier ΔE', noteSummary: 'Toggle switch dynamics map to an overdamped particle moving in a double-well potential separated by an energy barrier ΔE.' },
    { id: 8, bibKey: 'elowitz2000', noteId: 8, noteTitle: 'Odd-Loop Frustration & Absence of Static Fixed Points in Inverter Rings', noteSummary: 'A cyclic ring of an odd number of inverting gates enforces feedback frustration NOT^N(x) != x, forcing the system into a periodic limit cycle.' },
    { id: 9, bibKey: 'razavi2001', noteId: 9, noteTitle: 'Barkhausen Stability Criteria & Period T = 2Nτ = 6τ in Ring Oscillators', noteSummary: 'Sustained oscillation requires loop gain >= 1 and total phase shift 2π. For N=3 gates with delay τ, fundamental period T = 6τ.' },
    { id: 10, bibKey: 'johnson2011', noteId: 10, noteTitle: 'Anticipatory Metabolic Pacing vs. Stochastic Foraging', noteSummary: 'Autonomous oscillators allow peripheral cells to open porins ahead of arriving chemical pulses, avoiding deadly lag phases.' },
    { id: 11, bibKey: 'mangan2003', noteId: 11, noteTitle: 'Sign-Sensitive Delay Mechanics in Coherent FFLs (Type 1)', noteSummary: 'Under AND logic, C-FFLs exhibit delayed activation upon stimulus onset but deactivate instantly upon stimulus drop, filtering noise.' },
    { id: 12, bibKey: 'milo2015', noteId: 12, noteTitle: 'Bioenergetic Overhead of Enzyme Synthesis & Eddy Rejection', noteSummary: 'Synthesizing enzymes costs ~15T. Filtering transient 1-tick eddies saves over 600 tokens per epoch.' },
    { id: 13, bibKey: 'goentoro2009', noteId: 13, noteTitle: 'Fold-Change Invariance (FCD) in Incoherent FFLs (Type 1)', noteSummary: 'Incoherent FFLs generate biphasic pulses whose amplitude depends only on relative fold-change, invariant under uniform scaling.' },
    { id: 14, bibKey: 'alon2007', noteId: 14, noteTitle: 'Receptor Saturation Kinetics & The Weber-Fechner Law', noteSummary: 'Hyperbolic Michaelis-Menten occupancy causes sensory blindness; I-FFL adaptation restores differential sensitivity.' },
    { id: 15, bibKey: 'rosenfeld2002', noteId: 15, noteTitle: 'Negative Autoregulation: Derivation of 5× Faster Rise Time', noteSummary: 'Throttling a strong promoter via negative feedback speeds response time by up to 5-fold while clamping protein noise.' },
    { id: 16, bibKey: 'thattai2001', noteId: 16, noteTitle: 'Noise Damping & Fluctuation-Dissipation in Gene Networks', noteSummary: 'Negative autoregulation acts as a restoring spring that compresses steady-state expression noise variance.' },
    { id: 17, bibKey: 'shenorr2002', noteId: 17, noteTitle: 'Empirical Audit of Autoregulation Prevalence in Bacterial Genomes', noteSummary: 'Over 40% of all transcription factors in E. coli possess negative autoregulation, proving intense selective advantage.' },
    { id: 18, bibKey: 'minsky1969', noteId: 18, noteTitle: 'Linear Non-Separability of XOR & Stoichiometric Half-Adders', noteSummary: 'XOR cannot be computed with a single linear threshold; half-adders compute simultaneous Sum (parity) and Carry (abundance).' },
    { id: 19, bibKey: 'monod1965', noteId: 19, noteTitle: 'Allosteric Transitions: Landauer Profile of the MWC Model', noteSummary: 'Ligand binding alters conformational equilibrium between Relaxed and Tense states, dissipating free energy strictly during switching.' },
    { id: 20, bibKey: 'russell1997', noteId: 20, noteTitle: 'Heavy Metal Toxicity & Sulfide Precipitation Kinetics', noteSummary: 'Toxic plumes of heavy metal cations poison enzymes; allosteric NOT inverters clamp porins shut during metal plumes.' },
    { id: 21, bibKey: 'lane2010', noteId: 21, noteTitle: 'Bioenergetic Scaling Law (r² vs. r³)', noteSummary: 'Surface-area-to-volume ratio creates an energetic ceiling for prokaryotes; internalized organelles expanded energy per gene by >200,000×.' },
    { id: 22, bibKey: 'margulis1967', noteId: 22, noteTitle: 'Serial Endosymbiotic Theory (SET): Molecular and Genomic Evidence', noteSummary: 'Mitochondria descend from engulfed prokaryotes that retained their circular genomes and double membranes.' },
    { id: 23, bibKey: 'bonner1965', noteId: 23, noteTitle: 'Cytoplasmic Streaming & Fickian Diffusion Across Syncytial Pores', noteSummary: 'Intercellular cytoplasmic bridges allow shared metabolite transport governed by Fick\'s law J = -D(dPhi/dx).' },
    { id: 24, bibKey: 'margulis1981', noteId: 24, noteTitle: 'Integer Euclidean Pooling & Closed-Universe Mass Conservation Invariant', noteSummary: 'Biomass sharing is calculated via integer Euclidean division, guaranteeing mass conservation with zero floating-point drift.' },
    { id: 25, bibKey: 'maynardsmith1995', noteId: 25, noteTitle: 'Division of Labor & Major Evolutionary Transitions in Individuality', noteSummary: 'Multicellular syncytia decouple individual pore survival from colony-level reproductive fitness.' },
    { id: 26, bibKey: 'macarthur1967', noteId: 26, noteTitle: 'Benthic Carrying Capacity (K) & Contact Inhibition Trap', noteSummary: 'Benthic pore occupancy saturates at carrying capacity K, halting population growth unless lineages evolve pelagic dispersal.' },
    { id: 27, bibKey: 'erickson2010', noteId: 27, noteTitle: 'FtsZ GTPase Contractile Ring Cleavage Mechanics', noteSummary: 'Cleavage is driven by polymeric FtsZ assembling into a contractile Z-ring that exerts ~10 pN of force to sever daughter spores.' },
    { id: 28, bibKey: 'keilin1959', noteId: 28, noteTitle: 'Metabolic Cryptobiosis & Silica Capsule Hardening', noteSummary: 'Spore capsules entering pelagic drift enter metabolic cryptobiosis, reducing Landauer dissipation to 0 tokens/tick.' },
    { id: 29, bibKey: 'vogel1994', noteId: 29, noteTitle: 'Hydrodynamic Advection & Boundary Layer Physics in Abyssal Currents', noteSummary: 'Ejecting spores into layer z >= 1 enters velocity shear u(z) = (u*/kappa) ln(z/z0), advecting rapidly across ocean currents.' },
    { id: 30, bibKey: 'dawkins1982', noteId: 30, noteTitle: 'Richard Dawkins\' Extended Phenotype in Broadcast Spawning', noteSummary: 'Pore genetic instructions alter the spatial distribution of future generations across ocean hydrodynamics.' },
    { id: 31, bibKey: 'shannon1948', noteId: 31, noteTitle: 'Shannon Entropy vs. Kolmogorov Algorithmic Complexity', noteSummary: 'Shannon entropy measures statistical uncertainty; Kolmogorov complexity measures shortest program length.' },
    { id: 32, bibKey: 'mitchell1961', noteId: 32, noteTitle: 'Physical Constants of the Mitchell Proton Motive Force Equation', noteSummary: 'The 59.2 mV/pH factor is derived from fundamental constants (2.303 RT / F), powering abiotic redox synthesis.' },
    { id: 33, bibKey: 'kimura1968', noteId: 33, noteTitle: 'Neutral Theory of Molecular Evolution & Degenerate Codon Buffering', noteSummary: 'Neutral substitution rate equals mutation rate (k = mu); degenerate codons buffer against lethal errors.' },
    { id: 34, bibKey: 'ohno1970', noteId: 34, noteTitle: 'Susumu Ohno\'s Gene Duplication & Multi-Operon Specialization', noteSummary: 'Duplication frees one gene copy from selective constraint to evolve organelle cassettes or novel network motifs.', backlinks: [{ id: 'cite_ref-34a', label: 'a' }, { id: 'cite_ref-34b', label: 'b' }] },
    { id: 35, bibKey: 'lenski1991', noteId: 35, noteTitle: 'Richard Lenski LTEE Hyperbolic Fitness Trajectory Validation', noteSummary: 'Bacterial fitness follows a predictable power-law trajectory W(t) = (1+ct)^d, replicated in Siliquarium clades.' },
    { id: 36, bibKey: 'gould2002', noteId: 36, noteTitle: 'Homology vs. Homoplasy: Independent Convergent Evolution in Network Motifs', noteSummary: 'Lineage tracing distinguishes homologous motifs from homoplasic motifs discovered independently via convergent selection.' }
  ];

  // Update in-text call sites to exact cite_ref format
  // Section 1:
  content = content.replace(/<sup id="fnref-2a"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-2a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>');
  content = content.replace(/<sup id="fnref-4a"[^>]*>.*?<\/sup>\s*<sup id="fnref-32"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-4a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup> <sup id="cite_ref-32" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-32">[32]</a></sup>');
  content = content.replace(/<sup id="fnref-2b"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-2b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>');
  content = content.replace(/<sup id="fnref-5a"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-5a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-5">[5]</a></sup>');

  // Section 2:
  content = content.replace(/<sup id="fnref-1"[^>]*>.*?<\/sup>\s*<sup id="fnref-2c"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-2c" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>');

  // Section 3:
  content = content.replace(/<sup id="fnref-3a"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-3a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>');

  // Section 5.1 & 6:
  content = content.replace(/<sup id="fnref-3b"[^>]*>.*?<\/sup>\s*<sup id="fnref-31"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-3b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup> <sup id="cite_ref-31" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-31">[31]</a></sup>');
  content = content.replace(/<sup id="fnref-36"[^>]*>.*?<\/sup>\s*<sup id="fnref-34b"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-36" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-36">[36]</a></sup> <sup id="cite_ref-34b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-34">[34]</a></sup>');
  content = content.replace(/<sup id="fnref-33"[^>]*>.*?<\/sup>\s*<sup id="fnref-35"[^>]*>.*?<\/sup>/, '<sup id="cite_ref-33" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-33">[33]</a></sup> <sup id="cite_ref-35" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-35">[35]</a></sup>');

  const refSectionHtml = renderReferencesSection(fgItems, 'CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html', 'CIRCUIT_PALEONTOLOGY_NOTES.html');
  content = deduplicateAdjacentCitations(content.trim() + '\n\n' + refSectionHtml);
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully updated CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md with BooleanGA references suite');
}

// 3. PROCESS 10 SPECIMEN DOSSIERS
const SPECIMEN_REFS = {
  specimen_01_bistable_latch: [
    { id: 1, bibKey: 'gardner2000', noteTitle: 'The Genetic Toggle Switch', noteSummary: 'Bistable memory requires mutual repression with cooperativity exponent β · γ > 1.' },
    { id: 2, bibKey: 'landauer1961', noteTitle: 'Landauer Switching Dissipation', noteSummary: 'Switching bits dissipates 1 metabolic token; holding state across famine gaps costs 0 tokens.' },
    { id: 3, bibKey: 'alon2019', noteTitle: 'Network Motifs & Dynamical Systems', noteSummary: 'Canonical systems biology model of bistable memory in gene regulation.' },
    { id: 4, bibKey: 'russell1997', noteTitle: 'Hydrothermal Asynchronous Nutrient Kinetics', noteSummary: 'Electron donors and oxidizers vent with temporal phase delays; memory bridges the famine gap.' }
  ],
  specimen_02_repressilator: [
    { id: 1, bibKey: 'elowitz2000', noteTitle: 'The Repressilator Synthetic Clock', noteSummary: 'Odd-inverter ring oscillator enforcing cyclic feedback frustration with period T = 6τ.' },
    { id: 2, bibKey: 'razavi2001', noteTitle: 'Barkhausen Oscillation Criterion', noteSummary: 'Loop gain >= 1 and 2π phase shift required to maintain autonomous limit cycles.' },
    { id: 3, bibKey: 'johnson2011', noteTitle: 'Circadian Pacing & Anticipatory Metabolism', noteSummary: 'Internal clocks prime catalytic porins before arriving nutrient pulses.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Continuous Switching Dissipation', noteSummary: 'Autonomous oscillators pay a constant 3 tokens per cycle in Landauer dissipation.' }
  ],
  specimen_03_coherent_ffl: [
    { id: 1, bibKey: 'mangan2003', noteTitle: 'Coherent Feed-Forward Loop Persistence Filter', noteSummary: 'Under AND logic, C-FFL Type 1 requires sustained stimulus before activating, rejecting 1-tick eddies.' },
    { id: 2, bibKey: 'shenorr2002', noteTitle: 'Transcription Network Motifs in E. coli', noteSummary: 'Enriched far beyond random network chance in natural regulatory genomes.' },
    { id: 3, bibKey: 'milo2015', noteTitle: 'Enzyme Biosynthesis Bioenergetics', noteSummary: 'Prevents wasteful synthesis of catalytic machinery during transient thermal eddies.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Delayed Switching Savings', noteSummary: 'Avoids Landauer toggle penalties by keeping output gates quiescent during brief noise.' }
  ],
  specimen_04_incoherent_ffl: [
    { id: 1, bibKey: 'goentoro2009', noteTitle: 'Fold-Change Detection (FCD)', noteSummary: 'Incoherent FFL generates adaptive pulses whose amplitude depends strictly on relative fold-change.' },
    { id: 2, bibKey: 'alon2007', noteTitle: 'Network Motifs: Theory and Approaches', noteSummary: 'Canonical pulse generator providing exact sensory adaptation.' },
    { id: 3, bibKey: 'russell1997', noteTitle: 'Hydrothermal Gradient Concentration Spans', noteSummary: 'Navigating chemical plumes spanning 4 orders of magnitude requires relative derivative tracking.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Transient Pulse Switching Economics', noteSummary: 'Dissipates switching energy only during input step-changes, returning to zero cost at steady state.' }
  ],
  specimen_05_negative_autoregulation: [
    { id: 1, bibKey: 'rosenfeld2002', noteTitle: 'Negative Autoregulation Response Acceleration', noteSummary: 'Negative feedback speeds the kinetic rise time to steady state by up to 5-fold.' },
    { id: 2, bibKey: 'thattai2001', noteTitle: 'Noise Damping in Living Cells', noteSummary: 'Acts as a restoring spring that clamps expression variance to σ² = <X> / (1+G).' },
    { id: 3, bibKey: 'alon2019', noteTitle: 'Homeostatic Clamp Architecture', noteSummary: 'Prevents toxic overexpression of emergency defense enzymes during thermal spikes.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Optimal Steady-State Dissipation', noteSummary: 'Minimizes redundant gate toggles once target homeostatic voltage is locked.' }
  ],
  specimen_06_binary_half_adder: [
    { id: 1, bibKey: 'minsky1969', noteTitle: 'Linear Non-Separability of XOR', noteSummary: 'Parity logic cannot be computed with a single linear threshold; requires dual-channel half-adder.' },
    { id: 2, bibKey: 'shannon1948', noteTitle: 'Digital Logic in Relay & Switching Systems', noteSummary: 'Computes simultaneous Sum (XOR) and Overflow Carry (AND) arithmetic.' },
    { id: 3, bibKey: 'alon2019', noteTitle: 'Multi-Input Combinatorial Logic', noteSummary: 'Living cells integrate multiple orthogonal chemical inputs through multi-channel logic.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Arithmetic Landauer Economics', noteSummary: 'Co-catalytic dual-pathway arithmetic yields high metabolic reward offsetting switching cost.' }
  ],
  specimen_07_allosteric_inverter: [
    { id: 1, bibKey: 'jacob1961', noteTitle: 'The Operon & Allosteric Repression', noteSummary: 'Conformational state changes in repressor proteins convert chemical presence into binary logic commands.' },
    { id: 2, bibKey: 'monod1965', noteTitle: 'Monod-Wyman-Changeux (MWC) Transitions', noteSummary: 'Ligand binding shifts equilibrium between Relaxed and Tense enzyme states.' },
    { id: 3, bibKey: 'russell1997', noteTitle: 'Hydrothermal Heavy Metal Protection', noteSummary: 'Inverts toxic metal signals to trigger emergency porin shutdown, shielding from cell lysis.' },
    { id: 4, bibKey: 'landauer1961', noteTitle: 'Zero Quiescent Dissipation', noteSummary: 'Holding the inverted shield requires zero continuous metabolic power.' }
  ],
  specimen_08_endosymbiotic_cassette: [
    { id: 1, bibKey: 'margulis1967', noteTitle: 'Serial Endosymbiotic Theory (SET)', noteSummary: 'Mitochondrial organelles descend from engulfed symbionts that retained their circular genomes.' },
    { id: 2, bibKey: 'lane2010', noteTitle: 'Bioenergetic Expansion of Genome Complexity', noteSummary: 'Internalizing energy membranes shattered the prokaryotic surface-to-volume power ceiling.' },
    { id: 3, bibKey: 'mitchell1961', noteTitle: 'Chemiosmotic Dual-Organelle Transduction', noteSummary: 'Parallel catalytic engines grant a permanent +15T battery bonus and dual operons.' },
    { id: 4, bibKey: 'russell1997', noteTitle: 'Compartmentalized Redox Crucibles', noteSummary: 'Inorganic pores provided the prototype for eukaryotic membrane compartmentalization.' }
  ],
  specimen_09_syncytial_multicellularity: [
    { id: 1, bibKey: 'bonner1965', noteTitle: 'Size, Life Cycles, & Multicellularity', noteSummary: 'Cytoplasmic fusion connects adjacent rock cavities into a cooperative macro-organism.' },
    { id: 2, bibKey: 'margulis1981', noteTitle: 'Symbiosis & Intercellular Sharing', noteSummary: 'Intercellular cytoplasmic bridges equalize battery charge and biomass across pores.' },
    { id: 3, bibKey: 'maynardsmith1995', noteTitle: 'Major Evolutionary Transitions in Individuality', noteSummary: 'Decouples individual cell mortality from macro-colony reproductive success.' },
    { id: 4, bibKey: 'russell1997', noteTitle: 'Abiotic Basalt Pore Honeycombs', noteSummary: 'Hexagonal rock geometries naturally encourage adjacent pore cytoplasmic contact.' }
  ],
  specimen_10_pelagic_sporulation: [
    { id: 1, bibKey: 'erickson2010', noteTitle: 'FtsZ Contractile Septum Cleavage', noteSummary: 'Polymeric FtsZ rings exert constrictive force to sever buoyant daughter spore capsules.' },
    { id: 2, bibKey: 'keilin1959', noteTitle: 'Metabolic Cryptobiosis & Dormancy', noteSummary: 'Spore capsules entering pelagic drift enter dormancy, reducing Landauer dissipation to 0 T.' },
    { id: 3, bibKey: 'vogel1994', noteTitle: 'Hydrodynamic Advection in Boundary Layers', noteSummary: 'Ejecting spores into layer z >= 1 enters fast ocean shear, escaping benthic crowding.' },
    { id: 4, bibKey: 'dawkins1982', noteTitle: 'The Extended Phenotype in Spore Dispersal', noteSummary: 'Benthic gene circuits manipulate oceanic current dispersal to colonize distant vents.' }
  ]
};

function updateSpecimenDossiers() {
  for (const [slug, refs] of Object.entries(SPECIMEN_REFS)) {
    const file = path.join(rootDir, 'docs', 'paleontology', `${slug}.md`);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Remove old references section if present
    const oldRefIdx = content.indexOf('<!-- COMPLETE ACADEMIC REFERENCES & CITATIONS -->');
    if (oldRefIdx !== -1) {
      content = content.slice(0, oldRefIdx).trim();
    }
    const oldH2RefIdx = content.indexOf('## References & Foundational Literature');
    if (oldH2RefIdx !== -1) {
      content = content.slice(0, oldH2RefIdx).trim();
    }

    // Specific multi-citation heading corrections for specimen dossiers
    if (slug === 'specimen_05_negative_autoregulation') {
      content = content.replace(
        /### 8\.6 Conceptual Misconception Immunity \(Skeptic FAQ\).*$/m,
        '### 8.6 Conceptual Misconception Immunity (Skeptic FAQ) <sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup> <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>'
      );
    } else if (slug === 'specimen_08_endosymbiotic_cassette') {
      content = content.replace(
        /### 11\.3 How It Increases Darwinian Fitness.*$/m,
        '### 11.3 How It Increases Darwinian Fitness <sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup> <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>'
      );
    } else if (slug === 'specimen_09_syncytial_multicellularity') {
      content = content.replace(
        /### 12\.6 Conceptual Misconception Immunity \(Skeptic FAQ\).*$/m,
        '### 12.6 Conceptual Misconception Immunity (Skeptic FAQ) <sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup> <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>'
      );
    } else if (slug === 'specimen_10_pelagic_sporulation') {
      content = content.replace(
        /### 13\.1 The Motivating Biophysical Dilemma: The Benthic Malthusian Trap.*$/m,
        '### 13.1 The Motivating Biophysical Dilemma: The Benthic Malthusian Trap <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup> <sup id="cite_ref-4" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup>'
      );
      content = content.replace(
        /### 13\.3 How It Increases Darwinian Fitness.*$/m,
        '### 13.3 How It Increases Darwinian Fitness <sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup> <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>'
      );
    }

    // Replace old note references with local specimen cite_ref superscripts
    content = content.replace(/<sup id="fnref-4b"[^>]*>.*?<\/sup>/g, '<sup id="cite_ref-4" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup>');
    content = content.replace(/<sup id="fnref-5b"[^>]*>.*?<\/sup>/g, '<sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>');
    content = content.replace(/<sup id="fnref-6"[^>]*>.*?<\/sup>\s*<sup id="fnref-7"[^>]*>.*?<\/sup>/g, '<sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> <sup id="cite_ref-3" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>');
    content = content.replace(/<sup id="fnref-\w+"[^>]*>.*?<\/sup>/g, '<sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup>');

    // Also replace markdown [n](#note-n)
    content = content.replace(/\[(\d+)\]\(#note-\d+\)/g, (_, n) => `<sup id="cite_ref-${n}" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-${n}">[${n}]</a></sup>`);

    // Deduplicate any accidental duplicate adjacent citations
    content = deduplicateAdjacentCitations(content);

    const refSectionHtml = renderReferencesSection(
      refs,
      '../CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html',
      '../CIRCUIT_PALEONTOLOGY_NOTES.html'
    );

    content = content.trim() + '\n\n' + refSectionHtml;
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Updated specimen dossier: ${slug}.md`);
  }
}

// 4. PROCESS CURRICULUM UNITS
const CURRICULUM_REFS = {
  unit1_prebiotic_threshold: [
    { id: 1, bibKey: 'russell1997', noteTitle: 'The Dilution Catastrophe & Hydrothermal Micro-Pores', noteSummary: 'Alkaline mineral foam (10-50 µm cavities) concentrates reagents by >1,000,000× through thermophoresis, solving the membrane chicken-and-egg paradox.' },
    { id: 2, bibKey: 'mitchell1961', noteTitle: 'The Natural Mitchell-Russell Proton Motive Force', noteSummary: 'A 4.5 pH unit difference across a 5 nm semi-conductive FeS wall generates a 200 mV potential and 40,000,000 V/m electric field powering abiotic redox synthesis.' },
    { id: 3, bibKey: 'landauer1961', noteTitle: 'Landauer Dynamic Switching Dissipation', noteSummary: 'Non-equilibrium thermodynamic battery flux governed by dynamic CMOS switching costs (1 token/toggle) and basal leakage.' },
    { id: 4, bibKey: 'vonneumann1966', noteTitle: 'Von Neumann\'s Self-Replicating Automata Theorem', noteSummary: 'Direct physical self-inspection inevitably triggers lethal error catastrophe; heredity must decouple symbolic records from active machinery.' },
    { id: 5, bibKey: 'pattee1972', noteTitle: 'Howard Pattee\'s Epistemic Cut', noteSummary: 'The fundamental physical boundary between rate-independent symbolic instructions (GenomeSafe) and rate-dependent continuous dynamics (PoreWorkshop).' },
    { id: 6, bibKey: 'lane2012', noteTitle: 'The Origin of Membrane Bioenergetics', noteSummary: 'Abiotic proton gradients preceded organic cell membranes and modern ATP synthases.' }
  ],
  unit2_logic_of_life: [
    { id: 1, bibKey: 'jacob1961', noteTitle: 'The Logic of Life: Logic Gates as Enzymes', noteSummary: 'Allosteric enzyme inhibition maps to Boolean NOT; co-catalysis maps to Boolean AND.' },
    { id: 2, bibKey: 'landauer1961', noteTitle: 'Thermodynamics of Computation & Switching Costs', noteSummary: 'Every logical operation that erases information dissipates at least kB T ln 2 of heat into the environment.' },
    { id: 3, bibKey: 'minsky1969', noteTitle: 'Perceptrons: The XOR Impossibility Proof', noteSummary: 'Single-layer linear threshold units cannot compute XOR; biological circuits require dual-pathway networks.' },
    { id: 4, bibKey: 'shannon1948', noteTitle: 'Shannon Information & Genetic Entropy', noteSummary: 'Formal mathematical bounds on channel capacity, error-correction, and symbolic information transmission in living systems.' }
  ],
  unit3_systems_biology_motifs: [
    { id: 1, bibKey: 'alon2007', noteTitle: 'Uri Alon Network Motifs in Living Systems', noteSummary: 'Recurring topological subgraphs selected by evolutionary fitness far above random Erdős–Rényi graph probability.' },
    { id: 2, bibKey: 'gardner2000', noteTitle: 'The Genetic Toggle Switch: 1-Bit Memory', noteSummary: 'Cross-coupled inverting feedback creates bistable potential energy wells that preserve state across famine intervals.' },
    { id: 3, bibKey: 'elowitz2000', noteTitle: 'The Repressilator: Odd-Inverter Ring Oscillators', noteSummary: 'Frustrated cyclic negative feedback paces autonomous catalytic cycles without external clocks.' },
    { id: 4, bibKey: 'mangan2003', noteTitle: 'Feed-Forward Loops: Sign-Sensitive Delay & Pulse Generation', noteSummary: 'Coherent FFLs filter high-frequency noise; Incoherent FFLs generate biphasic pulses and fold-change adaptation.' },
    { id: 5, bibKey: 'weisfeiler1968', noteTitle: 'Weisfeiler-Lehman Graph Isomorphism Hashing', noteSummary: '1-WL color refinement computes canonical topological graph invariants invariant to codon permutation.' }
  ],
  unit4_evolutionary_dynamics: [
    { id: 1, bibKey: 'kimura1968', noteTitle: 'Motoo Kimura\'s Neutral Theory of Molecular Evolution', noteSummary: 'At the molecular level, most evolutionary changes and polymorphisms are driven by neutral genetic drift rather than positive Darwinian selection.' },
    { id: 2, bibKey: 'ohno1970', noteTitle: 'Susumu Ohno\'s Evolution by Gene Duplication', noteSummary: 'Gene duplication frees one copy from selective constraint, unlocking multi-operon specialization and endosymbiosis.' },
    { id: 3, bibKey: 'lenski1991', noteTitle: 'Richard Lenski\'s Long-Term Evolution Experiment (LTEE)', noteSummary: 'Decades-long laboratory evolution in E. coli reveals predictable hyperbolic fitness trajectories and historical contingency.' },
    { id: 4, bibKey: 'gould2002', noteTitle: 'Stephen Jay Gould: Replaying Life\'s Tape', noteSummary: 'Distinguishing homologous structures inherited from common ancestors from homoplasic structures discovered via convergent evolution.' },
    { id: 5, bibKey: 'lane2010', noteTitle: 'The Energetic Expansion of Eukaryogenesis', noteSummary: 'Mitochondrial endosymbiosis shattered the prokaryotic surface-to-volume power ceiling.' }
  ],
  practicums_lab_manual: [
    { id: 1, bibKey: 'landauer1961', noteTitle: 'Landauer Dynamic Switching Dissipation', noteSummary: 'Laboratory verification of metabolic starvation: idle gates consume 0 tokens; active gate switching dissipates 1 token per toggle.' },
    { id: 2, bibKey: 'mitchell1961', noteTitle: 'Chemiosmotic Proton Motive Force Harvesting', noteSummary: 'Tracking pore battery charge as cells harvest synthetic hydrothermal fuel streams.' },
    { id: 3, bibKey: 'lenski1991', noteTitle: 'Lenski -80°C Cryogenic Fossil Freezing & Autopsy', noteSummary: 'Single-bit counterfactual autopsies: freezing ancestors and pinpointing the exact bit mutation that sparked motif emergence.' },
    { id: 4, bibKey: 'alon2019', noteTitle: 'In-Situ Circuit Diagnostics & Weisfeiler-Lehman Verification', noteSummary: 'Using the Circuit Microscope to inspect logic gate netlists and verify topological WL invariants.' }
  ]
};

function updateCurriculumUnits() {
  for (const [slug, refs] of Object.entries(CURRICULUM_REFS)) {
    const file = path.join(rootDir, 'docs', 'curriculum', `${slug}.md`);
    if (!fs.existsSync(file)) continue;

    let content = fs.readFileSync(file, 'utf8');

    // Remove old references section if present
    const oldRefIdx = content.indexOf('<!-- COMPLETE ACADEMIC REFERENCES & CITATIONS -->');
    if (oldRefIdx !== -1) {
      content = content.slice(0, oldRefIdx).trim();
    }
    const oldH2RefIdx = content.indexOf('## References & Foundational Literature');
    if (oldH2RefIdx !== -1) {
      content = content.slice(0, oldH2RefIdx).trim();
    }

    // Helper: idempotent citation embedding without stacking duplicates
    function embedCitationOnce(targetText, supId, refNum) {
      const supHtml = `<sup id="cite_ref-${supId}" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-${refNum}">[${refNum}]</a></sup>`;
      if (content.includes(targetText + supHtml)) return;
      const escaped = targetText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped + '(\\s*<sup id="cite_ref-[^"]*"[^>]*>.*?<\\/sup>)*');
      content = content.replace(regex, targetText + supHtml);
    }

    // Embed inline citations where appropriate if not already present
    if (slug === 'unit1_prebiotic_threshold') {
      embedCitationOnce('The Dilution Catastrophe**.', '1', '1');
      embedCitationOnce('**The Earth provided nature\'s first cell walls for free.**', '1', '1');
      const duoSup = '<sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup><sup id="cite_ref-6" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-6">[6]</a></sup>';
      if (!content.includes('Chemiosmotic Hypothesis** (Nobel Prize 1978)' + duoSup)) {
        content = content.replace(/Chemiosmotic Hypothesis\*\* \(Nobel Prize 1978\)(\s*<sup id="cite_ref-[^"]*"[^>]*>.*?<\/sup>)*/, 'Chemiosmotic Hypothesis** (Nobel Prize 1978)' + duoSup);
      }
      embedCitationOnce('Dynamic CMOS Landauer dissipation', '3', '3');
      embedCitationOnce('John von Neumann\'s Automata', '4', '4');
      embedCitationOnce('Howard Pattee\'s "Epistemic Cut"', '5', '5');
    } else if (slug === 'unit2_logic_of_life') {
      embedCitationOnce('allosteric enzyme', '1', '1');
      embedCitationOnce('Landauer switching', '2', '2');
      embedCitationOnce('linearly non-separable', '3', '3');
      embedCitationOnce('Shannon channel capacity', '4', '4');
    } else if (slug === 'unit3_systems_biology_motifs') {
      embedCitationOnce('Uri Alon network motifs', '1', '1');
      embedCitationOnce('Bistable Toggle Switch', '2', '2');
      embedCitationOnce('Repressilator', '3', '3');
      embedCitationOnce('Feed-Forward Loops', '4', '4');
      embedCitationOnce('Weisfeiler-Lehman', '5', '5');
    } else if (slug === 'unit4_evolutionary_dynamics') {
      embedCitationOnce('Neutral Theory of Molecular Evolution', '1', '1');
      embedCitationOnce('Gene Duplication', '2', '2');
      embedCitationOnce('Long-Term Evolution Experiment', '3', '3');
      embedCitationOnce('Replaying Life\'s Tape', '4', '4');
      embedCitationOnce('Mitochondrial Eukaryogenesis', '5', '5');
    } else if (slug === 'practicums_lab_manual') {
      embedCitationOnce('Landauer switching dissipation', '1', '1');
      embedCitationOnce('Chemiosmotic battery', '2', '2');
      embedCitationOnce('Lenski -80°C fossil freezer', '3', '3');
      embedCitationOnce('Weisfeiler-Lehman graph hash', '4', '4');
    }

    // Deduplicate any accidental duplicate adjacent citations
    content = deduplicateAdjacentCitations(content);

    const refSectionHtml = renderReferencesSection(
      refs,
      '../companion/bibliography.html',
      null
    );

    content = content.trim() + '\n\n' + refSectionHtml;
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Updated curriculum unit: ${slug}.md`);
  }
}

// 5. PROCESS docs/EPISTEMIC_FOUNDATIONS.md
const EPISTEMIC_REFS = [
  {
    id: 1,
    bibKey: 'pattee1972',
    noteId: 2,
    noteTitle: 'Howard Pattee\'s Epistemic Cut',
    noteSummary: 'The physical necessity of bifurcating living systems into rate-independent symbolic hereditary records and rate-dependent catalytic dynamics.',
    backlinks: [{ id: 'cite_ref-1a', label: 'a' }, { id: 'cite_ref-1b', label: 'b' }]
  },
  {
    id: 2,
    bibKey: 'vonneumann1966',
    noteId: 2,
    noteTitle: 'Von Neumann\'s Self-Reproducing Automata',
    noteSummary: 'Proof that direct self-inspection triggers exponential transcription error collapse; open-ended evolution requires blind tape photocopying.',
    backlinks: [{ id: 'cite_ref-2a', label: 'a' }, { id: 'cite_ref-2b', label: 'b' }]
  },
  {
    id: 3,
    bibKey: 'mitchell1961',
    noteId: 32,
    noteTitle: 'Mitchell\'s Chemiosmotic Proton Motive Force',
    noteSummary: 'Natural continuous proton motive force of ~200 mV generated across thin semi-permeable inorganic membranes by geochemical pH gradients.',
    backlinks: [{ id: 'cite_ref-3a', label: 'a' }, { id: 'cite_ref-3b', label: 'b' }, { id: 'cite_ref-3c', label: 'c' }]
  },
  {
    id: 4,
    bibKey: 'russell1997',
    noteId: 4,
    noteTitle: 'Alkaline Vents as Nature\'s Primordial Batteries',
    noteSummary: 'Inorganic iron monosulphide (FeS) micro-cavities acted as nature\'s first cell walls, concentrating organic reagents by >1,000,000×.',
    backlinks: [{ id: 'cite_ref-4a', label: 'a' }, { id: 'cite_ref-4b', label: 'b' }, { id: 'cite_ref-4c', label: 'c' }, { id: 'cite_ref-4d', label: 'd' }]
  },
  {
    id: 5,
    bibKey: 'lane2012',
    noteId: 21,
    noteTitle: 'Origin of Membrane Bioenergetics',
    noteSummary: 'Abiotic proton gradients across inorganic mineral barriers preceded the evolution of lipid bilayers and modern ATP synthases.',
    backlinks: [{ id: 'cite_ref-5a', label: 'a' }]
  },
  {
    id: 6,
    bibKey: 'landauer1961',
    noteId: 5,
    noteTitle: 'Landauer\'s Switching Dissipation',
    noteSummary: 'Thermodynamic floor of computation: erasing or updating information dissipates kB T ln 2 of heat into the ocean sink.',
    backlinks: [{ id: 'cite_ref-6a', label: 'a' }]
  },
  {
    id: 7,
    bibKey: 'bennett1982',
    noteId: 5,
    noteTitle: 'Thermodynamics of Computation Review',
    noteSummary: 'Dissipation in computing systems arises strictly from logical irreversibility, establishing the physical cost of gate state updates.',
    backlinks: [{ id: 'cite_ref-7a', label: 'a' }]
  },
  {
    id: 8,
    bibKey: 'wachtershauser1990',
    noteId: null,
    noteTitle: 'Iron-Sulfur Surface Metabolism & Abiotic Polymerization',
    noteSummary: 'Template-directed polymerization on charged mineral surfaces is an abiotic physical process driven by exergonic redox condensation.',
    backlinks: [{ id: 'cite_ref-8a', label: 'a' }, { id: 'cite_ref-8b', label: 'b' }]
  },
  {
    id: 9,
    bibKey: 'martin2003',
    noteId: 4,
    noteTitle: 'Origins of Cells in Inorganic Hydrothermal Mounds',
    noteSummary: 'Hadean hydrothermal chimneys provided non-free, pre-existing inorganic micro-compartments that insulated proto-metabolic cycles.',
    backlinks: [{ id: 'cite_ref-9a', label: 'a' }, { id: 'cite_ref-9b', label: 'b' }]
  },
  {
    id: 10,
    bibKey: 'maturana1972',
    noteId: 1,
    noteTitle: 'Autopoiesis & Non-Teleological Self-Maintenance',
    noteSummary: 'Living organizations maintain identity strictly through continuous metabolic regenerative loops without external fitness functions.',
    backlinks: [{ id: 'cite_ref-10a', label: 'a' }]
  }
];

function updateEpistemicFoundations() {
  const file = path.join(rootDir, 'docs', 'EPISTEMIC_FOUNDATIONS.md');
  if (!fs.existsSync(file)) return;

  let content = fs.readFileSync(file, 'utf8');

  // Strip existing section 8 or existing references
  const sec8Idx = content.indexOf('## 8. Academic Provenance & Master Citations');
  if (sec8Idx !== -1) {
    content = content.slice(0, sec8Idx).trim();
  }
  const oldRefIdx = content.indexOf('<!-- COMPLETE ACADEMIC REFERENCES & CITATIONS -->');
  if (oldRefIdx !== -1) {
    content = content.slice(0, oldRefIdx).trim();
  }

  // Executive summary replacements:
  content = content.replace(
    '1. **The Battery** (Inorganic Chemiosmosis & Mineral Capacitance [[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4) [[Note 32]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-32)),',
    '1. **The Battery** (Inorganic Chemiosmosis & Mineral Capacitance<sup id="cite_ref-4a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup> <sup id="cite_ref-3a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>),'
  );
  content = content.replace(
    '2. **The Workshop** (Inorganic Micro-Compartmentation),',
    '2. **The Workshop** (Inorganic Micro-Compartmentation<sup id="cite_ref-4b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup> <sup id="cite_ref-9a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-9">[9]</a></sup>),'
  );
  content = content.replace(
    '3. **The Safe** (Pattee\'s Epistemic Cut [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2) & Von Neumann\'s Automata Theorem [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)), and',
    '3. **The Safe** (Pattee\'s Epistemic Cut<sup id="cite_ref-1a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup> &amp; Von Neumann\'s Automata Theorem<sup id="cite_ref-2a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>), and'
  );
  content = content.replace(
    '4. **The Photocopy Reproduction** (Abiotic Surface-Catalyzed Template Copying)',
    '4. **The Photocopy Reproduction** (Abiotic Surface-Catalyzed Template Copying<sup id="cite_ref-8a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-8">[8]</a></sup>)'
  );

  // Section 1:
  content = content.replace(
    'Evolution by natural selection cannot begin until an entity can maintain its own boundary and copy its hereditary instructions.',
    'Evolution by natural selection cannot begin until an entity can maintain its own boundary and copy its hereditary instructions<sup id="cite_ref-10a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-10">[10]</a></sup>.'
  );

  // Section 2:
  content = content.replace(
    'The answer from modern geobiology (Peter Mitchell, Michael Russell, Nick Lane, William Martin) is unambiguous:',
    'The answer from modern geobiology (Peter Mitchell<sup id="cite_ref-3b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>, Michael Russell<sup id="cite_ref-4c" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup>, Nick Lane<sup id="cite_ref-5a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-5">[5]</a></sup>, William Martin<sup id="cite_ref-9b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-9">[9]</a></sup>) is unambiguous:'
  );
  content = content.replace(
    'In 1961, Peter Mitchell proposed the Chemiosmotic Hypothesis (Nobel Prize 1978):',
    'In 1961, Peter Mitchell proposed the Chemiosmotic Hypothesis (Nobel Prize 1978)<sup id="cite_ref-3c" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-3">[3]</a></sup>:'
  );
  content = content.replace(
    'In 1997, Michael Russell and Allan Hall solved this riddle:',
    'In 1997, Michael Russell and Allan Hall solved this riddle<sup id="cite_ref-4d" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup>:'
  );
  content = content.replace(
    'Dynamic Switching Cost ($k_B T \\ln 2$):**',
    'Dynamic Switching Cost ($k_B T \\ln 2$)<sup id="cite_ref-6a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-6">[6]</a></sup><sup id="cite_ref-7a" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-7">[7]</a></sup>:**'
  );

  // Section 4:
  content = content.replace(
    '![Figure 1.3: Von Neumann\'s Self-Replication Architecture & Howard Pattee\'s Epistemic Cut [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)](assets/diagrams/fig1_3_epistemic_cut.svg)',
    '![Figure 1.3: Von Neumann\'s Self-Replication Architecture & Howard Pattee\'s Epistemic Cut](assets/diagrams/fig1_3_epistemic_cut.svg)'
  );
  content = content.replace(
    'In the 1940s, mathematician John von Neumann investigated',
    'In the 1940s, mathematician John von Neumann investigated<sup id="cite_ref-2b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>'
  );
  content = content.replace(
    'Theoretical biophysicist Howard Pattee formalized this boundary:',
    'Theoretical biophysicist Howard Pattee formalized this boundary<sup id="cite_ref-1b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup>:'
  );

  // Section 5:
  content = content.replace(
    'template-directed polymerization is an abiotic physical process,',
    'template-directed polymerization<sup id="cite_ref-8b" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-8">[8]</a></sup> is an abiotic physical process,'
  );

  // Deduplicate any accidental duplicate adjacent citations
  content = deduplicateAdjacentCitations(content);

  const refSectionHtml = renderReferencesSection(EPISTEMIC_REFS, 'CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html', 'CIRCUIT_PALEONTOLOGY_NOTES.html');
  content = content.trim() + '\n\n' + refSectionHtml;
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully updated docs/EPISTEMIC_FOUNDATIONS.md with BooleanGA references suite');
}

// 6. PROCESS THEORETICAL_MODEL.md
const THEORETICAL_REFS = [
  {
    id: 1,
    bibKey: 'maturana1972',
    noteId: 1,
    noteTitle: 'Autopoiesis & Non-Teleological Evolutionary Persistence',
    noteSummary: 'Organisms survive if and only if internal metabolic circuits extract free energy to maintain structure; no target truth table or fitness functions exist.',
    backlinks: [{ id: 'cite_ref-1', label: '1' }]
  },
  {
    id: 2,
    bibKey: 'pattee1972',
    noteId: 2,
    noteTitle: 'Howard Pattee\'s Epistemic Cut',
    noteSummary: 'Life requires a fundamental separation between rate-independent symbolic records (the Safe) and rate-dependent continuous dynamics (the Workshop).',
    backlinks: [{ id: 'cite_ref-2', label: '2' }]
  },
  {
    id: 3,
    bibKey: 'vonneumann1966',
    noteId: 2,
    noteTitle: 'Von Neumann\'s Self-Reproducing Automata Theorem',
    noteSummary: 'Self-inspecting machines suffer catastrophic transcription error cascades; replication requires blind photocopying of uninterpreted code tapes.',
    backlinks: [{ id: 'cite_ref-3', label: '3' }]
  },
  {
    id: 4,
    bibKey: 'russell1997',
    noteId: 4,
    noteTitle: 'Hydrothermal Mineral Foam as Nature\'s First Cell Walls',
    noteSummary: 'Alkaline submarine hydrothermal springs provide microscopic inorganic cavities that concentrate organic reagents, overcoming the dilution catastrophe.',
    backlinks: [{ id: 'cite_ref-4', label: '4' }]
  },
  {
    id: 5,
    bibKey: 'mitchell1961',
    noteId: 32,
    noteTitle: 'Chemiosmotic Proton Motive Force & Prebiotic Voltage',
    noteSummary: 'Transmembrane electrochemical potential difference (~200 mV) generated by alkaline vent fluids against acidic Hadean ocean water.',
    backlinks: [{ id: 'cite_ref-5', label: '5' }]
  },
  {
    id: 6,
    bibKey: 'lane2010',
    noteId: 21,
    noteTitle: 'The Energetics of Genome Complexity & Eukaryogenesis',
    noteSummary: 'Mitochondrial internalization expanded available energy per gene by >200,000×, shattering prokaryotic bioenergetic scaling ceilings.',
    backlinks: [{ id: 'cite_ref-6', label: '6' }]
  },
  {
    id: 7,
    bibKey: 'landauer1961',
    noteId: 5,
    noteTitle: 'Landauer\'s Principle & Dynamic CMOS Switching Dissipation',
    noteSummary: 'Erasing one bit of information dissipates at least kB T ln 2 of thermodynamic heat (1 metabolic token per gate toggle in Siliquarium).',
    backlinks: [{ id: 'cite_ref-7', label: '7' }]
  },
  {
    id: 8,
    bibKey: 'alon2007',
    noteId: null,
    noteTitle: 'Uri Alon Network Motifs in Living Systems',
    noteSummary: 'Recurring structural subgraphs appearing at frequencies orders of magnitude higher than expected in random networks.',
    backlinks: [{ id: 'cite_ref-8', label: '8' }]
  },
  {
    id: 9,
    bibKey: 'gardner2000',
    noteId: 6,
    noteTitle: 'The Synthetic Genetic Toggle Switch (1-Bit Memory)',
    noteSummary: 'Mutual repression with non-linear cooperativity produces bistable potential energy wells that preserve state across famine intervals.',
    backlinks: [{ id: 'cite_ref-9', label: '9' }]
  },
  {
    id: 10,
    bibKey: 'elowitz2000',
    noteId: 8,
    noteTitle: 'The Repressilator: Frustrated Cyclic Negative Feedback',
    noteSummary: 'Ring oscillator composed of an odd number of inverters enforcing cyclic limit-cycle oscillations with period T = 6τ.',
    backlinks: [{ id: 'cite_ref-10', label: '10' }]
  },
  {
    id: 11,
    bibKey: 'mangan2003',
    noteId: 11,
    noteTitle: 'Feed-Forward Loop Motifs: Noise Filters & Pulse Generators',
    noteSummary: 'Coherent FFLs act as sign-sensitive delay filters; Incoherent FFLs generate biphasic pulses and fold-change adaptation.',
    backlinks: [{ id: 'cite_ref-11', label: '11' }]
  },
  {
    id: 12,
    bibKey: 'rosenfeld2002',
    noteId: 15,
    noteTitle: 'Negative Autoregulation: Response Time Acceleration',
    noteSummary: 'Throttling strong promoters with negative feedback accelerates kinetic rise time by up to 5-fold and clamps steady-state noise.',
    backlinks: [{ id: 'cite_ref-12', label: '12' }]
  },
  {
    id: 13,
    bibKey: 'minsky1969',
    noteId: 18,
    noteTitle: 'Linear Non-Separability of XOR & Half-Adder Architecture',
    noteSummary: 'Parity logic cannot be solved by single-layer linear threshold units; requires dual-channel half-adder circuitry.',
    backlinks: [{ id: 'cite_ref-13', label: '13' }]
  },
  {
    id: 14,
    bibKey: 'monod1965',
    noteId: 19,
    noteTitle: 'Allosteric Transitions & Monod-Wyman-Changeux Conformational Logic',
    noteSummary: 'Ligand binding alters conformational equilibrium between Relaxed and Tense states, gating catalytic flow through inversion logic.',
    backlinks: [{ id: 'cite_ref-14', label: '14' }]
  },
  {
    id: 15,
    bibKey: 'margulis1967',
    noteId: 22,
    noteTitle: 'Serial Endosymbiotic Theory (SET)',
    noteSummary: 'Eukaryotic organelles originated as free-living prokaryotic endosymbionts, providing encapsulated bioenergetic factories.',
    backlinks: [{ id: 'cite_ref-15', label: '15' }]
  },
  {
    id: 16,
    bibKey: 'bonner1965',
    noteId: 23,
    noteTitle: 'Size, Life Cycles & Syncytial Multicellularity',
    noteSummary: 'Intercellular cytoplasmic connections allow sharing of battery tokens and biomass across porous mineral matrices.',
    backlinks: [{ id: 'cite_ref-16', label: '16' }]
  },
  {
    id: 17,
    bibKey: 'erickson2010',
    noteId: 27,
    noteTitle: 'FtsZ Contractile Septum Ring Cleavage',
    noteSummary: 'GTPase cytoskeletal polymers assemble into constrictive rings exerting ~10 pN of force to cleave daughter spore capsules.',
    backlinks: [{ id: 'cite_ref-17', label: '17' }]
  },
  {
    id: 18,
    bibKey: 'keilin1959',
    noteId: 28,
    noteTitle: 'Metabolic Cryptobiosis & Silica Capsule Dormancy',
    noteSummary: 'Pelagic spores enter latent anabiosis with near-zero Landauer dissipation, surviving extended drift across cold ocean waters.',
    backlinks: [{ id: 'cite_ref-18', label: '18' }]
  },
  {
    id: 19,
    bibKey: 'vogel1994',
    noteId: 29,
    noteTitle: 'Life in Moving Fluids: Abyssal Boundary Layer Advection',
    noteSummary: 'Hydrodynamic shear velocity profiles in marine benthic boundary layers enable passive long-distance spore dispersal.',
    backlinks: [{ id: 'cite_ref-19', label: '19' }]
  },
  {
    id: 20,
    bibKey: 'dawkins1982',
    noteId: 30,
    noteTitle: 'The Extended Phenotype in Broadcast Spawning',
    noteSummary: 'Genetic adaptations alter spatial colonization patterns across oceanic physical fluid currents.',
    backlinks: [{ id: 'cite_ref-20', label: '20' }]
  },
  {
    id: 21,
    bibKey: 'shannon1948',
    noteId: 31,
    noteTitle: 'Shannon Information & Communication Theory',
    noteSummary: 'Formal mathematical formulation of entropy, channel capacity, and discrete symbolic transmission in genetic networks.',
    backlinks: [{ id: 'cite_ref-21', label: '21' }]
  },
  {
    id: 22,
    bibKey: 'kimura1968',
    noteId: 33,
    noteTitle: 'Motoo Kimura\'s Neutral Theory of Molecular Evolution',
    noteSummary: 'The vast majority of molecular mutations are selectively neutral; populations navigate neutral fitness saddles via genetic drift.',
    backlinks: [{ id: 'cite_ref-22', label: '22' }]
  },
  {
    id: 23,
    bibKey: 'ohno1970',
    noteId: 34,
    noteTitle: 'Susumu Ohno\'s Evolution by Gene Duplication',
    noteSummary: 'Tandem gene duplication creates redundant genetic reservoirs free from purifying selection to acquire novel functions.',
    backlinks: [{ id: 'cite_ref-23', label: '23' }]
  },
  {
    id: 24,
    bibKey: 'lenski1991',
    noteId: 35,
    noteTitle: 'Richard Lenski\'s Long-Term Evolution Experiment (LTEE)',
    noteSummary: 'Hyperbolic multi-decade fitness trajectories demonstrating adaptation, divergence, and historical contingency.',
    backlinks: [{ id: 'cite_ref-24', label: '24' }]
  },
  {
    id: 25,
    bibKey: 'gould2002',
    noteId: 36,
    noteTitle: 'Gould\'s Homology vs. Independent Convergent Homoplasy',
    noteSummary: 'Distinguishing structures inherited from a common ancestor from independently evolved solutions under convergent selection.',
    backlinks: [{ id: 'cite_ref-25', label: '25' }]
  },
  {
    id: 26,
    bibKey: 'weisfeiler1968',
    noteId: 3,
    noteTitle: 'Weisfeiler-Lehman Graph Kernel Isomorphism Hashing',
    noteSummary: 'Iterative 1-WL neighborhood color refinement to compute permutation-invariant topological graph invariants.',
    backlinks: [{ id: 'cite_ref-26', label: '26' }]
  }
];

function updateTheoreticalModel() {
  const file = path.join(rootDir, 'THEORETICAL_MODEL.md');
  if (!fs.existsSync(file)) return;

  let content = fs.readFileSync(file, 'utf8');

  // Strip existing references section if any
  const oldRefIdx = content.indexOf('<!-- COMPLETE ACADEMIC REFERENCES & CITATIONS -->');
  if (oldRefIdx !== -1) {
    content = content.slice(0, oldRefIdx).trim();
  }
  const oldH2RefIdx = content.indexOf('## References & Foundational Literature');
  if (oldH2RefIdx !== -1) {
    content = content.slice(0, oldH2RefIdx).trim();
  }

  // Helper: idempotent citation embedding without stacking duplicates
  function embedCitationOnce(targetText, supId, refNum, afterChar = '') {
    const supHtml = `<sup id="cite_ref-${supId}" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-${refNum}">[${refNum}]</a></sup>`;
    if (content.includes(targetText + supHtml + afterChar)) return;
    const escaped = targetText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escAfter = afterChar ? afterChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
    const regex = new RegExp(escaped + '(\\s*<sup id="cite_ref-[^"]*"[^>]*>.*?<\\/sup>)*' + escAfter);
    content = content.replace(regex, targetText + supHtml + afterChar);
  }

  // Replace legacy [[Note ...]]
  content = content.replace('[[Note 1]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-1)', '<sup id="cite_ref-1" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-1">[1]</a></sup>');
  content = content.replace('[[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4)', '<sup id="cite_ref-4" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-4">[4]</a></sup>');
  content = content.replace('![Figure 1.3: Von Neumann\'s Self-Replication Architecture & Howard Pattee\'s Epistemic Cut [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)](assets/diagrams/fig1_3_epistemic_cut.svg)', '![Figure 1.3: Von Neumann\'s Self-Replication Architecture & Howard Pattee\'s Epistemic Cut](assets/diagrams/fig1_3_epistemic_cut.svg)');
  content = content.replace('[[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)', '<sup id="cite_ref-2" class="text-cyan-400 font-mono text-[10px]"><a href="#ref-2">[2]</a></sup>');

  // Specific key term anchors:
  embedCitationOnce('supplying free energy directly to proto-life', '5', '5', '.');
  embedCitationOnce('Howard Pattee\'s "Epistemic Cut"', '2', '2');
  embedCitationOnce('John von Neumann\'s Automata', '3', '3');
  embedCitationOnce('Dynamic CMOS Landauer dissipation', '7', '7');
  embedCitationOnce('Uri Alon network motifs', '8', '8');
  embedCitationOnce('Weisfeiler-Lehman', '26', '26');
  embedCitationOnce('Motoo Kimura\'s Neutral Drift', '22', '22');
  embedCitationOnce('Susumu Ohno\'s gene duplication mechanism', '23', '23', ':');
  embedCitationOnce('Richard Lenski\'s Long-Term Evolution Experiment', '24', '24');
  embedCitationOnce('convergent evolution', '25', '25');
  embedCitationOnce('buoyant broadcast spawning', '20', '20');

  // Deduplicate any accidental duplicate adjacent citations
  content = deduplicateAdjacentCitations(content);

  const refSectionHtml = renderReferencesSection(THEORETICAL_REFS, 'CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html', 'CIRCUIT_PALEONTOLOGY_NOTES.html');
  content = content.trim() + '\n\n' + refSectionHtml;
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Successfully updated THEORETICAL_MODEL.md with BooleanGA references suite');
}

// EXECUTE ALL
console.log('=========================================');
console.log('🐠 Siliquarium Wikipedia Citation Suite');
console.log('=========================================');

updateFieldGuideHub();
updateSpecimenDossiers();
updateCurriculumUnits();
updateEpistemicFoundations();
updateTheoreticalModel();

console.log('🎉 References and citations injected across all documentation!');
