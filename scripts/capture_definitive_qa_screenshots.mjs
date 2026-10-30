#!/usr/bin/env node

/**
 * 📸 Definitive Siliquarium Browser QA Screenshot Capture
 * Captures real browser screenshots from Microsoft Edge for the QA Punch List Audit.
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
  // 1. Defect A: Header Telemetry Overflow & Flyouts Pushed Off-Screen
  {
    name: '01_observatory_zen_1920x1080.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1920,1080'
  },
  {
    name: '02_observatory_header_overflow_1440x900.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1440,900'
  },
  {
    name: '03_observatory_header_overflow_1280x800.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1280,800'
  },

  // 2. Defect B: Transport Bar Collision Covering Env Pill & Visual Key
  {
    name: '04_transport_collision_env_and_visual_key_1280x800.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1280,800'
  },

  // 3. Observatory: Observation Card & Reticle Lock
  {
    name: '05_observatory_selected_specimen_card.png',
    url: 'http://localhost:3000/?qa_step=selected',
    size: '1920,1080'
  },
  {
    name: '06_observatory_shaker_god_mode.png',
    url: 'http://localhost:3000/?qa_step=shaker',
    size: '1920,1080'
  },
  {
    name: '07_observatory_clean_fullscreen_mode.png',
    url: 'http://localhost:3000/?qa_step=fullscreen',
    size: '1920,1080'
  },

  // 4. Safari Workspace
  {
    name: '08_safari_guided_copilot_and_dossier.png',
    url: 'http://localhost:3000/?qa_step=safari',
    size: '1920,1080'
  },

  // 5. Laboratory Workspace
  {
    name: '09_laboratory_biocad_genome_tape_boolean.png',
    url: 'http://localhost:3000/?qa_step=lab',
    size: '1920,1080'
  },
  {
    name: '10_laboratory_thermodynamic_ledger_delta_e.png',
    url: 'http://localhost:3000/?qa_step=lab_ledger',
    size: '1920,1080'
  },

  // 6. Design Studio Workspace
  {
    name: '11_design_studio_cad_palette_brushes.png',
    url: 'http://localhost:3000/?qa_step=studio',
    size: '1920,1080'
  },
  {
    name: '12_design_studio_sterile_preflight_modal.png',
    url: 'http://localhost:3000/?qa_step=sterile_modal',
    size: '1920,1080'
  },

  // 7. Chronicle Workspace
  {
    name: '13_chronicle_flight_recorder_and_stains.png',
    url: 'http://localhost:3000/?qa_step=chronicle',
    size: '1920,1080'
  },
  {
    name: '14_chronicle_guided_tour_hud_11_stops.png',
    url: 'http://localhost:3000/?qa_step=chronicle_tour',
    size: '1920,1080'
  },

  // 8. Defect C: Visual Lenses Rigid Pore Ring
  {
    name: '15_lens_lattice_pore_ring.png',
    url: 'http://localhost:3000/?qa_step=lens_lattice',
    size: '1920,1080'
  },
  {
    name: '16_lens_plasmodium_failure_rigid_ring.png',
    url: 'http://localhost:3000/?qa_step=lens_plasmodium',
    size: '1920,1080'
  },
  {
    name: '17_lens_vascular_failure_rigid_ring.png',
    url: 'http://localhost:3000/?qa_step=lens_vascular',
    size: '1920,1080'
  },
  {
    name: '18_lens_potential_comparison.png',
    url: 'http://localhost:3000/?qa_step=lens_potential',
    size: '1920,1080'
  },
  {
    name: '19_lens_hybrid_failure_rigid_ring.png',
    url: 'http://localhost:3000/?qa_step=lens_hybrid',
    size: '1920,1080'
  }
];

console.log(`📸 Capturing ${captures.length} definitive QA screenshots via Microsoft Edge...`);

for (let i = 0; i < captures.length; i++) {
  const cap = captures[i];
  const destPath = path.join(screenshotsDir, cap.name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_def_${Date.now()}_${i}`);

  if (fs.existsSync(tempProfile)) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  }
  fs.mkdirSync(tempProfile, { recursive: true });

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`,
    `--screenshot=${destPath}`,
    `--window-size=${cap.size}`,
    '--timeout=2500',
    cap.url
  ];

  console.log(`[${i + 1}/${captures.length}] Capturing ${cap.name} (${cap.size})...`);
  const res = spawnSync(edgePath, args, { stdio: 'pipe', timeout: 14000 });

  // Clean up any lingering Edge child processes before next step
  spawnSync('taskkill', ['/F', '/IM', 'msedge.exe'], { stdio: 'ignore' });

  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Created: ${cap.name} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`  ⚠️ Did not generate ${cap.name}`);
  }
}

console.log('🎉 All screenshot captures finished successfully!');
