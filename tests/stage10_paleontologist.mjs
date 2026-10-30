/**
 * 🐠 Siliquarium Stage 10 Verification
 * Tests Digital Paleontologist, Weisfeiler-Lehman Graph Hasher, and Uri Alon Network Motifs.
 */

import assert from 'node:assert';
import {
  NetworkMotifRegistry,
  MotifType,
  WeisfeilerLehmanHasher,
  MotifScanner,
  TaxonomyNomenclature
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
    { id: 1, type: CodonType.GATE_OR, inputA: false, inputB: false, output: false, lastOutput: false }
  ];
  const hashA = WeisfeilerLehmanHasher.hashNetlist(gatesA);
  assert.ok(hashA.startsWith('WL-'), 'Hash must start with WL- prefix');

  // Non-identical circuits must produce different hashes
  const gatesB = [
    { id: 0, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false }
  ];
  const hashB = WeisfeilerLehmanHasher.hashNetlist(gatesB);
  assert.notStrictEqual(hashA, hashB, 'Different circuits must produce different topological hashes');

  // Test 3: Motif Scanner - Half-Adder (Composite XOR = OR + AND + NOT + AND)
  const halfAdderMatches = MotifScanner.scanWorkshop({
    getGates: () => [
      { id: 0, type: CodonType.GATE_OR, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 1, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 2, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 3, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false }
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

  // Test 5b: Motif Scanner - Composite Half-Adder (Evolved XOR composite from AND + OR + NOT)
  const compositeHalfAdderMatches = MotifScanner.scanWorkshop({
    getGates: () => [
      { id: 0, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 1, type: CodonType.GATE_OR, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 2, type: CodonType.GATE_NOT, inputA: false, inputB: false, output: false, lastOutput: false },
      { id: 3, type: CodonType.GATE_AND, inputA: false, inputB: false, output: false, lastOutput: false }
    ]
  });
  assert.ok(compositeHalfAdderMatches.some(m => m.motif.type === MotifType.HALF_ADDER), 'Must detect Composite Half-Adder motif from evolved AND + OR + NOT primitives without primitive XOR codons');

  // Test 6: Whimsical Taxonomy & Scientist Homages Nomenclature
  const allTaxa = TaxonomyNomenclature.getAllTaxa();
  assert.ok(allTaxa.length >= 10, 'Taxonomy system must define at least 10 scientist-homage taxa');

  const honorees = allTaxa.map(t => t.honoree);
  assert.ok(honorees.some(h => h.includes('Uri Alon')), 'Must honor Uri Alon');
  assert.ok(honorees.some(h => h.includes('Michael B. Elowitz')), 'Must honor Michael Elowitz');
  assert.ok(honorees.some(h => h.includes('James J. Collins')), 'Must honor James Collins');
  assert.ok(honorees.some(h => h.includes('Alan Turing')), 'Must honor Alan Turing');
  assert.ok(honorees.some(h => h.includes('Rolf Landauer')), 'Must honor Rolf Landauer');
  assert.ok(honorees.some(h => h.includes('Peter Mitchell')), 'Must honor Peter Mitchell');
  assert.ok(honorees.some(h => h.includes('Richard E. Lenski')), 'Must honor Richard Lenski');

  // Verify taxonomic classification behavior
  const elowitzTaxon = TaxonomyNomenclature.classify('001100', ['NOT', 'NOT', 'NOT'], 1, false);
  assert.strictEqual(elowitzTaxon.binomialName, 'Oscillocladus elowitzii');

  const lenskiTaxon = TaxonomyNomenclature.classify('001100', ['AND'], 22, false);
  assert.strictEqual(lenskiTaxon.binomialName, 'Silicoplasma lenskii');

  const collinsTaxon = TaxonomyNomenclature.classify('001100', ['AND', 'OR'], 2, false);
  assert.strictEqual(collinsTaxon.binomialName, 'Bistabilus collinsii');
}
