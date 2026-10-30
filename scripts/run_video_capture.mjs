#!/usr/bin/env node

/**
 * 🎬 Siliquarium Real Browser Video Capture Tool
 * Spawns Microsoft Edge to execute `scripts/video_recorder_agent.js` via `http://localhost:3000/?video_record=1`.
 * Captures 30 FPS WebM videos of emergent silicoid behaviors and proto-cognitive circuits.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const qaDir = path.join(rootDir, 'QA');
const videoDir = path.join(qaDir, 'videos');

if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

const expectedVideos = [
  'behavior_01_slime_treadmilling.webm',
  'behavior_02_logic_oscilloscope.webm',
  'behavior_03_hydrothermal_surge.webm',
  'behavior_04_french_flag_differentiation.webm',
  'behavior_05_5000_gen_clades.webm'
];

console.log('=================================================================');
console.log('🎬 SILIQUARIUM REAL BROWSER VIDEO CAPTURE (MICROSOFT EDGE)');
console.log('   Destination Directory: QA/videos/');
console.log('   Target Video Files:');
expectedVideos.forEach((v, i) => console.log(`     ${i + 1}. ${v}`));
console.log('=================================================================\n');

const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_video_prof_${Date.now()}`);
if (fs.existsSync(tempProfile)) {
  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
}
fs.mkdirSync(tempProfile, { recursive: true });

const edgeArgs = [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-sync',
  '--disable-fre',
  '--use-fake-ui-for-media-stream',
  '--autoplay-policy=no-user-gesture-required',
  `--user-data-dir=${tempProfile}`,
  '--window-size=1920,1080',
  'http://localhost:3000/?video_record=1'
];

console.log(`🚀 Launching Microsoft Edge: ${edgePath}`);
const edgeProc = spawn(edgePath, edgeArgs, { stdio: 'ignore' });

edgeProc.on('error', (err) => {
  console.error('❌ Failed to launch Microsoft Edge:', err);
  process.exit(1);
});

// Monitor video output directory with timeout of 90 seconds
const startTime = Date.now();
const TIMEOUT_MS = 90000;

const interval = setInterval(() => {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const present = expectedVideos.filter(v => {
    const p = path.join(videoDir, v);
    return fs.existsSync(p) && fs.statSync(p).size > 1024;
  });

  process.stdout.write(`\r⏳ [${elapsed}s] Recorded ${present.length}/${expectedVideos.length} videos...`);

  if (present.length === expectedVideos.length) {
    clearInterval(interval);
    console.log('\n\n🎉 ALL 5 BROWSER BEHAVIOR VIDEOS CAPTURED SUCCESSFULLY!\n');
    present.forEach(v => {
      const p = path.join(videoDir, v);
      const sizeKb = (fs.statSync(p).size / 1024).toFixed(1);
      console.log(`   📹 ${v} (${sizeKb} KB)`);
    });

    try { edgeProc.kill('SIGTERM'); } catch (_) {}
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
    process.exit(0);
  }

  if (Date.now() - startTime > TIMEOUT_MS) {
    clearInterval(interval);
    console.error(`\n\n❌ Timeout reached (${TIMEOUT_MS / 1000}s) before all videos finished recording.`);
    console.log(`   Recorded so far: ${present.join(', ') || 'none'}`);
    try { edgeProc.kill('SIGTERM'); } catch (_) {}
    process.exit(1);
  }
}, 1000);
