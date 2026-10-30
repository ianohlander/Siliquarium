import fs from 'node:fs';

function checkEqs(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== ${file} ===`);
  const displayEqs = content.match(/\$\$[\s\S]*?\$\$/g) || [];
  console.log(`Total display equations: ${displayEqs.length}`);
  let colored = 0;
  for (const eq of displayEqs) {
    if (eq.includes('\\color{')) colored++;
  }
  console.log(`Colored equations: ${colored}`);
  const decoders = content.match(/Equation Decoder/gi) || [];
  console.log(`Equation Decoder callouts: ${decoders.length}`);
  
  if (colored < displayEqs.length) {
    console.log('Uncolored equations:');
    displayEqs.forEach((eq, idx) => {
      if (!eq.includes('\\color{')) {
        console.log(`  [Eq ${idx + 1}] ${eq.replace(/\n/g, ' ').slice(0, 80)}`);
      }
    });
  }
}

checkEqs('docs/GENE_REGULATORY_NETWORKS_VOLUME.md');
checkEqs('docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md');
checkEqs('THEORETICAL_MODEL.md');
checkEqs('docs/EPISTEMIC_FOUNDATIONS.md');
checkEqs('docs/THE_GENETIC_BOOK_OF_THE_DEAD.md');
checkEqs('docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md');
checkEqs('docs/USER_GUIDE.md');
