/**
 * 🐠 Siliquarium Storage Subsystem
 * SiliquariumDB: Asynchronous IndexedDB Tiered Persistence Engine.
 * 
 * Provides zero-cost cold storage for longitudinal evolutionary lineages,
 * Lenski -80°C fossil snapshots, Uri Alon network motif discoveries, and LTEE flight logs.
 * 
 * Headless-Safe: Gracefully falls back to bounded in-memory collections when running
 * in non-browser environments (Node.js test runners, headless workers).
 */

import type { IKinematicFrame } from '../kinematics/ColonyKinematicsRecorder.js';
import type { ISimulationStateSnapshot } from './SimulationSnapshotManager.js';

export interface IEvolutionaryBranch {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: number;
  readonly forkedFromBranchId: string | null;
  readonly forkedFromSnapshotId: string | null;
  headSnapshotId: string;
  readonly forkMode: 'root' | 'deterministic' | 'stochastic' | 'perturbed';
  readonly color: string;
  readonly isDefault?: boolean;
}

export interface IStoredMilestone {
  readonly id: string;
  readonly tick: number;
  readonly motifType: string;
  readonly motifName: string;
  readonly biologicalCognate: string;
  readonly naturalFunction: string;
  readonly citation: string;
  readonly wlHash: string;
  readonly origin: string;
  readonly poreCoord: { q: number; r: number; z: number };
  readonly timestamp?: number;
}

export interface IStoredFossilSnapshot {
  readonly id: string;
  readonly tick: number;
  readonly reason: string;
  readonly livingCount: number;
  readonly fossils: readonly {
    readonly q: number;
    readonly r: number;
    readonly z: number;
    readonly tape: string;
    readonly energy: number;
    readonly matter: number;
    readonly generation: number;
    readonly age: number;
  }[];
}

export interface IStoredEpochSample {
  readonly tick: number;
  readonly maxGeneration: number;
  readonly livingCount: number;
  readonly sporeCount: number;
  readonly carcassCount: number;
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
  readonly totalBirths: number;
  readonly totalDeaths: number;
  readonly evolutionaryVelocity: number;
  readonly meanTapeLength: number;
  readonly maxTapeLength: number;
  readonly meanGateCount: number;
  readonly maxGateCount: number;
  readonly syncytialColonyCount: number;
  readonly maxSyncytialColonySize: number;
  readonly totalEnergyInUniverse: number;
  readonly dominantTaxon: string;
}

export interface IStorageStats {
  readonly isAvailable: boolean;
  readonly milestoneCount: number;
  readonly snapshotCount: number;
  readonly sampleCount: number;
  readonly simulationSnapshotCount?: number;
  readonly branchCount?: number;
}

export class SiliquariumDB {
  private static instance: SiliquariumDB | null = null;
  private db: IDBDatabase | null = null;
  private isSupported: boolean = false;
  private initPromise: Promise<void> | null = null;

  // Fallback in-memory stores for Node.js / non-IndexedDB environments
  private fallbackMilestones: IStoredMilestone[] = [];
  private fallbackSnapshots: IStoredFossilSnapshot[] = [];
  private fallbackSamples: IStoredEpochSample[] = [];
  private fallbackKinematics: IKinematicFrame[] = [];
  private fallbackSimulationSnapshots: Map<string, ISimulationStateSnapshot> = new Map();
  private fallbackSimulationBranches: Map<string, IEvolutionaryBranch> = new Map();
  private readonly MAX_FALLBACK_CAPACITY = 200;

  private constructor() {
    this.isSupported = typeof indexedDB !== 'undefined';
  }

  public static getInstance(): SiliquariumDB {
    if (!SiliquariumDB.instance) {
      SiliquariumDB.instance = new SiliquariumDB();
    }
    return SiliquariumDB.instance;
  }

  public async init(): Promise<void> {
    if (!this.isSupported) return;
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve) => {
      try {
        const req = indexedDB.open('SiliquariumDB', 3);

        req.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          if (!db.objectStoreNames.contains('milestones')) {
            const msStore = db.createObjectStore('milestones', { keyPath: 'id' });
            msStore.createIndex('tick', 'tick', { unique: false });
            msStore.createIndex('motifType', 'motifType', { unique: false });
          }

          if (!db.objectStoreNames.contains('fossil_snapshots')) {
            const fsStore = db.createObjectStore('fossil_snapshots', { keyPath: 'id' });
            fsStore.createIndex('tick', 'tick', { unique: false });
          }

          if (!db.objectStoreNames.contains('epoch_samples')) {
            db.createObjectStore('epoch_samples', { keyPath: 'tick' });
          }

          if (!db.objectStoreNames.contains('kinematic_snapshots')) {
            db.createObjectStore('kinematic_snapshots', { keyPath: 'tick' });
          }

          if (!db.objectStoreNames.contains('simulation_snapshots')) {
            const ssStore = db.createObjectStore('simulation_snapshots', { keyPath: 'id' });
            ssStore.createIndex('branchId', 'branchId', { unique: false });
            ssStore.createIndex('tick', 'tick', { unique: false });
            ssStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains('simulation_branches')) {
            const sbStore = db.createObjectStore('simulation_branches', { keyPath: 'id' });
            sbStore.createIndex('forkedFromBranchId', 'forkedFromBranchId', { unique: false });
            sbStore.createIndex('createdAt', 'createdAt', { unique: false });
          }
        };

        req.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve();
        };

        req.onerror = () => {
          this.isSupported = false; // Fall back smoothly on error
          resolve();
        };
      } catch {
        this.isSupported = false;
        resolve();
      }
    });

    return this.initPromise;
  }

  public async saveMilestone(milestone: IStoredMilestone): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackMilestones.push(milestone);
      if (this.fallbackMilestones.length > this.MAX_FALLBACK_CAPACITY) {
        this.fallbackMilestones.shift();
      }
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('milestones', 'readwrite');
        const store = tx.objectStore('milestones');
        store.put(milestone);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async getMilestones(limit: number = 100, offset: number = 0): Promise<IStoredMilestone[]> {
    await this.init();

    if (!this.db) {
      const slice = this.fallbackMilestones.slice().reverse();
      return slice.slice(offset, offset + limit);
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('milestones', 'readonly');
        const store = tx.objectStore('milestones');
        const req = store.openCursor(null, 'prev'); // Most recent first
        const results: IStoredMilestone[] = [];
        let advanced = false;
        let skipped = 0;

        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (!cursor) {
            resolve(results);
            return;
          }

          if (offset > 0 && !advanced && skipped < offset) {
            skipped++;
            cursor.continue();
            return;
          }
          advanced = true;

          results.push(cursor.value);
          if (results.length < limit) {
            cursor.continue();
          } else {
            resolve(results);
          }
        };

        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async getMilestoneCount(): Promise<number> {
    await this.init();
    if (!this.db) return this.fallbackMilestones.length;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('milestones', 'readonly');
        const store = tx.objectStore('milestones');
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(0);
      } catch {
        resolve(0);
      }
    });
  }

  public async saveFossilSnapshot(snapshot: IStoredFossilSnapshot): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSnapshots.push(snapshot);
      if (this.fallbackSnapshots.length > 50) this.fallbackSnapshots.shift();
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('fossil_snapshots', 'readwrite');
        const store = tx.objectStore('fossil_snapshots');
        store.put(snapshot);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async saveEpochSample(sample: IStoredEpochSample): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSamples.push(sample);
      if (this.fallbackSamples.length > 500) this.fallbackSamples.shift();
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('epoch_samples', 'readwrite');
        const store = tx.objectStore('epoch_samples');
        store.put(sample);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async saveKinematicFrame(frame: IKinematicFrame): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackKinematics.push(frame);
      if (this.fallbackKinematics.length > this.MAX_FALLBACK_CAPACITY) {
        this.fallbackKinematics.shift();
      }
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('kinematic_snapshots', 'readwrite');
        const store = tx.objectStore('kinematic_snapshots');
        store.put(frame);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async getKinematicFrames(limit: number = 200, offset: number = 0): Promise<IKinematicFrame[]> {
    await this.init();

    if (!this.db) {
      const slice = this.fallbackKinematics.slice().reverse();
      return slice.slice(offset, offset + limit);
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('kinematic_snapshots', 'readonly');
        const store = tx.objectStore('kinematic_snapshots');
        const req = store.getAll();

        req.onsuccess = () => {
          const results = (req.result as IKinematicFrame[]) || [];
          results.sort((a, b) => b.tick - a.tick);
          resolve(results.slice(offset, offset + limit));
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async saveSimulationSnapshot(snapshot: ISimulationStateSnapshot): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSimulationSnapshots.set(snapshot.id, snapshot);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_snapshots', 'readwrite');
        const store = tx.objectStore('simulation_snapshots');
        store.put(snapshot);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async getSimulationSnapshot(id: string): Promise<ISimulationStateSnapshot | null> {
    await this.init();

    if (!this.db) {
      return this.fallbackSimulationSnapshots.get(id) ?? null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_snapshots', 'readonly');
        const store = tx.objectStore('simulation_snapshots');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  public async getAllSimulationSnapshots(): Promise<ISimulationStateSnapshot[]> {
    await this.init();

    if (!this.db) {
      return Array.from(this.fallbackSimulationSnapshots.values()).sort((a, b) => b.timestamp - a.timestamp);
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_snapshots', 'readonly');
        const store = tx.objectStore('simulation_snapshots');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result as ISimulationStateSnapshot[]) || [];
          list.sort((a, b) => b.timestamp - a.timestamp);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async getSnapshotsByBranch(branchId: string): Promise<ISimulationStateSnapshot[]> {
    await this.init();

    if (!this.db) {
      return Array.from(this.fallbackSimulationSnapshots.values())
        .filter(s => s.branchId === branchId)
        .sort((a, b) => a.tick - b.tick);
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_snapshots', 'readonly');
        const store = tx.objectStore('simulation_snapshots');
        const idx = store.index('branchId');
        const req = idx.getAll(branchId);
        req.onsuccess = () => {
          const list = (req.result as ISimulationStateSnapshot[]) || [];
          list.sort((a, b) => a.tick - b.tick);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async deleteSimulationSnapshot(id: string): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSimulationSnapshots.delete(id);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_snapshots', 'readwrite');
        const store = tx.objectStore('simulation_snapshots');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async saveSimulationBranch(branch: IEvolutionaryBranch): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSimulationBranches.set(branch.id, branch);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_branches', 'readwrite');
        const store = tx.objectStore('simulation_branches');
        store.put(branch);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async getSimulationBranch(id: string): Promise<IEvolutionaryBranch | null> {
    await this.init();

    if (!this.db) {
      return this.fallbackSimulationBranches.get(id) ?? null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_branches', 'readonly');
        const store = tx.objectStore('simulation_branches');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  public async getAllSimulationBranches(): Promise<IEvolutionaryBranch[]> {
    await this.init();

    if (!this.db) {
      return Array.from(this.fallbackSimulationBranches.values()).sort((a, b) => a.createdAt - b.createdAt);
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_branches', 'readonly');
        const store = tx.objectStore('simulation_branches');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result as IEvolutionaryBranch[]) || [];
          list.sort((a, b) => a.createdAt - b.createdAt);
          resolve(list);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async deleteSimulationBranch(id: string): Promise<void> {
    await this.init();

    if (!this.db) {
      this.fallbackSimulationBranches.delete(id);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('simulation_branches', 'readwrite');
        const store = tx.objectStore('simulation_branches');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async getStorageStats(): Promise<IStorageStats> {
    await this.init();

    if (!this.db) {
      return {
        isAvailable: false,
        milestoneCount: this.fallbackMilestones.length,
        snapshotCount: this.fallbackSnapshots.length,
        sampleCount: this.fallbackSamples.length,
        simulationSnapshotCount: this.fallbackSimulationSnapshots.size,
        branchCount: this.fallbackSimulationBranches.size
      };
    }

    const countStore = (name: string): Promise<number> => {
      return new Promise((resolve) => {
        try {
          if (!this.db!.objectStoreNames.contains(name)) {
            resolve(0);
            return;
          }
          const tx = this.db!.transaction(name, 'readonly');
          const store = tx.objectStore(name);
          const req = store.count();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(0);
        } catch {
          resolve(0);
        }
      });
    };

    const [milestoneCount, snapshotCount, sampleCount, simulationSnapshotCount, branchCount] = await Promise.all([
      countStore('milestones'),
      countStore('fossil_snapshots'),
      countStore('epoch_samples'),
      countStore('simulation_snapshots'),
      countStore('simulation_branches')
    ]);

    return {
      isAvailable: true,
      milestoneCount,
      snapshotCount,
      sampleCount,
      simulationSnapshotCount,
      branchCount
    };
  }

  public async clearAll(): Promise<void> {
    this.fallbackMilestones = [];
    this.fallbackSnapshots = [];
    this.fallbackSamples = [];
    this.fallbackKinematics = [];
    this.fallbackSimulationSnapshots.clear();
    this.fallbackSimulationBranches.clear();

    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const storeNames = ['milestones', 'fossil_snapshots', 'epoch_samples'];
        if (this.db!.objectStoreNames.contains('kinematic_snapshots')) {
          storeNames.push('kinematic_snapshots');
        }
        if (this.db!.objectStoreNames.contains('simulation_snapshots')) {
          storeNames.push('simulation_snapshots');
        }
        if (this.db!.objectStoreNames.contains('simulation_branches')) {
          storeNames.push('simulation_branches');
        }
        const tx = this.db!.transaction(storeNames, 'readwrite');
        for (const name of storeNames) {
          tx.objectStore(name).clear();
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}
