import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diagramsDir = path.resolve(__dirname, '../docs/assets/diagrams');

const files = fs.readdirSync(diagramsDir).filter(f => f.startsWith('fig_circuit_') && f.endsWith('.svg'));

console.log(`Auditing ${files.length} circuit diagram SVGs...`);

for (const file of files) {
  const content = fs.readFileSync(path.join(diagramsDir, file), 'utf8');
  let issues = 0;

  // Extract all text elements with their classes, fonts, coordinates, and content
  const textRegex = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  let match;
  while ((match = textRegex.exec(content)) !== null) {
    const attrs = match[1];
    const text = match[2].trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // Extract x, y, font-size, class
    const xMatch = attrs.match(/\bx="([^"]+)"/);
    const yMatch = attrs.match(/\by="([^"]+)"/);
    const fsMatch = attrs.match(/\bfont-size="([^"]+)"/);
    const classMatch = attrs.match(/\bclass="([^"]+)"/);
    
    const x = xMatch ? parseFloat(xMatch[1]) : 0;
    const y = yMatch ? parseFloat(yMatch[1]) : 0;
    const cls = classMatch ? classMatch[1] : '';
    let fontSize = fsMatch ? parseFloat(fsMatch[1]) : (cls === 'title' ? 15 : cls === 'code' ? 10.5 : cls === 'badge' ? 9.5 : cls === 'subtitle' ? 11.5 : 11);

    const isMono = cls === 'code' || cls === 'badge' || cls === 'title';
    const charWidth = isMono ? (fontSize * 0.62) : (fontSize * 0.53);
    const estWidth = text.length * charWidth;
    const rightEdge = x + estWidth;

    // Sub-box width is 413px, card width is 445px
    // If x < 25 (inside sub-box), max allowable right edge is 405px
    // If x is for card title or subtitle (x=16..20), max allowable right edge is 435px
    const limit = (x < 25 && cls !== 'title' && cls !== 'subtitle') ? 405 : 435;
    if (rightEdge > limit && cls !== 'title' && cls !== 'subtitle') {
      if (issues === 0) console.log(`\n========================================\nFILE: ${file}\n========================================`);
      issues++;
      console.log(`  [OVERFLOW RISKY] (${cls}, fs=${fontSize}, len=${text.length}, estWidth=${Math.round(estWidth)}px, right=${Math.round(rightEdge)}px, limit=${limit}): "${text}"`);
    }
  }
  if (issues === 0) {
    console.log(`✅ ${file}: All text safely within boundaries.`);
  }
}
