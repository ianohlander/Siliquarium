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
import { Mulberry32Prng, IPrng } from '../core/prng/SeedablePrng.js';
import { ISimulationTelemetry, IPoreTelemetry } from './SimulationTelemetry.js';
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
    const radius = config.radius ?? 5;
    const minZ = config.minZ ?? 0;
    const maxZ = config.maxZ ?? 2;
    this.mutationRate = config.mutationRate ?? GenomeSafe.DEFAULT_MUTATION_RATE;

    this.grid = new HexGrid3D<Pore>(radius, minZ, maxZ);
    this.vent = new VentPhysics(new HexCoord3D(0, 0, 0), 500);
    this.ledger = new ThermodynamicLedger();
    this.prng = new Mulberry32Prng(config.seed ?? 42);
    this.paleontologist = new DigitalPaleontologist();

    this.buildTerrain(radius, minZ, maxZ);
    if ((config.soupDensity ?? 0) > 0) this.seedPrimordialSoup(config.soupDensity ?? 0.2);
  }

  private buildTerrain(radius: number, minZ: number, maxZ: number): void {
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        for (let z = minZ; z <= maxZ; z++) {
          const coord = new HexCoord3D(q, r, z);
          if (this.grid.isInBounds(coord)) {
            const isChimney = (z === 1 && coord.distanceTo(new HexCoord3D(0, 0, 1)) <= 1) || (z === 2 && q === 0 && r === 0);
            const medium = (z === 0 || isChimney) ? PoreMedium.ROCK_SUBSTRATE : PoreMedium.AQUEOUS_FLUID;
            const pore = new Pore(coord, medium);
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
      if (!pore.isAqueous() && pore.getState() === PoreState.EMPTY && this.prng.nextFloat() < density) {
        const cell = new PoreCell(GenomeSafe.createRandom(this.prng), 60, 20, 0);
        pore.setResident(cell);
        this.ledger.recordEnergyInjection(60);
        this.ledger.recordMatterInjection(20);
      }
    }
  }

  public step(): void {
    this.tickCount++;
    const vState = this.vent.evaluateAt(this.vent.nozzleCoord, this.tickCount);
    this.stepCellMetabolism(vState.streamA, vState.streamB, vState.toxinT);
    this.stepReproduction();
    this.stepSpores();
    this.stepLysisAndScavenging();
    this.stepCarcassDecay();
    this.paleontologist.auditPores(this.pores, this.tickCount, this.exportTelemetry());
  }

  private stepCellMetabolism(rawA: boolean, rawB: boolean, rawT: boolean): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell) continue;
      const v = this.vent.evaluateAt(pore.coord, this.tickCount);
      const res = cell.tick(v.streamA && rawA, v.streamB && rawB, v.toxinT && rawT);
      if (res.telemetry.catalyticYield > 0) this.ledger.recordEnergyInjection(res.telemetry.catalyticYield);
      if (res.energyOverflow > 0) this.ledger.recordHeatDissipation(res.energyOverflow);
      if (res.landauerBurned > 0) this.ledger.recordLandauerBurn(res.landauerBurned);
      if (res.basalLeak > 0) this.ledger.recordHeatDissipation(res.basalLeak);
    }
  }

  private stepReproduction(): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell || !cell.isDivisionReady()) continue;

      const emptySubstrates = this.grid.getEmptyPlanarNeighbors(pore.coord)
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && !p.isAqueous() && p.getState() === PoreState.EMPTY);

      if (emptySubstrates.length > 0) {
        const target = emptySubstrates[Math.floor(this.prng.nextFloat() * emptySubstrates.length)];
        target.setResident(cell.reproduce(this.prng, this.mutationRate));
      } else {
        const aqueous = this.grid.getEmptyPlanarNeighbors(pore.coord)
          .map(c => this.poreMap.get(c.toKey()))
          .filter((p): p is Pore => p !== undefined && p.isAqueous() && !p.hasSpore());
        if (aqueous.length > 0) {
          const daughter = cell.reproduce(this.prng, this.mutationRate);
          const snap = daughter.getBattery().getSnapshot();
          aqueous[Math.floor(this.prng.nextFloat() * aqueous.length)].setSpore({
            safe: daughter.getSafe(), generation: daughter.getGeneration(),
            energy: snap.energy, matter: snap.matter, ticksRemaining: Pore.DEFAULT_SPORE_LIFESPAN
          });
        }
      }
    }
  }

  private stepSpores(): void {
    const activeSporePores = this.pores.filter(p => p.hasSpore());
    for (const pore of activeSporePores) {
      const spore = pore.getSpore();
      if (!spore) continue;

      spore.ticksRemaining--;
      if (spore.ticksRemaining <= 0) {
        this.ledger.recordHeatDissipation(spore.energy);
        this.ledger.recordMatterSedimentation(spore.matter);
        pore.setSpore(null);
        continue;
      }

      const settleCandidates = [
        new HexCoord3D(pore.coord.q, pore.coord.r, Math.max(0, pore.coord.z - 1)),
        ...pore.coord.getPlanarNeighbors()
      ].map(c => this.poreMap.get(c.toKey()))
       .filter((p): p is Pore => p !== undefined && !p.isAqueous() && p.getState() === PoreState.EMPTY);

      if (settleCandidates.length > 0) {
        const dest = settleCandidates[0];
        if (dest.setResident(new PoreCell(spore.safe, spore.energy, spore.matter, spore.generation))) {
          pore.setSpore(null);
          continue;
        }
      }

      const driftCandidates = pore.coord.getPlanarNeighbors()
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.isAqueous() && !p.hasSpore());

      if (driftCandidates.length > 0) {
        const dest = driftCandidates[Math.floor(this.prng.nextFloat() * driftCandidates.length)];
        dest.setSpore(spore);
        pore.setSpore(null);
      }
    }
  }

  private stepLysisAndScavenging(): void {
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (cell && cell.isDead()) {
        const snap = cell.getBattery().getSnapshot();
        this.ledger.recordHeatDissipation(snap.energy - Math.floor(snap.energy * 0.5));
        pore.triggerLysis();
      }
    }
    for (const pore of this.pores) {
      const cell = pore.getResident();
      if (!cell) continue;
      const carcasses = pore.coord.getPlanarNeighbors()
        .map(c => this.poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.getState() === PoreState.CARCASS);
      if (carcasses.length > 0) {
        const unharvested = carcasses[0].scavenge(cell);
        if (unharvested > 0) this.ledger.recordHeatDissipation(unharvested);
      }
    }
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
    let living = 0, carcass = 0, empty = 0, sporeCount = 0;
    let storedEnergy = 0, livingMatter = 0, carcassMatter = 0;
    const poreTelemetries: IPoreTelemetry[] = [];

    for (const pore of this.pores) {
      const isBasalt = (pore.coord.q === 0 && pore.coord.r === 0 && pore.coord.z === 0);
      const state = pore.getState();
      const cell = pore.getResident();
      let energy = 0, matter = 0, age = 0, gen = 0, catYield = 0, toggles = 0, active = false;
      let gateTypes: string[] = [], tape = '';

      if (cell) {
        living++;
        const snap = cell.getBattery().getSnapshot();
        energy = snap.energy; matter = snap.matter; age = cell.getAge(); gen = cell.getGeneration();
        const ws = cell.getWorkshop();
        const gates = ws.getGates();
        gateTypes = gates.map(g => g.type.replace('GATE_', ''));
        active = gates.length > 0 ? gates[gates.length - 1].output : false;
        tape = cell.getSafe().getTape(); storedEnergy += energy; livingMatter += matter;
      } else if (state === PoreState.CARCASS) {
        carcass++;
        const c = pore.getCarcass();
        if (c) { energy = c[0]; matter = c[1]; storedEnergy += energy; carcassMatter += matter; }
      } else {
        empty++;
      }

      if (pore.hasSpore()) {
        sporeCount++;
        const sp = pore.getSpore()!;
        storedEnergy += sp.energy; livingMatter += sp.matter;
      }

      poreTelemetries.push({
        coord: pore.coord, state, isBasalt, isAqueous: pore.isAqueous(),
        energy, matter, age, generation: gen, gateCount: gateTypes.length, gateTypes,
        hasSpore: pore.hasSpore(), tapeBitstring: tape, catalyticYield: catYield,
        toggleCount: toggles, primaryActive: active
      });
    }

    const vState = this.vent.evaluateAt(this.vent.nozzleCoord, this.tickCount);
    return {
      tick: this.tickCount, livingCount: living, carcassCount: carcass, emptyCount: empty,
      sporeCount, totalEnergyInUniverse: storedEnergy,
      ledger: this.ledger.auditBalance(storedEnergy, livingMatter, carcassMatter),
      vent: { nozzleCoord: this.vent.nozzleCoord, streamA: vState.streamA, streamB: vState.streamB, toxinT: vState.toxinT, thermalFlux: vState.thermalFlux },
      pores: poreTelemetries, milestones: this.paleontologist.getMilestones()
    };
  }

  public triggerThermalSurge(amount: number = 200): void {
    this.ledger.recordEnergyInjection(amount);
    let charged = 0;
    const origin = this.poreMap.get(new HexCoord3D(0, 0, 0).toKey());
    if (origin && origin.getResident()) {
      charged = origin.getResident()!.getBattery().chargeEnergy(Math.min(50, amount));
    }
    const uncharged = amount - charged;
    if (uncharged > 0) this.ledger.recordHeatDissipation(uncharged);
  }

  public triggerExtinctionEvent(center: HexCoord3D, radius: number = 2): void {
    for (const pore of this.pores) {
      if (pore.coord.distanceTo(center) <= radius && pore.getResident()) {
        const snap = pore.getResident()!.getBattery().getSnapshot();
        this.ledger.recordHeatDissipation(snap.energy - Math.floor(snap.energy * 0.5));
        pore.triggerLysis();
      }
    }
  }

  public getPaleontologist(): DigitalPaleontologist { return this.paleontologist; }
  public getPore(coord: HexCoord3D): Pore | undefined { return this.poreMap.get(coord.toKey()); }
  public getAllPores(): readonly Pore[] { return this.pores; }
  public getTickCount(): number { return this.tickCount; }
  public setMutationRate(rate: number): void { this.mutationRate = Math.max(0, Math.min(1, rate)); }
  public getMutationRate(): number { return this.mutationRate; }
}
