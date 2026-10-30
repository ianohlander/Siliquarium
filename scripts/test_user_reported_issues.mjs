import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = 'C:\\Users\\ianoh\\AppData\\Local\\Temp';
const outDir = path.resolve('H:\\My Drive\\Repos\\Siliquarium\\QA\\screenshots');

async function run() {
  const testUrl = 'http://localhost:3000/?qa_step=selected_subterranean';
  const tempProfile = path.join(tempDir, `edge_test_user_issues_${Date.now()}`);
  const tempPng = path.join(tempDir, `test_user_issues_${Date.now()}.png`);
  const finalPng = path.join(outDir, 'verif_user_issues_fixed.png');

  console.log('Capturing screenshot of selected subterranean pore at 1440x900...');
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1440,900',
    `--user-data-dir=${tempProfile}`,
    `--screenshot=${tempPng}`,
    testUrl
  ];

  spawnSync(edgePath, args, { stdio: 'inherit', timeout: 20000 });

  if (fs.existsSync(tempPng)) {
    fs.copyFileSync(tempPng, finalPng);
    console.log(`✓ Screenshot successfully saved to ${finalPng}`);
  } else {
    console.error('Failed to capture screenshot');
  }

  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
}

run();
