#!/usr/bin/env node

/**
 * 🚀 Siliquarium Headless Browser Expedition Runner
 * 
 * Orchestrates the headless browser expedition:
 * 1. Ensures local dev server is active on port 3000.
 * 2. Launches headless Microsoft Edge loading ?naturalist_agent=1.
 * 3. Waits for the in-browser naturalist agent to complete its DOM expedition and write QA/naturalist_field_catalog.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const qaDir = path.join(rootDir, 'QA');
const catalogPath = path.join(qaDir, 'naturalist_field_catalog.json');

if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });
if (fs.existsSync(catalogPath)) fs.unlinkSync(catalogPath);

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/index.html', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
};

const wait = (ms) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log('🚀 [EXPEDITION RUNNER] Starting Siliquarium Headless Expedition...');

  // 1. Verify or start local server
  let serverRunning = await checkServer();
  let serverProcess = null;

  if (!serverRunning) {
    console.log('📡 [EXPEDITION RUNNER] Launching local server (scripts/serve.mjs)...');
    serverProcess = spawn('node', ['scripts/serve.mjs'], {
      cwd: rootDir,
      stdio: 'inherit'
    });

    for (let i = 0; i < 20; i++) {
      await wait(500);
      serverRunning = await checkServer();
      if (serverRunning) break;
    }
  }

  if (!serverRunning) {
    console.error('❌ Failed to connect to local server on http://localhost:3000');
    process.exit(1);
  }
  console.log('✅ Local server verified at http://localhost:3000');

  // 2. Launch headless browser
  const tempProfile = path.join('C:\\Users\\ianoh\\AppData\\Local\\Temp', `edge_naturalist_${Date.now()}`);
  if (fs.existsSync(tempProfile)) {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  }
  fs.mkdirSync(tempProfile, { recursive: true });

  const edgeArgs = [
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--disable-fre',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1920,1080',
    'http://localhost:3000/?naturalist_agent=1'
  ];

  console.log('🌐 [EXPEDITION RUNNER] Launching Headless Microsoft Edge with naturalist_agent=1...');
  const edgeProc = spawn(edgePath, edgeArgs, {
    stdio: 'inherit'
  });

  // 3. Monitor for catalog completion
  console.log('⏳ [EXPEDITION RUNNER] Waiting for browser agent to interact with DOM surfaces and catalog ecosystem...');
  const maxWaitMs = 120000;
  const start = Date.now();
  let completed = false;

  while (Date.now() - start < maxWaitMs) {
    if (fs.existsSync(catalogPath)) {
      try {
        const content = fs.readFileSync(catalogPath, 'utf-8');
        if (content.length > 50) {
          const parsed = JSON.parse(content);
          if (parsed.catalogedSilicoids && parsed.catalogedSilicoids.length > 0) {
            completed = true;
            break;
          }
        }
      } catch (_) {}
    }
    await wait(1000);
  }

  // Terminate browser
  try {
    edgeProc.kill();
    spawnSync('taskkill', ['/F', '/IM', 'msedge.exe'], { stdio: 'ignore' });
  } catch (_) {}

  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (_) {}

  if (serverProcess) {
    try { serverProcess.kill(); } catch (_) {}
  }

  if (completed) {
    console.log('🎉 [EXPEDITION RUNNER] Expedition successfully completed! Field catalog written to QA/naturalist_field_catalog.json');
    process.exit(0);
  } else {
    console.error('⚠️ [EXPEDITION RUNNER] Timed out waiting for naturalist catalog completion.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
