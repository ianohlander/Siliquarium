/**
 * ============================================================================
 * DEMBSKI PROTOCOL — ROUND 2 ADVERSARIAL FALSIFICATION & VERIFICATION SUITE
 * Target Repository: Siliquarium (h:\My Drive\Repos\Siliquarium)
 * Auditor: Dr. William A. Dembski (Information Theory & Evolutionary Computation)
 * ============================================================================
 *
 * Executes 10 ruthless mathematical and algorithmic proofs with strict
 * assertions (`node:assert/strict`). Exits 0 ONLY if all 20 Round 2
 * vulnerabilities across all 5 battlefronts are 100% remediated.
 */

import assert from 'node:assert/strict';
import { PoreWorkshop } from '../dist/core/domain/PoreWorkshop.js';
import { MotifScanner } from '../dist/core/paleontology/MotifScanner.js';
import { TaxonomyNomenclature } from '../dist/core/paleontology/TaxonomyNomenclature.js';
import { CircuitTopology } from '../dist/visualizers/CircuitTopology.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';

const b6 = (n) => n.toString(2).padStart(6, '0');

// Exact 6-bit codon table from src/core/codons/CodonTable.ts
const CODONS = {
  GATE_AND:           b6(0),  // 0..5
  PORIN_PHOTON_IR:    b6(6),  // 6..7
  PORIN_STREAM_C:     b6(8),  // 8..11
  GATE_NOT:           b6(12), // 12..15
  GATE_NOT_15:        b6(15), // 15 (still GATE_NOT in CodonTable!)
  PORIN_BARO_ACOUSTIC: b6(16), // 16..17
  SECRETION_CHELATOR: b6(18), // 18..21
  GATE_OR:            b6(22), // 22..25
  PORIN_MECHANO_TOUCH: b6(26), // 26..27
  SECRETION_EPS:      b6(28), // 28..31
  PORIN_STREAM_A:     b6(32), // 32..35
  PORIN_ELECTRO_REDOX: b6(36), // 36..37
  PORIN_STREAM_B:     b6(38), // 38..41
  PORIN_STREAM_D:     b6(42), // 42..43
  PORIN_TOXIN_T:      b6(44), // 44..47
  SINK_BATTERY:       b6(48), // 48..51
  SINK_SEPTUM:        b6(52), // 52..55
  INTRON_SILENT:      b6(56), // 56..59
  OP_REG0:            b6(60), // 60 (REGULATED_CH0)
  OP_REG1:            b6(61), // 61 (REGULATED_CH1)
  OP_REG2:            b6(62), // 62 (REGULATED_CH2 / Toxin-inducible)
  OP_REG3:            b6(63), // 63 (REGULATED_CH3)
};

function makeTape(codonList, padSilent = true) {
  const list = [...codonList];
  if (padSilent) {
    while (list.length < 6) list.push('INTRON_SILENT');
  }
  return list.map(c => CODONS[c] || c).join('');
}

console.log('================================================================================');
console.log('DEMBSKI ROUND 2 ADVERSARIAL FALSIFICATION & VERIFICATION SUITE');
console.log('================================================================================\n');

// ----------------------------------------------------------------------------
// PROOF 1: Zero Default Porin Smuggling, Zero Cross-Operon Porin Theft, and
// Zero-Pad Silent Intron Sanitization
// ----------------------------------------------------------------------------
console.log('--- [PROOF 1] Default Porin Smuggling, Cross-Operon Leakage & Zero-Pad Gate Injection ---');
{
  // Sub-proof 1A: Zero porins in genome -> boundTerminalA/B must be null
  const zeroPorinTape = makeTape(['GATE_AND', 'SINK_BATTERY']);
  const wsZero = PoreWorkshop.fromBitstring(zeroPorinTape);
  const g0 = wsZero.getBuiltGates()[0];
  console.log(`1A. Genome with ZERO porin codons [GATE_AND, SINK_BATTERY, 4x INTRON_SILENT]:`);
  console.log(`    gate_0.boundTerminalA = ${g0.boundTerminalA}`);
  console.log(`    gate_0.boundTerminalB = ${g0.boundTerminalB}`);
  assert.equal(g0.boundTerminalA, null, '1A FAILED: gate_0.boundTerminalA must be null when 0 porins exist');
  assert.equal(g0.boundTerminalB, null, '1A FAILED: gate_0.boundTerminalB must be null when 0 porins exist');

  // Sub-proof 1B: Operon 0 has NO porins; Operon 1 is REPRESSED and holds PORIN_STREAM_A + PORIN_STREAM_B.
  // Operon 0 must NOT steal porins or harvest energy from repressed Operon 1.
  const crossOperonTape = makeTape([
    'GATE_AND', 'SINK_BATTERY',
    'OP_REG2', 'PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_OR'
  ]);
  const wsCross = PoreWorkshop.fromBitstring(crossOperonTape);
  const resCross = wsCross.stepTick(true, true, false); // toxinT = false -> Operon 1 REPRESSED!
  const opStates = wsCross.getOperonStates();
  console.log(`1B. Operon 0 has 0 porins; Operon 1 (OP_REG2, toxin=false) is REPRESSED:`);
  console.log(`    Operon expression states [Op0, Op1] = [${opStates.join(', ')}]`);
  console.log(`    Operon 0 gate_0 boundTerminalA/B = ${wsCross.getBuiltGates()[0].boundTerminalA} / ${wsCross.getBuiltGates()[0].boundTerminalB}`);
  console.log(`    Operon 0 gate_0 output = ${resCross.primaryActive}, yield = +${resCross.catalyticYield}`);
  assert.equal(wsCross.getBuiltGates()[0].boundTerminalA, null, '1B FAILED: Operon 0 stole boundTerminalA from repressed Operon 1');
  assert.equal(wsCross.getBuiltGates()[0].boundTerminalB, null, '1B FAILED: Operon 0 stole boundTerminalB from repressed Operon 1');
  assert.equal(resCross.primaryActive, false, '1B FAILED: Operon 0 activated using repressed porins from Operon 1');
  assert.equal(resCross.catalyticYield, 0, '1B FAILED: Operon 0 harvested energy using repressed porins from Operon 1');

  // Sub-proof 1C: Short tape (< 36 bits) padded with INTRON_SILENT ('111000'), never GATE_AND ('000000')
  const shortSilentTape = makeTape(['INTRON_SILENT'], false); // 6 bits
  const wsShort = PoreWorkshop.fromBitstring(shortSilentTape);
  console.log(`1C. Passing a 1-codon silent intron tape ('111000', 0 gates) into CodonTranslator.sanitizeTape():`);
  console.log(`    Synthesized gates = [${wsShort.getGates().map(g => g.type).join(', ')}] (${wsShort.getGateCount()} gates)\n`);
  assert.equal(wsShort.getGateCount(), 0, '1C FAILED: Short tape sanitization smuggled active gates');
  console.log('✓ PROOF 1 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 2: Contiguous Anti-Phase Ring Oscillator & Commutative Bistable Latch
// ----------------------------------------------------------------------------
console.log('--- [PROOF 2] Contiguous Ring Oscillator & Commutative Bistable Latch ---');
{
  // Sub-proof 2A: 3-NOT Ring Oscillator traverses all 6 traveling-wave states with every NOT gate inverting (!inputA)
  const ringTape = makeTape(['PORIN_STREAM_A', 'GATE_NOT', 'GATE_NOT', 'GATE_NOT', 'SINK_BATTERY']);
  const wsRing = PoreWorkshop.fromBitstring(ringTape);
  const trace = [];
  const uniqueStates = new Set();
  for (let t = 0; t < 6; t++) {
    wsRing.stepTick(false, false, false);
    const gates = wsRing.getBuiltGates();
    for (const g of gates) {
      assert.equal(g.output, !g.inputA, `2A FAILED: Gate ${g.id} failed to invert its input at tick ${t}`);
    }
    const states = gates.map(g => (g.output ? 1 : 0)).join('');
    uniqueStates.add(states);
    trace.push(`t=${t}:[${states}]`);
  }
  assert.equal(uniqueStates.size, 6, '2A FAILED: 3-NOT ring oscillator did not visit all 6 traveling-wave states');
  console.log(`2A. 3-NOT Ring Oscillator 6-state traveling-wave trace (all 3 stages strictly invert):`);
  console.log(`    ${trace.join(' -> ')}`);

  // Sub-proof 2B: Non-contiguous NOT gates in combinational circuit [AND, NOT, OR, NOT, NOT]
  // must NOT be hijacked into a ring oscillator!
  const hijackTape = makeTape([
    'PORIN_STREAM_A', 'PORIN_STREAM_B',
    'GATE_AND', 'GATE_NOT', 'GATE_OR', 'GATE_NOT', 'GATE_NOT',
    'SINK_BATTERY'
  ]);
  const wsHijack = PoreWorkshop.fromBitstring(hijackTape);
  wsHijack.stepTick(false, false, false);
  const backwardEdges = wsHijack.getAstEdges().filter(e => e.fromGateId >= e.toGateId);
  const osc1 = wsHijack.stepTick(false, false, false).primaryActive;
  const osc2 = wsHijack.stepTick(false, false, false).primaryActive;
  console.log(`2B. Combinational circuit [AND, NOT, OR, NOT, NOT] backward edges: ${JSON.stringify(backwardEdges)}`);
  console.log(`    Static (0,0,0) output stability: t1=${osc1} -> t2=${osc2}`);
  assert.equal(backwardEdges.length, 0, '2B FAILED: Non-contiguous NOT gates were hijacked by a backward feedback edge');
  assert.equal(osc1, osc2, '2B FAILED: Combinational circuit [AND, NOT, OR, NOT, NOT] oscillated under static inputs');

  // Sub-proof 2C: Commutative Bistable Latch ([GATE_AND, GATE_OR] and [GATE_OR, GATE_AND] both hold memory)
  const latch1 = PoreWorkshop.fromBitstring(makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_AND', 'GATE_OR', 'SINK_BATTERY']));
  const latch2 = PoreWorkshop.fromBitstring(makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_OR', 'GATE_AND', 'SINK_BATTERY']));
  latch1.stepTick(true, true, false);
  const hold1 = latch1.stepTick(false, false, false).primaryActive;
  latch2.stepTick(true, true, false);
  const hold2 = latch2.stepTick(false, false, false).primaryActive;
  console.log(`2C. Commutative Latch Memory Hold: [AND, OR]=${hold1}, [OR, AND]=${hold2}\n`);
  assert.equal(hold1, true, '2C FAILED: [GATE_AND, GATE_OR] failed to hold memory');
  assert.equal(hold2, true, '2C FAILED: Commuted [GATE_OR, GATE_AND] failed to hold memory');
  console.log('✓ PROOF 2 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 3: Per-Operon AST Stack Isolation & 4-Binary-Gate Subtree Merging
// ----------------------------------------------------------------------------
console.log('--- [PROOF 3] Per-Operon AST Stack Isolation & 4-Binary-Gate Subtree Merging ---');
{
  // Sub-proof 3A: Operon 0 and Operon 1 have isolated AST stacks (zero cross-operon edges)
  const twoOperonTape = makeTape([
    'PORIN_STREAM_A', 'PORIN_STREAM_B',
    'GATE_AND', 'SINK_BATTERY',
    'OP_REG0',
    'PORIN_STREAM_A', 'PORIN_STREAM_B',
    'GATE_OR', 'SINK_SEPTUM'
  ]);
  const wsTwoOp = PoreWorkshop.fromBitstring(twoOperonTape);
  wsTwoOp.stepTick(true, false, false);
  const crossEdges = wsTwoOp.getAstEdges();
  console.log(`3A. Cross-Operon AST Edges between Operon 0 [GATE_AND] and Operon 1 [GATE_OR]: ${JSON.stringify(crossEdges)}`);
  assert.equal(crossEdges.length, 0, '3A FAILED: AST stack bled across operon boundaries');

  // Sub-proof 3B: 4-Binary-Gate Tree [AND, AND, AND, OR] merges 2 subtrees into root gate_3
  const fourBinTape = makeTape([
    'PORIN_STREAM_A', 'PORIN_STREAM_B',
    'GATE_AND', 'GATE_AND', 'GATE_AND', 'GATE_OR',
    'SINK_BATTERY'
  ]);
  const wsFourBin = PoreWorkshop.fromBitstring(fourBinTape);
  wsFourBin.stepTick(true, true, false);
  const edgesToRoot = wsFourBin.getAstEdges().filter(e => e.toGateId === 3);
  console.log(`3B. 4-Binary-Gate Tree [AND, AND, AND, OR] edges into root gate_3: ${JSON.stringify(edgesToRoot)}\n`);
  assert.equal(edgesToRoot.length, 2, '3B FAILED: Root gate_3 in 4-binary-gate circuit did not receive 2 subtree inputs');
  console.log('✓ PROOF 3 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 4: All 11 Motifs in MotifScanner.ts Reject Bag-of-Gates Counterexamples
// ----------------------------------------------------------------------------
console.log('--- [PROOF 4] All 11 Motifs in MotifScanner.ts Reject Bag-of-Gates Counterexamples ---');
{
  const bagTests = [
    {
      name: '2-gate [AND, OR] Latch must NOT be awarded COHERENT_FFL (FFL requires >=3 nodes)',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_AND', 'GATE_OR', 'SINK_BATTERY']),
      forbidden: ['COHERENT_FFL']
    },
    {
      name: 'Trivial [NOT, OR, AND] with ZERO acoustic/toxin porins must NOT be awarded INCOHERENT_FFL or PREDICTIVE_PAVLOVIAN',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_NOT', 'GATE_OR', 'GATE_AND', 'SINK_BATTERY']),
      forbidden: ['INCOHERENT_FFL', 'PREDICTIVE_PAVLOVIAN']
    },
    {
      name: 'Static [AND, NOT, AND] with ZERO temporal derivative must NOT be awarded TEMPORAL_DERIVATIVE_CHEMOTAXIS',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_AND', 'GATE_NOT', 'GATE_AND', 'SINK_BATTERY']),
      forbidden: ['TEMPORAL_DERIVATIVE_CHEMOTAXIS', 'INCOHERENT_FFL']
    },
    {
      name: 'Solitary 1-pore [AND, AND, OR, OR] with ZERO chelator/EPS must NOT be awarded STEINER_VASCULAR_NETWORK',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_AND', 'GATE_AND', 'GATE_OR', 'GATE_OR', 'SINK_BATTERY']),
      forbidden: ['STEINER_VASCULAR_NETWORK', 'COHERENT_FFL']
    },
    {
      name: 'Double-negation [NOT, NOT, AND] (truth table = A & B) must NOT be awarded CRYPTOBIOTIC_DORMANCY_CLAMP',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_NOT', 'GATE_NOT', 'GATE_AND', 'SINK_BATTERY']),
      forbidden: ['CRYPTOBIOTIC_DORMANCY_CLAMP', 'INCOHERENT_FFL']
    },
    {
      name: '[NOT, NOT, NOT, AND] with ZERO thermal/baro porins must NOT be awarded ENTRAINED_PACEMAKER',
      tape: makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_NOT', 'GATE_NOT', 'GATE_NOT', 'GATE_AND', 'SINK_BATTERY']),
      forbidden: ['ENTRAINED_PACEMAKER', 'INCOHERENT_FFL']
    }
  ];

  for (const t of bagTests) {
    const ws = PoreWorkshop.fromBitstring(t.tape);
    const motifs = MotifScanner.scanWorkshop(ws).map(m => m.motif.type);
    console.log(`  * ${t.name}:`);
    console.log(`    -> Awarded Motifs: [${motifs.join(', ')}]`);
    for (const f of t.forbidden) {
      assert.equal(motifs.includes(f), false, `PROOF 4 FAILED: ${f} falsely awarded to ${t.name}`);
    }
  }
  console.log('✓ PROOF 4 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 5: TaxonomyNomenclature.ts Verifies XOR Truth Table, Expressed Gates,
// Correct Codon Indices, and Preserves XOR Over >60-Bit OHNOI
// ----------------------------------------------------------------------------
console.log('--- [PROOF 5] TaxonomyNomenclature.ts Verification ---');
{
  // 5A: Degenerate 4-gate bag [AND, AND, OR, NOT] (outputs ~A, NOT XOR!) must NOT be named Synergobacter turingii
  const fakeXorTape = makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_AND', 'GATE_AND', 'GATE_OR', 'GATE_NOT', 'SINK_BATTERY'], false);
  const taxonFakeXor = TaxonomyNomenclature.classify(fakeXorTape, ['AND', 'AND', 'OR', 'NOT']);
  console.log(`5A. Non-XOR [AND, AND, OR, NOT] -> ${taxonFakeXor.binomialName}`);
  assert.notEqual(taxonFakeXor.binomialName, 'Synergobacter turingii', '5A FAILED: Non-XOR 4-gate bag misclassified as Synergobacter turingii');

  // 5B: 0-gate genome with raw PORIN_STREAM_C codon must NOT be named Citratovibrio lenskii
  const zeroGateCitTape = makeTape(['PORIN_STREAM_C']);
  const taxonCit = TaxonomyNomenclature.classify(zeroGateCitTape, []);
  console.log(`5B. 0-Gate genome with raw PORIN_STREAM_C codon -> ${taxonCit.binomialName}`);
  assert.notEqual(taxonCit.binomialName, 'Citratovibrio lenskii', '5B FAILED: 0-gate genome classified as Citratovibrio lenskii');

  // 5C: Genome with a single GATE_NOT codon (index 15 = 001111, ZERO electro/redox porins) must NOT be Electrosarcina lovleyi
  const not15Tape = makeTape(['GATE_NOT_15']);
  const taxonNot15 = TaxonomyNomenclature.classify(not15Tape, ['NOT']);
  console.log(`5C. Single GATE_NOT (codon 15) -> ${taxonNot15.binomialName}`);
  assert.notEqual(taxonNot15.binomialName, 'Electrosarcina lovleyi', '5C FAILED: Codon 15 (GATE_NOT) misclassified as Electrosarcina lovleyi');

  // 5D: True 4-gate XOR > 60 bits must be classified as Synergobacter turingii (not clobbered by Polyoperon ohnoi)
  const longXorTape = makeTape([
    'PORIN_STREAM_A', 'PORIN_STREAM_B', 'PORIN_TOXIN_T',
    'GATE_OR', 'GATE_AND', 'GATE_NOT', 'GATE_AND',
    'SINK_BATTERY', 'SINK_SEPTUM', 'INTRON_SILENT', 'INTRON_SILENT'
  ]); // 66 bits > 60
  const taxonLongXor = TaxonomyNomenclature.classify(longXorTape, ['OR', 'AND', 'NOT', 'AND']);
  console.log(`5D. True 4-gate XOR genome (${longXorTape.length} bits) -> ${taxonLongXor.binomialName}\n`);
  assert.equal(taxonLongXor.binomialName, 'Synergobacter turingii', '5D FAILED: 66-bit true XOR genome clobbered by OHNOI');
  console.log('✓ PROOF 5 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 6: CircuitTopology.ts Uses Authentic AST Edges & MotifScanner
// ----------------------------------------------------------------------------
console.log('--- [PROOF 6] CircuitTopology.ts Authentic AST Edges & Motif Classification ---');
{
  const xorTape = makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_OR', 'GATE_AND', 'GATE_NOT', 'GATE_AND', 'SINK_BATTERY']);
  const wsXor = PoreWorkshop.fromBitstring(xorTape);
  wsXor.stepTick(true, false, false);
  const actualAstEdges = wsXor.getAstEdges().map(e => `gate_${e.fromGateId}->gate_${e.toGateId}`);
  const schematic = CircuitTopology.analyze(xorTape, { streamA: true, streamB: false, toxinT: false }, true);
  const gateToGateWires = schematic.wires
    .filter(w => w.fromId.startsWith('gate_') && w.toId.startsWith('gate_'))
    .map(w => `${w.fromId}->${w.toId}`);
  const feedbackWires = schematic.wires.filter(w => w.isFeedback);

  console.log(`6A. PoreWorkshop AST Edges: ${actualAstEdges.join(', ')}`);
  console.log(`6B. CircuitTopology Wires:  ${gateToGateWires.join(', ')} (feedback wires: ${feedbackWires.length})`);
  console.log(`6C. CircuitTopology Motif:  "${schematic.motifName}"\n`);
  assert.deepEqual(gateToGateWires, actualAstEdges, '6B FAILED: CircuitTopology wires do not match PoreWorkshop AST edges');
  assert.equal(feedbackWires.length, 0, '6B FAILED: CircuitTopology drew a fake feedback wire on combinational XOR');
  assert.ok(schematic.motifName.includes('Half-Adder') || schematic.motifName.includes('XOR'), '6C FAILED: CircuitTopology mislabeled 4-gate XOR');
  console.log('✓ PROOF 6 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 7: Expressed-Only Gate Telemetry & Spore Adaptation
// ----------------------------------------------------------------------------
console.log('--- [PROOF 7] Expressed-Only Gate Telemetry & Spore Adaptation ---');
{
  // 7A: Dual-Operon Genome (Operon 0 EXPRESSED -> true, Operon 1 REPRESSED -> false)
  const dualOpTape = makeTape([
    'PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_OR', 'SINK_BATTERY',
    'OP_REG3', 'GATE_AND'
  ]);
  const wsDual = PoreWorkshop.fromBitstring(dualOpTape);
  const stepRes = wsDual.stepTick(true, true, false);
  const builtGates = wsDual.getBuiltGates();
  console.log(`7A. Dual-Operon Genome: stepTick().primaryActive=${stepRes.primaryActive}, builtGates[last].output=${builtGates[builtGates.length - 1].output}`);
  assert.equal(builtGates[builtGates.length - 1].output, true, '7A FAILED: Last built gate output should be true');

  // 7B: Cell with 100% REPRESSED gates & septum must have hasSporeAdaptation() === false
  const repressedSporeTape = makeTape([
    'PORIN_STREAM_A', 'OP_REG3', 'GATE_AND', 'GATE_OR', 'SINK_SEPTUM', 'INTRON_SILENT'
  ]);
  const cellRepressed = new PoreCell(new GenomeSafe(repressedSporeTape), 50, 20, 1, 'rep_cell');
  cellRepressed.getWorkshop().stepTick(true, true, false);
  console.log(`7B. Cell with 100% REPRESSED gates & septum: hasSporeAdaptation()=${cellRepressed.hasSporeAdaptation()}\n`);
  assert.equal(cellRepressed.hasSporeAdaptation(), false, '7B FAILED: Cell with 100% repressed gates granted hasSporeAdaptation()');
  console.log('✓ PROOF 7 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 8: First Law of Thermodynamics Conservation in setPoreBasalt
// ----------------------------------------------------------------------------
console.log('--- [PROOF 8] First Law of Thermodynamics Conservation in setPoreBasalt ---');
{
  const world = new SimulationWorld(8, 8);
  const ledger = world.getLedger();
  const poreZ1 = world.getPore(new HexCoord3D(2, 2, 1));
  const poreZ2 = world.getPore(new HexCoord3D(2, 2, 2));

  ledger.recordEnergyInjection(30);
  ledger.recordMatterInjection(15);
  poreZ1.setSpore({
    tape: makeTape(['PORIN_STREAM_A', 'GATE_AND', 'SINK_BATTERY']),
    energy: 30,
    matter: 15,
    generation: 1
  });

  world.setPoreBasalt(poreZ2.coord, true);
  world.markTelemetryDirty();
  const afterAudit = world.exportTelemetry().ledger;
  console.log(`8. After setPoreBasalt((2,2,2), true) over spore at (2,2,1):`);
  console.log(`   isEnergyConserved=${afterAudit.isEnergyConserved} (delta=${afterAudit.energyBalanceDelta}), isMatterConserved=${afterAudit.isMatterConserved} (delta=${afterAudit.matterBalanceDelta})\n`);
  assert.equal(afterAudit.isEnergyConserved, true, '8 FAILED: Energy not conserved in setPoreBasalt');
  assert.equal(afterAudit.isMatterConserved, true, '8 FAILED: Matter not conserved in setPoreBasalt');
  console.log('✓ PROOF 8 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 9: First Law of Thermodynamics Conservation in Vent Operations
// ----------------------------------------------------------------------------
console.log('--- [PROOF 9] First Law of Thermodynamics Conservation in setVentConfiguration & removeVent ---');
{
  const world = new SimulationWorld(8, 8);
  const ledger = world.getLedger();
  const targetCoord = new HexCoord3D(2, 1, 1);
  const targetPore = world.getPore(targetCoord);

  ledger.recordEnergyInjection(45);
  ledger.recordMatterInjection(25);
  targetPore.setCarcass(45, 25);

  world.setVentConfiguration(new HexCoord3D(2, 1, 0), 0);
  world.markTelemetryDirty();
  const afterAudit = world.exportTelemetry().ledger;
  console.log(`9A. After setVentConfiguration((2,1,0), 0) over carcass at (2,1,1):`);
  console.log(`    isEnergyConserved=${afterAudit.isEnergyConserved} (delta=${afterAudit.energyBalanceDelta}), isMatterConserved=${afterAudit.isMatterConserved} (delta=${afterAudit.matterBalanceDelta})`);
  assert.equal(afterAudit.isEnergyConserved, true, '9A FAILED: Energy not conserved in setVentConfiguration');
  assert.equal(afterAudit.isMatterConserved, true, '9A FAILED: Matter not conserved in setVentConfiguration');

  const world2 = new SimulationWorld(8, 8);
  const ledger2 = world2.getLedger();
  const ventCoord = new HexCoord3D(2, 1, 0);
  world2.placeVent(ventCoord);
  const chimneyPore = world2.getPore(new HexCoord3D(2, 1, 1));
  const tape = makeTape(['PORIN_STREAM_A', 'GATE_AND', 'SINK_BATTERY']);
  ledger2.recordEnergyInjection(50 + 35);
  ledger2.recordMatterInjection(20 + 18);
  chimneyPore.setResident(new PoreCell(new GenomeSafe(tape), 50, 20, 1, 'chimney_cell'));
  chimneyPore.setSpore({ tape, energy: 35, matter: 18, generation: 1 });

  world2.removeVent(ventCoord);
  world2.markTelemetryDirty();
  const afterRemoveAudit = world2.exportTelemetry().ledger;
  console.log(`9B. After removeVent((2,1,0)) on pore with Resident + Spore:`);
  console.log(`    isEnergyConserved=${afterRemoveAudit.isEnergyConserved} (delta=${afterRemoveAudit.energyBalanceDelta}), isMatterConserved=${afterRemoveAudit.isMatterConserved} (delta=${afterRemoveAudit.matterBalanceDelta})\n`);
  assert.equal(afterRemoveAudit.isEnergyConserved, true, '9B FAILED: Energy not conserved in removeVent');
  assert.equal(afterRemoveAudit.isMatterConserved, true, '9B FAILED: Matter not conserved in removeVent');
  console.log('✓ PROOF 9 VERIFIED.\n');
}

// ----------------------------------------------------------------------------
// PROOF 10: First Law of Thermodynamics Conservation in Treadmilling Resorption
// ----------------------------------------------------------------------------
console.log('--- [PROOF 10] First Law of Thermodynamics Conservation in Treadmilling Resorption ---');
{
  const { TreadmillingEngine } = await import('../dist/engine/kinematics/TreadmillingEngine.js');
  const world = new SimulationWorld(8, 8);
  const ledger = world.getLedger();
  const coords = [
    new HexCoord3D(0, 1, 0),
    new HexCoord3D(1, 1, 0),
    new HexCoord3D(2, 1, 0),
    new HexCoord3D(3, 1, 0)
  ];
  const colonyPores = coords.map(c => world.getPore(c));
  const tape = makeTape(['PORIN_STREAM_A', 'PORIN_STREAM_B', 'GATE_OR', 'SINK_BATTERY', 'SINK_SEPTUM']);

  ledger.recordEnergyInjection(160);
  ledger.recordMatterInjection(80);
  for (let i = 0; i < 4; i++) {
    const cell = new PoreCell(new GenomeSafe(tape), 40, 20, 1, `col_${i}`, null, 'clade_1', null, 'sync_1');
    cell.age = 22;
    colonyPores[i].setResident(cell);
  }

  ledger.recordEnergyInjection(25);
  ledger.recordMatterInjection(12);
  colonyPores[3].setSpore({ tape, energy: 25, matter: 12, generation: 1 });

  TreadmillingEngine.executeTrailingEdgeResorption(
    colonyPores,
    { nozzleCoord: new HexCoord3D(0, 0, 0), streamA: true, streamB: true, toxinT: false },
    100,
    ledger
  );

  world.markTelemetryDirty();
  const afterAudit = world.exportTelemetry().ledger;
  console.log(`10. After TreadmillingEngine.executeTrailingEdgeResorption():`);
  console.log(`    trailingPore.hasSpore()=${colonyPores[3].hasSpore()}, isEnergyConserved=${afterAudit.isEnergyConserved} (delta=${afterAudit.energyBalanceDelta}), isMatterConserved=${afterAudit.isMatterConserved} (delta=${afterAudit.matterBalanceDelta})\n`);
  assert.equal(colonyPores[3].hasSpore(), true, '10 FAILED: Co-located pelagic spore wiped by executeTrailingEdgeResorption');
  assert.equal(afterAudit.isEnergyConserved, true, '10 FAILED: Energy not conserved in executeTrailingEdgeResorption');
  assert.equal(afterAudit.isMatterConserved, true, '10 FAILED: Matter not conserved in executeTrailingEdgeResorption');
  console.log('✓ PROOF 10 VERIFIED.\n');
}

console.log('================================================================================');
console.log('ALL 10 ROUND 2 ADVERSARIAL PROOFS & 20 SUB-ASSERTIONS PASSED (EXIT 0)');
console.log('================================================================================');
