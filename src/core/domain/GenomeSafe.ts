/**
 * 🐠 Siliquarium Domain Subsystem
 * GenomeSafe: The Epistemic Cut Symbolic Storage Container.
 * Holds inert 1D genome bitstring. Never executes or mutates during cellular lifetime.
 */

import { IPrng } from '../prng/SeedablePrng.js';

export class GenomeSafe {
  public static readonly DEFAULT_MUTATION_RATE = 0.001; // 0.1% per bit
  private readonly tape: string;

  constructor(tape: string) {
    this.tape = GenomeSafe.sanitizeTape(tape);
  }

  public getTape(): string {
    return this.tape;
  }

  public getBit(index: number): 0 | 1 {
    return this.tape.charAt(index) === '1' ? 1 : 0;
  }

  public length(): number {
    return this.tape.length;
  }

  /**
   * Blind template photocopy into a child safe.
   * Driven by abiotic surface templating physics (e.g. montmorillonite clay).
   * Operates completely blind to environmental or metabolic state.
   */
  public photocopy(prng: IPrng, mutationRate: number = GenomeSafe.DEFAULT_MUTATION_RATE): GenomeSafe {
    const chars = this.tape.split('');
    const rate = Math.max(0, Math.min(1, mutationRate));

    for (let i = 0; i < chars.length; i++) {
      if (prng.nextFloat() < rate) {
        // Blind unguided bit-flip
        chars[i] = chars[i] === '1' ? '0' : '1';
      }
    }

    return new GenomeSafe(chars.join(''));
  }

  private static sanitizeTape(raw: string): string {
    const cleaned = raw.replace(/[^01]/g, '');
    if (cleaned.length === 60) {
      return cleaned;
    }
    if (cleaned.length > 60) {
      return cleaned.slice(0, 60);
    }
    return cleaned.padEnd(60, '0');
  }

  public static createRandom(prng: IPrng): GenomeSafe {
    let bits = '';
    for (let i = 0; i < 60; i++) {
      bits += prng.nextBit() === 1 ? '1' : '0';
    }
    return new GenomeSafe(bits);
  }

  public hammingDistanceTo(other: GenomeSafe): number {
    let dist = 0;
    const len = Math.min(this.tape.length, other.tape.length);
    for (let i = 0; i < len; i++) {
      if (this.tape.charAt(i) !== other.tape.charAt(i)) {
        dist++;
      }
    }
    return dist;
  }
}
