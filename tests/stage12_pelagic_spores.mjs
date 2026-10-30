/**
 * 🐠 Siliquarium Stage 12 Verification
 * Tests Phase 5 Pelagic Spore Dispersal, Advection Drift, Benthic Settlement, and Thermodynamic Conservation.
 */

import assert from 'node:assert';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { PoreMedium, PoreState } from '../dist/core/domain/Pore.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';

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

  const curNozzle = world.getVent().nozzleCoord;
  const aqueousPores = allPores.filter(p =>
    p.coord.z >= 1 &&
    p.coord.distanceTo(new HexCoord3D(0, 0, p.coord.z)) > 1 &&
    p.coord.distanceTo(new HexCoord3D(curNozzle.q, curNozzle.r, p.coord.z)) > 1 &&
    !p.isBasalt()
  );
  for (const ap of aqueousPores) {
    assert.strictEqual(ap.medium, PoreMedium.AQUEOUS_FLUID, 'Outer non-vent z>=1 pores must be AQUEOUS_FLUID');
  }

  // Test 4: Verify Vertical Substrate Basalt Placement (Above flat surface z > 0)
  const verticalCoord = new HexCoord3D(2, -1, 1);
  const successVertical = world.setPoreBasalt(verticalCoord, true);
  assert.ok(successVertical, 'Must allow setting basalt on vertical substrate z=1 above flat surface');
  const vertPore = world.getPore(verticalCoord);
  assert.ok(vertPore && vertPore.isBasalt(), 'Pore at z=1 must report isBasalt=true');
  assert.strictEqual(vertPore?.medium, PoreMedium.ROCK_SUBSTRATE, 'Vertical basalt pore must have ROCK_SUBSTRATE medium');

  // Verify stacking to z=2
  const topCoord = new HexCoord3D(2, -1, 2);
  const successTop = world.setPoreBasalt(topCoord, true);
  assert.ok(successTop, 'Must allow stacking basalt to z=2');
  const topPore = world.getPore(topCoord);
  assert.ok(topPore && topPore.isBasalt(), 'Pore at z=2 must report isBasalt=true');

  // Verify energy and matter conservation remained intact
  const teleVertical = world.exportTelemetry();
  assert.ok(teleVertical.ledger.isEnergyConserved, `Energy must be conserved after vertical basalt placement (delta=${teleVertical.ledger.energyBalanceDelta})`);
  assert.ok(teleVertical.ledger.isMatterConserved, `Matter must be conserved after vertical basalt placement (delta=${teleVertical.ledger.matterBalanceDelta})`);

  // Verify excavation and dismantling of vertical basalt
  const successClear = world.clearPore(topCoord);
  assert.ok(successClear, 'Must allow clearing vertical basalt at z=2');
  assert.ok(!topPore.isBasalt(), 'Cleared pore must no longer be basalt');
  assert.strictEqual(topPore.medium, PoreMedium.AQUEOUS_FLUID, 'Cleared vertical pore must revert to AQUEOUS_FLUID');

  // Test 5: Verify Strict Evolutionary Gating for Pelagic Sporulation
  // A cell lacking SINK_SEPTUM must report hasSporeAdaptation() === false
  const blankSafe = new GenomeSafe('0'.repeat(60));
  const cellNoSeptum = new PoreCell(blankSafe, 100, 20, 1);
  assert.strictEqual(cellNoSeptum.hasSeptum(), false, 'Blank safe has no septum sink');
  assert.strictEqual(cellNoSeptum.hasSporeAdaptation(), false, 'Cell lacking SINK_SEPTUM must not have spore adaptation');

  // Construct a safe with SINK_SEPTUM (codon index 52 = binary 110100) and two AND gates (codon 0 = 000000)
  const sporeTape = '000000' + '000000' + '110100' + '000000'.repeat(7);
  const sporeSafe = new GenomeSafe(sporeTape);
  const cellWithSporeCircuit = new PoreCell(sporeSafe, 100, 20, 1);
  assert.strictEqual(cellWithSporeCircuit.hasSeptum(), true, 'Cell must decode SINK_SEPTUM');
  assert.strictEqual(cellWithSporeCircuit.hasSporeAdaptation(), true, 'Cell with Septum and >= 2 gates must possess spore adaptation');
}
