import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const diagramsDir = path.join(rootDir, 'docs', 'assets', 'diagrams');

console.log('🔍 Auditing SVG diagrams and markdown references...');

// 1. Audit SVG files on disk
const files = fs.readdirSync(diagramsDir).filter(f => f.endsWith('.svg'));
console.log(`Found ${files.length} SVG diagrams in docs/assets/diagrams/`);

let errorCount = 0;
for (const file of files) {
  const filePath = path.join(diagramsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('<?xml') && !content.startsWith('<svg')) {
    console.error(`❌ ${file} does not have valid SVG root tag!`);
    errorCount++;
  }
  if (!content.includes('</svg>')) {
    console.error(`❌ ${file} missing closing </svg> tag!`);
    errorCount++;
  }
  if (content.length < 500) {
    console.error(`❌ ${file} suspiciously small (${content.length} bytes)!`);
    errorCount++;
  }
}

// 2. Audit all markdown files for image references
const docsDir = path.join(rootDir, 'docs');
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      scanDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const mdContent = fs.readFileSync(fullPath, 'utf8');
      const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      while ((match = imgRegex.exec(mdContent)) !== null) {
        const imgPath = match[2];
        if (imgPath.startsWith('http')) continue;
        const resolvedPath = path.resolve(path.dirname(fullPath), imgPath);
        if (!fs.existsSync(resolvedPath)) {
          console.error(`❌ Broken image link in ${path.relative(rootDir, fullPath)}: ${imgPath}`);
          errorCount++;
        }
      }
    }
  }
}
scanDir(docsDir);

if (errorCount === 0) {
  console.log(`✅ All ${files.length} SVG diagrams verified with 0 broken links!`);
} else {
  console.error(`🚨 Found ${errorCount} diagram errors.`);
  process.exit(1);
}
