/**
 * 🐠 Siliquarium Stage 13 Verification
 * Tests Phase 6 Multi-Lineage Phylogeny, LTEE Benchmarks, Clade Diversity, and Evolutionary Convergence.
 */

import assert from 'node:assert';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { EvolutionaryFlightRecorder } from '../dist/engine/paleontology/EvolutionaryFlightRecorder.js';
import { LteeBenchmark } from '../dist/engine/paleontology/LteeBenchmark.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { MotifType } from '../dist/core/paleontology/NetworkMotif.js';

export function runStage13() {
  // Test 1: LteeBenchmark unit mechanics
  const ltee = new LteeBenchmark();
  ltee.recordBirth(1);
  ltee.recordBirth(2);
  ltee.recordBirth(3);
  ltee.recordDeath();
  assert.strictEqual(ltee.getMaxGeneration(), 3, 'Max generation must be 3');
  assert.strictEqual(ltee.getTotalBirths(), 3, 'Total births must be 3');
  assert.strictEqual(ltee.getTotalDeaths(), 1, 'Total deaths must be 1');

  // Test 2: Shannon Diversity calculation
  const dummyPop = [
    { generation: 1, cladeFounderId: 'clade-A' },
    { generation: 2, cladeFounderId: 'clade-A' },
    { generation: 1, cladeFounderId: 'clade-B' },
    { generation: 3, cladeFounderId: 'clade-C' }
  ];
  const report = ltee.computeMetrics(100, 4, 0, dummyPop);
  assert.strictEqual(report.activeCladesCount, 3, 'Must have 3 active clades');
  assert.ok(report.shannonDiversity > 0.8, `Shannon diversity must be positive and non-trivial: ${report.shannonDiversity}`);
  assert.strictEqual(report.evolutionaryVelocity, 3.0, 'Evolutionary velocity mismatch');

  // Test 3: EvolutionaryFlightRecorder Homology vs Homoplasy Classification
  const recorder = new EvolutionaryFlightRecorder();
  const c0 = new HexCoord3D(0, 0, 0);
  const root = recorder.recordBirth('org-root', null, 0, c0, '000000', 0, []);
  const child1 = recorder.recordBirth('org-1', 'org-root', 10, c0, '000001', 1, []);
  const child2 = recorder.recordBirth('org-2', 'org-root', 12, c0, '000010', 1, []);

  // Both evolved INVERTER_NOT independently (LCA org-root did NOT have it)
  const classification = recorder.classifyEvolutionaryOrigin(child1.id, child2.id, MotifType.INVERTER_NOT);
  assert.strictEqual(classification, 'HOMOPLASY', 'Independent motif discovery must be classified as HOMOPLASY (Convergent Evolution)');

  // Test 4: Long-Term Multi-Generational Simulation & Thermodynamic Invariant
  const world = new SimulationWorld({ radius: 3, minZ: 0, maxZ: 1, seed: 1337, soupDensity: 0.3 });
  
  for (let t = 1; t <= 200; t++) {
    world.step();
    const tele = world.exportTelemetry();
    assert.strictEqual(tele.ledger.energyBalanceDelta, 0, `Energy leak at tick ${t}!`);
    assert.strictEqual(tele.ledger.matterBalanceDelta, 0, `Matter leak at tick ${t}!`);
  }

  const finalTele = world.exportTelemetry();
  assert.ok(finalTele.maxGeneration >= 1, `Simulation must evolve past generation 0: ${finalTele.maxGeneration}`);
  assert.ok(finalTele.activeCladesCount >= 1, 'Must maintain active phylogenetic clades');
  assert.ok(finalTele.totalBirths > 0, 'Replication births must be recorded in LTEE ledger');
}
