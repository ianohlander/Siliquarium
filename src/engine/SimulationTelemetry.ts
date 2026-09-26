/**
 * 🐠 Siliquarium Engine Subsystem
 * SimulationTelemetry: Decoupled flat data structs for UI and 3D rendering.
 * Provides GC-friendly snapshots of the world state without DOM overhead.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { PoreState } from '../core/domain/Pore.js';
import { ILedgerReport } from '../core/physics/ThermodynamicLedger.js';
import type { IMilestoneEvent } from './paleontology/DigitalPaleontologist.js';

export interface IPoreTelemetry {
  readonly coord: HexCoord3D;
  readonly state: PoreState;
  readonly isBasalt: boolean;
  readonly energy: number;
  readonly matter: number;
  readonly age: number;
  readonly generation: number;
  readonly gateCount: number;
  readonly tapeBitstring: string;
  readonly catalyticYield: number;
  readonly toggleCount: number;
  readonly primaryActive: boolean;
}

export interface IVentTelemetry {
  readonly nozzleCoord: HexCoord3D;
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly toxinT: boolean;
  readonly thermalFlux: number;
}

export interface ISimulationTelemetry {
  readonly tick: number;
  readonly livingCount: number;
  readonly carcassCount: number;
  readonly emptyCount: number;
  readonly totalEnergyInUniverse: number;
  readonly ledger: ILedgerReport;
  readonly vent: IVentTelemetry;
  readonly pores: readonly IPoreTelemetry[];
  readonly milestones: readonly IMilestoneEvent[];
}
