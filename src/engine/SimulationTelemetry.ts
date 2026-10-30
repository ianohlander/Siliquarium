/**
 * 🐠 Siliquarium Engine Subsystem
 * SimulationTelemetry: Decoupled flat data structs for UI and 3D rendering.
 * Provides GC-friendly snapshots of the world state without DOM overhead.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { PoreState } from '../core/domain/Pore.js';
import { ILedgerReport } from '../core/physics/ThermodynamicLedger.js';
import type { IMilestoneEvent } from './paleontology/DigitalPaleontologist.js';
import type { IGeologicalEventRecord, ITidalVector } from './environment/GeologicalPressuresEngine.js';
import type { ISpeciesTaxon } from '../core/paleontology/TaxonomyNomenclature.js';

export type { IGeologicalEventRecord, ITidalVector, ISpeciesTaxon };

export interface IPoreTelemetry {
  readonly coord: HexCoord3D;
  readonly state: PoreState;
  readonly isBasalt: boolean;
  readonly isAqueous: boolean;
  readonly energy: number;
  readonly matter: number;
  readonly age: number;
  readonly generation: number;
  readonly gateCount: number;
  readonly gateTypes: readonly string[];
  readonly hasSpore: boolean;
  readonly tapeBitstring: string;
  readonly catalyticYield: number;
  readonly toggleCount: number;
  readonly primaryActive: boolean;
  readonly id?: string;
  readonly parentId?: string | null;
  readonly cladeId?: string;
  readonly hasOrganelle?: boolean;
  readonly organelleTape?: string;
  readonly organelleGateTypes?: readonly string[];
  readonly isSyncytium?: boolean;
  readonly syncytiumId?: string;
  readonly syncytiumMemberCount?: number;
  readonly bodyTopology?: string;
  readonly isDifferentiated?: boolean;
  readonly hasSeptum?: boolean;
  readonly hasSporeAdaptation?: boolean;
  readonly speciesTaxon?: ISpeciesTaxon;
  readonly operonStates?: readonly boolean[];
  readonly expressedGateCount?: number;
  readonly repressedGateCount?: number;
  readonly expressionSignature?: string;
  readonly chelator?: number;
  readonly eps?: number;
}

export interface IVentTelemetry {
  readonly nozzleCoord: HexCoord3D;
  readonly offshootCoords?: readonly HexCoord3D[];
  readonly regimeName?: string;
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly streamC?: boolean;
  readonly streamD?: boolean;
  readonly photonIr?: boolean;
  readonly baroAcoustic?: boolean;
  readonly electroRedox?: boolean;
  readonly toxinT: boolean;
  readonly thermalFlux: number;
  readonly precursorWarning?: boolean;
  readonly conduitChoking?: number;
}

export interface IPredationEvent {
  readonly predatorCoord: HexCoord3D;
  readonly preyCoord: HexCoord3D;
  readonly energyDrained: number;
  readonly preyKilled?: boolean;
}

export interface IScavengeEvent {
  readonly scavengerCoord: HexCoord3D;
  readonly carcassCoord: HexCoord3D;
  readonly energyHarvested: number;
}

export interface ISporeEjectionEvent {
  readonly sourceCoord: HexCoord3D;
  readonly targetCoord: HexCoord3D;
}

export interface IEndosymbiosisEvent {
  readonly coordA: HexCoord3D;
  readonly coordB: HexCoord3D;
  readonly chimericCladeId: string;
}

export interface ISyntrophyEvent {
  readonly from: HexCoord3D;
  readonly to: HexCoord3D;
  readonly amount: number;
}

export interface IKleptoplastyEvent {
  readonly predatorCoord: HexCoord3D;
  readonly preyCoord: HexCoord3D;
}

export interface IChelationEvent {
  readonly coord: HexCoord3D;
  readonly matterYield: number;
}

export interface IDifferentiatedCellRole {
  readonly coord: HexCoord3D;
  readonly roleName: string;
  readonly expressionSignature: string;
  readonly primaryActive: boolean;
}

export interface ISyncytialColonyTelemetry {
  readonly colonyId: string;
  readonly cladeId: string;
  readonly memberCoords: readonly HexCoord3D[];
  readonly totalEnergy: number;
  readonly totalMatter: number;
  readonly bodyTopology: string;
  readonly isDifferentiated?: boolean;
  readonly distinctExpressionCount?: number;
  readonly differentiatedRoles?: readonly IDifferentiatedCellRole[];
}

export interface ICladeSummary {
  readonly cladeId: string;
  readonly population: number;
  readonly maxGeneration: number;
  readonly averageEnergy: number;
  readonly dominantMotif: string;
  readonly samplePoreCoord: HexCoord3D;
  readonly color: string;
}

export interface ISimulationTelemetry {
  readonly tick: number;
  readonly livingCount: number;
  readonly carcassCount: number;
  readonly emptyCount: number;
  readonly sporeCount: number;
  readonly totalEnergyInUniverse: number;
  readonly maxGeneration: number;
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
  readonly totalBirths: number;
  readonly evolutionaryVelocity?: number;
  readonly ledger: ILedgerReport;
  readonly vent: IVentTelemetry;
  readonly pores: readonly IPoreTelemetry[];
  readonly milestones: readonly IMilestoneEvent[];
  readonly predationEvents?: readonly IPredationEvent[];
  readonly scavengeEvents?: readonly IScavengeEvent[];
  readonly sporeEjections?: readonly ISporeEjectionEvent[];
  readonly endosymbiosisEvents?: readonly IEndosymbiosisEvent[];
  readonly syntrophyEvents?: readonly ISyntrophyEvent[];
  readonly kleptoplastyEvents?: readonly IKleptoplastyEvent[];
  readonly chelationEvents?: readonly IChelationEvent[];
  readonly macroSilicoidCount?: number;
  readonly syncytialColonies?: readonly ISyncytialColonyTelemetry[];
  readonly clades?: readonly ICladeSummary[];
  readonly activeGeologicalEvents?: readonly IGeologicalEventRecord[];
  readonly tidalVector?: ITidalVector;
}
