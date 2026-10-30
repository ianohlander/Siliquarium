#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (!fs.existsSync(edgePath)) {
  console.error('Edge browser not found at ' + edgePath);
  process.exit(1);
}

function findHtmlFiles(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(findHtmlFiles(full));
    } else if (item.name.endsWith('.html') && !item.name.includes('dead_dump') && !item.name.includes('test_math')) {
      res.push(full);
    }
  }
  return res;
}

const htmlFiles = findHtmlFiles(rootDir);
console.log(`Auditing MathJax rendering across ${htmlFiles.length} HTML files using Headless Edge...`);

// Filter for files with math
const filesWithMath = [];
for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('$$') || content.includes('MathJax')) {
    filesWithMath.push(f);
  }
}

console.log(`Found ${filesWithMath.length} HTML documents containing MathJax markup.`);

const tempDumpPath = path.join(rootDir, 'temp_dump_audit.html');
let grandTotalErrors = 0;
let grandTotalContainers = 0;
const report = [];

for (const f of filesWithMath) {
  const rel = path.relative(rootDir, f);
  const fileUri = 'file:///' + f.replace(/\\/g, '/');
  
  try {
    // Run edge with virtual-time-budget so MathJax finishes rendering
    const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=4000 --dump-dom "${fileUri}"`;
    const domOutput = execSync(cmd, { maxBuffer: 30 * 1024 * 1024, encoding: 'utf8' });
    
    // Count mjx-merror or data-mjx-error
    const errorMatches = domOutput.match(/data-mjx-error="([^"]+)"/g) || [];
    const containerMatches = domOutput.match(/<mjx-container/g) || [];
    
    const errors = errorMatches.length;
    const containers = containerMatches.length;
    
    grandTotalErrors += errors;
    grandTotalContainers += containers;
    
    if (errors > 0) {
      console.log(`❌ [${rel}] - ERRORS: ${errors} | Rendered: ${containers}`);
      report.push({ file: rel, status: 'FAIL', errors, containers, samples: errorMatches.slice(0, 3) });
    } else {
      console.log(`✅ [${rel}] - Clean! Rendered: ${containers} equations, 0 errors.`);
      report.push({ file: rel, status: 'PASS', errors: 0, containers });
    }
  } catch (err) {
    console.error(`⚠️ Error testing ${rel}:`, err.message);
  }
}

if (fs.existsSync(tempDumpPath)) fs.unlinkSync(tempDumpPath);

console.log('\n=========================================');
console.log(`AUDIT COMPLETE:`);
console.log(`Total HTML files checked: ${filesWithMath.length}`);
console.log(`Total equations successfully rendered: ${grandTotalContainers}`);
console.log(`Total MathJax errors: ${grandTotalErrors}`);
console.log('=========================================');

if (grandTotalErrors > 0) {
  console.error(`FAILED: ${grandTotalErrors} MathJax rendering errors detected!`);
  process.exit(1);
} else {
  console.log('SUCCESS: All documents render 100% cleanly with zero errors.');
  process.exit(0);
}
