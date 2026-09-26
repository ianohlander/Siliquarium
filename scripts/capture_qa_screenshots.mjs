#!/usr/bin/env node

/**
 * 📸 Siliquarium Browser QA Screenshot Capture Tool
 * Captures real browser screenshots from Microsoft Edge for student QA report.
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

const steps = [
  {
    name: '01_overview_and_lattice_key.png',
    url: 'http://localhost:3000/?qa_step=overview',
    budget: 2000
  },
  {
    name: '02_zooming_difficulty_drift.png',
    url: 'http://localhost:3000/?qa_step=zoomed_drift',
    budget: 2000
  },
  {
    name: '03_selected_silicoid_and_microscope.png',
    url: 'http://localhost:3000/?qa_step=selected',
    budget: 2000
  },
  {
    name: '04_deep_zoom_and_insitu_circuit.png',
    url: 'http://localhost:3000/?qa_step=deep_zoom',
    budget: 2000
  },
  {
    name: '05_god_suite_lab_controls.png',
    url: 'http://localhost:3000/?qa_step=lab',
    budget: 2000
  },
  {
    name: '06_thermal_surge_and_extinction.png',
    url: 'http://localhost:3000/?qa_step=surge',
    budget: 2000
  }
];

console.log('📸 Capturing genuine browser screenshots via Microsoft Edge...');

for (const step of steps) {
  const destPath = path.join(screenshotsDir, step.name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_profile_${path.basename(step.name, '.png')}`);

  if (fs.existsSync(tempProfile)) {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  }
  fs.mkdirSync(tempProfile, { recursive: true });

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    `--virtual-time-budget=${step.budget}`,
    `--screenshot=${destPath}`,
    '--window-size=1280,800',
    step.url
  ];

  const res = spawnSync(edgePath, args, { stdio: 'pipe' });
  if (res.error) {
    console.error(`Error capturing ${step.name}:`, res.error);
  } else if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Captured: ${step.name} (${stat.size} bytes)`);
  } else {
    console.warn(`  ⚠️ Failed to create ${destPath}`);
  }
}

console.log('🎉 Screenshot capture complete!');
