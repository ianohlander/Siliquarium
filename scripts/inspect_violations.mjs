import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('QA/qa_coding_standards_audit.json', 'utf8'));

console.log('=== ANY TYPE USAGES (count: ' + data.anyTypeUsages.length + ') ===');
data.anyTypeUsages.forEach(u => {
  console.log(`${u.file}:${u.line} -> ${u.code}`);
});

console.log('\n=== ZERO-DOM VIOLATIONS IN CORE/ENGINE (count: ' + data.zeroDomViolations.length + ') ===');
data.zeroDomViolations.forEach(v => {
  console.log(`${v.file}:${v.line} [${v.token}] -> ${v.code}`);
});

console.log('\n=== HIGH PARAMETER FUNCTIONS (count: ' + data.highParameterFunctions.length + ') ===');
data.highParameterFunctions.forEach(f => {
  console.log(`${f.file}:${f.line} -> ${f.function} (${f.paramCount} params)`);
});

console.log('\n=== TOP FILE LENGTH VIOLATIONS (count: ' + data.fileLengthViolations.length + ') ===');
data.fileLengthViolations.slice(0, 15).forEach(f => {
  console.log(`${f.file}: ${f.lineCount} lines (+${f.overBudget})`);
});


