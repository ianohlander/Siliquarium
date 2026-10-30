/**
 * 🐠 Siliquarium Domain Subsystem
 * GenomeSafe: The Epistemic Cut Symbolic Storage Container.
 * Holds inert 1D genome bitstring. Never executes or mutates during cellular lifetime.
 */

import { IPrng } from '../prng/SeedablePrng.js';
import { GenomeRecombinationEngine } from './GenomeRecombinationEngine.js';

export class GenomeSafe {
  public static readonly DEFAULT_MUTATION_RATE = 0.001; // 0.1% per bit
  public static readonly DEFAULT_DUPLICATION_RATE = 0.005; // 0.5% per reproduction (Susumu Ohno gene duplication)
  public static readonly DEFAULT_DELETION_RATE = 0.005; // 0.5% per reproduction (Landauer thrift streamlining)
  public static readonly MIN_BITS = 36; // 6 codons: minimal viable genome
  public static readonly DEFAULT_BITS = 60; // 10 codons
  public static readonly SAFETY_MAX_BITS = 3072; // Software memory safety ceiling (512 codons); no artificial biological limit
  public static readonly MAX_BITS = 3072; // Backward-compatible alias for software safety ceiling
  public static readonly BITS_PER_CODON = 6;

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

  public getCodonCount(): number {
    return Math.floor(this.tape.length / GenomeSafe.BITS_PER_CODON);
  }

  public getCodon(index: number): string | null {
    if (index < 0 || index >= this.getCodonCount()) return null;
    const start = index * GenomeSafe.BITS_PER_CODON;
    return this.tape.slice(start, start + GenomeSafe.BITS_PER_CODON);
  }

  /**
   * Blind template photocopy into a child safe.
   * Driven by abiotic surface templating physics (e.g. montmorillonite clay).
   * Operates completely blind to environmental or metabolic state.
   * 
   * Supports:
   * 1. Susumu Ohno (1970) Gene Duplication (tandem duplication of 6-bit codons)
   * 2. Genomic Streamlining / Deletion (Landauer thrift)
   * 3. Point Mutations (single-bit substitutions)
   */
  public photocopy(
    prng: IPrng,
    mutationRate: number = GenomeSafe.DEFAULT_MUTATION_RATE,
    duplicationRate: number = 0,
    deletionRate: number = 0
  ): GenomeSafe {
    // 1. Extract existing 6-bit codons
    const codons: string[] = [];
    const numCodons = Math.floor(this.tape.length / GenomeSafe.BITS_PER_CODON);
    for (let i = 0; i < numCodons; i++) {
      codons.push(this.tape.slice(i * GenomeSafe.BITS_PER_CODON, (i + 1) * GenomeSafe.BITS_PER_CODON));
    }

    // 2. Tandem Gene Duplication (Susumu Ohno 1970)
    // Duplicates a randomly chosen codon in tandem, increasing genome length and complexity capacity
    // Genomes can grow to arbitrary lengths without artificial restrictions
    if (duplicationRate > 0 && prng.nextFloat() < duplicationRate && codons.length < (GenomeSafe.SAFETY_MAX_BITS / GenomeSafe.BITS_PER_CODON)) {
      const dupIdx = Math.floor(prng.nextFloat() * codons.length);
      const dupCodon = codons[dupIdx];
      codons.splice(dupIdx + 1, 0, dupCodon);
    }

    // 3. Genomic Streamlining / Deletion (Landauer Thrift)
    // Deletes a codon if exceeding minimum length, reducing dynamic switching and maintenance costs
    if (deletionRate > 0 && prng.nextFloat() < deletionRate && codons.length > (GenomeSafe.MIN_BITS / GenomeSafe.BITS_PER_CODON)) {
      const delIdx = Math.floor(prng.nextFloat() * codons.length);
      codons.splice(delIdx, 1);
    }

    // 4. Point Mutations (Single-Bit Substitutions)
    const chars = codons.join('').split('');
    const rate = Math.max(0, Math.min(1, mutationRate));

    for (let i = 0; i < chars.length; i++) {
      if (prng.nextFloat() < rate) {
        chars[i] = chars[i] === '1' ? '0' : '1';
      }
    }

    return new GenomeSafe(chars.join(''));
  }

  private static sanitizeTape(raw: string): string {
    let cleaned = raw.replace(/[^01]/g, '');
    const rem = cleaned.length % GenomeSafe.BITS_PER_CODON;
    if (rem !== 0) {
      cleaned = cleaned.slice(0, cleaned.length - rem);
    }
    while (cleaned.length < GenomeSafe.MIN_BITS) {
      cleaned += '111000'; // Codon 56 = INTRON_SILENT
    }
    if (cleaned.length > GenomeSafe.SAFETY_MAX_BITS) {
      cleaned = cleaned.slice(0, GenomeSafe.SAFETY_MAX_BITS);
    }
    return cleaned;
  }

  public static createRandom(prng: IPrng, codonCount: number = 10): GenomeSafe {
    const totalBits = Math.max(GenomeSafe.MIN_BITS, Math.min(GenomeSafe.SAFETY_MAX_BITS, codonCount * GenomeSafe.BITS_PER_CODON));
    let bits = '';
    for (let i = 0; i < totalBits; i++) {
      bits += prng.nextBit() === 1 ? '1' : '0';
    }
    return new GenomeSafe(bits);
  }

  /**
   * John W. Drake (1991) Law of Mutational Invariance:
   * Scales per-bit mutation rate inversely with genome length beyond the 60-bit baseline
   * so expanded poly-operon genomes avoid Manfred Eigen's Error Catastrophe threshold.
   */
  public static computeDrakeMutationRate(baseRate: number, genomeLengthBits: number): number {
    if (genomeLengthBits <= GenomeSafe.DEFAULT_BITS) return baseRate;
    const drakeScaled = baseRate * (GenomeSafe.DEFAULT_BITS / Math.max(GenomeSafe.DEFAULT_BITS, genomeLengthBits));
    return Math.min(baseRate, drakeScaled);
  }

  /**
   * Prebiotic Primordial Soup Initializer:
   * Generates ancestral Generation 0 protocells by sampling uniformly across all 64
   * degenerate codons without teleological censorship.
   */
  public static createPrebioticSoup(prng: IPrng, codonCount: number = 10): GenomeSafe {
    const totalCodons = Math.max(
      Math.floor(GenomeSafe.MIN_BITS / GenomeSafe.BITS_PER_CODON),
      Math.min(Math.floor(GenomeSafe.SAFETY_MAX_BITS / GenomeSafe.BITS_PER_CODON), codonCount)
    );
    let bits = '';
    for (let c = 0; c < totalCodons; c++) {
      const codonIndex = prng.nextInt(0, 63);
      bits += codonIndex.toString(2).padStart(GenomeSafe.BITS_PER_CODON, '0');
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
    dist += Math.abs(this.tape.length - other.tape.length);
    return dist;
  }

  /**
   * Barbara McClintock (1950) Transposable Element Operator:
   * Mobilizes a 1..3 codon cassette via cut-and-paste or copy-and-paste transposition
   * strictly aligned to 6-bit codon reading frames.
   */
  public translocateCassette(prng: IPrng, copyMode: boolean = false): GenomeSafe {
    const codons: string[] = [];
    const numCodons = this.getCodonCount();
    for (let i = 0; i < numCodons; i++) {
      codons.push(this.tape.slice(i * 6, (i + 1) * 6));
    }
    if (codons.length < 3) return new GenomeSafe(this.tape);

    const span = Math.min(prng.nextInt(1, 2), codons.length - 1);
    const srcIdx = prng.nextInt(0, codons.length - span);
    const cassette = codons.slice(srcIdx, srcIdx + span);

    if (!copyMode) {
      codons.splice(srcIdx, span);
    } else if (codons.length + span > GenomeSafe.SAFETY_MAX_BITS / GenomeSafe.BITS_PER_CODON) {
      return new GenomeSafe(this.tape);
    }

    const dstIdx = prng.nextInt(0, codons.length);
    codons.splice(dstIdx, 0, ...cassette);
    return new GenomeSafe(codons.join(''));
  }

  /**
   * Theodosius Dobzhansky (1937) Chromosomal Inversion Operator:
   * Reverses the codon order of a contiguous sub-segment at 6-bit boundaries,
   * preserving codon reading frames while reorganizing operon epistatic linkage.
   */
  public invertSegment(prng: IPrng): GenomeSafe {
    const codons: string[] = [];
    const numCodons = this.getCodonCount();
    for (let i = 0; i < numCodons; i++) {
      codons.push(this.tape.slice(i * 6, (i + 1) * 6));
    }
    if (codons.length < 3) return new GenomeSafe(this.tape);

    const start = prng.nextInt(0, codons.length - 2);
    const end = prng.nextInt(start + 1, codons.length - 1);
    const segment = codons.slice(start, end + 1).reverse();
    codons.splice(start, segment.length, ...segment);
    return new GenomeSafe(codons.join(''));
  }

  /**
   * Susumu Ohno (1970) & Force et al. (1999) DDC Multi-Codon Operon Cassette Duplication:
   * Duplicates a contiguous 2..4 codon functional domain in tandem and optionally applies
   * a complementary degenerative/subfunctionalizing point mutation to one paralog copy.
   */
  public duplicateOperonCassette(prng: IPrng, applyDdcDivergence: boolean = true): GenomeSafe {
    const codons: string[] = [];
    const numCodons = this.getCodonCount();
    for (let i = 0; i < numCodons; i++) {
      codons.push(this.tape.slice(i * 6, (i + 1) * 6));
    }
    const maxCodons = Math.floor(GenomeSafe.SAFETY_MAX_BITS / GenomeSafe.BITS_PER_CODON);
    const span = Math.min(prng.nextInt(2, 3), codons.length, maxCodons - codons.length);
    if (span <= 0) return new GenomeSafe(this.tape);

    const startIdx = prng.nextInt(0, codons.length - span);
    const paralogCassette = codons.slice(startIdx, startIdx + span);

    if (applyDdcDivergence && paralogCassette.length > 0) {
      const targetCodonIdx = prng.nextInt(0, paralogCassette.length - 1);
      const bitIdx = prng.nextInt(0, 5);
      const chars = paralogCassette[targetCodonIdx].split('');
      chars[bitIdx] = chars[bitIdx] === '1' ? '0' : '1';
      paralogCassette[targetCodonIdx] = chars.join('');
    }

    codons.splice(startIdx + span, 0, ...paralogCassette);
    return new GenomeSafe(codons.join(''));
  }

  /**
   * Modulo-6 Reading-Frame Aligned Homologous Crossover:
   * Recombines two parent genomes strictly on 6-bit codon boundaries, preventing
   * mid-codon frame-shift destruction.
   */
  public static crossoverModulo6(safeA: GenomeSafe, safeB: GenomeSafe, prng: IPrng): GenomeSafe {
    return GenomeRecombinationEngine.crossoverModulo6(safeA, safeB, prng);
  }

  /**
   * Walter Gilbert (1978) Exon Shuffling & Lynn Margulis Endosymbiotic Recombination:
   * Combines genetic modules strictly from donor genomes safeA and safeB.
   * Zero-Smuggling Guarantee (I_+ = 0): Never fabricates or injects hardcoded codons
   * that are absent from both parent genomes.
   */
  public static createChimeric(safeA: GenomeSafe, safeB: GenomeSafe): GenomeSafe {
    return GenomeRecombinationEngine.createChimeric(safeA, safeB);
  }
}
