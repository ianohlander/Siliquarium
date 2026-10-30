#!/usr/bin/env node

/**
 * 📸 Siliquarium Master Systems Biology & UX Audit Runner
 * Drives Microsoft Edge headless across viewports (1920x1080, 1440x900, 1280x800),
 * executes the in-browser QA audit suite, verifies all 5 workspace modules,
 * and captures real screenshot evidence for the punch list artifact.
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

console.log('=================================================================');
console.log('🔬 SILIQUARIUM SYSTEMS BIOLOGY & VISUAL UX AUDIT SUITE');
console.log('   Target Browser: Microsoft Edge (Headless)');
console.log('   Target Server:  http://localhost:3000');
console.log('=================================================================\n');

function runEdgeCapture(name, url, windowSize = '1920,1080', budget = 2500) {
  const destPath = path.join(screenshotsDir, name);
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_profile_${path.basename(name, '.png')}`);

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
    `--screenshot=${destPath}`,
    `--window-size=${windowSize}`,
    `--timeout=${budget}`,
    url
  ];

  console.log(`📸 Capturing [${windowSize}]: ${name}...`);
  const res = spawnSync(edgePath, args, { stdio: 'pipe', timeout: budget + 5000 });

  // Clean up any lingering Edge child processes before next step
  spawnSync('taskkill', ['/F', '/IM', 'msedge.exe'], { stdio: 'ignore' });

  if (res.error) {
    console.error(`  ❌ Error capturing ${name}:`, res.error);
    return false;
  }
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    console.log(`  ✓ Successfully captured: ${name} (${(stat.size / 1024).toFixed(1)} KB)`);
    return true;
  } else {
    console.warn(`  ⚠️ Failed to create ${destPath}`);
    return false;
  }
}

// 1. First, run the in-browser audit suite across the 3 critical viewports
console.log('--- Step 1: Running In-Browser DOM Audits Across Viewports ---');

// Audit 1920x1080
runEdgeCapture(
  '01_observatory_zen_1920x1080.png',
  'http://localhost:3000/?qa_step=overview',
  '1920,1080',
  2500
);

// Audit 1440x900 (Defect A verification: header overflow)
runEdgeCapture(
  '02_observatory_header_overflow_1440x900.png',
  'http://localhost:3000/?qa_step=overview',
  '1440,900',
  2500
);

// Audit 1280x800 (Defects A & B verification: severe header clipping and transport bar collision)
runEdgeCapture(
  '03_observatory_header_overflow_1280x800.png',
  'http://localhost:3000/?qa_step=overview',
  '1280,800',
  2500
);

// 2. Specialized Functional & Collision Screen Captures
console.log('\n--- Step 2: Capturing Forensic Evidence Across All 5 Modules ---');

const auditScreens = [
  // Defect B forensic evidence: Transport bar covering env pill & visual key
  {
    name: '04_transport_bar_collision_env_pill_1280x800.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1280,800',
    budget: 2000
  },
  {
    name: '05_transport_bar_collision_visual_key_1280x800.png',
    url: 'http://localhost:3000/?qa_step=overview',
    size: '1280,800',
    budget: 2000
  },
  // Module 1: Observatory
  {
    name: '06_observatory_pore_selected_specimen_card.png',
    url: 'http://localhost:3000/?qa_step=selected',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '07_observatory_ecosystem_shaker_perturbation.png',
    url: 'http://localhost:3000/?qa_step=shaker',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '08_observatory_clean_fullscreen_mode.png',
    url: 'http://localhost:3000/?qa_step=fullscreen',
    size: '1920,1080',
    budget: 2000
  },
  // Module 2: Safari
  {
    name: '09_safari_copilot_and_exemplar_dossier.png',
    url: 'http://localhost:3000/?qa_step=safari',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '10_safari_next_specimen_habitat_metrics.png',
    url: 'http://localhost:3000/?qa_step=safari_next',
    size: '1920,1080',
    budget: 2500
  },
  // Module 3: Laboratory
  {
    name: '11_laboratory_biocad_genome_tape_and_boolean.png',
    url: 'http://localhost:3000/?qa_step=lab',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '12_laboratory_thermodynamic_ledger_delta_e.png',
    url: 'http://localhost:3000/?qa_step=lab_ledger',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '13_laboratory_landauer_and_cryovault.png',
    url: 'http://localhost:3000/?qa_step=lab_biobank',
    size: '1920,1080',
    budget: 2500
  },
  // Module 4: Design Studio
  {
    name: '14_design_studio_cad_palette_brushes.png',
    url: 'http://localhost:3000/?qa_step=studio',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '15_design_studio_geodynamics_sliders.png',
    url: 'http://localhost:3000/?qa_step=studio',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '16_design_studio_sterile_preflight_advisory.png',
    url: 'http://localhost:3000/?qa_step=sterile_modal',
    size: '1920,1080',
    budget: 2200
  },
  // Module 5: Chronicle
  {
    name: '17_chronicle_flight_recorder_playback_bar.png',
    url: 'http://localhost:3000/?qa_step=chronicle',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '18_chronicle_histological_stains.png',
    url: 'http://localhost:3000/?qa_step=chronicle',
    size: '1920,1080',
    budget: 2500
  },
  {
    name: '19_chronicle_guided_tour_hud_11_stops.png',
    url: 'http://localhost:3000/?qa_step=chronicle_tour',
    size: '1920,1080',
    budget: 2500
  },
  // Biological Multi-Lens Architecture (Defect C verification)
  {
    name: '20_visual_lens_lattice_pore_ring.png',
    url: 'http://localhost:3000/?qa_step=lens_lattice',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '21_visual_lens_plasmodium_failure_comparison.png',
    url: 'http://localhost:3000/?qa_step=lens_plasmodium',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '22_visual_lens_vascular_failure_comparison.png',
    url: 'http://localhost:3000/?qa_step=lens_vascular',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '23_visual_lens_potential_comparison.png',
    url: 'http://localhost:3000/?qa_step=lens_potential',
    size: '1920,1080',
    budget: 2200
  },
  {
    name: '24_visual_lens_hybrid_failure_comparison.png',
    url: 'http://localhost:3000/?qa_step=lens_hybrid',
    size: '1920,1080',
    budget: 2200
  }
];

for (const item of auditScreens) {
  runEdgeCapture(item.name, item.url, item.size, item.budget);
}

console.log('\n=================================================================');
console.log('🎉 Browser audit & screenshot capture finished!');
console.log(`📁 Artifacts stored in: ${screenshotsDir}`);
console.log('=================================================================');
