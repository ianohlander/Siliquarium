import fs from 'fs';
import path from 'path';

const notesPath = 'docs/CIRCUIT_PALEONTOLOGY_NOTES.md';
let content = fs.readFileSync(notesPath, 'utf8');

// Match note blocks
// Each note currently starts with "### <a id="note-X"></a>Note X: Title"
const regex = /### <a id="note-(\d+)"><\/a>Note \d+:\s*([^\r\n]+)\r?\n([\s\S]*?)(?=(?:---\r?\n\r?\n### <a id="note-\d+">|$))/g;

let match;
const notes = [];
while ((match = regex.exec(content)) !== null) {
  notes.push({
    num: parseInt(match[1], 10),
    title: match[2].trim(),
    body: match[3].trim()
  });
}

console.log(`Found ${notes.length} notes.`);

if (notes.length !== 36) {
  console.error(`Expected 36 notes, found ${notes.length}`);
  process.exit(1);
}

// Build TOC
let toc = '## Master Table of Contents\n';
for (const n of notes) {
  toc += `- [Note ${n.num}: ${n.title}](#note-${n.num})\n`;
}

// Build Notes Body
let notesBody = '';
for (const n of notes) {
  notesBody += `<div id="note-${n.num}" class="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 my-8 shadow-xl">
<div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
  <div class="text-base font-bold font-mono text-cyan-300 flex items-center gap-2">
    <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs">Note ${n.num}</span>
    <span>${n.title}</span>
  </div>
  <a href="CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html#note-${n.num}" class="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold">
    <span>↩ Return to Field Guide</span>
  </a>
</div>

${n.body}

</div>\n\n`;
}

// Find header part up to "## Master Table of Contents"
const headerEndIdx = content.indexOf('## Master Table of Contents');
if (headerEndIdx === -1) {
  console.error('Could not find Table of Contents header');
  process.exit(1);
}
const header = content.slice(0, headerEndIdx);

const newContent = `${header}${toc}\n---\n\n${notesBody}`;

fs.writeFileSync(notesPath, newContent, 'utf8');
console.log('Successfully formatted docs/CIRCUIT_PALEONTOLOGY_NOTES.md with 36 structured note cards!');
