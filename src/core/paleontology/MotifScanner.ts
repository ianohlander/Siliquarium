/**
 * 🐠 Siliquarium Paleontology Subsystem
 * MotifScanner: Scans active phenotypic netlists for Uri Alon Network Motifs.
 * Purely descriptive external voltmeter with zero simulation smuggling.
 */

import { PoreWorkshop } from '../domain/PoreWorkshop.js';
import { CodonType } from '../codons/CodonTable.js';
import { MotifType, IMotifDefinition, NetworkMotifRegistry } from './NetworkMotif.js';

export interface IMotifMatch {
  readonly motif: IMotifDefinition;
  readonly involvedGateIds: readonly number[];
  readonly confidence: number;
}

export class MotifScanner {
  public static scanWorkshop(workshop: PoreWorkshop): IMotifMatch[] {
    const gates = workshop.getGates();
    if (gates.length === 0) return [];

    const matches: IMotifMatch[] = [];

    const halfAdder = MotifScanner.detectHalfAdder(gates);
    if (halfAdder) matches.push(halfAdder);

    const ringOsc = MotifScanner.detectRingOscillator(gates);
    if (ringOsc) matches.push(ringOsc);

    const bistable = MotifScanner.detectBistableLatch(gates);
    if (bistable) matches.push(bistable);

    const cffl = MotifScanner.detectCoherentFFL(gates);
    if (cffl) matches.push(cffl);

    const iffl = MotifScanner.detectIncoherentFFL(gates);
    if (iffl) matches.push(iffl);

    const autoReg = MotifScanner.detectAutoregulation(gates);
    if (autoReg) matches.push(autoReg);

    return matches;
  }

  private static detectHalfAdder(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    const hasXor = gates.some(g => g.type === CodonType.GATE_XOR);
    const hasAnd = gates.some(g => g.type === CodonType.GATE_AND);

    if (hasXor && hasAnd) {
      const ids = gates.filter(g => g.type === CodonType.GATE_XOR || g.type === CodonType.GATE_AND).map(g => g.id);
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.HALF_ADDER),
        involvedGateIds: ids,
        confidence: 0.95
      };
    }
    return null;
  }

  private static detectRingOscillator(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    const notGates = gates.filter(g => g.type === CodonType.GATE_NOT);
    if (notGates.length >= 3 && notGates.length % 2 === 1) {
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.RING_OSCILLATOR),
        involvedGateIds: notGates.map(g => g.id),
        confidence: 0.90
      };
    }
    return null;
  }

  private static detectBistableLatch(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    // Cross-coupled memory motif (e.g. 2 NOR/NAND or complementary gates with >= 2 gates)
    if (gates.length >= 2 && gates.some(g => g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR)) {
      const hasFeedback = gates.some(g => g.type === CodonType.GATE_NOT);
      if (hasFeedback) {
        return {
          motif: NetworkMotifRegistry.getDefinition(MotifType.BISTABLE_LATCH),
          involvedGateIds: [gates[0].id, gates[1].id],
          confidence: 0.85
        };
      }
    }
    return null;
  }

  private static detectCoherentFFL(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    const andCount = gates.filter(g => g.type === CodonType.GATE_AND).length;
    const bufCount = gates.filter(g => g.type === CodonType.GATE_BUF || g.type === CodonType.GATE_OR).length;
    if (andCount >= 1 && bufCount >= 1) {
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.COHERENT_FFL),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.80
      };
    }
    return null;
  }

  private static detectIncoherentFFL(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    const hasAnd = gates.some(g => g.type === CodonType.GATE_AND);
    const hasNot = gates.some(g => g.type === CodonType.GATE_NOT);
    if (hasAnd && hasNot && gates.length >= 3) {
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.INCOHERENT_FFL),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.80
      };
    }
    return null;
  }

  private static detectAutoregulation(gates: readonly { type: CodonType; id: number }[]): IMotifMatch | null {
    if (gates.length === 1 && gates[0].type === CodonType.GATE_NOT) {
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.NEGATIVE_AUTOREGULATION),
        involvedGateIds: [gates[0].id],
        confidence: 0.85
      };
    }
    return null;
  }
}
