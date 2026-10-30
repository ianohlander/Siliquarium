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

const asciiPatterns = [
  /\+[-=]{3,}\+/,
  /[┌├└][─┬┴┼]+[┐┤┘]/,
  /\| {3,}\|/,
  /\[={4,}\]/,
  /\+--+/,
  /-->.*-->/,
  /\|-->/,
  /──►/,
  /└──/,
  /[▲▼◄►│─]/,
  /\+-\s*\w+/
];

console.log(`Scanning ${mdFiles.length} markdown files for diagrams inside code blocks...`);

const matches = [];

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockStart = 0;
  let codeBlockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockStart = i + 1;
        codeBlockLines = [];
      } else {
        inCodeBlock = false;
        // Analyze finished code block
        if (codeBlockLang === '' || codeBlockLang === 'text' || codeBlockLang === 'ascii') {
          const blockStr = codeBlockLines.join('\n');
          let hasAscii = false;
          for (const pattern of asciiPatterns) {
            if (pattern.test(blockStr)) {
              hasAscii = true;
              break;
            }
          }
          if (hasAscii) {
            matches.push({
              file,
              start: codeBlockStart,
              end: i + 1,
              lang: codeBlockLang,
              preview: codeBlockLines[0] || '',
              linesCount: codeBlockLines.length
            });
          }
        }
      }
    } else if (inCodeBlock) {
      codeBlockLines.push(line);
    }
  }
}

console.log(`\nFound ${matches.length} ASCII / text diagram blocks:`);
for (const m of matches) {
  console.log(`${m.file}:${m.start}-${m.end} [${m.lang}] (${m.linesCount} lines) - ${m.preview}`);
}
