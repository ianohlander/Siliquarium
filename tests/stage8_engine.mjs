/**
 * 🐠 Siliquarium Stage 8 Verification
 * Tests SimulationWorld, SimulationLoop, Population Dynamics, and Closed-Universe Telemetry.
 */

import assert from 'node:assert';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { SimulationLoop } from '../dist/engine/SimulationLoop.js';
import { Pore } from '../dist/core/domain/Pore.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';

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

  // Test 6: Multicellular Body Topology Classification
  const pA = new Pore(new HexCoord3D(0, 0, 0));
  const pB = new Pore(new HexCoord3D(1, 0, 0));
  const pC = new Pore(new HexCoord3D(2, 0, 0));
  assert.strictEqual(world.classifyColonyTopology([pA, pB, pC]), 'FILAMENTOUS', 'Linear 3-cell chain must be FILAMENTOUS');

  // Triangle Rosette: (0,0), (1,0), (0,1)
  const pR1 = new Pore(new HexCoord3D(0, 0, 0));
  const pR2 = new Pore(new HexCoord3D(1, 0, 0));
  const pR3 = new Pore(new HexCoord3D(0, 1, 0));
  assert.strictEqual(world.classifyColonyTopology([pR1, pR2, pR3]), 'ROSETTE', 'Triangle 3-cell cluster must be ROSETTE');

  // Dendritic Tree: center (0,0) connected to 3 non-mutually adjacent branches (120 degrees apart)
  const pD0 = new Pore(new HexCoord3D(0, 0, 0));
  const pD1 = new Pore(new HexCoord3D(1, 0, 0));  // East (0 deg)
  const pD2 = new Pore(new HexCoord3D(0, -1, 0)); // Northwest (120 deg)
  const pD3 = new Pore(new HexCoord3D(-1, 1, 0)); // Southwest (240 deg)
  assert.strictEqual(world.classifyColonyTopology([pD0, pD1, pD2, pD3]), 'DENDRITIC', '3-branch 120-degree star junction must be DENDRITIC');

  // Hexagonal Ring: 6 pores around a central void
  const pRing = [
    new Pore(new HexCoord3D(1, 0, 0)),
    new Pore(new HexCoord3D(1, -1, 0)),
    new Pore(new HexCoord3D(0, -1, 0)),
    new Pore(new HexCoord3D(-1, 0, 0)),
    new Pore(new HexCoord3D(-1, 1, 0)),
    new Pore(new HexCoord3D(0, 1, 0))
  ];
  assert.strictEqual(world.classifyColonyTopology(pRing), 'RING', '6-cell perimeter enclosing void must be RING');

  // Test 7: Subterranean Stratum (minZ = -1), Sunken Rift Trenches & First-Law Conservation
  const subWorld = new SimulationWorld({
    radius: 4,
    minZ: -1,
    maxZ: 3,
    seed: 7771,
    soupDensity: 0.25,
    basaltDensity: 0.15,
    terrainRoughness: 0.40
  });

  const subPores = subWorld.getAllPores();
  const neg1Pores = subPores.filter(p => p.coord.z === -1);
  assert.ok(neg1Pores.length > 0, 'Subterranean stratum z = -1 must exist');

  // Verify presence of solid subterranean bedrock and habitable trench alcoves
  const subBasalt = neg1Pores.filter(p => p.isBasalt());
  const subHabitable = neg1Pores.filter(p => !p.isBasalt() && !p.isAqueous());
  assert.ok(subBasalt.length > 0, 'Solid subterranean bedrock must anchor the tectonic foundation');
  assert.ok(subHabitable.length > 0, 'Sunken rift trenches must provide habitable benthic rock cavities at z = -1');

  // Execute steps on subterranean world and verify First-Law conservation invariant (ΔE = 0, ΔM = 0)
  for (let t = 1; t <= 10; t++) {
    subWorld.step();
    const subTele = subWorld.exportTelemetry();
    assert.strictEqual(subTele.ledger.energyBalanceDelta, 0, `Subterranean energy leak detected at tick ${t}!`);
    assert.strictEqual(subTele.ledger.matterBalanceDelta, 0, `Subterranean matter leak detected at tick ${t}!`);
  }
}

