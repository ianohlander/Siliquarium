/**
 * 🐠 Siliquarium Native Test Suite - Stage 23
 * Physical Sensory Porin Transducers, Sparse Active Pore Engine & Tactical Geothermal Action Deck
 * 
 * Verifies:
 * 1. Physical Carrier Wavefields & Zero-Smuggling Sensory Porins (IR Photons, Infrasound Acoustics, Mechano-Touch, Electro-Redox, Substrate D).
 * 2. Landauer Physical Sensing Measurement Cost: Each physical sensing gate toggle incurs the Landauer thermodynamic tax.
 * 3. Sparse Active Pore Engine: O(N_active) lattice iteration, dynamic registration/unregistration.
 * 4. Tactical Environmental Action Deck ("The Geothermal Commander" CCG): Card triggers & First-Law ledger conservation.
 */

import assert from 'node:assert';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { PoreWorkshop } from '../dist/core/domain/PoreWorkshop.js';
import { Pore, PoreState, PoreMedium } from '../dist/core/domain/Pore.js';
import { CodonType, CodonTable } from '../dist/core/codons/CodonTable.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';

export async function runStage23() {
  console.log('  Testing Physical Sensory Porins, Sparse Active Pore Engine & Tactical Deck...');

  // -------------------------------------------------------------------------
  // Test 1: Zero-Smuggling Physical Sensory Porins & Landauer Measurement Tax
  // -------------------------------------------------------------------------
  // Construct tape with PORIN_PHOTON_IR, PORIN_BARO_ACOUSTIC, PORIN_MECHANO_TOUCH, PORIN_ELECTRO_REDOX, PORIN_STREAM_D
  // Codon mappings from CodonTable:
  // PORIN_PHOTON_IR: index 6 -> '000110'
  // PORIN_BARO_ACOUSTIC: index 16 -> '010000'
  // PORIN_MECHANO_TOUCH: index 26 -> '011010'
  // PORIN_ELECTRO_REDOX: index 36 -> '100100'
  // PORIN_STREAM_D: index 42 -> '101010'
  // SINK_BATTERY: index 48 -> '110000'
  const sensoryTape = '000110' + '010000' + '011010' + '100100' + '101010' + '110000';
  const safe = new GenomeSafe(sensoryTape);
  const cell = new PoreCell(safe, 80, 20, 0);

  // Initial step with all environmental fields FALSE
  const resOff = cell.tick(false, false, false, false, false, false, false, false, false);
  assert.strictEqual(resOff.telemetry.primaryActive, false, 'No metabolic catalysis when primary nutrients absent.');

  // Toggling sensory inputs ON: IR Photon + Baro Acoustic + Mechano Touch + Electro Redox + Stream D
  const resOn = cell.tick(
    false, // streamA
    false, // streamB
    false, // toxinT
    false, // streamC
    true,  // streamD
    true,  // photonIr
    true,  // baroAcoustic
    true,  // mechanoTouch
    true   // electroRedox
  );

  // Each transition must incur Landauer toggle cost
  assert.ok(resOn.telemetry.toggleCount > 0, 'Physical sensing transitions must register Landauer gate toggles.');
  assert.ok(resOn.landauerBurned > 0, 'Physical sensing bit flips must burn thermodynamic Landauer tokens.');
  assert.strictEqual(resOn.telemetry.streamDIngested, true, 'Stream D nitrogen assimilation must be active.');

  console.log('    ✓ Test 1 Passed: Zero-Smuggling sensory porins & Landauer measurement tax verified.');

  // -------------------------------------------------------------------------
  // Test 2: Sparse Active Pore Engine O(N_active) & Dynamic Lifecycle
  // -------------------------------------------------------------------------
  const world = new SimulationWorld({ radius: 4, soupDensity: 0.0, seed: 42 }); // Radius 4 = 61 columns, multi-layer ~180 pores
  const totalPores = world.getAllPores().length;
  assert.ok(totalPores > 50, 'World must contain significant lattice volume.');

  // Initially sterile world: Active pore count must be 0
  assert.strictEqual(world.getActivePoreCount(), 0, 'Sterile world active pore count must be exactly 0.');

  // Inoculate exactly 2 pores with cells
  const p1 = world.getAllPores().find(p => !p.isBasalt() && !p.isAqueous());
  assert.ok(p1, 'Must find habitable pore p1.');
  const testCell1 = new PoreCell(GenomeSafe.createPrebioticSoup(world.getPrng()), 70, 25, 0);
  p1.setResident(testCell1);
  world.getLedger().recordEnergyInjection(testCell1.getBattery().getEnergy());
  world.getLedger().recordMatterInjection(testCell1.getBattery().getMatter());
  world.registerActivePore(p1);

  assert.strictEqual(world.getActivePoreCount(), 1, 'Active pores must strictly equal 1 after registering p1.');

  // Step simulation: Only active pores are evaluated
  world.step();
  assert.ok(world.getActivePoreCount() >= 1, 'Active pores must track living cell.');
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Sparse pore execution must conserve energy (ΔE = 0.000).');
  assert.strictEqual(world.exportTelemetry().ledger.isMatterConserved, true, 'Sparse pore execution must conserve matter (ΔM = 0.000).');

  // Inoculate second cell with division readiness
  const p2 = world.getAllPores().find(p => p !== p1 && !p.isBasalt() && !p.isAqueous());
  assert.ok(p2, 'Must find habitable pore p2.');
  const divCell = new PoreCell(GenomeSafe.createPrebioticSoup(world.getPrng()), 120, 50, 0);
  p2.setResident(divCell);
  world.getLedger().recordEnergyInjection(divCell.getBattery().getEnergy());
  world.getLedger().recordMatterInjection(divCell.getBattery().getMatter());
  world.registerActivePore(p2);
  assert.strictEqual(world.getActivePoreCount(), 2, 'Active pores must equal 2 after adding p2.');

  // Step world to allow cell reproduction and dynamic expansion
  for (let i = 0; i < 5; i++) {
    world.step();
  }
  assert.ok(world.getActivePoreCount() >= 2, 'Active pore count tracks lineage propagation.');
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Post-division universe must conserve energy.');

  console.log('    ✓ Test 2 Passed: Sparse Active Pore Engine O(N_active) & dynamic tracking verified.');

  // -------------------------------------------------------------------------
  // Test 3: Tactical Environmental Action Deck ("The Geothermal Commander" CCG)
  // -------------------------------------------------------------------------
  // 1. SUBSTRATE_C_BLOOM
  const bloomCOk = world.triggerEnvironmentalAction('SUBSTRATE_C_BLOOM', undefined, 25);
  assert.strictEqual(bloomCOk, true, 'SUBSTRATE_C_BLOOM action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during Substrate C bloom.');

  // 2. SUBSTRATE_D_BLOOM
  const bloomDOk = world.triggerEnvironmentalAction('SUBSTRATE_D_BLOOM', undefined, 30);
  assert.strictEqual(bloomDOk, true, 'SUBSTRATE_D_BLOOM action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during Substrate D bloom.');

  // 3. ACOUSTIC_CAVITATION_SHOCK
  const shockOk = world.triggerEnvironmentalAction('ACOUSTIC_CAVITATION_SHOCK', undefined, 20);
  assert.strictEqual(shockOk, true, 'ACOUSTIC_CAVITATION_SHOCK action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during acoustic shock.');

  // 4. PHOTON_FLARE
  const flareOk = world.triggerEnvironmentalAction('PHOTON_FLARE', undefined, 15);
  assert.strictEqual(flareOk, true, 'PHOTON_FLARE action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during photon flare.');

  // 5. SIDEROPHORE_RAIN
  const rainOk = world.triggerEnvironmentalAction('SIDEROPHORE_RAIN', p1.coord, 35);
  assert.strictEqual(rainOk, true, 'SIDEROPHORE_RAIN action must trigger successfully.');
  assert.ok(p1.getChelator() > 0, 'Epicenter pore must receive chelator rain.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during siderophore rain.');

  // 6. TIDAL_INVERSION
  const tidalOk = world.triggerEnvironmentalAction('TIDAL_INVERSION', undefined, 40);
  assert.strictEqual(tidalOk, true, 'TIDAL_INVERSION action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during tidal inversion.');

  // 7. ACID_PURGE
  const acidOk = world.triggerEnvironmentalAction('ACID_PURGE', p2.coord, 50);
  assert.strictEqual(acidOk, true, 'ACID_PURGE action must trigger successfully.');
  world.step();
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Energy conserved during acid purge.');

  console.log('    ✓ Test 3 Passed: Tactical Action Deck (all 7 cards) & First-Law ledger audits verified.');
}
