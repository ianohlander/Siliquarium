import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const destDir = path.join(rootDir, 'QA', 'screenshots');

const pages = [
  {
    name: 'verify_docs_unit1.png',
    file: path.join(rootDir, 'docs', 'curriculum', 'unit1_prebiotic_threshold.html')
  },
  {
    name: 'verify_docs_unit2.png',
    file: path.join(rootDir, 'docs', 'curriculum', 'unit2_logic_of_life.html')
  },
  {
    name: 'verify_docs_epistemic.png',
    file: path.join(rootDir, 'docs', 'EPISTEMIC_FOUNDATIONS.html')
  },
  {
    name: 'verify_docs_theoretical.png',
    file: path.join(rootDir, 'docs', 'THEORETICAL_MODEL.html')
  }
];

for (const p of pages) {
  const fileUrl = 'file:///' + p.file.replace(/\\/g, '/');
  const outPath = path.join(destDir, p.name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_prof_docs_${p.name}`);

  console.log(`Capturing: ${p.name} from ${fileUrl}`);
  spawnSync(edgePath, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--virtual-time-budget=3000',
    '--window-size=1600,1200',
    `--user-data-dir=${tempProfile}`,
    `--screenshot=${outPath}`,
    fileUrl
  ]);

  if (fs.existsSync(tempProfile)) {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  }

  if (fs.existsSync(outPath)) {
    console.log(`  ✓ Successfully captured ${p.name} (${fs.statSync(outPath).size} bytes)`);
  } else {
    console.warn(`  ✗ Failed to capture ${p.name}`);
  }
}
