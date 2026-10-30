/**
 * 🐠 Siliquarium Paleontology Subsystem
 * MotifScanner: Scans active phenotypic netlists for Uri Alon Network Motifs.
 * Purely descriptive external voltmeter with zero simulation smuggling.
 */

import { PoreWorkshop, IGateNode } from '../domain/PoreWorkshop.js';
import { CodonType } from '../codons/CodonTable.js';
import { IOperon } from '../codons/CodonTranslator.js';
import { IMotifDefinition } from './NetworkMotif.js';
import { CanonicalMotifDetector } from './CanonicalMotifDetector.js';
import { AdaptiveMotifDetector } from './AdaptiveMotifDetector.js';

export interface IMotifMatch {
  readonly motif: IMotifDefinition;
  readonly involvedGateIds: readonly number[];
  readonly confidence: number;
}

export interface IWorkshopScanTarget {
  getBuiltGates?(): readonly IGateNode[];
  getGates?(): readonly IGateNode[];
  toBitstring?(): string;
  getOperons?(): readonly IOperon[];
  getOperonStates?(): readonly boolean[];
}

export class MotifScanner {
  public static scanWorkshop(workshop: PoreWorkshop | IWorkshopScanTarget): IMotifMatch[] {
    const rawGates = typeof workshop.getBuiltGates === 'function'
      ? workshop.getBuiltGates()
      : (typeof workshop.getGates === 'function' ? workshop.getGates() : []);
    const gates = rawGates.filter(g => g.isExpressed !== false);
    if (gates.length === 0) return [];

    const tape = typeof workshop.toBitstring === 'function' ? workshop.toBitstring() : '';

    const expressedPorins = new Set<CodonType>();
    const expressedSinks = new Set<CodonType>();
    let expressedOperonCount = 0;

    if (tape.length > 0 && typeof workshop.getOperons === 'function') {
      const ops = workshop.getOperons();
      const opStates = typeof workshop.getOperonStates === 'function' ? workshop.getOperonStates() : [];
      for (let idx = 0; idx < ops.length; idx++) {
        if (opStates[idx] !== false) {
          expressedOperonCount++;
          for (const p of ops[idx].inputPorins) {
            expressedPorins.add(p.definition.type);
          }
          for (const s of ops[idx].sinkNodes) {
            expressedSinks.add(s.definition.type);
          }
        }
      }
      // A cell with zero expressed membrane porins cannot transduce environmental signals
      if (expressedPorins.size === 0) {
        return [];
      }
    }

    const matches: IMotifMatch[] = [];

    const halfAdder = CanonicalMotifDetector.detectHalfAdder(gates, tape);
    if (halfAdder) matches.push(halfAdder);

    const ringOsc = CanonicalMotifDetector.detectRingOscillator(gates, tape);
    if (ringOsc) matches.push(ringOsc);

    const bistable = CanonicalMotifDetector.detectBistableLatch(gates, tape);
    if (bistable) matches.push(bistable);

    const cffl = CanonicalMotifDetector.detectCoherentFFL(gates, tape);
    if (cffl) matches.push(cffl);

    const iffl = CanonicalMotifDetector.detectIncoherentFFL(gates);
    if (iffl) matches.push(iffl);

    const autoReg = CanonicalMotifDetector.detectAutoregulation(gates);
    if (autoReg) matches.push(autoReg);

    const chemotaxis = AdaptiveMotifDetector.detectTemporalDerivativeChemotaxis(
      gates,
      tape,
      expressedPorins,
      expressedOperonCount
    );
    if (chemotaxis) matches.push(chemotaxis);

    const pavlovian = AdaptiveMotifDetector.detectPredictivePavlovian(gates, tape, expressedPorins);
    if (pavlovian) matches.push(pavlovian);

    const pacemaker = AdaptiveMotifDetector.detectEntrainedPacemaker(gates, tape, expressedPorins);
    if (pacemaker) matches.push(pacemaker);

    const steiner = AdaptiveMotifDetector.detectSteinerVascularNetwork(
      gates,
      tape,
      expressedPorins,
      expressedSinks
    );
    if (steiner) matches.push(steiner);

    const dormancy = AdaptiveMotifDetector.detectCryptobioticDormancyClamp(
      gates,
      tape,
      expressedPorins,
      expressedOperonCount
    );
    if (dormancy) matches.push(dormancy);

    return matches;
  }

  /**
   * Bidirectional Hypercube Metric (BooleanGA Strategy 2.1):
   * Computes min(Hamming(V, T), Hamming(V, ~T)) normalized to [0, 1] potential,
   * recognizing that an inverted-phase Boolean response is 1 NOT codon away from exact phase.
   */
  public static computeBidirectionalHypercubePotential(
    actualVector: readonly boolean[],
    targetVector: readonly boolean[]
  ): number {
    const len = Math.min(actualVector.length, targetVector.length);
    if (len === 0) return 0;
    let directHits = 0;
    let invertedHits = 0;
    for (let i = 0; i < len; i++) {
      if (actualVector[i] === targetVector[i]) directHits++;
      else invertedHits++;
    }
    return Math.max(directHits, invertedHits) / len;
  }
}
