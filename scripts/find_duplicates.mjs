import fs from 'node:fs';
import path from 'node:path';

let remaining = 0;
function checkDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') checkDir(full);
    } else if (f.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      const regex = /(<sup id="cite_ref-([^"]+)"[^>]*>.*?<\/sup>)(\s*<sup id="cite_ref-\2"[^>]*>.*?<\/sup>)+/g;
      const matches = content.match(regex);
      if (matches) {
        console.log('Still remaining in:', full);
        matches.forEach(m => console.log('  ', m));
        remaining++;
      }
    }
  }
}

checkDir('docs');
for (const f of fs.readdirSync('.')) {
  if (f.endsWith('.md')) {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /(<sup id="cite_ref-([^"]+)"[^>]*>.*?<\/sup>)(\s*<sup id="cite_ref-\2"[^>]*>.*?<\/sup>)+/g;
    const matches = content.match(regex);
    if (matches) {
      console.log('Still remaining in root file:', f);
      matches.forEach(m => console.log('  ', m));
      remaining++;
    }
  }
}
console.log('Total remaining files with duplicates:', remaining);
