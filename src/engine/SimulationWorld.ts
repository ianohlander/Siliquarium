/**
 * 🐠 Siliquarium Engine Subsystem
 * SimulationWorld: Coordinates 3D HexGrid, VentPhysics, Organisms, and Conservation Ledger.
 * Zero-DOM Mandate: 100% headless, testable in Node.js and Web Workers.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { HexGrid3D } from '../core/spatial/HexGrid3D.js';
import { Pore, PoreState } from '../core/domain/Pore.js';
import { PoreCell } from '../core/domain/PoreCell.js';
import { GenomeSafe } from '../core/domain/GenomeSafe.js';
import { VentPhysics } from '../core/physics/VentPhysics.js';
import { ThermodynamicLedger } from '../core/physics/ThermodynamicLedger.js';
import { Mulberry32Prng, IPrng } from '../core/prng/SeedablePrng.js';
import { ISimulationTelemetry, IPoreTelemetry, IVentTelemetry } from './SimulationTelemetry.js';
import { DigitalPaleontologist } from './paleontology/DigitalPaleontologist.js';

export interface ISimulationConfig {
  readonly radius?: number;
  readonly minZ?: number;
  readonly maxZ?: number;
  readonly seed?: number;
  readonly mutationRate?: number;
  readonly soupDensity?: number;
}

export class SimulationWorld {
  private readonly grid: HexGrid3D<Pore>;
  private readonly vent: VentPhysics;
  private readonly ledger: ThermodynamicLedger;
  private readonly prng: IPrng;
  private readonly paleontologist: DigitalPaleontologist;
  private readonly pores: Pore[] = [];
  private readonly poreMap: Map<string, Pore> = new Map();

  private tickCount: number = 0;
  private mutationRate: number;

  constructor(config: ISimulationConfig = {}) {
    const radius = config.radius ?? 4;
    const minZ = config.minZ ?? 0;
    const maxZ = config.maxZ ?? 2;
    this.mutationRate = config.mutationRate ?? GenomeSafe.DEFAULT_MUTATION_RATE;

    this.grid = new HexGrid3D<Pore>(radius, minZ, maxZ);
    this.vent = new VentPhysics(new HexCoord3D(0, 0, 0), 500);
    this.ledger = new ThermodynamicLedger();
    this.prng = new Mulberry32Prng(config.seed ?? 42);
    this.paleontologist = new DigitalPaleontologist();

    this.buildTerrain(radius, minZ, maxZ);
    if ((config.soupDensity ?? 0) > 0) {
      this.seedPrimordialSoup(config.soupDensity ?? 0.2);
    }
  }

  private buildTerrain(radius: number, minZ: number, maxZ: number): void {
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        for (let z = minZ; z <= maxZ; z++) {
          const coord = new HexCoord3D(q, r, z);
          if (this.grid.isInBounds(coord)) {
            const pore = new Pore(coord);
            this.grid.setItem(coord, pore);
            this.pores.push(pore);
            this.poreMap.set(coord.toKey(), pore);
          }
        }
      }
    }
  }

  public seedPrimordialSoup(density: number): void {
    for (const pore of this.pores) {
      if (pore.getState() === PoreState.EMPTY && this.prng.nextFloat() < density) {
        const safe = GenomeSafe.createRandom(this.prng);
        const cell = new PoreCell(safe, 60, 20, 0);
        pore.setResident(cell);
        this.ledger.recordEnergyInjection(60);
        this.ledger.recordMatterInjection(20);
      }
    }
  }

  public step(): void {
    this.tickCount++;
    const ventState = this.vent.evaluateAt(this.vent.nozzleCoord, this.tickCount);

    this.stepCellMetabolism(ventState.streamA, ventState.streamB, ventState.toxinT);
    this.stepReproduction();
    this.stepLysisAndScavenging();
    this.stepCarcassDecay();

    // Digital Paleontologist audit (pure external voltmeter)
    const tele = this.exportTelemetry();
    this.paleontologist.auditPores(this.pores, this.tickCount, tele);
  }

  private stepCellMetabolism(rawA: boolean, rawB: boolean, rawT: boolean): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell) continue;

      const localVent = this.vent.evaluateAt(pore.coord, this.tickCount);
      const res = cell.tick(localVent.streamA && rawA, localVent.streamB && rawB, localVent.toxinT && rawT);

      if (res.telemetry.catalyticYield > 0) {
        this.ledger.recordEnergyInjection(res.telemetry.catalyticYield);
      }
      if (res.telemetry.toggleCount > 0) {
        this.ledger.recordLandauerBurn(res.telemetry.toggleCount);
      }
      if (cell.getAge() % 10 === 0) {
        this.ledger.recordHeatDissipation(1);
      }
    }
  }

  private stepReproduction(): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell || !cell.isDivisionReady()) continue;

      const emptyNeighbors = this.grid.getEmptyPlanarNeighbors(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.getState() === PoreState.EMPTY);

      if (emptyNeighbors.length > 0) {
        const targetPore = emptyNeighbors[Math.floor(this.prng.nextFloat() * emptyNeighbors.length)];
        const daughter = cell.reproduce(this.prng, this.mutationRate);
        targetPore.setResident(daughter);
      }
    }
  }

  private stepLysisAndScavenging(): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (cell && cell.isDead()) {
        const snap = cell.getBattery().getSnapshot();
        const unharvestedHeat = snap.energy - Math.floor(snap.energy * 0.5);
        this.ledger.recordHeatDissipation(unharvestedHeat);
        pore.triggerLysis();
      }
    }

    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell) continue;

      const neighborCarcasses = pore.coord.getPlanarNeighbors()
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.getState() === PoreState.CARCASS);

      if (neighborCarcasses.length > 0) {
        neighborCarcasses[0].scavenge(cell);
      }
    }
  }

  private stepCarcassDecay(): void {
    for (const pore of this.pores) {
      if (pore.getState() === PoreState.CARCASS) {
        const carcass = pore.getCarcass();
        if (carcass && carcass[2] <= 1) {
          this.ledger.recordHeatDissipation(carcass[0]);
          this.ledger.recordMatterSedimentation(carcass[1]);
        }
        pore.stepDetritus();
      }
    }
  }

  public exportTelemetry(): ISimulationTelemetry {
    let living = 0;
    let carcass = 0;
    let empty = 0;
    let totalStoredEnergy = 0;
    let totalLivingMatter = 0;
    let totalCarcassMatter = 0;

    const poreTelemetries: IPoreTelemetry[] = [];

    for (const pore of this.pores) {
      const state = pore.getState();
      const cell = pore.getResident();
      const isBasalt = this.grid.isBasaltObstacle(pore.coord);

      let energy = 0;
      let matter = 0;
      let age = 0;
      let gen = 0;
      let gateCount = 0;
      let tapeBitstring = '';
      let catalyticYield = 0;
      let toggleCount = 0;
      let primaryActive = false;

      if (cell) {
        living++;
        energy = cell.getBattery().getEnergy();
        matter = cell.getBattery().getMatter();
        age = cell.getAge();
        gen = cell.getGeneration();
        gateCount = cell.getWorkshop().getGateCount();
        tapeBitstring = cell.getSafe().getTape();
        totalStoredEnergy += energy;
        totalLivingMatter += matter;
      } else if (state === PoreState.CARCASS) {
        carcass++;
        const c = pore.getCarcass();
        if (c) {
          energy = c[0];
          matter = c[1];
          totalStoredEnergy += energy;
          totalCarcassMatter += matter;
        }
      } else {
        empty++;
      }

      poreTelemetries.push({
        coord: pore.coord,
        state,
        isBasalt,
        energy,
        matter,
        age,
        generation: gen,
        gateCount,
        tapeBitstring,
        catalyticYield,
        toggleCount,
        primaryActive
      });
    }

    const ventState = this.vent.evaluateAt(this.vent.nozzleCoord, this.tickCount);
    const ventTele: IVentTelemetry = {
      nozzleCoord: this.vent.nozzleCoord,
      streamA: ventState.streamA,
      streamB: ventState.streamB,
      toxinT: ventState.toxinT,
      thermalFlux: ventState.thermalFlux
    };

    const ledgerReport = this.ledger.auditBalance(totalStoredEnergy, totalLivingMatter, totalCarcassMatter);

    return {
      tick: this.tickCount,
      livingCount: living,
      carcassCount: carcass,
      emptyCount: empty,
      totalEnergyInUniverse: totalStoredEnergy,
      ledger: ledgerReport,
      vent: ventTele,
      pores: poreTelemetries,
      milestones: this.paleontologist.getMilestones()
    };
  }

  public getPaleontologist(): DigitalPaleontologist {
    return this.paleontologist;
  }

  public getPore(coord: HexCoord3D): Pore | undefined {
    return this.poreMap.get(coord.toKey());
  }

  public getAllPores(): readonly Pore[] {
    return this.pores;
  }

  public getTickCount(): number {
    return this.tickCount;
  }

  public setMutationRate(rate: number): void {
    this.mutationRate = Math.max(0, Math.min(1, rate));
  }

  public getMutationRate(): number {
    return this.mutationRate;
  }
}
