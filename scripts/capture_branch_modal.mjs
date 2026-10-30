import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
async function captureStep(step, filename) {
  const destPath = path.join(rootDir, 'QA', 'screenshots', filename);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_prof_${step}_${Date.now()}`);
  const tempOut = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_out_${step}_${Date.now()}.png`);

  fs.mkdirSync(tempProfile, { recursive: true });

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1920,1080',
    `--screenshot=${tempOut}`,
    `http://localhost:3000/?qa_step=${step}`
  ];

  console.log(`Capturing ${step} -> ${filename}...`);
  const res = spawnSync(edgePath, args, { encoding: 'utf8', timeout: 20000 });
  console.log('Edge exit status:', res.status);

  if (fs.existsSync(tempOut)) {
    fs.copyFileSync(tempOut, destPath);
    console.log('Successfully saved to:', destPath);
  } else {
    console.error('Screenshot temp file was not generated for', step);
    if (res.stderr) console.error('stderr:', res.stderr);
    if (res.stdout) console.log('stdout:', res.stdout);
  }

  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (_) {}
}

await captureStep('branch_modal', 'verif_evolutionary_branches_modal.png');
await captureStep('branch_fork_wizard', 'verif_evolutionary_branch_fork_wizard.png');

