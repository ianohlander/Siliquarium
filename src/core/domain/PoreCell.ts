/**
 * 🐠 Siliquarium Domain Subsystem
 * PoreCell: Composed Digital Organism Entity.
 * Integrates GenomeSafe (The Safe), PoreWorkshop (The Workshop), and PoreBattery (The Pantry).
 */

import { GenomeSafe } from './GenomeSafe.js';
import { PoreBattery } from './PoreBattery.js';
import { PoreWorkshop, IWorkshopTelemetry } from './PoreWorkshop.js';
import { CodonTranslator } from '../codons/CodonTranslator.js';
import { IPrng } from '../prng/SeedablePrng.js';

export interface ICellTickResult {
  readonly age: number;
  readonly energy: number;
  readonly matter: number;
  readonly telemetry: IWorkshopTelemetry;
  readonly energyCharged: number;
  readonly energyOverflow: number;
  readonly landauerBurned: number;
  readonly basalLeak: number;
  readonly isStarved: boolean;
  readonly canDivide: boolean;
}

export class PoreCell {
  private readonly safe: GenomeSafe;
  private readonly battery: PoreBattery;
  private readonly workshop: PoreWorkshop;
  private age: number = 0;
  private readonly generation: number;

  constructor(
    safe: GenomeSafe,
    initialEnergy: number = 50,
    initialMatter: number = 20,
    generation: number = 0
  ) {
    this.safe = safe;
    this.generation = generation;
    this.battery = new PoreBattery(initialEnergy, initialMatter);
    this.workshop = new PoreWorkshop();

    // Birth translation: translate inert tape into workshop netlist
    const translation = CodonTranslator.translateTape(this.safe.getTape());
    this.workshop.assembleFromTranslation(translation);
  }

  public tick(streamA: boolean, streamB: boolean, toxinT: boolean): ICellTickResult {
    this.age++;

    // Step workshop logic and measure Landauer toggle switching
    const telemetry = this.workshop.stepTick(streamA, streamB, toxinT);

    // Charge battery from catalytic yield
    let energyCharged = 0;
    let energyOverflow = 0;
    if (telemetry.catalyticYield > 0) {
      energyCharged = this.battery.chargeEnergy(telemetry.catalyticYield);
      energyOverflow = telemetry.catalyticYield - energyCharged;
    }

    // Burn Landauer power for gate toggles
    let landauerBurned = this.battery.burnLandauer(telemetry.toggleCount);

    // Apply toxin corrosion if hit
    if (telemetry.toxinIngested) {
      landauerBurned += this.battery.burnLandauer(PoreWorkshop.TOXIN_CORROSION_PENALTY);
    }

    // Basal leak: 1 token every 10 ticks
    let basalLeak = 0;
    if (this.age % 10 === 0) {
      basalLeak = this.battery.dissipateBasalLeak(1);
    }

    return {
      age: this.age,
      energy: this.battery.getEnergy(),
      matter: this.battery.getMatter(),
      telemetry,
      energyCharged,
      energyOverflow,
      landauerBurned,
      basalLeak,
      isStarved: this.battery.isStarved(),
      canDivide: this.battery.isDivisionReady()
    };
  }

  public isDead(): boolean {
    return this.battery.isStarved();
  }

  public isDivisionReady(): boolean {
    return this.battery.isDivisionReady();
  }

  public reproduce(prng: IPrng, mutationRate: number = GenomeSafe.DEFAULT_MUTATION_RATE): PoreCell {
    const { childEnergy, childMatter } = this.battery.splitForReproduction();
    const childSafe = this.safe.photocopy(prng, mutationRate);
    return new PoreCell(childSafe, childEnergy, childMatter, this.generation + 1);
  }

  public getSafe(): GenomeSafe {
    return this.safe;
  }

  public getBattery(): PoreBattery {
    return this.battery;
  }

  public getWorkshop(): PoreWorkshop {
    return this.workshop;
  }

  public getAge(): number {
    return this.age;
  }

  public getGeneration(): number {
    return this.generation;
  }
}
