/**
 * 🐠 Siliquarium Paleontology Subsystem
 * DigitalPaleontologist: External Voltmeter & Evolutionary Milestone Auditor.
 * Audits network motifs, Weisfeiler-Lehman graph hashes, and fossil checkpoints with zero smuggling.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { IMotifDefinition, MotifType, NetworkMotifRegistry } from '../../core/paleontology/NetworkMotif.js';
import { EvolutionaryFlightRecorder } from './EvolutionaryFlightRecorder.js';
import { FossilFreezer, IFossilSnapshot } from './FossilFreezer.js';
import { Pore } from '../../core/domain/Pore.js';
import { ISimulationTelemetry } from '../SimulationTelemetry.js';

import { SiliquariumDB } from '../storage/SiliquariumDB.js';
import type { IMilestoneEvent, MilestoneCallback } from './IMilestoneEvent.js';

export type { IMilestoneEvent, MilestoneCallback };

export class DigitalPaleontologist {
  public static readonly MAX_IN_MEMORY_MILESTONES = 50;

  private readonly flightRecorder: EvolutionaryFlightRecorder;
  private readonly freezer: FossilFreezer;
  private readonly milestones: IMilestoneEvent[] = [];
  private readonly canonicalExemplars: Map<MotifType, IMilestoneEvent> = new Map();
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
      if (!cell || cell.getGeneration() === 0) continue;

      const matches = cell.getMotifMatches();
      if (matches.length > 0) {
        const wlHash = cell.getWlHash();

        for (const m of matches) {
          const key = `${m.motif.type}:${wlHash}`;
          if (!this.seenMotifHashes.has(key)) {
            this.seenMotifHashes.add(key);

            const event = this.createMilestoneEvent(tick, pore.coord, m.motif, wlHash);
            this.recordMilestone(event, telemetry);
            discovered.push(event);
          }
        }
      }

      // Audit Endosymbiotic Organelle Emergence (Lynn Margulis Homage)
      if (cell.hasOrganelle()) {
        const oGates = cell.getOrganelleWorkshop()?.getGates().map(g => g.type).sort().join(',') || 'PRIMARY';
        const key = `ENDOSYMBIONT_EMERGENCE:${oGates}`;
        if (!this.seenMotifHashes.has(key)) {
          this.seenMotifHashes.add(key);
          const organelleDef = NetworkMotifRegistry.getDefinition(MotifType.ENDOSYMBIONT_EMERGENCE);
          const wlHash = `ENDO-${oGates.slice(0, 8)}`;
          const event = this.createMilestoneEvent(tick, pore.coord, organelleDef, wlHash);
          this.recordMilestone(event, telemetry);
          discovered.push(event);
        }
      }
    }

    // Audit Syncytial Multicellularity (Macro-Silicoids)
    if (telemetry.syncytialColonies && telemetry.syncytialColonies.length > 0) {
      for (const col of telemetry.syncytialColonies) {
        const sizeBracket = col.memberCoords.length >= 6 ? 'MACRO' : 'MICRO';
        const key = `SYNCYTIAL_MULTICELLULARITY:${col.bodyTopology}:${sizeBracket}`;
        if (!this.seenMotifHashes.has(key)) {
          this.seenMotifHashes.add(key);
          const syncDef = NetworkMotifRegistry.getDefinition(MotifType.SYNCYTIAL_MULTICELLULARITY);
          const event = this.createMilestoneEvent(tick, col.memberCoords[0], syncDef, `SYNC-${col.bodyTopology.slice(0, 4)}-${sizeBracket}`);
          this.recordMilestone(event, telemetry);
          discovered.push(event);
        }
      }
    }

    // Audit Pelagic Sporulation & Dispersal Emergence (John Tyler Bonner 1965, Richard Dawkins 1982)
    if (telemetry.sporeEjections && telemetry.sporeEjections.length > 0) {
      for (const ej of telemetry.sporeEjections) {
        const pore = pores.find(p => p.coord.equals(ej.sourceCoord));
        const cell = pore?.getResident();
        if (cell && cell.getGeneration() > 0 && cell.hasSporeAdaptation()) {
          const key = `PELAGIC_SPORULATION_EMERGENCE:ADAPTED`;
          if (!this.seenMotifHashes.has(key)) {
            this.seenMotifHashes.add(key);
            const sporeDef = NetworkMotifRegistry.getDefinition(MotifType.PELAGIC_SPORULATION_EMERGENCE);
            const event = this.createMilestoneEvent(tick, ej.sourceCoord, sporeDef, 'SPORE-PELAGIC-DISPERSAL');
            this.recordMilestone(event, telemetry);
            discovered.push(event);
          }
        }
      }
    }

    // Audit Lenski Cit+ Substrate C Breakthrough
    for (const pore of pores) {
      const cell = pore.getResident();
      if (cell && cell.getGeneration() > 0 && cell.getLastTickResult()?.telemetry.streamCIngested) {
        const key = `LENSKI_CIT_BREAKTHROUGH:ACTIVE`;
        if (!this.seenMotifHashes.has(key)) {
          this.seenMotifHashes.add(key);
          const citDef = NetworkMotifRegistry.getDefinition(MotifType.LENSKI_CIT_BREAKTHROUGH);
          const event = this.createMilestoneEvent(tick, pore.coord, citDef, `CIT-PLUS-${cell.getCladeId()}`);
          this.recordMilestone(event, telemetry);
          discovered.push(event);
        }
      }
    }

    // Audit Siderophore Basalt Mineral Chelation Discovery
    if (telemetry.chelationEvents && telemetry.chelationEvents.length > 0) {
      const key = `MINERAL_CHELATION_DISCOVERY:OCCURRED`;
      if (!this.seenMotifHashes.has(key)) {
        this.seenMotifHashes.add(key);
        const chelDef = NetworkMotifRegistry.getDefinition(MotifType.MINERAL_CHELATION_DISCOVERY);
        const event = this.createMilestoneEvent(tick, telemetry.chelationEvents[0].coord, chelDef, 'SIDEROPHORE-CHELATION');
        this.recordMilestone(event, telemetry);
        discovered.push(event);
      }
    }

    // Audit Biofilm Viscoelastic EPS Matrix Secretion
    for (const pore of pores) {
      if (pore.getEps() >= 1.0) {
        const key = `BIOFILM_EPS_SHIELD:ACCUMULATED`;
        if (!this.seenMotifHashes.has(key)) {
          this.seenMotifHashes.add(key);
          const epsDef = NetworkMotifRegistry.getDefinition(MotifType.BIOFILM_EPS_SHIELD);
          const event = this.createMilestoneEvent(tick, pore.coord, epsDef, 'BIOFILM-EPS-MATRIX');
          this.recordMilestone(event, telemetry);
          discovered.push(event);
        }
      }
    }

    // Audit Paracrine Syntrophy & Direct Cross-Feeding (DIET)
    if (telemetry.syntrophyEvents && telemetry.syntrophyEvents.length > 0) {
      const key = `SYNTROPHIC_CROSS_FEEDING:TRANSFERRED`;
      if (!this.seenMotifHashes.has(key)) {
        this.seenMotifHashes.add(key);
        const synDef = NetworkMotifRegistry.getDefinition(MotifType.SYNTROPHIC_CROSS_FEEDING);
        const event = this.createMilestoneEvent(tick, telemetry.syntrophyEvents[0].from, synDef, 'PARACRINE-SYNTROPHY-DIET');
        this.recordMilestone(event, telemetry);
        discovered.push(event);
      }
    }

    // Audit Vampiric Kleptoplasty (Predatory Organelle Robbery)
    if (telemetry.kleptoplastyEvents && telemetry.kleptoplastyEvents.length > 0) {
      const key = `VAMPIRIC_KLEPTOPLASTY:ASSIMILATED`;
      if (!this.seenMotifHashes.has(key)) {
        this.seenMotifHashes.add(key);
        const klepDef = NetworkMotifRegistry.getDefinition(MotifType.VAMPIRIC_KLEPTOPLASTY);
        const event = this.createMilestoneEvent(tick, telemetry.kleptoplastyEvents[0].predatorCoord, klepDef, 'VAMPIRIC-KLEPTOPLASTY');
        this.recordMilestone(event, telemetry);
        discovered.push(event);
      }
    }

    // Periodic fossil freezing
    if (tick > 0 && tick % FossilFreezer.DEFAULT_CHECKPOINT_INTERVAL === 0) {
      this.freezer.freeze(tick, telemetry.pores, 'PERIODIC_CHECKPOINT');
    }

    return discovered;
  }

  private createMilestoneEvent(
    tick: number,
    poreCoord: HexCoord3D,
    motif: IMotifDefinition,
    wlHash: string
  ): IMilestoneEvent {
    return {
      id: `milestone-${this.milestoneCounter++}`,
      tick,
      poreCoord,
      motif,
      wlHash,
      origin: 'DE_NOVO'
    };
  }

  private recordMilestone(event: IMilestoneEvent, telemetry: ISimulationTelemetry): void {
    // Preserve canonical archetype exemplar permanently
    if (!this.canonicalExemplars.has(event.motif.type)) {
      this.canonicalExemplars.set(event.motif.type, event);
    }

    // Bounded in-memory ring buffer
    this.milestones.push(event);
    if (this.milestones.length > DigitalPaleontologist.MAX_IN_MEMORY_MILESTONES) {
      this.milestones.shift();
    }

    // Notify live listeners & freeze milestone snapshot
    this.notifyMilestone(event);
    this.freezer.freeze(event.tick, telemetry.pores, `MILESTONE: ${event.motif.name}`);

    // Asynchronously stream to IndexedDB cold storage
    SiliquariumDB.getInstance().saveMilestone({
      id: event.id,
      tick: event.tick,
      motifType: event.motif.type,
      motifName: event.motif.name,
      biologicalCognate: event.motif.biologicalCognate,
      naturalFunction: event.motif.naturalFunction,
      citation: event.motif.citation,
      wlHash: event.wlHash,
      origin: event.origin,
      poreCoord: { q: event.poreCoord.q, r: event.poreCoord.r, z: event.poreCoord.z },
      timestamp: Date.now()
    }).catch(() => {});
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
    // Combine canonical exemplars with recent ring buffer, deduplicated by ID and sorted by tick
    const map = new Map<string, IMilestoneEvent>();
    for (const ex of this.canonicalExemplars.values()) {
      map.set(ex.id, ex);
    }
    for (const m of this.milestones) {
      map.set(m.id, m);
    }
    return Array.from(map.values()).sort((a, b) => a.tick - b.tick);
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
