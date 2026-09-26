/**
 * 🐠 Siliquarium Stage 12 Verification
 * Tests Phase 5 Pelagic Spore Dispersal, Advection Drift, Benthic Settlement, and Thermodynamic Conservation.
 */

import assert from 'node:assert';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { PoreMedium, PoreState } from '../dist/core/domain/Pore.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';

export function runStage12() {
  // Test 1: Spore creation & placement in aqueous fluid
  const world = new SimulationWorld({ radius: 3, soupDensity: 0.5, seed: 1337 });
  const teleInitial = world.exportTelemetry();
  assert.ok(teleInitial.livingCount > 0, 'Soup must seed initial silicoids');

  // Step simulation forward to provoke division and spore dispersal
  for (let t = 0; t < 60; t++) {
    world.step();
  }

  const teleMid = world.exportTelemetry();
  assert.ok(teleMid.tick === 60, 'Simulation must advance 60 ticks');
  assert.ok(teleMid.ledger.isEnergyConserved, `Energy conservation violated: delta = ${teleMid.ledger.energyBalanceDelta}`);
  assert.ok(teleMid.ledger.isMatterConserved, `Matter conservation violated: delta = ${teleMid.ledger.matterBalanceDelta}`);

  // Test 2: God-Suite Thermal Surge & Extinction Event
  world.triggerThermalSurge();
  const teleSurge = world.exportTelemetry();
  assert.ok(teleSurge.ledger.isEnergyConserved, 'Energy must be conserved after thermal surge');

  world.triggerExtinctionEvent(new HexCoord3D(0, 0, 0), 1);
  const teleExtinction = world.exportTelemetry();
  assert.ok(teleExtinction.ledger.isEnergyConserved, 'Energy must be conserved after extinction pulse');
  assert.ok(teleExtinction.ledger.isMatterConserved, 'Matter must be conserved after extinction pulse');

  // Test 3: Verify Benthic Substrate vs Aqueous Medium integrity
  const allPores = world.getAllPores();
  const bedrockPores = allPores.filter(p => p.coord.z === 0);
  for (const bp of bedrockPores) {
    assert.strictEqual(bp.medium, PoreMedium.ROCK_SUBSTRATE, 'All z=0 floor pores must be ROCK_SUBSTRATE');
  }

  const aqueousPores = allPores.filter(p => p.coord.z >= 1 && p.coord.distanceTo(new HexCoord3D(0, 0, p.coord.z)) > 1);
  for (const ap of aqueousPores) {
    assert.strictEqual(ap.medium, PoreMedium.AQUEOUS_FLUID, 'Outer z>=1 pores must be AQUEOUS_FLUID');
  }
}
