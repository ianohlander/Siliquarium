import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getMd(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) res = res.concat(getMd(p));
    else if (f.name.endsWith('.md')) res.push(p);
  }
  return res;
}

const files = getMd(rootDir);
let totalReplacements = 0;
let modifiedFiles = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const count = (content.match(/\\color\{(#(?:[0-9a-fA-F]{3}){1,2}|[a-zA-Z]+)\}\{/g) || []).length;
  if (count > 0) {
    const updated = content.replace(/\\color\{(#(?:[0-9a-fA-F]{3}){1,2}|[a-zA-Z]+)\}\{/g, '\\textcolor{$1}{');
    fs.writeFileSync(file, updated, 'utf8');
    totalReplacements += count;
    modifiedFiles++;
    console.log(`Updated ${path.relative(rootDir, file)}: ${count} replacements`);
  }
}

console.log(`\nSuccessfully converted ${totalReplacements} \\color to \\textcolor across ${modifiedFiles} files.`);
