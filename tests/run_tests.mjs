#!/usr/bin/env node

/**
 * 🐠 Siliquarium Native Zero-Dependency Test Runner
 * Progressive 8-Stage Architecture & Verification Pipeline
 */

import { performance } from 'node:perf_hooks';
import fs from 'node:fs';
import assert from 'node:assert';

// Import compiled Phase 1 Core Kernel from dist
import {
  SILIQUARIUM_VERSION,
  Mulberry32Prng,
  CodonTable,
  CodonTranslator,
  CodonType,
  HexCoord3D,
  HexGrid3D,
  PoreBattery,
  GenomeSafe,
  PoreWorkshop,
  PoreCell,
  Pore,
  PoreState,
  PHYSICAL_CONSTANTS,
  VentPhysics,
  ThermodynamicLedger
} from '../dist/core/index.js';

console.log('=========================================');
console.log('🐠 Siliquarium Comprehensive Test Suite');
console.log(`   Version: ${SILIQUARIUM_VERSION}`);
console.log('=========================================');

const startTime = performance.now();
const totalStages = 8;
let passedStages = 0;

function runStage(stageNum, name, testFn) {
  try {
    console.log(`\n[Stage ${stageNum}/${totalStages}] ${name}...`);
    testFn();
    passedStages++;
    console.log(`  ✓ Stage ${stageNum} passed.`);
  } catch (err) {
    console.error(`  ✗ Stage ${stageNum} FAILED:`, err);
    process.exit(1);
  }
}

// Stage 0: Verification of Sealed Architecture, HTML Docs & Specification Completeness
runStage(0, 'Testing Architecture, HTML Docs & Theoretical Specification Completeness', () => {
  if (typeof performance.now !== 'function') {
    throw new Error('High-resolution performance timer unavailable.');
  }

  const requiredDocs = [
    'README.md',
    'THEORETICAL_MODEL.md',
    'docs/EPISTEMIC_FOUNDATIONS.md',
    'docs/BRAND_IDENTITY.md',
    'standards/DEVELOPMENT_STANDARDS.md',
    'standards/QA_AND_TESTING_STANDARDS.md',
    'standards/DOCUMENTATION_STANDARDS.md',
    'docs/index.html',
    'docs/THEORETICAL_MODEL.html',
    'docs/EPISTEMIC_FOUNDATIONS.html',
    'docs/BRAND_IDENTITY.html',
    'docs/logos.html',
    'logos/index.html',
    'logos/logo.jpg',
    'docs/assets/logos/logo.jpg'
  ];

  for (const doc of requiredDocs) {
    assert.ok(fs.existsSync(doc), `Required file missing: ${doc}`);
    const stat = fs.statSync(doc);
    assert.ok(stat.size > 0, `File is empty: ${doc}`);
  }
});

// Stage 1: PRNG Determinism & Sequence Reproducibility
runStage(1, 'Testing Mulberry32 PRNG Determinism & Cross-Platform Uniformity', () => {
  const seed = 0x1337c0de;
  const prngA = new Mulberry32Prng(seed);
  const prngB = new Mulberry32Prng(seed);

  // Assert exact bitwise reproducibility
  for (let i = 0; i < 1000; i++) {
    const valA = prngA.nextUint32();
    const valB = prngB.nextUint32();
    assert.strictEqual(valA, valB, `PRNG state diverged at step ${i}`);
  }

  // Assert fork produces deterministic independent stream
  const forkA = prngA.fork();
  const forkB = prngB.fork();
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(forkA.nextFloat(), forkB.nextFloat(), 'Forked PRNG streams diverged');
  }

  // Assert range bounds
  for (let i = 0; i < 500; i++) {
    const rInt = prngA.nextInt(10, 20);
    assert.ok(rInt >= 10 && rInt <= 20, `nextInt out of range: ${rInt}`);
    const rBit = prngA.nextBit();
    assert.ok(rBit === 0 || rBit === 1, `nextBit invalid: ${rBit}`);
  }
});

// Stage 2: 64-Entry Degenerate Codon Table & Synonymous Degeneracy
runStage(2, 'Testing 64-Entry Degenerate Codon Table & Neutral Introns', () => {
  const allEntries = CodonTable.getAllEntries();
  assert.strictEqual(allEntries.length, 64, 'Codon table must have exactly 64 entries');

  // Verify all 64 slots are distinct and valid
  const seenBitPatterns = new Set();
  for (let i = 0; i < 64; i++) {
    const entry = CodonTable.getEntry(i);
    assert.strictEqual(entry.index, i, `Entry index mismatch at ${i}`);
    assert.strictEqual(entry.bitPattern.length, 6, `Bit pattern length != 6 at ${i}`);
    seenBitPatterns.add(entry.bitPattern);
  }
  assert.strictEqual(seenBitPatterns.size, 64, 'Bit patterns must be uniquely mapped');

  // Verify synonymous degeneracy exists (Kimura neutral mutational buffer)
  const andEntries = allEntries.filter(e => e.type === CodonType.GATE_AND);
  const orEntries = allEntries.filter(e => e.type === CodonType.GATE_OR);
  const notEntries = allEntries.filter(e => e.type === CodonType.GATE_NOT);
  const intronEntries = allEntries.filter(e => e.type === CodonType.INTRON_SILENT);

  assert.ok(andEntries.length > 1, 'AND gate must be synonomously degenerate');
  assert.ok(orEntries.length > 1, 'OR gate must be synonomously degenerate');
  assert.ok(notEntries.length > 1, 'NOT gate must be synonomously degenerate');
  assert.ok(intronEntries.length >= 4, 'Must have silent intron buffers for neutral drift');

  // Verify tape translation
  const sampleTape = '000000' + '001100' + '010110' + '100000' + '100110' + '110000' + '110100' + '111000' + '111001' + '111111';
  assert.strictEqual(sampleTape.length, 60, 'Sample tape must be 60 bits');
  const trans = CodonTranslator.translateTape(sampleTape);
  assert.strictEqual(trans.instructions.length, 10, 'Must translate exactly 10 codon slots');
});

// Stage 3: 3D Stacked Hex Matrix (q, r, z) & Benthic Adjacency
runStage(3, 'Testing 3D Hex Matrix (q, r, z) Adjacency & Benthic Geometry', () => {
  const origin = new HexCoord3D(0, 0, 0);
  const neighbors = origin.getPlanarNeighbors();

  // All 6 planar neighbors must be at exact distance 1.0
  assert.strictEqual(neighbors.length, 6, 'Must have exactly 6 planar neighbors');
  for (const n of neighbors) {
    assert.strictEqual(origin.distanceTo(n), 1, 'Planar neighbors must be equidistant (1.0)');
  }

  // Coordinate equality and addition
  const east = origin.add(1, 0, 0);
  assert.ok(east.equals(new HexCoord3D(1, 0, 0)), 'HexCoord addition failed');
  assert.strictEqual(east.toKey(), '1,0,0', 'Key generation failed');

  // Vertical elevation check
  const [up, down] = origin.getVerticalNeighbors();
  assert.strictEqual(origin.distanceTo(up), 1, 'Vertical neighbor distance must be 1.0');
  assert.strictEqual(down.z, -1, 'Down z must be -1');

  // HexGrid3D bounds and basalt obstacle impedance
  const grid = new HexGrid3D(3, 0, 2);
  assert.ok(grid.isInBounds(origin), 'Origin must be in bounds');
  assert.ok(!grid.isInBounds(new HexCoord3D(5, 5, 0)), 'Far coord must be out of bounds');

  const rockObstacle = new HexCoord3D(1, 0, 0);
  grid.setBasaltObstacle(rockObstacle);
  assert.ok(grid.isBasaltObstacle(rockObstacle), 'Basalt obstacle not registered');
  assert.ok(!grid.setItem(rockObstacle, 'PoreItem'), 'Cannot place item on basalt obstacle');

  const validNeighbors = grid.getValidPlanarNeighbors(origin);
  assert.ok(!validNeighbors.some(n => n.equals(rockObstacle)), 'Basalt obstacle must not be in valid neighbors');
});

// Stage 4: Pore Battery, Landauer Dissipation & Mass Balance
runStage(4, 'Testing Pore Battery, Landauer Switching Costs & Mass Balance', () => {
  const battery = new PoreBattery(50, 20, 100);
  assert.strictEqual(battery.getEnergy(), 50, 'Initial energy mismatch');
  assert.strictEqual(battery.getMatter(), 20, 'Initial matter mismatch');
  assert.ok(!battery.isDivisionReady(), '50 energy should not be division-ready');

  // Charge battery
  const charged = battery.chargeEnergy(30);
  assert.strictEqual(charged, 30, 'Charge amount mismatch');
  assert.strictEqual(battery.getEnergy(), 80, 'Energy after charge mismatch');

  // Burn Landauer power (1 token per toggle)
  const burned = battery.burnLandauer(5);
  assert.strictEqual(burned, 5, 'Burned Landauer mismatch');
  assert.strictEqual(battery.getEnergy(), 75, 'Energy after Landauer burn mismatch');

  // Dissipate basal leak
  const leaked = battery.dissipateBasalLeak(1);
  assert.strictEqual(leaked, 1, 'Leaked amount mismatch');
  assert.strictEqual(battery.getEnergy(), 74, 'Energy after leak mismatch');

  // Charge to division threshold
  battery.chargeEnergy(50); // Capped at 100
  assert.strictEqual(battery.getEnergy(), 100, 'Battery must cap at 100');
  assert.ok(battery.isDivisionReady(), 'Battery should be division-ready at 100 E and 20 M');

  // Split for reproduction (50/50 split)
  const { childEnergy, childMatter } = battery.splitForReproduction();
  assert.strictEqual(childEnergy, 50, 'Child must receive 50 energy');
  assert.strictEqual(battery.getEnergy(), 50, 'Parent must retain 50 energy');
  assert.strictEqual(childMatter, 10, 'Child must receive 10 matter');
  assert.strictEqual(battery.getMatter(), 10, 'Parent must retain 10 matter');

  // Starvation test
  battery.burnLandauer(100);
  assert.strictEqual(battery.getEnergy(), 0, 'Energy must hit 0');
  assert.ok(battery.isStarved(), 'Battery must be marked as starved');
});

// Stage 5: Epistemic Cut & Blind Photocopy Replication
runStage(5, 'Testing Howard Pattee Epistemic Cut & Blind Template Replication', () => {
  const prng = new Mulberry32Prng(42);
  const safe = GenomeSafe.createRandom(prng);
  assert.strictEqual(safe.length(), 60, 'Safe must hold exactly 60 bits');

  // Epistemic cut: Safe is inert during cell lifecycle
  const cell = new PoreCell(safe, 50, 20);
  assert.strictEqual(cell.getGeneration(), 0, 'Initial generation must be 0');
  assert.strictEqual(cell.getAge(), 0, 'Initial age must be 0');

  // Step tick: Active workshop runs while Safe remains unmutated
  const tickResult = cell.tick(true, true, false);
  assert.strictEqual(cell.getAge(), 1, 'Age must increment');
  assert.strictEqual(cell.getSafe().getTape(), safe.getTape(), 'Safe must NEVER mutate during cell lifetime');

  // Blind photocopy replication
  const childCell = cell.reproduce(prng, 0.05); // High mutation rate for testing
  assert.strictEqual(childCell.getGeneration(), 1, 'Child generation must be parent + 1');
  assert.strictEqual(childCell.getSafe().length(), 60, 'Child safe must be 60 bits');
  assert.strictEqual(cell.getSafe().getTape(), safe.getTape(), 'Parent tape must remain uncorrupted after division');

  // Inorganic Pore & Detritus scavenger cycle
  const pore = new Pore(new HexCoord3D(0, 0, 0));
  assert.strictEqual(pore.getState(), PoreState.EMPTY, 'Initial pore must be EMPTY');
  pore.setResident(childCell);
  assert.strictEqual(pore.getState(), PoreState.OCCUPIED, 'Pore must be OCCUPIED');

  // Lysis leaves behind a carcass
  pore.triggerLysis();
  assert.strictEqual(pore.getState(), PoreState.CARCASS, 'Lysed pore must become CARCASS');
  assert.ok(pore.getCarcass() !== null, 'Carcass data must exist');
});

// Stage 6: Hydrothermal Vent Waveforms & Multi-Scale Cycles
runStage(6, 'Testing Hydrothermal Vent Waveforms & Multi-Scale Chemistry', () => {
  const vent = new VentPhysics(new HexCoord3D(0, 0, 0), 500);
  assert.strictEqual(vent.getEnergyCap(), 500, 'Vent energy cap mismatch');

  // Test at nozzle: high thermal flux and alternating substrate pulses
  const stateNozzle = vent.evaluateAt(new HexCoord3D(0, 0, 0), 6);
  assert.ok(stateNozzle.thermalFlux > 0, 'Nozzle thermal flux must be positive');

  // Test distance dissipation: flux falls quadratically with distance
  const stateDistant = vent.evaluateAt(new HexCoord3D(4, 0, 0), 6);
  assert.ok(stateNozzle.thermalFlux > stateDistant.thermalFlux, 'Thermal flux must dissipate with distance');
});

// Stage 7: Closed-Universe Thermodynamic Conservation Invariant Audit
runStage(7, 'Testing Closed-Universe Energy & Mass Conservation Invariant (Tolerance = 0.000)', () => {
  const ledger = new ThermodynamicLedger();

  // Inject energy and matter into closed universe
  ledger.recordEnergyInjection(100);
  ledger.recordMatterInjection(50);

  // Simulate internal work: Landauer switching and basal leak
  const currentStoredEnergy = 60;
  ledger.recordLandauerBurn(30);
  ledger.recordHeatDissipation(10);

  // Simulate mass distribution: living bodies, carcasses, sediment
  const livingMatter = 30;
  const carcassMatter = 15;
  ledger.recordMatterSedimentation(5);

  const audit = ledger.auditBalance(currentStoredEnergy, livingMatter, carcassMatter);

  assert.strictEqual(audit.energyBalanceDelta, 0, 'Energy conservation leak detected! Delta != 0');
  assert.ok(audit.isEnergyConserved, 'Conservation of Energy invariant violated');

  assert.strictEqual(audit.matterBalanceDelta, 0, 'Mass conservation leak detected! Delta != 0');
  assert.ok(audit.isMatterConserved, 'Conservation of Matter invariant violated');
});

const elapsed = (performance.now() - startTime).toFixed(1);
console.log('\n=========================================');
console.log(`🎉 ALL ${passedStages}/${totalStages} TEST STAGES VERIFIED in ${elapsed}ms!`);
console.log('=========================================');
