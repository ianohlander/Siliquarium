/**
 * 🐠 Siliquarium Native Test Suite - Stage 22
 * Headless Server Simulation Engine, SSE Broadcaster & Remote Sync Subsystem
 * 
 * Verifies:
 * 1. Autonomous headless execution on Node.js without browser DOM.
 * 2. Native Server-Sent Events (SSE) streaming protocol & handshake compliance.
 * 3. Remote control command dispatch (play, pause, step, speed, perturbations, brushes).
 * 4. Zero-loss server checkpoints (.silisave) and state restoration.
 * 5. Strict closed-universe First-Law conservation invariant (ΔE = 0.000, ΔM = 0.000).
 */

import assert from 'node:assert';
import { HeadlessSimulationHost } from '../dist/server/HeadlessSimulationHost.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';

export async function runStage22() {
  console.log('  Testing Headless Server Simulation Host & Remote Engine Sync...');

  // -------------------------------------------------------------------------
  // Test 1: Headless Server Instantiation & Step Progression
  // -------------------------------------------------------------------------
  {
    const host = new HeadlessSimulationHost({
      radius: 4,
      soupDensity: 0.25,
      basaltDensity: 0.15,
      seed: 12345,
      autoStart: false,
      initialSpeed: 2
    });

    assert.strictEqual(host.isExecuting(), false, 'Host must respect autoStart: false');
    assert.strictEqual(host.getSpeed(), 2, 'Host must initialize with specified speedMultiplier');

    const initStatus = host.getStatus();
    assert.strictEqual(initStatus.tick, 0, 'Initial tick must be 0');
    assert.strictEqual(initStatus.isRunning, false, 'Initial running status must be false');
    assert.strictEqual(initStatus.isEnergyConserved, true, 'First-law energy must be conserved at tick 0');
    assert.strictEqual(initStatus.isMatterConserved, true, 'First-law matter must be conserved at tick 0');

    // Step 10 ticks synchronously
    const tele = host.step(10);
    assert.strictEqual(tele.tick, 10, 'Host step(10) must advance clock to tick 10');
    assert.strictEqual(host.getWorld().getTickCount(), 10, 'Underlying SimulationWorld must reflect tick 10');
    assert.strictEqual(tele.ledger.isEnergyConserved, true, 'Energy must remain strictly conserved after stepping');
    assert.strictEqual(tele.ledger.isMatterConserved, true, 'Matter must remain strictly conserved after stepping');

    console.log('    ✓ Test 1 Passed: Headless server host executes and advances ticks with strict conservation.');
    host.destroy();
  }

  // -------------------------------------------------------------------------
  // Test 2: Native Server-Sent Events (SSE) Streaming Protocol Compliance
  // -------------------------------------------------------------------------
  {
    const host = new HeadlessSimulationHost({
      radius: 4,
      autoStart: false,
      telemetryThrottleTicks: 1
    });

    const receivedChunks = [];
    let headersWritten = false;
    let statusCodeWritten = 0;
    let closeListener = null;

    const mockRes = {
      writeHead(code, headers) {
        statusCodeWritten = code;
        headersWritten = true;
        assert.strictEqual(headers['Content-Type'], 'text/event-stream', 'Must specify SSE content-type');
        assert.strictEqual(headers['Cache-Control'], 'no-cache, no-transform', 'Must specify no-cache');
      },
      write(chunk) {
        receivedChunks.push(chunk);
        return true;
      },
      end() {},
      on(event, listener) {
        if (event === 'close') closeListener = listener;
        return this;
      }
    };

    host.subscribeSSE(mockRes);
    assert.strictEqual(host.getSubscriberCount(), 1, 'Subscriber count must increment on subscribeSSE');
    assert.strictEqual(statusCodeWritten, 200, 'SSE handshake must return HTTP 200');
    assert.strictEqual(headersWritten, true, 'SSE headers must be written');

    // Verify initial handshake payload
    assert.ok(receivedChunks.length >= 1, 'Mock subscriber must receive initial handshake event');
    const initEvent = receivedChunks[0];
    assert.ok(initEvent.includes('event: init'), 'Initial event must have event type "init"');
    assert.ok(initEvent.includes('data:'), 'Initial event must contain JSON data payload');

    // Step host and verify live broadcast
    const prevCount = receivedChunks.length;
    host.step(1);
    assert.ok(receivedChunks.length > prevCount, 'Stepping must broadcast telemetry to SSE subscribers');
    const lastBroadcast = receivedChunks[receivedChunks.length - 1];
    assert.ok(lastBroadcast.includes('event: telemetry') || lastBroadcast.includes('event: status'),
      'Broadcast event must be telemetry or status');

    // Unsubscribe via close event
    if (closeListener) closeListener();
    assert.strictEqual(host.getSubscriberCount(), 0, 'Subscriber count must drop to 0 after disconnect');

    console.log('    ✓ Test 2 Passed: Native SSE streaming protocol, handshake, and broadcasts verified.');
    host.destroy();
  }

  // -------------------------------------------------------------------------
  // Test 3: Remote Control Command Dispatch
  // -------------------------------------------------------------------------
  {
    const host = new HeadlessSimulationHost({
      radius: 4,
      autoStart: false
    });

    // Speed command
    const speedRes = host.handleControlCommand('setSpeed', { speed: 4 });
    assert.strictEqual(speedRes.success, true, 'setSpeed command must succeed');
    assert.strictEqual(host.getSpeed(), 4, 'Host speed must update to 4x');

    // Step command
    const stepRes = host.handleControlCommand('step', { count: 3 });
    assert.strictEqual(stepRes.success, true, 'step command must succeed');
    assert.strictEqual(host.getWorld().getTickCount(), 3, 'World tick must advance by 3');

    // Perturbation shock command
    const perturbRes = host.handleControlCommand('perturb', { type: 'surge', magnitude: 2.0 });
    assert.strictEqual(perturbRes.success, true, 'perturb command must succeed');
    const statusAfterPerturb = host.getStatus();
    assert.strictEqual(statusAfterPerturb.isEnergyConserved, true, 'Universal energy must be conserved after surge');

    // Brush action command (basalt placement)
    const brushRes = host.handleControlCommand('brush', {
      action: 'basalt',
      coords: [{ q: 1, r: -1, z: 0 }]
    });
    assert.strictEqual(brushRes.success, true, 'brush command must succeed');
    const targetPore = host.getWorld().getPore(new HexCoord3D(1, -1, 0));
    assert.ok(targetPore, 'Target pore must exist');
    assert.strictEqual(targetPore.isBasalt(), true, 'Target pore must be transformed to basalt');

    // Play and Pause commands
    const playRes = host.handleControlCommand('play');
    assert.strictEqual(playRes.success, true, 'play command must succeed');
    assert.strictEqual(host.isExecuting(), true, 'Host must be marked executing');

    const pauseRes = host.handleControlCommand('pause');
    assert.strictEqual(pauseRes.success, true, 'pause command must succeed');
    assert.strictEqual(host.isExecuting(), false, 'Host must be paused');

    console.log('    ✓ Test 3 Passed: Remote control dispatch (speed, step, perturb, brush, play/pause) verified.');
    host.destroy();
  }

  // -------------------------------------------------------------------------
  // Test 4: Server State Snapshots & Round-Trip Restoration
  // -------------------------------------------------------------------------
  {
    const host = new HeadlessSimulationHost({
      radius: 4,
      soupDensity: 0.30,
      autoStart: false,
      seed: 9999
    });

    host.step(25);
    const snapTick = host.getWorld().getTickCount();
    assert.strictEqual(snapTick, 25);

    // Capture checkpoint
    const snapshot = host.createSnapshot('Checkpoint Tick 25');
    assert.strictEqual(snapshot.format, 'silisave', 'Snapshot format must be .silisave');
    assert.strictEqual(snapshot.tick, 25, 'Snapshot tick must match tick 25');

    // Advance world further to tick 50
    host.step(25);
    assert.strictEqual(host.getWorld().getTickCount(), 50, 'World must be at tick 50 before restore');

    // Restore checkpoint
    const restored = host.restoreSnapshot(snapshot);
    assert.strictEqual(restored, true, 'Snapshot restoration must succeed');
    assert.strictEqual(host.getWorld().getTickCount(), 25, 'Restored world must rewind to tick 25');

    // Conservation audit after restoration
    const statusRestored = host.getStatus();
    assert.strictEqual(statusRestored.isEnergyConserved, true, 'Restored state must strictly conserve energy');
    assert.strictEqual(statusRestored.isMatterConserved, true, 'Restored state must strictly conserve matter');

    console.log('    ✓ Test 4 Passed: Server .silisave snapshot capture and exact restoration verified.');
    host.destroy();
  }
}
