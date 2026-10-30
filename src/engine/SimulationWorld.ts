import { PelagicSporeEngine, EndosymbiosisEngine, ScavengingEngine } from './ecology/index.js';
/**
 * 🐠 Siliquarium Engine Subsystem
 * SimulationWorld: Coordinates 3D HexGrid, VentPhysics, Organisms, and Conservation Ledger.
 * Zero-DOM Mandate: 100% headless, testable in Node.js and Web Workers.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { HexGrid3D } from '../core/spatial/HexGrid3D.js';
import { Pore, PoreState, PoreMedium } from '../core/domain/Pore.js';
import { PoreCell } from '../core/domain/PoreCell.js';
import { GenomeSafe } from '../core/domain/GenomeSafe.js';
import { VentPhysics } from '../core/physics/VentPhysics.js';
import { ThermodynamicLedger } from '../core/physics/ThermodynamicLedger.js';
import { PHYSICAL_CONSTANTS } from '../core/physics/PhysicalConstants.js';
import { Mulberry32Prng, IPrng } from '../core/prng/SeedablePrng.js';
import {
  ISimulationTelemetry,
  IPoreTelemetry,
  IPredationEvent,
  IScavengeEvent,
  ISporeEjectionEvent,
  IEndosymbiosisEvent,
  ISyntrophyEvent,
  IKleptoplastyEvent,
  IChelationEvent,
  ISyncytialColonyTelemetry,
  IDifferentiatedCellRole,
  ICladeSummary
} from './SimulationTelemetry.js';
import { DigitalPaleontologist } from './paleontology/DigitalPaleontologist.js';
import { LteeBenchmark } from './paleontology/LteeBenchmark.js';
import { EvolutionaryHistoryTracker } from './paleontology/EvolutionaryHistoryExporter.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { ColonyMorphologyClassifier } from './kinematics/ColonyMorphologyClassifier.js';
import {
  GeologicalPressuresEngine,
  GeologicalEventType,
  IGeologicalConfig,
  IGeologicalEventRecord,
  GeologicalEventListener
} from './environment/GeologicalPressuresEngine.js';
import {
  ISiliquariumEnvironmentPreset,
  IVentConfig,
  IFounderStrainInoculation,
  EnvironmentPresetRegistry
} from './storage/EnvironmentPresetRegistry.js';
import { TreadmillingEngine, ITreadmillingEvent, ColonyKinematicsRecorder } from './kinematics/index.js';
import { SiliquariumDB } from './storage/SiliquariumDB.js';
import { ISimulationStateSnapshot, IStoredPoreData } from './storage/SimulationSnapshotManager.js';

export interface ISimulationConfig {
  readonly radius?: number;
  readonly minZ?: number;
  readonly maxZ?: number;
  readonly seed?: number;
  readonly mutationRate?: number;
  readonly duplicationRate?: number;
  readonly deletionRate?: number;
  readonly soupDensity?: number;
  readonly basaltDensity?: number;
  readonly terrainRoughness?: number;
  readonly ventCoord?: HexCoord3D;
  readonly offshootCount?: number;
  readonly geologicalConfig?: Partial<IGeologicalConfig>;
}

export interface INewSiliquariumOptions {
  radius: number;
  minZ?: number;
  maxZ?: number;
  mode?: 'blank' | 'procedural';
  template?: 'none' | 'empty' | 'single_vent' | 'twin_vents';
  basaltDensity?: number;
  terrainRoughness?: number;
  subterraneanNiches?: number;
  blankSubstrate?: 'solid_basalt' | 'habitable_caverns' | 'aqueous_void';
  offshootCount?: number;
  seed?: number;
  seedingMode?: 'founders' | 'soup' | 'biobank' | 'sterile';
}

export class SimulationWorld {
  private grid: HexGrid3D<Pore>;
  private vent: VentPhysics;
  private ledger: ThermodynamicLedger;
  private prng: IPrng;
  private paleontologist: DigitalPaleontologist;
  private readonly ltee: LteeBenchmark = new LteeBenchmark();
  private readonly historyTracker: EvolutionaryHistoryTracker = new EvolutionaryHistoryTracker(250);
  private readonly geologicalEngine: GeologicalPressuresEngine;
  private readonly pores: Pore[] = [];
  private readonly poreMap: Map<string, Pore> = new Map();
  private poreTelemetries: IPoreTelemetry[] = [];

  private activePredationEvents: IPredationEvent[] = [];
  private activeScavengeEvents: IScavengeEvent[] = [];
  private activeSporeEjections: ISporeEjectionEvent[] = [];
  private activeEndosymbiosisEvents: IEndosymbiosisEvent[] = [];
  private activeSyntrophyEvents: ISyntrophyEvent[] = [];
  private activeKleptoplastyEvents: IKleptoplastyEvent[] = [];
  private activeChelationEvents: IChelationEvent[] = [];
  private activeTreadmillingEvents: ITreadmillingEvent[] = [];
  private readonly kinematicsRecorder: ColonyKinematicsRecorder = new ColonyKinematicsRecorder();
  private cachedColonyComponents: Pore[][] = [];

  // Sparse Active Pore Engine: O(N_active) simulation execution
  private readonly activePores: Set<Pore> = new Set();

  // Tactical Geothermal Actions ("The Geothermal Commander" CCG)
  private activeTacticalSubstrateC: boolean = false;
  private tacticalSubstrateCTicks: number = 0;
  private activeTacticalSubstrateD: boolean = false;
  private tacticalSubstrateDTicks: number = 0;
  private activeTacticalAcousticShock: boolean = false;
  private tacticalAcousticShockTicks: number = 0;
  private activeTacticalPhotonFlare: boolean = false;
  private tacticalPhotonFlareTicks: number = 0;

  private tickCount: number = 0;
  private cachedTelemetry: ISimulationTelemetry | null = null;
  private telemetryDirty: boolean = true;
  private mutationRate: number;
  private duplicationRate: number;
  private deletionRate: number;
  private currentRadius: number;
  private currentMinZ: number;
  private currentMaxZ: number;
  private currentBasaltDensity: number;
  private currentTerrainRoughness: number;
  private currentSoupDensity: number;
  private activePreset: ISiliquariumEnvironmentPreset | null = null;

  constructor(config: ISimulationConfig = {}) {
    this.currentRadius = config.radius ?? 5;
    this.currentMinZ = config.minZ ?? 0;
    this.currentMaxZ = config.maxZ ?? 4;
    this.currentBasaltDensity = config.basaltDensity ?? 0.12;
    this.currentTerrainRoughness = config.terrainRoughness ?? 0.0;
    this.currentSoupDensity = config.soupDensity ?? 0.2;
    this.mutationRate = config.mutationRate ?? GenomeSafe.DEFAULT_MUTATION_RATE;
    this.duplicationRate = config.duplicationRate ?? PHYSICAL_CONSTANTS.DUPLICATION_RATE_DEFAULT;
    this.deletionRate = config.deletionRate ?? PHYSICAL_CONSTANTS.DELETION_RATE_DEFAULT;

    const seed = config.seed ?? 42;
    this.prng = new Mulberry32Prng(seed);
    this.ledger = new ThermodynamicLedger();
    this.paleontologist = new DigitalPaleontologist();
    this.geologicalEngine = new GeologicalPressuresEngine(config.geologicalConfig);

    const nozzle = config.ventCoord ?? new HexCoord3D(0, 0, 0);
    const offshoots = SimulationWorld.computeOffshootCoords(nozzle, config.offshootCount ?? 0, this.currentRadius);
    this.vent = new VentPhysics(nozzle, 500, offshoots);
    this.grid = new HexGrid3D<Pore>(this.currentRadius, this.currentMinZ, this.currentMaxZ);

    this.buildTerrain({
      radius: this.currentRadius,
      minZ: this.currentMinZ,
      maxZ: this.currentMaxZ,
      basaltDensity: this.currentBasaltDensity,
      terrainRoughness: this.currentTerrainRoughness,
      nozzle,
      offshoots
    });

    if ((config.soupDensity ?? 0) > 0) {
      this.seedPrimordialSoup(config.soupDensity ?? 0.2);
    }
  }

  public static computeOffshootCoords(center: HexCoord3D, count: number, maxRadius: number = 5): HexCoord3D[] {
    if (count <= 0) return [];
    const offsets = [
      { dq: 2, dr: 0 },
      { dq: -2, dr: 2 },
      { dq: 0, dr: -2 },
      { dq: -2, dr: 0 }
    ];
    const results: HexCoord3D[] = [];
    for (let i = 0; i < Math.min(count, offsets.length); i++) {
      let dq = offsets[i].dq;
      let dr = offsets[i].dr;
      // Clamp within radius bounds
      if (Math.abs(center.q + dq) >= maxRadius || Math.abs(center.r + dr) >= maxRadius || Math.abs((center.q + dq) + (center.r + dr)) >= maxRadius) {
        dq = Math.sign(dq);
        dr = Math.sign(dr);
      }
      results.push(new HexCoord3D(center.q + dq, center.r + dr, center.z));
    }
    return results;
  }

  private buildTerrain(options: {
    readonly radius: number;
    readonly minZ: number;
    readonly maxZ: number;
    readonly basaltDensity: number;
    readonly terrainRoughness: number;
    readonly nozzle: HexCoord3D;
    readonly offshoots: readonly HexCoord3D[];
    readonly subterraneanNiches?: number;
    readonly blankSubstrate?: 'solid_basalt' | 'habitable_caverns' | 'aqueous_void';
  }): void {
    const {
      radius,
      minZ,
      maxZ,
      basaltDensity,
      terrainRoughness,
      nozzle,
      offshoots,
      subterraneanNiches = 0.35,
      blankSubstrate = 'solid_basalt'
    } = options;
    this.pores.length = 0;
    this.poreMap.clear();
    this.activePores.clear();
    this.grid.clear();

    const protectedCoords = new Set<string>();
    protectedCoords.add(`${nozzle.q},${nozzle.r},0`);
    nozzle.getPlanarNeighbors().forEach(n => protectedCoords.add(`${n.q},${n.r},0`));
    offshoots.forEach(off => {
      protectedCoords.add(`${off.q},${off.r},0`);
      off.getPlanarNeighbors().forEach(n => protectedCoords.add(`${n.q},${n.r},0`));
    });

    // -------------------------------------------------------------
    // 1. HEIGHTMAP ARCHITECTURE: Continuous Substrate Elevation H(q, r)
    // Guarantees zero floating rocks: rock exists strictly for z <= H(q, r).
    // -------------------------------------------------------------
    const heightMap = new Map<string, number>();
    const basaltColumns = new Set<string>();

    const hexDirs = [
      { dq: 1, dr: 0 }, { dq: 0, dr: 1 }, { dq: -1, dr: 1 },
      { dq: -1, dr: 0 }, { dq: 0, dr: -1 }, { dq: 1, dr: -1 }
    ];

    const getH = (q: number, r: number): number => heightMap.get(`${q},${r}`) ?? 0;
    const setH = (q: number, r: number, h: number): void => {
      const clamped = Math.max(minZ, Math.min(maxZ, Math.floor(h)));
      heightMap.set(`${q},${r}`, Math.max(getH(q, r), clamped));
    };
    const setTrench = (q: number, r: number, depth: number): void => {
      const clamped = Math.max(minZ, Math.min(0, Math.floor(depth)));
      heightMap.set(`${q},${r}`, clamped);
    };

    // A. Hydrothermal Chimney Edifices & Basal Buttresses
    // Primary Vent: summit at maxZ, with tiered volcanic collar around it
    setH(nozzle.q, nozzle.r, maxZ);
    const collarH = Math.max(1, Math.min(maxZ - 1, Math.round(maxZ * 0.65)));
    nozzle.getPlanarNeighbors().forEach(n => {
      setH(n.q, n.r, collarH);
    });
    if (terrainRoughness > 0) {
      const outerCollarH = Math.max(1, Math.floor(collarH * 0.5));
      nozzle.getPlanarNeighbors().forEach(n => {
        n.getPlanarNeighbors().forEach(n2 => {
          if (n2.distanceTo(nozzle) === 2 && this.prng.nextFloat() < (0.35 + 0.35 * terrainRoughness)) {
            setH(n2.q, n2.r, outerCollarH);
          }
        });
      });
    }

    // Satellite Chimney Offshoots:
    offshoots.forEach(off => {
      const offH = Math.max(2, Math.min(maxZ - 1, Math.round(maxZ * 0.60)));
      setH(off.q, off.r, offH);
      const offCollarH = Math.max(1, offH - 1);
      off.getPlanarNeighbors().forEach(n => {
        setH(n.q, n.r, offCollarH);
      });
    });

    // B. Diverse Deep-Sea Geomorphology (When terrainRoughness > 0)
    if (terrainRoughness > 0) {
      // 1. Stepped Terraces & Basalt Plateaus (Mesas):
      // Cohesive flat-topped submarine shelves where 4 to 8 adjacent hexes share elevation
      const plateauCount = Math.max(2, Math.floor(radius / 2.5));
      for (let p = 0; p < plateauCount; p++) {
        let seedQ = 0, seedR = 0;
        let attempts = 0;
        while (attempts++ < 30) {
          seedQ = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          seedR = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          const testCoord = new HexCoord3D(seedQ, seedR, 0);
          if (this.grid.isInBounds(testCoord) && testCoord.distanceTo(nozzle) >= 3) break;
        }
        if (attempts >= 30) continue;

        let plateauH = 1;
        if (maxZ >= 4) {
          const maxPlateauH = Math.max(2, Math.min(maxZ - 2, Math.round(maxZ * 0.55)));
          plateauH = 1 + Math.floor(this.prng.nextFloat() * maxPlateauH);
        }
        setH(seedQ, seedR, plateauH);

        const plateauCoords = [new HexCoord3D(seedQ, seedR, 0)];
        const clusterSize = 3 + Math.floor(this.prng.nextFloat() * 5);
        for (let s = 0; s < clusterSize && s < plateauCoords.length; s++) {
          const curr = plateauCoords[s];
          for (const dir of hexDirs) {
            const nCoord = new HexCoord3D(curr.q + dir.dq, curr.r + dir.dr, 0);
            if (this.grid.isInBounds(nCoord) && nCoord.distanceTo(nozzle) >= 2 && !heightMap.has(nCoord.toKey())) {
              if (this.prng.nextFloat() < 0.65) {
                setH(nCoord.q, nCoord.r, plateauH);
                plateauCoords.push(nCoord);
              }
            }
          }
        }
      }

      // 2. Tectonic Rift Fault Scarps & Ridge Walls:
      // Linear and stepped volcanic walls running across the seafloor
      const ridgeCount = Math.min(4, Math.max(2, Math.floor(radius / 3)));
      for (let rc = 0; rc < ridgeCount; rc++) {
        let seedQ = 0, seedR = 0;
        let attempts = 0;
        while (attempts++ < 30) {
          seedQ = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          seedR = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          const testCoord = new HexCoord3D(seedQ, seedR, 0);
          if (this.grid.isInBounds(testCoord) && testCoord.distanceTo(nozzle) >= 3) break;
        }
        if (attempts >= 30) continue;

        const dir = hexDirs[Math.floor(this.prng.nextFloat() * hexDirs.length)];
        const ridgeLen = 3 + Math.floor(this.prng.nextFloat() * 6);
        let ridgeH = 1;
        if (maxZ >= 4) {
          const maxRidgeH = Math.max(2, Math.min(maxZ - 2, Math.round(maxZ * 0.55)));
          ridgeH = 1 + Math.floor(this.prng.nextFloat() * maxRidgeH);
        }

        let curQ = seedQ, curR = seedR;
        for (let step = 0; step < ridgeLen; step++) {
          const c = new HexCoord3D(curQ, curR, 0);
          if (!this.grid.isInBounds(c) || c.distanceTo(nozzle) < 2) break;
          setH(curQ, curR, ridgeH);

          // Add stepped flanking shoulder
          const flankDir = hexDirs[(hexDirs.indexOf(dir) + 2) % 6];
          const flankC = new HexCoord3D(curQ + flankDir.dq, curR + flankDir.dr, 0);
          if (this.grid.isInBounds(flankC) && flankC.distanceTo(nozzle) >= 2 && this.prng.nextFloat() < 0.65) {
            setH(flankC.q, flankC.r, Math.max(1, ridgeH - 1));
          }
          curQ += dir.dq;
          curR += dir.dr;
        }
      }

      // 3. Volcanic Pillow Basalt Hummocks & Mounds:
      // Organic rounded mounds with elevated center and sloping shoulders
      const moundCount = 2 + Math.floor(this.prng.nextFloat() * 3);
      for (let m = 0; m < moundCount; m++) {
        let seedQ = 0, seedR = 0;
        let attempts = 0;
        while (attempts++ < 30) {
          seedQ = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          seedR = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          const testCoord = new HexCoord3D(seedQ, seedR, 0);
          if (this.grid.isInBounds(testCoord) && testCoord.distanceTo(nozzle) >= 3) break;
        }
        if (attempts >= 30) continue;

        let peakH = 1;
        if (maxZ >= 4) {
          const maxPeakH = Math.max(2, Math.min(maxZ - 2, Math.round(maxZ * 0.50)));
          peakH = 1 + Math.floor(this.prng.nextFloat() * maxPeakH);
        }
        setH(seedQ, seedR, peakH);
        const moundCenter = new HexCoord3D(seedQ, seedR, 0);
        const shoulderH = Math.max(1, peakH - 1);
        moundCenter.getPlanarNeighbors().forEach(n => {
          if (this.grid.isInBounds(n) && n.distanceTo(nozzle) >= 2 && this.prng.nextFloat() < 0.70) {
            setH(n.q, n.r, shoulderH);
          }
        });
      }

      // 4. Subterranean Sunken Rift Trenches & Fault Chasms (When minZ < 0):
      // Tectonic rifting tears sunken graben trenches below normal seafloor (z = minZ, e.g. -1)
      if (minZ < 0) {
        const trenchCount = Math.min(2, Math.max(1, Math.floor(radius / 4)));
        for (let tc = 0; tc < trenchCount; tc++) {
          let seedQ = 0, seedR = 0;
          let attempts = 0;
          while (attempts++ < 30) {
            seedQ = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
            seedR = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
            const testCoord = new HexCoord3D(seedQ, seedR, 0);
            if (this.grid.isInBounds(testCoord) && testCoord.distanceTo(nozzle) >= 3 && getH(seedQ, seedR) === 0) break;
          }
          if (attempts >= 30) continue;

          const dir = hexDirs[Math.floor(this.prng.nextFloat() * hexDirs.length)];
          const trenchLen = 2 + Math.floor(this.prng.nextFloat() * 4); // 2 to 5 hexes long

          let curQ = seedQ, curR = seedR;
          for (let step = 0; step < trenchLen; step++) {
            const c = new HexCoord3D(curQ, curR, 0);
            if (!this.grid.isInBounds(c) || c.distanceTo(nozzle) < 3 || getH(curQ, curR) > 0) break;
            setTrench(curQ, curR, minZ); // Sunken trench floor at minZ
            curQ += dir.dq;
            curR += dir.dr;
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 2. Basalt Barrier Distribution Across Ridges & Seafloor
    // -------------------------------------------------------------
    const allColumns: { q: number; r: number; height: number }[] = [];
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const c0 = new HexCoord3D(q, r, 0);
        if (this.grid.isInBounds(c0)) {
          allColumns.push({ q, r, height: getH(q, r) });
        }
      }
    }

    if (basaltDensity > 0) {
      const targetBasaltColumns = Math.floor(allColumns.length * Math.min(0.35, basaltDensity));
      let basaltPlaced = 0;

      // Volcanic ridges and mounds are prime natural sites for solid basalt caprock:
      const elevatedNonVent = allColumns.filter(col =>
        col.height > 0 &&
        new HexCoord3D(col.q, col.r, 0).distanceTo(nozzle) >= 2 &&
        !offshoots.some(off => off.distanceTo(new HexCoord3D(col.q, col.r, 0)) <= 1)
      );

      for (const col of elevatedNonVent) {
        if (basaltPlaced >= targetBasaltColumns) break;
        if (this.prng.nextFloat() < 0.45) {
          basaltColumns.add(`${col.q},${col.r}`);
          basaltPlaced++;
        }
      }

      // Fill remaining basalt quota with seafloor barrier clusters (z = 0)
      const flatSeabed = allColumns.filter(col =>
        col.height === 0 &&
        !protectedCoords.has(`${col.q},${col.r},0`) &&
        !basaltColumns.has(`${col.q},${col.r}`)
      );

      while (basaltPlaced < targetBasaltColumns && flatSeabed.length > 0) {
        const idx = Math.floor(this.prng.nextFloat() * flatSeabed.length);
        const seed = flatSeabed.splice(idx, 1)[0];
        basaltColumns.add(`${seed.q},${seed.r}`);
        basaltPlaced++;

        for (const dir of hexDirs) {
          if (basaltPlaced >= targetBasaltColumns) break;
          const nKey = `${seed.q + dir.dq},${seed.r + dir.dr}`;
          if (!protectedCoords.has(`${nKey},0`) && !basaltColumns.has(nKey) && this.prng.nextFloat() < 0.5) {
            const matchIdx = flatSeabed.findIndex(f => f.q === seed.q + dir.dq && f.r === seed.r + dir.dr);
            if (matchIdx >= 0) {
              flatSeabed.splice(matchIdx, 1);
              basaltColumns.add(nKey);
              basaltPlaced++;
            }
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 2.5 Subterranean Hydrothermal Conduits, Lava Tubes & Cavern Niches (When minZ < 0)
    // -------------------------------------------------------------
    const habitableSubterraneanNiches = new Set<string>();

    if (minZ < 0 && subterraneanNiches > 0) {
      // A. Vertical Hydrothermal Feeder Conduits:
      // Beneath the central vent nozzle and all offshoots, magma conduit channels
      // deliver rich hydrothermal fluids from the abyssal mantle upwards.
      const allVentRoots = [nozzle, ...offshoots];
      for (const ventRoot of allVentRoots) {
        for (let z = -1; z >= minZ; z--) {
          habitableSubterraneanNiches.add(`${ventRoot.q},${ventRoot.r},${z}`);
          // Branching feeder crevices into planar neighbors
          ventRoot.getPlanarNeighbors().forEach(n => {
            if (this.grid.isInBounds(new HexCoord3D(n.q, n.r, z)) && this.prng.nextFloat() < (0.45 + 0.35 * subterraneanNiches)) {
              habitableSubterraneanNiches.add(`${n.q},${n.r},${z}`);
            }
          });
        }
      }

      // B. Subterranean Tectonic Fault Caverns & Lava Tube Pockets:
      // Clusters of hollow, habitable bedrock cavities where silicoid communities can nest
      const totalDepthTiers = Math.abs(minZ);
      const cavernChambersCount = Math.max(1, Math.round(radius * totalDepthTiers * 0.45 * subterraneanNiches));

      for (let c = 0; c < cavernChambersCount; c++) {
        let seedQ = 0, seedR = 0;
        let attempts = 0;
        while (attempts++ < 30) {
          seedQ = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          seedR = -radius + Math.floor(this.prng.nextFloat() * (2 * radius + 1));
          const testCoord = new HexCoord3D(seedQ, seedR, 0);
          if (this.grid.isInBounds(testCoord)) break;
        }
        if (attempts >= 30) continue;

        // Choose random subterranean tier
        const seedZ = minZ + Math.floor(this.prng.nextFloat() * totalDepthTiers);
        const chamberCenter = new HexCoord3D(seedQ, seedR, seedZ);
        habitableSubterraneanNiches.add(chamberCenter.toKey());

        // Cavern chamber expansion: 2 to 5 neighboring pores
        const clusterSize = 2 + Math.floor(this.prng.nextFloat() * 4);
        const cluster = [chamberCenter];
        for (let s = 0; s < clusterSize && s < cluster.length; s++) {
          const curr = cluster[s];
          for (const dir of hexDirs) {
            const nCoord = new HexCoord3D(curr.q + dir.dq, curr.r + dir.dr, curr.z);
            if (this.grid.isInBounds(nCoord) && !habitableSubterraneanNiches.has(nCoord.toKey())) {
              if (this.prng.nextFloat() < 0.60) {
                habitableSubterraneanNiches.add(nCoord.toKey());
                cluster.push(nCoord);
              }
            }
          }
          // Vertical fracture connectivity (lava tube connection between strata)
          if (curr.z < -1 && this.prng.nextFloat() < (0.30 + 0.30 * subterraneanNiches)) {
            const upCoord = new HexCoord3D(curr.q, curr.r, curr.z + 1);
            if (this.grid.isInBounds(upCoord)) {
              habitableSubterraneanNiches.add(upCoord.toKey());
            }
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 3. Grid & Domain Pores Instantiation (Strict Vertical Contiguity Invariant)
    // -------------------------------------------------------------
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const colHeight = getH(q, r);
        const isBasaltCol = basaltColumns.has(`${q},${r}`);

        for (let z = minZ; z <= maxZ; z++) {
          const coord = new HexCoord3D(q, r, z);
          if (!this.grid.isInBounds(coord)) continue;

          // STRICT CONTIGUITY: Solid rock for all z <= colHeight; Aqueous fluid for all z > colHeight!
          const isRock = (z <= colHeight);
          let medium = isRock ? PoreMedium.ROCK_SUBSTRATE : PoreMedium.AQUEOUS_FLUID;
          let isBasalt = false;

          if (isRock) {
            if (z < 0 && z < colHeight) {
              // Deep subterranean crust below normal benthic floor:
              if (habitableSubterraneanNiches.has(coord.toKey())) {
                // Habitable subterranean hydrothermal conduit, lava tube, or fault cavern!
                // Remains PoreMedium.ROCK_SUBSTRATE with isBasalt = false!
                isBasalt = false;
              } else if (blankSubstrate === 'habitable_caverns') {
                // Blank canvas configured for 100% porous habitable substrate
                isBasalt = false;
              } else if (blankSubstrate === 'aqueous_void') {
                // Blank canvas configured for deep subterranean fluid void
                medium = PoreMedium.AQUEOUS_FLUID;
                isBasalt = false;
              } else {
                // Solid, dense impermeable basalt obstacle
                isBasalt = true;
              }
            } else {
              // Benthic Seafloor Surface (z >= 0 or z === colHeight at trench floor):
              // Habitable rock cavity unless designated as a basalt wall / mesa column
              if (isBasaltCol) {
                isBasalt = true;
              }
            }
          }

          const pore = new Pore(coord, medium);
          if (isBasalt) {
            pore.setBasalt(true);
            this.grid.setBasaltObstacle(coord);
          }

          this.grid.setItem(coord, pore);
          this.pores.push(pore);
          this.poreMap.set(coord.toKey(), pore);
        }
      }
    }

    // -------------------------------------------------------------
    // 4. Precompute Adjacent Neighbor References (Zero-Allocation Physics)
    // -------------------------------------------------------------
    for (const pore of this.pores) {
      const neighborPores = this.grid.getValidNeighbors3D(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined);
      pore.setNeighbors(neighborPores);
    }

    this.rebuildFlatPoreTelemetries();
    this.syncActivePores();
  }

  private rebuildFlatPoreTelemetries(): void {
    // Pre-allocate reusable flat telemetry records for zero-allocation telemetry exports
    const emptyArr: readonly string[] = Object.freeze([]);
    this.poreTelemetries = this.pores.map(p => ({
      coord: p.coord,
      state: p.getState(),
      isBasalt: p.isBasalt(),
      isAqueous: p.isAqueous(),
      energy: 0,
      matter: 0,
      age: 0,
      generation: 0,
      gateCount: 0,
      gateTypes: emptyArr,
      hasSpore: false,
      tapeBitstring: '',
      catalyticYield: 0,
      toggleCount: 0,
      primaryActive: false,
      id: undefined,
      parentId: null,
      cladeId: undefined,
      hasOrganelle: false,
      organelleTape: '',
      organelleGateTypes: emptyArr,
      isSyncytium: false,
      syncytiumId: undefined,
      syncytiumMemberCount: undefined,
      bodyTopology: undefined,
      isDifferentiated: false,
      hasSeptum: false,
      hasSporeAdaptation: false,
      chelator: 0,
      eps: 0,
      speciesTaxon: undefined
    }));
  }

  public seedPrimordialSoup(density: number): void {
    this.currentSoupDensity = density;
    for (const pore of this.pores) {
      if (!pore.isAqueous() && !pore.isBasalt() && pore.getState() === PoreState.EMPTY && this.prng.nextFloat() < density) {
        const cell = new PoreCell(GenomeSafe.createPrebioticSoup(this.prng), 60, 20, 0);
        pore.setResident(cell);
        this.ledger.recordEnergyInjection(60);
        this.ledger.recordMatterInjection(20);
        this.registerActivePore(pore);
      }
    }
  }

  public getActivePores(): readonly Pore[] {
    return Array.from(this.activePores);
  }

  public registerActivePore(pore: Pore): void {
    this.activePores.add(pore);
  }

  public unregisterActivePore(pore: Pore): void {
    if (!pore.isPoreActive()) {
      this.activePores.delete(pore);
    }
  }

  public syncActivePores(): void {
    this.activePores.clear();
    for (const pore of this.pores) {
      if (pore.isPoreActive()) {
        this.activePores.add(pore);
      }
    }
  }

  public getActivePoreCount(): number {
    return this.activePores.size;
  }

  public triggerEnvironmentalAction(actionType: string, epicenter?: HexCoord3D, _tapCost: number = 25): boolean {
    const epic = epicenter ?? this.vent.nozzleCoord;
    const radius = 3;

    switch (actionType) {
      case 'SUBSTRATE_C_BLOOM':
        this.activeTacticalSubstrateC = true;
        this.tacticalSubstrateCTicks = 15;
        return true;
      case 'SUBSTRATE_D_BLOOM':
        this.activeTacticalSubstrateD = true;
        this.tacticalSubstrateDTicks = 15;
        return true;
      case 'ACOUSTIC_CAVITATION_SHOCK':
        this.activeTacticalAcousticShock = true;
        this.tacticalAcousticShockTicks = 8;
        return true;
      case 'PHOTON_FLARE':
        this.activeTacticalPhotonFlare = true;
        this.tacticalPhotonFlareTicks = 12;
        return true;
      case 'SIDEROPHORE_RAIN': {
        const affected = this.pores.filter(p => p.coord.distanceTo(epic) <= radius && !p.isBasalt());
        for (const p of affected) {
          p.addChelator(3.0);
          this.registerActivePore(p);
        }
        return true;
      }
      case 'TIDAL_INVERSION': {
        this.geologicalEngine.triggerEvent(GeologicalEventType.TIDAL_CURRENT_SHEAR, this, this.tickCount, this.prng);
        return true;
      }
      case 'ACID_PURGE': {
        this.geologicalEngine.triggerEvent(GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE, this, this.tickCount, this.prng);
        return true;
      }
      default:
        return false;
    }
  }

  public step(): void {
    this.tickCount++;
    this.telemetryDirty = true;
    this.activePredationEvents = [];
    this.activeScavengeEvents = [];
    this.activeSporeEjections = [];
    this.activeEndosymbiosisEvents = [];
    this.activeSyntrophyEvents = [];
    this.activeKleptoplastyEvents = [];
    this.activeChelationEvents = [];
    this.activeTreadmillingEvents = [];

    // Tactical Geothermal action durations
    if (this.tacticalSubstrateCTicks > 0) {
      this.tacticalSubstrateCTicks--;
      if (this.tacticalSubstrateCTicks === 0) this.activeTacticalSubstrateC = false;
    }
    if (this.tacticalSubstrateDTicks > 0) {
      this.tacticalSubstrateDTicks--;
      if (this.tacticalSubstrateDTicks === 0) this.activeTacticalSubstrateD = false;
    }
    if (this.tacticalAcousticShockTicks > 0) {
      this.tacticalAcousticShockTicks--;
      if (this.tacticalAcousticShockTicks === 0) this.activeTacticalAcousticShock = false;
    }
    if (this.tacticalPhotonFlareTicks > 0) {
      this.tacticalPhotonFlareTicks--;
      if (this.tacticalPhotonFlareTicks === 0) this.activeTacticalPhotonFlare = false;
    }

    // Step deep-sea geological & environmental pressures engine
    this.geologicalEngine.step(this, this.tickCount, this.prng);

    this.stepMetaboliteDiffusion();
    this.stepCellMetabolism();
    this.stepReproduction();
    this.stepEndosymbiosis();
    this.stepSyncytialHomeostasis();
    this.stepTreadmilling();
    this.stepSpores();
    this.stepLysisAndScavenging();
    this.stepCarcassDecay();

    // High-performance decoupled auditing & history tracking:
    // Only export full telemetry and audit when sampling (250 ticks) or on periodic milestone audit (25 ticks)
    const isSampleTick = this.tickCount % 250 === 0;
    const isAuditTick = this.tickCount % 25 === 0;

    const tele = this.exportTelemetry();
    if (isAuditTick) {
      this.paleontologist.auditPores(this.pores, this.tickCount, tele);
    }
    if (isSampleTick) {
      this.historyTracker.recordTick(this, tele);
    }

    // Record Kinematic Frame for Longitudinal Slime Motility & Chronicle Playback
    this.kinematicsRecorder.recordFrame(tele, this.activeTreadmillingEvents);
    if (this.tickCount % 10 === 0) {
      const currentFrame = this.kinematicsRecorder.getCurrentFrame();
      if (currentFrame) {
        SiliquariumDB.getInstance().saveKinematicFrame(currentFrame);
      }
    }
  }

  private stepMetaboliteDiffusion(): void {
    if (this.activePores.size === 0) this.syncActivePores();
    const activeSnapshot = Array.from(this.activePores);
    for (const pore of activeSnapshot) {
      pore.stepMetaboliteDiffusionAndDecay();
      if (pore.getChelator() > 0.05 || pore.getEps() > 0.05) {
        for (const n of pore.getNeighbors()) {
          this.activePores.add(n);
        }
      } else {
        this.unregisterActivePore(pore);
      }
    }
  }

  private stepCellMetabolism(): void {
    const toxinOverride = this.geologicalEngine.activeToxicPlumeOverride;
    const surgeBoost = this.geologicalEngine.activeSurgeEnergyBoost;
    const cryogenic = this.geologicalEngine.activeCryogenicCooling;

    if (this.activePores.size === 0) this.syncActivePores();
    const activeSnapshot = Array.from(this.activePores);

    for (const pore of activeSnapshot) {
      const cell = pore.getResident();
      if (!cell) {
        this.unregisterActivePore(pore);
        continue;
      }
      const v = this.vent.evaluateAt(pore.coord, this.tickCount);

      const effStreamA = surgeBoost > 0 ? true : (cryogenic ? (this.tickCount % 4 === 0 && v.streamA) : v.streamA);
      const effStreamB = surgeBoost > 0 ? true : (cryogenic ? (this.tickCount % 4 === 0 && v.streamB) : v.streamB);
      const effStreamC = v.streamC || this.activeTacticalSubstrateC;
      const effStreamD = v.streamD || this.activeTacticalSubstrateD;
      const effToxin = toxinOverride ? true : v.toxinT;
      const effPhotonIr = v.photonIr || this.activeTacticalPhotonFlare;
      const effBaroAcoustic = v.baroAcoustic || this.activeTacticalAcousticShock;
      const effMechanoTouch = pore.getNeighbors().some(n => n.isBasalt() || n.getState() === PoreState.OCCUPIED);
      const effElectroRedox = v.electroRedox || pore.getNeighbors().some(n => n.getState() === PoreState.OCCUPIED && (n.getResident()?.getBattery().getEnergy() ?? 0) > 40);

      const res = cell.tick({
        streamA: effStreamA,
        streamB: effStreamB,
        toxinT: effToxin,
        streamC: effStreamC,
        streamD: effStreamD,
        photonIr: effPhotonIr,
        baroAcoustic: effBaroAcoustic,
        mechanoTouch: effMechanoTouch,
        electroRedox: effElectroRedox
      });
      const totalYield = res.energyCharged + res.energyOverflow;
      if (totalYield > 0) {
        this.ledger.recordEnergyInjection(totalYield);
        if (cell.getBattery().getMatter() < 20) {
          cell.getBattery().addMatter(1);
          this.ledger.recordMatterInjection(1);
        }
      }
      if (res.energyOverflow > 0) this.ledger.recordHeatDissipation(res.energyOverflow);
      if (res.landauerBurned > 0) this.ledger.recordLandauerBurn(res.landauerBurned);
      if (res.basalLeak > 0) this.ledger.recordHeatDissipation(res.basalLeak);

      // Substrate D Nitrogen Assimilation: Yields extra matter token
      if (res.telemetry.streamDIngested) {
        cell.getBattery().addMatter(1);
        this.ledger.recordMatterInjection(1);
      }

      // Secretion of Public Goods: Siderophore Chelator & Biofilm EPS Matrix
      if (res.telemetry.chelatorSecreted) {
        pore.addChelator(1.0);
        for (const n of pore.getNeighbors()) this.activePores.add(n);
      }
      if (res.telemetry.epsSecreted) {
        pore.addEps(1.0);
        for (const n of pore.getNeighbors()) this.activePores.add(n);
      }

      // Siderophore Mineral Chelation: Solubilizes basalt rock into matter tokens (+1 matter)
      if (pore.getChelator() >= 1.0) {
        const hasBasaltNeighbor = pore.getNeighbors().some(n => n.isBasalt());
        if (hasBasaltNeighbor) {
          cell.getBattery().addMatter(1);
          this.ledger.recordMatterInjection(1);
          pore.setChelator(pore.getChelator() - 1.0);
          this.activeChelationEvents.push({ coord: pore.coord, matterYield: 1 });
        }
      }

      // Paracrine Syntrophy & Direct Cross-Feeding (Digital DIET):
      // When cell has high battery reserve (>= 85 tokens) and expressed catalytic gates, transfers energy to adjacent non-clonal neighbor with low battery (< 40)
      if (cell.getBattery().getEnergy() >= 85 && cell.getWorkshop().getBuiltGates().length > 0) {
        for (const targetPore of pore.getNeighbors()) {
          const neighborCell = targetPore.getResident();
          if (neighborCell && neighborCell.getCladeId() !== cell.getCladeId() && neighborCell.getBattery().getEnergy() < 40) {
            const transferred = cell.getBattery().drainEnergy(2);
            neighborCell.getBattery().chargeEnergy(transferred);
            this.activeSyntrophyEvents.push({ from: pore.coord, to: targetPore.coord, amount: transferred });
            break; // One cross-feeding transfer per tick
          }
        }
      }

      // Contact Predation & Weaponry:
      // If cell produces aggressive output during acid shock or actively generates counter-gradient signal inversion coupled to sensory porins
      const ws = cell.getWorkshop();
      const gates = ws.getBuiltGates();
      const hasWeapon = gates.length >= 2 && ws.hasActiveCounterGradientInversion();
      if (hasWeapon && res.telemetry.primaryActive && cell.getBattery().getEnergy() >= 30) {
        const neighbors = pore.getNeighbors().filter(p => p.getState() === PoreState.OCCUPIED);

        for (const targetPore of neighbors) {
          const prey = targetPore.getResident();
          if (!prey || prey.getCladeId() === cell.getCladeId()) continue;

          // Check if prey possesses active expressed antitoxin shield (active counter-gradient signal inversion with bound sensory porin)
          const preyShield = prey.getWorkshop().hasActiveCounterGradientInversion();
          if (!preyShield && prey.getBattery().getEnergy() > 0) {
            // Predation strike succeeds!
            const stolen = prey.getBattery().drainEnergy(15);
            const absorbed = cell.getBattery().chargeEnergy(Math.min(10, stolen));
            const dissipated = stolen - absorbed;
            if (dissipated > 0) this.ledger.recordHeatDissipation(dissipated);
            const preyDied = prey.isDead();
            this.activePredationEvents.push({
              predatorCoord: pore.coord,
              preyCoord: targetPore.coord,
              energyDrained: stolen,
              preyKilled: preyDied
            });
            if (preyDied) {
              // Vampiric Kleptoplasty: If predator has no organelle safe and prey has one (or metabolic safe with SINK_BATTERY),
              // predator assimilates prey's metabolic organelle cassette
              const preyOrganelleSafe = prey.getOrganelleSafe() ?? (prey.getWorkshop().hasBattery() ? prey.getSafe() : null);
              if (!cell.hasOrganelle() && preyOrganelleSafe && cell.getBattery().getEnergy() >= 20) {
                cell.assimilateOrganelle(preyOrganelleSafe);
                this.activeKleptoplastyEvents.push({
                  predatorCoord: pore.coord,
                  preyCoord: targetPore.coord
                });
              }

              const pSnap = prey.getBattery().getSnapshot();
              this.ledger.recordHeatDissipation(pSnap.energy - Math.floor(pSnap.energy * 0.5));
              this.ltee.recordDeath();
              targetPore.triggerLysis();
            }
            break; // One predation event per tick
          }
        }
      }
    }
  }

  private stepReproduction(): void {
    const activeSnapshot = Array.from(this.activePores);
    for (const pore of activeSnapshot) {
      const cell = pore.getResident();
      if (!cell || !cell.isDivisionReady()) continue;

      const neighbors = pore.getNeighbors();
      let emptySubstrates = neighbors.filter(p => !p.isAqueous() && !p.isBasalt() && p.getState() === PoreState.EMPTY);

      // Apical / Meristematic Peripheral Growth:
      // If interior cell of an adhered colony is surrounded by sister cells,
      // delegate cleavage energy along its morphogenetic polarity axis to the colony's open boundary
      if (emptySubstrates.length === 0 && (cell.isColonial() || cell.getMorphogeneticPlan().hasAdhesion)) {
        const plan = cell.getMorphogeneticPlan();
        const pDir = plan.primaryDirection;
        const [dq, dr] = HexCoord3D.PLANAR_DIRECTIONS[pDir];
        for (let dist = 2; dist <= 4; dist++) {
          const probeCoord = pore.coord.add(dq * dist, dr * dist, 0);
          const p = this.poreMap.get(probeCoord.toKey());
          if (p && !p.isAqueous() && !p.isBasalt() && p.getState() === PoreState.EMPTY) {
            emptySubstrates = [p];
            break;
          }
        }
      }

      if (emptySubstrates.length > 0) {
        let target: Pore | undefined;
        if (emptySubstrates.length === 1) {
          target = emptySubstrates[0];
        } else {
          const ventTele = this.vent.getTelemetry(this.tickCount);
          target = TreadmillingEngine.selectDirectionalCleavageTarget({
            parentPore: pore,
            cell,
            candidatePores: emptySubstrates,
            vent: ventTele,
            occupiedPores: this.pores.filter(p => p.getState() === PoreState.OCCUPIED),
            prng: this.prng
          });
        }

        const daughter = cell.reproduce(this.prng, {
          mutationRate: this.mutationRate,
          duplicationRate: this.duplicationRate,
          deletionRate: this.deletionRate
        });
        target.setResident(daughter);
        this.registerActivePore(target);
        this.ltee.recordBirth(daughter.getGeneration());
      } else {
        // Overcrowded niche: Check for EMERGENT PELAGIC SPORING
        // Strictly requires evolved FtsZ cleavage machinery (SINK_SEPTUM) AND regulatory logic (>= 2 gates)
        const snap = cell.getBattery().getSnapshot();
        const hasSporeAdaptation = cell.hasSporeAdaptation();

        if (hasSporeAdaptation && snap.matter >= 18 && snap.energy >= 50) {
          const upPore = this.poreMap.get(`${pore.coord.q},${pore.coord.r},${pore.coord.z + 1}`);
          const aqueous = (upPore && upPore.isAqueous() && !upPore.hasSpore())
            ? [upPore]
            : neighbors.filter(p => p.isAqueous() && !p.hasSpore());

          if (aqueous.length > 0) {
            const daughter = cell.reproduce(this.prng, {
          mutationRate: this.mutationRate,
          duplicationRate: this.duplicationRate,
          deletionRate: this.deletionRate
        });
            this.ltee.recordBirth(daughter.getGeneration());
            const dSnap = daughter.getBattery().getSnapshot();
            aqueous[0].setSpore({
              safe: daughter.getSafe(),
              organelleSafe: daughter.getOrganelleSafe(),
              generation: daughter.getGeneration(),
              energy: dSnap.energy,
              matter: dSnap.matter,
              ticksRemaining: Pore.DEFAULT_SPORE_LIFESPAN,
              id: daughter.getId(),
              parentId: daughter.getParentId(),
              cladeId: daughter.getCladeId()
            });
            this.registerActivePore(aqueous[0]);
            this.activeSporeEjections.push({
              sourceCoord: pore.coord,
              targetCoord: aqueous[0].coord
            });
          }
        }
        // If not eligible: Contact Inhibition halts division, holding cellular energy.
      }
    }
  }

  private stepTreadmilling(): void {
    const ventTele = this.vent.getTelemetry(this.tickCount);
    for (const component of this.cachedColonyComponents) {
      if (component.length >= 4) {
        const events = TreadmillingEngine.executeTrailingEdgeResorption(component, ventTele, this.tickCount, this.ledger);
        this.activeTreadmillingEvents.push(...events);
      }
    }
  }

  public getKinematicsRecorder(): ColonyKinematicsRecorder {
    return this.kinematicsRecorder;
  }

  /**
   * Lynn Margulis Symbiogenesis & Macro-Silicoid Syncytium:
   * Adjacent mature cells from distinct lineages fuse into composite chimeric operons,
   * equalizing battery stores and forming resilient multi-pore macro-silicoids.
   */
  private stepEndosymbiosis(): void {
    EndosymbiosisEngine.step({
      pores: this.pores,
      prng: this.prng,
      activeEndosymbiosisEvents: this.activeEndosymbiosisEvents
    });
  }

  private stepSyncytialHomeostasis(): void {
    this.cachedColonyComponents = [];
    const visited = new Set<string>();

    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell || visited.has(pore.coord.toKey())) {
        continue;
      }

      const syncId = cell.getSyncytiumId() || (cell.getCladeId().startsWith('chimeric-') ? `sync-${cell.getCladeId()}` : null);
      const cellClade = cell.getCladeId();

      const cluster: Pore[] = [];
      const queue: Pore[] = [pore];
      let qHead = 0;
      visited.add(pore.coord.toKey());

      while (qHead < queue.length) {
        const curr = queue[qHead++];
        cluster.push(curr);

        const neighbors = curr.getNeighbors().filter(p => p.getState() === PoreState.OCCUPIED);

        for (const n of neighbors) {
          const nCell = n.getResident();
          if (!nCell || visited.has(n.coord.toKey())) continue;

          let belongs = false;
          if (syncId !== null) {
            const nSyncId = nCell.getSyncytiumId() || (nCell.getCladeId().startsWith('chimeric-') ? `sync-${nCell.getCladeId()}` : null);
            belongs = (nSyncId === syncId);
          } else {
            // Contiguous isogenic colony of the same clade
            belongs = (nCell.getCladeId() === cellClade && nCell.getSyncytiumId() === null);
          }

          if (belongs) {
            visited.add(n.coord.toKey());
            queue.push(n);
          }
        }
      }

      // Multicellular syncytial homeostasis: pool resources across connected colony members
      // Uncapped: supports macro-organisms across arbitrary seafloor extents
      if (cluster.length >= 2) {
        this.cachedColonyComponents.push(cluster);

        // Only true syncytia (explicit syncytiumId or chimeric) perform cytoplasmic gap-junction pooling
        // Standard clonal colonies retain individual metabolic autonomy while participating in treadmilling motility
        if (syncId !== null) {
          let totalEnergy = 0;
          let totalMatter = 0;
          for (const p of cluster) {
            const res = p.getResident()!;
            totalEnergy += res.getBattery().getEnergy();
            totalMatter += res.getBattery().getMatter();
          }

          const count = cluster.length;
          const eShare = Math.floor(totalEnergy / count);
          const eRem = totalEnergy % count;
          const mShare = Math.floor(totalMatter / count);
          const mRem = totalMatter % count;

          for (let i = 0; i < count; i++) {
            const res = cluster[i].getResident()!;
            const curE = res.getBattery().getEnergy();
            const curM = res.getBattery().getMatter();
            const targetE = eShare + (i < eRem ? 1 : 0);
            const targetM = mShare + (i < mRem ? 1 : 0);

            res.getBattery().drainEnergy(curE);
            res.getBattery().chargeEnergy(targetE);

            if (targetM > curM) {
              res.getBattery().addMatter(targetM - curM);
            } else if (targetM < curM) {
              res.getBattery().spendMatter(curM - targetM);
            }
          }
        }
      }
    }
  }

  private stepSpores(): void {
    PelagicSporeEngine.step({
      pores: this.pores,
      poreMap: this.poreMap,
      minZ: this.currentMinZ,
      ledger: this.ledger,
      geologicalEngine: this.geologicalEngine,
      prng: this.prng,
      onSporeSettled: (pore) => this.registerActivePore(pore)
    });
  }

  private stepLysisAndScavenging(): void {
    ScavengingEngine.step({
      pores: this.pores,
      poreMap: this.poreMap,
      ledger: this.ledger,
      ltee: this.ltee,
      prng: this.prng,
      activeScavengeEvents: this.activeScavengeEvents
    });
  }

  private stepCarcassDecay(): void {
    for (const pore of this.pores) {
      if (pore.getState() === PoreState.CARCASS) {
        const c = pore.getCarcass();
        if (c && c[2] <= 1) {
          this.ledger.recordHeatDissipation(c[0]);
          this.ledger.recordMatterSedimentation(c[1]);
        }
        pore.stepDetritus();
      }
    }
  }

  public exportTelemetry(): ISimulationTelemetry {
    if (!this.telemetryDirty && this.cachedTelemetry !== null) {
      return this.cachedTelemetry;
    }

    let living = 0, carcass = 0, empty = 0, sporeCount = 0;
    let storedEnergy = 0, livingMatter = 0, carcassMatter = 0;
    const cladeData: { generation: number; cladeFounderId: string }[] = [];

    // Process pre-discovered multi-pore syncytial colonies (Zero duplicate BFS)
    const syncytialColonies: ISyncytialColonyTelemetry[] = [];
    const coordToColony = new Map<string, ISyncytialColonyTelemetry>();
    let macroSilicoidCount = 0;

    for (const component of this.cachedColonyComponents) {
      if (component.length < 2) continue;
      const firstCell = component[0].getResident();
      if (!firstCell) continue;
      const syncId = firstCell.getSyncytiumId() || (firstCell.getCladeId().startsWith('chimeric-') ? `sync-${firstCell.getCladeId()}` : `colony-${firstCell.getCladeId()}-${component[0].coord.toKey()}`);

      macroSilicoidCount++;
      let colE = 0, colM = 0;
      const roles: IDifferentiatedCellRole[] = [];
      const expressionSignatures = new Set<string>();

        for (const p of component) {
          const res = p.getResident();
          if (res) {
            colE += res.getBattery().getEnergy();
            colM += res.getBattery().getMatter();

            const ws = res.getWorkshop();
            const gates = ws.getBuiltGates();
            const sig = ws.getExpressionSignature() || gates.map(g => g.output ? '1' : '0').join('');
            expressionSignatures.add(sig);

            const primaryActive = gates.length > 0 ? gates[gates.length - 1].output : false;
            const hasNot = ws.hasActiveCounterGradientInversion();
            const distToVent = p.coord.distanceTo(this.vent.nozzleCoord);

            let roleName = 'Basalt Anchor (Storage)';
            if (primaryActive && distToVent <= 2) {
              roleName = 'Trophocyte (Vent Feeder)';
            } else if (hasNot) {
              roleName = 'Somatic Shield (Toxin Inverter)';
            } else if (primaryActive) {
              roleName = 'Metabolic Co-Catalyst';
            } else if (ws.hasAllostericRegulationCapability()) {
              roleName = 'Pacemaker Oscillator';
            }

            roles.push({
              coord: p.coord,
              roleName,
              expressionSignature: sig,
              primaryActive
            });
          }
        }

        const bodyTopology = this.classifyColonyTopology(component);
        const isDifferentiated = expressionSignatures.size > 1;

        const colonyRecord: ISyncytialColonyTelemetry = {
          colonyId: syncId,
          cladeId: firstCell.getCladeId(),
          memberCoords: component.map(p => p.coord),
          totalEnergy: colE,
          totalMatter: colM,
          bodyTopology,
          isDifferentiated,
          distinctExpressionCount: expressionSignatures.size,
          differentiatedRoles: roles
        };
        syncytialColonies.push(colonyRecord);
        for (const p of component) {
          coordToColony.set(p.coord.toKey(), colonyRecord);
        }
      }

    const EMPTY_ARRAY: readonly string[] = Object.freeze([]);
    const poreTelemetries = this.poreTelemetries;
    const numPores = this.pores.length;

    // Aggregate active phylogenetic clades directly during single pore traversal
    const cladeMap = new Map<string, {
      count: number;
      maxGen: number;
      totalEnergy: number;
      sampleCoord: HexCoord3D;
      tape: string;
      gates: readonly string[];
    }>();

    for (let i = 0; i < numPores; i++) {
      const pore = this.pores[i];
      const pt = poreTelemetries[i] as { -readonly [K in keyof IPoreTelemetry]: IPoreTelemetry[K] };
      const isBasalt = pore.isBasalt();
      const state = pore.getState(), cell = pore.getResident();
      let energy = 0, matter = 0, age = 0, gen = 0, catYield = 0, toggles = 0, active = false;
      let gateTypes: readonly string[] = EMPTY_ARRAY, tape = '';
      let hasOrganelle = false, organelleTape = '';
      let organelleGateTypes: readonly string[] = EMPTY_ARRAY;

      if (cell) {
        living++;
        energy = cell.getBattery().getEnergy();
        matter = cell.getBattery().getMatter();
        age = cell.getAge();
        gen = cell.getGeneration();
        const ws = cell.getWorkshop();
        gateTypes = ws.getGateTypeNames();
        const gates = ws.getBuiltGates();
        active = gates.length > 0 ? gates[gates.length - 1].output : false;
        tape = cell.getSafe().getTape();
        storedEnergy += energy;
        livingMatter += matter;
        cladeData.push({ generation: gen, cladeFounderId: cell.getCladeId() });

        const lastRes = cell.getLastTickResult();
        if (lastRes) {
          catYield = Math.max(lastRes.energyCharged + lastRes.energyOverflow, lastRes.telemetry.catalyticYield);
          toggles = lastRes.telemetry.toggleCount;
        } else {
          catYield = 0;
          toggles = 0;
        }

        const cId = cell.getCladeId();
        const existing = cladeMap.get(cId);
        if (existing) {
          existing.count++;
          if (gen > existing.maxGen) existing.maxGen = gen;
          existing.totalEnergy += energy;
        } else {
          cladeMap.set(cId, {
            count: 1,
            maxGen: gen,
            totalEnergy: energy,
            sampleCoord: pore.coord,
            tape: tape,
            gates: gateTypes
          });
        }

        if (cell.hasOrganelle()) {
          hasOrganelle = true;
          organelleTape = cell.getOrganelleSafe()?.getTape() ?? '';
          const oWs = cell.getOrganelleWorkshop();
          organelleGateTypes = oWs ? oWs.getGateTypeNames() : EMPTY_ARRAY;
        }
      } else if (state === PoreState.CARCASS) {
        carcass++;
        const c = pore.getCarcass();
        if (c) { energy = c[0]; matter = c[1]; storedEnergy += energy; carcassMatter += matter; }
      } else {
        empty++;
      }
      const sp = pore.getSpore();
      if (sp) {
        sporeCount++;
        storedEnergy += sp.energy;
        livingMatter += sp.matter;
        if (sp.cladeId) {
          cladeData.push({ generation: sp.generation, cladeFounderId: sp.cladeId });
          if (!cell) {
            const existingSp = cladeMap.get(sp.cladeId);
            if (existingSp) {
              existingSp.count++;
              if (sp.generation > existingSp.maxGen) existingSp.maxGen = sp.generation;
              existingSp.totalEnergy += sp.energy;
            } else {
              cladeMap.set(sp.cladeId, {
                count: 1,
                maxGen: sp.generation,
                totalEnergy: sp.energy,
                sampleCoord: pore.coord,
                tape: '',
                gates: EMPTY_ARRAY
              });
            }
          }
        }
      }

      const colony = coordToColony.get(pore.coord.toKey());
      const isSyncytium = colony !== undefined;
      const bodyTopology = colony ? colony.bodyTopology : (cell ? cell.getMorphogeneticPlan().preferredTopology : undefined);

      pt.state = state;
      pt.energy = energy;
      pt.matter = matter;
      pt.age = age;
      pt.generation = gen;
      pt.gateCount = gateTypes.length;
      pt.gateTypes = gateTypes;
      pt.hasSpore = pore.hasSpore();
      pt.tapeBitstring = tape;
      pt.catalyticYield = catYield;
      pt.toggleCount = toggles;
      pt.primaryActive = active;
      pt.id = cell?.getId() ?? sp?.id;
      pt.parentId = cell?.getParentId() ?? sp?.parentId ?? null;
      pt.cladeId = cell?.getCladeId() ?? sp?.cladeId;
      pt.hasOrganelle = hasOrganelle;
      pt.organelleTape = organelleTape;
      pt.organelleGateTypes = organelleGateTypes;
      pt.isSyncytium = isSyncytium;
      pt.syncytiumId = colony?.colonyId;
      pt.syncytiumMemberCount = colony?.memberCoords.length;
      pt.bodyTopology = bodyTopology;
      pt.isDifferentiated = colony?.isDifferentiated ?? false;
      pt.hasSeptum = cell?.hasSeptum() ?? false;
      pt.hasSporeAdaptation = cell?.hasSporeAdaptation() ?? false;
      pt.operonStates = cell?.getWorkshop().getOperonStates();
      pt.expressedGateCount = cell?.getWorkshop().getExpressedGateCount();
      pt.repressedGateCount = cell?.getWorkshop().getRepressedGateCount();
      pt.expressionSignature = cell?.getWorkshop().getExpressionSignature();
      pt.chelator = pore.getChelator();
      pt.eps = pore.getEps();
      pt.speciesTaxon = cell ? TaxonomyNomenclature.classify({
        tapeBitstring: tape,
        gateTypes,
        generation: gen,
        isBasalt,
        hasOrganelle,
        isSyncytium,
        isDifferentiated: colony?.isDifferentiated ?? false
      }) : undefined;
    }

    const lteeReport = this.ltee.computeMetrics(this.tickCount, living, sporeCount, cladeData);
    const vState = this.vent.evaluateAt(this.vent.nozzleCoord, this.tickCount);

    const cladeSummaries: ICladeSummary[] = Array.from(cladeMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 16)
      .map(([cladeId, data]) => {
        const taxon = TaxonomyNomenclature.classify(data.tape, data.gates, data.maxGen, false);
        return {
          cladeId,
          population: data.count,
          maxGeneration: data.maxGen,
          averageEnergy: Math.round(data.totalEnergy / data.count),
          dominantMotif: taxon.commonName,
          samplePoreCoord: data.sampleCoord,
          color: taxon.auraColor
        };
      });

    const telemetry: ISimulationTelemetry = {
      tick: this.tickCount, livingCount: living, carcassCount: carcass, emptyCount: empty,
      sporeCount, totalEnergyInUniverse: storedEnergy,
      maxGeneration: lteeReport.maxGeneration, activeCladesCount: lteeReport.activeCladesCount,
      shannonDiversity: lteeReport.shannonDiversity, totalBirths: lteeReport.totalBirths,
      evolutionaryVelocity: lteeReport.evolutionaryVelocity,
      ledger: this.ledger.auditBalance(storedEnergy, livingMatter, carcassMatter),
      vent: {
        nozzleCoord: this.vent.nozzleCoord,
        offshootCoords: this.vent.getOffshoots(),
        regimeName: vState.regime,
        streamA: vState.streamA,
        streamB: vState.streamB,
        streamC: vState.streamC,
        streamD: vState.streamD,
        photonIr: vState.photonIr,
        baroAcoustic: vState.baroAcoustic,
        electroRedox: vState.electroRedox,
        toxinT: vState.toxinT,
        thermalFlux: vState.thermalFlux,
        precursorWarning: vState.precursorWarning,
        conduitChoking: vState.conduitChoking
      },
      pores: poreTelemetries,
      milestones: this.paleontologist.getMilestones(),
      predationEvents: this.activePredationEvents,
      scavengeEvents: this.activeScavengeEvents,
      sporeEjections: this.activeSporeEjections,
      endosymbiosisEvents: this.activeEndosymbiosisEvents,
      macroSilicoidCount,
      syncytialColonies,
      clades: cladeSummaries,
      activeGeologicalEvents: this.geologicalEngine.getActiveEvents(),
      tidalVector: this.geologicalEngine.currentTidalVector,
      syntrophyEvents: this.activeSyntrophyEvents,
      kleptoplastyEvents: this.activeKleptoplastyEvents,
      chelationEvents: this.activeChelationEvents
    };
    this.cachedTelemetry = telemetry;
    this.telemetryDirty = false;
    return telemetry;
  }

  public getGeologicalEngine(): GeologicalPressuresEngine {
    return this.geologicalEngine;
  }

  public getPrng(): IPrng {
    return this.prng;
  }

  public triggerGeologicalEvent(type: GeologicalEventType): IGeologicalEventRecord | null {
    const res = this.geologicalEngine.triggerEvent(type, this, this.tickCount, this.prng);
    if (res) this.telemetryDirty = true;
    return res;
  }

  public onGeologicalEvent(listener: GeologicalEventListener): () => void {
    return this.geologicalEngine.addEventListener(listener);
  }

  public depositDetritus(coord: HexCoord3D, energy: number, matter: number): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore || pore.isBasalt() || pore.isAqueous() || pore.getState() !== PoreState.EMPTY) return false;
    pore.setCarcass(energy, matter);
    this.registerActivePore(pore);
    this.ledger.recordEnergyInjection(energy);
    this.ledger.recordMatterInjection(matter);
    this.telemetryDirty = true;
    return true;
  }

  private safelyDissipateAndClearPore(pore: Pore): void {
    const resident = pore.getResident();
    if (resident) {
      const snap = resident.getBattery().getSnapshot();
      this.ledger.recordHeatDissipation(snap.energy);
      this.ledger.recordMatterSedimentation(snap.matter);
    }
    const carcass = pore.getCarcass();
    if (carcass) {
      this.ledger.recordHeatDissipation(carcass[0]);
      this.ledger.recordMatterSedimentation(carcass[1]);
    }
    const spore = pore.getSpore();
    if (spore) {
      this.ledger.recordHeatDissipation(spore.energy);
      this.ledger.recordMatterSedimentation(spore.matter);
    }
    pore.clear();
  }

  // Interactive Seafloor Tool Brush APIs
  public setPoreBasalt(coord: HexCoord3D, isBasalt: boolean): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore) return false;
    // Don't turn the primary active hydrothermal vent nozzle into basalt
    if (this.vent.nozzleCoord.equals(coord)) return false;

    if (isBasalt) {
      // 1. Enforce vertical contiguity:
      // If placing basalt at z > this.currentMinZ, make sure all pores directly underneath (z = minZ .. coord.z - 1)
      // are solid substrate (rock/basalt) rather than floating in mid-water!
      for (let z = this.currentMinZ; z < coord.z; z++) {
        const belowCoord = new HexCoord3D(coord.q, coord.r, z);
        const pBelow = this.poreMap.get(belowCoord.toKey());
        if (pBelow && pBelow.isAqueous()) {
          this.safelyDissipateAndClearPore(pBelow);
          pBelow.setMedium(PoreMedium.ROCK_SUBSTRATE);
          pBelow.setBasalt(true);
          this.grid.setBasaltObstacle(belowCoord);
        }
      }

      // Safely clear any resident, carcass, or spore so mass/energy conservation is strictly preserved
      this.safelyDissipateAndClearPore(pore);
      pore.setBasalt(true);
      pore.setMedium(PoreMedium.ROCK_SUBSTRATE);
      this.grid.setBasaltObstacle(coord);
    } else {
      pore.setBasalt(false);
      this.grid.removeBasaltObstacle(coord);
      // If above benthic floor (z > 0), restore to aqueous fluid unless part of chimney
      if (coord.z > 0) {
        const isChimney = (coord.z === 1 && coord.distanceTo(new HexCoord3D(this.vent.nozzleCoord.q, this.vent.nozzleCoord.r, 1)) <= 1) ||
                          (coord.z === 2 && coord.q === this.vent.nozzleCoord.q && coord.r === this.vent.nozzleCoord.r) ||
                          (coord.z === 1 && this.vent.getOffshoots().some(off => coord.q === off.q && coord.r === off.r));
        if (!isChimney) {
          pore.setMedium(PoreMedium.AQUEOUS_FLUID);
        }
        // Dismantle any hanging basalt directly above this cleared coordinate
        for (let z = coord.z + 1; z <= this.currentMaxZ; z++) {
          const aboveCoord = new HexCoord3D(coord.q, coord.r, z);
          const pAbove = this.poreMap.get(aboveCoord.toKey());
          if (pAbove && pAbove.isBasalt()) {
            pAbove.setBasalt(false);
            pAbove.setMedium(PoreMedium.AQUEOUS_FLUID);
            this.grid.removeBasaltObstacle(aboveCoord);
          }
        }
      }
    }
    this.telemetryDirty = true;
    return true;
  }

  public excavateHabitablePore(coord: HexCoord3D): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore) return false;
    pore.setBasalt(false);
    pore.setMedium(PoreMedium.ROCK_SUBSTRATE);
    this.grid.removeBasaltObstacle(coord);

    // If excavated above lowest bedrock (z > this.currentMinZ), ensure the column underneath is solid rock substrate
    for (let z = this.currentMinZ; z < coord.z; z++) {
      const belowCoord = new HexCoord3D(coord.q, coord.r, z);
      const pBelow = this.poreMap.get(belowCoord.toKey());
      if (pBelow && pBelow.isAqueous()) {
        pBelow.setMedium(PoreMedium.ROCK_SUBSTRATE);
      }
    }
    this.telemetryDirty = true;
    return true;
  }

  public inoculateCell(coord: HexCoord3D, safe?: GenomeSafe, initialEnergy: number = 60, initialMatter: number = 20): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore || pore.isBasalt() || pore.isAqueous() || pore.getState() !== PoreState.EMPTY) {
      return false;
    }
    const cellSafe = safe ?? GenomeSafe.createPrebioticSoup(this.prng);
    const cell = new PoreCell(cellSafe, initialEnergy, initialMatter, 0);
    pore.setResident(cell);
    this.registerActivePore(pore);
    this.ledger.recordEnergyInjection(initialEnergy);
    this.ledger.recordMatterInjection(initialMatter);
    this.telemetryDirty = true;
    return true;
  }

  /**
   * Seeds viable founder colonies across prime ecological niches:
   * 1. Hydrothermal Vent Conduits (warm redox gradients)
   * 2. Subterranean Caverns & Lava Tubes (sheltered geothermal refugia from high environmental volatility)
   * 3. Benthic Terraces & Shelves (elevated colonizing footholds)
   */
  public seedFoundersInEcosystem(options?: {
    ventCount?: number;
    subterraneanCount?: number;
    shelfCount?: number;
  }): { ventSeeded: number; cavernSeeded: number; shelfSeeded: number; totalSeeded: number } {
    let ventSeeded = 0;
    let cavernSeeded = 0;
    let shelfSeeded = 0;

    const ventLimit = options?.ventCount ?? 4;
    const cavernLimit = options?.subterraneanCount ?? 3;
    const shelfLimit = options?.shelfCount ?? 2;

    const ventCoords = [this.vent.nozzleCoord, ...this.vent.getOffshoots()];

    // 1. Hydrothermal Vent Proximity
    const ventCandidates: Pore[] = [];
    for (const vc of ventCoords) {
      const neighbors = vc.getPlanarNeighbors();
      for (const nc of neighbors) {
        const p = this.poreMap.get(nc.toKey());
        if (p && !p.isBasalt() && !p.isAqueous() && p.getState() === PoreState.EMPTY) {
          if (!ventCandidates.includes(p)) ventCandidates.push(p);
        }
      }
    }
    // Sort by proximity to primary nozzle
    ventCandidates.sort((a, b) => a.coord.distanceTo(this.vent.nozzleCoord) - b.coord.distanceTo(this.vent.nozzleCoord));
    const vToSeed = Math.min(ventLimit, ventCandidates.length);
    for (let i = 0; i < vToSeed; i++) {
      const p = ventCandidates[i];
      const safe = GenomeSafe.createPrebioticSoup(this.prng);
      // Robust initial battery stores (90 energy, 45 matter) so founders withstand turbulence and replicate
      if (this.inoculateCell(p.coord, safe, 90, 45)) {
        ventSeeded++;
      }
    }

    // 2. Subterranean Caverns & Lava Tubes (z < 0) - Volatility Refugia
    if (this.currentMinZ < 0) {
      const cavernCandidates = this.pores.filter(p =>
        p.coord.z < 0 && !p.isBasalt() && !p.isAqueous() && p.getState() === PoreState.EMPTY
      );
      for (let i = cavernCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(this.prng.nextFloat() * (i + 1));
        [cavernCandidates[i], cavernCandidates[j]] = [cavernCandidates[j], cavernCandidates[i]];
      }
      const cToSeed = Math.min(cavernLimit, cavernCandidates.length);
      for (let i = 0; i < cToSeed; i++) {
        const p = cavernCandidates[i];
        const safe = GenomeSafe.createPrebioticSoup(this.prng);
        if (this.inoculateCell(p.coord, safe, 90, 45)) {
          cavernSeeded++;
        }
      }
    }

    // 3. Elevated Benthic Terraces & Shelves (z > 0)
    const shelfCandidates = this.pores.filter(p =>
      p.coord.z > 0 && !p.isBasalt() && !p.isAqueous() && p.getState() === PoreState.EMPTY
    );
    if (shelfCandidates.length > 0) {
      for (let i = shelfCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(this.prng.nextFloat() * (i + 1));
        [shelfCandidates[i], shelfCandidates[j]] = [shelfCandidates[j], shelfCandidates[i]];
      }
      const sToSeed = Math.min(shelfLimit, shelfCandidates.length);
      for (let i = 0; i < sToSeed; i++) {
        const p = shelfCandidates[i];
        const safe = GenomeSafe.createPrebioticSoup(this.prng);
        if (this.inoculateCell(p.coord, safe, 90, 45)) {
          shelfSeeded++;
        }
      }
    }

    // Fallback: If no candidate pores found in above tiers, seed on any empty habitable seabed pore
    if (ventSeeded + cavernSeeded + shelfSeeded === 0) {
      const anyCandidates = this.pores.filter(p => !p.isBasalt() && !p.isAqueous() && p.getState() === PoreState.EMPTY);
      anyCandidates.sort((a, b) => a.coord.distanceTo(this.vent.nozzleCoord) - b.coord.distanceTo(this.vent.nozzleCoord));
      const fallbackCount = Math.min(3, anyCandidates.length);
      for (let i = 0; i < fallbackCount; i++) {
        const p = anyCandidates[i];
        const safe = GenomeSafe.createPrebioticSoup(this.prng);
        if (this.inoculateCell(p.coord, safe, 90, 45)) {
          ventSeeded++;
        }
      }
    }

    this.telemetryDirty = true;
    return {
      ventSeeded,
      cavernSeeded,
      shelfSeeded,
      totalSeeded: ventSeeded + cavernSeeded + shelfSeeded
    };
  }

  /**
   * Seeds viable founder strains and prebiotic soup packets around active hydrothermal vent conduits.
   * Useful when launching a sterile custom world in Design Studio.
   */
  public seedFoundersAroundVents(count: number = 3): number {
    return this.seedFoundersInEcosystem({
      ventCount: count,
      subterraneanCount: 0,
      shelfCount: 0
    }).ventSeeded;
  }

  public getColonyAt(coord: HexCoord3D): ISyncytialColonyTelemetry | null {
    const tele = this.exportTelemetry();
    return tele.syncytialColonies?.find(c => c.memberCoords.some(m => m.equals(coord))) ?? null;
  }

  public clearPore(coord: HexCoord3D): boolean {
    const pore = this.poreMap.get(coord.toKey());
    if (!pore) return false;
    // If it's a basalt pore, clearPore removes basalt and restores substrate/water
    if (pore.isBasalt()) {
      return this.setPoreBasalt(coord, false);
    }
    const resident = pore.getResident();
    if (resident) {
      const snap = resident.getBattery().getSnapshot();
      this.ledger.recordHeatDissipation(snap.energy);
      this.ledger.recordMatterSedimentation(snap.matter);
    }
    const carcass = pore.getCarcass();
    if (carcass) {
      this.ledger.recordHeatDissipation(carcass[0]);
      this.ledger.recordMatterSedimentation(carcass[1]);
    }
    const spore = pore.getSpore();
    if (spore) {
      this.ledger.recordHeatDissipation(spore.energy);
      this.ledger.recordMatterSedimentation(spore.matter);
    }
    pore.clear();
    this.telemetryDirty = true;
    return true;
  }

  public setVentConfiguration(nozzleCoord: HexCoord3D, offshootCount: number): void {
    const baseNozzle = new HexCoord3D(nozzleCoord.q, nozzleCoord.r, 0);
    const offshoots = SimulationWorld.computeOffshootCoords(baseNozzle, offshootCount, this.currentRadius);
    this.vent.setNozzleCoord(baseNozzle);
    this.vent.setOffshoots(offshoots);

    const safeSetRock = (coord: HexCoord3D): void => {
      const pore = this.poreMap.get(coord.toKey());
      if (!pore || !pore.isAqueous()) return;

      this.safelyDissipateAndClearPore(pore);
      pore.setMedium(PoreMedium.ROCK_SUBSTRATE);
    };

    // 1. Primary Vent Chimney Spire & Stepped Collar Buttress
    for (let z = Math.min(1, this.currentMinZ); z <= this.currentMaxZ; z++) {
      safeSetRock(new HexCoord3D(baseNozzle.q, baseNozzle.r, z));
    }
    const collarH = Math.max(1, Math.min(this.currentMaxZ - 1, Math.round(this.currentMaxZ * 0.65)));
    baseNozzle.getPlanarNeighbors().forEach(n => {
      for (let z = 1; z <= collarH; z++) {
        safeSetRock(new HexCoord3D(n.q, n.r, z));
      }
    });

    // 2. Satellite Chimney Offshoot Spires & Shoulders
    offshoots.forEach(off => {
      const offH = Math.max(2, Math.min(this.currentMaxZ - 1, Math.round(this.currentMaxZ * 0.60)));
      for (let z = 1; z <= offH; z++) {
        safeSetRock(new HexCoord3D(off.q, off.r, z));
      }
      const offCollarH = Math.max(1, offH - 1);
      off.getPlanarNeighbors().forEach(n => {
        for (let z = 1; z <= offCollarH; z++) {
          safeSetRock(new HexCoord3D(n.q, n.r, z));
        }
      });
    });
    this.telemetryDirty = true;
  }

  public updateTopographySettings(roughness: number, basaltDensity: number, maxZ?: number): void {
    this.currentTerrainRoughness = Math.max(0, Math.min(1, roughness));
    this.currentBasaltDensity = Math.max(0, Math.min(1, basaltDensity));
    if (maxZ !== undefined && maxZ <= this.grid.bounds.maxZ && maxZ >= 2) {
      this.currentMaxZ = maxZ;
    }
    // Re-verify chimney edifice heights under updated maxZ
    this.setVentConfiguration(this.vent.nozzleCoord, this.vent.getOffshoots().length);
    this.telemetryDirty = true;
  }

  public restartWithConfig(config: ISimulationConfig): void {
    this.currentRadius = config.radius ?? this.currentRadius;
    this.currentMinZ = config.minZ ?? this.currentMinZ;
    this.currentMaxZ = config.maxZ ?? this.currentMaxZ;
    this.currentBasaltDensity = config.basaltDensity ?? this.currentBasaltDensity;
    this.currentTerrainRoughness = config.terrainRoughness ?? this.currentTerrainRoughness;
    if (config.mutationRate !== undefined) this.mutationRate = config.mutationRate;
    if (config.duplicationRate !== undefined) this.duplicationRate = config.duplicationRate;
    if (config.deletionRate !== undefined) this.deletionRate = config.deletionRate;

    const seed = config.seed ?? Math.floor(Math.random() * 100000);
    this.prng = new Mulberry32Prng(seed);
    this.ledger = new ThermodynamicLedger();
    this.paleontologist = new DigitalPaleontologist();
    this.tickCount = 0;
    this.activePredationEvents = [];
    this.activeScavengeEvents = [];
    this.activeSporeEjections = [];
    this.activeEndosymbiosisEvents = [];

    const nozzle = config.ventCoord ?? this.vent.nozzleCoord;
    const offshoots = SimulationWorld.computeOffshootCoords(nozzle, config.offshootCount ?? this.vent.getOffshoots().length, this.currentRadius);
    this.vent = new VentPhysics(nozzle, 500, offshoots);
    this.grid = new HexGrid3D<Pore>(this.currentRadius, this.currentMinZ, this.currentMaxZ);

    this.buildTerrain({
      radius: this.currentRadius,
      minZ: this.currentMinZ,
      maxZ: this.currentMaxZ,
      basaltDensity: this.currentBasaltDensity,
      terrainRoughness: this.currentTerrainRoughness,
      nozzle,
      offshoots
    });

    const density = config.soupDensity ?? 0.2;
    if (density > 0) {
      this.seedPrimordialSoup(density);
    }
    this.telemetryDirty = true;
  }

  /**
   * Expands the vertical bounds of the world down to minZ = -1, creating a subterranean
   * bedrock stratum if the simulation was initialized with minZ >= 0.
   */
  private expandMinZToNegativeOne(): void {
    if (this.currentMinZ <= -1) return;
    this.currentMinZ = -1;
    (this.grid.bounds as { minZ: number }).minZ = -1;

    for (let q = -this.currentRadius; q <= this.currentRadius; q++) {
      for (let r = -this.currentRadius; r <= this.currentRadius; r++) {
        const c0 = new HexCoord3D(q, r, 0);
        if (!this.grid.isInBounds(c0)) continue;

        const subCoord = new HexCoord3D(q, r, -1);
        if (!this.poreMap.has(subCoord.toKey())) {
          const subPore = new Pore(subCoord, PoreMedium.ROCK_SUBSTRATE);
          subPore.setBasalt(true);
          this.grid.setBasaltObstacle(subCoord);
          this.grid.setItem(subCoord, subPore);
          this.pores.push(subPore);
          this.poreMap.set(subCoord.toKey(), subPore);
        }
      }
    }

    for (const pore of this.pores) {
      const neighborPores = this.grid.getValidNeighbors3D(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined);
      pore.setNeighbors(neighborPores);
    }
    this.rebuildFlatPoreTelemetries();
  }

  private recomputeNeighborPointersForColumn(q: number, r: number): void {
    const affectedCoords = [new HexCoord3D(q, r, 0), ...new HexCoord3D(q, r, 0).getPlanarNeighbors()];
    for (const ac of affectedCoords) {
      for (let z = this.currentMinZ; z <= this.currentMaxZ; z++) {
        const pore = this.poreMap.get(`${ac.q},${ac.r},${z}`);
        if (pore) {
          const neighborPores = this.grid.getValidNeighbors3D(pore.coord)
            .map(c => this.poreMap.get(c.toKey()))
            .filter((p): p is Pore => p !== undefined);
          pore.setNeighbors(neighborPores);
        }
      }
    }
  }

  /**
   * Gouges an abyssal trench / subterranean rift chasm at column (q, r).
   * Opens z = 0 through maxZ as aqueous fluid, and establishes z = -1 as a
   * habitable rock cavity on the sunken trench floor.
   * Strictly preserves closed-universe first law of thermodynamics.
   */
  public gougeTrench(coord: HexCoord3D): boolean {
    const q = coord.q;
    const r = coord.r;
    const planarDist = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    if (planarDist > this.currentRadius) return false;

    if (this.currentMinZ >= 0) {
      this.expandMinZToNegativeOne();
    }

    for (let z = this.currentMinZ; z <= this.currentMaxZ; z++) {
      const c = new HexCoord3D(q, r, z);
      const p = this.poreMap.get(c.toKey());
      if (p) {
        if (p.hasSpore()) {
          const sp = p.getSpore();
          if (sp) {
            this.ledger.recordHeatDissipation(sp.energy);
            this.ledger.recordMatterSedimentation(sp.matter);
          }
          p.setSpore(null);
        }
        if (p.getResident()) {
          const snap = p.getResident()!.getBattery().getSnapshot();
          this.ledger.recordHeatDissipation(snap.energy);
          this.ledger.recordMatterSedimentation(snap.matter);
          p.clear();
        }
        const carcass = p.getCarcass();
        if (carcass) {
          this.ledger.recordHeatDissipation(carcass[0]);
          this.ledger.recordMatterSedimentation(carcass[1]);
          p.clearCarcass();
        }
      }
    }

    const trenchFloorCoord = new HexCoord3D(q, r, -1);
    const pFloor = this.poreMap.get(trenchFloorCoord.toKey());
    if (pFloor) {
      pFloor.setBasalt(false);
      pFloor.setMedium(PoreMedium.ROCK_SUBSTRATE);
      this.grid.removeBasaltObstacle(trenchFloorCoord);
    }

    for (let z = 0; z <= this.currentMaxZ; z++) {
      const waterCoord = new HexCoord3D(q, r, z);
      const pWater = this.poreMap.get(waterCoord.toKey());
      if (pWater) {
        pWater.setBasalt(false);
        pWater.setMedium(PoreMedium.AQUEOUS_FLUID);
        this.grid.removeBasaltObstacle(waterCoord);
      }
    }

    this.recomputeNeighborPointersForColumn(q, r);
    this.telemetryDirty = true;
    return true;
  }

  /**
   * Extrudes an impassable vertical basalt barrier wall up to the specified height at column (q, r).
   * Any pore for z <= height becomes solid basalt rock.
   * Any pore for z > height becomes aqueous fluid.
   * Strictly conserves energy and matter.
   */
  public buildBasaltWall(coord: HexCoord3D, height: number): boolean {
    const q = coord.q;
    const r = coord.r;
    const planarDist = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    if (planarDist > this.currentRadius) return false;

    if (this.vent.nozzleCoord.q === q && this.vent.nozzleCoord.r === r) {
      return false;
    }

    const clampedH = Math.max(1, Math.min(this.currentMaxZ, Math.floor(height)));

    for (let z = this.currentMinZ; z <= this.currentMaxZ; z++) {
      const c = new HexCoord3D(q, r, z);
      const pore = this.poreMap.get(c.toKey());
      if (!pore) continue;

      if (z <= clampedH) {
        if (pore.hasSpore()) {
          const sp = pore.getSpore();
          if (sp) {
            this.ledger.recordHeatDissipation(sp.energy);
            this.ledger.recordMatterSedimentation(sp.matter);
          }
          pore.setSpore(null);
        }
        if (pore.getResident()) {
          const snap = pore.getResident()!.getBattery().getSnapshot();
          this.ledger.recordHeatDissipation(snap.energy);
          this.ledger.recordMatterSedimentation(snap.matter);
          pore.clear();
        }
        const carcass = pore.getCarcass();
        if (carcass) {
          this.ledger.recordHeatDissipation(carcass[0]);
          this.ledger.recordMatterSedimentation(carcass[1]);
          pore.clearCarcass();
        }
        pore.setMedium(PoreMedium.ROCK_SUBSTRATE);
        pore.setBasalt(true);
        this.grid.setBasaltObstacle(c);
      } else {
        pore.setBasalt(false);
        pore.setMedium(PoreMedium.AQUEOUS_FLUID);
        this.grid.removeBasaltObstacle(c);
      }
    }

    this.recomputeNeighborPointersForColumn(q, r);
    this.telemetryDirty = true;
    return true;
  }

  /**
   * Places or sculpts a hydrothermal vent spire at column (q, r).
   * Spire rises up to height (default maxZ), with stepped collar shoulders around it.
   * Registers the coordinate in VentPhysics so convective thermal plumes and Stream A/B
   * flux emanate from this new chimney.
   */
  public placeVent(coord: HexCoord3D, height?: number): boolean {
    const q = coord.q;
    const r = coord.r;
    const planarDist = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    if (planarDist > this.currentRadius) return false;

    const ventH = Math.max(2, Math.min(this.currentMaxZ, height ?? this.currentMaxZ));
    const ventBase = new HexCoord3D(q, r, 0);

    const isPrimary = (this.vent.nozzleCoord.q === q && this.vent.nozzleCoord.r === r);
    if (!isPrimary) {
      const existing = this.vent.getOffshoots().filter(off => !(off.q === q && off.r === r));
      existing.push(ventBase);
      this.vent.setOffshoots(existing);
    }

    const safeSetRock = (c: HexCoord3D): void => {
      const pore = this.poreMap.get(c.toKey());
      if (!pore) return;
      this.safelyDissipateAndClearPore(pore);
      pore.setBasalt(false);
      this.grid.removeBasaltObstacle(c);
      pore.setMedium(PoreMedium.ROCK_SUBSTRATE);
    };

    for (let z = this.currentMinZ; z <= ventH; z++) {
      safeSetRock(new HexCoord3D(q, r, z));
    }
    for (let z = ventH + 1; z <= this.currentMaxZ; z++) {
      const waterCoord = new HexCoord3D(q, r, z);
      const p = this.poreMap.get(waterCoord.toKey());
      if (p) {
        p.setBasalt(false);
        p.setMedium(PoreMedium.AQUEOUS_FLUID);
        this.grid.removeBasaltObstacle(waterCoord);
      }
    }

    const collarH = Math.max(1, ventH - 1);
    ventBase.getPlanarNeighbors().forEach(n => {
      if (this.grid.isInBounds(n)) {
        for (let z = Math.min(0, this.currentMinZ); z <= collarH; z++) {
          safeSetRock(new HexCoord3D(n.q, n.r, z));
        }
        this.recomputeNeighborPointersForColumn(n.q, n.r);
      }
    });

    this.recomputeNeighborPointersForColumn(q, r);
    this.telemetryDirty = true;
    return true;
  }

  public removeVent(coord: HexCoord3D): boolean {
    const q = coord.q;
    const r = coord.r;
    const offshoots = this.vent.getOffshoots();
    const idx = offshoots.findIndex(off => off.q === q && off.r === r);
    if (idx < 0) return false;

    const updated = [...offshoots];
    updated.splice(idx, 1);
    this.vent.setOffshoots(updated);

    for (let z = 1; z <= this.currentMaxZ; z++) {
      const waterCoord = new HexCoord3D(q, r, z);
      const p = this.poreMap.get(waterCoord.toKey());
      if (p) {
        this.safelyDissipateAndClearPore(p);
        p.setBasalt(false);
        p.setMedium(PoreMedium.AQUEOUS_FLUID);
        this.grid.removeBasaltObstacle(waterCoord);
      }
    }

    this.recomputeNeighborPointersForColumn(q, r);
    this.telemetryDirty = true;
    return true;
  }

  /**
   * Loads a comprehensive .siliquarium environment preset into the world.
   * Reconfigures grid bounds, geomorphology, hydrothermal vents, basalt walls,
   * trenches, physical volatility, and inoculates founder strains.
   */
  public loadEnvironmentPreset(preset: ISiliquariumEnvironmentPreset, preserveCells: boolean = false): void {
    this.activePreset = preset;

    const radius = preset.grid.radius;
    const minZ = preset.grid.minZ ?? -1;
    const maxZ = preset.grid.maxZ ?? 4;

    this.currentRadius = radius;
    this.currentMinZ = minZ;
    this.currentMaxZ = maxZ;

    const preservedCells: Array<{ coordKey: string; cell: PoreCell }> = [];
    if (preserveCells) {
      for (const p of this.pores) {
        if (p.getState() === PoreState.OCCUPIED && p.getResident()) {
          preservedCells.push({ coordKey: p.coord.toKey(), cell: p.getResident()! });
        } else if (p.getState() === PoreState.CARCASS) {
          const c = p.getCarcass();
          if (c) {
            this.ledger.recordHeatDissipation(c[0]);
            this.ledger.recordMatterSedimentation(c[1]);
          }
        }
        const sp = p.getSpore();
        if (sp) {
          this.ledger.recordHeatDissipation(sp.energy);
          this.ledger.recordMatterSedimentation(sp.matter);
        }
      }
    } else {
      this.tickCount = 0;
      this.ledger = new ThermodynamicLedger();
      this.paleontologist = new DigitalPaleontologist();
      this.activePredationEvents = [];
      this.activeScavengeEvents = [];
      this.activeSporeEjections = [];
      this.activeEndosymbiosisEvents = [];
    }

    const ventConfigs = preset.grid.vents;
    const primaryVentConfig = ventConfigs[0] ?? { q: 0, r: 0, z: 0, height: maxZ };
    const primaryNozzle = new HexCoord3D(primaryVentConfig.q, primaryVentConfig.r, 0);
    const offshootCoords = ventConfigs.slice(1).map(v => new HexCoord3D(v.q, v.r, 0));

    this.vent = new VentPhysics(primaryNozzle, 500, offshootCoords);
    this.vent.plumeWanderingEnabled = preset.environment.plumeWandering ?? true;
    this.vent.regimeCyclingEnabled = preset.environment.regimeCycling ?? true;

    if (preset.environment.geodynamics) {
      this.geologicalEngine.setConfig({
        masterActivityRate: preset.environment.eventVolatility,
        ...preset.environment.geodynamics
      });
    } else if (preset.environment.eventVolatility !== undefined) {
      this.geologicalEngine.setConfig({ masterActivityRate: preset.environment.eventVolatility });
    }

    this.grid = new HexGrid3D<Pore>(this.currentRadius, this.currentMinZ, this.currentMaxZ);
    this.pores.length = 0;
    this.poreMap.clear();
    this.activePores.clear();

    const basaltSet = new Set<string>();
    if (preset.grid.basaltCoords) {
      for (const b of preset.grid.basaltCoords) {
        basaltSet.add(`${b.q},${b.r},${b.z}`);
      }
    }

    const trenchSet = new Set<string>();
    if (preset.grid.trenchCoords) {
      for (const t of preset.grid.trenchCoords) {
        trenchSet.add(`${t.q},${t.r}`);
      }
    }

    const heightMap = new Map<string, number>();
    for (const v of ventConfigs) {
      const vH = v.height ?? maxZ;
      heightMap.set(`${v.q},${v.r}`, vH);
      const collarH = Math.max(1, vH - 1);
      new HexCoord3D(v.q, v.r, 0).getPlanarNeighbors().forEach(n => {
        const cur = heightMap.get(`${n.q},${n.r}`) ?? 0;
        heightMap.set(`${n.q},${n.r}`, Math.max(cur, collarH));
      });
    }

    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const c0 = new HexCoord3D(q, r, 0);
        if (!this.grid.isInBounds(c0)) continue;

        const isTrench = trenchSet.has(`${q},${r}`);
        const colHeight = isTrench ? -1 : (heightMap.get(`${q},${r}`) ?? 0);

        for (let z = minZ; z <= maxZ; z++) {
          const coord = new HexCoord3D(q, r, z);
          if (!this.grid.isInBounds(coord)) continue;

          const isRock = (z <= colHeight);
          const pore = new Pore(coord, isRock ? PoreMedium.ROCK_SUBSTRATE : PoreMedium.AQUEOUS_FLUID);

          const isBasaltCoord = preset.grid.basaltCoords !== undefined
            ? basaltSet.has(coord.toKey())
            : (isRock && z < 0 && z < colHeight);

          if (isBasaltCoord) {
            pore.setBasalt(true);
            this.grid.setBasaltObstacle(coord);
          }

          this.grid.setItem(coord, pore);
          this.pores.push(pore);
          this.poreMap.set(coord.toKey(), pore);
        }
      }
    }

    for (const pore of this.pores) {
      const neighborPores = this.grid.getValidNeighbors3D(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined);
      pore.setNeighbors(neighborPores);
    }

    if (preserveCells) {
      for (const entry of preservedCells) {
        const pore = this.poreMap.get(entry.coordKey);
        if (pore && !pore.isBasalt() && !pore.isAqueous() && pore.getState() === PoreState.EMPTY && pore.setResident(entry.cell)) {
          this.registerActivePore(pore);
        } else {
          const snap = entry.cell.getBattery().getSnapshot();
          this.ledger.recordHeatDissipation(snap.energy);
          this.ledger.recordMatterSedimentation(snap.matter);
        }
      }
    } else if (preset.founderStrains && preset.founderStrains.length > 0) {
      for (const strain of preset.founderStrains) {
        const coord = new HexCoord3D(strain.q, strain.r, strain.z);
        const pore = this.poreMap.get(coord.toKey());
        if (pore && !pore.isBasalt() && !pore.isAqueous() && pore.getState() === PoreState.EMPTY) {
          const safe = new GenomeSafe(strain.tapeBitstring);
          const cell = new PoreCell(safe, strain.energy ?? 60, strain.matter ?? 20, 0);
          pore.setResident(cell);
          this.ledger.recordEnergyInjection(strain.energy ?? 60);
          this.ledger.recordMatterInjection(strain.matter ?? 20);
        }
      }
    } else {
      // Auto-seed viable founder colonies so worlds without explicit founderStrains are never sterile
      this.seedFoundersInEcosystem();
    }

    this.rebuildFlatPoreTelemetries();
    this.syncActivePores();
    this.telemetryDirty = true;
  }

  /**
   * Instantiates a fresh Siliquarium world of specified lattice radius, depth, and geomorphology.
   * Supports both:
   * 1. Blank Canvas: Flat bare bedrock at z=0 (zero barriers) ready for immediate custom drawing/sculpting.
   * 2. Procedural Random Seafloor: Topographically synthesized stepped terraces, basalt mesas, and vents
   *    parameterized by basalt barrier density % and relief/roughness %.
   * Automatically seeds viable founder colonies in ecological niches (vents, caverns, shelves) by default.
   * Resets the simulation clock to tick 0 and audits thermodynamic conservation.
   */
  public createNewSiliquarium(
    radiusOrOptions: number | INewSiliquariumOptions,
    minZ: number = 0,
    maxZ: number = 4,
    template: 'none' | 'empty' | 'single_vent' | 'twin_vents' = 'empty'
  ): void {
    let radius = 6;
    let actualMinZ = minZ;
    let actualMaxZ = maxZ;
    let mode: 'blank' | 'procedural' = 'blank';
    let actualTemplate = template;
    let basaltDensity = 0.15;
    let terrainRoughness = 0.35;
    let subterraneanNiches = 0.35;
    let blankSubstrate: 'solid_basalt' | 'habitable_caverns' | 'aqueous_void' = 'solid_basalt';
    let offshootCount = 1;
    let seed: number | undefined;
    let seedingMode: 'founders' | 'soup' | 'biobank' | 'sterile' = 'founders';

    if (typeof radiusOrOptions === 'object') {
      radius = radiusOrOptions.radius;
      actualMinZ = radiusOrOptions.minZ ?? 0;
      actualMaxZ = radiusOrOptions.maxZ ?? 4;
      mode = radiusOrOptions.mode ?? 'blank';
      actualTemplate = radiusOrOptions.template ?? 'empty';
      basaltDensity = radiusOrOptions.basaltDensity ?? 0.15;
      terrainRoughness = radiusOrOptions.terrainRoughness ?? 0.35;
      subterraneanNiches = radiusOrOptions.subterraneanNiches ?? 0.35;
      blankSubstrate = radiusOrOptions.blankSubstrate ?? 'solid_basalt';
      offshootCount = radiusOrOptions.offshootCount ?? 1;
      seed = radiusOrOptions.seed;
      seedingMode = radiusOrOptions.seedingMode ?? (mode === 'procedural' ? 'founders' : 'sterile');
    } else {
      radius = radiusOrOptions;
      actualMinZ = minZ;
      actualMaxZ = maxZ;
      actualTemplate = template;
      mode = 'blank';
      subterraneanNiches = 0.35;
      blankSubstrate = 'solid_basalt';
      seedingMode = 'sterile';
    }

    if (seed !== undefined) {
      this.prng = new Mulberry32Prng(seed);
    }

    this.currentRadius = radius;
    this.currentMinZ = actualMinZ;
    this.currentMaxZ = actualMaxZ;

    if (mode === 'procedural') {
      this.currentBasaltDensity = basaltDensity;
      this.currentTerrainRoughness = terrainRoughness;
      const nozzle = new HexCoord3D(0, 0, 0);
      const offshoots = SimulationWorld.computeOffshootCoords(nozzle, offshootCount, radius);
      this.vent = new VentPhysics(nozzle, 500, offshoots);
      this.grid = new HexGrid3D<Pore>(radius, actualMinZ, actualMaxZ);

      this.buildTerrain({
        radius,
        minZ: actualMinZ,
        maxZ: actualMaxZ,
        basaltDensity,
        terrainRoughness,
        nozzle,
        offshoots,
        subterraneanNiches,
        blankSubstrate: 'solid_basalt'
      });

      this.tickCount = 0;
      this.ledger = new ThermodynamicLedger();
      this.paleontologist = new DigitalPaleontologist();
      this.activePredationEvents = [];
      this.activeScavengeEvents = [];
      this.activeSporeEjections = [];
      this.activeEndosymbiosisEvents = [];

      // Seed Initial Ecosystem by Strategy
      if (seedingMode === 'founders') {
        this.seedFoundersInEcosystem();
      } else if (seedingMode === 'soup') {
        this.seedPrimordialSoup(0.20);
      } else if (seedingMode === 'biobank') {
        this.seedFoundersInEcosystem({ ventCount: 4, subterraneanCount: 3, shelfCount: 2 });
      }

      this.rebuildFlatPoreTelemetries();
      this.telemetryDirty = true;

      const livingStrains: IFounderStrainInoculation[] = [];
      for (const p of this.pores) {
        if (p.getState() === PoreState.OCCUPIED && p.getResident()) {
          const res = p.getResident()!;
          livingStrains.push({
            name: 'Founder Silicoid',
            taxonBinomial: 'Pioneerosilicon primus',
            tapeBitstring: res.getSafe().getTape(),
            q: p.coord.q,
            r: p.coord.r,
            z: p.coord.z,
            energy: res.getBattery().getEnergy(),
            matter: res.getBattery().getMatter()
          });
        }
      }

      const basaltCoords = this.pores.filter(p => p.isBasalt()).map(p => ({ q: p.coord.q, r: p.coord.r, z: p.coord.z }));
      const trenchCoords = this.pores
        .filter(p => p.coord.z === -1 && !p.isBasalt() && this.poreMap.get(`${p.coord.q},${p.coord.r},0`)?.isAqueous())
        .map(p => ({ q: p.coord.q, r: p.coord.r, z: p.coord.z }));
      const vents: IVentConfig[] = [
        { q: nozzle.q, r: nozzle.r, z: 0, height: actualMaxZ, streamA: true, streamB: true },
        ...offshoots.map(o => ({ q: o.q, r: o.r, z: 0, height: actualMaxZ, streamA: true, streamB: true }))
      ];

      const newPreset: ISiliquariumEnvironmentPreset = {
        version: '1.0.0',
        id: `procedural-siliquarium-${Date.now()}`,
        name: `Procedural Seafloor (R=${radius}, z=${actualMinZ}..${actualMaxZ})`,
        author: 'Studio Architect',
        createdAt: Date.now(),
        description: `Procedurally generated seafloor with ${Math.round(basaltDensity * 100)}% basalt, ${Math.round(terrainRoughness * 100)}% relief${actualMinZ < 0 ? `, and ${Math.round(subterraneanNiches * 100)}% subterranean niches` : ' (upward-growing water column)'}.`,
        isBuiltIn: false,
        grid: {
          radius,
          minZ: actualMinZ,
          maxZ: actualMaxZ,
          vents,
          basaltCoords,
          trenchCoords
        },
        environment: {
          baseTemperature: 350,
          landauerMultiplier: 1.0,
          eventVolatility: 0.20,
          plumeWandering: true,
          regimeCycling: true
        },
        founderStrains: livingStrains
      };

      EnvironmentPresetRegistry.getInstance().savePreset(newPreset);
      this.activePreset = newPreset;
    } else {
      // Blank Canvas Mode
      this.currentBasaltDensity = 0;
      this.currentTerrainRoughness = 0;
      const vents: IVentConfig[] = [];
      let nozzle = new HexCoord3D(0, 0, 0);
      let offshoots: HexCoord3D[] = [];

      if (actualTemplate === 'twin_vents') {
        const offset = Math.max(2, Math.floor(radius / 2));
        nozzle = new HexCoord3D(0, -offset, 0);
        offshoots = [new HexCoord3D(0, offset, 0)];
        vents.push({ q: 0, r: -offset, z: 0, height: actualMaxZ, streamA: true, streamB: true });
        vents.push({ q: 0, r: offset, z: 0, height: actualMaxZ, streamA: true, streamB: true });
      } else if (actualTemplate === 'none') {
        nozzle = new HexCoord3D(0, 0, 0);
        offshoots = [];
        // No active vents
      } else {
        // 'single_vent' or 'empty' default
        nozzle = new HexCoord3D(0, 0, 0);
        offshoots = [];
        vents.push({ q: 0, r: 0, z: 0, height: actualMaxZ, streamA: true, streamB: true });
      }

      this.vent = new VentPhysics(nozzle, 500, offshoots);
      this.grid = new HexGrid3D<Pore>(radius, actualMinZ, actualMaxZ);

      // Build pristine flat bedrock at z=0 with zero basalt obstacles
      this.buildTerrain({
        radius,
        minZ: actualMinZ,
        maxZ: actualMaxZ,
        basaltDensity: 0,
        terrainRoughness: 0,
        nozzle,
        offshoots,
        subterraneanNiches: 0,
        blankSubstrate
      });

      this.tickCount = 0;
      this.ledger = new ThermodynamicLedger();
      this.paleontologist = new DigitalPaleontologist();
      this.activePredationEvents = [];
      this.activeScavengeEvents = [];
      this.activeSporeEjections = [];
      this.activeEndosymbiosisEvents = [];

      // Seed Initial Ecosystem if requested and vents exist
      if (seedingMode === 'founders' && actualTemplate !== 'none') {
        this.seedFoundersInEcosystem();
      } else if (seedingMode === 'soup') {
        this.seedPrimordialSoup(0.20);
      } else if (seedingMode === 'biobank') {
        this.seedFoundersInEcosystem({ ventCount: 4, subterraneanCount: 3, shelfCount: 2 });
      }

      this.rebuildFlatPoreTelemetries();
      this.telemetryDirty = true;

      const livingStrains: IFounderStrainInoculation[] = [];
      for (const p of this.pores) {
        if (p.getState() === PoreState.OCCUPIED && p.getResident()) {
          const res = p.getResident()!;
          livingStrains.push({
            name: 'Founder Silicoid',
            taxonBinomial: 'Pioneerosilicon primus',
            tapeBitstring: res.getSafe().getTape(),
            q: p.coord.q,
            r: p.coord.r,
            z: p.coord.z,
            energy: res.getBattery().getEnergy(),
            matter: res.getBattery().getMatter()
          });
        }
      }

      const newPreset: ISiliquariumEnvironmentPreset = {
        version: '1.0.0',
        id: `custom-siliquarium-${Date.now()}`,
        name: `Blank Canvas (R=${radius}, z=${actualMinZ}..${actualMaxZ})`,
        author: 'Studio Architect',
        createdAt: Date.now(),
        description: `Pristine bedrock substrate (${actualMinZ < 0 ? 'subterranean z=' + actualMinZ : 'surface crust'}) ready for custom CAD painting.`,
        isBuiltIn: false,
        grid: {
          radius,
          minZ: actualMinZ,
          maxZ: actualMaxZ,
          vents,
          basaltCoords: this.pores.filter(p => p.isBasalt()).map(p => ({ q: p.coord.q, r: p.coord.r, z: p.coord.z })),
          trenchCoords: []
        },
        environment: {
          baseTemperature: 350,
          landauerMultiplier: 1.0,
          eventVolatility: 0.20,
          plumeWandering: true,
          regimeCycling: true
        },
        founderStrains: livingStrains
      };

      EnvironmentPresetRegistry.getInstance().savePreset(newPreset);
      this.activePreset = newPreset;
    }
  }

  /**
   * Captures a complete serialized state snapshot of the active world (.silisave format).
   * Fully captures living cells, carcasses, spores, PRNG bit-state, and ThermodynamicLedger conservation counters.
   */
  public captureStateSnapshot(
    name: string,
    branchId: string = 'main',
    parentSnapshotId: string | null = null,
    notes: string = ''
  ): ISimulationStateSnapshot {
    const tele = this.exportTelemetry();
    const storedPores: IStoredPoreData[] = [];

    for (const p of this.pores) {
      const cell = p.getResident();
      const carcass = p.getCarcass();
      const spore = p.getSpore();

      const pData: IStoredPoreData = {
        q: p.coord.q,
        r: p.coord.r,
        z: p.coord.z,
        medium: p.medium,
        basalt: p.isBasalt(),
        cell: cell ? cell.exportState() : null,
        carcass: carcass ? { energy: carcass[0], matter: carcass[1], decayTicksRemaining: carcass[2] } : null,
        spore: spore ? {
          id: spore.id,
          parentId: spore.parentId,
          cladeId: spore.cladeId,
          generation: spore.generation,
          tape: spore.safe.getTape(),
          energy: spore.energy,
          matter: spore.matter,
          ticksRemaining: spore.ticksRemaining
        } : null
      };
      storedPores.push(pData);
    }

    const nozzle = this.vent.nozzleCoord;
    const offshoots = this.vent.getOffshoots().map(o => ({ q: o.q, r: o.r, z: o.z }));

    return {
      format: 'silisave',
      version: '1.0.0',
      id: `snap-${Date.now()}-${Math.floor(Math.random() * 100000).toString(16)}`,
      branchId,
      parentSnapshotId,
      name,
      notes,
      timestamp: Date.now(),
      tick: this.tickCount,
      world: {
        radius: this.currentRadius,
        minZ: this.currentMinZ,
        maxZ: this.currentMaxZ,
        basaltDensity: this.currentBasaltDensity,
        terrainRoughness: this.currentTerrainRoughness,
        soupDensity: this.currentSoupDensity,
        mutationRate: this.mutationRate,
        duplicationRate: this.duplicationRate,
        deletionRate: this.deletionRate,
        prngState: this.prng.getState(),
        ledger: this.ledger.exportState(),
        vent: {
          nozzleCoord: { q: nozzle.q, r: nozzle.r, z: nozzle.z },
          offshoots,
          plumeWanderingEnabled: this.vent.plumeWanderingEnabled,
          regimeCyclingEnabled: this.vent.regimeCyclingEnabled
        },
        geological: {
          config: { ...this.geologicalEngine.getConfig() }
        },
        pores: storedPores
      },
      stats: {
        livingCount: tele.livingCount,
        carcassCount: tele.carcassCount,
        sporeCount: tele.sporeCount,
        activeCladesCount: tele.activeCladesCount,
        maxGeneration: tele.maxGeneration,
        dominantTaxon: (tele.clades && tele.clades.length > 0) ? tele.clades[0].cladeId : 'Basal Lineage',
        totalStoredEnergy: tele.totalEnergyInUniverse,
        totalStoredMatter: tele.ledger.totalMatterLiving + tele.ledger.totalMatterCarcasses
      }
    };
  }

  /**
   * Restores simulation state from a .silisave snapshot with absolute conservation (ΔE = 0.000).
   * Supports deterministic replay or stochastic / perturbed branching.
   */
  public restoreSimulationSnapshot(
    snapshot: ISimulationStateSnapshot,
    options?: {
      newPrngSeed?: number;
      volatilityMultiplier?: number;
      mutationMultiplier?: number;
    }
  ): void {
    if (snapshot.format !== 'silisave') {
      const actualFormat = String((snapshot as unknown as Record<string, unknown>).format);
      throw new Error(`Invalid snapshot format: ${actualFormat}. Expected 'silisave'.`);
    }

    // 1. Restore Grid Topology & Simulation Parameters
    this.currentRadius = snapshot.world.radius;
    this.currentMinZ = snapshot.world.minZ;
    this.currentMaxZ = snapshot.world.maxZ;
    this.currentBasaltDensity = snapshot.world.basaltDensity ?? 0.12;
    this.currentTerrainRoughness = snapshot.world.terrainRoughness ?? 0.0;
    this.currentSoupDensity = snapshot.world.soupDensity ?? 0.2;
    this.mutationRate = snapshot.world.mutationRate * (options?.mutationMultiplier ?? 1.0);
    this.duplicationRate = snapshot.world.duplicationRate;
    this.deletionRate = snapshot.world.deletionRate;
    this.tickCount = snapshot.tick;

    // 2. PRNG: Inherit exact deterministic state or seed fresh for stochastic branch
    if (options?.newPrngSeed !== undefined) {
      this.prng = new Mulberry32Prng(options.newPrngSeed);
    } else {
      this.prng = new Mulberry32Prng(42);
      this.prng.setState(snapshot.world.prngState);
    }

    // 3. Thermodynamic Ledger restoration (strict ΔE = 0.000)
    this.ledger = new ThermodynamicLedger();
    this.ledger.importState(snapshot.world.ledger);

    // 4. Vent restoration
    const ventCfg = snapshot.world.vent;
    const nozzle = new HexCoord3D(ventCfg.nozzleCoord.q, ventCfg.nozzleCoord.r, ventCfg.nozzleCoord.z);
    const offshoots = (ventCfg.offshoots || []).map(o => new HexCoord3D(o.q, o.r, o.z));
    this.vent = new VentPhysics(nozzle, 500, offshoots);
    this.vent.plumeWanderingEnabled = ventCfg.plumeWanderingEnabled ?? true;
    this.vent.regimeCyclingEnabled = ventCfg.regimeCyclingEnabled ?? true;

    // 5. Geological engine configuration & perturbation
    if (snapshot.world.geological?.config) {
      const geoCfg = { ...snapshot.world.geological.config };
      if (options?.volatilityMultiplier) {
        geoCfg.masterActivityRate = Math.min(1.0, geoCfg.masterActivityRate * options.volatilityMultiplier);
      }
      this.geologicalEngine.setConfig(geoCfg);
    }

    // 6. Reset internal caches and events
    this.pores.length = 0;
    this.poreMap.clear();
    this.activePores.clear();
    this.grid = new HexGrid3D<Pore>(this.currentRadius, this.currentMinZ, this.currentMaxZ);
    this.activePredationEvents = [];
    this.activeScavengeEvents = [];
    this.activeSporeEjections = [];
    this.activeEndosymbiosisEvents = [];
    this.activeTreadmillingEvents = [];
    this.cachedColonyComponents = [];

    // 7. Recreate pores and restore contents
    for (const pData of snapshot.world.pores) {
      const coord = new HexCoord3D(pData.q, pData.r, pData.z);
      const pore = new Pore(coord, pData.medium);
      if (pData.basalt) {
        pore.setBasalt(true);
        this.grid.setBasaltObstacle(coord);
      }

      this.grid.setItem(coord, pore);

      if (pData.cell) {
        const cell = PoreCell.fromState(pData.cell);
        pore.setResident(cell);
      } else if (pData.carcass) {
        pore.setCarcass(pData.carcass.energy, pData.carcass.matter, pData.carcass.decayTicksRemaining);
      }

      if (pData.spore) {
        const sporeSafe = new GenomeSafe(pData.spore.tape);
        pore.setSpore({
          safe: sporeSafe,
          generation: pData.spore.generation,
          id: pData.spore.id,
          parentId: pData.spore.parentId,
          cladeId: pData.spore.cladeId,
          energy: pData.spore.energy,
          matter: pData.spore.matter,
          ticksRemaining: pData.spore.ticksRemaining
        });
      }

      this.pores.push(pore);
      this.poreMap.set(coord.toKey(), pore);
    }

    // 8. Re-link hex spatial neighbors (Zero-Allocation Physics)
    for (const pore of this.pores) {
      const neighborPores = this.grid.getValidNeighbors3D(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined);
      pore.setNeighbors(neighborPores);
    }

    this.rebuildFlatPoreTelemetries();
    this.syncActivePores();

    // 9. Mark telemetry dirty to recompute full metrics
    this.telemetryDirty = true;
    this.cachedTelemetry = null;
  }

  /**
   * Captures a complete serialized state snapshot of the active world for cancel/revert in Design Studio.
   */
  public createWorldSnapshot(): string {
    const snap = this.captureStateSnapshot('Design Studio Snapshot', 'design-studio', null, 'Studio cancel backup');
    return JSON.stringify(snap);
  }

  /**
   * Restores world state from a previously captured snapshot.
   */
  public restoreWorldSnapshot(snapshotJson: string | null): void {
    if (!snapshotJson) return;
    try {
      const data = JSON.parse(snapshotJson);
      if (data.format === 'silisave') {
        this.restoreSimulationSnapshot(data);
        return;
      }

      // Legacy fallback for old studio snapshots
      const preset: ISiliquariumEnvironmentPreset = {
        version: '1.0.0',
        id: data.activePresetId || `restored-${Date.now()}`,
        name: 'Restored Environment',
        author: 'Siliquarium Engine',
        createdAt: Date.now(),
        description: 'Restored from Design Studio cancel snapshot.',
        isBuiltIn: false,
        grid: {
          radius: data.radius,
          minZ: data.minZ,
          maxZ: data.maxZ,
          vents: data.vents,
          basaltCoords: data.basaltCoords,
          trenchCoords: data.trenchCoords
        },
        environment: {
          baseTemperature: 350,
          landauerMultiplier: 1.0,
          eventVolatility: data.volatility ?? 0.20,
          plumeWandering: data.plumeWandering ?? true,
          regimeCycling: data.regimeCycling ?? true
        },
        founderStrains: data.livingStrains?.map((s: { tape: string; q: number; r: number; z: number; energy?: number; matter?: number }) => ({
          name: 'Restored Silicoid',
          taxonBinomial: 'Restored Cell',
          tapeBitstring: s.tape,
          q: s.q,
          r: s.r,
          z: s.z,
          energy: s.energy,
          matter: s.matter
        })) ?? []
      };

      this.loadEnvironmentPreset(preset, false);
      this.tickCount = data.tickCount ?? 0;
      this.mutationRate = data.mutationRate ?? this.mutationRate;
      this.duplicationRate = data.duplicationRate ?? this.duplicationRate;
      this.deletionRate = data.deletionRate ?? this.deletionRate;
      this.currentSoupDensity = data.soupDensity ?? this.currentSoupDensity;
      this.telemetryDirty = true;
    } catch (e) {
      console.error('Failed to restore world snapshot:', e);
    }
  }

  /**
   * Resets simulation to t = 0 while preserving sculpted geomorphology and environment settings.
   * Re-inoculates founder strains from the active preset (or leaves pristine cavities ready for seeding).
   */
  public resetToFounders(): void {
    if (this.activePreset) {
      this.loadEnvironmentPreset(this.activePreset, false);
      return;
    }

    this.tickCount = 0;
    this.ledger = new ThermodynamicLedger();
    this.paleontologist = new DigitalPaleontologist();
    this.activePredationEvents = [];
    this.activeScavengeEvents = [];
    this.activeSporeEjections = [];
    this.activeEndosymbiosisEvents = [];

    for (const pore of this.pores) {
      pore.clear();
      pore.setSpore(null);
      pore.clearCarcass();
    }
    this.telemetryDirty = true;
  }

  public getActivePreset(): ISiliquariumEnvironmentPreset | null {
    return this.activePreset;
  }

  public triggerThermalSurge(amount: number = 200): void {
    this.ledger.recordEnergyInjection(amount);
    const origin = this.poreMap.get(`${this.vent.nozzleCoord.q},${this.vent.nozzleCoord.r},0`) ?? this.poreMap.get('0,0,0');
    const charged = origin?.getResident()?.getBattery().chargeEnergy(Math.min(50, amount)) ?? 0;
    if (amount - charged > 0) this.ledger.recordHeatDissipation(amount - charged);
    this.telemetryDirty = true;
  }

  public triggerExtinctionEvent(center: HexCoord3D, radius: number = 2): void {
    for (const pore of this.pores) {
      if (pore.coord.distanceTo(center) <= radius && pore.getResident()) {
        const snap = pore.getResident()!.getBattery().getSnapshot();
        this.ledger.recordHeatDissipation(snap.energy - Math.floor(snap.energy * 0.5));
        this.ltee.recordDeath();
        pore.triggerLysis();
      }
    }
    this.telemetryDirty = true;
  }

  public markTelemetryDirty(): void {
    this.telemetryDirty = true;
  }

  public getPaleontologist(): DigitalPaleontologist { return this.paleontologist; }
  public getLtee(): LteeBenchmark { return this.ltee; }
  public getHistoryTracker(): EvolutionaryHistoryTracker { return this.historyTracker; }
  public getPore(coord: HexCoord3D): Pore | undefined { return this.poreMap.get(coord.toKey()); }
  public getAllPores(): readonly Pore[] { return this.pores; }
  public getTickCount(): number { return this.tickCount; }
  public setMutationRate(rate: number): void { this.mutationRate = Math.max(0, Math.min(1, rate)); }
  public getMutationRate(): number { return this.mutationRate; }
  public setDuplicationRate(rate: number): void { this.duplicationRate = Math.max(0, Math.min(1, rate)); }
  public getDuplicationRate(): number { return this.duplicationRate; }
  public setDeletionRate(rate: number): void { this.deletionRate = Math.max(0, Math.min(1, rate)); }
  public getDeletionRate(): number { return this.deletionRate; }
  public getVent(): VentPhysics { return this.vent; }
  public getRadius(): number { return this.currentRadius; }
  public getMaxZ(): number { return this.currentMaxZ; }
  public getMinZ(): number { return this.currentMinZ; }
  public getGrid(): HexGrid3D<Pore> { return this.grid; }

  /**
   * Objective Graph Theory Classification of Multicellular Body Topology.
   * Analyzes node degree distribution, clustering coefficients (triangles),
   * and spatial cycles to classify emergent body morphology.
   */
  public classifyColonyTopology(component: Pore[]): string {
    return ColonyMorphologyClassifier.classify(component);
  }

  public getSyntrophyEvents(): readonly ISyntrophyEvent[] { return this.activeSyntrophyEvents; }
  public getKleptoplastyEvents(): readonly IKleptoplastyEvent[] { return this.activeKleptoplastyEvents; }
  public getChelationEvents(): readonly IChelationEvent[] { return this.activeChelationEvents; }
  public getLedger(): ThermodynamicLedger { return this.ledger; }
}
