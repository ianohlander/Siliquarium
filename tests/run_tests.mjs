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
  OperatorCondition,
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
  ThermodynamicLedger,
  TaxonomyNomenclature
} from '../dist/core/index.js';
import { CircuitTopology } from '../dist/visualizers/CircuitTopology.js';
import { runStage8 } from './stage8_engine.mjs';
import { runStage9 } from './stage9_visualizers.mjs';
import { runStage10 } from './stage10_paleontologist.mjs';
import { runStage11 } from './stage11_fossil_freezer.mjs';
import { runStage12 } from './stage12_pelagic_spores.mjs';
import { runStage13 } from './stage13_phylogeny_ltee.mjs';
import { runStage14 } from './stage14_biobank.mjs';
import { runStage15 } from './stage15_safari_autopsy_and_chroma.mjs';
import { runStage16 } from './stage16_design_studio.mjs';
import { runStage18 } from './stage18_geodynamics_and_proto_cognition.mjs';
import { runStage19 } from './stage19_slime_kinematics_and_chronicle.mjs';
import { runStage20 } from './stage20_simulation_branching_and_snapshots.mjs';
import { runStage21 } from './stage21_novel_metabolic_innovations.mjs';
import { runStage22 } from './stage22_headless_server_and_remote_sync.mjs';
import { runStage23 } from './stage23_sensory_porins_sparse_engine_and_tactical_deck.mjs';
import { runStage24 } from './stage24_adversarial_zero_smuggling_audit.mjs';

console.log('=========================================');
console.log('🐠 Siliquarium Comprehensive Test Suite');
console.log(`   Version: ${SILIQUARIUM_VERSION}`);
console.log('=========================================');

const startTime = performance.now();
const totalStages = 25;
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

async function runAsyncStage(stageNum, name, testFn) {
  try {
    console.log(`\n[Stage ${stageNum}/${totalStages}] ${name}...`);
    await testFn();
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
    'docs/PHASE_3_VISUALIZER_GUIDE.md',
    'docs/PHASE_3_VISUALIZER_GUIDE.html',
    'docs/PHASE_4_PALEONTOLOGY_GUIDE.md',
    'docs/PHASE_4_PALEONTOLOGY_GUIDE.html',
    'docs/PHASE_5_PELAGIC_SPORES_GUIDE.md',
    'docs/PHASE_5_PELAGIC_SPORES_GUIDE.html',
    'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.md',
    'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html',
    'docs/CURRICULUM_AND_SYLLABUS.md',
    'docs/CURRICULUM_AND_SYLLABUS.html',
    'docs/PEDAGOGICAL_COMPANION_SUITE.md',
    'docs/PEDAGOGICAL_COMPANION_SUITE.html',
    'docs/companion/glossary.md',
    'docs/companion/glossary.html',
    'docs/companion/study_guides.md',
    'docs/companion/study_guides.html',
    'docs/companion/bibliography.md',
    'docs/companion/bibliography.html',
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
  const prngA = new Mulberry32Prng(0x1337c0de);
  const prngB = new Mulberry32Prng(0x1337c0de);
  for (let i = 0; i < 1000; i++) assert.strictEqual(prngA.nextUint32(), prngB.nextUint32(), `PRNG diverged at ${i}`);
  const forkA = prngA.fork();
  const forkB = prngB.fork();
  for (let i = 0; i < 100; i++) assert.strictEqual(forkA.nextFloat(), forkB.nextFloat(), 'Forked PRNG streams diverged');
  for (let i = 0; i < 200; i++) {
    const rInt = prngA.nextInt(10, 20);
    assert.ok(rInt >= 10 && rInt <= 20, `nextInt out of range: ${rInt}`);
  }
});

// Stage 2: 64-Entry Degenerate Codon Table & Synonymous Degeneracy
runStage(2, 'Testing 64-Entry Degenerate Codon Table & Neutral Introns', () => {
  const allEntries = CodonTable.getAllEntries();
  assert.strictEqual(allEntries.length, 64, 'Codon table must have exactly 64 entries');
  const seenBitPatterns = new Set();
  for (let i = 0; i < 64; i++) {
    const entry = CodonTable.getEntry(i);
    assert.strictEqual(entry.index, i, `Entry index mismatch at ${i}`);
    seenBitPatterns.add(entry.bitPattern);
  }
  assert.strictEqual(seenBitPatterns.size, 64, 'Bit patterns must be uniquely mapped');
  assert.ok(allEntries.filter(e => e.type === CodonType.GATE_AND).length > 1, 'AND degenerate');
  assert.ok(allEntries.filter(e => e.type === CodonType.GATE_OR).length > 1, 'OR degenerate');
  assert.ok(allEntries.filter(e => e.type === CodonType.GATE_NOT).length > 1, 'NOT degenerate');
  assert.ok(allEntries.filter(e => e.type === CodonType.INTRON_SILENT).length >= 4, 'Intron buffers');

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

  // 3D 8-connectivity (6 planar + 2 vertical)
  const neighbors3D = origin.getNeighbors3D();
  assert.strictEqual(neighbors3D.length, 8, 'Origin must have 8 3D neighbors (6 planar + 2 vertical)');
  assert.ok(neighbors3D.some(n => n.z === 1), 'Must include upward vertical neighbor');
  assert.ok(neighbors3D.some(n => n.z === -1), 'Must include downward vertical neighbor');

  const validNeighbors3D = grid.getValidNeighbors3D(origin);
  assert.strictEqual(validNeighbors3D.length, 6, 'Valid 3D neighbors must respect boundary and basalt obstacles');
  assert.ok(!validNeighbors3D.some(n => n.equals(rockObstacle)), 'Basalt obstacle must not be in valid 3D neighbors');
});

// Stage 4: Pore Battery, Landauer Dissipation & Mass Balance
runStage(4, 'Testing Pore Battery, Landauer Switching Costs & Mass Balance', () => {
  const battery = new PoreBattery(50, 20, 100);
  assert.strictEqual(battery.getEnergy(), 50, 'Initial energy mismatch');
  assert.strictEqual(battery.getMatter(), 20, 'Initial matter mismatch');

  // Verify PoreWorkshop metabolite feedback pool
  const workshop = PoreWorkshop.fromBitstring('000000001100010110100000100110110000');
  assert.strictEqual(workshop.getMetabolitePool().length, 4, 'Metabolite pool must have 4 state channels (M0..M3)');
  assert.ok(workshop.getMetabolitePool().every(m => m === false), 'Metabolite channels must initialize to false');
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

  // Blind photocopy replication (legacy defaults: duplication = 0, deletion = 0)
  const childCell = cell.reproduce(prng, 0.05);
  assert.strictEqual(childCell.getGeneration(), 1, 'Child generation must be parent + 1');
  assert.strictEqual(childCell.getSafe().length(), 60, 'Child safe must remain 60 bits with 0 duplication');
  assert.strictEqual(cell.getSafe().getTape(), safe.getTape(), 'Parent tape uncorrupted after division');

  // Dynamic Genome Growth: Susumu Ohno (1970) Tandem Codon Duplication
  const childDuplicated = cell.reproduce(prng, 0, undefined, 1.0, 0); // 100% duplication rate
  assert.strictEqual(childDuplicated.getSafe().length(), 66, 'Tandem codon duplication must expand genome from 60 to 66 bits (11 codons)');
  assert.strictEqual(childDuplicated.getSafe().getCodonCount(), 11, 'Codon count must increase to 11');

  // Compounded Duplication
  const grandChildDuplicated = childDuplicated.reproduce(prng, 0, undefined, 1.0, 0);
  assert.strictEqual(grandChildDuplicated.getSafe().length(), 72, 'Second duplication must expand genome to 72 bits (12 codons)');
  assert.strictEqual(grandChildDuplicated.getSafe().getCodonCount(), 12, 'Codon count must increase to 12');

  // Unbounded Genome Growth: Must grow past legacy 144-bit limit without artificial restriction
  let bigCell = grandChildDuplicated;
  for (let d = 0; d < 14; d++) {
    bigCell = bigCell.reproduce(prng, 0, undefined, 1.0, 0);
  }
  assert.ok(bigCell.getSafe().length() > 144, `Genome length must exceed 144 bits (actual: ${bigCell.getSafe().length()})`);
  assert.strictEqual(bigCell.getSafe().length(), 156, '14 subsequent duplications must reach 156 bits (26 codons)');

  // Large Netlist Assembly: Workshop must assemble > 16 logic gates without truncation
  const twentyGateTape = '000000'.repeat(20) + '100000' + '100110' + '110000' + '110100'; // 20 AND gates + porins + sinks
  const largeWorkshop = PoreWorkshop.fromBitstring(twentyGateTape);
  assert.strictEqual(largeWorkshop.getGates().length, 20, 'PoreWorkshop must assemble 20 catalytic gates without artificial 16-gate truncation');

  // Morphogenetic Plan: Cell must decode cleavage polarity and symmetry mode deterministically
  const morphoPlan = cell.getMorphogeneticPlan();
  assert.ok(morphoPlan.primaryDirection >= 0 && morphoPlan.primaryDirection <= 5, 'Primary cleavage direction must be 0..5');
  assert.ok(morphoPlan.symmetryMode >= 0 && morphoPlan.symmetryMode <= 3, 'Symmetry mode must be 0..3');

  // Genomic Streamlining: Landauer Thrift Deletion
  const childDeleted = cell.reproduce(prng, 0, undefined, 0, 1.0); // 100% deletion rate
  assert.strictEqual(childDeleted.getSafe().length(), 54, 'Codon deletion must shrink genome from 60 to 54 bits (9 codons)');
  assert.strictEqual(childDeleted.getSafe().getCodonCount(), 9, 'Codon count must decrease to 9');

  // Paleontology: Duplicated genome classified as Polyoperon ohnoi
  const ohnoTaxon = TaxonomyNomenclature.classify(childDuplicated.getSafe().getTape(), childDuplicated.getWorkshop().getGates().map(g => g.type), childDuplicated.getGeneration());
  assert.strictEqual(ohnoTaxon.binomialName, 'Polyoperon ohnoi', 'Expanded genome must be classified as Polyoperon ohnoi');

  const pore = new Pore(new HexCoord3D(0, 0, 0));
  assert.strictEqual(pore.getState(), PoreState.EMPTY, 'Initial pore must be EMPTY');
  pore.setResident(childCell);
  assert.strictEqual(pore.getState(), PoreState.OCCUPIED, 'Pore must be OCCUPIED');
  pore.triggerLysis();
  assert.strictEqual(pore.getState(), PoreState.CARCASS, 'Lysed pore must become CARCASS');
  assert.ok(pore.getCarcass() !== null, 'Carcass data must exist');
});

// Stage 6: Hydrothermal Vent Waveforms & Multi-Scale Cycles
runStage(6, 'Testing Hydrothermal Vent Waveforms & Multi-Scale Chemistry', () => {
  const vent = new VentPhysics(new HexCoord3D(0, 0, 0), 500);
  assert.strictEqual(vent.getEnergyCap(), 500, 'Vent energy cap mismatch');
  const stateNozzle = vent.evaluateAt(new HexCoord3D(0, 0, 0), 6);
  assert.ok(stateNozzle.thermalFlux > 0, 'Nozzle thermal flux must be positive');
  const stateDistant = vent.evaluateAt(new HexCoord3D(4, 0, 0), 6);
  assert.ok(stateNozzle.thermalFlux > stateDistant.thermalFlux, 'Thermal flux must dissipate with distance');
});

// Stage 7: Closed-Universe Thermodynamic Conservation Invariant Audit
runStage(7, 'Testing Closed-Universe Energy & Mass Conservation Invariant (Tolerance = 0.000)', () => {
  const ledger = new ThermodynamicLedger();
  ledger.recordEnergyInjection(100);
  ledger.recordMatterInjection(50);
  ledger.recordLandauerBurn(30);
  ledger.recordHeatDissipation(10);
  ledger.recordMatterSedimentation(5);
  const audit = ledger.auditBalance(60, 30, 15);
  assert.strictEqual(audit.energyBalanceDelta, 0, 'Energy conservation leak detected! Delta != 0');
  assert.ok(audit.isEnergyConserved, 'Conservation of Energy invariant violated');
  assert.strictEqual(audit.matterBalanceDelta, 0, 'Mass conservation leak detected! Delta != 0');
  assert.ok(audit.isMatterConserved, 'Conservation of Matter invariant violated');
});

// Stage 8: Simulation Engine, Stepping Loop & Closed-Universe Telemetry
runStage(8, 'Testing Simulation Engine, Loop & Closed-Universe Telemetry', () => {
  runStage8();
});

// Stage 9: OrbitCamera 3D Matrix Math, Screen-to-Ray Projections & Hex Grid
runStage(9, 'Testing OrbitCamera 3D Math, Raycast Unprojection & Hex Geometry', () => {
  runStage9();
});

// Stage 10: Digital Paleontologist Motif Scanner & Weisfeiler-Lehman Graph Hashes
runStage(10, 'Testing Digital Paleontologist, Weisfeiler-Lehman Hashes & Uri Alon Motifs', () => {
  runStage10();
});

// Stage 11: Evolutionary Flight Recorder, Lenski Fossil Freezer & Counterfactual Autopsies
runStage(11, 'Testing Evolutionary Flight Recorder, Fossil Freezer & Single-Bit Autopsies', () => {
  runStage11();
});

// Stage 12: Phase 5 Pelagic Spores, Advection Drift & God-Suite Controls
runStage(12, 'Testing Pelagic Spore Dispersal, Advection, Settlement & God-Suite Controls', () => {
  runStage12();
});

// Stage 13: Phase 6 Multi-Lineage Phylogeny, LTEE Benchmarks & Convergent Evolution
runStage(13, 'Testing Multi-Lineage Phylogeny, LTEE Benchmarks & Convergent Evolution', () => {
  runStage13();
});

// Stage 14: Bio-Bank Cryo-Vault, Cross-Simulation Seeding & Inoculation Registry
runStage(14, 'Testing Bio-Bank Cryo-Vault, Cross-Simulation Seeding & Inoculation Registry', () => {
  runStage14();
});

// Stage 15: Safari Chroma Isolation, Metazoan Roles & Fullscreen CAD Autopsy Modal
runStage(15, 'Testing Safari Chroma Isolation, Metazoan Roles & Fullscreen CAD Autopsy', () => {
  runStage15();
});

// Stage 16: Siliquarium Design Studio, Geomorphology Sculpting & Counterfactual Lenski Chamber
runStage(16, 'Testing Siliquarium Design Studio, Geomorphology Sculpting & Lenski Chamber', () => {
  runStage16();
});

// Stage 17: Regulated Gene Expression, Operons & Landauer Energy Conservation
runStage(17, 'Testing Zero-Smuggling GRN, Unbuilt Repressed Gates & Differential Expression in Clones', () => {
  // 1. Verify neutral sequence-affinity OperatorCondition enum & CodonTable addressing
  assert.strictEqual(OperatorCondition.CONSTITUTIVE, 'CONSTITUTIVE');
  assert.strictEqual(OperatorCondition.REGULATED_CH0, 'REGULATED_CH0');
  assert.strictEqual(OperatorCondition.REGULATED_CH1, 'REGULATED_CH1');
  assert.strictEqual(OperatorCondition.REGULATED_CH2, 'REGULATED_CH2');
  assert.strictEqual(OperatorCondition.REGULATED_CH3, 'REGULATED_CH3');

  // Verify codons 60-63 have neutral non-teleological sequence affinity addresses
  const codon60 = CodonTable.getEntry(60);
  const codon61 = CodonTable.getEntry(61);
  const codon62 = CodonTable.getEntry(62);
  const codon63 = CodonTable.getEntry(63);
  assert.strictEqual(codon60.label, 'OP_REG0');
  assert.strictEqual(codon60.operatorTarget, 0);
  assert.strictEqual(codon61.label, 'OP_REG1');
  assert.strictEqual(codon61.operatorTarget, 1);
  assert.strictEqual(codon62.label, 'OP_REG2');
  assert.strictEqual(codon62.operatorTarget, 2);
  assert.strictEqual(codon63.label, 'OP_REG3');
  assert.strictEqual(codon63.operatorTarget, 3);

  // 2. Build multi-operon synthetic genome tape:
  // Operon 0 (Constitutive Core): AND (0) + STREAM_A (32) + BATTERY (48)
  // Operon 1 (Channel 2 / Toxin-Regulated): OP_REG2 (62) + NOT (12) + TOXIN_T (44)
  // Operon 2 (Channel 3 / Starvation-Regulated): OP_REG3 (63) + OR (22)
  const op0 = '000000' + '100000' + '110000'; // Codons 0, 32, 48
  const op1 = '111110' + '001100' + '101100'; // Codons 62 (OP_REG2: target channel 2), 12, 44
  const op2 = '111111' + '010110';             // Codons 63 (OP_REG3: target channel 3), 22
  const tape = op0 + op1 + op2;
  assert.strictEqual(tape.length, 48, 'Synthetic tape must be 48 bits (8 codons)');

  const trans = CodonTranslator.translateTape(tape);
  assert.strictEqual(trans.operons.length, 3, 'Must partition into exactly 3 operons');
  assert.strictEqual(trans.operons[0].name, 'Constitutive Core');
  assert.strictEqual(trans.operons[0].targetChannel, null);
  assert.strictEqual(trans.operons[1].name, 'Regulated Operon (Channel M_2)');
  assert.strictEqual(trans.operons[1].targetChannel, 2);
  assert.strictEqual(trans.operons[2].name, 'Regulated Operon (Channel M_3)');
  assert.strictEqual(trans.operons[2].targetChannel, 3);

  // 3. Assemble workshop from translation
  const ws = new PoreWorkshop();
  ws.assembleFromTranslation(trans, tape);
  assert.strictEqual(ws.getGateCount(), 3, 'Must assemble 3 total gates in genome (AND, NOT, OR)');

  // Tick 1: Clean water (streamA=true, streamB=false, toxinT=false, battery=50 mV)
  // Channel 2 (Toxin) = false, Channel 3 (Starvation) = false
  // Expected: Operon 0 EXPRESSED, Operon 1 REPRESSED (unbuilt), Operon 2 REPRESSED (unbuilt)
  const t1 = ws.stepTick(true, false, false, 50);
  assert.strictEqual(t1.expressionSignature, '100', 'Clean water expression signature must be 100');
  assert.strictEqual(t1.expressedGateCount, 1, 'Only 1 gate built and expressed (AND)');
  assert.strictEqual(t1.repressedGateCount, 2, '2 gates unbuilt / silenced (NOT, OR)');
  assert.strictEqual(ws.getActiveGateCount(), 1, 'Active gate count must be 1');
  assert.deepStrictEqual(ws.getOperonStates(), [true, false, false]);

  // Tick 2: Toxin influx (streamA=true, streamB=false, toxinT=true, battery=50 mV)
  // Channel 2 (Toxin) = true -> Induces Operon 1
  // Expected: Operon 0 EXPRESSED, Operon 1 EXPRESSED, Operon 2 REPRESSED
  const t2 = ws.stepTick(true, false, true, 50);
  assert.strictEqual(t2.expressionSignature, '110', 'Toxin presence must induce Operon 1 (signature 110)');
  assert.strictEqual(t2.expressedGateCount, 2, '2 gates built and expressed (AND, NOT)');
  assert.strictEqual(t2.repressedGateCount, 1, '1 gate unbuilt / silenced (OR)');
  assert.strictEqual(ws.getActiveGateCount(), 2, 'Active gate count must be 2');
  assert.deepStrictEqual(ws.getOperonStates(), [true, true, false]);

  // Tick 3: Starvation crisis (streamA=false, streamB=false, toxinT=false, battery=15 mV)
  // Channel 3 (Starvation) = true -> Induces Operon 2
  // Expected: Operon 0 EXPRESSED, Operon 1 REPRESSED, Operon 2 EXPRESSED
  const t3 = ws.stepTick(false, false, false, 15);
  assert.strictEqual(t3.expressionSignature, '101', 'Starvation must induce Operon 2 (signature 101)');
  assert.strictEqual(t3.expressedGateCount, 2, '2 gates built and expressed (AND, OR)');
  assert.strictEqual(t3.repressedGateCount, 1, '1 gate unbuilt / silenced (NOT)');
  assert.strictEqual(ws.getActiveGateCount(), 2, 'Active gate count must be 2');
  assert.deepStrictEqual(ws.getOperonStates(), [true, false, true]);

  // 4. Verify Cell Level Integration & Landauer Thrift
  const safe = new GenomeSafe(tape);
  const cell = new PoreCell(safe, 50, 20, 0);
  const cellTickClean = cell.tick(true, false, false);
  assert.strictEqual(cellTickClean.telemetry.expressionSignature, '100', 'Cell tick must report signature 100 in clean water');
  assert.strictEqual(cellTickClean.telemetry.repressedGateCount, 2, 'Cell tick must report 2 repressed gates');

  // 5. PROVE DIFFERENTIAL GENE EXPRESSION IN ISOGENIC CLONES (IDENTICAL GENOTYPE, DIVERGENT GATE ARCHITECTURE)
  // User mandate: "if we are suppressing specific sections of the codon, then those gates they code for
  // should not even get built... the gate architecture of identical silicoids should be different."
  const safeCloneA = new GenomeSafe(tape);
  const safeCloneB = new GenomeSafe(tape);
  assert.strictEqual(safeCloneA.getTape(), safeCloneB.getTape(), 'Genotypes must be 100% identical in GenomeSafe');

  const cellCloneA = new PoreCell(safeCloneA, 50, 20, 0); // Positioned in clean water
  const cellCloneB = new PoreCell(safeCloneB, 50, 20, 0); // Positioned in toxic water

  const tickA = cellCloneA.tick(true, false, false); // Clean
  const tickB = cellCloneB.tick(true, false, true);  // Toxic

  // Genotype is 100% identical:
  assert.strictEqual(cellCloneA.getSafe().getTape(), cellCloneB.getSafe().getTape());

  // But Active Proteome / Phenotypic Gate Architecture is measurably DIFFERENT:
  assert.strictEqual(tickA.telemetry.expressionSignature, '100', 'Clone A expresses only Operon 0');
  assert.strictEqual(tickB.telemetry.expressionSignature, '110', 'Clone B expresses Operons 0 & 1');
  assert.strictEqual(tickA.telemetry.expressedGateCount, 1, 'Clone A has built exactly 1 gate');
  assert.strictEqual(tickB.telemetry.expressedGateCount, 2, 'Clone B has built exactly 2 gates');
  assert.notStrictEqual(tickA.telemetry.expressedGateCount, tickB.telemetry.expressedGateCount,
    'Identical silicoid genomes MUST have different built gate architectures in different environments');

  // Verify CircuitTopology confirms different gate architecture for identical DNA:
  const ventClean = { streamA: true, streamB: false, toxinT: false, age: 1 };
  const ventToxic = { streamA: true, streamB: false, toxinT: true, age: 1 };
  const circuitA = CircuitTopology.analyze(tape, ventClean, true, cellCloneA.getWorkshop().getOperonStates());
  const circuitB = CircuitTopology.analyze(tape, ventToxic, true, cellCloneB.getWorkshop().getOperonStates());

  assert.strictEqual(circuitA.gateCount, 1, 'Circuit A schematic must build only 1 gate chip');
  assert.strictEqual(circuitB.gateCount, 2, 'Circuit B schematic must build 2 gate chips');
  assert.strictEqual(circuitA.totalGenomeGates, 3, 'Both cells have 3 gates in DNA safe');
  assert.strictEqual(circuitB.totalGenomeGates, 3, 'Both cells have 3 gates in DNA safe');
  assert.strictEqual(circuitA.isDifferentiallyExpressed, true, 'Circuit A has unbuilt/silenced genes');
  assert.strictEqual(circuitB.isDifferentiallyExpressed, true, 'Circuit B has unbuilt/silenced genes');
  assert.notStrictEqual(circuitA.gateCount, circuitB.gateCount,
    'Physical schematic netlists for identical genomes MUST have different built gate counts');
});

// Stage 18: Geodynamic Pressure Engine & Proto-Cognition (Specimens 16–20)
runStage(18, 'Testing Geodynamic Waves, Precursors, Conduit Choking & Proto-Cognition Motifs (Specimens 16–20)', () => {
  runStage18();
});

// Stage 19: Slime Treadmilling Kinematics, Colony Recorder & Chronicle Historical Playback
await runAsyncStage(19, 'Testing Slime Mold Treadmilling, Colony Kinematics Recording, A-B Looping & Chronicle Playback', async () => {
  await runStage19();
});

// Stage 20: Full Simulation State Export/Load, Evolutionary Branching & Thermodynamic Conservation Audits
await runAsyncStage(20, "Testing Full Simulation State Export/Load, Replaying Life's Tape & Evolutionary Branching", async () => {
  await runStage20();
});

// Stage 21: Novel Metabolic Innovations, Syntrophy, Biofilm EPS & Vampiric Kleptoplasty
await runAsyncStage(21, 'Testing Novel Metabolic Innovations, Syntrophy, Biofilm EPS & Vampiric Kleptoplasty', async () => {
  await runStage21();
});

// Stage 22: Headless Server Simulation Engine, SSE Broadcaster & Remote Sync
await runAsyncStage(22, 'Testing Headless Server Simulation Engine, SSE Broadcaster & Remote Sync Subsystem', async () => {
  await runStage22();
});

// Stage 23: Sensory Porins, Sparse Active Pore Engine & Tactical Deck
await runAsyncStage(23, 'Testing Zero-Smuggling Sensory Porins, Sparse Engine & Tactical Action Deck', async () => {
  await runStage23();
});

// Stage 24: Dembski Adversarial Zero-Smuggling Audit & 31 Biological Evolution Strategies
await runAsyncStage(24, 'Testing Dembski Adversarial Zero-Smuggling Audit (I_+ = 0) & 31 Biological Evolution Strategies', async () => {
  await runStage24();
});

const elapsed = (performance.now() - startTime).toFixed(1);
console.log('\n=========================================');
console.log(`🎉 ALL ${passedStages}/${totalStages} TEST STAGES VERIFIED in ${elapsed}ms!`);
console.log('=========================================');
