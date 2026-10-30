/**
 * ============================================================================
 *  SILIQUARIUM — DEMBSKI PROTOCOL ROUND 3 POST-REMEDIATION VERIFICATION SUITE
 *  File: Adversarial QA/falsification_suite_round3.mjs
 *  Target: Compiled TypeScript output in ./dist/
 * ============================================================================
 *
 *  Empirically verifies that all 12 Round 3 Deep-Weeds Adversarial Challenges
 *  (PROOF 1A through PROOF 5B) have been 100% remediated with zero active
 *  information smuggling (I_+ = 0) and strict First-Law conservation.
 */

import assert from 'node:assert/strict';

import { CodonType } from '../dist/core/codons/CodonTable.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';
import { PoreWorkshop } from '../dist/core/domain/PoreWorkshop.js';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { Pore, PoreMedium } from '../dist/core/domain/Pore.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { MotifScanner } from '../dist/core/paleontology/MotifScanner.js';
import { MotifType } from '../dist/core/paleontology/NetworkMotif.js';
import { TaxonomyNomenclature } from '../dist/core/paleontology/TaxonomyNomenclature.js';
import { TreadmillingEngine } from '../dist/engine/kinematics/TreadmillingEngine.js';
import { EnvironmentPresetRegistry } from '../dist/engine/storage/EnvironmentPresetRegistry.js';
import { BioBank } from '../dist/engine/storage/BioBank.js';
import { CircuitAutopsyModal } from '../dist/ui/CircuitAutopsyModal.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';

const CODON_BITS = {
  [CodonType.GATE_AND]:            '000000', // 0
  [CodonType.PORIN_PHOTON_IR]:     '000110', // 6
  [CodonType.PORIN_STREAM_C]:      '001000', // 8
  [CodonType.GATE_NOT]:            '001100', // 12
  [CodonType.PORIN_BARO_ACOUSTIC]: '010000', // 16
  [CodonType.SECRETION_CHELATOR]:  '010010', // 18
  [CodonType.GATE_OR]:             '010110', // 22
  [CodonType.PORIN_MECHANO_TOUCH]: '011010', // 26
  [CodonType.SECRETION_EPS]:       '011100', // 28
  [CodonType.PORIN_STREAM_A]:      '100000', // 32
  [CodonType.PORIN_ELECTRO_REDOX]: '100100', // 36
  [CodonType.PORIN_STREAM_B]:      '100110', // 38
  [CodonType.PORIN_STREAM_D]:      '101010', // 42
  [CodonType.PORIN_TOXIN_T]:       '101100', // 44
  [CodonType.SINK_BATTERY]:        '110000', // 48
  [CodonType.SINK_SEPTUM]:         '110100', // 52
  [CodonType.INTRON_SILENT]:       '111000', // 56
  INTRON_57:                       '111001', // 57
  INTRON_58:                       '111010', // 58
  INTRON_59:                       '111011', // 59
  OP_REG0:                         '111100', // 60 (REGULATED_CH0)
  OP_REG2:                         '111110', // 62 (REGULATED_CH2)
};

function makeTape(codons, padTo6 = true) {
  const list = [...codons];
  while (padTo6 && list.length < 6) {
    list.push(CodonType.INTRON_SILENT);
  }
  return list.map(c => CODON_BITS[c] ?? c).join('');
}

const scanMotifs = (w) => MotifScanner.scanWorkshop(w).map(m => m.motif.type);
const classifyWorkshop = (w, gen = 1) =>
  TaxonomyNomenclature.classify(
    w.toBitstring(),
    w.getBuiltGates().map(g => g.type),
    gen,
    w.hasSeptum(),
    false,
    false
  );

console.log('================================================================================');
console.log(' SILIQUARIUM — DEMBSKI ROUND 3 POST-REMEDIATION VERIFICATION SUITE');
console.log('================================================================================\n');

// ============================================================================
// BATTLEFRONT 1: Stack-AST Compiler & Sequential Physics (PoreWorkshop.ts)
// ============================================================================

console.log('[PROOF 1A] Positional Porin Binding with Zero Toxin Hijacking or Censoring (PoreWorkshop.ts)...');
{
  // 1. Unary NOT gate at slot 0 binds positionally to opPorinTypes[0] (PORIN_STREAM_A), never hijacked to PORIN_TOXIN_T:
  const wHijack = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.PORIN_TOXIN_T,
    CodonType.GATE_NOT,
    CodonType.SINK_BATTERY,
    CodonType.INTRON_SILENT,
  ]));
  const notGate = wHijack.getBuiltGates()[0];
  assert.equal(notGate.boundTerminalA, CodonType.PORIN_STREAM_A,
    'Unary GATE_NOT at slot 0 must bind positionally to opPorinTypes[0] (PORIN_STREAM_A)');

  // 2. Binary GATE_AND at slot 0 binds positionally to opPorinTypes[0] and opPorinTypes[1] without censoring PORIN_TOXIN_T:
  const wFilteredAnd = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_TOXIN_T,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_AND,
    CodonType.SINK_BATTERY,
    CodonType.INTRON_SILENT,
  ]));
  const andGate = wFilteredAnd.getBuiltGates()[0];
  assert.equal(andGate.boundTerminalA, CodonType.PORIN_STREAM_A);
  assert.equal(andGate.boundTerminalB, CodonType.PORIN_TOXIN_T,
    'Binary GATE_AND must bind positionally to opPorinTypes[1] (PORIN_TOXIN_T) without teleological censoring');
  console.log('  -> PASS: Positional porin binding verified (I_+ = 0 bits).');
}

console.log('[PROOF 1B] 0-Gate, 0-Battery Genomes Receive Zero Free Catalysis or Battery Access (PoreWorkshop.ts)...');
{
  const wZeroGateZeroBat = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.PORIN_STREAM_C,
    CodonType.PORIN_STREAM_D,
    CodonType.INTRON_SILENT,
    CodonType.INTRON_SILENT,
  ]));
  assert.equal(wZeroGateZeroBat.getBuiltGates().length, 0);
  assert.equal(wZeroGateZeroBat.hasBattery(), false, 'Genome has zero SINK_BATTERY codons');

  const resZeroGate = wZeroGateZeroBat.stepTick(true, true, false, 50, true, true);
  assert.equal(resZeroGate.primaryActive, false, '0-gate genome must have primaryActive === false');
  assert.equal(resZeroGate.catalyticYield, 0, '0-gate, 0-battery genome must have catalyticYield === 0');
  console.log('  -> PASS: 0-gate, 0-battery genomes receive 0 free catalysis and 0 battery access.');
}

console.log('[PROOF 1C] Authentic 6-State Traveling-Wave Ring Oscillator & Reset-Verified Latch (PoreWorkshop.ts)...');
{
  // 1A. Under dark (0,0,0), 3-NOT ring visits all 6 traveling-wave states with every NOT gate inverting (!inputA):
  const wRingDark = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_NOT,
    CodonType.GATE_NOT,
    CodonType.GATE_NOT,
    CodonType.SINK_BATTERY,
  ]));
  const darkStates = [];
  for (let t = 0; t < 6; t++) {
    wRingDark.step(false, false, false);
    const gates = wRingDark.getBuiltGates();
    for (const g of gates) {
      assert.equal(g.output, !g.inputA, `Tick ${t} (dark): Gate ${g.id} must be a genuine inverter (output === !inputA)`);
    }
    darkStates.push(gates.map(g => Number(g.output)).join(''));
  }
  assert.equal(new Set(darkStates).size, 6, `Under (0,0,0), 3-NOT ring must visit all 6 states, got: ${darkStates.join(' -> ')}`);

  // 1B. Under fueled (1,1,0), 3-NOT ring ALSO oscillates through all 6 states and generates catalytic ATP yield:
  const wRingFueled = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_NOT,
    CodonType.GATE_NOT,
    CodonType.GATE_NOT,
    CodonType.SINK_BATTERY,
  ]));
  const fueledStates = [];
  let totalFueledYield = 0;
  for (let t = 0; t < 6; t++) {
    const res = wRingFueled.step(true, true, false);
    totalFueledYield += res.yield;
    fueledStates.push(wRingFueled.getBuiltGates().map(g => Number(g.output)).join(''));
  }
  assert.equal(new Set(fueledStates).size, 6, `Under (1,1,0), 3-NOT ring must visit all 6 states without freezing, got: ${fueledStates.join(' -> ')}`);
  assert.ok(totalFueledYield > 0, 'Fueled 3-NOT ring oscillator must generate positive catalytic ATP yield');

  // 2. Bistable Latch genuinely resets on toxinT=true and holds false on the SAME circuit instance:
  const latchTape = makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_AND,
    CodonType.GATE_OR,
    CodonType.SINK_BATTERY,
    CodonType.INTRON_SILENT,
  ]);
  const wLatch = PoreWorkshop.fromBitstring(latchTape);
  assert.equal(scanMotifs(wLatch).includes(MotifType.BISTABLE_LATCH), true);
  wLatch.step(true, true, false); // Set -> true
  assert.equal(wLatch.getBuiltGates()[1].output, true, 'Latch must set to true on (1,1,0)');
  wLatch.step(false, false, false); // Hold -> true
  assert.equal(wLatch.getBuiltGates()[1].output, true, 'Latch must hold true on (0,0,0)');
  wLatch.step(false, false, true); // Reset with toxinT=true -> false
  assert.equal(wLatch.getBuiltGates()[1].output, false, 'Latch must reset to false on (0,0,1)');
  wLatch.step(false, false, false); // Hold after reset -> false
  assert.equal(wLatch.getBuiltGates()[1].output, false, 'Latch must hold false on (0,0,0) after reset');

  // 3. Commuted [GATE_OR, GATE_AND] preserves leftBranch.output on G1.inputA:
  const wOrAnd2 = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_OR,
    CodonType.GATE_AND,
    CodonType.SINK_BATTERY,
    CodonType.INTRON_SILENT,
  ]));
  wOrAnd2.step(true, true, false);
  assert.equal(wOrAnd2.getBuiltGates()[0].output, true);
  assert.equal(wOrAnd2.getBuiltGates()[1].inputA, wOrAnd2.getBuiltGates()[0].output,
    'In [GATE_OR, GATE_AND], GATE_AND.inputA must equal leftBranch.output');
  console.log('  -> PASS: 6-state traveling-wave ring oscillator and reset-verified bistable latch confirmed.');
}

// ============================================================================
// BATTLEFRONT 2: Host-Side Oracles & Stateful Probe Isolation
// ============================================================================

console.log('[PROOF 2A] 0-Porin Dead Genome [GATE_NOT] Receives Zero Shield or Scavenging Grants...');
{
  const deadNotTape = makeTape([CodonType.GATE_NOT]);
  const wDeadNot = PoreWorkshop.fromBitstring(deadNotTape);
  const stepRes = wDeadNot.step(false, false, false);
  assert.equal(stepRes.primaryOutput, false, '0-porin [GATE_NOT] must output false in vacuum');
  const gates = wDeadNot.getBuiltGates();
  assert.equal(gates[0].output, false, 'Unbound 0-porin GATE_NOT must output false');

  const preyShield = wDeadNot.hasActiveCounterGradientInversion();
  const isCatabolicScavenger = wDeadNot.hasActiveNonConjunctiveCatalysis();
  assert.equal(preyShield, false, '0-porin dead [GATE_NOT] genome must NOT get preyShield');
  assert.equal(isCatabolicScavenger, false, '0-porin dead [GATE_NOT] genome must NOT get catabolic scavenging');
  console.log('  -> PASS: 0-porin dead [GATE_NOT] genome receives zero shield or scavenging grants.');
}

console.log('[PROOF 2B] Repressed SINK_SEPTUM Denies Colonial Adhesion & Silent Introns Are Morphogenetically Neutral (PoreCell.ts)...');
{
  const repressedSeptumTape = makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_AND,
    'OP_REG2',
    CodonType.SINK_SEPTUM,
    CodonType.SINK_BATTERY,
  ]);
  const cellRepressed = new PoreCell(new GenomeSafe(repressedSeptumTape), 120, 120);
  cellRepressed.tick(false, false, false);
  assert.equal(cellRepressed.hasSeptum(), false, 'Operon 1 is repressed when channel 2 is false');
  const morphPlan = cellRepressed.getMorphogeneticPlan();
  assert.equal(morphPlan.hasAdhesion, false, 'Repressed SINK_SEPTUM must NOT grant colonial adhesion');

  // Silent introns (56, 57, 58, 59) must have zero effect on cleavage direction or body topology:
  const intronTape1 = [
    CODON_BITS[CodonType.INTRON_SILENT],
    CODON_BITS[CodonType.INTRON_SILENT],
    CODON_BITS[CodonType.INTRON_SILENT],
    CODON_BITS[CodonType.PORIN_STREAM_A],
    CODON_BITS.OP_REG0,
    CODON_BITS[CodonType.SINK_SEPTUM],
  ].join('');
  const intronTape2 = [
    CODON_BITS.INTRON_57,
    CODON_BITS.INTRON_58,
    CODON_BITS.INTRON_59,
    CODON_BITS[CodonType.PORIN_STREAM_A],
    CODON_BITS.OP_REG0,
    CODON_BITS[CodonType.SINK_SEPTUM],
  ].join('');
  const plan1 = new PoreCell(new GenomeSafe(intronTape1), 50, 50).getMorphogeneticPlan();
  const plan2 = new PoreCell(new GenomeSafe(intronTape2), 50, 50).getMorphogeneticPlan();
  assert.deepEqual(
    { dir: plan1.primaryDirection, topo: plan1.preferredTopology },
    { dir: plan2.primaryDirection, topo: plan2.preferredTopology },
    'Silent non-coding introns (56..59) must be 100% neutral to 3D cleavage direction and colonial symmetry'
  );
  console.log('  -> PASS: Repressed SINK_SEPTUM denies adhesion and silent introns are 100% morphogenetically neutral.');
}

console.log('[PROOF 2C] TreadmillingEngine Candidate Probe Isolation (TreadmillingEngine.ts)...');
{
  const cell = new PoreCell(
    new GenomeSafe(makeTape([
      CodonType.PORIN_STREAM_A,
      CodonType.PORIN_STREAM_B,
      CodonType.GATE_AND,
      CodonType.SINK_BATTERY,
    ])),
    50, 50
  );
  const pDir = cell.getMorphogeneticPlan().primaryDirection;
  const [prefDq, prefDr] = HexCoord3D.PLANAR_DIRECTIONS[pDir];
  const parentPore = new Pore(new HexCoord3D(0, 0, 0));
  const nonPrefDirs = HexCoord3D.PLANAR_DIRECTIONS.filter(([dq, dr]) => !(dq === prefDq && dr === prefDr));
  const candA = new Pore(new HexCoord3D(nonPrefDirs[0][0], nonPrefDirs[0][1], 0));
  const candB = new Pore(new HexCoord3D(nonPrefDirs[1][0], nonPrefDirs[1][1], 0));

  const vent = {
    nozzleCoord: new HexCoord3D(0, 0, 0),
    streamA: true,
    streamB: true,
    toxinT: false,
    thermalFlux: 100,
    precursorWarning: false,
  };

  // With isolated per-candidate probeWorkshop instances, identical candidates tie and first candidate wins deterministically:
  const winnerAB = TreadmillingEngine.selectDirectionalCleavageTarget(parentPore, cell, [candA, candB], vent, []);
  const winnerBA = TreadmillingEngine.selectDirectionalCleavageTarget(parentPore, cell, [candB, candA], vent, []);
  assert.equal(winnerAB, candA, 'Isolated probeWorkshop must evaluate candA and candB with identical cold state');
  assert.equal(winnerBA, candB, 'Isolated probeWorkshop must not penalize the first candidate');
  console.log('  -> PASS: TreadmillingEngine evaluates each candidate pore in an isolated probeWorkshop.');
}

// ============================================================================
// BATTLEFRONT 3: Digital Paleontology, Nomenclature & Presets
// ============================================================================

console.log('[PROOF 3A] MotifScanner Rejects 0-Porin Dead Genomes & Repressed Porins (MotifScanner.ts)...');
{
  const wDeadCffl = PoreWorkshop.fromBitstring(makeTape([CodonType.GATE_AND, CodonType.GATE_OR, CodonType.GATE_AND]));
  assert.equal(scanMotifs(wDeadCffl).length, 0, '0-porin dead [GATE_AND, GATE_OR, GATE_AND] must claim 0 motifs');

  const wDeadIffl = PoreWorkshop.fromBitstring(makeTape([CodonType.GATE_AND, CodonType.GATE_NOT, CodonType.GATE_OR]));
  assert.equal(scanMotifs(wDeadIffl).length, 0, '0-porin dead [GATE_AND, GATE_NOT, GATE_OR] must claim 0 motifs');

  const wDeadNar = PoreWorkshop.fromBitstring(makeTape([CodonType.GATE_NOT]));
  assert.equal(scanMotifs(wDeadNar).length, 0, '0-porin dead [GATE_NOT] must claim 0 motifs');

  const wDeadChemo = PoreWorkshop.fromBitstring(makeTape([
    CodonType.GATE_AND, CodonType.GATE_NOT, CodonType.GATE_AND, 'OP_REG0'
  ]));
  assert.equal(scanMotifs(wDeadChemo).length, 0, '0-porin dead genome with OP_REG0 must claim 0 motifs');

  const wDeadDormancy = PoreWorkshop.fromBitstring(makeTape([
    CodonType.GATE_NOT, CodonType.GATE_NOT, CodonType.GATE_OR, 'OP_REG0'
  ]));
  assert.equal(scanMotifs(wDeadDormancy).length, 0, '0-porin dead dormancy genome must claim 0 motifs');

  const wRepressedPavlov = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.GATE_NOT,
    CodonType.GATE_AND,
    CodonType.GATE_OR,
    'OP_REG2',
    CodonType.PORIN_TOXIN_T, // Locked in repressed Operon 1!
  ]));
  wRepressedPavlov.step(false, false, false);
  assert.equal(scanMotifs(wRepressedPavlov).includes(MotifType.PREDICTIVE_PAVLOVIAN), false,
    'PORIN_TOXIN_T locked in repressed Operon 1 must NOT trigger PREDICTIVE_PAVLOVIAN');
  console.log('  -> PASS: MotifScanner rejects all 0-porin dead genomes and repressed porins.');
}

console.log('[PROOF 3B] TaxonomyNomenclature Rejects Non-Contiguous NOTs, 3-Gate Combinational Trees, and Repressed Porins...');
{
  const wFakeRing = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.GATE_NOT,
    CodonType.GATE_NOT,
    CodonType.GATE_AND,
    CodonType.GATE_NOT,
    CodonType.INTRON_SILENT,
  ]));
  assert.notEqual(classifyWorkshop(wFakeRing).binomialName, 'Chronobacterium johnsonii',
    'Non-contiguous [NOT, NOT, AND, NOT] must NOT be classified as Chronobacterium johnsonii');
  assert.notEqual(classifyWorkshop(wFakeRing).binomialName, 'Oscillocladus elowitzii',
    'Non-contiguous [NOT, NOT, AND, NOT] must NOT be classified as Oscillocladus elowitzii');

  const wFakeLatch = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_AND,
    CodonType.GATE_AND,
    CodonType.GATE_OR,
    CodonType.SINK_BATTERY,
  ]));
  assert.notEqual(classifyWorkshop(wFakeLatch).binomialName, 'Bistabilus collinsii',
    'Memoryless 3-gate [AND, AND, OR] must NOT be classified as Bistabilus collinsii');

  const wRepressedCit = PoreWorkshop.fromBitstring(makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_AND,
    'OP_REG2',
    CodonType.PORIN_STREAM_C, // Repressed in Operon 1 (OP_REG2 with toxinT=false)
    CodonType.SINK_BATTERY,
  ]));
  wRepressedCit.step(true, true, false);
  assert.notEqual(classifyWorkshop(wRepressedCit).binomialName, 'Citratovibrio lenskii',
    'Cell with repressed PORIN_STREAM_C must NOT be classified as Citratovibrio lenskii');
  console.log('  -> PASS: TaxonomyNomenclature strictly enforces contiguous odd NOT runs, 2-gate latches, and expressed operons.');
}

console.log('[PROOF 3C] Viable Founder Genomes in EnvironmentPresetRegistry.ts & BioBank.ts...');
{
  const presets = EnvironmentPresetRegistry.getInstance().getAll();
  assert.equal(presets.length, 5);
  let totalStrains = 0;
  for (const preset of presets) {
    for (const strain of (preset.founderStrains ?? [])) {
      totalStrains++;
      const w = PoreWorkshop.fromBitstring(strain.tapeBitstring);
      assert.equal(w.hasBattery(), true, `Preset ${preset.id} strain "${strain.name}" must possess SINK_BATTERY`);
      const res = w.stepTick(true, true, false, 50, true, true, true, true, true, true);
      assert.ok(res.catalyticYield >= 2, `Preset ${preset.id} strain "${strain.name}" must produce catalyticYield >= 2`);
    }
  }
  assert.equal(totalStrains, 10);

  const bioBank = new BioBank();
  const wolpertEntry = bioBank.getAll().find(s => s.name.includes('Wolpert'));
  assert.ok(wolpertEntry, 'Wolpert Branching Metazoan must exist in BioBank');
  const wolpertCell = new PoreCell(new GenomeSafe(wolpertEntry.tapeBitstring), 50, 50);
  const wolpertWorkshop = wolpertCell.getWorkshop();
  const wolpertPlan = wolpertCell.getMorphogeneticPlan();
  assert.ok(wolpertWorkshop.getOperons().length >= 2, 'Wolpert Branching Metazoan must have >= 2 operons');
  assert.equal(wolpertPlan.hasAdhesion, true, 'Wolpert Branching Metazoan must have hasAdhesion === true');
  assert.equal(wolpertPlan.preferredTopology, 'DENDRITIC', 'Wolpert Branching Metazoan must have preferredTopology === DENDRITIC');
  console.log('  -> PASS: All 10 EnvironmentPresetRegistry founder strains and BioBank Wolpert Metazoan verified.');
}

// ============================================================================
// BATTLEFRONT 4: UI/Autopsy Sequential Memory & Authentic Telemetry Yield
// ============================================================================

console.log('[PROOF 4A & 4B] Stateful Latch Autopsy (CircuitAutopsyModal.ts) & Authentic Telemetry Yield (SimulationWorld.ts)...');
{
  const latchTape = makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.PORIN_TOXIN_T,
    CodonType.GATE_AND,
    CodonType.GATE_OR,
    CodonType.SINK_BATTERY,
  ]);
  const modal = new CircuitAutopsyModal(new SimulationWorld(4, 4));
  const holdAutopsy = modal.evaluateCircuitState(latchTape, false, false, false);
  assert.equal(holdAutopsy.primaryActive, true,
    'CircuitAutopsyModal.evaluateCircuitState must preserve 1-bit hold state on (0,0,0) for BISTABLE_LATCH');

  const world = new SimulationWorld(6, 6);
  const targetCoord = new HexCoord3D(1, 1, 0);
  const targetPore = world.getPore(targetCoord);
  targetPore.clear();
  const noBatCell = new PoreCell(
    new GenomeSafe(makeTape([CodonType.PORIN_STREAM_A, CodonType.GATE_NOT])),
    50, 20
  );
  noBatCell.tick(false, false, false);
  assert.equal(noBatCell.getLastTickResult().telemetry.catalyticYield, 0);
  targetPore.setResident(noBatCell);
  world.markTelemetryDirty();
  const exportedPore = world.exportTelemetry().pores.find(
    p => p.coord.q === 1 && p.coord.r === 1 && p.coord.z === 0
  );
  assert.equal(exportedPore.catalyticYield, 0,
    'SimulationWorld.exportTelemetry() must report authentic catalyticYield === 0 when cell lacks SINK_BATTERY');
  console.log('  -> PASS: CircuitAutopsyModal reflects sequential latch memory and SimulationWorld exports authentic catalyticYield.');
}

// ============================================================================
// BATTLEFRONT 5: Endosymbiosis Donor Organelle Preservation, Sporulation
//                Organelle Inheritance & Strict First-Law Conservation
// ============================================================================

console.log('[PROOF 5A] Endosymbiosis Donor Genome Preservation & Sporulation Organelle Inheritance (SimulationWorld.ts)...');
{
  const safeA = new GenomeSafe(makeTape([CodonType.PORIN_STREAM_A, CodonType.GATE_AND, CodonType.SINK_BATTERY]));
  const safeB = new GenomeSafe(makeTape([CodonType.PORIN_STREAM_C, CodonType.GATE_OR, CodonType.SINK_BATTERY]));
  const cellA = new PoreCell(safeA, 50, 20);
  const cellB = new PoreCell(safeB, 50, 20);

  const donorSafeA = cellA.getSafe();
  const donorSafeB = cellB.getSafe();
  const chimericSafe = GenomeSafe.createChimeric(donorSafeA, donorSafeB);
  cellA.adoptChimericGenome(chimericSafe, 'chimera-clade');
  cellB.adoptChimericGenome(chimericSafe, 'chimera-clade');
  cellA.installOrganelle(donorSafeB);
  cellB.installOrganelle(donorSafeA);

  assert.equal(cellA.getOrganelleSafe().getTape(), safeB.getTape(),
    'cellA must install partner cellB original donor genome safeB');
  assert.equal(cellB.getOrganelleSafe().getTape(), safeA.getTape(),
    'cellB must install partner cellA original donor genome safeA');

  // Verify pelagic sporulation preserves organelleSafe:
  const world = new SimulationWorld(6, 6);
  for (const p of world.pores) {
    p.clear();
    if (!p.isAqueous()) p.setBasalt(true);
  }
  const rockCoord = new HexCoord3D(0, 0, 0);
  const rockPore = world.getPore(rockCoord);
  rockPore.setBasalt(false);
  const upFluidPore = world.getPore(new HexCoord3D(0, 0, 1));
  upFluidPore.setBasalt(false);
  upFluidPore.setMedium(PoreMedium.AQUEOUS_FLUID);

  const sporulatingTape = makeTape([
    CodonType.PORIN_STREAM_A,
    CodonType.PORIN_STREAM_B,
    CodonType.GATE_OR,
    CodonType.GATE_AND,
    CodonType.SINK_BATTERY,
    CodonType.SINK_SEPTUM,
  ]);
  const symParent = new PoreCell(new GenomeSafe(sporulatingTape), 100, 45, 1, 'sym-parent', null, 'clade-sym', safeB);
  symParent.tick(true, true, false);
  symParent.getBattery().chargeEnergy(100);
  rockPore.setResident(symParent);
  world.syncActivePores();

  world.stepReproduction();
  const spore = upFluidPore.getSpore();
  assert.ok(spore, 'Daughter was released as a pelagic spore');
  assert.equal(spore.organelleSafe?.getTape(), safeB.getTape(),
    'Pelagic spore must preserve parent endosymbiotic organelleSafe');
  console.log('  -> PASS: Endosymbiosis preserves partner donor genomes and pelagic spores inherit organelleSafe.');
}

console.log('[PROOF 5B] Strict First-Law Thermodynamic Conservation Across Scavenging, Preset Reload & Pore.setResident...');
{
  // 1. Scavenging a carcass co-located with a pelagic spore preserves the spore and conserves energy/matter:
  const world1 = new SimulationWorld(8, 8);
  const ledger1 = world1.getLedger();
  const autotrophCoord = new HexCoord3D(1, 1, 0);
  const carcassCoord = new HexCoord3D(1, 2, 0);
  const autotrophPore = world1.getPore(autotrophCoord);
  const carcassPore = world1.getPore(carcassCoord);

  for (const p of [autotrophPore, carcassPore]) {
    const r = p.getResident();
    if (r) {
      ledger1.recordHeatDissipation(r.getBattery().getEnergy());
      ledger1.recordMatterSedimentation(r.getBattery().getMatter());
      p.clearResident();
    }
  }

  const autotroph = new PoreCell(
    new GenomeSafe(makeTape([CodonType.PORIN_STREAM_A, CodonType.PORIN_STREAM_B, CodonType.GATE_AND, CodonType.SINK_BATTERY])),
    40, 20
  );
  ledger1.recordEnergyInjection(40);
  ledger1.recordMatterInjection(20);
  autotrophPore.setResident(autotroph);

  ledger1.recordEnergyInjection(20 + 35);
  ledger1.recordMatterInjection(20 + 18);
  carcassPore.setCarcass(20, 20);
  carcassPore.setSpore({
    safe: new GenomeSafe(makeTape([CodonType.PORIN_STREAM_A, CodonType.SINK_BATTERY])),
    energy: 35,
    matter: 18,
    generation: 1,
    ticksRemaining: 20,
  });

  world1.syncActivePores();
  world1.stepLysisAndScavenging();
  world1.markTelemetryDirty();
  const afterAudit1 = world1.exportTelemetry().ledger;
  assert.equal(afterAudit1.isEnergyConserved, true, 'Energy must be strictly conserved after autotroph scavenging');
  assert.equal(afterAudit1.isMatterConserved, true, 'Matter must be strictly conserved after autotroph scavenging');
  assert.equal(afterAudit1.energyBalanceDelta, 0);
  assert.equal(afterAudit1.matterBalanceDelta, 0);

  // 2. loadEnvironmentPreset(preset, true) with preserveCells=true conserves First-Law energy and matter:
  const world2 = new SimulationWorld(8, 8);
  const ledger2 = world2.getLedger();
  const cPore = world2.getPore(new HexCoord3D(2, 1, 0));
  if (!cPore.getResident()) {
    ledger2.recordEnergyInjection(40);
    ledger2.recordMatterInjection(25);
    cPore.setCarcass(40, 25);
  }
  const preset = EnvironmentPresetRegistry.getInstance().getAll()[0];
  world2.loadEnvironmentPreset(preset, true);
  world2.markTelemetryDirty();
  const afterAudit2 = world2.exportTelemetry().ledger;
  assert.equal(afterAudit2.isEnergyConserved, true, 'loadEnvironmentPreset(preset, true) must conserve energy');
  assert.equal(afterAudit2.isMatterConserved, true, 'loadEnvironmentPreset(preset, true) must conserve matter');

  // 3. Pore.setResident() refuses to overwrite an existing carcass:
  const testPore = new Pore(new HexCoord3D(0, 0, 0));
  testPore.setCarcass(25, 15);
  const placed = testPore.setResident(new PoreCell(new GenomeSafe(makeTape([])), 10, 10));
  assert.equal(placed, false, 'Pore.setResident must return false when pore contains a carcass');
  assert.notEqual(testPore.getCarcass(), null, 'Pore.setResident must not overwrite existing carcass');
  console.log('  -> PASS: Strict First-Law conservation (ΔE = 0.000, ΔM = 0.000) verified across all paths.');
}

console.log('\n================================================================================');
console.log(' ALL 12 ROUND 3 DEMBSKI ADVERSARIAL CHALLENGES REMEDIATED & VERIFIED (100% PASS)');
console.log('================================================================================');
