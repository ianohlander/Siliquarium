/**
 * 🐠 Siliquarium Paleontology Subsystem
 * EvolutionaryHistoryExporter: Comprehensive Flight Log & Diagnostics Exporter.
 * 
 * Records longitudinal evolutionary time-series, audits macro-evolutionary barriers,
 * and serializes complete population censuses and LTEE milestones into JSON and CSV.
 * Zero-DOM Mandate: 100% headless, testable in Node.js and Web Workers.
 */

import { SimulationWorld } from '../SimulationWorld.js';
import { ISimulationTelemetry } from '../SimulationTelemetry.js';
import { PoreState } from '../../core/domain/Pore.js';
import { SiliquariumDB } from '../storage/SiliquariumDB.js';
import { EvolutionaryBarrierAuditor, IBarrierDiagnostic } from './EvolutionaryBarrierAuditor.js';
import { FlightLogFormatter } from './FlightLogFormatter.js';

export type { IBarrierDiagnostic };

export interface IEpochSample {
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

export interface IEvolutionaryFlightLog {
  readonly metadata: {
    readonly exportTimestamp: string;
    readonly simulationTick: number;
    readonly maxGeneration: number;
    readonly softwareVersion: string;
    readonly totalEpochsSampled: number;
    readonly runSummary: string;
  };
  readonly diagnostics: readonly IBarrierDiagnostic[];
  readonly timeSeries: readonly IEpochSample[];
  readonly milestones: readonly {
    readonly id: string;
    readonly tick: number;
    readonly motifName: string;
    readonly biologicalCognate: string;
    readonly wlHash: string;
    readonly origin: string;
    readonly coord: { q: number; r: number; z: number };
  }[];
  readonly clades: readonly {
    readonly cladeId: string;
    readonly population: number;
    readonly maxGeneration: number;
    readonly averageEnergy: number;
    readonly taxonName: string;
    readonly color: string;
  }[];
  readonly currentCensus: readonly {
    readonly coord: { q: number; r: number; z: number };
    readonly cellId?: string;
    readonly cladeId?: string;
    readonly syncytiumId?: string;
    readonly syncytiumSize?: number;
    readonly generation: number;
    readonly age: number;
    readonly energy: number;
    readonly matter: number;
    readonly tapeLength: number;
    readonly gateCount: number;
    readonly gateTypes: readonly string[];
    readonly taxon: string;
    readonly hasOrganelle: boolean;
    readonly catalyticYield: number;
    readonly toggleCount: number;
  }[];
}

export class EvolutionaryHistoryTracker {
  private readonly samples: IEpochSample[] = [];
  private sampleInterval: number = 250; // Record every 250 ticks
  private maxSamples: number = 4000;    // Cap to prevent memory bloat over multi-million tick runs

  constructor(sampleInterval: number = 250) {
    this.sampleInterval = sampleInterval;
  }

  public recordTick(_world: SimulationWorld, telemetry: ISimulationTelemetry): void {
    if (telemetry.tick % this.sampleInterval !== 0) return;

    // Subsample / decimate if history exceeds max capacity to preserve RAM
    if (this.samples.length >= this.maxSamples) {
      this.decimate();
    }

    const occupiedPores = telemetry.pores.filter(p => p.state === PoreState.OCCUPIED);
    let totalTapeLen = 0;
    let maxTapeLen = 0;
    let totalGates = 0;
    let maxGates = 0;

    for (const p of occupiedPores) {
      const len = p.tapeBitstring ? p.tapeBitstring.length : 0;
      totalTapeLen += len;
      if (len > maxTapeLen) maxTapeLen = len;
      totalGates += p.gateCount;
      if (p.gateCount > maxGates) maxGates = p.gateCount;
    }

    const living = occupiedPores.length;
    const meanTapeLength = living > 0 ? Math.round((totalTapeLen / living) * 10) / 10 : 0;
    const meanGateCount = living > 0 ? Math.round((totalGates / living) * 10) / 10 : 0;

    let syncCount = 0;
    let maxSyncSize = 0;
    if (telemetry.syncytialColonies) {
      syncCount = telemetry.syncytialColonies.length;
      for (const col of telemetry.syncytialColonies) {
        if (col.memberCoords.length > maxSyncSize) {
          maxSyncSize = col.memberCoords.length;
        }
      }
    }

    const dominantClade = telemetry.clades && telemetry.clades.length > 0 ? telemetry.clades[0] : null;
    const dominantTaxon = dominantClade ? dominantClade.dominantMotif : 'Unknown';

    const sampleRecord: IEpochSample = {
      tick: telemetry.tick,
      maxGeneration: telemetry.maxGeneration,
      livingCount: telemetry.livingCount,
      sporeCount: telemetry.sporeCount,
      carcassCount: telemetry.carcassCount,
      activeCladesCount: telemetry.activeCladesCount,
      shannonDiversity: telemetry.shannonDiversity,
      totalBirths: telemetry.totalBirths,
      totalDeaths: telemetry.ledger ? (telemetry.totalBirths - telemetry.livingCount) : 0,
      evolutionaryVelocity: telemetry.evolutionaryVelocity ?? 0,
      meanTapeLength,
      maxTapeLength: maxTapeLen,
      meanGateCount,
      maxGateCount: maxGates,
      syncytialColonyCount: syncCount,
      maxSyncytialColonySize: maxSyncSize,
      totalEnergyInUniverse: telemetry.totalEnergyInUniverse,
      dominantTaxon
    };

    this.samples.push(sampleRecord);
    SiliquariumDB.getInstance().saveEpochSample(sampleRecord).catch(() => {});
  }

  private decimate(): void {
    // Keep every second point to double the timespan while halving sample count
    const halved: IEpochSample[] = [];
    for (let i = 0; i < this.samples.length; i += 2) {
      halved.push(this.samples[i]);
    }
    this.samples.length = 0;
    this.samples.push(...halved);
    this.sampleInterval *= 2;
  }

  public getSamples(): readonly IEpochSample[] {
    return this.samples;
  }

  public clear(): void {
    this.samples.length = 0;
  }

  /**
   * Generates a forensic diagnostic audit of evolutionary impediments and barriers.
   */
  public auditBarriers(world: SimulationWorld, telemetry: ISimulationTelemetry): IBarrierDiagnostic[] {
    return EvolutionaryBarrierAuditor.auditBarriers(world, telemetry);
  }

  /**
   * Generates a complete, structured JSON export payload.
   */
  public generateJSON(world: SimulationWorld, telemetry: ISimulationTelemetry): string {
    return FlightLogFormatter.toJSON(world, telemetry, this.samples);
  }

  /**
   * Generates a flat CSV string for spreadsheet analysis or Python plotting.
   */
  public generateCSV(): string {
    return FlightLogFormatter.toCSV(this.samples);
  }

  private downloadHandler: ((filename: string, content: string, mimeType: string) => void) | null = null;

  /**
   * Sets the external file download handler (e.g. BrowserDownloadBridge in UI).
   */
  public setDownloadHandler(handler: ((filename: string, content: string, mimeType: string) => void) | null): void {
    this.downloadHandler = handler;
  }

  /**
   * Delegates file download to presentation layer without direct DOM references.
   */
  public triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
    if (this.downloadHandler) {
      this.downloadHandler(filename, content, mimeType);
    }
  }
}
