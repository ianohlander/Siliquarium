/**
 * 🐠 Siliquarium Stage 11 Verification
 * Tests Evolutionary Flight Recorder, Lenski Fossil Freezer, and Counterfactual Autopsies.
 */

import assert from 'node:assert';
import {
  EvolutionaryFlightRecorder,
  FossilFreezer
} from '../dist/engine/paleontology/index.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { MotifType, NetworkMotifRegistry } from '../dist/core/paleontology/NetworkMotif.js';

export function runStage11() {
  const recorder = new EvolutionaryFlightRecorder();
  const freezer = new FossilFreezer();

  // Test 1: Record Ancestral Lineage Tree
  const tapeGen0 = '1'.repeat(60);
  const tapeGen1 = '1'.repeat(58) + '00'; // 2 bits flipped
  const tapeGen2 = '1'.repeat(55) + '00000'; // 3 more bits flipped

  const id0 = recorder.generateId();
  const id1 = recorder.generateId();
  const id2 = recorder.generateId();

  recorder.recordBirth(id0, null, 0, new HexCoord3D(0, 0, 0), tapeGen0, 0, []);
  recorder.recordBirth(id1, id0, 10, new HexCoord3D(1, 0, 0), tapeGen1, 1, []);
  recorder.recordBirth(id2, id1, 20, new HexCoord3D(1, 1, 0), tapeGen2, 2, [
    { motif: NetworkMotifRegistry.getDefinition(MotifType.HALF_ADDER), involvedGateIds: [0, 1], confidence: 0.95 }
  ]);

  const lineage = recorder.traceAncestry(id2);
  assert.strictEqual(lineage.length, 3, 'Lineage must have exactly 3 nodes from Gen 2 back to Gen 0');
  assert.strictEqual(lineage[0].id, id0, 'Lineage root must be Gen 0 ancestor');
  assert.strictEqual(lineage[2].id, id2, 'Lineage leaf must be Gen 2 organism');

  // Test 2: Hamming Distance Solution-Space Trajectory
  const trajectory = recorder.calculateHammingTrajectory(id2);
  assert.deepStrictEqual(trajectory, [0, 2, 3], 'Trajectory must record exact mutation steps (2 bits, then 3 bits)');

  // Test 3: Homology vs Convergent Evolution (Homoplasy)
  const idSibling = recorder.generateId();
  recorder.recordBirth(idSibling, id1, 22, new HexCoord3D(0, 1, 0), tapeGen1, 2, [
    { motif: NetworkMotifRegistry.getDefinition(MotifType.HALF_ADDER), involvedGateIds: [0, 1], confidence: 0.95 }
  ]);

  const lca = recorder.findLeastCommonAncestor(id2, idSibling);
  assert.ok(lca !== null, 'LCA must exist');
  assert.strictEqual(lca.id, id1, 'LCA of id2 and idSibling must be id1');

  // Since id1 did NOT have HALF_ADDER, this discovery along both leaves is Convergent Evolution (Homoplasy)
  const classification = recorder.classifyEvolutionaryOrigin(id2, idSibling, MotifType.HALF_ADDER);
  assert.strictEqual(classification, 'HOMOPLASY', 'Independent discovery in branches must be classified as HOMOPLASY');

  // Test 4: Fossil Freezer Snapshot & Counterfactual Single-Bit Autopsy
  const dummyPores = [
    {
      coord: new HexCoord3D(0, 0, 0),
      state: 'OCCUPIED',
      isBasalt: false,
      energy: 80,
      matter: 30,
      age: 15,
      generation: 1,
      gateCount: 2,
      tapeBitstring: tapeGen1,
      catalyticYield: 2,
      toggleCount: 1,
      primaryActive: true
    }
  ];

  const snap = freezer.freeze(100, dummyPores, 'MILESTONE_TEST');
  assert.strictEqual(snap.tick, 100, 'Snapshot tick mismatch');
  assert.strictEqual(snap.fossils.length, 1, 'Snapshot must store 1 living organism');
  assert.strictEqual(freezer.getSnapshot(snap.id)?.id, snap.id, 'Must retrieve snapshot by ID');

  // Test 5: Counterfactual Single-Bit Mutation Autopsy
  const parentTape = '000000' + '111111';
  const childTape =  '000100' + '111111'; // Bit 3 inverted (codon 0)

  const autopsies = FossilFreezer.counterfactualAutopsy(parentTape, childTape);
  assert.strictEqual(autopsies.length, 1, 'Autopsy must pinpoint exactly 1 bit mutation');
  assert.strictEqual(autopsies[0].bitIndex, 3, 'Must identify bit index 3');
  assert.strictEqual(autopsies[0].codonIndex, 0, 'Must identify codon index 0');
  assert.strictEqual(autopsies[0].parentBit, '0', 'Parent bit was 0');
  assert.strictEqual(autopsies[0].childBit, '1', 'Child bit was 1');
}
