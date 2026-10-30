#!/usr/bin/env node

/**
 * 🐠 Siliquarium Zero-Dependency Local Dev & Headless Simulation Server
 * Serves the WebGL Seafloor and Circuit Microscope Visualizer over HTTP,
 * while executing continuous, headless server-side silicon abiogenesis
 * with native Server-Sent Events (SSE) live streaming and REST control.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HeadlessSimulationHost } from '../dist/server/HeadlessSimulationHost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

// Autonomous Headless Server Instance
const headlessHost = new HeadlessSimulationHost({
  radius: 5,
  soupDensity: 0.20,
  basaltDensity: 0.15,
  autoStart: true,
  initialSpeed: 1
});

const readRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
};

const readRequestBuffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', err => reject(err));
  });
};

const server = http.createServer(async (req, res) => {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const reqPath = urlObj.pathname;

  // 1. SSE Live Telemetry Stream
  if (req.method === 'GET' && reqPath === '/api/sim/stream') {
    headlessHost.subscribeSSE(res);
    return;
  }

  // 2. Server Simulation Status
  if (req.method === 'GET' && reqPath === '/api/sim/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(headlessHost.getStatus()));
    return;
  }

  // 3. Server Telemetry Snapshot
  if (req.method === 'GET' && reqPath === '/api/sim/telemetry') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(headlessHost.getTelemetry()));
    return;
  }

  // 4. Remote Control Command Dispatch
  if (req.method === 'POST' && reqPath === '/api/sim/control') {
    try {
      const raw = await readRequestBody(req);
      const parsed = raw ? JSON.parse(raw) : {};
      const command = parsed.command;
      const payload = parsed.payload || {};
      const result = headlessHost.handleControlCommand(command, payload);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 5. Server Snapshot Management
  if (reqPath === '/api/sim/snapshot') {
    if (req.method === 'GET') {
      const name = urlObj.searchParams.get('name') || 'Server Checkpoint';
      const snap = headlessHost.createSnapshot(name);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(snap));
      return;
    }
    if (req.method === 'POST') {
      try {
        const raw = await readRequestBody(req);
        const snap = JSON.parse(raw);
        const ok = headlessHost.restoreSnapshot(snap);
        res.writeHead(ok ? 200 : 400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: ok, message: ok ? 'Snapshot restored' : 'Restore failed' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }
  }

  // 6. QA Runtime Audit Report
  if (req.method === 'POST' && reqPath === '/api/qa-report') {
    const body = await readRequestBody(req);
    const qaDir = path.join(rootDir, 'QA');
    if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });
    const outPath = path.join(qaDir, 'qa_runtime_audit_results.json');
    fs.writeFileSync(outPath, body, 'utf-8');
    console.log(`[QA SERVER] Received QA audit payload (${body.length} bytes) saved to QA/qa_runtime_audit_results.json`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', size: body.length }));
    return;
  }

  // 6b. Digital Naturalist Field Catalog Report
  if (req.method === 'POST' && reqPath === '/api/naturalist-catalog') {
    const body = await readRequestBody(req);
    const qaDir = path.join(rootDir, 'QA');
    if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });
    const outPath = path.join(qaDir, 'naturalist_field_catalog.json');
    fs.writeFileSync(outPath, body, 'utf-8');
    console.log(`🌿 [NATURALIST SERVER] Received naturalist field catalog (${body.length} bytes) saved to QA/naturalist_field_catalog.json`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', size: body.length }));
    return;
  }

  // 6c. Browser Logging Relay
  if (req.method === 'POST' && reqPath === '/api/log') {
    const body = await readRequestBody(req);
    console.log(`🖥️ [BROWSER LOG] ${body}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // 6d. Video Recording Upload
  if (req.method === 'POST' && reqPath === '/api/save-video') {
    const filename = urlObj.searchParams.get('name') || `silicoid_behavior_${Date.now()}.webm`;
    const videoBuffer = await readRequestBuffer(req);
    const videoDir = path.join(rootDir, 'QA', 'videos');
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    const outPath = path.join(videoDir, filename);
    fs.writeFileSync(outPath, videoBuffer);
    console.log(`🎥 [VIDEO SERVER] Saved video capture (${videoBuffer.length} bytes) to QA/videos/${filename}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, filename, size: videoBuffer.length }));
    return;
  }

  // 7. Static File Serving
  let filePathName = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(rootDir, filePathName);

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🐠 Siliquarium Visualizer & Headless Server Active!`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   SSE Stream: http://localhost:${PORT}/api/sim/stream`);
  console.log('==================================================');
});
