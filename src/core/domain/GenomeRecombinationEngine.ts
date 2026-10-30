/**
 * 🐠 Siliquarium Domain Subsystem
 * GenomeRecombinationEngine: Homologous Crossover & Chimeric Exon Shuffling.
 * Driven strictly by blind molecular recombination rules without teleological bias.
 */

import { IPrng } from '../prng/SeedablePrng.js';
import { GenomeSafe } from './GenomeSafe.js';

export class GenomeRecombinationEngine {
  /**
   * Modulo-6 Reading-Frame Aligned Homologous Crossover:
   * Recombines two parent genomes strictly on 6-bit codon boundaries, preventing
   * mid-codon frame-shift destruction.
   */
  public static crossoverModulo6(safeA: GenomeSafe, safeB: GenomeSafe, prng: IPrng): GenomeSafe {
    const codonsA: string[] = [];
    const codonsB: string[] = [];
    for (let i = 0; i < safeA.getCodonCount(); i++) codonsA.push(safeA.getCodon(i)!);
    for (let i = 0; i < safeB.getCodonCount(); i++) codonsB.push(safeB.getCodon(i)!);

    const minLen = Math.min(codonsA.length, codonsB.length);
    const cut1 = prng.nextInt(1, Math.max(1, minLen - 1));
    const cut2 = prng.nextInt(cut1, minLen);

    const childCodons = [
      ...codonsA.slice(0, cut1),
      ...codonsB.slice(cut1, cut2),
      ...codonsA.slice(cut2)
    ];
    return new GenomeSafe(childCodons.join(''));
  }

  /**
   * Walter Gilbert (1978) Exon Shuffling & Lynn Margulis Endosymbiotic Recombination:
   * Combines genetic modules strictly from donor genomes safeA and safeB.
   * Zero-Smuggling Guarantee (I_+ = 0): Never fabricates or injects hardcoded codons
   * that are absent from both parent genomes.
   */
  public static createChimeric(safeA: GenomeSafe, safeB: GenomeSafe): GenomeSafe {
    const tapeA = safeA.getTape();
    const tapeB = safeB.getTape();

    const codonsA: string[] = [];
    const codonsB: string[] = [];
    const numCodonsA = Math.floor(tapeA.length / GenomeSafe.BITS_PER_CODON);
    const numCodonsB = Math.floor(tapeB.length / GenomeSafe.BITS_PER_CODON);
    for (let i = 0; i < numCodonsA; i++) {
      codonsA.push(tapeA.slice(i * 6, (i + 1) * 6));
    }
    for (let i = 0; i < numCodonsB; i++) {
      codonsB.push(tapeB.slice(i * 6, (i + 1) * 6));
    }

    const resultCodons = [...codonsA];
    const maxCodons = Math.floor(GenomeSafe.SAFETY_MAX_BITS / GenomeSafe.BITS_PER_CODON);

    // Exon shuffling: accrete novel functional codons (gates, porins, or sinks) strictly from donor safeB
    for (const bCodon of codonsB) {
      const idx = parseInt(bCodon, 2);
      const isCodingExon = idx < 56; // Catalytic gates, porins, secretions, or energy/septum sinks
      if (isCodingExon && !resultCodons.includes(bCodon)) {
        // Replace a silent intron (56..59) if available, otherwise append exon cassette
        const intronIdx = resultCodons.findIndex(c => {
          const n = parseInt(c, 2);
          return n >= 56 && n <= 59;
        });
        if (intronIdx !== -1) {
          resultCodons[intronIdx] = bCodon;
        } else if (resultCodons.length < maxCodons) {
          resultCodons.push(bCodon);
        }
      }
    }

    return new GenomeSafe(resultCodons.join(''));
  }
}
