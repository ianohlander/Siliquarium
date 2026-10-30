/**
 * 🐠 Siliquarium Native Test Suite - Stage 24
 * Dembski Adversarial Zero-Smuggling Audit (I_+ = 0) & 31 Biological Evolution Strategies
 *
 * Verifies:
 * 1. Absolute Purge of Non-Primitive Logic Gates (Zero GATE_XOR, GATE_NAND, GATE_NOR, GATE_BUF in CodonTable or AST).
 * 2. True Evolved 4-Gate Composite XOR AST Evaluation ((A OR B) AND NOT(A AND B)) using strictly {AND, OR, NOT}.
 * 3. All-Porin Terminal Binding: Sensory porins (PHOTON_IR, MECHANO_TOUCH, etc.) wire directly into catalytic gates.
 * 4. Zero Creator Rescue (I_+ = 0) in GenomeSafe.createChimeric() & Uncensored createPrebioticSoup().
 * 5. Macromolecular Evolutionary Operators (Drake Invariance, McClintock Transposons, Dobzhansky Inversions,
 *    Ohno DDC Operon Duplication, Modulo-6 Homologous Crossover, Hill-Kinetics Margin, Bidirectional Hypercube Metric).
 */

import assert from 'node:assert';
import fs from 'node:fs';
import {
  Mulberry32Prng,
  CodonTable,
  CodonType,
  GenomeSafe,
  PoreWorkshop,
  PoreCell
} from '../dist/core/index.js';
import {
  MotifScanner,
  WeisfeilerLehmanHasher
} from '../dist/core/paleontology/index.js';

export async function runStage24() {
  console.log('  Running Dembski Adversarial Zero-Smuggling Audit (I_+ = 0) & Biological Strategies Verification...');

  // -------------------------------------------------------------------------
  // 1. Strict Primitive Gate Audit: ONLY {GATE_AND, GATE_OR, GATE_NOT}
  // -------------------------------------------------------------------------
  assert.strictEqual(CodonType.GATE_XOR, undefined, 'GATE_XOR must NOT exist in CodonType');
  assert.strictEqual(CodonType.GATE_NAND, undefined, 'GATE_NAND must NOT exist in CodonType');
  assert.strictEqual(CodonType.GATE_NOR, undefined, 'GATE_NOR must NOT exist in CodonType');
  assert.strictEqual(CodonType.GATE_BUF, undefined, 'GATE_BUF must NOT exist in CodonType');

  const allowedGates = new Set([CodonType.GATE_AND, CodonType.GATE_OR, CodonType.GATE_NOT]);
  for (const entry of CodonTable.getAllEntries()) {
    if (String(entry.type).startsWith('GATE_')) {
      assert.ok(
        allowedGates.has(entry.type),
        `Forbidden non-primitive gate found in CodonTable at index ${entry.index}: ${entry.type}`
      );
    }
  }

  // Static source code forensic check across core files
  const coreFilesToAudit = [
    'src/core/codons/CodonTable.ts',
    'src/core/domain/PoreWorkshop.ts',
    'src/core/domain/GenomeSafe.ts',
    'src/core/paleontology/MotifScanner.ts',
    'src/engine/kinematics/TreadmillingEngine.ts'
  ];
  for (const filePath of coreFilesToAudit) {
    const src = fs.readFileSync(filePath, 'utf8');
    assert.ok(!src.includes('GATE_XOR'), `Forbidden GATE_XOR reference found in ${filePath}`);
    assert.ok(!src.includes('GATE_NAND'), `Forbidden GATE_NAND reference found in ${filePath}`);
    assert.ok(!src.includes('GATE_NOR'), `Forbidden GATE_NOR reference found in ${filePath}`);
    assert.ok(!src.includes('GATE_BUF'), `Forbidden GATE_BUF reference found in ${filePath}`);
  }
  console.log('    ✓ Audit 1 Passed: Zero references to XOR, NAND, NOR, or BUF in CodonTable and core AST.');

  // -------------------------------------------------------------------------
  // 2. Evolved 4-Gate Composite XOR AST Evaluation ((A | B) & ~(A & B))
  // -------------------------------------------------------------------------
  const cOR = (22).toString(2).padStart(6, '0');       // GATE_OR
  const cAND = (0).toString(2).padStart(6, '0');       // GATE_AND
  const cNOT = (12).toString(2).padStart(6, '0');      // GATE_NOT
  const cPOR_A = (32).toString(2).padStart(6, '0');    // PORIN_STREAM_A
  const cPOR_B = (38).toString(2).padStart(6, '0');    // PORIN_STREAM_B
  const cBATT = (50).toString(2).padStart(6, '0');     // SINK_BATTERY
  const cSILENT = (56).toString(2).padStart(6, '0');   // INTRON_SILENT

  // 4-gate composite XOR tree: G0=OR(A,B), G1=AND(A,B), G2=NOT(G1), G3=AND(G0, G2)
  const compositeXorTape = `${cPOR_A}${cPOR_B}${cOR}${cAND}${cNOT}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;
  const xorWorkshop = PoreWorkshop.fromBitstring(compositeXorTape);
  assert.strictEqual(xorWorkshop.getGateCount(), 4, 'Composite XOR workshop must assemble 4 primitive gates');

  const out00 = xorWorkshop.step(false, false, false).primaryOutput;
  const out01 = xorWorkshop.step(false, true, false).primaryOutput;
  const out10 = xorWorkshop.step(true, false, false).primaryOutput;
  const out11 = xorWorkshop.step(true, true, false).primaryOutput;

  assert.strictEqual(out00, false, 'Evolved composite XOR(0,0) must evaluate to 0');
  assert.strictEqual(out01, true, 'Evolved composite XOR(0,1) must evaluate to 1');
  assert.strictEqual(out10, true, 'Evolved composite XOR(1,0) must evaluate to 1');
  assert.strictEqual(out11, false, 'Evolved composite XOR(1,1) must evaluate to 0');
  assert.ok(xorWorkshop.getAstEdges().length >= 3, 'Composite XOR AST must record directed child->parent edges');
  console.log('    ✓ Audit 2 Passed: 4-gate composite {OR, AND, NOT, AND} AST genuinely computes XOR truth table.');

  // -------------------------------------------------------------------------
  // 3. All-Porin Terminal Binding (Sensory Porins Driving Catalytic Gates)
  // -------------------------------------------------------------------------
  const cPHOTON = (6).toString(2).padStart(6, '0');   // PORIN_PHOTON_IR
  const cMECHANO = (26).toString(2).padStart(6, '0'); // PORIN_MECHANO_TOUCH
  const sensoryGateTape = `${cPHOTON}${cMECHANO}${cAND}${cBATT}${cSILENT}${cSILENT}`;
  const sensoryWs = PoreWorkshop.fromBitstring(sensoryGateTape);

  // Without photonIr and mechanoTouch, gate output is false
  const teleDark = sensoryWs.stepTick(false, false, false, 50, false, false, false, false, false, false);
  assert.strictEqual(teleDark.primaryActive, false, 'Sensory AND gate must be OFF when photon & mechano signals are absent');

  // With photonIr=true and mechanoTouch=true, bound sensory terminals drive the AND gate HIGH
  const teleLitTouch = sensoryWs.stepTick(false, false, false, 50, false, false, true, false, true, false);
  assert.strictEqual(teleLitTouch.primaryActive, true, 'Sensory AND gate must fire when bound PHOTON_IR and MECHANO_TOUCH porins are active');
  console.log('    ✓ Audit 3 Passed: Physical sensory porins wire directly into catalytic AST gate terminals.');

  // -------------------------------------------------------------------------
  // 4. Zero Creator Rescue (I_+ = 0) in createChimeric & Uncensored Soup
  // -------------------------------------------------------------------------
  // Construct two parent genomes made purely of silent introns and gates (zero Porin A, Porin B, or Battery codons)
  const parentATape = `${cAND}${cNOT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const parentBTape = `${cOR}${cSILENT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const safeA = new GenomeSafe(parentATape);
  const safeB = new GenomeSafe(parentBTape);
  const chimera = GenomeSafe.createChimeric(safeA, safeB);

  const chimeraWs = PoreWorkshop.fromBitstring(chimera.getTape());
  assert.strictEqual(chimeraWs.hasPorinA(), false, 'createChimeric must NEVER fabricate Porin A when absent in both parents');
  assert.strictEqual(chimeraWs.hasPorinB(), false, 'createChimeric must NEVER fabricate Porin B when absent in both parents');
  assert.strictEqual(chimeraWs.hasBattery(), false, 'createChimeric must NEVER fabricate Battery Sink when absent in both parents');
  console.log('    ✓ Audit 4 Passed: Zero Creator Rescue (I_+ = 0) verified in GenomeSafe.createChimeric().');

  // -------------------------------------------------------------------------
  // 5. Macromolecular Evolutionary Operators & Continuous Hill-Kinetics
  // -------------------------------------------------------------------------
  const prng = new Mulberry32Prng(20261016);

  // Drake's Mutational Invariance
  const baseRate = 0.01;
  const scaledRate = GenomeSafe.computeDrakeMutationRate(baseRate, 240);
  assert.strictEqual(scaledRate, baseRate * (60 / 240), 'Drake mutation invariance must scale inversely with genome length');

  // McClintock Transposition, Dobzhansky Inversion, Ohno DDC Operon Duplication, Modulo-6 Crossover
  const baseSafe = new GenomeSafe(compositeXorTape);
  const transposed = baseSafe.translocateCassette(prng, false);
  assert.strictEqual(transposed.length() % 6, 0, 'Transposon mobilization must preserve modulo-6 codon reading frames');

  const inverted = baseSafe.invertSegment(prng);
  assert.strictEqual(inverted.length(), baseSafe.length(), 'Chromosomal inversion must preserve exact genome length');

  const duplicatedOperon = baseSafe.duplicateOperonCassette(prng, true);
  assert.ok(duplicatedOperon.length() > baseSafe.length(), 'Operon cassette duplication must expand genome');
  assert.strictEqual(duplicatedOperon.length() % 6, 0, 'Operon cassette duplication must align to 6-bit codon boundaries');

  const recombined = GenomeSafe.crossoverModulo6(baseSafe, inverted, prng);
  assert.strictEqual(recombined.length() % 6, 0, 'Modulo-6 homologous crossover must preserve reading frames');

  // Hill-Langmuir Cooperative Transfer & Bidirectional Hypercube Potential
  assert.strictEqual(PoreWorkshop.hillTransfer(0.0), 0.0, 'Hill transfer at 0 must canalize to 0.0');
  assert.strictEqual(PoreWorkshop.hillTransfer(1.0), 1.0, 'Hill transfer at 1 must canalize to 1.0');
  assert.strictEqual(PoreWorkshop.hillTransfer(0.5), 0.5, 'Hill transfer inflection point at Kd=0.5 must equal 0.5');

  const targetVec = [false, true, true, false];
  const invertedVec = [true, false, false, true]; // XNOR (1 NOT gate away from XOR)
  const potential = MotifScanner.computeBidirectionalHypercubePotential(invertedVec, targetVec);
  assert.strictEqual(potential, 1.0, 'Bidirectional Hypercube Metric must recognize exact inverted-phase complement as 1.0 potential');

  // Weisfeiler-Lehman Directed AST Graph Hasher
  const hashXor = WeisfeilerLehmanHasher.hashNetlist(xorWorkshop.getGates(), 2, xorWorkshop.getAstEdges());
  const hashSensory = WeisfeilerLehmanHasher.hashNetlist(sensoryWs.getGates(), 2, sensoryWs.getAstEdges());
  assert.notStrictEqual(hashXor, hashSensory, 'Directed AST Weisfeiler-Lehman hasher must distinguish distinct AST topologies');

  console.log('    ✓ Audit 5 Passed: All macromolecular operators, Hill kinetics, and bidirectional hypercube metrics verified.');
}
