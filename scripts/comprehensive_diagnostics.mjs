import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Let's inspect all markdown files in root, docs/, standards/, QA/
function getFiles(dir, ext = '.md') {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.gemini', 'dist'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(getFiles(full, ext));
    } else if (item.name.endsWith(ext)) {
      res.push(full);
    }
  }
  return res;
}

const mdFiles = getFiles(rootDir, '.md');

console.log('=== CITATION AUDIT ACROSS ALL MARKDOWN FILES ===');

const docsWithBib = [];

for (const f of mdFiles) {
  const rel = path.relative(rootDir, f);
  const content = fs.readFileSync(f, 'utf8');

  // Check if document has a references section
  const hasBib = /<li\s+id=["']ref-/i.test(content) || /##\s+(?:References|Annotated Academic Bibliography|Primary Literature Citations|Master Bibliography)/i.test(content);
  
  // Find all <li id="ref-X"> or similar
  const bibEntries = [...content.matchAll(/<li\s+id=["'](ref-[^"']+)["']/gi)].map(m => m[1]);
  // Find all in-text citations: [^X], [n](#ref-X), <sup id="cite_ref-X">
  const inTextCites = [...content.matchAll(/href=["']#(ref-[^"']+)["']/gi)].map(m => m[1]);
  // Find all backlinks in bib: href="#cite_ref-X"
  const bibBacklinks = [...content.matchAll(/href=["']#(cite_ref-[^"']+)["']/gi)].map(m => m[1]);
  // Find all cite_ref ids on sups: <sup id="cite_ref-X">
  const inTextSupIds = [...content.matchAll(/id=["'](cite_ref-[^"']+)["']/gi)].map(m => m[1]);

  if (bibEntries.length > 0 || inTextCites.length > 0 || hasBib) {
    const unreferencedBibEntries = bibEntries.filter(b => !inTextCites.includes(b));
    const missingSupForBacklinks = bibBacklinks.filter(b => !inTextSupIds.includes(b));
    const deadInTextCites = inTextCites.filter(c => !bibEntries.includes(c));

    if (unreferencedBibEntries.length > 0 || missingSupForBacklinks.length > 0 || deadInTextCites.length > 0) {
      docsWithBib.push({
        file: rel,
        bibCount: bibEntries.length,
        inTextCiteCount: inTextCites.length,
        unreferencedBibEntries,
        missingSupForBacklinks,
        deadInTextCites
      });
    }
  }
}

console.log(`Found ${docsWithBib.length} documents with citation discrepancies:\n`);
for (const d of docsWithBib) {
  console.log(`📄 [${d.file}]`);
  console.log(`   Bibliography entries: ${d.bibCount}, In-text citations: ${d.inTextCiteCount}`);
  if (d.deadInTextCites.length > 0) {
    console.log(`   ❌ In-text citations without bib entry:`, d.deadInTextCites);
  }
  if (d.unreferencedBibEntries.length > 0) {
    console.log(`   ⚠️ Bib entries never cited in text:`, d.unreferencedBibEntries);
  }
  if (d.missingSupForBacklinks.length > 0) {
    console.log(`   ⚠️ Backlinks pointing to missing text ids:`, d.missingSupForBacklinks);
  }
  console.log('');
}

console.log('=== CHECKING ALL CORE VOLUMES FOR REFERENCE APPARATUS ===');
const coreVolumes = [
  'THEORETICAL_MODEL.md',
  'docs/EPISTEMIC_FOUNDATIONS.md',
  'docs/THE_GENETIC_BOOK_OF_THE_DEAD.md',
  'docs/GENE_REGULATORY_NETWORKS_VOLUME.md',
  'docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md',
  'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md',
  'docs/USER_GUIDE.md'
];

for (const vol of coreVolumes) {
  const p = path.resolve(rootDir, vol);
  if (!fs.existsSync(p)) continue;
  const txt = fs.readFileSync(p, 'utf8');
  const inTextMatches = [...txt.matchAll(/href=["']#(ref-[^"']+)["']/gi)].map(m => m[1]);
  const bibMatches = [...txt.matchAll(/<li\s+id=["'](ref-[^"']+)["']/gi)].map(m => m[1]);
  console.log(`📘 [${vol}]`);
  console.log(`   In-text citation count: ${inTextMatches.length}`);
  console.log(`   Bibliography entry count: ${bibMatches.length}`);
  console.log(`   Has bibliography section: ${/##\s+(?:References|Annotated Academic Bibliography|Primary Literature Citations|Master Bibliography)/i.test(txt)}`);
  console.log('');
}

