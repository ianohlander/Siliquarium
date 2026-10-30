import fs from 'node:fs';

const filesToCheck = [
  'docs/THEORETICAL_MODEL.html',
  'docs/EPISTEMIC_FOUNDATIONS.html',
  'docs/curriculum/unit2_logic_of_life.html',
  'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html'
];

for (const file of filesToCheck) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== CHECKING ${file} ===`);
  const ids = new Set([...content.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  
  const forwardLinks = [...content.matchAll(/href="#(ref-[^"]+)"/g)].map(m => m[1]);
  const missingForward = [...new Set(forwardLinks.filter(r => !ids.has(r)))];
  console.log(`Forward links to #ref-X: ${forwardLinks.length}, Missing:`, missingForward);

  const backlinks = [...content.matchAll(/href="#(cite_ref-[^"]+)"/g)].map(m => m[1]);
  const missingBack = [...new Set(backlinks.filter(b => !ids.has(b)))];
  console.log(`Backlinks to #cite_ref-X: ${backlinks.length}, Missing:`, missingBack);

  // Let's see some sample matches of cite_ref in text vs bib
  const sampleSups = [...content.matchAll(/<sup[^>]*id="([^"]+)"[^>]*>/g)].map(m => m[1]);
  console.log('Sample <sup id="..."> found on page:', sampleSups.slice(0, 10));
}
