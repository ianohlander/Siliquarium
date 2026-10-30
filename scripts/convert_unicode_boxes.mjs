import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '../docs/MULTICELLULAR_MORPHOLOGY_GUIDE.md');

let content = fs.readFileSync(targetPath, 'utf8');

const regex = /```\r?\n┌─+┐\r?\n│\s*([^\r\n]+?)\s*│\r?\n├─+┬─+┤\r?\n│\s*Formal Invariant\s*│\s*([^\r\n]+?)\s*│\r?\n│\s*Biological Role\s*│\s*([^\r\n]+?)\s*│\r?\n│\s*Natural Equivalents\s*│\s*([^\r\n]+?)\s*│\r?\n└─+┴─+┘\r?\n```/g;

let count = 0;
content = content.replace(regex, (match, title, invariant, role, natural) => {
  count++;
  return `> [!NOTE]
> ### ${title.trim()}
> - **Formal Invariant:** \`${invariant.trim()}\`
> - **Biophysical Role:** ${role.trim()}
> - **Natural Equivalents:** *${natural.trim()}*`;
});

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Converted ${count} Unicode boxes to Markdown Alert cards!`);
