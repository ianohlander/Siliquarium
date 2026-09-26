/**
 * 🐠 Siliquarium Domain Subsystem
 * PoreBattery: Mineral Capacitance & Pyrophosphate Storage Entity.
 * Tracks discrete energy (E) and matter (M) tokens under strict conservation laws.
 */

export interface IBatterySnapshot {
  readonly energy: number;
  readonly matter: number;
  readonly capacity: number;
  readonly totalBurnedLandauer: number;
  readonly totalDissipatedLeak: number;
}

export class PoreBattery {
  public static readonly DEFAULT_CAPACITY = 100;
  public static readonly DIVISION_ENERGY_THRESHOLD = 100;
  public static readonly DIVISION_MATTER_THRESHOLD = 20;
  public static readonly LANDAUER_COST_PER_TOGGLE = 1;

  private energy: number;
  private matter: number;
  private readonly capacity: number;
  private totalBurnedLandauer: number = 0;
  private totalDissipatedLeak: number = 0;

  constructor(initialEnergy: number = 50, initialMatter: number = 20, capacity: number = PoreBattery.DEFAULT_CAPACITY) {
    this.capacity = Math.max(10, capacity);
    this.energy = Math.min(this.capacity, Math.max(0, initialEnergy));
    this.matter = Math.max(0, initialMatter);
  }

  public getEnergy(): number {
    return this.energy;
  }

  public getMatter(): number {
    return this.matter;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public chargeEnergy(amount: number): number {
    if (amount <= 0) return 0;
    const oldEnergy = this.energy;
    this.energy = Math.min(this.capacity, this.energy + amount);
    return this.energy - oldEnergy;
  }

  public addMatter(amount: number): void {
    if (amount > 0) {
      this.matter += amount;
    }
  }

  public spendMatter(amount: number): boolean {
    if (amount <= 0) return true;
    if (this.matter >= amount) {
      this.matter -= amount;
      return true;
    }
    return false;
  }

  public burnLandauer(gateToggleCount: number): number {
    if (gateToggleCount <= 0) return 0;
    const cost = gateToggleCount * PoreBattery.LANDAUER_COST_PER_TOGGLE;
    const burned = Math.min(this.energy, cost);
    this.energy -= burned;
    this.totalBurnedLandauer += burned;
    return burned;
  }

  public dissipateBasalLeak(leakAmount: number = 1): number {
    if (leakAmount <= 0) return 0;
    const dissipated = Math.min(this.energy, leakAmount);
    this.energy -= dissipated;
    this.totalDissipatedLeak += dissipated;
    return dissipated;
  }

  public isStarved(): boolean {
    return this.energy <= 0;
  }

  public isDivisionReady(): boolean {
    return (
      this.energy >= PoreBattery.DIVISION_ENERGY_THRESHOLD &&
      this.matter >= PoreBattery.DIVISION_MATTER_THRESHOLD
    );
  }

  public splitForReproduction(): { childEnergy: number; childMatter: number } {
    const childEnergy = Math.floor(this.energy / 2);
    const childMatter = Math.floor(this.matter / 2);
    this.energy -= childEnergy;
    this.matter -= childMatter;
    return { childEnergy, childMatter };
  }

  public getSnapshot(): IBatterySnapshot {
    return {
      energy: this.energy,
      matter: this.matter,
      capacity: this.capacity,
      totalBurnedLandauer: this.totalBurnedLandauer,
      totalDissipatedLeak: this.totalDissipatedLeak
    };
  }
}
