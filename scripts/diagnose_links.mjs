import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getFiles(dir, ext) {
  let results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.gemini', 'dist'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results = results.concat(getFiles(full, ext));
    else if (item.name.endsWith(ext)) results.push(full);
  }
  return results;
}

const htmlFiles = getFiles(rootDir, '.html');
const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
const broken = [];

for (const htmlFile of htmlFiles) {
  const relPath = path.relative(rootDir, htmlFile);
  if (relPath.startsWith('tmp') || relPath.startsWith('dist')) continue;
  const content = fs.readFileSync(htmlFile, 'utf8');
  const htmlDir = path.dirname(htmlFile);
  const elementIds = new Set();
  let m;
  const idRegex = /(?:id|name)=["']([^"']+)["']/gi;
  while ((m = idRegex.exec(content)) !== null) elementIds.add(m[1]);

  while ((m = linkRegex.exec(content)) !== null) {
    const href = m[1].trim();
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
    if (href.startsWith('#')) {
      const anchor = href.slice(1);
      if (anchor && !elementIds.has(anchor)) {
        if (!anchor.startsWith('ref-') && !anchor.startsWith('note-') && !anchor.startsWith('cite_ref-') && !anchor.startsWith('fnref-')) {
          broken.push({ file: relPath, link: href, issue: `Anchor #${anchor} not in current page` });
        }
      }
    } else if (href.startsWith('file:')) {
      const [u] = href.split('#');
      try {
        const disk = fileURLToPath(decodeURIComponent(u));
        if (!fs.existsSync(disk)) broken.push({ file: relPath, link: href, issue: `Target source file not on disk: ${disk}` });
      } catch (e) {
        broken.push({ file: relPath, link: href, issue: `Bad file URI: ${e.message}` });
      }
    } else {
      const [filePath, fileAnchor] = href.split('#');
      const target = path.resolve(htmlDir, filePath);
      if (!fs.existsSync(target)) {
        broken.push({ file: relPath, link: href, issue: `Target file not found: ${filePath}` });
      } else if (fileAnchor && target.endsWith('.html')) {
        const targetContent = fs.readFileSync(target, 'utf8');
        const reg = new RegExp(`(?:id|name)=["']${fileAnchor}["']`, 'i');
        if (!reg.test(targetContent)) {
          broken.push({ file: relPath, link: href, issue: `Anchor #${fileAnchor} not in ${path.relative(rootDir, target)}` });
        }
      }
    }
  }
}

const lines = [`Total broken internal links: ${broken.length}`];
const group = {};
for (const b of broken) {
  group[b.file] = group[b.file] || [];
  group[b.file].push(`${b.issue} -> ${b.link}`);
}
for (const [file, issues] of Object.entries(group)) {
  lines.push(`\n=== ${file} (${issues.length}) ===`);
  for (const iss of issues) lines.push(`  ${iss}`);
}

fs.writeFileSync(path.join(rootDir, 'broken_links_report.txt'), lines.join('\n'), 'utf8');
console.log(`Saved report to broken_links_report.txt with ${broken.length} broken links across ${Object.keys(group).length} files.`);
