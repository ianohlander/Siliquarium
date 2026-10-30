#!/usr/bin/env node

/**
 * 📸 Siliquarium Real Browser Screenshot Capture Tool
 * Captures high-resolution (1920x1080) genuine browser screenshots from Microsoft Edge
 * for the Digital Naturalist Field Expedition Catalog.
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

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const targets = [
  {
    name: 'naturalist_01_observatory_ecosystem.png',
    url: 'http://localhost:3000/?qa_step=overview',
    desc: 'Observatory Ecosystem: Benthic seafloor with living population and thermodynamic conservation'
  },
  {
    name: 'naturalist_02_specimen_card.png',
    url: 'http://localhost:3000/?qa_step=selected',
    desc: 'Specimen Card: Selected silicoid with Linnaean classification, vitals, and circuit summary'
  },
  {
    name: 'naturalist_03_circuit_autopsy_modal.png',
    url: 'http://localhost:3000/?qa_step=autopsy',
    desc: 'Circuit Autopsy: Boolean truth table, Uri Alon motif scanner badges, and logic oscilloscope'
  },
  {
    name: 'naturalist_04_guided_safari_dossier.png',
    url: 'http://localhost:3000/?qa_step=safari',
    desc: 'Safari Mode: Ecological copilot, behavioral dossier, and lineage tracker'
  },
  {
    name: 'naturalist_05_chronicle_timeline_tour.png',
    url: 'http://localhost:3000/?qa_step=chronicle_tour',
    desc: 'Chronicle Mode: Historical replay timeline with Guided Tour HUD showing scientific narratives'
  },
  {
    name: 'naturalist_06_geodynamic_surge.png',
    url: 'http://localhost:3000/?qa_step=surge',
    desc: 'Geodynamic Perturbation: Hydrothermal boiling surge shockwave on seafloor'
  },
  {
    name: 'naturalist_07_multicellular_plasmodium_lens.png',
    url: 'http://localhost:3000/?qa_step=lens_plasmodium',
    desc: 'Plasmodium Lens: Multicellular syncytial slime mold treadmilling with protoplasmic streamlines'
  },
  {
    name: 'naturalist_08_steiner_vascular_network_lens.png',
    url: 'http://localhost:3000/?qa_step=lens_vascular',
    desc: 'Vascular Network Lens: Steiner vascular transport channels and nutrient conduit matrix'
  }
];

console.log('=================================================================');
console.log('📸 CAPTURING REAL BROWSER SCREENSHOTS VIA MICROSOFT EDGE');
console.log('   Target: Microsoft Edge (1920x1080 Headless)');
console.log('   Destination: QA/screenshots/');
console.log('=================================================================\n');

for (let i = 0; i < targets.length; i++) {
  const target = targets[i];
  const destPath = path.join(screenshotsDir, target.name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_nat_prof_${Date.now()}_${i}`);
  const tempOut = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_nat_out_${Date.now()}_${i}.png`);

  if (fs.existsSync(tempProfile)) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  }
  fs.mkdirSync(tempProfile, { recursive: true });
  if (fs.existsSync(tempOut)) try { fs.unlinkSync(tempOut); } catch (_) {}

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--disable-fre',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1920,1080',
    `--screenshot=${tempOut}`,
    target.url
  ];

  console.log(`[${i + 1}/${targets.length}] Capturing ${target.name}...`);
  spawnSync(edgePath, args, { encoding: 'utf8', timeout: 18000 });
  spawnSync('taskkill', ['/F', '/IM', 'msedge.exe'], { stdio: 'ignore' });
  spawnSync('node', ['-e', 'setTimeout(() => {}, 600)']);

  if (fs.existsSync(tempOut)) {
    fs.copyFileSync(tempOut, destPath);
    try { fs.unlinkSync(tempOut); } catch (_) {}
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Successfully captured: ${target.name} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`  ⚠️ Failed to capture: ${target.name}`);
  }
}

console.log('\n🎉 Real browser screenshot capture complete!');
