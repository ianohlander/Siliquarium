/**
 * 🐠 Siliquarium Paleontology Subsystem
 * CanonicalMotifDetector: Detection routines for classical Uri Alon network motifs and logic circuits.
 */

import { PoreWorkshop } from '../domain/PoreWorkshop.js';
import { CodonType } from '../codons/CodonTable.js';
import { MotifType, NetworkMotifRegistry } from './NetworkMotif.js';
import { IMotifMatch } from './MotifScanner.js';

export class CanonicalMotifDetector {
  public static detectHalfAdder(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = ''
  ): IMotifMatch | null {
    const andGates = gates.filter(g => g.type === CodonType.GATE_AND);
    const orGates = gates.filter(g => g.type === CodonType.GATE_OR);
    const notGates = gates.filter(g => g.type === CodonType.GATE_NOT);

    const hasCompositeXor = andGates.length >= 2 && orGates.length >= 1 && notGates.length >= 1;

    if (hasCompositeXor) {
      if (tape.length > 0) {
        const wTest = PoreWorkshop.fromBitstring(tape);
        const r00 = wTest.step(false, false, false).primaryOutput;
        const r01 = wTest.step(false, true, false).primaryOutput;
        const r10 = wTest.step(true, false, false).primaryOutput;
        const r11 = wTest.step(true, true, false).primaryOutput;
        if (!(!r00 && r01 && r10 && !r11)) {
          return null;
        }
      }
      const ids = [...andGates, ...orGates, ...notGates].map(g => g.id);
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.HALF_ADDER),
        involvedGateIds: ids,
        confidence: 0.95
      };
    }
    return null;
  }

  public static hasContiguousOddNotRun(
    gates: readonly { type: CodonType; id: number }[]
  ): readonly { type: CodonType; id: number }[] | null {
    let currentRun: { type: CodonType; id: number }[] = [];
    for (const g of gates) {
      if (g.type === CodonType.GATE_NOT) {
        currentRun.push(g);
      } else {
        if (currentRun.length >= 3 && currentRun.length % 2 === 1) {
          return currentRun;
        }
        currentRun = [];
      }
    }
    if (currentRun.length >= 3 && currentRun.length % 2 === 1) {
      return currentRun;
    }
    return null;
  }

  public static detectRingOscillator(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = ''
  ): IMotifMatch | null {
    const oddRun = CanonicalMotifDetector.hasContiguousOddNotRun(gates);
    if (oddRun) {
      if (tape.length > 0) {
        const wTest = PoreWorkshop.fromBitstring(tape);
        const outs: boolean[] = [];
        for (let t = 0; t < 8; t++) outs.push(wTest.step(false, false, false).primaryOutput);
        let alternations = 0;
        for (let i = 1; i < outs.length; i++) {
          if (outs[i] !== outs[i - 1]) alternations++;
        }
        if (alternations < 2) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.RING_OSCILLATOR),
        involvedGateIds: oddRun.map(g => g.id),
        confidence: 0.90
      };
    }
    return null;
  }

  public static detectBistableLatch(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = ''
  ): IMotifMatch | null {
    if (gates.length >= 2 && gates.some(g => g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR)) {
      if (tape.length > 0) {
        const wSet = PoreWorkshop.fromBitstring(tape);
        const setOut = wSet.step(true, true, false).primaryOutput;
        const holdAfterSet = setOut && wSet.step(false, false, false).primaryOutput && wSet.step(false, false, false).primaryOutput;
        wSet.step(false, false, true);
        const holdAfterReset = !wSet.step(false, false, false).primaryOutput && !wSet.step(false, false, false).primaryOutput;
        if (holdAfterSet && holdAfterReset) {
          return {
            motif: NetworkMotifRegistry.getDefinition(MotifType.BISTABLE_LATCH),
            involvedGateIds: [gates[0].id, gates[1].id],
            confidence: 0.85
          };
        }
        return null;
      }
      const hasFeedback = gates.some(g => g.type === CodonType.GATE_NOT) ||
        (gates[0].type === CodonType.GATE_AND && gates[1].type === CodonType.GATE_OR) ||
        (gates[0].type === CodonType.GATE_OR && gates[1].type === CodonType.GATE_AND);
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

  public static detectCoherentFFL(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = ''
  ): IMotifMatch | null {
    const andCount = gates.filter(g => g.type === CodonType.GATE_AND).length;
    const orCount = gates.filter(g => g.type === CodonType.GATE_OR).length;
    const notCount = gates.filter(g => g.type === CodonType.GATE_NOT).length;
    if (gates.length === 3 && andCount >= 1 && orCount >= 1 && notCount === 0) {
      if (tape.length > 0) {
        const wTest = PoreWorkshop.fromBitstring(tape);
        const lowOut = wTest.step(false, false, false).primaryOutput;
        const highOut = wTest.step(true, true, false).primaryOutput;
        if (lowOut === highOut) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.COHERENT_FFL),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.80
      };
    }
    return null;
  }

  public static detectIncoherentFFL(
    gates: readonly { type: CodonType; id: number }[]
  ): IMotifMatch | null {
    const hasAnd = gates.some(g => g.type === CodonType.GATE_AND);
    const hasOr = gates.some(g => g.type === CodonType.GATE_OR);
    const hasNot = gates.some(g => g.type === CodonType.GATE_NOT);
    const lastGate = gates[gates.length - 1];
    if (hasAnd && hasOr && hasNot && gates.length >= 3 && gates[0].type !== CodonType.GATE_NOT && lastGate.type !== CodonType.GATE_NOT) {
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.INCOHERENT_FFL),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.80
      };
    }
    return null;
  }

  public static detectAutoregulation(
    gates: readonly { type: CodonType; id: number }[]
  ): IMotifMatch | null {
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
