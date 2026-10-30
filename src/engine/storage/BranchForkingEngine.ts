/**
 * 🐠 Siliquarium Storage Subsystem
 * BranchForkingEngine: Directed Acyclic Graph (DAG) branch forking & Gould replay engine.
 */

import { SiliquariumDB, IEvolutionaryBranch } from './SiliquariumDB.js';
import { SimulationSnapshotManager, ISimulationStateSnapshot } from './SimulationSnapshotManager.js';
import type { SimulationWorld } from '../SimulationWorld.js';

export const BRANCH_PALETTE: readonly string[] = [
  '#10b981', // Emerald (Main / Basal)
  '#38bdf8', // Cyan (Planktonic / Spore)
  '#f59e0b', // Amber (Chemiosmotic)
  '#a855f7', // Purple (Endosymbiont)
  '#ec4899', // Pink / Rose (Multicellular)
  '#06b6d4', // Deep Teal (Abyssal Rift)
  '#84cc16', // Lime (Metabolic Divergence)
  '#f97316'  // Orange (Volcanic / Thermal Surge)
];

export interface ICreateBranchOptions {
  readonly world: SimulationWorld;
  readonly name: string;
  readonly description: string;
  readonly forkMode?: 'deterministic' | 'stochastic' | 'perturbed';
  readonly fromSnapshotId?: string;
  readonly options?: {
    readonly newSeed?: number;
    readonly volatilityMultiplier?: number;
    readonly mutationMultiplier?: number;
  };
}

export class BranchForkingEngine {
  private readonly db: SiliquariumDB;
  private readonly snapshotManager: SimulationSnapshotManager;

  constructor(db: SiliquariumDB, snapshotManager: SimulationSnapshotManager) {
    this.db = db;
    this.snapshotManager = snapshotManager;
  }

  public async fork(
    config: ICreateBranchOptions,
    getActiveBranch: () => Promise<IEvolutionaryBranch>
  ): Promise<{ branch: IEvolutionaryBranch; snapshot: ISimulationStateSnapshot }> {
    const { world, name, description, forkMode = 'deterministic', fromSnapshotId, options } = config;

    // 1. Resolve source snapshot
    let baseSnapshot: ISimulationStateSnapshot;
    if (fromSnapshotId) {
      const found = await this.db.getSimulationSnapshot(fromSnapshotId);
      if (!found) {
        throw new Error(`Source snapshot not found: ${fromSnapshotId}`);
      }
      baseSnapshot = found;
    } else {
      const activeBranch = await getActiveBranch();
      baseSnapshot = this.snapshotManager.captureSnapshot(
        world,
        `Fork Base @ Tick ${world.captureStateSnapshot('temp').tick}`,
        {
          branchId: activeBranch.id,
          parentSnapshotId: activeBranch.headSnapshotId || null
        }
      );
      await this.db.saveSimulationSnapshot(baseSnapshot);
    }

    // 2. Determine branch color
    const allBranches = await this.db.getAllSimulationBranches();
    const colorIndex = allBranches.length % BRANCH_PALETTE.length;
    const color = BRANCH_PALETTE[colorIndex];

    const branchId = `branch-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000).toString(16)}`;

    // 3. Compute child snapshot parameters based on fork mode
    const childPrngSeed = forkMode === 'stochastic'
      ? (options?.newSeed ?? (Math.floor(Math.random() * 0xffffffff) >>> 0))
      : undefined;

    const childVolatilityMult = forkMode === 'perturbed'
      ? (options?.volatilityMultiplier ?? 2.5)
      : undefined;

    const childMutationMult = forkMode === 'perturbed'
      ? (options?.mutationMultiplier ?? 1.5)
      : undefined;

    // Restore base into world with fork options
    world.restoreSimulationSnapshot(baseSnapshot, {
      newPrngSeed: childPrngSeed,
      volatilityMultiplier: childVolatilityMult,
      mutationMultiplier: childMutationMult
    });

    // Capture child snapshot on new branch
    const childSnapshot = this.snapshotManager.captureSnapshot(
      world,
      `${name} (Initial)`,
      {
        branchId,
        parentSnapshotId: baseSnapshot.id,
        notes: `Forked from ${baseSnapshot.name} (${forkMode} replay)`
      }
    );

    // Create branch record
    const newBranch: IEvolutionaryBranch = {
      id: branchId,
      name,
      description,
      createdAt: Date.now(),
      forkedFromBranchId: baseSnapshot.branchId,
      forkedFromSnapshotId: baseSnapshot.id,
      headSnapshotId: childSnapshot.id,
      forkMode,
      color,
      isDefault: false
    };

    await this.db.saveSimulationBranch(newBranch);
    await this.db.saveSimulationSnapshot(childSnapshot);

    return { branch: newBranch, snapshot: childSnapshot };
  }

  public async importSnapshot(
    fileOrJson: File | Blob | string,
    world?: SimulationWorld
  ): Promise<{ branch: IEvolutionaryBranch; snapshot: ISimulationStateSnapshot }> {
    const snapshot = await this.snapshotManager.importFromFile(fileOrJson);
    await this.db.saveSimulationSnapshot(snapshot);

    let branch = await this.db.getSimulationBranch(snapshot.branchId);
    if (!branch) {
      const allBranches = await this.db.getAllSimulationBranches();
      const color = BRANCH_PALETTE[allBranches.length % BRANCH_PALETTE.length];
      branch = {
        id: snapshot.branchId,
        name: `Imported: ${snapshot.name}`,
        description: `Imported from .silisave file (Tick ${snapshot.tick})`,
        createdAt: Date.now(),
        forkedFromBranchId: null,
        forkedFromSnapshotId: null,
        headSnapshotId: snapshot.id,
        forkMode: 'root',
        color,
        isDefault: false
      };
      await this.db.saveSimulationBranch(branch);
    } else {
      branch = {
        ...branch,
        headSnapshotId: snapshot.id
      };
      await this.db.saveSimulationBranch(branch);
    }

    if (world) {
      world.restoreSimulationSnapshot(snapshot);
    }

    return { branch, snapshot };
  }
}
