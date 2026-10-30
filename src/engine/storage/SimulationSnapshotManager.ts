/**
 * 🐠 Siliquarium Storage Subsystem
 * SimulationSnapshotManager: Full Simulation State Serialization & Restoration Engine (.silisave).
 * 
 * Implements Stephen Jay Gould's "Replaying Life's Tape" (1989) and Richard Lenski's
 * LTEE -80°C frozen fossil resurrection architecture.
 * 
 * Features:
 * - Full world state preservation: ticks, 3D hex grid, basalt geology, hydrothermal vents,
 *   living cells (60-bit tapes, battery, age, generation, somatic syncytia, endosymbionts),
 *   recirculating carcasses, and buoyant pelagic spores.
 * - Closed-universe thermodynamic ledger preservation (ΔE = 0.000, ΔM = 0.000).
 * - Exact Mulberry32 PRNG bit-state preservation for 100% deterministic replays.
 * - Standalone .silisave JSON file export & drag-and-drop import.
 */

import { PoreMedium } from '../../core/domain/Pore.js';
import type { IPoreCellState } from '../../core/domain/PoreCell.js';
import type { IThermodynamicLedgerState } from '../../core/physics/ThermodynamicLedger.js';
import type { IGeologicalConfig } from '../environment/GeologicalPressuresEngine.js';
import type { SimulationWorld } from '../SimulationWorld.js';

export interface IStoredPoreCarcass {
  readonly energy: number;
  readonly matter: number;
  readonly decayTicksRemaining: number;
}

export interface IStoredPoreSpore {
  readonly id?: string;
  readonly parentId?: string | null;
  readonly cladeId?: string;
  readonly generation: number;
  readonly tape: string;
  readonly energy: number;
  readonly matter: number;
  readonly ticksRemaining: number;
}

export interface IStoredPoreData {
  readonly q: number;
  readonly r: number;
  readonly z: number;
  readonly medium: PoreMedium;
  readonly basalt: boolean;
  readonly cell?: IPoreCellState | null;
  readonly carcass?: IStoredPoreCarcass | null;
  readonly spore?: IStoredPoreSpore | null;
}

export interface ISimulationStateSnapshot {
  readonly format: 'silisave';
  readonly version: '1.0.0';
  readonly id: string;
  readonly branchId: string;
  readonly parentSnapshotId: string | null;
  readonly name: string;
  readonly notes: string;
  readonly timestamp: number;
  readonly tick: number;

  readonly world: {
    readonly radius: number;
    readonly minZ: number;
    readonly maxZ: number;
    readonly basaltDensity: number;
    readonly terrainRoughness: number;
    readonly soupDensity: number;
    readonly mutationRate: number;
    readonly duplicationRate: number;
    readonly deletionRate: number;
    readonly prngState: number;
    readonly ledger: IThermodynamicLedgerState;
    readonly vent: {
      readonly nozzleCoord: { q: number; r: number; z: number };
      readonly offshoots: readonly { q: number; r: number; z: number }[];
      readonly plumeWanderingEnabled: boolean;
      readonly regimeCyclingEnabled: boolean;
    };
    readonly geological: {
      readonly config: IGeologicalConfig;
    };
    readonly pores: readonly IStoredPoreData[];
  };

  readonly stats: {
    readonly livingCount: number;
    readonly carcassCount: number;
    readonly sporeCount: number;
    readonly activeCladesCount: number;
    readonly maxGeneration: number;
    readonly dominantTaxon: string;
    readonly totalStoredEnergy: number;
    readonly totalStoredMatter: number;
  };
}

export interface ISnapshotCaptureOptions {
  readonly branchId?: string;
  readonly parentSnapshotId?: string | null;
  readonly notes?: string;
}

export class SimulationSnapshotManager {
  private static instance: SimulationSnapshotManager | null = null;

  private constructor() {}

  public static getInstance(): SimulationSnapshotManager {
    if (!SimulationSnapshotManager.instance) {
      SimulationSnapshotManager.instance = new SimulationSnapshotManager();
    }
    return SimulationSnapshotManager.instance;
  }

  /**
   * Captures the full running simulation state from SimulationWorld.
   */
  public captureSnapshot(
    world: SimulationWorld,
    name: string,
    options?: ISnapshotCaptureOptions
  ): ISimulationStateSnapshot;
  public captureSnapshot(
    world: SimulationWorld,
    name: string,
    optionsOrBranchId?: ISnapshotCaptureOptions | string,
    parentSnapshotId?: string | null
  ): ISimulationStateSnapshot;
  public captureSnapshot(
    world: SimulationWorld,
    name: string,
    optionsOrBranchId?: ISnapshotCaptureOptions | string,
    parentSnapshotId?: string | null
  ): ISimulationStateSnapshot {
    let branchId = 'main';
    let parentId: string | null = null;
    let notes = '';

    if (optionsOrBranchId && typeof optionsOrBranchId === 'object') {
      branchId = optionsOrBranchId.branchId ?? 'main';
      parentId = optionsOrBranchId.parentSnapshotId ?? null;
      notes = optionsOrBranchId.notes ?? '';
    } else {
      if (typeof optionsOrBranchId === 'string') {
        branchId = optionsOrBranchId;
      }
      parentId = parentSnapshotId ?? null;
      if (arguments.length > 4 && typeof arguments[4] === 'string') {
        notes = arguments[4];
      }
    }

    return world.captureStateSnapshot(name, branchId, parentId, notes);
  }

  /**
   * Restores simulation state into SimulationWorld.
   */
  public restoreSnapshot(
    world: SimulationWorld,
    snapshot: ISimulationStateSnapshot,
    options?: {
      newPrngSeed?: number;
      volatilityMultiplier?: number;
      mutationMultiplier?: number;
    }
  ): void {
    world.restoreSimulationSnapshot(snapshot, options);
  }

  /**
   * Serializes a snapshot object into a formatted JSON string.
   */
  public serialize(snapshot: ISimulationStateSnapshot): string {
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Deserializes and validates a JSON string into a snapshot object.
   */
  public deserialize(jsonStr: string): ISimulationStateSnapshot {
    try {
      const parsed = JSON.parse(jsonStr) as ISimulationStateSnapshot;
      if (!parsed || parsed.format !== 'silisave') {
        throw new Error("Invalid simulation file: missing format marker 'silisave'.");
      }
      if (!parsed.world || !parsed.world.pores || !Array.isArray(parsed.world.pores)) {
        throw new Error('Invalid simulation file: missing world or pore lattice structures.');
      }
      if (!parsed.world.ledger) {
        throw new Error('Invalid simulation file: missing thermodynamic ledger state.');
      }
      return parsed;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse .silisave file: ${msg}`);
    }
  }

  private downloadHandler: ((filename: string, content: string, mimeType: string) => void) | null = null;

  /**
   * Sets the external file download handler (e.g. BrowserDownloadBridge in UI).
   */
  public setDownloadHandler(handler: ((filename: string, content: string, mimeType: string) => void) | null): void {
    this.downloadHandler = handler;
  }

  /**
   * Serializes snapshot and delegates file download to presentation layer without direct DOM references.
   */
  public exportToFile(snapshot: ISimulationStateSnapshot, filename?: string): string {
    const jsonStr = this.serialize(snapshot);
    const safeName = (filename || `${snapshot.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_t${snapshot.tick}.silisave`).trim();
    const downloadFilename = safeName.endsWith('.silisave') ? safeName : `${safeName}.silisave`;

    if (this.downloadHandler) {
      this.downloadHandler(downloadFilename, jsonStr, 'application/json');
    }

    return jsonStr;
  }

  /**
   * Imports a snapshot from a browser File, Blob, or raw string.
   */
  public async importFromFile(fileOrJson: File | Blob | string): Promise<ISimulationStateSnapshot> {
    if (typeof fileOrJson === 'string') {
      return this.deserialize(fileOrJson);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          const snapshot = this.deserialize(content);
          resolve(snapshot);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(fileOrJson);
    });
  }
}
