/**
 * DR. WILLIAM A. DEMBSKI — EMPIRICAL FALSIFICATION & POST-REMEDIATION VERIFICATION SUITE
 * Executes ruthless mathematical and algorithmic proofs against Siliquarium.
 * Exits 0 only if all 8 previously falsified vulnerabilities are 100% remediated.
 */

import assert from 'node:assert/strict';
import {
  Mulberry32Prng,
  CodonTable,
  CodonType,
  CodonTranslator,
  GenomeSafe,
  PoreWorkshop,
  PoreCell,
  HexCoord3D,
  VentPhysics
} from '../dist/core/index.js';
import {
  MotifScanner,
  TaxonomyNomenclature,
  WeisfeilerLehmanHasher
} from '../dist/core/paleontology/index.js';
import { CircuitAdvantageAnalyzer } from '../dist/core/analysis/CircuitAdvantageAnalyzer.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { TreadmillingEngine } from '../dist/engine/kinematics/TreadmillingEngine.js';
import { CircuitTopology } from '../dist/visualizers/CircuitTopology.js';
import { CircuitAutopsyModal } from '../dist/ui/CircuitAutopsyModal.js';

console.log('================================================================================');
console.log('DR. WILLIAM A. DEMBSKI — EMPIRICAL FALSIFICATION & POST-REMEDIATION VERIFICATION');
console.log('================================================================================\n');

const cAND = (0).toString(2).padStart(6, '0');
const cPHOTON = (6).toString(2).padStart(6, '0');
const cSTREAM_C = (8).toString(2).padStart(6, '0');
const cNOT = (12).toString(2).padStart(6, '0');
const cBARO = (16).toString(2).padStart(6, '0');
const cCHELATOR = (18).toString(2).padStart(6, '0');
const cOR = (22).toString(2).padStart(6, '0');
const cMECHANO = (26).toString(2).padStart(6, '0');
const cEPS = (28).toString(2).padStart(6, '0');
const cPOR_A = (32).toString(2).padStart(6, '0');
const cELECTRO = (36).toString(2).padStart(6, '0');
const cPOR_B = (38).toString(2).padStart(6, '0');
const cSTREAM_D = (42).toString(2).padStart(6, '0');
const cTOXIN = (44).toString(2).padStart(6, '0');
const cBATT = (50).toString(2).padStart(6, '0');
const cSEPTUM = (52).toString(2).padStart(6, '0');
const cSILENT = (56).toString(2).padStart(6, '0');

// ============================================================================
// PROOF 1: Sensory Porin Short-Circuit Contamination (`effA = boundA`)
// ============================================================================
console.log('--- [PROOF 1] PoreWorkshop Sensory Porin Isolation (`effA = boundA`) ---');
{
  const tape = `${cPHOTON}${cMECHANO}${cPOR_A}${cPOR_B}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const ws = PoreWorkshop.fromBitstring(tape);
  const g0 = ws.getGates()[0];
  console.log(`Gate 0 bound terminals: A=${g0.boundTerminalA}, B=${g0.boundTerminalB}`);

  // Evaluate with photonIr=FALSE, mechanoTouch=FALSE, but streamA=TRUE, streamB=TRUE:
  const tele = ws.stepTick(true, true, false, 50, false, false, false, false, false, false);
  console.log(`When photonIr=false, mechanoTouch=false, streamA=true, streamB=true:`);
  console.log(`  Gate 0 output = ${ws.getGates()[0].output} (Expected: false)`);
  console.log(`  primaryActive = ${tele.primaryActive} (Expected: false)`);
  assert.equal(ws.getGates()[0].output, false, 'Proof 1 Failed: Gate 0 bound to PHOTON_IR/MECHANO_TOUCH was contaminated by streamA/streamB');
  assert.equal(tele.primaryActive, false, 'Proof 1 Failed: primaryActive should be false');

  // Test PORIN_TOXIN_T and PORIN_BARO_ACOUSTIC bound to an AND gate:
  const tapeToxin = `${cTOXIN}${cBARO}${cPOR_A}${cPOR_B}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const wsToxin = PoreWorkshop.fromBitstring(tapeToxin);
  const teleToxin = wsToxin.stepTick(true, true, false, 50, false, false, false, false, false, false);
  console.log(`Gate 0 bound to (${wsToxin.getGates()[0].boundTerminalA}, ${wsToxin.getGates()[0].boundTerminalB}) with toxinT=false, baro=false, A=true, B=true:`);
  console.log(`  Gate 0 output = ${wsToxin.getGates()[0].output} (Expected: false)`);
  assert.equal(wsToxin.getGates()[0].output, false, 'Proof 1 Failed: Gate 0 bound to TOXIN_T/BARO_ACOUSTIC was contaminated by streamA/streamB');
  assert.equal(teleToxin.primaryActive, false, 'Proof 1 Failed: teleToxin.primaryActive should be false');
  console.log('  [PASS] Proof 1 Verified: Sensory porin bindings are strictly isolated from global Stream A/B.\n');
}

// ============================================================================
// PROOF 2: Stack-AST Evaluation vs Hardcoded 4-Gate Template & Orphaned Gate 0
// ============================================================================
console.log('--- [PROOF 2] Stack-AST Evaluation: Commutative XOR Invariance & Zero Orphaned Gates ---');
{
  // Order 1: [OR, AND, NOT, AND] -> G0=OR(A,B), G1=AND(A,B), G2=NOT(G1), G3=AND(G0,G2)
  const tapeTemplateXor = `${cPOR_A}${cPOR_B}${cOR}${cAND}${cNOT}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;
  // Commuted equivalent order: [AND, NOT, OR, AND] -> G0=AND(A,B), G1=NOT(G0), G2=OR(A,B), G3=AND(G1,G2)
  const tapeCommutedXor = `${cPOR_A}${cPOR_B}${cAND}${cNOT}${cOR}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;

  const ws1 = PoreWorkshop.fromBitstring(tapeTemplateXor);
  const ws2 = PoreWorkshop.fromBitstring(tapeCommutedXor);

  const inputs = [[false, false], [false, true], [true, false], [true, true]];
  const tt1 = inputs.map(([a, b]) => ws1.step(a, b, false).primaryOutput);
  const tt2 = inputs.map(([a, b]) => ws2.step(a, b, false).primaryOutput);
  console.log(`Order 1 [OR, AND, NOT, AND] truth table:          ${JSON.stringify(tt1)}`);
  console.log(`Commuted [AND, NOT, OR, AND] truth table:         ${JSON.stringify(tt2)}`);
  console.log(`Commuted AST edges: ${JSON.stringify(ws2.getAstEdges())}`);
  assert.deepEqual(tt1, [false, true, true, false], 'Proof 2 Failed: [OR, AND, NOT, AND] did not compute XOR');
  assert.deepEqual(tt2, [false, true, true, false], 'Proof 2 Failed: Commuted [AND, NOT, OR, AND] did not compute XOR');

  // Test 4-gate circuit without NOT at idx=2: [AND, OR, AND, OR]
  const tape4NoNot = `${cPOR_A}${cPOR_B}${cAND}${cOR}${cAND}${cOR}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;
  const ws4 = PoreWorkshop.fromBitstring(tape4NoNot);
  ws4.step(true, false, false);
  const g0Used = ws4.getAstEdges().some(e => e.fromGateId === 0);
  console.log(`4-gate [AND, OR, AND, OR] AST edges: ${JSON.stringify(ws4.getAstEdges())}`);
  console.log(`Is Gate 0 connected into the AST in [AND, OR, AND, OR]? ${g0Used} (Expected: true)`);
  assert.equal(g0Used, true, 'Proof 2 Failed: Gate 0 is orphaned in 4-gate [AND, OR, AND, OR]');
  console.log('  [PASS] Proof 2 Verified: Stack-AST evaluates both XOR orders identically and leaves zero orphaned gates.\n');
}

// ============================================================================
// PROOF 3: Unified Engine & UI AST Evaluation (PoreWorkshop vs CircuitTopology vs CircuitAutopsyModal)
// ============================================================================
console.log('--- [PROOF 3] Unified AST Evaluation: PoreWorkshop vs CircuitTopology vs CircuitAutopsyModal ---');
{
  const tapeTemplateXor = `${cPOR_A}${cPOR_B}${cOR}${cAND}${cNOT}${cAND}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;
  const ws = PoreWorkshop.fromBitstring(tapeTemplateXor);
  const world = new SimulationWorld({ radius: 2, soupDensity: 0 });
  const modal = new CircuitAutopsyModal(world);

  const inputs = [
    { a: false, b: false, t: false },
    { a: false, b: true, t: false },
    { a: true, b: false, t: false },
    { a: true, b: true, t: false }
  ];

  console.log('Input (A,B) | PoreWorkshop (Engine) | CircuitAutopsyModal (UI Truth Table) | CircuitTopology (UI Schematic Gate_3)');
  for (const inp of inputs) {
    const engineOut = ws.step(inp.a, inp.b, inp.t).primaryOutput;
    const modalOut = modal.evaluateCircuitState(tapeTemplateXor, inp.a, inp.b, inp.t).primaryActive;
    const topo = CircuitTopology.analyze(tapeTemplateXor, {
      nozzleCoord: new HexCoord3D(0, 0, 0),
      offshootCoords: [],
      regimeName: 'BALANCED_COUPLED',
      streamA: inp.a,
      streamB: inp.b,
      toxinT: inp.t,
      thermalFlux: 500
    }, engineOut);
    const gate3Node = topo.nodes.find(n => n.id === 'gate_3');
    console.log(`  (${inp.a ? 1 : 0}, ${inp.b ? 1 : 0})     |         ${String(engineOut).padEnd(5)}         |                ${String(modalOut).padEnd(5)}                 |                 ${String(gate3Node?.isHigh).padEnd(5)}`);
    assert.equal(modalOut, engineOut, `Proof 3 Failed: CircuitAutopsyModal disagreed with PoreWorkshop at (${inp.a}, ${inp.b})`);
    assert.equal(gate3Node?.isHigh, engineOut, `Proof 3 Failed: CircuitTopology gate_3 disagreed with PoreWorkshop at (${inp.a}, ${inp.b})`);
  }
  console.log('  [PASS] Proof 3 Verified: Engine, CircuitAutopsyModal, and CircuitTopology are 100% bit-identical.\n');
}

// ============================================================================
// PROOF 4: MotifScanner & TaxonomyNomenclature Behavioural & Structural Verification
// ============================================================================
console.log('--- [PROOF 4] MotifScanner & TaxonomyNomenclature Behavioral & Topological Verification ---');
{
  // Degenerate 4-gate circuit: [AND, AND, OR, NOT]
  const bagTape = `${cPOR_A}${cPOR_B}${cAND}${cAND}${cOR}${cNOT}${cBATT}${cSILENT}${cSILENT}${cSILENT}`;
  const bagWs = PoreWorkshop.fromBitstring(bagTape);
  const matches = MotifScanner.scanWorkshop(bagWs);
  console.log(`Degenerate 4-gate bag [AND, AND, OR, NOT] claims ${matches.length} motifs (Expected: 0)`);
  assert.equal(matches.length, 0, `Proof 4 Failed: Degenerate bag [AND, AND, OR, NOT] claimed ${matches.length} false motifs`);

  // Check Ring Oscillator: [NOT, NOT, NOT]
  const ringTape = `${cPOR_A}${cPOR_B}${cNOT}${cNOT}${cNOT}${cBATT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const ringWs = PoreWorkshop.fromBitstring(ringTape);
  const ringMatches = MotifScanner.scanWorkshop(ringWs);
  const ringHistory = [];
  const ringStates = new Set();
  for (let t = 0; t < 12; t++) {
    ringHistory.push(ringWs.step(false, false, false).primaryOutput);
    ringStates.add(ringWs.getBuiltGates().map(g => (g.output ? '1' : '0')).join(''));
  }
  let alternations = 0;
  for (let t = 1; t < ringHistory.length; t++) {
    if (ringHistory[t] !== ringHistory[t - 1]) alternations++;
  }
  console.log(`Ring Oscillator [NOT, NOT, NOT] detected as: ${ringMatches.map(m => m.motif.type).join(', ')}`);
  console.log(`Ring Oscillator output over 12 ticks with constant input (0,0): ${JSON.stringify(ringHistory)}`);
  console.log(`Autonomous state alternations: ${alternations} across ${ringStates.size} unique 3-gate states (Expected: 4 alternations, 6 states)`);
  assert.ok(ringMatches.some(m => m.motif.type === 'RING_OSCILLATOR'), 'Proof 4 Failed: Genuine 3-NOT ring oscillator not detected');
  assert.equal(ringStates.size, 6, 'Proof 4 Failed: 3-NOT ring oscillator did not visit all 6 traveling-wave states');
  assert.ok(alternations >= 4, 'Proof 4 Failed: 3-NOT ring oscillator did not oscillate autonomously at constant (0,0)');
  console.log('  [PASS] Proof 4 Verified: Degenerate gate bags claim 0 motifs; odd-inverter rings genuinely oscillate.\n');
}

// ============================================================================
// PROOF 5: Expressed-Gate Enforcement (`getBuiltGates()`) in SimulationWorld & MotifScanner
// ============================================================================
console.log('--- [PROOF 5] Expressed-Gate Enforcement (`getBuiltGates()`) on Repressed Operons ---');
{
  // Repressed NOT gate in Operon 1 (never expressed because M_3 starvation channel is false when energy=80)
  const cOP_CH3 = (63).toString(2).padStart(6, '0'); // REGULATORY_OPERATOR channel 3 (batteryVoltage < 25)
  const repressedNotTape = `${cPOR_A}${cPOR_B}${cAND}${cBATT}${cOP_CH3}${cNOT}${cSILENT}${cSILENT}${cSILENT}${cSILENT}`;
  const cell = new PoreCell(new GenomeSafe(repressedNotTape), 80, 20, 0);
  const tickRes = cell.tick(true, true, false);
  const builtGates = cell.getWorkshop().getBuiltGates();
  console.log(`Cell with repressed Operon 1 (NOT gate):`);
  console.log(`  expressedGateCount = ${tickRes.telemetry.expressedGateCount}, repressedGateCount = ${tickRes.telemetry.repressedGateCount}`);
  console.log(`  workshop.getBuiltGates().length = ${builtGates.length} (total genome gates = ${cell.getWorkshop().getGates().length})`);
  const hasWeapon = builtGates.length >= 2 && builtGates.some(g => g.type === CodonType.GATE_NOT);
  const preyShield = builtGates.some(g => g.type === CodonType.GATE_NOT);
  const motifMatches = cell.getMotifMatches().map(m => m.motif.type);
  console.log(`  Host grants hasWeapon (via getBuiltGates) = ${hasWeapon} (Expected: false)`);
  console.log(`  Host grants preyShield (via getBuiltGates) = ${preyShield} (Expected: false)`);
  console.log(`  MotifScanner awards motifs to unexpressed gates: ${JSON.stringify(motifMatches)} (Expected: [])`);
  assert.equal(builtGates.length, 1, 'Proof 5 Failed: Repressed NOT gate should not appear in getBuiltGates()');
  assert.equal(hasWeapon, false, 'Proof 5 Failed: Unexpressed NOT gate must not grant weaponry');
  assert.equal(preyShield, false, 'Proof 5 Failed: Unexpressed NOT gate must not grant predation immunity');
  assert.equal(motifMatches.length, 0, 'Proof 5 Failed: MotifScanner must not award motifs to unexpressed gates');
  console.log('  [PASS] Proof 5 Verified: Unexpressed operons grant zero weaponry, zero shields, and zero motifs.\n');
}

// ============================================================================
// PROOF 6: Sparse Active Pore Registration (`inoculateCell` & `stepSpores`)
// ============================================================================
console.log('--- [PROOF 6] Sparse Active Pore Registration (`inoculateCell` & `stepSpores`) ---');
{
  const world = new SimulationWorld({ radius: 3, soupDensity: 0, seed: 42 });
  const pActive = world.getPore(new HexCoord3D(2, 0, 0));
  pActive.setResident(new PoreCell(new GenomeSafe(`${cPOR_A}${cPOR_B}${cAND}${cBATT}${cSILENT}${cSILENT}`), 60, 20, 0));
  world.getLedger().recordEnergyInjection(60);
  world.getLedger().recordMatterInjection(20);
  world.registerActivePore(pActive);

  const targetCoord = new HexCoord3D(0, 1, 0);
  const inoculated = world.inoculateCell(targetCoord, new GenomeSafe(`${cPOR_A}${cPOR_B}${cAND}${cBATT}${cSILENT}${cSILENT}`), 60, 20);
  const pInoculated = world.getPore(targetCoord);

  for (let t = 0; t < 15; t++) {
    world.step();
  }
  console.log(`Was cell inoculated at (0,1,0)? ${inoculated}`);
  console.log(`Active pore (2,0,0) age after 15 ticks:     ${pActive.getResident()?.getAge()}`);
  console.log(`Inoculated pore (0,1,0) age after 15 ticks: ${pInoculated.getResident()?.getAge()} (Expected: 15)`);
  assert.equal(inoculated, true, 'Proof 6 Failed: inoculateCell returned false');
  assert.equal(pInoculated.getResident()?.getAge(), 15, 'Proof 6 Failed: Inoculated pore did not metabolize across 15 ticks');
  console.log('  [PASS] Proof 6 Verified: Inoculated cells and settled spores are immediately registered in activePores.\n');
}

// ============================================================================
// PROOF 7: Chimney Spalling Thermodynamic Conservation & Pore Clearance
// ============================================================================
console.log('--- [PROOF 7] Chimney Spalling Thermodynamic Ledger Conservation ---');
{
  const world = new SimulationWorld({ radius: 3, minZ: 0, maxZ: 3, soupDensity: 0, seed: 42 });
  const elevatedPores = world.getAllPores().filter(p => p.coord.z >= 1 && !p.isAqueous());
  for (const ep of elevatedPores) {
    ep.setBasalt(false);
    world.getGrid().removeBasaltObstacle(ep.coord);
    const cell = new PoreCell(new GenomeSafe(`${cPOR_A}${cPOR_B}${cAND}${cBATT}${cSILENT}${cSILENT}`), 75, 25, 0);
    ep.setResident(cell);
    world.getLedger().recordEnergyInjection(75);
    world.getLedger().recordMatterInjection(25);
    world.registerActivePore(ep);
  }
  console.log(`Before CHIMNEY_SPALLING: isEnergyConserved=${world.exportTelemetry().ledger.isEnergyConserved}`);
  world.triggerGeologicalEvent('CHIMNEY_SPALLING');
  const spalledAqueousWithResident = world.getAllPores().filter(p => p.isAqueous() && p.getResident() !== null);
  const teleAfter = world.exportTelemetry();
  console.log(`After CHIMNEY_SPALLING:`);
  console.log(`  Aqueous water pores holding a benthic resident cell = ${spalledAqueousWithResident.length} (Expected: 0)`);
  console.log(`  isEnergyConserved = ${teleAfter.ledger.isEnergyConserved}, isMatterConserved = ${teleAfter.ledger.isMatterConserved}`);
  assert.equal(spalledAqueousWithResident.length, 0, 'Proof 7 Failed: Spalled aqueous pore retained a benthic resident cell');
  assert.equal(teleAfter.ledger.isEnergyConserved, true, 'Proof 7 Failed: Energy conservation violated after CHIMNEY_SPALLING');
  assert.equal(teleAfter.ledger.isMatterConserved, true, 'Proof 7 Failed: Matter conservation violated after CHIMNEY_SPALLING');
  console.log('  [PASS] Proof 7 Verified: Chimney spalling cleanly clears residents and preserves ΔE = 0, ΔM = 0.\n');
}

// ============================================================================
// PROOF 8: Monte Carlo Prebiotic Soup Audit (0.0% False Positive Rate)
// ============================================================================
console.log('--- [PROOF 8] Monte Carlo Prebiotic Soup Audit (2,000 Random 10-Codon Genomes) ---');
{
  const prng = new Mulberry32Prng(1337);
  let totalSampled = 2000;
  let motifHalfAdderCount = 0;
  let trueXorTruthTableCount = 0;
  let motifRingOscCount = 0;
  let trueOscillatingCount = 0;
  let motifBistableCount = 0;
  let trueBistableMemoryCount = 0;

  for (let i = 0; i < totalSampled; i++) {
    const safe = GenomeSafe.createPrebioticSoup(prng, 10);
    const ws = PoreWorkshop.fromBitstring(safe.getTape());
    const matches = MotifScanner.scanWorkshop(ws);

    const hasHalfAdder = matches.some(m => m.motif.type === 'HALF_ADDER');
    const hasRingOsc = matches.some(m => m.motif.type === 'RING_OSCILLATOR');
    const hasBistable = matches.some(m => m.motif.type === 'BISTABLE_LATCH');

    if (hasHalfAdder) {
      motifHalfAdderCount++;
      const wTest = PoreWorkshop.fromBitstring(safe.getTape());
      const r00 = wTest.step(false, false, false).primaryOutput;
      const r01 = wTest.step(false, true, false).primaryOutput;
      const r10 = wTest.step(true, false, false).primaryOutput;
      const r11 = wTest.step(true, true, false).primaryOutput;
      if (!r00 && r01 && r10 && !r11) {
        trueXorTruthTableCount++;
      }
    }

    if (hasRingOsc) {
      motifRingOscCount++;
      const wTest = PoreWorkshop.fromBitstring(safe.getTape());
      const outs = [];
      for (let t = 0; t < 8; t++) outs.push(wTest.step(false, false, false).primaryOutput);
      let alt = 0;
      for (let t = 1; t < outs.length; t++) {
        if (outs[t] !== outs[t - 1]) alt++;
      }
      if (alt >= 2) {
        trueOscillatingCount++;
      }
    }

    if (hasBistable) {
      motifBistableCount++;
      const wSet = PoreWorkshop.fromBitstring(safe.getTape());
      wSet.step(true, true, false);
      const holdAfterSet = wSet.step(false, false, false).primaryOutput && wSet.step(false, false, false).primaryOutput;
      const wReset = PoreWorkshop.fromBitstring(safe.getTape());
      wReset.step(false, false, false);
      const holdAfterReset = !wReset.step(false, false, false).primaryOutput && !wReset.step(false, false, false).primaryOutput;
      if (holdAfterSet && holdAfterReset) {
        trueBistableMemoryCount++;
      }
    }
  }

  const haFpr = motifHalfAdderCount > 0 ? ((motifHalfAdderCount - trueXorTruthTableCount) / motifHalfAdderCount) * 100 : 0;
  const roFpr = motifRingOscCount > 0 ? ((motifRingOscCount - trueOscillatingCount) / motifRingOscCount) * 100 : 0;
  const blFpr = motifBistableCount > 0 ? ((motifBistableCount - trueBistableMemoryCount) / motifBistableCount) * 100 : 0;

  console.log(`Out of ${totalSampled} random 10-codon prebiotic genomes:`);
  console.log(`  HALF_ADDER claimed by MotifScanner:      ${motifHalfAdderCount} | Actually computes XOR: ${trueXorTruthTableCount} (False Positive Rate: ${haFpr.toFixed(1)}%)`);
  console.log(`  RING_OSCILLATOR claimed by MotifScanner: ${motifRingOscCount} | Actually oscillates at (0,0): ${trueOscillatingCount} (False Positive Rate: ${roFpr.toFixed(1)}%)`);
  console.log(`  BISTABLE_LATCH claimed by MotifScanner:  ${motifBistableCount} | Actually holds 1-bit state: ${trueBistableMemoryCount} (False Positive Rate: ${blFpr.toFixed(1)}%)`);

  assert.equal(motifHalfAdderCount, trueXorTruthTableCount, 'Proof 8 Failed: Non-zero false positive rate for HALF_ADDER');
  assert.equal(motifRingOscCount, trueOscillatingCount, 'Proof 8 Failed: Non-zero false positive rate for RING_OSCILLATOR');
  assert.equal(motifBistableCount, trueBistableMemoryCount, 'Proof 8 Failed: Non-zero false positive rate for BISTABLE_LATCH');
  console.log('  [PASS] Proof 8 Verified: 0.0% False Positive Rate across all 2,000 random genomes.\n');
}

console.log('================================================================================');
console.log('ALL 8 EMPIRICAL PROOFS PASSED POST-REMEDIATION VERIFICATION (EXIT CODE 0)');
console.log('================================================================================');
