#!/usr/bin/env node

/**
 * 🏛️ Comprehensive Siliquarium Coding QA & Technical Debt Audit
 * Evaluates the codebase against standards/DEVELOPMENT_STANDARDS.md:
 * - Complexity Budgets: Cyclomatic Complexity (<= 7), Function Length (<= 60 lines),
 *   File Length (<= 300 lines), Parameter Count (<= 4), Nesting Depth (<= 3).
 * - Anti-Monolith & No Kitchen Sink files.
 * - Zero-DOM Mandate in Core & Engine.
 * - Strict Type Safety & Zero 'any' types.
 * - OOP Encapsulation (No public mutable fields on Domain entities).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function getAllTsFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllTsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = getAllTsFiles(srcDir);

// Metrics Collectors
const report = {
  totalFiles: allFiles.length,
  filesBySubsystem: {
    core: 0,
    engine: 0,
    server: 0,
    ui: 0,
    visualizers: 0
  },
  fileLengthViolations: [],
  functionLengthViolations: [],
  cyclomaticComplexityViolations: [],
  highParameterViolations: [],
  nestingDepthViolations: [],
  forbiddenFileViolations: [],
  zeroDomViolations: [],
  anyTypeViolations: [],
  encapsulationViolations: []
};

// 1. Forbidden File Names
const forbiddenRegex = /^(utils|helpers|common|misc|manager|shared)\.ts$/i;
for (const file of allFiles) {
  const base = path.basename(file);
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  if (forbiddenRegex.test(base)) {
    report.forbiddenFileViolations.push(rel);
  }

  if (rel.startsWith('src/core/')) report.filesBySubsystem.core++;
  else if (rel.startsWith('src/engine/')) report.filesBySubsystem.engine++;
  else if (rel.startsWith('src/server/')) report.filesBySubsystem.server++;
  else if (rel.startsWith('src/ui/')) report.filesBySubsystem.ui++;
  else if (rel.startsWith('src/visualizers/')) report.filesBySubsystem.visualizers++;
}

// Token parser & analyzer for each file
for (const file of allFiles) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');
  const lines = code.split('\n');

  // 2. File Length Budget (<= 300 lines)
  if (lines.length > 300) {
    report.fileLengthViolations.push({
      file: rel,
      lines: lines.length,
      overBudget: lines.length - 300
    });
  }

  // 3. Zero-DOM Mandate in Core & Engine & Server
  const isCoreOrEngine = rel.startsWith('src/core/') || rel.startsWith('src/engine/') || rel.startsWith('src/server/');
  if (isCoreOrEngine) {
    const domTokens = ['document.', 'window.', 'HTMLElement', 'HTMLCanvasElement', 'localStorage', 'CanvasRenderingContext2D'];
    lines.forEach((l, idx) => {
      const t = l.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;
      for (const tok of domTokens) {
        if (l.includes(tok) && !l.includes('typeof window') && !l.includes('typeof document') && !l.includes('typeof localStorage')) {
          report.zeroDomViolations.push({
            file: rel,
            line: idx + 1,
            token: tok,
            snippet: t.slice(0, 90)
          });
        }
      }
    });
  }

  // 4. Any Type Usages
  lines.forEach((l, idx) => {
    const t = l.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    // Match ': any', 'as any', '<any>', 'any[]'
    const anyRegex = /(:|\bas\b|<)\s*any(\b|\[\]|>)/;
    if (anyRegex.test(t)) {
      report.anyTypeViolations.push({
        file: rel,
        line: idx + 1,
        snippet: t.slice(0, 90)
      });
    }
  });

  // 5. Encapsulation Violations in Domain entities (public mutable properties in src/core/domain)
  if (rel.startsWith('src/core/domain/')) {
    lines.forEach((l, idx) => {
      const t = l.trim();
      if (t.startsWith('//') || t.startsWith('*')) return;
      // check 'public foo:' that is not readonly, not a method, not a getter
      const publicFieldMatch = t.match(/^public\s+(?!readonly\b|get\b|set\b|static\b)([a-zA-Z0-9_$]+)\s*[:=]/);
      if (publicFieldMatch) {
        report.encapsulationViolations.push({
          file: rel,
          line: idx + 1,
          property: publicFieldMatch[1],
          snippet: t.slice(0, 80)
        });
      }
    });
  }

  // 6. Function-level Metrics (Cyclomatic Complexity, Length, Parameters, Nesting Depth)
  // Parsing functions and methods via brace tracking
  let currentFunc = null;
  let braceDepth = 0;
  let funcBraceStart = 0;
  let maxDepthInFunc = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmed = line.trim();

    // Check function/method signature start
    const fnMatch = trimmed.match(/(?:public|private|protected|static|async|\s)*\s*(?:function\s+([a-zA-Z0-9_$]+)|([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*(?::\s*[^;{]+)?\s*\{|([a-zA-Z0-9_$]+)\s*=\s*\([^)]*\)\s*=>\s*\{)/);

    if (fnMatch && !currentFunc && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
      const fnName = fnMatch[1] || fnMatch[2] || fnMatch[3] || 'anonymous';
      
      // Extract parameter signature
      let params = [];
      const parenStart = line.indexOf('(');
      if (parenStart !== -1) {
        // Find closing paren (handling multi-line params)
        let fullSig = line.slice(parenStart);
        let j = i;
        while (!fullSig.includes(')') && j < lines.length - 1) {
          j++;
          fullSig += ' ' + lines[j];
        }
        const parenEnd = fullSig.indexOf(')');
        if (parenEnd !== -1) {
          const innerParams = fullSig.slice(1, parenEnd).trim();
          if (innerParams.length > 0) {
            // Split params by comma, respecting generics/objects
            let pCount = 0;
            let depth = 0;
            for (let c of innerParams) {
              if (c === '<' || c === '{' || c === '(') depth++;
              else if (c === '>' || c === '}' || c === ')') depth--;
              else if (c === ',' && depth === 0) pCount++;
            }
            params.length = pCount + 1;
          }
        }
      }

      currentFunc = {
        name: fnName,
        startLine: lineNum,
        paramCount: params.length,
        complexity: 1,
        maxDepth: 1
      };
      funcBraceStart = braceDepth;
      maxDepthInFunc = 1;
    }

    // Count braces
    let openCount = 0;
    let closeCount = 0;
    let inStr = false;
    let strChar = '';

    for (let cIdx = 0; cIdx < line.length; cIdx++) {
      const ch = line[cIdx];
      const prev = line[cIdx - 1];
      if ((ch === '"' || ch === '\'' || ch === '`') && prev !== '\\') {
        if (!inStr) { inStr = true; strChar = ch; }
        else if (strChar === ch) { inStr = false; }
      }
      if (!inStr) {
        if (ch === '{') openCount++;
        else if (ch === '}') closeCount++;
      }
    }

    braceDepth += (openCount - closeCount);

    if (currentFunc) {
      const relDepth = braceDepth - funcBraceStart;
      if (relDepth > maxDepthInFunc) maxDepthInFunc = relDepth;

      // Complexity counting in function body
      if (!trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        // match branches: if, else if, while, for, case, catch, &&, ||, ??, ? :
        const branchMatches = line.match(/\b(if|while|for|case|catch)\b|\&\&|\|\||\?\?/g);
        if (branchMatches) {
          currentFunc.complexity += branchMatches.length;
        }
        if (line.includes('?') && !line.includes('?:') && !line.includes('?.') && line.includes(':')) {
          currentFunc.complexity += 1;
        }
      }

      // Check if function ended
      if (braceDepth <= funcBraceStart && (openCount > 0 || closeCount > 0)) {
        const fnLength = lineNum - currentFunc.startLine + 1;
        currentFunc.length = fnLength;
        currentFunc.maxDepth = maxDepthInFunc;

        // Check against budgets
        if (currentFunc.complexity > 7) {
          report.cyclomaticComplexityViolations.push({
            file: rel,
            function: currentFunc.name,
            line: currentFunc.startLine,
            complexity: currentFunc.complexity,
            overBudget: currentFunc.complexity - 7
          });
        }

        if (fnLength > 60) {
          report.functionLengthViolations.push({
            file: rel,
            function: currentFunc.name,
            line: currentFunc.startLine,
            lines: fnLength,
            overBudget: fnLength - 60
          });
        }

        if (currentFunc.paramCount > 4) {
          report.highParameterViolations.push({
            file: rel,
            function: currentFunc.name,
            line: currentFunc.startLine,
            params: currentFunc.paramCount,
            overBudget: currentFunc.paramCount - 4
          });
        }

        if (maxDepthInFunc > 3) {
          report.nestingDepthViolations.push({
            file: rel,
            function: currentFunc.name,
            line: currentFunc.startLine,
            depth: maxDepthInFunc,
            overBudget: maxDepthInFunc - 3
          });
        }

        currentFunc = null;
      }
    }
  }
}

// Sort violations
report.fileLengthViolations.sort((a, b) => b.lines - a.lines);
report.cyclomaticComplexityViolations.sort((a, b) => b.complexity - a.complexity);
report.functionLengthViolations.sort((a, b) => b.lines - a.lines);
report.highParameterViolations.sort((a, b) => b.params - a.params);
report.nestingDepthViolations.sort((a, b) => b.depth - a.depth);

// Save report to file
fs.writeFileSync(path.join(rootDir, 'QA', 'coding_qa_technical_debt_report.json'), JSON.stringify(report, null, 2), 'utf8');

console.log('Audit completed and saved to QA/coding_qa_technical_debt_report.json');
