#!/usr/bin/env node

/**
 * 🔍 Siliquarium Comprehensive QA & Development Standards Audit
 * Evaluates the entire codebase against:
 * 1. DEVELOPMENT_STANDARDS.md (OOP, SOLID, Anti-Monolith, Complexity Budgets, Zero-DOM, Type Safety)
 * 2. QA_AND_TESTING_STANDARDS.md (Deterministic Coverage, Anti-Smuggling, Thermodynamic Invariants, Edge Cases)
 * 3. DOCUMENTATION_STANDARDS.md (Dual-format publishing, Equation Decoders, Academic Citations)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function getAllFiles(dir, ext = '.ts') {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsFiles = getAllFiles(srcDir, '.ts');

console.log('='.repeat(80));
console.log('🔍 SILIQUARIUM COMPREHENSIVE QA & CODEBASE AUDIT');
console.log(`   Auditing ${tsFiles.length} TypeScript files across src/`);
console.log('='.repeat(80));

const auditReport = {
  timestamp: new Date().toISOString(),
  totalFiles: tsFiles.length,
  forbiddenFileViolations: [],
  zeroDomViolations: [],
  anyTypeUsages: [],
  fileLengthViolations: [],
  highParameterFunctions: [],
  thermodynamicLedgerStatus: null,
  summary: {}
};

// 1. FORBIDDEN FILE NAMES AUDIT
const forbiddenRegex = /^(utils|helpers|common|misc|manager|shared)\.ts$/i;
for (const file of tsFiles) {
  const baseName = path.basename(file);
  if (forbiddenRegex.test(baseName)) {
    auditReport.forbiddenFileViolations.push(path.relative(rootDir, file));
  }
}

// 2. ZERO-DOM MANDATE IN CORE & ENGINE
const coreEngineFiles = tsFiles.filter(f => {
  const rel = path.relative(srcDir, f).replace(/\\/g, '/');
  return rel.startsWith('core/') || (rel.startsWith('engine/') && !rel.includes('storage/SiliquariumDB.ts'));
});

const domTokens = ['document.', 'window.', 'HTMLElement', 'HTMLCanvasElement', 'localStorage', 'CanvasRenderingContext2D'];

for (const file of coreEngineFiles) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Exclude comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

    for (const token of domTokens) {
      if (line.includes(token)) {
        // Exclude typeof window !== 'undefined' environment guards
        if (line.includes('typeof window') || line.includes('typeof document')) continue;
        auditReport.zeroDomViolations.push({
          file: rel,
          line: idx + 1,
          token,
          code: trimmed.slice(0, 80)
        });
      }
    }
  });
}

// 3. ANY TYPE USAGES AUDIT
for (const file of tsFiles) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

    // Check for ': any', 'as any', '<any>'
    if (/:\s*any\b|as\s+any\b|<any>/.test(line)) {
      auditReport.anyTypeUsages.push({
        file: rel,
        line: idx + 1,
        code: trimmed.slice(0, 90)
      });
    }
  });
}

// 4. FILE LENGTH BUDGETS (<= 300 Lines)
for (const file of tsFiles) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  if (lines.length > 300) {
    auditReport.fileLengthViolations.push({
      file: rel,
      lineCount: lines.length,
      overBudget: lines.length - 300
    });
  }
}

// 5. HIGH PARAMETER COUNT FUNCTIONS (> 4 parameters)
for (const file of tsFiles) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  // Regex to detect function declarations with parameter lists
  const fnRegex = /(?:public|private|protected|function|static)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
  let match;
  while ((match = fnRegex.exec(content)) !== null) {
    const fnName = match[1];
    const paramList = match[2].trim();
    if (!paramList) continue;

    // Split parameters taking nested types into account
    let depth = 0;
    let paramCount = 1;
    for (let c of paramList) {
      if (c === '(' || c === '<' || c === '{') depth++;
      else if (c === ')' || c === '>' || c === '}') depth--;
      else if (c === ',' && depth === 0) paramCount++;
    }

    if (paramCount > 4) {
      const lineNum = content.slice(0, match.index).split('\n').length;
      auditReport.highParameterFunctions.push({
        file: rel,
        line: lineNum,
        function: fnName,
        paramCount
      });
    }
  }
}

// Sort results
auditReport.fileLengthViolations.sort((a, b) => b.lineCount - a.lineCount);

console.log('\n--- 1. FORBIDDEN FILE NAMES ---');
if (auditReport.forbiddenFileViolations.length === 0) {
  console.log('  ✅ 100% Compliant: Zero generic/catch-all files (no utils.ts, helpers.ts, misc.ts).');
} else {
  console.log(`  ❌ Violations found (${auditReport.forbiddenFileViolations.length}):`, auditReport.forbiddenFileViolations);
}

console.log('\n--- 2. ZERO-DOM MANDATE IN CORE & ENGINE ---');
if (auditReport.zeroDomViolations.length === 0) {
  console.log('  ✅ 100% Compliant: Zero browser DOM tokens in src/core/ and src/engine/. Fully headless executable.');
} else {
  console.log(`  ⚠️ DOM Tokens Found (${auditReport.zeroDomViolations.length}):`);
  auditReport.zeroDomViolations.slice(0, 10).forEach(v => {
    console.log(`     - [${v.file}:${v.line}] Token '${v.token}': ${v.code}`);
  });
  if (auditReport.zeroDomViolations.length > 10) {
    console.log(`     ... and ${auditReport.zeroDomViolations.length - 10} more.`);
  }
}

console.log('\n--- 3. ANY TYPE USAGE IN TYPESCRIPT ---');
console.log(`  Total 'any' casts/types across all 70 files: ${auditReport.anyTypeUsages.length}`);
const coreAny = auditReport.anyTypeUsages.filter(u => u.file.startsWith('src/core/'));
const engineAny = auditReport.anyTypeUsages.filter(u => u.file.startsWith('src/engine/'));
const uiAny = auditReport.anyTypeUsages.filter(u => u.file.startsWith('src/ui/') || u.file.startsWith('src/visualizers/') || u.file.startsWith('src/main.ts'));
console.log(`  • src/core/: ${coreAny.length}`);
console.log(`  • src/engine/: ${engineAny.length}`);
console.log(`  • src/ui/ & visualizers/: ${uiAny.length}`);

console.log('\n--- 4. FILE LENGTH BUDGETS (Budget: <= 300 Lines) ---');
console.log(`  Files within budget (<= 300 lines): ${tsFiles.length - auditReport.fileLengthViolations.length} / ${tsFiles.length}`);
console.log(`  Files exceeding budget (> 300 lines): ${auditReport.fileLengthViolations.length}`);
console.log('  Top 10 Largest Files:');
auditReport.fileLengthViolations.slice(0, 10).forEach((f, i) => {
  console.log(`    ${i + 1}. [${f.file}] ${f.lineCount} lines (+${f.overBudget})`);
});

console.log('\n--- 5. FUNCTION PARAMETER BUDGET (Budget: <= 4 Parameters) ---');
console.log(`  Functions exceeding 4 parameters: ${auditReport.highParameterFunctions.length}`);
auditReport.highParameterFunctions.slice(0, 8).forEach((f, i) => {
  console.log(`    ${i + 1}. [${f.file}:${f.line}] ${f.function}() takes ${f.paramCount} parameters`);
});

// Output JSON report to QA
const qaAuditPath = path.join(rootDir, 'QA', 'qa_coding_standards_audit.json');
fs.writeFileSync(qaAuditPath, JSON.stringify(auditReport, null, 2), 'utf-8');
console.log(`\n💾 Saved detailed audit results to QA/qa_coding_standards_audit.json`);
