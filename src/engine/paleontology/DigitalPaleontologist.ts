/**
 * 🐠 Siliquarium Paleontology Subsystem
 * DigitalPaleontologist: External Voltmeter & Evolutionary Milestone Auditor.
 * Audits network motifs, Weisfeiler-Lehman graph hashes, and fossil checkpoints with zero smuggling.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { IMotifDefinition } from '../../core/paleontology/NetworkMotif.js';
import { MotifScanner } from '../../core/paleontology/MotifScanner.js';
import { WeisfeilerLehmanHasher } from '../../core/paleontology/WeisfeilerLehmanHasher.js';
import { EvolutionaryFlightRecorder } from './EvolutionaryFlightRecorder.js';
import { FossilFreezer, IFossilSnapshot } from './FossilFreezer.js';
import { Pore } from '../../core/domain/Pore.js';
import { ISimulationTelemetry } from '../SimulationTelemetry.js';

export interface IMilestoneEvent {
  readonly id: string;
  readonly tick: number;
  readonly poreCoord: HexCoord3D;
  readonly motif: IMotifDefinition;
  readonly wlHash: string;
  readonly origin: 'HOMOLOGY' | 'HOMOPLASY' | 'DE_NOVO';
}

export type MilestoneCallback = (event: IMilestoneEvent) => void;

export class DigitalPaleontologist {
  private readonly flightRecorder: EvolutionaryFlightRecorder;
  private readonly freezer: FossilFreezer;
  private readonly milestones: IMilestoneEvent[] = [];
  private readonly seenMotifHashes: Set<string> = new Set();
  private readonly listeners: Set<MilestoneCallback> = new Set();

  private milestoneCounter: number = 1;

  constructor(flightRecorder?: EvolutionaryFlightRecorder, freezer?: FossilFreezer) {
    this.flightRecorder = flightRecorder ?? new EvolutionaryFlightRecorder();
    this.freezer = freezer ?? new FossilFreezer();
  }

  public auditPores(pores: readonly Pore[], tick: number, telemetry: ISimulationTelemetry): IMilestoneEvent[] {
    const discovered: IMilestoneEvent[] = [];

    for (const pore of pores) {
      const cell = pore.getResident();
      if (!cell) continue;

      const workshop = cell.getWorkshop();
      const matches = MotifScanner.scanWorkshop(workshop);
      if (matches.length === 0) continue;

      const wlHash = WeisfeilerLehmanHasher.hashNetlist(workshop.getGates());

      for (const m of matches) {
        const key = `${m.motif.type}:${wlHash}`;
        if (!this.seenMotifHashes.has(key)) {
          this.seenMotifHashes.add(key);

          const event: IMilestoneEvent = {
            id: `milestone-${this.milestoneCounter++}`,
            tick,
            poreCoord: pore.coord,
            motif: m.motif,
            wlHash,
            origin: 'DE_NOVO'
          };

          this.milestones.push(event);
          discovered.push(event);
          this.notifyMilestone(event);
          this.freezer.freeze(tick, telemetry.pores, `MILESTONE: ${m.motif.name}`);
        }
      }
    }

    // Periodic fossil freezing
    if (tick > 0 && tick % FossilFreezer.DEFAULT_CHECKPOINT_INTERVAL === 0) {
      this.freezer.freeze(tick, telemetry.pores, 'PERIODIC_CHECKPOINT');
    }

    return discovered;
  }

  public onMilestone(cb: MilestoneCallback): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyMilestone(event: IMilestoneEvent): void {
    for (const cb of this.listeners) {
      cb(event);
    }
  }

  public getMilestones(): readonly IMilestoneEvent[] {
    return this.milestones;
  }

  public getFlightRecorder(): EvolutionaryFlightRecorder {
    return this.flightRecorder;
  }

  public getFreezer(): FossilFreezer {
    return this.freezer;
  }

  public getFossilSnapshots(): readonly IFossilSnapshot[] {
    return this.freezer.getAllSnapshots();
  }
}
