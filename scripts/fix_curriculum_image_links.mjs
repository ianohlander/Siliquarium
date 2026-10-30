import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const curriculumDir = path.join(rootDir, 'docs', 'curriculum');

const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.md'));
for (const file of files) {
  const filePath = path.join(curriculumDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace image paths that should be relative to parent docs directory
  content = content.replace(/!\[([^\]]*)\]\(assets\/diagrams\//g, '![$1](../assets/diagrams/');
  content = content.replace(/!\[([^\]]*)\]\(assets\/screenshots\//g, '![$1](../assets/screenshots/');
  content = content.replace(/!\[([^\]]*)\]\(QA\/screenshots\//g, '![$1](../assets/screenshots/');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed image paths in docs/curriculum/${file}`);
}
