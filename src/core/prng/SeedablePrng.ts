/**
 * 🐠 Siliquarium PRNG Subsystem
 * Deterministic 32-bit PRNG (Mulberry32) for cross-platform scientific reproducibility.
 */

export interface IPrng {
  nextUint32(): number;
  nextFloat(): number;
  nextInt(min: number, max: number): number;
  nextBit(): 0 | 1;
  fork(): IPrng;
}

export class Mulberry32Prng implements IPrng {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number) {
    this.initialSeed = seed >>> 0;
    this.state = this.initialSeed;
  }

  public getInitialSeed(): number {
    return this.initialSeed;
  }

  public nextUint32(): number {
    let t = (this.state += 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  }

  public nextFloat(): number {
    return this.nextUint32() / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    if (min >= max) {
      return min;
    }
    const range = max - min + 1;
    return min + Math.floor(this.nextFloat() * range);
  }

  public nextBit(): 0 | 1 {
    return (this.nextUint32() & 1) as 0 | 1;
  }

  public fork(): Mulberry32Prng {
    return new Mulberry32Prng(this.nextUint32());
  }
}
