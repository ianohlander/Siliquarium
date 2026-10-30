import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
const mathIssues = [];

for (const file of mdFiles) {
  const rel = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  let inMath = false;
  let mathStart = 0;
  let mathLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      checkMathContent(rel, i + 1, trimmed.slice(2, -2));
    } else if (trimmed.startsWith('$$')) {
      if (inMath) {
        inMath = false;
        checkMathContent(rel, mathStart, mathLines.join('\n'));
        mathLines = [];
      } else {
        inMath = true;
        mathStart = i + 1;
        mathLines = [trimmed.slice(2)];
      }
    } else if (inMath) {
      if (trimmed.endsWith('$$')) {
        inMath = false;
        mathLines.push(trimmed.slice(0, -2));
        checkMathContent(rel, mathStart, mathLines.join('\n'));
        mathLines = [];
      } else {
        mathLines.push(line);
      }
    }
  }

  // Check inline math

  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode || trimmed.startsWith('$$')) continue;

    // Find inline math: $ ... $
    const inlineMatches = line.matchAll(/(^|[^\\])\$([^\$]+?)\$/g);
    for (const im of inlineMatches) {
      const mathInner = im[2];
      if (mathInner.includes('`')) {
        mathIssues.push({ file: rel, line: i + 1, type: 'BACKTICK_IN_INLINE_MATH', snippet: mathInner.slice(0, 80) });
      }
      if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(mathInner)) {
        mathIssues.push({ file: rel, line: i + 1, type: 'EMOJI_IN_INLINE_MATH', snippet: mathInner.slice(0, 80) });
      }
    }
  }
}


function checkMathContent(file, line, math) {
  // Check 1: backticks in math
  if (math.includes('`')) {
    mathIssues.push({ file, line, type: 'BACKTICK_IN_MATH', snippet: math.slice(0, 100) });
  }
  // Check 2: Emoji inside math (causes MathJax missing glyph or crash)
  if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(math)) {
    mathIssues.push({ file, line, type: 'EMOJI_IN_MATH', snippet: math.slice(0, 100) });
  }
  // Check 3: Raw HTML tags inside math (e.g. <span ...> inside $$)
  if (/<[^>]+>/g.test(math)) {
    mathIssues.push({ file, line, type: 'HTML_TAG_IN_MATH', snippet: math.slice(0, 100) });
  }
  // Check 4: Unescaped underscore in \text{...} like \text{GATE_NOT} (should be \text{GATE\_NOT})
  const textMatches = math.matchAll(/\\text\{([^}]+)\}/g);
  for (const tm of textMatches) {
    const textInner = tm[1];
    if (textInner.includes('_') && !textInner.includes('\\_')) {
      mathIssues.push({ file, line, type: 'UNESCAPED_UNDERSCORE_IN_TEXT', snippet: tm[0] });
    }
  }
}

console.log(`Found ${mathIssues.length} Math rendering issues:`);
for (const iss of mathIssues) {
  console.log(`❌ [${iss.file}:${iss.line}] ${iss.type}: ${iss.snippet.replace(/\n/g, ' ')}`);
}
