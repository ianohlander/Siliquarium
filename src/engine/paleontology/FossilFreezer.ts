/**
 * 🐠 Siliquarium Engine Subsystem
 * FossilFreezer: The Lenski -80°C Evolutionary Archive.
 * Periodically freezes living populations and performs counterfactual single-bit autopsies.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { IPoreTelemetry } from '../SimulationTelemetry.js';

export interface IFossilRecord {
  readonly coord: HexCoord3D;
  readonly tape: string;
  readonly energy: number;
  readonly matter: number;
  readonly generation: number;
  readonly age: number;
}

export interface IFossilSnapshot {
  readonly id: string;
  readonly tick: number;
  readonly reason: string;
  readonly fossils: readonly IFossilRecord[];
}

export interface IBitMutationAutopsy {
  readonly bitIndex: number;
  readonly codonIndex: number;
  readonly parentBit: '0' | '1';
  readonly childBit: '0' | '1';
}

export class FossilFreezer {
  public static readonly DEFAULT_CHECKPOINT_INTERVAL = 100;
  private readonly snapshots: Map<string, IFossilSnapshot> = new Map();
  private snapshotCounter: number = 1;

  public freeze(tick: number, pores: readonly IPoreTelemetry[], reason: string = 'CHECKPOINT'): IFossilSnapshot {
    const livingFossils: IFossilRecord[] = [];

    for (const p of pores) {
      if (p.state === 'OCCUPIED' && p.tapeBitstring.length >= 60) {
        livingFossils.push({
          coord: p.coord,
          tape: p.tapeBitstring,
          energy: p.energy,
          matter: p.matter,
          generation: p.generation,
          age: p.age
        });
      }
    }

    const id = `fossil-snap-${this.snapshotCounter++}-t${tick}`;
    const snapshot: IFossilSnapshot = {
      id,
      tick,
      reason,
      fossils: livingFossils
    };

    this.snapshots.set(id, snapshot);
    return snapshot;
  }

  public getSnapshot(id: string): IFossilSnapshot | undefined {
    return this.snapshots.get(id);
  }

  public getAllSnapshots(): readonly IFossilSnapshot[] {
    return Array.from(this.snapshots.values()).sort((a, b) => a.tick - b.tick);
  }

  public static counterfactualAutopsy(parentTape: string, childTape: string): IBitMutationAutopsy[] {
    const autopsies: IBitMutationAutopsy[] = [];
    const len = Math.min(parentTape.length, childTape.length);

    for (let i = 0; i < len; i++) {
      const pBit = parentTape.charAt(i) as '0' | '1';
      const cBit = childTape.charAt(i) as '0' | '1';
      if (pBit !== cBit) {
        autopsies.push({
          bitIndex: i,
          codonIndex: Math.floor(i / 6),
          parentBit: pBit,
          childBit: cBit
        });
      }
    }

    return autopsies;
  }

  public count(): number {
    return this.snapshots.size;
  }

  public clear(): void {
    this.snapshots.clear();
    this.snapshotCounter = 1;
  }
}
