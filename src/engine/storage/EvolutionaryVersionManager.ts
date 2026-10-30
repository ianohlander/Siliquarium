/**
 * 🐠 Siliquarium Storage Subsystem
 * EvolutionaryVersionManager: Git-for-Alife Directed Acyclic Graph (DAG) Versioning Engine.
 * 
 * Implements Stephen Jay Gould's "Replaying Life's Tape" (1989) and Richard Lenski's LTEE
 * frozen fossil replay experiments. Manages divergent evolutionary branches, bookmarks,
 * deterministic replays, stochastic divergences, and environmental perturbation forks.
 */

import { SiliquariumDB, IEvolutionaryBranch } from './SiliquariumDB.js';
import { SimulationSnapshotManager, ISimulationStateSnapshot } from './SimulationSnapshotManager.js';
import { BranchForkingEngine, BRANCH_PALETTE } from './BranchForkingEngine.js';
import type { SimulationWorld } from '../SimulationWorld.js';

export { BRANCH_PALETTE };

export class EvolutionaryVersionManager {
  private static instance: EvolutionaryVersionManager | null = null;
  private readonly db: SiliquariumDB;
  private readonly snapshotManager: SimulationSnapshotManager;
  private activeBranchId: string = 'main';
  private isInitialized: boolean = false;

  private constructor() {
    this.db = SiliquariumDB.getInstance();
    this.snapshotManager = SimulationSnapshotManager.getInstance();
  }

  public static getInstance(): EvolutionaryVersionManager {
    if (!EvolutionaryVersionManager.instance) {
      EvolutionaryVersionManager.instance = new EvolutionaryVersionManager();
    }
    return EvolutionaryVersionManager.instance;
  }

  /**
   * Initializes default 'main' branch in database if not present.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    await this.db.init();

    const mainBranch = await this.db.getSimulationBranch('main');
    if (!mainBranch) {
      const defaultBranch: IEvolutionaryBranch = {
        id: 'main',
        name: 'Main Primordial Lineage',
        description: 'Baseline continuous evolutionary trajectory.',
        createdAt: Date.now(),
        forkedFromBranchId: null,
        forkedFromSnapshotId: null,
        headSnapshotId: '',
        forkMode: 'root',
        color: BRANCH_PALETTE[0],
        isDefault: true
      };
      await this.db.saveSimulationBranch(defaultBranch);
    }
    this.isInitialized = true;
  }

  public getActiveBranchId(): string {
    return this.activeBranchId;
  }

  public setActiveBranchId(id: string): void {
    this.activeBranchId = id;
  }

  public async getActiveBranch(): Promise<IEvolutionaryBranch> {
    await this.init();
    const branch = await this.db.getSimulationBranch(this.activeBranchId);
    if (!branch) {
      return (await this.db.getSimulationBranch('main'))!;
    }
    return branch;
  }

  public async getAllBranches(): Promise<IEvolutionaryBranch[]> {
    await this.init();
    return this.db.getAllSimulationBranches();
  }

  public async getBranch(id: string): Promise<IEvolutionaryBranch | null> {
    await this.init();
    return this.db.getSimulationBranch(id);
  }

  public async getSnapshotsForBranch(branchId: string): Promise<ISimulationStateSnapshot[]> {
    await this.init();
    return this.db.getSnapshotsByBranch(branchId);
  }

  public async getAllSnapshots(): Promise<ISimulationStateSnapshot[]> {
    await this.init();
    return this.db.getAllSimulationSnapshots();
  }

  public async getSnapshot(id: string): Promise<ISimulationStateSnapshot | null> {
    await this.init();
    return this.db.getSimulationSnapshot(id);
  }

  /**
   * Captures an instant checkpoint on the active branch and saves it to repository.
   */
  public async saveCheckpoint(
    world: SimulationWorld,
    name?: string,
    notes: string = ''
  ): Promise<ISimulationStateSnapshot> {
    await this.init();
    const activeBranch = await this.getActiveBranch();
    const snapName = name || `Checkpoint @ Tick ${world.captureStateSnapshot('temp').tick}`;
    const snap = this.snapshotManager.captureSnapshot(
      world,
      snapName,
      {
        branchId: activeBranch.id,
        parentSnapshotId: activeBranch.headSnapshotId || null,
        notes
      }
    );

    await this.db.saveSimulationSnapshot(snap);

    // Update branch head pointer
    const updatedBranch: IEvolutionaryBranch = {
      ...activeBranch,
      headSnapshotId: snap.id
    };
    await this.db.saveSimulationBranch(updatedBranch);

    return snap;
  }

  /**
   * Forks a new evolutionary branch from the current simulation state or from an arbitrary historical snapshot.
   * Supports:
   * - 'deterministic': Gould's tape, exact PRNG state preserved.
   * - 'stochastic': Lenski Cit+ replay, PRNG re-seeded for alternate mutational exploration.
   * - 'perturbed': Applies environmental perturbation (thermal/volcanic surge, volatility boost).
   */
  public async createBranch(
    world: SimulationWorld,
    name: string,
    description: string,
    forkMode: 'deterministic' | 'stochastic' | 'perturbed' = 'deterministic',
    fromSnapshotId?: string,
    options?: {
      newSeed?: number;
      volatilityMultiplier?: number;
      mutationMultiplier?: number;
    }
  ): Promise<{ branch: IEvolutionaryBranch; snapshot: ISimulationStateSnapshot }> {
    await this.init();
    const engine = new BranchForkingEngine(this.db, this.snapshotManager);
    const result = await engine.fork(
      { world, name, description, forkMode, fromSnapshotId, options },
      () => this.getActiveBranch()
    );
    this.activeBranchId = result.branch.id;
    return result;
  }

  /**
   * Checks out a branch or snapshot, restoring it completely into the simulation world.
   */
  public async checkout(
    world: SimulationWorld,
    targetId: string
  ): Promise<{ branch: IEvolutionaryBranch; snapshot: ISimulationStateSnapshot }> {
    await this.init();

    // Check if target is a branch ID
    let branch = await this.db.getSimulationBranch(targetId);
    let snapshot: ISimulationStateSnapshot | null = null;

    if (branch) {
      if (branch.headSnapshotId) {
        snapshot = await this.db.getSimulationSnapshot(branch.headSnapshotId);
      }
      if (!snapshot) {
        // Fall back to most recent snapshot on this branch
        const branchSnaps = await this.db.getSnapshotsByBranch(branch.id);
        if (branchSnaps.length > 0) {
          snapshot = branchSnaps[branchSnaps.length - 1];
        }
      }
    } else {
      // Target is a snapshot ID
      snapshot = await this.db.getSimulationSnapshot(targetId);
      if (snapshot) {
        branch = await this.db.getSimulationBranch(snapshot.branchId);
      }
    }

    if (!snapshot || !branch) {
      throw new Error(`Checkout target not found: ${targetId}`);
    }

    // Restore full state into simulation world (ΔE = 0.000)
    world.restoreSimulationSnapshot(snapshot);
    this.activeBranchId = branch.id;

    return { branch, snapshot };
  }

  /**
   * Exports snapshot to a downloadable .silisave file.
   */
  public async exportSnapshotToFile(snapshotId?: string, world?: SimulationWorld): Promise<string> {
    await this.init();
    let snap: ISimulationStateSnapshot | null = null;

    if (snapshotId) {
      snap = await this.db.getSimulationSnapshot(snapshotId);
    } else if (world) {
      const activeBranch = await this.getActiveBranch();
      snap = this.snapshotManager.captureSnapshot(world, 'Exported Snapshot', activeBranch.id);
    }

    if (!snap) {
      throw new Error('No snapshot available to export.');
    }

    return this.snapshotManager.exportToFile(snap);
  }

  /**
   * Imports a .silisave file or JSON string, creates a branch for it, and optionally checks it out.
   */
  public async importSnapshotFromFile(
    fileOrJson: File | Blob | string,
    world?: SimulationWorld
  ): Promise<{ branch: IEvolutionaryBranch; snapshot: ISimulationStateSnapshot }> {
    await this.init();
    const engine = new BranchForkingEngine(this.db, this.snapshotManager);
    const result = await engine.importSnapshot(fileOrJson, world);
    if (world) {
      this.activeBranchId = result.branch.id;
    }
    return result;
  }

  /**
   * Deletes a branch (cannot delete default 'main' branch or current active branch).
   */
  public async deleteBranch(branchId: string): Promise<boolean> {
    await this.init();
    if (branchId === 'main' || branchId === this.activeBranchId) {
      return false;
    }

    const branch = await this.db.getSimulationBranch(branchId);
    if (!branch) return false;

    // Delete snapshots belonging to this branch
    const snaps = await this.db.getSnapshotsByBranch(branchId);
    for (const s of snaps) {
      await this.db.deleteSimulationSnapshot(s.id);
    }

    await this.db.deleteSimulationBranch(branchId);
    return true;
  }

  /**
   * Deletes an individual snapshot.
   */
  public async deleteSnapshot(snapshotId: string): Promise<boolean> {
    await this.init();
    const snap = await this.db.getSimulationSnapshot(snapshotId);
    if (!snap) return false;

    await this.db.deleteSimulationSnapshot(snapshotId);
    return true;
  }
}
