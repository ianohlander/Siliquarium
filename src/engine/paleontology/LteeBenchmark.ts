/**
 * 🐠 Siliquarium Paleontology Subsystem
 * LteeBenchmark: Long-Term Evolution Experiment Tracker & Clade Diversity Engine.
 * Measures clonal interference, Shannon diversity index, and evolutionary velocity.
 * Zero-DOM Mandate: 100% headless, fully testable in Node.js and Web Workers.
 */

export interface ILteeReport {
  readonly tick: number;
  readonly activeLivingCount: number;
  readonly activeSporeCount: number;
  readonly maxGeneration: number;
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
  readonly totalBirths: number;
  readonly totalDeaths: number;
  readonly evolutionaryVelocity: number; // Max generation per 100 ticks
}

export class LteeBenchmark {
  private totalBirths: number = 0;
  private totalDeaths: number = 0;
  private maxGenObserved: number = 0;

  public recordBirth(generation: number): void {
    this.totalBirths++;
    if (generation > this.maxGenObserved) {
      this.maxGenObserved = generation;
    }
  }

  public recordDeath(): void {
    this.totalDeaths++;
  }

  public computeMetrics(
    tick: number,
    livingCount: number,
    sporeCount: number,
    cells: readonly { generation: number; cladeFounderId: string }[]
  ): ILteeReport {
    const cladeCounts = new Map<string, number>();
    for (const c of cells) {
      cladeCounts.set(c.cladeFounderId, (cladeCounts.get(c.cladeFounderId) ?? 0) + 1);
      if (c.generation > this.maxGenObserved) {
        this.maxGenObserved = c.generation;
      }
    }

    const totalPop = cells.length;
    let shannon = 0;
    if (totalPop > 0) {
      for (const count of cladeCounts.values()) {
        const p = count / totalPop;
        if (p > 0) shannon -= p * Math.log(p);
      }
    }

    const velocity = tick > 0 ? (this.maxGenObserved / tick) * 100 : 0;

    return {
      tick,
      activeLivingCount: livingCount,
      activeSporeCount: sporeCount,
      maxGeneration: this.maxGenObserved,
      activeCladesCount: cladeCounts.size,
      shannonDiversity: Math.round(shannon * 1000) / 1000,
      totalBirths: this.totalBirths,
      totalDeaths: this.totalDeaths,
      evolutionaryVelocity: Math.round(velocity * 100) / 100
    };
  }

  public getMaxGeneration(): number {
    return this.maxGenObserved;
  }

  public getTotalBirths(): number {
    return this.totalBirths;
  }

  public getTotalDeaths(): number {
    return this.totalDeaths;
  }

  public reset(): void {
    this.totalBirths = 0;
    this.totalDeaths = 0;
    this.maxGenObserved = 0;
  }
}
