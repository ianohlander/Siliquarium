/**
 * 🐠 Siliquarium Stage 8 Verification
 * Tests SimulationWorld, SimulationLoop, Population Dynamics, and Closed-Universe Telemetry.
 */

import assert from 'node:assert';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { SimulationLoop } from '../dist/engine/SimulationLoop.js';

export function runStage8() {
  // Test 1: SimulationWorld creation and terrain building
  const world = new SimulationWorld({ radius: 3, minZ: 0, maxZ: 1, seed: 999, soupDensity: 0.3 });
  assert.ok(world.getAllPores().length > 0, 'Pores must be initialized across terrain');

  // Test 2: Initial telemetry verification
  const tele0 = world.exportTelemetry();
  assert.strictEqual(tele0.tick, 0, 'Initial tick count must be 0');
  assert.ok(tele0.livingCount > 0, 'Primordial soup must seed living cells');
  assert.ok(tele0.ledger.isEnergyConserved, 'Energy must be conserved at tick 0');
  assert.ok(tele0.ledger.isMatterConserved, 'Matter must be conserved at tick 0');

  // Test 3: Multi-tick execution and conservation invariant
  for (let t = 1; t <= 15; t++) {
    world.step();
    const tele = world.exportTelemetry();
    assert.strictEqual(tele.tick, t, `Telemetry tick must match ${t}`);
    assert.strictEqual(tele.ledger.energyBalanceDelta, 0, `Energy leak detected at tick ${t}!`);
    assert.strictEqual(tele.ledger.matterBalanceDelta, 0, `Matter leak detected at tick ${t}!`);
  }

  // Test 4: Determinism audit (identical seeds must produce identical state)
  const worldA = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, seed: 4242, soupDensity: 0.25 });
  const worldB = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, seed: 4242, soupDensity: 0.25 });

  for (let i = 0; i < 10; i++) {
    worldA.step();
    worldB.step();
  }

  const teleA = worldA.exportTelemetry();
  const teleB = worldB.exportTelemetry();
  assert.strictEqual(teleA.livingCount, teleB.livingCount, 'Determinism failure: living counts differ');
  assert.strictEqual(teleA.totalEnergyInUniverse, teleB.totalEnergyInUniverse, 'Determinism failure: total energies differ');

  // Test 5: SimulationLoop stepping and speed controls
  const loop = new SimulationLoop(world);
  assert.strictEqual(loop.isRunning(), false, 'Loop must start paused');
  loop.setSpeed(5);
  assert.strictEqual(loop.getSpeed(), 5, 'Speed multiplier must be 5');

  const stepResult = loop.step(2);
  assert.strictEqual(stepResult.tick, 17, 'Loop step must advance ticks');
}
