/**
 * 🐠 Siliquarium Stage 10 Verification
 * Tests Digital Paleontologist, Weisfeiler-Lehman Graph Hasher, and Uri Alon Network Motifs.
 */

import assert from 'node:assert';
import {
  NetworkMotifRegistry,
  MotifType,
  WeisfeilerLehmanHasher,
  MotifScanner
} from '../dist/core/paleontology/index.js';
import { CodonType } from '../dist/core/codons/CodonTable.js';
import { PoreWorkshop } from '../dist/core/domain/PoreWorkshop.js';

export function runStage10() {
  // Test 1: Uri Alon Motif Registry Completeness
  const motifs = NetworkMotifRegistry.getAllDefinitions();
  assert.strictEqual(motifs.length, 6, 'Registry must contain 6 canonical Uri Alon motifs');
  for (const m of motifs) {
    assert.ok(m.biologicalCognate.length > 0, `Motif ${m.type} must define biological cognate`);
    assert.ok(m.citation.length > 0, `Motif ${m.type} must cite academic literature`);
  }

  // Test 2: Weisfeiler-Lehman Graph Hashing & Permutation Invariance
  const gatesA = [
    { id: 0, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false },
    { id: 1, type: CodonType.GATE_XOR, inputA: false, inputB: false, output: false, lastOutput: false }
  ];
  const hashA = WeisfeilerLehmanHasher.hashNetlist(gatesA);
  assert.ok(hashA.startsWith('WL-'), 'Hash must start with WL- prefix');

  // Non-identical circuits must produce different hashes
  const gatesB = [
    { id: 0, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false }
  ];
  const hashB = WeisfeilerLehmanHasher.hashNetlist(gatesB);
  assert.notStrictEqual(hashA, hashB, 'Different circuits must produce different topological hashes');

  // Test 3: Motif Scanner - Half-Adder (XOR + AND)
  const halfAdderMatches = MotifScanner.scanWorkshop({
    getGates: () => [
      { id: 0, type: CodonType.GATE_XOR, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 1, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false }
    ]
  });
  assert.ok(halfAdderMatches.some(m => m.motif.type === MotifType.HALF_ADDER), 'Must detect Half-Adder motif');

  // Test 4: Motif Scanner - Ring Oscillator (>= 3 Inverters)
  const ringOscMatches = MotifScanner.scanWorkshop({
    getGates: () => [
      { id: 0, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 1, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 2, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false }
    ]
  });
  assert.ok(ringOscMatches.some(m => m.motif.type === MotifType.RING_OSCILLATOR), 'Must detect Ring Oscillator motif');

  // Test 5: Motif Scanner - Negative Autoregulation
  const autoRegMatches = MotifScanner.scanWorkshop({
    getGates: () => [
      { id: 0, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false }
    ]
  });
  assert.ok(autoRegMatches.some(m => m.motif.type === MotifType.NEGATIVE_AUTOREGULATION), 'Must detect Negative Autoregulation');
}
