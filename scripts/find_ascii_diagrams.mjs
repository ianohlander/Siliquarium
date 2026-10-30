import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const found = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.gemini', 'brain', 'scratch'].includes(entry.name)) {
        scanDir(full);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      let inBlock = false;
      let blockLang = '';
      let blockLines = [];
      let startLine = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('```')) {
          if (!inBlock) {
            inBlock = true;
            blockLang = line.trim().slice(3).trim();
            blockLines = [];
            startLine = i + 1;
          } else {
            inBlock = false;
            const blockContent = blockLines.join('\n');
            const isIgnoredLang = ['typescript', 'ts', 'javascript', 'js', 'mjs', 'json', 'bash', 'sh', 'html', 'mermaid', 'css', 'diff'].includes(blockLang.toLowerCase());
            
            if (!isIgnoredLang && blockLines.length > 2) {
              const hasAsciiArt = /[┌┐└┘├┤┬┴┼─│━┏┓┗┛┣┫┳┻╋]/.test(blockContent) ||
                (blockContent.includes('+---') || blockContent.includes('|   |') || blockContent.includes('/\\') || blockContent.includes('---►') || blockContent.includes('===>') || (blockContent.includes('+--') && blockContent.includes('|')));

              if (hasAsciiArt) {
                found.push({
                  file: path.relative(rootDir, full).replace(/\\/g, '/'),
                  startLine,
                  endLine: i + 1,
                  linesCount: blockLines.length,
                  title: blockLines.find(l => l.trim().length > 0 && !l.includes('┌') && !l.includes('+--'))?.trim() || ''
                });
              }
            }
          }
        } else if (inBlock) {
          blockLines.push(line);
        }
      }
    }
  }
}

scanDir(rootDir);
fs.writeFileSync(path.join(rootDir, 'found_ascii_diagrams.json'), JSON.stringify(found, null, 2));

const files = {};
for (const item of found) {
  files[item.file] = (files[item.file] || 0) + 1;
}
console.log(`Total ASCII diagrams found: ${found.length}`);
console.log('Breakdown by file:');
for (const [f, count] of Object.entries(files)) {
  console.log(`  - ${f}: ${count}`);
}
