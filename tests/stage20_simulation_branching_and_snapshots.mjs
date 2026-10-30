/**
 * 🐠 Siliquarium Native Test Suite - Stage 20
 * Simulation State Export/Load, Evolutionary Branching & Thermodynamic Conservation Audits
 * 
 * Verifies:
 * 1. Full running simulation state serialization & restoration (.silisave format).
 * 2. Strict First-Law energy and matter conservation invariant (ΔE = 0.000, ΔM = 0.000) post-load.
 * 3. Stephen Jay Gould's "Replaying Life's Tape" (1989): 100% deterministic replay via Mulberry32 bit-state.
 * 4. Richard Lenski LTEE Cit+ stochastic replays: divergent evolutionary trajectories via re-seeded PRNG.
 * 5. Environmental perturbation forks: selective volcanic/thermal shocks.
 * 6. Git-for-Alife DAG branch repository & headless in-memory persistence.
 */

import assert from 'node:assert';
import {
  SimulationWorld,
  SimulationSnapshotManager,
  EvolutionaryVersionManager,
  SiliquariumDB
} from '../dist/engine/index.js';

export async function runStage20() {
  console.log('  Testing Simulation State Export, Restore & Evolutionary Branching...');

  // -------------------------------------------------------------------------
  // Test 1: Full Simulation State Capture (.silisave format)
  // -------------------------------------------------------------------------
  const world = new SimulationWorld({ radius: 3, soupDensity: 0.25, seed: 1337 });
  const snapshotMgr = SimulationSnapshotManager.getInstance();

  // Step simulation 25 ticks so organisms feed, metabolize, and switch Landauer gates
  for (let i = 0; i < 25; i++) {
    world.step();
  }

  const telePre = world.exportTelemetry();
  assert.ok(telePre.tick === 25, 'World tick should be exactly 25.');
  assert.ok(telePre.livingCount > 0, 'World must contain living cells.');
  assert.strictEqual(telePre.ledger.isEnergyConserved, true, 'Pre-export universe must conserve energy (ΔE = 0.000).');
  assert.strictEqual(telePre.ledger.isMatterConserved, true, 'Pre-export universe must conserve matter (ΔM = 0.000).');

  const snap25 = snapshotMgr.captureSnapshot(world, 'Checkpoint Epoch 25', 'main', null, 'Initial test capture');

  assert.strictEqual(snap25.format, 'silisave', "Snapshot format must be 'silisave'.");
  assert.strictEqual(snap25.version, '1.0.0', "Snapshot version must be '1.0.0'.");
  assert.strictEqual(snap25.tick, 25, 'Snapshot tick must match simulation tick.');
  assert.strictEqual(snap25.stats.livingCount, telePre.livingCount, 'Captured living count must match telemetry.');
  assert.ok(snap25.world.pores.length > 0, 'Snapshot must serialize all world pores.');
  assert.ok(snap25.world.prngState !== undefined, 'Snapshot must capture Mulberry32 PRNG bit-state.');
  assert.ok(snap25.world.ledger !== undefined, 'Snapshot must capture ThermodynamicLedger state.');

  console.log('    ✓ Test 1 Passed: Full simulation state captured in .silisave format.');

  // -------------------------------------------------------------------------
  // Test 2: Serialization, Deserialization & Format Validation
  // -------------------------------------------------------------------------
  const jsonStr = snapshotMgr.serialize(snap25);
  assert.ok(typeof jsonStr === 'string' && jsonStr.length > 500, 'Serialized snapshot must produce JSON string.');

  const deserialized = snapshotMgr.deserialize(jsonStr);
  assert.strictEqual(deserialized.id, snap25.id, 'Deserialized snapshot ID must match original.');
  assert.strictEqual(deserialized.tick, 25, 'Deserialized tick must match.');
  assert.strictEqual(deserialized.world.pores.length, snap25.world.pores.length, 'Pore count must match.');

  // Negative validation: invalid format should throw
  assert.throws(() => {
    snapshotMgr.deserialize(JSON.stringify({ format: 'invalid', world: {} }));
  }, /Invalid simulation file/, 'Deserializer must reject non-silisave JSON.');

  console.log('    ✓ Test 2 Passed: Serialization, deserialization and schema validation verified.');

  // -------------------------------------------------------------------------
  // Test 3: World State Restoration & Absolute Thermodynamic Conservation (ΔE = 0.000)
  // -------------------------------------------------------------------------
  // Advance world by another 35 ticks to tick 60
  for (let i = 0; i < 35; i++) {
    world.step();
  }
  const teleTick60 = world.exportTelemetry();
  assert.strictEqual(teleTick60.tick, 60, 'Simulation should have reached tick 60.');

  // Restore tick 25 snapshot
  snapshotMgr.restoreSnapshot(world, deserialized);

  const teleRestored = world.exportTelemetry();
  assert.strictEqual(teleRestored.tick, 25, 'Restored simulation tick must revert to exactly 25.');
  assert.strictEqual(teleRestored.livingCount, telePre.livingCount, 'Restored living cell count must match pre-export.');
  assert.strictEqual(teleRestored.totalEnergyInUniverse, telePre.totalEnergyInUniverse, 'Stored energy must match pre-export.');
  assert.strictEqual(teleRestored.ledger.isEnergyConserved, true, 'Restored simulation must strictly conserve energy (ΔE = 0.000).');
  assert.strictEqual(teleRestored.ledger.isMatterConserved, true, 'Restored simulation must strictly conserve matter (ΔM = 0.000).');

  console.log('    ✓ Test 3 Passed: World state restoration maintains strict First-Law conservation (ΔE = 0.000, ΔM = 0.000).');

  // -------------------------------------------------------------------------
  // Test 4: Stephen Jay Gould's "Replaying Life's Tape" (100% Deterministic Replay)
  // -------------------------------------------------------------------------
  // From tick 25, advance 15 ticks and record population trajectory
  const trajectoryRun1 = [];
  for (let i = 0; i < 15; i++) {
    world.step();
    trajectoryRun1.push({
      living: world.exportTelemetry().livingCount,
      energy: world.exportTelemetry().totalEnergyInUniverse,
      spores: world.exportTelemetry().sporeCount
    });
  }

  // Restore tick 25 snapshot again with exact PRNG state
  snapshotMgr.restoreSnapshot(world, deserialized);

  const trajectoryRun2 = [];
  for (let i = 0; i < 15; i++) {
    world.step();
    trajectoryRun2.push({
      living: world.exportTelemetry().livingCount,
      energy: world.exportTelemetry().totalEnergyInUniverse,
      spores: world.exportTelemetry().sporeCount
    });
  }

  for (let i = 0; i < 15; i++) {
    assert.strictEqual(
      trajectoryRun2[i].living,
      trajectoryRun1[i].living,
      `Step ${i}: Living cell count must match 100% identically in deterministic replay.`
    );
    assert.strictEqual(
      trajectoryRun2[i].energy,
      trajectoryRun1[i].energy,
      `Step ${i}: Energy total must match 100% identically in deterministic replay.`
    );
    assert.strictEqual(
      trajectoryRun2[i].spores,
      trajectoryRun1[i].spores,
      `Step ${i}: Spore count must match 100% identically in deterministic replay.`
    );
  }

  console.log("    ✓ Test 4 Passed: Gould's Replaying Life's Tape achieves 100% deterministic bit-for-bit replay.");

  // -------------------------------------------------------------------------
  // Test 5: Evolutionary Version Manager (Git-for-Alife DAG & Forking)
  // -------------------------------------------------------------------------
  const versionMgr = EvolutionaryVersionManager.getInstance();
  await versionMgr.init();

  const mainBranch = await versionMgr.getActiveBranch();
  assert.strictEqual(mainBranch.id, 'main', "Default branch must be 'main'.");

  // Save a bookmark checkpoint on main
  const snapBookmark = await versionMgr.saveCheckpoint(world, 'Main Timeline Checkpoint');
  assert.ok(snapBookmark.id.length > 0, 'Saved checkpoint must have valid ID.');

  const updatedMain = await versionMgr.getActiveBranch();
  assert.strictEqual(updatedMain.headSnapshotId, snapBookmark.id, 'Branch head pointer must advance to new checkpoint.');

  // Fork a stochastic branch (Lenski Cit+ replay with alternate PRNG seed)
  const { branch: stochBranch, snapshot: stochSnap } = await versionMgr.createBranch(
    world,
    'Lenski Cit+ Stochastic Replay',
    'Forked with independent PRNG seed to explore alternate mutations.',
    'stochastic',
    snapBookmark.id,
    { newSeed: 987654321 }
  );

  assert.strictEqual(stochBranch.forkMode, 'stochastic', "Fork mode must be 'stochastic'.");
  assert.strictEqual(stochBranch.forkedFromBranchId, 'main', "Parent branch must be 'main'.");
  assert.strictEqual(versionMgr.getActiveBranchId(), stochBranch.id, 'Active branch must switch to newly forked branch.');

  // Run simulation on stochastic branch
  for (let i = 0; i < 20; i++) {
    world.step();
  }
  const teleStoch = world.exportTelemetry();
  assert.strictEqual(teleStoch.ledger.isEnergyConserved, true, 'Stochastic branch must conserve energy (ΔE = 0.000).');

  // Fork an environmental perturbation branch (Volcanic surge)
  const { branch: perturbBranch } = await versionMgr.createBranch(
    world,
    'Volcanic Upheaval Shock',
    'Forked under 3x geological volatility and elevated mutations.',
    'perturbed',
    snapBookmark.id,
    { volatilityMultiplier: 3.0, mutationMultiplier: 2.0 }
  );

  assert.strictEqual(perturbBranch.forkMode, 'perturbed', "Fork mode must be 'perturbed'.");
  assert.strictEqual(versionMgr.getActiveBranchId(), perturbBranch.id, 'Active branch must switch to perturbed branch.');

  for (let i = 0; i < 15; i++) {
    world.step();
  }
  const telePerturb = world.exportTelemetry();
  assert.strictEqual(telePerturb.ledger.isEnergyConserved, true, 'Perturbed branch must conserve energy (ΔE = 0.000).');

  // Checkout back to main branch
  const { branch: checkedOutBranch, snapshot: checkedOutSnap } = await versionMgr.checkout(world, 'main');
  assert.strictEqual(checkedOutBranch.id, 'main', "Checked out branch must be 'main'.");
  assert.strictEqual(versionMgr.getActiveBranchId(), 'main', 'Active branch pointer must update to main.');
  assert.strictEqual(world.exportTelemetry().tick, snapBookmark.tick, 'Simulation world must revert to main checkpoint tick.');
  assert.strictEqual(world.exportTelemetry().ledger.isEnergyConserved, true, 'Re-checked out main must conserve energy (ΔE = 0.000).');

  console.log('    ✓ Test 5 Passed: Git-for-Alife DAG branch forking, stochastic replays, and checkout verified.');

  // -------------------------------------------------------------------------
  // Test 6: In-Memory / IndexedDB Headless Storage Integrity
  // -------------------------------------------------------------------------
  const db = SiliquariumDB.getInstance();
  const allBranches = await versionMgr.getAllBranches();
  assert.ok(allBranches.length >= 3, 'Must contain main, stochastic, and perturbed branches.');

  const mainSnaps = await versionMgr.getSnapshotsForBranch('main');
  assert.ok(mainSnaps.length >= 1, 'Main branch must contain saved checkpoints.');

  const stats = await db.getStorageStats();
  assert.ok(stats.simulationSnapshotCount !== undefined && stats.simulationSnapshotCount >= 2, 'Storage stats must count simulation snapshots.');
  assert.ok(stats.branchCount !== undefined && stats.branchCount >= 3, 'Storage stats must count simulation branches.');

  console.log('    ✓ Test 6 Passed: Headless repository persistence and stats verified.');
}
