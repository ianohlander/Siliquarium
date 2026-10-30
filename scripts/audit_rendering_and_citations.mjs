import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Gather all markdown and html files in docs/, standards/, QA/, and root
function getFiles(dir, extensions = ['.md', '.html']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.gemini' && entry.name !== 'dist') {
        files = files.concat(getFiles(full, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const allMdFiles = getFiles(rootDir, ['.md']);
console.log(`Found ${allMdFiles.length} Markdown files to audit.\n`);

const issues = [];

function addIssue(file, type, line, message, snippet = '') {
  issues.push({
    file: path.relative(rootDir, file),
    type,
    line,
    message,
    snippet: snippet.trim().slice(0, 120)
  });
}

for (const file of allMdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  // 1. Audit Mermaid Blocks
  let inMermaid = false;
  let mermaidStartLine = 0;
  let mermaidContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```mermaid')) {
      inMermaid = true;
      mermaidStartLine = i + 1;
      mermaidContent = [];
      continue;
    }

    if (inMermaid) {
      if (trimmed.startsWith('```')) {
        inMermaid = false;
        // Check mermaid content for known syntax pitfalls
        const mText = mermaidContent.join('\n');
        
        // Pitfall 1: Unquoted parentheses or brackets in node text: e.g. A[Label (Extra)] -> should be A["Label (Extra)"]
        // Regex: node shape with brackets [ ... ( ... ) ... ] where not quoted
        mermaidContent.forEach((mLine, idx) => {
          const lNum = mermaidStartLine + idx + 1;
          const trimmedMLine = mLine.trim();
          
          // Check for brackets containing parentheses without quotes
          // e.g. id[Some (text)] but not id["Some (text)"]
          const unquotedParensMatch = trimmedMLine.match(/\b([A-Za-z0-9_-]+)\[([^"\]]*\([^\)]*\)[^"\]]*)\]/);
          if (unquotedParensMatch) {
            addIssue(file, 'MERMAID_UNQUOTED_PARENS', lNum, `Unquoted parentheses in node label: ${unquotedParensMatch[0]} - Mermaid will fail to parse this`, trimmedMLine);
          }

          // Check for unquoted quotes or special chars in shapes: { ... }, ( ... ), [ ... ]
          const unquotedBrackets = trimmedMLine.match(/\b([A-Za-z0-9_-]+)\{([^"\}]*\([^\)]*\)[^"\}]*)\}/);
          if (unquotedBrackets) {
            addIssue(file, 'MERMAID_UNQUOTED_PARENS', lNum, `Unquoted parentheses in diamond label: ${unquotedBrackets[0]}`, trimmedMLine);
          }
        });

      } else {
        mermaidContent.push(line);
      }
    }
  }

  // 2. Audit MathJax / LaTeX Display and Inline Math
  let inDisplayMath = false;
  let mathStartLine = 0;
  let mathBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check single-line display math: $$ ... $$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      const mathBody = trimmed.slice(2, -2);
      checkLatexBraces(file, i + 1, mathBody, trimmed);
    } else if (trimmed.startsWith('$$')) {
      if (inDisplayMath) {
        // closing
        inDisplayMath = false;
        const fullMath = mathBuffer.join('\n');
        checkLatexBraces(file, mathStartLine, fullMath, fullMath.split('\n')[0]);
        mathBuffer = [];
      } else {
        inDisplayMath = true;
        mathStartLine = i + 1;
        mathBuffer = [trimmed.slice(2)];
      }
    } else if (inDisplayMath) {
      if (trimmed.endsWith('$$')) {
        inDisplayMath = false;
        mathBuffer.push(trimmed.slice(0, -2));
        const fullMath = mathBuffer.join('\n');
        checkLatexBraces(file, mathStartLine, fullMath, fullMath.split('\n')[0]);
        mathBuffer = [];
      } else {
        mathBuffer.push(line);
      }
    } else {
      // Inline math check: count unescaped single $
      // Skip code blocks
      // We will check inline math if not in code block
    }
  }

  if (inDisplayMath) {
    addIssue(file, 'UNCLOSED_DISPLAY_MATH', mathStartLine, `Display math block starting at line ${mathStartLine} never closed with $$`);
  }

  // 3. Audit Images and Diagram Links
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check markdown images: ![alt](url)
    const imgMatches = line.matchAll(/!\[(.*?)\]\((.*?)\)/g);
    for (const match of imgMatches) {
      const alt = match[1];
      const src = match[2].trim().split(' ')[0]; // remove any title
      checkAssetExists(file, i + 1, src, line);
    }
    // Check HTML <img src="...">
    const htmlImgMatches = line.matchAll(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of htmlImgMatches) {
      const src = match[1].trim();
      checkAssetExists(file, i + 1, src, line);
    }
  }

  // 4. Audit Markdown Tables
  let inTable = false;
  let tableHeaderCols = 0;
  let tableStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cols = splitTableRowRaw(trimmed);
      if (!inTable) {
        inTable = true;
        tableStartLine = i + 1;
        tableHeaderCols = cols.length;
      } else {
        // Is separator?
        const isSep = cols.every(c => /^[\s:-]+$/.test(c));
        if (!isSep) {
          if (cols.length !== tableHeaderCols) {
            addIssue(file, 'TABLE_COLUMN_MISMATCH', i + 1, `Table row has ${cols.length} columns, but header at line ${tableStartLine} has ${tableHeaderCols} columns`, trimmed);
          }
        }
      }
    } else {
      inTable = false;
    }
  }

  // 5. Audit Citations and Reference Anchors
  // Find all citation references: [^X], [n](#ref-n), [n](#note-n), <a href="#ref-X">
  const citeMatches = content.matchAll(/\[\^([a-zA-Z0-9_\-]+)\]|\[\d+\]\(#(ref-[a-zA-Z0-9_\-]+|note-\d+)\)|href=["']#(ref-[a-zA-Z0-9_\-]+|note-\d+)["']/g);
  // Find all defined anchors in file: id="ref-X", id="note-X", name="ref-X", etc.
  const anchorMatches = new Set();
  const idRegex = /(?:id|name)=["'](ref-[a-zA-Z0-9_\-]+|note-\d+)["']/g;
  let aMatch;
  while ((aMatch = idRegex.exec(content)) !== null) {
    anchorMatches.add(aMatch[1]);
  }
  // Also look for markdown heading or list id: <li id="ref-X"> or {#ref-X}
  const liRegex = /<li\s+[^>]*id=["']([^"']+)["']/g;
  while ((aMatch = liRegex.exec(content)) !== null) {
    anchorMatches.add(aMatch[1]);
  }

  for (const c of citeMatches) {
    const refTarget = c[1] ? `ref-${c[1]}` : (c[2] || c[3]);
    // If it's a reference link to #ref-X in the same document, check if anchor exists
    // (Note: some docs might link to companion/bibliography.html#ref-X, which is fine and external)
    if (refTarget && !anchorMatches.has(refTarget) && !anchorMatches.has(refTarget.replace(/^ref-/, ''))) {
      // Check if this document has a bibliography section or if it delegates to bibliography.md
      const hasLocalBib = /##\s+(?:References|Annotated Academic Bibliography|Primary Literature Citations|Master Bibliography)/i.test(content);
      if (hasLocalBib) {
        addIssue(file, 'ORPHAN_CITATION_REF', 0, `Citation links to '#${refTarget}', but anchor id="${refTarget}" was not found in this document`, c[0]);
      }
    }
  }
}

function checkLatexBraces(file, line, latex, snippet) {
  let openBraces = 0;
  let inEscape = false;
  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];
    if (inEscape) {
      inEscape = false;
      continue;
    }
    if (ch === '\\') {
      inEscape = true;
      continue;
    }
    if (ch === '{') openBraces++;
    if (ch === '}') openBraces--;
    if (openBraces < 0) {
      addIssue(file, 'MATH_UNBALANCED_BRACES', line, `Extra closing brace '}' in LaTeX expression`, snippet);
      return;
    }
  }
  if (openBraces > 0) {
    addIssue(file, 'MATH_UNBALANCED_BRACES', line, `Unclosed opening brace '{' (${openBraces} missing) in LaTeX expression`, snippet);
  }
}

function checkAssetExists(file, line, src, snippet) {
  // If external http/https, ignore
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return;
  // Strip query/hash
  const cleanSrc = src.split('?')[0].split('#')[0];
  
  // Try resolving relative to document dir
  const docDir = path.dirname(file);
  let resolvedPath = path.resolve(docDir, cleanSrc);
  if (fs.existsSync(resolvedPath)) return;

  // Try resolving relative to rootDir
  resolvedPath = path.resolve(rootDir, cleanSrc.replace(/^\/+/, ''));
  if (fs.existsSync(resolvedPath)) return;

  // Try resolving relative to docs/
  resolvedPath = path.resolve(rootDir, 'docs', cleanSrc.replace(/^\/+/, ''));
  if (fs.existsSync(resolvedPath)) return;

  // Try resolving if starts with assets/
  if (cleanSrc.includes('assets/')) {
    const sub = cleanSrc.slice(cleanSrc.indexOf('assets/'));
    resolvedPath = path.resolve(rootDir, 'docs', sub);
    if (fs.existsSync(resolvedPath)) return;
  }

  addIssue(file, 'MISSING_IMAGE_ASSET', line, `Referenced image asset does not exist on disk: '${src}'`, snippet);
}

function splitTableRowRaw(line) {
  const raw = line.trim().slice(1, -1);
  const cells = [];
  let cur = '';
  let inMath = false;
  let inBacktick = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const prev = i > 0 ? raw[i - 1] : '';

    if (ch === '`' && prev !== '\\') {
      inBacktick = !inBacktick;
      cur += ch;
    } else if (ch === '$' && prev !== '\\' && !inBacktick) {
      inMath = !inMath;
      cur += ch;
    } else if (ch === '|' && !inMath && !inBacktick && prev !== '\\') {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

console.log(`\n================================================================================`);
console.log(`AUDIT RESULTS: ${issues.length} ISSUES FOUND`);
console.log(`================================================================================\n`);

const issuesByType = {};
for (const iss of issues) {
  issuesByType[iss.type] = (issuesByType[iss.type] || 0) + 1;
}
console.log('Issues Summary by Type:', issuesByType);
console.log('\nDetailed Issues:\n');

for (const iss of issues) {
  console.log(`[${iss.type}] ${iss.file}:${iss.line}`);
  console.log(`  Message: ${iss.message}`);
  if (iss.snippet) console.log(`  Snippet: ${iss.snippet}`);
  console.log('');
}
