import fs from 'fs';
import path from 'path';

function findMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'scratch' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const mdFiles = findMarkdownFiles('.');
console.log(`Auditing math expressions in ${mdFiles.length} markdown files...`);

let totalInline = 0;
let totalDisplay = 0;
let issues = [];

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  let inCodeBlock = false;
  let inDisplayMath = false;
  let displayMathContent = '';
  let displayMathStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Check display math $$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2 && !inDisplayMath) {
      // Single-line display math
      totalDisplay++;
      const math = trimmed.slice(2, -2).trim();
      checkMath(file, i + 1, math, 'display (single line)');
      continue;
    }

    if (trimmed.startsWith('$$') && !inDisplayMath) {
      inDisplayMath = true;
      displayMathStart = i + 1;
      displayMathContent = trimmed.slice(2);
      continue;
    } else if (inDisplayMath) {
      if (trimmed.endsWith('$$')) {
        inDisplayMath = false;
        totalDisplay++;
        displayMathContent += '\n' + trimmed.slice(0, -2);
        checkMath(file, displayMathStart, displayMathContent, 'display (multi-line)');
        displayMathContent = '';
      } else {
        displayMathContent += '\n' + line;
      }
      continue;
    }

    // Check inline math $...$ in non-display lines
    // Match unescaped $...$
    const inlineMatches = [];
    let inInline = false;
    let inlineStart = -1;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '$' && (c === 0 || line[c - 1] !== '\\')) {
        if (!inInline) {
          inInline = true;
          inlineStart = c;
        } else {
          inInline = false;
          const math = line.substring(inlineStart + 1, c);
          if (math.length > 0) {
            inlineMatches.push({ math, col: inlineStart });
          }
        }
      }
    }

    for (const match of inlineMatches) {
      totalInline++;
      checkMath(file, i + 1, match.math, 'inline', match.col);
    }
  }

  if (inDisplayMath) {
    issues.push({
      file,
      line: displayMathStart,
      msg: 'Unclosed display math $$ block at end of file'
    });
  }
}

function checkMath(file, line, math, type, col = 0) {
  // 1. Check brace balance
  let braceCount = 0;
  for (let i = 0; i < math.length; i++) {
    if (math[i] === '{' && (i === 0 || math[i - 1] !== '\\')) braceCount++;
    if (math[i] === '}' && (i === 0 || math[i - 1] !== '\\')) braceCount--;
    if (braceCount < 0) {
      issues.push({ file, line, type, math, msg: 'Negative brace depth (unmatched closing brace `}`) at position ' + i });
      return;
    }
  }
  if (braceCount !== 0) {
    issues.push({ file, line, type, math, msg: `Unbalanced braces (depth ${braceCount}) in math` });
  }

  // 2. Check double subscripts / superscripts without grouping (e.g. x_a_b or x^a^b)
  // LaTeX allows x_{a_b} but not x_a_b
  const doubleSub = /([^\\]_|\b_)[a-zA-Z0-9]_([a-zA-Z0-9])/;
  const doubleSuper = /([^\\]\^|\b\^)[a-zA-Z0-9]\^([a-zA-Z0-9])/;
  if (doubleSub.test(math)) {
    issues.push({ file, line, type, math, msg: 'Double subscript without grouping: ' + math.match(doubleSub)[0] });
  }
  if (doubleSuper.test(math)) {
    issues.push({ file, line, type, math, msg: 'Double superscript without grouping: ' + math.match(doubleSuper)[0] });
  }

  // 3. Check for raw unescaped HTML tags inside math (except < or > as comparison operators)
  if (/<[a-zA-Z][^>]*>/.test(math)) {
    issues.push({ file, line, type, math, msg: 'HTML tag found inside math: ' + math });
  }

  // 4. Check for \frac without two arguments or unbalanced frac
  const fracMatches = math.match(/\\frac(?![a-zA-Z])/g);
  if (fracMatches) {
    // Basic sanity check
    let expectedBraces = fracMatches.length * 2;
    // Just verify it doesn't look cut off
    if (math.endsWith('\\frac') || math.endsWith('\\frac{')) {
      issues.push({ file, line, type, math, msg: 'Incomplete \\frac command' });
    }
  }
}

console.log(`\nChecked ${totalDisplay} display math blocks and ${totalInline} inline math blocks.`);
console.log(`Found ${issues.length} potential issues:\n`);

for (const issue of issues) {
  console.log(`[${issue.file}:${issue.line}] (${issue.type}): ${issue.msg}`);
  if (issue.math) {
    console.log(`   Math: ${issue.math.slice(0, 100)}${issue.math.length > 100 ? '...' : ''}`);
  }
}
