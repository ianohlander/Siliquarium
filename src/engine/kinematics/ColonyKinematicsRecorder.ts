/**
 * 🐠 Siliquarium Kinematics Subsystem
 * ColonyKinematicsRecorder: Longitudinal Macro-Movement Tracker & A-B Loop Playback Engine.
 * 
 * Captures whole-body organismal centroids, velocities, behavioral classifications,
 * trophic feeding siphons, and treadmilling streaming/apoptosis events across time.
 * Supports A-B loop playback, histological staining switches, and lineage tagging.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { PoreState } from '../../core/domain/Pore.js';
import { ISimulationTelemetry, IPoreTelemetry } from '../SimulationTelemetry.js';
import { ITreadmillingEvent } from './TreadmillingEngine.js';

export interface IKinematicCellSnapshot {
  readonly coord: HexCoord3D;
  readonly energy: number;
  readonly matter: number;
  readonly roleName: string;
  readonly roleColor: string;
  readonly roleGlyph: string;
  readonly gateCount: number;
  readonly gateTypes: readonly string[];
  readonly tapeBitstring: string;
  readonly primaryActive: boolean;
  readonly hasOrganelle: boolean;
  readonly hasSpore: boolean;
  readonly operonStates: readonly boolean[];
  readonly chelator?: number;
  readonly eps?: number;
}

export type KinematicBehavior =
  | 'CHEMOTACTIC_ADVANCE'
  | 'THERMAL_EVASION'
  | 'PREDATORY_ENCIRCLE'
  | 'FORAGING_SEARCH'
  | 'SESSILE_ANCHOR';

export interface IKinematicBody {
  readonly bodyId: string;
  readonly cladeId: string;
  readonly speciesName: string;
  readonly isMulticellularDifferentiated: boolean;
  readonly isClonalColony: boolean;
  readonly clusterIndex: number;
  readonly organismId: string;
  readonly bodyTopology: string;
  readonly color: string;
  readonly centroid: { x: number; y: number; z: number };
  readonly velocity: { vx: number; vy: number; vz: number };
  readonly speed: number;
  readonly heading: number;
  readonly behavior: KinematicBehavior;
  readonly cells: readonly IKinematicCellSnapshot[];
  readonly slimeTrail: readonly { x: number; y: number; z: number; tick: number }[];
  readonly isEncircling: boolean;
  readonly encircledCladeId?: string;
}

export interface ITrophicRay {
  readonly type: 'predation' | 'vent_feed' | 'scavenge' | 'parasite' | 'syntrophy' | 'kleptoplasty' | 'chelation';
  readonly sourceCoord: HexCoord3D;
  readonly targetCoord: HexCoord3D;
  readonly energy: number;
  readonly color: string;
}

export interface IStreamingChevron {
  readonly fromCoord: HexCoord3D;
  readonly toCoord: HexCoord3D;
  readonly tokens: number;
  readonly color: string;
}

export interface IApoptosisHalo {
  readonly coord: HexCoord3D;
  readonly energyResorbed: number;
  readonly tick: number;
  readonly color: string;
}

export interface IKinematicFrame {
  readonly tick: number;
  readonly timestamp: number;
  readonly environmentalEvent: string | null;
  readonly vent: {
    readonly nozzleCoord: HexCoord3D;
    readonly streamA: boolean;
    readonly streamB: boolean;
    readonly toxinT: boolean;
    readonly thermalFlux: number;
    readonly precursorWarning: boolean;
    readonly conduitChoking: number;
  };
  readonly bodies: readonly IKinematicBody[];
  readonly trophicRays: readonly ITrophicRay[];
  readonly streamingChevrons: readonly IStreamingChevron[];
  readonly apoptosisHalos: readonly IApoptosisHalo[];
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
}

export type HistologicalStain = 'morphology' | 'grn' | 'vascular' | 'battery';

export type LensViewMode = 'lattice' | 'plasmodium' | 'vascular' | 'potential' | 'hybrid';

export class ColonyKinematicsRecorder {
  private readonly frames: IKinematicFrame[] = [];
  private readonly maxFrames: number = 600; // Rolling in-memory history buffer
  private readonly bodyHistoricalTrails: Map<string, { x: number; y: number; z: number; tick: number }[]> = new Map();
  private readonly lastBodyCentroids: Map<string, { x: number; y: number; z: number }> = new Map();

  // Playback State
  public isPlaying: boolean = false;
  public currentFrameIndex: number = 0;
  public playbackSpeed: number = 1; // 1, 2, 5, 10, 20
  public isLooping: boolean = false;
  public loopStartFrame: number = 0;
  public loopEndFrame: number = 0;
  public pinnedLineageId: string | null = null;
  public pinnedBodyId: string | null = null;
  public isLineageIsolation: boolean = false;
  public currentStain: HistologicalStain = 'morphology';
  public currentLensMode: LensViewMode = 'hybrid';

  // Visual Overlay Toggles
  public overlayToggles = {
    trophicRays: true,
    slimeStreaming: true,
    apoptosisHalos: true,
    ghostTrails: true,
    speciesBadges: false // Default false: zero floating text cards on start!
  };

  private static readonly PALETTE = [
    '#06b6d4', // Electric Cyan
    '#10b981', // Bioluminescent Emerald
    '#f59e0b', // Molten Amber
    '#f43f5e', // Coral Crimson
    '#8b5cf6', // Velvet Violet
    '#ec4899', // Neon Rose
    '#3b82f6', // Cobalt Blue
    '#eab308', // Solar Gold
    '#14b8a6', // Abyssal Teal
    '#a855f7'  // Deep Orchid
  ];

  public static getSpeciesColor(cladeId: string): string {
    let hash = 0;
    for (let i = 0; i < cladeId.length; i++) {
      hash = ((hash << 5) - hash + cladeId.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % ColonyKinematicsRecorder.PALETTE.length;
    return ColonyKinematicsRecorder.PALETTE[idx];
  }

  /**
   * Records a snapshot of all active macro-silicoid bodies, trophic interactions,
   * and treadmilling streaming/apoptosis events from the live simulation tick.
   */
  public recordFrame(
    telemetry: ISimulationTelemetry,
    treadmillingEvents: readonly ITreadmillingEvent[] = []
  ): IKinematicFrame {
    // 1. Group occupied pores by clade / syncytium to form macroscopic bodies
    const cladeMap = new Map<string, IPoreTelemetry[]>();
    for (const pore of telemetry.pores) {
      if (pore.state === PoreState.OCCUPIED) {
        const key = pore.cladeId || 'ancestral';
        let list = cladeMap.get(key);
        if (!list) {
          list = [];
          cladeMap.set(key, list);
        }
        list.push(pore);
      }
    }

    const bodies: IKinematicBody[] = [];
    const ventNozzle = telemetry.vent.nozzleCoord;

    for (const [cladeId, cladePores] of cladeMap.entries()) {
      if (cladePores.length === 0) continue;

      const poreKeyMap = new Map<string, IPoreTelemetry>();
      for (const p of cladePores) {
        poreKeyMap.set(p.coord.toKey(), p);
      }

      const visited = new Set<string>();
      const clusters: IPoreTelemetry[][] = [];

      for (const p of cladePores) {
        const pKey = p.coord.toKey();
        if (visited.has(pKey)) continue;

        const cluster: IPoreTelemetry[] = [];
        const queue: IPoreTelemetry[] = [p];
        visited.add(pKey);

        while (queue.length > 0) {
          const cur = queue.shift()!;
          cluster.push(cur);

          for (const nbCoord of cur.coord.getPlanarNeighbors()) {
            const nbKey = nbCoord.toKey();
            if (!visited.has(nbKey) && poreKeyMap.has(nbKey)) {
              visited.add(nbKey);
              queue.push(poreKeyMap.get(nbKey)!);
            }
          }
        }
        clusters.push(cluster);
      }

      // Process each physically contiguous cluster as an individual organism/body
      clusters.forEach((clusterPores, clusterIdx) => {
        const bodyId = `${cladeId}_c${clusterIdx}`;
        const organismId = `${cladeId}#${clusterIdx + 1}`;

        // Calculate continuous 3D world centroid for this contiguous cluster
        let sumX = 0, sumY = 0, sumZ = 0;
        for (const p of clusterPores) {
          const hex = p.coord;
          const wx = hex.q * Math.sqrt(3) + (hex.r * Math.sqrt(3)) / 2;
          const wy = hex.r * 1.5;
          const wz = hex.z * 1.2;
          sumX += wx;
          sumY += wy;
          sumZ += wz;
        }
        const centroid = {
          x: sumX / clusterPores.length,
          y: sumY / clusterPores.length,
          z: sumZ / clusterPores.length
        };

        // Velocity calculation from previous frame of this specific bodyId
        const lastCentroid = this.lastBodyCentroids.get(bodyId);
        let vx = 0, vy = 0, vz = 0;
        if (lastCentroid) {
          vx = centroid.x - lastCentroid.x;
          vy = centroid.y - lastCentroid.y;
          vz = centroid.z - lastCentroid.z;
        }
        this.lastBodyCentroids.set(bodyId, centroid);

        const rawSpeed = Math.sqrt(vx * vx + vy * vy);
        // Dampen spurious velocity jumps: if displacement > 4 units in 1 tick, treat as cluster reshape
        const speed = rawSpeed > 4.0 ? 0 : rawSpeed;
        const heading = speed > 0.01 ? Math.atan2(vy, vx) : 0;

        // Slime Trail update (FIFO buffer)
        let trail = this.bodyHistoricalTrails.get(bodyId);
        if (!trail) {
          trail = [];
          this.bodyHistoricalTrails.set(bodyId, trail);
        }
        trail.push({ ...centroid, tick: telemetry.tick });
        if (trail.length > 25) {
          trail.shift();
        }

        // Check differentiation & roles
        const signatures = new Set<string>();
        const roles = new Set<string>();
        const cells: IKinematicCellSnapshot[] = [];
        for (const p of clusterPores) {
          const sig = p.expressionSignature || '0';
          signatures.add(sig);

          let roleName = 'Metabolic Unit';
          let roleColor = '#38bdf8';
          let roleGlyph = '💎';

          const distToVent = p.coord.distanceTo(ventNozzle);
          const hasNot = p.gateTypes.includes('GATE_NOT');
          const hasAnd = p.gateTypes.includes('GATE_AND');
          const hasOr = p.gateTypes.includes('GATE_OR');
          const hasCompositeParity = hasAnd && hasOr && hasNot;

          if (p.primaryActive && distToVent <= 2) {
            roleName = 'Trophocyte (Feeding Tendril)';
            roleColor = '#f59e0b';
            roleGlyph = '🌾';
          } else if (hasNot) {
            roleName = 'Somatic Shield (Protective Cuticle)';
            roleColor = '#f43f5e';
            roleGlyph = '🛡️';
          } else if (hasCompositeParity || (hasAnd && distToVent <= 3)) {
            roleName = 'Pacemaker Oscillator (Sensory Pole)';
            roleColor = '#06b6d4';
            roleGlyph = '⚡';
          } else {
            roleName = 'Basalt Anchor (Storage Thorax)';
            roleColor = '#10b981';
            roleGlyph = '⚓';
          }
          roles.add(roleName);

          cells.push({
            coord: p.coord,
            energy: p.energy,
            matter: p.matter,
            roleName,
            roleColor,
            roleGlyph,
            gateCount: p.gateCount,
            gateTypes: p.gateTypes,
            tapeBitstring: p.tapeBitstring,
            primaryActive: p.primaryActive,
            hasOrganelle: p.hasOrganelle ?? false,
            hasSpore: p.hasSpore ?? false,
            operonStates: p.operonStates ?? [],
            chelator: p.chelator ?? 0,
            eps: p.eps ?? 0
          });
        }

        // True multicellularity requires contiguous spatial cluster >= 3 cells AND >= 2 distinct signatures/roles
        const isMulticellularDifferentiated = clusterPores.length >= 3 && (signatures.size >= 2 || roles.size >= 2);
        const isClonalColony = clusterPores.length >= 2 && !isMulticellularDifferentiated;
        const speciesName = clusterPores[0].speciesTaxon?.binomialName || (isMulticellularDifferentiated ? 'Syncytiocladus bonnerii' : 'Protosilicoid');
        const bodyTopology = clusterPores[0].bodyTopology || (clusterPores.length >= 3 ? 'Dendritic' : 'Solitary');
        const color = ColonyKinematicsRecorder.getSpeciesColor(cladeId);

        // Classify behavior
        let behavior: KinematicBehavior = 'SESSILE_ANCHOR';
        const ventWx = ventNozzle.q * Math.sqrt(3) + (ventNozzle.r * Math.sqrt(3)) / 2;
        const ventWy = ventNozzle.r * 1.5;
        const dotToVent = vx * (ventWx - centroid.x) + vy * (ventWy - centroid.y);

        if (telemetry.vent.toxinT || telemetry.vent.thermalFlux > 350 || telemetry.vent.precursorWarning) {
          if (dotToVent < 0 && speed > 0.05) {
            behavior = 'THERMAL_EVASION';
          }
        } else if (dotToVent > 0 && speed > 0.05) {
          behavior = 'CHEMOTACTIC_ADVANCE';
        } else if (speed > 0.08) {
          behavior = 'FORAGING_SEARCH';
        }

        bodies.push({
          bodyId,
          cladeId,
          speciesName,
          isMulticellularDifferentiated,
          isClonalColony,
          clusterIndex: clusterIdx,
          organismId,
          bodyTopology,
          color,
          centroid,
          velocity: { vx, vy, vz },
          speed,
          heading,
          behavior,
          cells,
          slimeTrail: trail.slice(),
          isEncircling: false
        });
      });
    }

    // 2. Build Trophic Rays (Predation, Vent Plume Feeding, Scavenging, Syntrophy, Kleptoplasty, Chelation)
    const trophicRays: ITrophicRay[] = [];
    if (telemetry.predationEvents) {
      for (const ev of telemetry.predationEvents) {
        trophicRays.push({
          type: 'predation',
          sourceCoord: ev.predatorCoord,
          targetCoord: ev.preyCoord,
          energy: ev.energyDrained,
          color: '#f43f5e' // Crimson
        });
      }
    }

    if (telemetry.scavengeEvents) {
      for (const ev of telemetry.scavengeEvents) {
        trophicRays.push({
          type: 'scavenge',
          sourceCoord: ev.scavengerCoord,
          targetCoord: ev.carcassCoord,
          energy: ev.energyHarvested,
          color: '#eab308' // Gold
        });
      }
    }

    if (telemetry.syntrophyEvents) {
      for (const ev of telemetry.syntrophyEvents) {
        trophicRays.push({
          type: 'syntrophy',
          sourceCoord: ev.from,
          targetCoord: ev.to,
          energy: ev.amount,
          color: '#10b981' // Bioluminescent Emerald
        });
      }
    }

    if (telemetry.kleptoplastyEvents) {
      for (const ev of telemetry.kleptoplastyEvents) {
        trophicRays.push({
          type: 'kleptoplasty',
          sourceCoord: ev.predatorCoord,
          targetCoord: ev.preyCoord,
          energy: 10,
          color: '#ec4899' // Neon Magenta
        });
      }
    }

    if (telemetry.chelationEvents) {
      for (const ev of telemetry.chelationEvents) {
        trophicRays.push({
          type: 'chelation',
          sourceCoord: ev.coord,
          targetCoord: ev.coord,
          energy: ev.matterYield,
          color: '#f59e0b' // Molten Amber
        });
      }
    }

    // Vent Influx Rays for feeding cells
    for (const pore of telemetry.pores) {
      if (pore.state === PoreState.OCCUPIED && pore.primaryActive && pore.catalyticYield > 0) {
        trophicRays.push({
          type: 'vent_feed',
          sourceCoord: pore.coord,
          targetCoord: ventNozzle,
          energy: pore.catalyticYield,
          color: '#38bdf8' // Cyan
        });
      }
    }

    // 3. Build Streaming Chevrons & Apoptosis Halos from Treadmilling Events
    const streamingChevrons: IStreamingChevron[] = [];
    const apoptosisHalos: IApoptosisHalo[] = [];

    for (const ev of treadmillingEvents) {
      const col = ColonyKinematicsRecorder.getSpeciesColor(ev.cladeId);
      if (ev.type === 'streaming') {
        streamingChevrons.push({
          fromCoord: ev.sourceCoord,
          toCoord: ev.targetCoord,
          tokens: ev.energyTransferred,
          color: col
        });
      } else if (ev.type === 'apoptosis') {
        apoptosisHalos.push({
          coord: ev.sourceCoord,
          energyResorbed: ev.energyTransferred,
          tick: ev.tick,
          color: col
        });
      }
    }

    // 4. Determine Active Environmental Shock
    let activeEventDesc: string | null = null;
    if (telemetry.activeGeologicalEvents && telemetry.activeGeologicalEvents.length > 0) {
      activeEventDesc = telemetry.activeGeologicalEvents.map(e => e.description).join('; ');
    } else if (telemetry.vent.precursorWarning) {
      activeEventDesc = '⚠️ Acoustic Precursor Warning Wavefront Detected';
    } else if (telemetry.vent.thermalFlux > 350) {
      activeEventDesc = '🔥 Boiling Thermal Plume Surge (>350°C)';
    } else if (telemetry.vent.toxinT) {
      activeEventDesc = '🧪 Heavy Metal Precipitate Plume';
    }

    const frame: IKinematicFrame = {
      tick: telemetry.tick,
      timestamp: Date.now(),
      environmentalEvent: activeEventDesc,
      vent: {
        nozzleCoord: telemetry.vent.nozzleCoord,
        streamA: telemetry.vent.streamA,
        streamB: telemetry.vent.streamB,
        toxinT: telemetry.vent.toxinT,
        thermalFlux: telemetry.vent.thermalFlux,
        precursorWarning: telemetry.vent.precursorWarning ?? false,
        conduitChoking: telemetry.vent.conduitChoking ?? 0
      },
      bodies,
      trophicRays,
      streamingChevrons,
      apoptosisHalos,
      activeCladesCount: telemetry.activeCladesCount,
      shannonDiversity: telemetry.shannonDiversity
    };

    this.frames.push(frame);
    if (this.frames.length > this.maxFrames) {
      this.frames.shift();
    }

    // Keep currentFrameIndex pinned to head unless user is actively scrubbing
    if (!this.isPlaying && this.currentFrameIndex === Math.max(0, this.frames.length - 2)) {
      this.currentFrameIndex = this.frames.length - 1;
    }

    return frame;
  }

  // =========================================================================
  // Playback Controls
  // =========================================================================

  public play(): void {
    this.isPlaying = true;
  }

  public pause(): void {
    this.isPlaying = false;
  }

  public step(delta: number): void {
    if (this.frames.length === 0) return;
    this.currentFrameIndex = Math.max(0, Math.min(this.frames.length - 1, this.currentFrameIndex + delta));
  }

  public scrubTo(index: number): void {
    if (this.frames.length === 0) return;
    this.currentFrameIndex = Math.max(0, Math.min(this.frames.length - 1, index));
  }

  public setSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  public setLoopRange(start: number, end: number): void {
    this.loopStartFrame = Math.max(0, Math.min(start, this.frames.length - 1));
    this.loopEndFrame = Math.max(this.loopStartFrame, Math.min(end, this.frames.length - 1));
    this.isLooping = true;
  }

  public toggleLoop(enable?: boolean): void {
    this.isLooping = enable ?? !this.isLooping;
    if (this.isLooping && this.loopEndFrame <= this.loopStartFrame) {
      this.loopStartFrame = Math.max(0, this.frames.length - 50);
      this.loopEndFrame = Math.max(0, this.frames.length - 1);
    }
  }

  public tickPlayback(deltaMs: number): void {
    if (!this.isPlaying || this.frames.length <= 1) return;

    const framesPerSecond = 15 * this.playbackSpeed;
    const stepAdvance = Math.max(1, Math.floor((framesPerSecond * deltaMs) / 1000));

    let nextIndex = this.currentFrameIndex + stepAdvance;

    if (this.isLooping) {
      if (nextIndex > this.loopEndFrame) {
        nextIndex = this.loopStartFrame;
      }
    } else {
      if (nextIndex >= this.frames.length) {
        nextIndex = this.frames.length - 1;
        this.pause(); // Reached end of recorded tape
      }
    }

    this.currentFrameIndex = nextIndex;
  }

  public getCurrentFrame(): IKinematicFrame | null {
    if (this.frames.length === 0) return null;
    const idx = Math.max(0, Math.min(this.frames.length - 1, this.currentFrameIndex));
    return this.frames[idx];
  }

  public getFramesCount(): number {
    return this.frames.length;
  }

  public getAllFrames(): readonly IKinematicFrame[] {
    return this.frames;
  }

  public setStain(stain: HistologicalStain): void {
    this.currentStain = stain;
  }

  public setLensMode(lens: LensViewMode): void {
    this.currentLensMode = lens;
  }

  public getLensMode(): LensViewMode {
    return this.currentLensMode;
  }

  public toggleOverlay(key: keyof typeof this.overlayToggles): void {
    this.overlayToggles[key] = !this.overlayToggles[key];
  }

  public pinLineage(cladeId: string | null): void {
    this.pinnedLineageId = cladeId;
    if (!cladeId) {
      this.pinnedBodyId = null;
    }
  }

  public pinBody(bodyId: string | null): void {
    this.pinnedBodyId = bodyId;
    if (bodyId) {
      const cladeId = bodyId.split('_c')[0];
      this.pinnedLineageId = cladeId;
    } else {
      this.pinnedLineageId = null;
    }
  }

  public toggleLineageIsolation(enable?: boolean): void {
    this.isLineageIsolation = enable ?? !this.isLineageIsolation;
  }

  /**
   * Clears all recorded frames from memory.
   */
  public clearFrames(): void {
    this.frames.length = 0;
    this.bodyHistoricalTrails.clear();
    this.lastBodyCentroids.clear();
    this.currentFrameIndex = 0;
    this.loopStartFrame = 0;
    this.loopEndFrame = 0;
    this.isLooping = false;
  }

  /**
   * Loads an array of kinematic frames from a serialized archive,
   * restoring HexCoord3D object prototypes and trajectory history.
   */
  public loadFrames(loadedFrames: readonly IKinematicFrame[]): void {
    this.clearFrames();
    if (!loadedFrames || loadedFrames.length === 0) return;

    for (const raw of loadedFrames) {
      // Re-hydrate HexCoord3D instances
      const nozzle = new HexCoord3D(raw.vent.nozzleCoord.q, raw.vent.nozzleCoord.r, raw.vent.nozzleCoord.z);
      const bodies: IKinematicBody[] = raw.bodies.map(b => ({
        ...b,
        cells: b.cells.map(c => ({
          ...c,
          coord: new HexCoord3D(c.coord.q, c.coord.r, c.coord.z)
        }))
      }));

      const trophicRays: ITrophicRay[] = raw.trophicRays.map(r => ({
        ...r,
        sourceCoord: new HexCoord3D(r.sourceCoord.q, r.sourceCoord.r, r.sourceCoord.z),
        targetCoord: new HexCoord3D(r.targetCoord.q, r.targetCoord.r, r.targetCoord.z)
      }));

      const streamingChevrons: IStreamingChevron[] = (raw.streamingChevrons || []).map(s => ({
        ...s,
        fromCoord: new HexCoord3D(s.fromCoord.q, s.fromCoord.r, s.fromCoord.z),
        toCoord: new HexCoord3D(s.toCoord.q, s.toCoord.r, s.toCoord.z)
      }));

      const apoptosisHalos: IApoptosisHalo[] = (raw.apoptosisHalos || []).map(a => ({
        ...a,
        coord: new HexCoord3D(a.coord.q, a.coord.r, a.coord.z)
      }));

      const hydratedFrame: IKinematicFrame = {
        ...raw,
        vent: {
          ...raw.vent,
          nozzleCoord: nozzle
        },
        bodies,
        trophicRays,
        streamingChevrons,
        apoptosisHalos
      };

      this.frames.push(hydratedFrame);

      // Rebuild historical trails
      for (const b of bodies) {
        let trail = this.bodyHistoricalTrails.get(b.bodyId);
        if (!trail) {
          trail = [];
          this.bodyHistoricalTrails.set(b.bodyId, trail);
        }
        trail.push({ ...b.centroid, tick: raw.tick });
        if (trail.length > 25) {
          trail.shift();
        }
      }
    }

    this.currentFrameIndex = 0;
    this.loopStartFrame = 0;
    this.loopEndFrame = Math.max(0, this.frames.length - 1);
  }
}
