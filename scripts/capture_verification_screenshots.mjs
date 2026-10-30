#!/usr/bin/env node

/**
 * 📸 Siliquarium Verification Screenshot Capture
 * Captures verification screenshots via Microsoft Edge to prove fixes for PL-01 through PL-06.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const qaDir = path.join(rootDir, 'QA');
const screenshotsDir = path.join(qaDir, 'screenshots');

fs.mkdirSync(screenshotsDir, { recursive: true });

const captures = [
  {
    name: 'verif_01_observatory_1920x1080.png',
    url: 'http://localhost:3000/',
    size: '1920,1080'
  },
  {
    name: 'verif_02_observatory_1440x900.png',
    url: 'http://localhost:3000/',
    size: '1440,900'
  },
  {
    name: 'verif_lens_vascular.png',
    url: 'http://localhost:3000/?qa_step=lens_vascular',
    size: '1920,1080'
  },
  {
    name: 'verif_lens_potential.png',
    url: 'http://localhost:3000/?qa_step=lens_potential',
    size: '1920,1080'
  },
  {
    name: 'verif_lens_hybrid.png',
    url: 'http://localhost:3000/?qa_step=lens_hybrid',
    size: '1920,1080'
  },
  {
    name: 'verif_evolutionary_branches_modal.png',
    url: 'http://localhost:3000/?qa_step=branch_modal',
    size: '1920,1080'
  }
];

console.log(`📸 Capturing ${captures.length} verification screenshots via Microsoft Edge...`);

for (let i = 0; i < captures.length; i++) {
  const cap = captures[i];
  const destPath = path.join(screenshotsDir, cap.name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_verif_prof_${Date.now()}_${i}`);
  const tempOut = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_verif_out_${Date.now()}_${i}.png`);

  if (fs.existsSync(tempProfile)) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  }
  fs.mkdirSync(tempProfile, { recursive: true });
  if (fs.existsSync(tempOut)) try { fs.unlinkSync(tempOut); } catch (_) {}

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${tempProfile}`,
    `--window-size=${cap.size}`,
    `--screenshot=${tempOut}`,
    cap.url
  ];

  console.log(`[${i + 1}/${captures.length}] Capturing ${cap.name} (${cap.size})...`);
  spawnSync(edgePath, args, { encoding: 'utf8', timeout: 16000 });
  spawnSync('taskkill', ['/F', '/IM', 'msedge.exe'], { stdio: 'ignore' });
  spawnSync('node', ['-e', 'setTimeout(() => {}, 800)']);

  if (fs.existsSync(tempOut)) {
    fs.copyFileSync(tempOut, destPath);
    try { fs.unlinkSync(tempOut); } catch (_) {}
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Created: ${cap.name} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`  ⚠️ Did not generate ${cap.name}`);
  }
}

console.log('🎉 Verification captures complete!');
