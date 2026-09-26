/**
 * 🐠 Siliquarium Physics Subsystem
 * ThermodynamicLedger: Closed-Universe Conservation Audit.
 * Strictly verifies zero energy leaks (Tolerance = 0.000) and absolute mass balance.
 */

export interface ILedgerReport {
  readonly totalEnergyInjected: number;
  readonly totalEnergyStored: number;
  readonly totalEnergyBurnedLandauer: number;
  readonly totalEnergyDissipatedHeat: number;
  readonly energyBalanceDelta: number;
  readonly isEnergyConserved: boolean;

  readonly totalMatterInjected: number;
  readonly totalMatterLiving: number;
  readonly totalMatterCarcasses: number;
  readonly totalMatterSediment: number;
  readonly matterBalanceDelta: number;
  readonly isMatterConserved: boolean;
}

export class ThermodynamicLedger {
  private totalEnergyInjected: number = 0;
  private totalEnergyBurnedLandauer: number = 0;
  private totalEnergyDissipatedHeat: number = 0;

  private totalMatterInjected: number = 0;
  private totalMatterSediment: number = 0;

  public recordEnergyInjection(amount: number): void {
    if (amount > 0) this.totalEnergyInjected += amount;
  }

  public recordLandauerBurn(amount: number): void {
    if (amount > 0) this.totalEnergyBurnedLandauer += amount;
  }

  public recordHeatDissipation(amount: number): void {
    if (amount > 0) this.totalEnergyDissipatedHeat += amount;
  }

  public recordMatterInjection(amount: number): void {
    if (amount > 0) this.totalMatterInjected += amount;
  }

  public recordMatterSedimentation(amount: number): void {
    if (amount > 0) this.totalMatterSediment += amount;
  }

  public auditBalance(currentStoredEnergy: number, currentLivingMatter: number, currentCarcassMatter: number): ILedgerReport {
    const totalAccountedEnergy = currentStoredEnergy + this.totalEnergyBurnedLandauer + this.totalEnergyDissipatedHeat;
    const energyDelta = Math.abs(this.totalEnergyInjected - totalAccountedEnergy);

    const totalAccountedMatter = currentLivingMatter + currentCarcassMatter + this.totalMatterSediment;
    const matterDelta = Math.abs(this.totalMatterInjected - totalAccountedMatter);

    return {
      totalEnergyInjected: this.totalEnergyInjected,
      totalEnergyStored: currentStoredEnergy,
      totalEnergyBurnedLandauer: this.totalEnergyBurnedLandauer,
      totalEnergyDissipatedHeat: this.totalEnergyDissipatedHeat,
      energyBalanceDelta: energyDelta,
      isEnergyConserved: energyDelta === 0,

      totalMatterInjected: this.totalMatterInjected,
      totalMatterLiving: currentLivingMatter,
      totalMatterCarcasses: currentCarcassMatter,
      totalMatterSediment: this.totalMatterSediment,
      matterBalanceDelta: matterDelta,
      isMatterConserved: matterDelta === 0
    };
  }
}
